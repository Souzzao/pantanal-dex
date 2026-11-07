import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { SUPABASE_CONFIG, supabase } from "@/lib/supabase";
import type { Sighting } from "@/shared/pantanal";
import {
  applyFlushResult,
  createFeedQueue,
  enqueue,
  FEED_QUEUE_KEY,
  FEED_REJECTIONS_KEY,
  fetchMyPublications,
  fetchPublicFeed,
  flushQueue,
  friendlyRejection,
  photoPathFor,
  restoreFeedQueue,
  type FeedOperation,
  type FeedQueue,
  type FetchLike,
  type MyPublication,
} from "@/shared/public-feed";
import {
  createPublicationStore,
  DEFAULT_PUBLIC_DURATION,
  diffPublicNotebook,
  endPublication,
  prunePublications,
  publishSighting,
  restorePublicationStore,
  serializePublicationStore,
  type PublicationStore,
  type PublicDurationId,
  type PublicRecord,
} from "@/shared/public-map";

/** Chave própria (por conta): não altera o caderno (`Sighting`) nem a gravação do UC06. */
export const PUBLICATIONS_KEY = "pantanal-dex:public-publications-v1";

export type FeedStatus = "off" | "loading" | "online" | "offline";
/**
 * Situação de uma publicação desta conta:
 * local (sem servidor) · sending (na fila) · error (servidor recusou o envio) ·
 * review (aguardando auditor) · approved (no mapa de todos) · rejected (auditor reprovou).
 */
export type RemoteStatus = "local" | "sending" | "error" | "review" | "approved" | "rejected";

type PublicationsContextValue = {
  store: PublicationStore;
  ready: boolean;
  writeError: boolean;
  publish: (sightingId: string, duration: PublicDurationId) => Promise<void>;
  end: (sightingId: string) => Promise<void>;
  /** Registros públicos de outras pessoas vindos do servidor (vazio quando o servidor está desligado). */
  remoteRecords: PublicRecord[];
  feedStatus: FeedStatus;
  pendingCount: number;
  lastSyncAt: string | null;
  refreshFeed: () => Promise<void>;
  remoteStatus: (sightingId: string) => RemoteStatus;
  /** Motivo: recusa do envio (status "error") ou justificativa do auditor (status "rejected"). */
  rejectionFor: (sightingId: string) => string | null;
};

const PublicationsContext = createContext<PublicationsContextValue | null>(null);

/** Envia a foto do avistamento para o Storage (só o dono e os auditores veem). */
async function uploadPhoto(userId: string, localId: string, uri: string): Promise<string | null> {
  if (!supabase) return null;
  const path = photoPathFor(userId, localId);
  const response = await fetch(uri);
  const body = await response.arrayBuffer();
  const { error } = await supabase.storage.from("sighting-photos").upload(path, body, { contentType: "image/jpeg", upsert: true });
  if (error) throw error;
  return path;
}

export function PublicationsProvider({ children }: { children: React.ReactNode }) {
  const { sightings, ready: notebookReady, storage } = useApp();
  const { account, getAccessToken } = useAuth();
  const userId = account?.id ?? null;
  const serverOn = Boolean(SUPABASE_CONFIG && userId);
  const scoped = useCallback((key: string) => (userId ? `${key}:${userId}` : key), [userId]);
  // Só limpa publicações órfãs quando o caderno foi lido sem erro (não apagar por falha de leitura).
  const notebookHealthy = !storage.readError && storage.sightings !== "corrupted" && storage.sightings !== "unsupported-version";
  const [store, setStore] = useState<PublicationStore>(createPublicationStore);
  const [ready, setReady] = useState(false);
  const [writeError, setWriteError] = useState(false);
  const current = useRef<PublicationStore>(createPublicationStore());
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const knownSignatures = useRef<Map<string, string | null> | null>(null);
  const sightingsRef = useRef<Sighting[]>(sightings);
  sightingsRef.current = sightings;

  // Estado do servidor
  const feedQueue = useRef<FeedQueue>(createFeedQueue());
  const [pendingCount, setPendingCount] = useState(0);
  const [remoteRecords, setRemoteRecords] = useState<PublicRecord[]>([]);
  const [mine, setMine] = useState<Record<string, MyPublication>>({});
  const [feedStatus, setFeedStatus] = useState<FeedStatus>(serverOn ? "loading" : "off");
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [rejections, setRejections] = useState<Record<string, string>>({});
  const rejectionsRef = useRef<Record<string, string>>({});
  const syncing = useRef(false);
  /** Pedido de sincronização que chegou durante outra; roda de novo no fim. */
  const resyncRequested = useRef(false);
  const syncRef = useRef<() => Promise<void>>(async () => undefined);

  useEffect(() => {
    let mounted = true;
    (async () => {
      let raw: string | null = null;
      let rawQueue: string | null = null;
      let rawRejections: string | null = null;
      try {
        [raw, rawQueue, rawRejections] = await Promise.all([AsyncStorage.getItem(scoped(PUBLICATIONS_KEY)), AsyncStorage.getItem(scoped(FEED_QUEUE_KEY)), AsyncStorage.getItem(scoped(FEED_REJECTIONS_KEY))]);
      } catch {
        raw = null;
      }
      if (!mounted) return;
      const restored = restorePublicationStore(raw).store;
      current.current = restored;
      feedQueue.current = restoreFeedQueue(rawQueue);
      setPendingCount(feedQueue.current.operations.length);
      try {
        const parsed = rawRejections ? (JSON.parse(rawRejections) as unknown) : {};
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          rejectionsRef.current = Object.fromEntries(Object.entries(parsed as Record<string, unknown>).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
          setRejections(rejectionsRef.current);
        }
      } catch {
        // Lixo no armazenamento: começa sem recusas.
      }
      setStore(restored);
      setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, [scoped]);

  const saveFeedQueue = useCallback(async (next: FeedQueue) => {
    feedQueue.current = next;
    setPendingCount(next.operations.length);
    await AsyncStorage.setItem(scoped(FEED_QUEUE_KEY), JSON.stringify(next)).catch(() => undefined);
  }, [scoped]);

  const saveRejections = useCallback((change: (previous: Record<string, string>) => Record<string, string>) => {
    const next = change(rejectionsRef.current);
    if (next === rejectionsRef.current) return;
    rejectionsRef.current = next;
    setRejections(next);
    void AsyncStorage.setItem(scoped(FEED_REJECTIONS_KEY), JSON.stringify(next)).catch(() => undefined);
  }, [scoped]);

  /**
   * Envia a fila (fotos primeiro) e baixa o mapa público e o resultado da auditoria.
   * Ações feitas durante um envio não se perdem: o resultado tira da fila só o que foi enviado,
   * e a fila é drenada de novo enquanto houver operações novas.
   */
  const sync = useCallback(async () => {
    if (!SUPABASE_CONFIG || !userId) return;
    if (syncing.current) {
      resyncRequested.current = true;
      return;
    }
    syncing.current = true;
    resyncRequested.current = false;
    let offline = false;
    const fetchImpl = fetch as unknown as FetchLike;
    try {
      const token = await getAccessToken();
      if (!token) {
        offline = true;
        setFeedStatus("offline");
        return;
      }
      for (let round = 0; round < 5 && feedQueue.current.operations.length; round += 1) {
        // Fotos ainda não enviadas sobem antes da publicação.
        for (const operation of feedQueue.current.operations) {
          if (operation.type !== "publish" || operation.payload.photoPath || !operation.photoUri) continue;
          try {
            const path = await uploadPhoto(userId, operation.localId, operation.photoUri);
            operation.payload = { ...operation.payload, photoPath: path };
          } catch {
            // Sem a foto, a publicação segue; o auditor decide com o que tiver.
            operation.photoUri = undefined;
          }
        }
        const batch = feedQueue.current.operations;
        const result = await flushQueue({ ...feedQueue.current, operations: batch }, SUPABASE_CONFIG, fetchImpl, token);
        await saveFeedQueue(applyFlushResult(feedQueue.current, batch, result.queue.operations));
        const confirmed = batch.filter((operation) => !result.queue.operations.includes(operation) && !result.rejected.some((item) => item.operation === operation));
        saveRejections((previous) => {
          let next = previous;
          for (const operation of confirmed) {
            if (next[operation.localId]) { next = { ...next }; delete next[operation.localId]; }
          }
          for (const { operation, message } of result.rejected) {
            if (operation.type === "publish") next = { ...next, [operation.localId]: message };
          }
          return next;
        });
        if (result.stoppedByNetwork) {
          offline = true;
          setFeedStatus("offline");
          return;
        }
      }
      const myPublications = await fetchMyPublications(SUPABASE_CONFIG, fetchImpl, token);
      setMine(Object.fromEntries(myPublications.map((item) => [item.localId, item])));
      const myIds = new Set(myPublications.map((item) => item.id));
      const records = await fetchPublicFeed(SUPABASE_CONFIG, fetchImpl, token, myIds);
      // Os registros desta conta já aparecem a partir do caderno local; do servidor vêm os das outras pessoas.
      setRemoteRecords(records.filter((item) => item.owner === "others"));
      setFeedStatus("online");
      setLastSyncAt(new Date().toISOString());
    } catch {
      offline = true;
      setFeedStatus("offline");
    } finally {
      syncing.current = false;
      if (resyncRequested.current && !offline) setTimeout(() => void syncRef.current(), 0);
    }
  }, [userId, getAccessToken, saveFeedQueue, saveRejections]);
  syncRef.current = sync;

  const queueRemote = useCallback(async (operations: FeedOperation[]) => {
    if (!serverOn || operations.length === 0) return;
    let next = feedQueue.current;
    for (const operation of operations) next = enqueue(next, operation);
    await saveFeedQueue(next);
    void sync();
  }, [serverOn, saveFeedQueue, sync]);

  const remotePublish = useCallback((sightingId: string, state: PublicationStore): FeedOperation | null => {
    const sighting = sightingsRef.current.find((item) => item.id === sightingId);
    const publication = state.items[sightingId];
    if (!sighting || !publication || publication.endedAt || typeof sighting.latitude !== "number" || typeof sighting.longitude !== "number") return null;
    return {
      type: "publish",
      localId: sightingId,
      queuedAt: new Date().toISOString(),
      photoUri: sighting.photoUri,
      payload: { speciesId: sighting.speciesId, date: sighting.date, time: sighting.time, latitude: sighting.latitude, longitude: sighting.longitude, notes: sighting.notes, photoPath: null, expiresAt: publication.expiresAt },
    };
  }, []);

  const remoteEnd = useCallback((sightingId: string): FeedOperation => ({ type: "end", localId: sightingId, queuedAt: new Date().toISOString() }), []);

  /** Grava em fila para que duas ações rápidas não sobrescrevam uma à outra. */
  const commit = useCallback((change: (previous: PublicationStore) => PublicationStore) => {
    const run = queue.current.then(async () => {
      const next = change(current.current);
      if (next === current.current) return next;
      try {
        await AsyncStorage.setItem(scoped(PUBLICATIONS_KEY), serializePublicationStore(next));
        current.current = next;
        setStore(next);
        setWriteError(false);
        return next;
      } catch (error) {
        setWriteError(true);
        throw error;
      }
    });
    queue.current = run.catch(() => undefined);
    return run;
  }, [scoped]);

  // Mantém o mapa público em dia com o caderno:
  //  - novos avistamentos compartilháveis são publicados com o prazo padrão;
  //  - apagados ou que viraram "Pessoal"/perderam a localização são encerrados (aqui e no servidor);
  //  - os que continuam públicos mas mudaram espécie/data/hora/local são atualizados no servidor.
  useEffect(() => {
    if (!ready || !notebookReady) return;
    const diff = diffPublicNotebook(knownSignatures.current, sightings);
    knownSignatures.current = diff.signatures;
    const ids = new Set(diff.signatures.keys());
    const removed = notebookHealthy ? diff.removed : [];
    let hadPublication: Set<string> = new Set();
    void commit((state) => {
      hadPublication = new Set([...diff.lost, ...removed].filter((id) => state.items[id] && !state.items[id].endedAt));
      let next = notebookHealthy ? prunePublications(state, ids) : state;
      const now = new Date();
      for (const id of diff.fresh) {
        if (!next.items[id]) next = publishSighting(next, id, DEFAULT_PUBLIC_DURATION, now);
      }
      for (const id of diff.lost) next = endPublication(next, id, now);
      return next;
    }).then((state) => {
      const operations = [
        ...diff.fresh.map((id) => remotePublish(id, state)),
        ...diff.changed.map((id) => remotePublish(id, state)),
        ...[...hadPublication].map((id) => remoteEnd(id)),
      ].filter((item): item is FeedOperation => item !== null);
      return queueRemote(operations);
    }).catch(() => undefined);
  }, [sightings, ready, notebookReady, notebookHealthy, commit, queueRemote, remotePublish, remoteEnd]);

  // Primeira sincronização assim que tudo carregar.
  useEffect(() => {
    if (ready && notebookReady && serverOn) void sync();
  }, [ready, notebookReady, serverOn, sync]);

  const remoteStatus = useCallback((sightingId: string): RemoteStatus => {
    if (!serverOn) return "local";
    if (feedQueue.current.operations.some((operation) => operation.localId === sightingId)) return "sending";
    if (rejections[sightingId]) return "error";
    const server = mine[sightingId];
    if (!server) return "sending";
    return server.status === "approved" ? "approved" : server.status === "rejected" ? "rejected" : "review";
    // pendingCount entra nas dependências para recalcular quando a fila muda.
  }, [serverOn, rejections, mine, pendingCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo<PublicationsContextValue>(() => ({
    store,
    ready,
    writeError,
    publish: async (sightingId, duration) => {
      const state = await commit((previous) => publishSighting(previous, sightingId, duration, new Date()));
      const operation = remotePublish(sightingId, state);
      if (operation) await queueRemote([operation]);
    },
    end: async (sightingId) => {
      await commit((previous) => endPublication(previous, sightingId, new Date()));
      saveRejections((previous) => {
        if (!previous[sightingId]) return previous;
        const next = { ...previous };
        delete next[sightingId];
        return next;
      });
      await queueRemote([remoteEnd(sightingId)]);
    },
    remoteRecords,
    feedStatus: serverOn ? feedStatus : "off",
    pendingCount,
    lastSyncAt,
    refreshFeed: sync,
    remoteStatus,
    rejectionFor: (sightingId) => {
      if (rejections[sightingId]) return friendlyRejection(rejections[sightingId]);
      const server = mine[sightingId];
      return server?.status === "rejected" ? server.reviewNote ?? null : null;
    },
  }), [store, ready, writeError, commit, remotePublish, remoteEnd, queueRemote, saveRejections, remoteRecords, serverOn, feedStatus, pendingCount, lastSyncAt, sync, remoteStatus, rejections, mine]);

  return <PublicationsContext.Provider value={value}>{children}</PublicationsContext.Provider>;
}

export function usePublications() {
  const context = useContext(PublicationsContext);
  if (!context) throw new Error("usePublications deve ser usado dentro de PublicationsProvider");
  return context;
}
