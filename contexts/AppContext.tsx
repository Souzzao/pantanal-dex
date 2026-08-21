import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import type { Sighting } from "@/shared/pantanal";
import { sanitizeSettings } from "@/shared/pantanal";
import { createExportCsv, createExportJson } from "@/shared/exports";
import { mergeSightings, restoreSettingsWithStatus, restoreSightingsWithStatus, serializeSettings, serializeSightings, type RestoreStatus } from "@/shared/persistence";
import type { Settings } from "@/shared/contracts";

export { createExportCsv, createExportJson } from "@/shared/exports";

const SIGHTINGS_KEY = "pantanal-dex:sightings";
const SETTINGS_KEY = "pantanal-dex:settings";
type StorageDiagnostics = { sightings: RestoreStatus; settings: RestoreStatus };
type AppContextValue = { sightings: Sighting[]; settings: Settings; ready: boolean; storage: StorageDiagnostics; addSighting: (sighting: Sighting) => Promise<void>; updateSighting: (sighting: Sighting) => Promise<void>; deleteSighting: (id: string) => Promise<void>; clearSightings: () => Promise<void>; importSightings: (incoming: Sighting[]) => Promise<{ added: number; updated: number; skipped: number }>; setSettings: (settings: Settings) => Promise<void> };
const AppContext = createContext<AppContextValue | null>(null);
const DEFAULT_SETTINGS: Settings = { defaultLanguage: "Português", quickLanguages: ["Português", "English"] };

async function readRaw(key: string): Promise<string | null> {
  try { return await AsyncStorage.getItem(key); } catch { return null; }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [storage, setStorage] = useState<StorageDiagnostics>({ sightings: "empty", settings: "empty" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [storedSightings, storedSettings] = await Promise.all([readRaw(SIGHTINGS_KEY), readRaw(SETTINGS_KEY)]);
      const restoredSightings = restoreSightingsWithStatus(storedSightings);
      const restoredSettings = restoreSettingsWithStatus(storedSettings, DEFAULT_SETTINGS);
      if (storedSightings && restoredSightings.status === "legacy-migrated" && restoredSightings.value.length) {
        try { await AsyncStorage.setItem(SIGHTINGS_KEY, serializeSightings(restoredSightings.value)); } catch { /* diagnóstico preservado */ }
      }
      if (!mounted) return;
      setSightings(restoredSightings.value);
      setSettingsState(restoredSettings.value);
      setStorage({ sightings: restoredSightings.status, settings: restoredSettings.status });
      setReady(true);
    })();
    return () => { mounted = false; };
  }, []);

  const persistSightings = async (next: Sighting[]) => {
    await AsyncStorage.setItem(SIGHTINGS_KEY, serializeSightings(next));
    setSightings(next);
  };

  const value = useMemo<AppContextValue>(() => ({
    sightings,
    settings,
    ready,
    storage,
    addSighting: async (sighting) => persistSightings([sighting, ...sightings.filter((item) => item.id !== sighting.id)]),
    updateSighting: async (sighting) => persistSightings(sightings.map((item) => item.id === sighting.id ? sighting : item)),
    deleteSighting: async (id) => persistSightings(sightings.filter((item) => item.id !== id)),
    clearSightings: async () => persistSightings([]),
    importSightings: async (incoming) => {
      const result = mergeSightings(sightings, incoming);
      await persistSightings(result.sightings);
      return { added: result.added, updated: result.updated, skipped: result.skipped };
    },
    setSettings: async (next) => {
      const safe = sanitizeSettings(next);
      await AsyncStorage.setItem(SETTINGS_KEY, serializeSettings(safe));
      setSettingsState(safe);
      setStorage((current) => ({ ...current, settings: "restored" }));
    },
  }), [sightings, settings, ready, storage]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used within AppProvider"); return context; }
export const isWeb = Platform.OS === "web";
