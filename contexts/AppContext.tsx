import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

import type { Sighting } from "@/shared/pantanal";
import { sanitizeSettings, sanitizeStoredSightings } from "@/shared/pantanal";
import { createExportCsv, createExportJson } from "@/shared/exports";
import { restoreSightings, serializeSightings } from "@/shared/persistence";

export { createExportCsv, createExportJson } from "@/shared/exports";

const SIGHTINGS_KEY = "pantanal-dex:sightings";
const SETTINGS_KEY = "pantanal-dex:settings";
export type Settings = { defaultLanguage: string; quickLanguages: string[] };
type AppContextValue = { sightings: Sighting[]; settings: Settings; ready: boolean; addSighting: (sighting: Sighting) => Promise<void>; updateSighting: (sighting: Sighting) => Promise<void>; deleteSighting: (id: string) => Promise<void>; setSettings: (settings: Settings) => Promise<void> };
const AppContext = createContext<AppContextValue | null>(null);
const DEFAULT_SETTINGS: Settings = { defaultLanguage: "Português", quickLanguages: ["Português", "English"] };

async function readRaw(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
}

async function readJson(key: string): Promise<unknown> {
  const value = await readRaw(key);
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [storedSightings, storedSettings] = await Promise.all([readRaw(SIGHTINGS_KEY), readJson(SETTINGS_KEY)]);
      if (!mounted) return;
      setSightings(restoreSightings(storedSightings));
      setSettingsState(sanitizeSettings(storedSettings));
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
    addSighting: async (sighting) => persistSightings([sighting, ...sightings.filter((item) => item.id !== sighting.id)]),
    updateSighting: async (sighting) => persistSightings(sightings.map((item) => item.id === sighting.id ? sighting : item)),
    deleteSighting: async (id) => persistSightings(sightings.filter((item) => item.id !== id)),
    setSettings: async (next) => {
      const safe = sanitizeSettings(next);
      setSettingsState(safe);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(safe));
    },
  }), [sightings, settings, ready]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used within AppProvider"); return context; }
export const isWeb = Platform.OS === "web";
