import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { useApp } from "@/contexts/AppContext";
import type { Sighting } from "@/shared/pantanal";
import {
  createPublicationStore,
  DEFAULT_PUBLIC_DURATION,
  endPublication,
  prunePublications,
  publishSighting,
  restorePublicationStore,
  serializePublicationStore,
  type PublicationStore,
  type PublicDurationId,
} from "@/shared/public-map";

/** Chave própria: não altera o caderno (`Sighting`) nem a gravação do UC06. */
export const PUBLICATIONS_KEY = "pantanal-dex:public-publications-v1";

type PublicationsContextValue = {
  store: PublicationStore;
  ready: boolean;
  writeError: boolean;
  publish: (sightingId: string, duration: PublicDurationId) => Promise<void>;
  end: (sightingId: string) => Promise<void>;
};

const PublicationsContext = createContext<PublicationsContextValue | null>(null);

const canAutoPublish = (sighting: Sighting) =>
  sighting.visibility === "shareable" && typeof sighting.latitude === "number" && typeof sighting.longitude === "number";

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

  useEffect(() => {
    let mounted = true;
    (async () => {
      let raw: string | null = null;
      try {
        raw = await AsyncStorage.getItem(PUBLICATIONS_KEY);
      } catch {
        raw = null;
      }
      if (!mounted) return;
      const restored = restorePublicationStore(raw).store;
      current.current = restored;
      setStore(restored);
      setReady(true);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  /** Grava em fila para que duas ações rápidas não sobrescrevam uma à outra. */
  const commit = useCallback((change: (previous: PublicationStore) => PublicationStore) => {
    const run = queue.current.then(async () => {
      const next = change(current.current);
      if (next === current.current) return;
      try {
        await AsyncStorage.setItem(PUBLICATIONS_KEY, serializePublicationStore(next));
        current.current = next;
        setStore(next);
        setWriteError(false);
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
    void commit((state) => {
      let next = notebookHealthy ? prunePublications(state, ids) : state;
      const now = new Date();
      for (const item of fresh) {
        if (!next.items[item.id]) next = publishSighting(next, item.id, DEFAULT_PUBLIC_DURATION, now);
      }
      return next;
    }).catch(() => undefined);
  }, [sightings, ready, notebookReady, notebookHealthy, commit]);

  const value = useMemo<PublicationsContextValue>(() => ({
    store,
    ready,
    writeError,
    publish: (sightingId, duration) => commit((state) => publishSighting(state, sightingId, duration, new Date())),
    end: (sightingId) => commit((state) => endPublication(state, sightingId, new Date())),
  }), [store, ready, writeError, commit]);

  return <PublicationsContext.Provider value={value}>{children}</PublicationsContext.Provider>;
}

export function usePublications() {
  const context = useContext(PublicationsContext);
  if (!context) throw new Error("usePublications deve ser usado dentro de PublicationsProvider");
  return context;
}
