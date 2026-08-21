import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";
import type { Sighting } from "@/shared/pantanal";

const SIGHTINGS_KEY = "pantanal-dex:sightings";
const SETTINGS_KEY = "pantanal-dex:settings";

type Settings = { defaultLanguage: string; quickLanguages: string[] };
type AppContextValue = { sightings: Sighting[]; settings: Settings; ready: boolean; addSighting: (sighting: Sighting) => Promise<void>; updateSighting: (sighting: Sighting) => Promise<void>; deleteSighting: (id: string) => Promise<void>; setSettings: (settings: Settings) => Promise<void> };
const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [settings, setSettingsState] = useState<Settings>({ defaultLanguage: "Português", quickLanguages: ["Português", "English"] });
  const [ready, setReady] = useState(false);
  useEffect(() => { (async () => { try { const [storedSightings, storedSettings] = await Promise.all([AsyncStorage.getItem(SIGHTINGS_KEY), AsyncStorage.getItem(SETTINGS_KEY)]); if (storedSightings) setSightings(JSON.parse(storedSightings)); if (storedSettings) setSettingsState(JSON.parse(storedSettings)); } finally { setReady(true); } })(); }, []);
  const persistSightings = async (next: Sighting[]) => { setSightings(next); await AsyncStorage.setItem(SIGHTINGS_KEY, JSON.stringify(next)); };
  const value = useMemo<AppContextValue>(() => ({ sightings, settings, ready, addSighting: (s) => persistSightings([s, ...sightings]), updateSighting: (s) => persistSightings(sightings.map((item) => item.id === s.id ? s : item)), deleteSighting: (id) => persistSightings(sightings.filter((item) => item.id !== id)), setSettings: async (next) => { setSettingsState(next); await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); } }), [sightings, settings, ready]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used within AppProvider"); return context; }
export function createExportJson(sightings: Sighting[]) { return JSON.stringify({ version: "1.0", exportedAt: new Date().toISOString(), sightings }, null, 2); }
export function createExportCsv(sightings: Sighting[]) { const header = "id,speciesId,date,time,locationLabel,latitude,longitude,locationPrecision,quantity,notes,visibility"; const rows = sightings.map((s) => [s.id, s.speciesId, s.date, s.time ?? "", s.locationLabel ?? "", s.latitude ?? "", s.longitude ?? "", s.locationPrecision, s.quantity ?? "", (s.notes ?? "").replaceAll('"', '""'), s.visibility].map((v) => `"${v}"`).join(",")); return [header, ...rows].join("\n"); }
export const isWeb = Platform.OS === "web";
