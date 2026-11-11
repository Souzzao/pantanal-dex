import AsyncStorage from "@react-native-async-storage/async-storage";
import { LanguageProvider } from "@/contexts/LanguageContext";
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";

import type { Sighting } from "@/shared/pantanal";
import { sanitizeSettings } from "@/shared/pantanal";
import { createExportCsv, createExportJson } from "@/shared/exports";
import { mergeSightings, readStorageWithRetry, restoreSettingsWithStatus, serializeSettings, withStorageRetry, type RestoreStatus } from "@/shared/persistence";
import type { Settings } from "@/shared/contracts";
import { restoreNotebook, serializeNotebook } from "@/shared/notebook";
import { createSightingCreationLedger, recordSightingCreation, validateSightingOperation, type SightingCreationLedger } from "@/shared/sighting-rules";

export { createExportCsv, createExportJson } from "@/shared/exports";

const SIGHTINGS_KEY = "pantanal-dex:sightings";
const SETTINGS_KEY = "pantanal-dex:settings";
const NOTEBOOK_KEY = "pantanal-dex:notebook-v2";
/** Conta que "herdou" o caderno salvo antes do login existir (só uma conta herda). */
const LEGACY_CLAIM_KEY = "pantanal-dex:legacy-notebook-owner";

/** Chave do caderno de uma conta: cada conta tem o próprio caderno no aparelho. */
export const notebookKeyFor = (namespace?: string) => (namespace ? `${NOTEBOOK_KEY}:${namespace}` : NOTEBOOK_KEY);
type StorageDiagnostics = { sightings: RestoreStatus; settings: RestoreStatus; readError: boolean; writeError: boolean };
type AppContextValue = { sightings: Sighting[]; creationLedger: SightingCreationLedger; canWriteSightings: boolean; settings: Settings; ready: boolean; storage: StorageDiagnostics; addSighting: (sighting: Sighting) => Promise<void>; updateSighting: (sighting: Sighting) => Promise<void>; deleteSighting: (id: string) => Promise<void>; clearSightings: () => Promise<void>; importSightings: (incoming: Sighting[]) => Promise<{ added: number; updated: number; skipped: number }>; setSettings: (settings: Settings) => Promise<void> };
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
  const [storage, setStorage] = useState<StorageDiagnostics>({ sightings: "empty", settings: "empty", readError: false, writeError: false });
  const [ready, setReady] = useState(false);
  const [creationLedger, setCreationLedger] = useState(createSightingCreationLedger);
  const [canWriteSightings, setCanWriteSightings] = useState(false);
  const currentSightings = useRef<Sighting[]>([]);
  const currentLedger = useRef(createSightingCreationLedger());
  const writable = useRef(false);
  const writeQueue = useRef<Promise<unknown>>(Promise.resolve());

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
      setStorage({ sightings: restored.status, settings: restoredSettings.status, readError: rawNotebook.failed || rawSightings.failed || rawSettings.failed, writeError: false });
      setReady(true);
    })();
    return () => { mounted = false; };
  }, [notebookKey, storageNamespace]);

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
      await persistSightings([sighting, ...currentSightings.current], ledger);
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
  }), [sightings, creationLedger, canWriteSightings, settings, ready, storage]);

  return <AppContext.Provider value={value}><LanguageProvider language={settings.defaultLanguage}>{children}</LanguageProvider></AppContext.Provider>;
}

export function useApp() { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used within AppProvider"); return context; }
export const isWeb = Platform.OS === "web";
