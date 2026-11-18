/**
 * PantanalDex — Estado do aparelho por conta: preferências, caderno de avistamentos e limite diário.
 *
 * @author Felipe de Souza Aquino
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";

import type { Sighting } from "@/shared/pantanal";
import { sanitizeSettings } from "@/shared/pantanal";
import { createExportCsv, createExportJson } from "@/shared/exports";
import { mergeSightings, readStorageWithRetry, restoreSettingsWithStatus, serializeSettings, withStorageRetry, type RestoreStatus } from "@/shared/persistence";
import type { Settings } from "@/shared/contracts";
import { restoreNotebook, serializeNotebook } from "@/shared/notebook";
import { setLanguage } from "@/shared/i18n";
import { createSightingCreationLedger, recordSightingCreation, validateSightingOperation, type SightingCreationLedger } from "@/shared/sighting-rules";
import {
  addNotebook, assignNotebook, createTestSightings, MAIN_NOTEBOOK_ID, mergeNotebooks as mergeNotebookSightings, recordExport,
  removeNotebook, renameNotebook as renameNotebookIn, restoreNotebookStore, serializeNotebookStore, setActiveNotebook as setActiveIn,
  TEST_NOTEBOOK_ID, uniqueNotebookName, type ExportRecord, type Notebook, type NotebookFileFormat, type NotebookStore,
} from "@/shared/notebooks";
import type { ParsedNotebookFile } from "@/shared/notebook-files";

export { createExportCsv, createExportJson } from "@/shared/exports";

const SIGHTINGS_KEY = "pantanal-dex:sightings";
const SETTINGS_KEY = "pantanal-dex:settings";
const NOTEBOOK_KEY = "pantanal-dex:notebook-v2";
/** Conta que "herdou" o caderno salvo antes do login existir (só uma conta herda). */
const LEGACY_CLAIM_KEY = "pantanal-dex:legacy-notebook-owner";
const NOTEBOOKS_KEY = "pantanal-dex:notebooks-v1";
const notebooksKeyFor = (namespace?: string) => (namespace ? `${NOTEBOOKS_KEY}:${namespace}` : NOTEBOOKS_KEY);

/** Chave do caderno de uma conta: cada conta tem o próprio caderno no aparelho. */
export const notebookKeyFor = (namespace?: string) => (namespace ? `${NOTEBOOK_KEY}:${namespace}` : NOTEBOOK_KEY);
type StorageDiagnostics = { sightings: RestoreStatus; settings: RestoreStatus; readError: boolean; writeError: boolean };
export type NotebookImportMode = "new" | "split" | "active";
type NotebookApi = {
  notebooks: Notebook[];
  notebookExports: ExportRecord[];
  activeNotebookId: string;
  setActiveNotebook: (id: string) => Promise<void>;
  createNotebook: (name: string) => Promise<Notebook>;
  renameNotebook: (id: string, name: string) => Promise<void>;
  deleteNotebook: (id: string, mode: "move" | "delete") => Promise<number>;
  mergeNotebooks: (sourceIds: string[], targetId: string, removeDuplicates: boolean) => Promise<{ moved: number; duplicatesRemoved: number }>;
  moveSightings: (ids: string[], targetId: string) => Promise<void>;
  importNotebookFile: (file: ParsedNotebookFile, mode: NotebookImportMode, fileName?: string) => Promise<{ added: number; updated: number; notebookNames: string[] }>;
  recordNotebookExport: (notebookIds: string[], format: NotebookFileFormat, count: number) => Promise<void>;
  resetTestNotebook: () => Promise<number>;
};
type AppContextValue = NotebookApi & { sightings: Sighting[]; creationLedger: SightingCreationLedger; canWriteSightings: boolean; settings: Settings; ready: boolean; storage: StorageDiagnostics; addSighting: (sighting: Sighting) => Promise<void>; updateSighting: (sighting: Sighting) => Promise<void>; deleteSighting: (id: string) => Promise<void>; clearSightings: () => Promise<void>; importSightings: (incoming: Sighting[]) => Promise<{ added: number; updated: number; skipped: number }>; setSettings: (settings: Settings) => Promise<void> };
const AppContext = createContext<AppContextValue | null>(null);
const DEFAULT_SETTINGS: Settings = { defaultLanguage: "Português", quickLanguages: ["Português", "English"] };

type RawRead = { value: string | null; failed: boolean };
async function readRaw(key: string): Promise<RawRead> {
  try { return { value: await readStorageWithRetry(() => AsyncStorage.getItem(key)), failed: false }; } catch { return { value: null, failed: true }; }
}

export function AppProvider({ children, storageNamespace }: { children: React.ReactNode; storageNamespace?: string }) {
  const notebookKey = notebookKeyFor(storageNamespace);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  // Idioma global das telas e das fichas (traduções embutidas, sem internet).
  setLanguage(settings.defaultLanguage);
  const [storage, setStorage] = useState<StorageDiagnostics>({ sightings: "empty", settings: "empty", readError: false, writeError: false });
  const [ready, setReady] = useState(false);
  const [creationLedger, setCreationLedger] = useState(createSightingCreationLedger);
  const [canWriteSightings, setCanWriteSightings] = useState(false);
  const currentSightings = useRef<Sighting[]>([]);
  const currentLedger = useRef(createSightingCreationLedger());
  const writable = useRef(false);
  const writeQueue = useRef<Promise<unknown>>(Promise.resolve());
  const notebooksKey = notebooksKeyFor(storageNamespace);
  const [notebookStore, setNotebookStore] = useState<NotebookStore>(() => restoreNotebookStore(null).store);
  const currentStore = useRef<NotebookStore>(notebookStore);

  useEffect(() => {
    let mounted = true;
    (async () => {
      let [rawNotebook, rawSightings, rawSettings] = await Promise.all([readRaw(notebookKey), storageNamespace ? Promise.resolve<RawRead>({ value: null, failed: false }) : readRaw(SIGHTINGS_KEY), readRaw(SETTINGS_KEY)]);
      // Primeira vez desta conta no aparelho: herda o caderno de antes do login, se ninguém herdou ainda.
      let claimedLegacy = false;
      if (storageNamespace && !rawNotebook.failed && rawNotebook.value === null) {
        const claim = await readRaw(LEGACY_CLAIM_KEY);
        if (!claim.failed && (claim.value === null || claim.value === storageNamespace)) {
          const [legacyNotebook, legacySightings] = await Promise.all([readRaw(NOTEBOOK_KEY), readRaw(SIGHTINGS_KEY)]);
          if (!legacyNotebook.failed && !legacySightings.failed && (legacyNotebook.value !== null || legacySightings.value !== null)) {
            rawNotebook = legacyNotebook;
            rawSightings = legacySightings;
            claimedLegacy = true;
          }
        }
      }
      const restored = restoreNotebook(rawNotebook.value, rawSightings.value);
      if (claimedLegacy && restored.canWrite) {
        try {
          await AsyncStorage.setItem(notebookKey, serializeNotebook(restored.sightings, restored.ledger));
          await AsyncStorage.setItem(LEGACY_CLAIM_KEY, storageNamespace!);
        } catch {
          // Se falhar, tenta de novo na próxima abertura; o caderno antigo continua intacto.
        }
      }
      const restoredSettings = restoreSettingsWithStatus(rawSettings.value, DEFAULT_SETTINGS);
      if (!mounted) return;
      currentSightings.current = restored.sightings;
      currentLedger.current = restored.ledger;
      writable.current = restored.canWrite && !rawNotebook.failed && (rawNotebook.value !== null || !rawSightings.failed);
      setSightings(restored.sightings);
      setCreationLedger(restored.ledger);
      setCanWriteSightings(writable.current);
      setSettingsState(restoredSettings.value);
      // Cadernos: na primeira vez, cria Principal e Teste e coloca exemplos no Teste.
      const rawStore = await readRaw(notebooksKey);
      const restoredStore = restoreNotebookStore(rawStore.value);
      if (!mounted) return;
      currentStore.current = restoredStore.store;
      setNotebookStore(restoredStore.store);
      if (restoredStore.status === "empty" && !rawStore.failed && writable.current) {
        try {
          const seeded = mergeSightings(currentSightings.current, createTestSightings()).sightings;
          await AsyncStorage.setItem(notebookKey, serializeNotebook(seeded, currentLedger.current));
          await AsyncStorage.setItem(notebooksKey, serializeNotebookStore(restoredStore.store));
          currentSightings.current = seeded;
          setSightings(seeded);
        } catch {
          // Sem exemplos não tem problema: o caderno Teste continua disponível vazio.
        }
      }
      setStorage({ sightings: restored.status, settings: restoredSettings.status, readError: rawNotebook.failed || rawSightings.failed || rawSettings.failed, writeError: false });
      setReady(true);
    })();
    return () => { mounted = false; };
  }, [notebookKey, notebooksKey, storageNamespace]);

  const persistSightings = async (next: Sighting[], ledger = currentLedger.current) => {
    if (!writable.current) throw new Error("O caderno ainda está carregando ou precisa de recuperação. Exporte os dados disponíveis antes de continuar.");
    try {
      await withStorageRetry(() => AsyncStorage.setItem(notebookKey, serializeNotebook(next, ledger)));
      currentSightings.current = next;
      currentLedger.current = ledger;
      setSightings(next);
      setCreationLedger(ledger);
      setStorage((current) => ({ ...current, sightings: "restored", writeError: false }));
    } catch (error) {
      setStorage((current) => ({ ...current, writeError: true }));
      throw error;
    }
  };

  const persistStore = async (next: NotebookStore) => {
    await withStorageRetry(() => AsyncStorage.setItem(notebooksKey, serializeNotebookStore(next)));
    currentStore.current = next;
    setNotebookStore(next);
  };

  /** Cria (ou reaproveita, se for o próprio Principal) um caderno com nome livre. */
  const ensureNotebook = (store: NotebookStore, name: string, kind: "custom" | "imported", source?: Notebook["source"]) =>
    addNotebook(store, uniqueNotebookName(store, name), kind, new Date(), source);

  const enqueue = <T,>(operation: () => Promise<T>): Promise<T> => {
    const result = writeQueue.current.then(operation);
    writeQueue.current = result.catch(() => undefined);
    return result;
  };

  const assertValid = (sighting: Sighting, operation: "create" | "update", now: Date) => {
    const result = validateSightingOperation(sighting, { operation, now, ledger: currentLedger.current });
    if (!result.valid) throw new Error(result.errors[0].message);
  };

  const value = useMemo<AppContextValue>(() => ({
    sightings,
    creationLedger,
    canWriteSightings,
    settings,
    ready,
    storage,
    addSighting: (sighting) => enqueue(async () => {
      const now = new Date();
      if (currentSightings.current.some(item => item.id === sighting.id)) throw new Error("Este registro já existe no caderno.");
      assertValid(sighting, "create", now);
      const ledger = recordSightingCreation(currentLedger.current, sighting.id, now);
      const active = currentStore.current.activeId;
      const withNotebook = sighting.notebookId !== undefined || active === MAIN_NOTEBOOK_ID ? sighting : { ...sighting, notebookId: active };
      await persistSightings([withNotebook, ...currentSightings.current], ledger);
    }),
    updateSighting: (sighting) => enqueue(async () => {
      if (!currentSightings.current.some(item => item.id === sighting.id)) throw new Error("O registro não foi encontrado no caderno.");
      assertValid(sighting, "update", new Date());
      await persistSightings(currentSightings.current.map(item => item.id === sighting.id ? sighting : item));
    }),
    deleteSighting: (id) => enqueue(() => persistSightings(currentSightings.current.filter(item => item.id !== id))),
    clearSightings: () => enqueue(() => persistSightings([])),
    importSightings: (incoming) => enqueue(async () => {
      const result = mergeSightings(currentSightings.current, incoming);
      await persistSightings(result.sightings);
      return { added: result.added, updated: result.updated, skipped: result.skipped };
    }),
    notebooks: notebookStore.notebooks,
    notebookExports: notebookStore.exports,
    activeNotebookId: notebookStore.activeId,
    setActiveNotebook: (id) => enqueue(() => persistStore(setActiveIn(currentStore.current, id))),
    createNotebook: (name) => enqueue(async () => {
      const { store, notebook } = addNotebook(currentStore.current, name, "custom");
      await persistStore(store);
      return notebook;
    }),
    renameNotebook: (id, name) => enqueue(() => persistStore(renameNotebookIn(currentStore.current, id, name))),
    deleteNotebook: (id, mode) => enqueue(async () => {
      const result = removeNotebook(currentStore.current, currentSightings.current, id, mode);
      if (result.affected) await persistSightings(result.sightings);
      await persistStore(result.store);
      return result.affected;
    }),
    mergeNotebooks: (sourceIds, targetId, removeDuplicates) => enqueue(async () => {
      const result = mergeNotebookSightings(currentSightings.current, sourceIds, targetId, removeDuplicates);
      await persistSightings(result.sightings);
      return { moved: result.moved, duplicatesRemoved: result.duplicatesRemoved };
    }),
    moveSightings: (ids, targetId) => enqueue(async () => {
      const set = new Set(ids);
      const now = new Date().toISOString();
      await persistSightings(currentSightings.current.map((item) => (set.has(item.id) ? { ...item, notebookId: targetId === MAIN_NOTEBOOK_ID ? undefined : targetId, updatedAt: now } : item)));
    }),
    importNotebookFile: (file, mode, fileName) => enqueue(async () => {
      let store = currentStore.current;
      const source = { format: file.format, fileName, importedAt: new Date().toISOString() };
      const existingIds = new Set(currentSightings.current.map((item) => item.id));
      const stamp = Date.now().toString(36);
      // Em caderno novo, um registro que já existe vira cópia (id novo); "Juntar cadernos" limpa as repetições depois.
      const copy = (item: Sighting) => (mode !== "active" && existingIds.has(item.id) ? { ...item, id: `${item.id}-imp-${stamp}` } : item);
      let incoming: Sighting[] = [];
      const created: string[] = [];
      if (mode === "active") {
        incoming = assignNotebook(file.sightings, store.activeId);
      } else if (mode === "split" && file.notebookNames.length) {
        const idByName = new Map<string, string>();
        for (const name of file.notebookNames) {
          const made = ensureNotebook(store, `${name} (importado)`, "imported", source);
          store = made.store; idByName.set(name, made.notebook.id); created.push(made.notebook.name);
        }
        let fallback: string | null = null;
        incoming = file.sightings.map((item) => {
          const name = file.notebookByRecord[item.id];
          let target = name ? idByName.get(name) : undefined;
          if (!target) {
            if (!fallback) { const made = ensureNotebook(store, "Importado", "imported", source); store = made.store; fallback = made.notebook.id; created.push(made.notebook.name); }
            target = fallback;
          }
          return { ...copy(item), notebookId: target };
        });
      } else {
        const base = (fileName ?? "").replace(/\.(json|csv|geojson)$/i, "").replace(/^pantanaldex-/, "").slice(0, 28) || "Importado";
        const made = ensureNotebook(store, base, "imported", source);
        store = made.store; created.push(made.notebook.name);
        incoming = file.sightings.map((item) => ({ ...copy(item), notebookId: made.notebook.id }));
      }
      const result = mergeSightings(currentSightings.current, incoming);
      await persistSightings(result.sightings);
      await persistStore(store);
      return { added: result.added, updated: result.updated, notebookNames: created };
    }),
    recordNotebookExport: (notebookIds, format, count) => enqueue(() => persistStore(recordExport(currentStore.current, notebookIds, format, count))),
    resetTestNotebook: () => enqueue(async () => {
      let store = currentStore.current;
      if (!store.notebooks.some((item) => item.id === TEST_NOTEBOOK_ID)) {
        const at = new Date().toISOString();
        store = { ...store, notebooks: [...store.notebooks, { id: TEST_NOTEBOOK_ID, name: uniqueNotebookName(store, "Teste"), kind: "test", createdAt: at, updatedAt: at }] };
      }
      // Recria os exemplos no Teste. Se algum exemplo já foi movido para outro caderno, ele fica lá
      // e o novo exemplo ganha outro id, para nunca tirar registros de outro caderno.
      const stamp = Date.now().toString(36);
      const elsewhere = new Set(currentSightings.current.filter((item) => item.notebookId !== TEST_NOTEBOOK_ID).map((item) => item.id));
      const samples = createTestSightings().map((item) => (elsewhere.has(item.id) ? { ...item, id: `${item.id}-${stamp}` } : item));
      const sampleIds = new Set(samples.map((item) => item.id));
      const keep = currentSightings.current.filter((item) => !(item.notebookId === TEST_NOTEBOOK_ID && item.id.startsWith("teste-")) && !sampleIds.has(item.id));
      await persistSightings([...samples, ...keep]);
      await persistStore(store);
      return samples.length;
    }),
    setSettings: async (next) => {
      const safe = sanitizeSettings(next);
      try {
        await withStorageRetry(() => AsyncStorage.setItem(SETTINGS_KEY, serializeSettings(safe)));
        setSettingsState(safe);
        setStorage((current) => ({ ...current, settings: "restored", writeError: false }));
      } catch (error) {
        setStorage((current) => ({ ...current, writeError: true }));
        throw error;
      }
    },
  }), [sightings, creationLedger, canWriteSightings, settings, ready, storage, notebookStore]); // eslint-disable-line react-hooks/exhaustive-deps

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used within AppProvider"); return context; }
export const isWeb = Platform.OS === "web";
