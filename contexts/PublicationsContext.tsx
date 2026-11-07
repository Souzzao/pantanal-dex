import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";

import { useApp } from "@/contexts/AppContext";
import type { Sighting } from "@/shared/pantanal";
import {
  createFeedQueue,
  enqueue,
  FEED_QUEUE_KEY,
  FEED_SECRET_KEY,
  fetchPublicFeed,
  flushQueue,
  generateDeviceSecret,
  publicIdFor,
  readFeedConfig,
  restoreFeedQueue,
  type FeedOperation,
  type FeedQueue,
  type FetchLike,
} from "@/shared/public-feed";
import {
  createPublicationStore,
  DEFAULT_PUBLIC_DURATION,
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
};

const PublicationsContext = createContext<PublicationsContextValue | null>(null);

const canAutoPublish = (sighting: Sighting) =>
  sighting.visibility === "shareable" && typeof sighting.latitude === "number" && typeof sighting.longitude === "number";

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
  const knownIds = useRef<Set<string> | null>(null);
  const sightingsRef = useRef<Sighting[]>(sightings);
  sightingsRef.current = sightings;

  // Estado do servidor
  const secret = useRef<string | null>(null);
  const feedQueue = useRef<FeedQueue>(createFeedQueue());
  const [pendingCount, setPendingCount] = useState(0);
  const [remoteRecords, setRemoteRecords] = useState<PublicRecord[]>([]);
  const [feedStatus, setFeedStatus] = useState<FeedStatus>(FEED_CONFIG ? "loading" : "off");
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const syncing = useRef(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      let raw: string | null = null;
      let rawQueue: string | null = null;
      try {
        [raw, rawQueue] = await Promise.all([AsyncStorage.getItem(PUBLICATIONS_KEY), AsyncStorage.getItem(FEED_QUEUE_KEY)]);
      } catch {
        raw = null;
      }
      if (FEED_CONFIG) secret.current = await readSecret().catch(() => null);
      if (!mounted) return;
      const restored = restorePublicationStore(raw).store;
      current.current = restored;
      feedQueue.current = restoreFeedQueue(rawQueue);
      setPendingCount(feedQueue.current.operations.length);
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

  /** Envia a fila e baixa o mapa público. Sem servidor configurado, não faz nada. */
  const sync = useCallback(async () => {
    if (!FEED_CONFIG || !secret.current || syncing.current) return;
    syncing.current = true;
    const fetchImpl = fetch as unknown as FetchLike;
    try {
      if (feedQueue.current.operations.length) {
        const result = await flushQueue(feedQueue.current, FEED_CONFIG, fetchImpl, secret.current);
        await saveFeedQueue(result.queue);
        if (result.stoppedByNetwork) {
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
      setFeedStatus("offline");
    } finally {
      syncing.current = false;
    }
  }, [saveFeedQueue]);

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

  // Publica automaticamente (prazo padrão) os avistamentos compartilháveis criados a partir de agora,
  // e limpa publicações de registros apagados do caderno.
  useEffect(() => {
    if (!ready || !notebookReady) return;
    const ids = new Set(sightings.map((item) => item.id));
    const previous = knownIds.current;
    knownIds.current = ids;
    const fresh = previous === null ? [] : sightings.filter((item) => !previous.has(item.id) && canAutoPublish(item));
    const removed = previous === null || !notebookHealthy ? [] : [...previous].filter((id) => !ids.has(id));
    void commit((state) => {
      let next = notebookHealthy ? prunePublications(state, ids) : state;
      const now = new Date();
      for (const item of fresh) {
        if (!next.items[item.id]) next = publishSighting(next, item.id, DEFAULT_PUBLIC_DURATION, now);
      }
      return next;
    }).then((state) => {
      const operations = [
        ...fresh.map((item) => remotePublish(item.id, state)),
        ...removed.map((id) => remoteEnd(id)),
      ].filter((item): item is FeedOperation => item !== null);
      return queueRemote(operations);
    }).catch(() => undefined);
  }, [sightings, ready, notebookReady, notebookHealthy, commit, queueRemote, remotePublish, remoteEnd]);

  // Primeira sincronização assim que tudo carregar.
  useEffect(() => {
    if (ready && notebookReady && FEED_CONFIG) void sync();
  }, [ready, notebookReady, sync]);

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
      const operation = remoteEnd(sightingId);
      if (operation) await queueRemote([operation]);
    },
    remoteRecords,
    feedStatus,
    pendingCount,
    lastSyncAt,
    refreshFeed: sync,
  }), [store, ready, writeError, commit, remotePublish, remoteEnd, queueRemote, remoteRecords, feedStatus, pendingCount, lastSyncAt, sync]);

  return <PublicationsContext.Provider value={value}>{children}</PublicationsContext.Provider>;
}

export function usePublications() {
  const context = useContext(PublicationsContext);
  if (!context) throw new Error("usePublications deve ser usado dentro de PublicationsProvider");
  return context;
}
