import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import type { Sighting } from "@/shared/pantanal";
import { createSightingsStorage, SIGHTINGS_CHUNK_SIZE } from "@/lib/sightings-storage";
import { createSightingExport } from "@/lib/sightings-transfer";

const SETTINGS_KEY = "pantanal-dex:settings";

type Settings = { defaultLanguage: string; quickLanguages: string[] };
type AppContextValue = { sightings: Sighting[]; settings: Settings; ready: boolean; addSighting: (sighting: Sighting) => Promise<void>; updateSighting: (sighting: Sighting) => Promise<void>; deleteSighting: (id: string) => Promise<void>; setSettings: (settings: Settings) => Promise<void> };
const AppContext = createContext<AppContextValue | null>(null);

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
function parseSettings(value: string | null): Settings | null { try { const parsed: unknown = value ? JSON.parse(value) : null; if (!isRecord(parsed) || typeof parsed.defaultLanguage !== "string" || !Array.isArray(parsed.quickLanguages) || !parsed.quickLanguages.every((item) => typeof item === "string")) return null; return { defaultLanguage: parsed.defaultLanguage, quickLanguages: parsed.quickLanguages }; } catch { return null; } }

const sightingsStorage = createSightingsStorage(AsyncStorage);

async function loadSightings(): Promise<Sighting[]> {
  return sightingsStorage.load();
}


export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [settings, setSettingsState] = useState<Settings>({ defaultLanguage: "Português", quickLanguages: ["Português", "English"] });
  const [ready, setReady] = useState(false);
  const sightingsRef = useRef<Sighting[]>([]);
  useEffect(() => { (async () => { try { const [storedSightings, storedSettings] = await Promise.all([loadSightings(), AsyncStorage.getItem(SETTINGS_KEY)]); sightingsRef.current = storedSightings; setSightings(storedSightings); const safeSettings = parseSettings(storedSettings); if (safeSettings) setSettingsState(safeSettings); } finally { setReady(true); } })(); }, []);
  const commitSightings = useCallback((next: Sighting[]) => { sightingsRef.current = next; setSightings(next); return sightingsStorage.save(next); }, []);
  const addSighting = useCallback((sighting: Sighting) => commitSightings([sighting, ...sightingsRef.current]), [commitSightings]);
  const updateSighting = useCallback((sighting: Sighting) => commitSightings(sightingsRef.current.map((item) => item.id === sighting.id ? sighting : item)), [commitSightings]);
  const deleteSighting = useCallback((id: string) => commitSightings(sightingsRef.current.filter((item) => item.id !== id)), [commitSightings]);
  const setSettings = useCallback(async (next: Settings) => { setSettingsState(next); await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); }, []);
  const value = useMemo<AppContextValue>(() => ({ sightings, settings, ready, addSighting, updateSighting, deleteSighting, setSettings }), [sightings, settings, ready, addSighting, updateSighting, deleteSighting, setSettings]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used within AppProvider"); return context; }
export function createExportJson(sightings: Sighting[]) { return createSightingExport(sightings); }
export function createExportCsv(sightings: Sighting[]) { const header = "id,speciesId,date,time,locationLabel,latitude,longitude,locationPrecision,quantity,notes,visibility"; const rows = sightings.map((s) => [s.id, s.speciesId, s.date, s.time ?? "", s.locationLabel ?? "", s.latitude ?? "", s.longitude ?? "", s.locationPrecision, s.quantity ?? "", (s.notes ?? "").replaceAll('"', '""'), s.visibility].map((v) => `"${v}"`).join(",")); return [header, ...rows].join("\n"); }
export const isWeb = Platform.OS === "web";
export const sightingsStorageConfig = { chunkSize: SIGHTINGS_CHUNK_SIZE, formatVersion: 2 } as const;
