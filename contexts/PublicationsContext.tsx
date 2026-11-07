import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";

import { useApp } from "@/contexts/AppContext";
import type { Sighting } from "@/shared/pantanal";
import {
  applyFlushResult,
  createFeedQueue,
  enqueue,
  FEED_QUEUE_KEY,
  FEED_REJECTIONS_KEY,
  FEED_SECRET_KEY,
  fetchPublicFeed,
  flushQueue,
  generateDeviceSecret,
  publicIdFor,
  readFeedConfig,
  restoreFeedQueue,
  sightingIdFromPublicId,
  type FeedOperation,
  type FeedQueue,
  type FetchLike,
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
  toPublicRecord,
  type PublicationStore,
  type PublicDurationId,
  type PublicRecord,
} from "@/shared/public-map";

/** Chave própria: não altera o caderno (`Sighting`) nem a gravação do UC06. */
export const PUBLICATIONS_KEY = "pantanal-dex:public-publications-v1";

/** Servidor do mapa público: só liga quando as variáveis do `.env` existem (ver docs/SUPABASE-PASSO-A-PASSO.md). */
const FEED_CONFIG = readFeedConfig({
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
});

export type FeedStatus = "off" | "loading" | "online" | "offline";
/** Situação de uma publicação no servidor: só no aparelho (sem servidor), na fila, recusada ou enviada. */
export type RemoteStatus = "local" | "pending" | "rejected" | "synced";

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
  /** Situação no servidor de uma publicação deste aparelho. */
  remoteStatus: (sightingId: string) => RemoteStatus;
  /** Motivo da recusa pelo servidor (quando `remoteStatus` é "rejected"). */
  rejectionFor: (sightingId: string) => string | null;
};

const PublicationsContext = createContext<PublicationsContextValue | null>(null);

async function readSecret(): Promise<string> {
  const read = async () => (Platform.OS === "web" ? AsyncStorage.getItem(FEED_SECRET_KEY) : SecureStore.getItemAsync(FEED_SECRET_KEY));
  const write = async (value: string) => (Platform.OS === "web" ? AsyncStorage.setItem(FEED_SECRET_KEY, value) : SecureStore.setItemAsync(FEED_SECRET_KEY, value));
  const existing = await read().catch(() => null);
  if (existing && /^[0-9a-f]{64}$/.test(existing)) return existing;
  const created = generateDeviceSecret();
  await write(created);
  return created;
}

export function PublicationsProvider({ children }: { children: React.ReactNode }) {
  const { sightings, ready: notebookReady, storage } = useApp();
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
  const secret = useRef<string | null>(null);
  const feedQueue = useRef<FeedQueue>(createFeedQueue());
  const [pendingCount, setPendingCount] = useState(0);
  const [remoteRecords, setRemoteRecords] = useState<PublicRecord[]>([]);
  const [feedStatus, setFeedStatus] = useState<FeedStatus>(FEED_CONFIG ? "loading" : "off");
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
        [raw, rawQueue, rawRejections] = await Promise.all([AsyncStorage.getItem(PUBLICATIONS_KEY), AsyncStorage.getItem(FEED_QUEUE_KEY), AsyncStorage.getItem(FEED_REJECTIONS_KEY)]);
      } catch {
        raw = null;
      }
      if (FEED_CONFIG) secret.current = await readSecret().catch(() => null);
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
  }, []);

  const saveFeedQueue = useCallback(async (next: FeedQueue) => {
    feedQueue.current = next;
    setPendingCount(next.operations.length);
    await AsyncStorage.setItem(FEED_QUEUE_KEY, JSON.stringify(next)).catch(() => undefined);
  }, []);

  const saveRejections = useCallback((change: (previous: Record<string, string>) => Record<string, string>) => {
    const next = change(rejectionsRef.current);
    if (next === rejectionsRef.current) return;
    rejectionsRef.current = next;
    setRejections(next);
    void AsyncStorage.setItem(FEED_REJECTIONS_KEY, JSON.stringify(next)).catch(() => undefined);
  }, []);

  /**
   * Envia a fila e baixa o mapa público. Sem servidor configurado, não faz nada.
   * Ações feitas durante um envio não se perdem: o resultado tira da fila só o que foi enviado,
   * e a fila é drenada de novo enquanto houver operações novas.
   */
  const sync = useCallback(async () => {
    if (!FEED_CONFIG || !secret.current) return;
    if (syncing.current) {
      resyncRequested.current = true;
      return;
    }
    syncing.current = true;
    resyncRequested.current = false;
    let offline = false;
    const fetchImpl = fetch as unknown as FetchLike;
    try {
      for (let round = 0; round < 5 && feedQueue.current.operations.length; round += 1) {
        const batch = feedQueue.current.operations;
        const result = await flushQueue({ ...feedQueue.current, operations: batch }, FEED_CONFIG, fetchImpl, secret.current);
        await saveFeedQueue(applyFlushResult(feedQueue.current, batch, result.queue.operations));
        // Publicações aceitas limpam a recusa antiga; recusadas ficam marcadas com o motivo.
        const confirmed = batch.filter((operation) => !result.queue.operations.includes(operation) && !result.rejected.some((item) => item.operation === operation));
        saveRejections((previous) => {
          let next = previous;
          for (const operation of confirmed) {
            const id = sightingIdFromPublicId(operation.type === "publish" ? operation.record.id : operation.id);
            if (next[id]) { next = { ...next }; delete next[id]; }
          }
          for (const { operation, message } of result.rejected) {
            if (operation.type !== "publish") continue;
            next = { ...next, [sightingIdFromPublicId(operation.record.id)]: message };
          }
          return next;
        });
        if (result.stoppedByNetwork) {
          offline = true;
          setFeedStatus("offline");
          return;
        }
      }
      const mine = new Set(sightingsRef.current.map((item) => publicIdFor(item.id, secret.current!)));
      const records = await fetchPublicFeed(FEED_CONFIG, fetchImpl, mine);
      // Os registros deste aparelho já aparecem a partir do caderno local; do servidor vêm os das outras pessoas.
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
  }, [saveFeedQueue, saveRejections]);
  syncRef.current = sync;

  const queueRemote = useCallback(async (operations: FeedOperation[]) => {
    if (!FEED_CONFIG || !secret.current || operations.length === 0) return;
    let next = feedQueue.current;
    for (const operation of operations) next = enqueue(next, operation);
    await saveFeedQueue(next);
    void sync();
  }, [saveFeedQueue, sync]);

  const remotePublish = useCallback((sightingId: string, state: PublicationStore): FeedOperation | null => {
    if (!secret.current) return null;
    const sighting = sightingsRef.current.find((item) => item.id === sightingId);
    const record = sighting ? toPublicRecord(sighting, state.items[sightingId], new Date()) : null;
    if (!record) return null;
    return { type: "publish", queuedAt: new Date().toISOString(), record: { ...record, id: publicIdFor(sightingId, secret.current) } };
  }, []);

  const remoteEnd = useCallback((sightingId: string): FeedOperation | null =>
    secret.current ? { type: "end", id: publicIdFor(sightingId, secret.current), queuedAt: new Date().toISOString() } : null, []);

  /** Grava em fila para que duas ações rápidas não sobrescrevam uma à outra. */
  const commit = useCallback((change: (previous: PublicationStore) => PublicationStore) => {
    const run = queue.current.then(async () => {
      const next = change(current.current);
      if (next === current.current) return next;
      try {
        await AsyncStorage.setItem(PUBLICATIONS_KEY, serializePublicationStore(next));
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
  }, []);

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
    if (ready && notebookReady && FEED_CONFIG) void sync();
  }, [ready, notebookReady, sync]);

  const remoteStatus = useCallback((sightingId: string): RemoteStatus => {
    if (!FEED_CONFIG || !secret.current) return "local";
    const publicId = publicIdFor(sightingId, secret.current);
    if (feedQueue.current.operations.some((operation) => (operation.type === "publish" ? operation.record.id : operation.id) === publicId)) return "pending";
    if (rejections[sightingId]) return "rejected";
    return "synced";
    // pendingCount entra nas dependências para recalcular quando a fila muda.
  }, [rejections, pendingCount]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const operation = remoteEnd(sightingId);
      if (operation) await queueRemote([operation]);
    },
    remoteRecords,
    feedStatus,
    pendingCount,
    lastSyncAt,
    refreshFeed: sync,
    remoteStatus,
    rejectionFor: (sightingId) => rejections[sightingId] ?? null,
  }), [store, ready, writeError, commit, remotePublish, remoteEnd, queueRemote, saveRejections, remoteRecords, feedStatus, pendingCount, lastSyncAt, sync, remoteStatus, rejections]);

  return <PublicationsContext.Provider value={value}>{children}</PublicationsContext.Provider>;
}

export function usePublications() {
  const context = useContext(PublicationsContext);
  if (!context) throw new Error("usePublications deve ser usado dentro de PublicationsProvider");
  return context;
}
