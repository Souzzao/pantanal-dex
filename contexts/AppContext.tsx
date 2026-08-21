import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import type { Sighting } from "@/shared/pantanal";
import { createExportCsv, createExportJson, parseImportJson } from "@/shared/exports";

export { createExportCsv, createExportJson } from "@/shared/exports";

const SIGHTINGS_KEY = "pantanal-dex:sightings";
const SETTINGS_KEY = "pantanal-dex:settings";

type Settings = { defaultLanguage: string; quickLanguages: string[] };
type AppContextValue = { sightings: Sighting[]; settings: Settings; ready: boolean; addSighting: (sighting: Sighting) => Promise<void>; updateSighting: (sighting: Sighting) => Promise<void>; deleteSighting: (id: string) => Promise<void>; importSightings: (raw: string) => Promise<{ imported: number; skipped: number; duplicates: number }>; setSettings: (settings: Settings) => Promise<void> };
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [settings, setSettingsState] = useState<Settings>({ defaultLanguage: "Português", quickLanguages: ["Português", "English"] });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const [storedSightings, storedSettings] = await Promise.all([AsyncStorage.getItem(SIGHTINGS_KEY), AsyncStorage.getItem(SETTINGS_KEY)]);
        if (storedSightings) {
          try {
            const parsed = JSON.parse(storedSightings);
            if (Array.isArray(parsed)) setSightings(parsed);
            else await AsyncStorage.removeItem(SIGHTINGS_KEY);
          } catch {
            await AsyncStorage.removeItem(SIGHTINGS_KEY);
          }
        }
        if (storedSettings) {
          try {
            const parsed = JSON.parse(storedSettings);
            if (parsed && typeof parsed === "object" && typeof parsed.defaultLanguage === "string" && Array.isArray(parsed.quickLanguages)) setSettingsState(parsed);
            else await AsyncStorage.removeItem(SETTINGS_KEY);
          } catch {
            await AsyncStorage.removeItem(SETTINGS_KEY);
          }
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);
  const persistSightings = async (next: Sighting[]) => { setSightings(next); await AsyncStorage.setItem(SIGHTINGS_KEY, JSON.stringify(next)); };
  const value = useMemo<AppContextValue>(() => ({ sightings, settings, ready, addSighting: (s) => persistSightings([s, ...sightings]), updateSighting: (s) => persistSightings(sightings.map((item) => item.id === s.id ? s : item)), deleteSighting: (id) => persistSightings(sightings.filter((item) => item.id !== id)), importSightings: async (raw) => { const parsed = parseImportJson(raw); const existing = new Set(sightings.map((item) => item.id)); const fresh = parsed.sightings.filter((item) => !existing.has(item.id)); await persistSightings([...fresh, ...sightings]); return { imported: fresh.length, skipped: parsed.skipped, duplicates: parsed.sightings.length - fresh.length }; }, setSettings: async (next) => { setSettingsState(next); await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); } }), [sightings, settings, ready]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used within AppProvider"); return context; }

export const isWeb = Platform.OS === "web";
