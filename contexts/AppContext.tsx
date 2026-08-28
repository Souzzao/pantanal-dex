import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Platform } from "react-native";
import type { Sighting, LocationPrecision, Visibility } from "@/shared/pantanal";

const SIGHTINGS_KEY = "pantanal-dex:sightings";
const SIGHTINGS_MANIFEST_KEY = "pantanal-dex:sightings:manifest";
const SIGHTINGS_CHUNK_PREFIX = "pantanal-dex:sightings:chunk:";
const SIGHTINGS_CHUNK_SIZE = 100;
const SETTINGS_KEY = "pantanal-dex:settings";
const LOCATION_PRECISIONS: LocationPrecision[] = ["exact", "approximate", "municipality", "none"];
const VISIBILITIES: Visibility[] = ["private", "shareable"];

type Settings = { defaultLanguage: string; quickLanguages: string[] };
type SightingManifest = { version: 2; count: number; chunks: number; updatedAt: string };
type AppContextValue = { sightings: Sighting[]; settings: Settings; ready: boolean; addSighting: (sighting: Sighting) => Promise<void>; updateSighting: (sighting: Sighting) => Promise<void>; deleteSighting: (id: string) => Promise<void>; setSettings: (settings: Settings) => Promise<void> };
const AppContext = createContext<AppContextValue | null>(null);

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
function isSighting(value: unknown): value is Sighting {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" && value.id.length > 0 && typeof value.speciesId === "string" && typeof value.date === "string" && typeof value.createdAt === "string" && typeof value.updatedAt === "string" && LOCATION_PRECISIONS.includes(value.locationPrecision as LocationPrecision) && VISIBILITIES.includes(value.visibility as Visibility) && (value.photoUri === undefined || typeof value.photoUri === "string") && (value.latitude === undefined || typeof value.latitude === "number") && (value.longitude === undefined || typeof value.longitude === "number") && (value.quantity === undefined || typeof value.quantity === "number") && (value.notes === undefined || typeof value.notes === "string");
}
function parseSightings(value: string | null): Sighting[] { try { const parsed: unknown = value ? JSON.parse(value) : []; return Array.isArray(parsed) ? parsed.filter(isSighting) : []; } catch { return []; } }
function parseSettings(value: string | null): Settings | null { try { const parsed: unknown = value ? JSON.parse(value) : null; if (!isRecord(parsed) || typeof parsed.defaultLanguage !== "string" || !Array.isArray(parsed.quickLanguages) || !parsed.quickLanguages.every((item) => typeof item === "string")) return null; return { defaultLanguage: parsed.defaultLanguage, quickLanguages: parsed.quickLanguages }; } catch { return null; } }

async function loadSightings(): Promise<Sighting[]> {
  const manifestRaw = await AsyncStorage.getItem(SIGHTINGS_MANIFEST_KEY);
  if (manifestRaw) {
    try {
      const manifest: unknown = JSON.parse(manifestRaw);
      if (isRecord(manifest) && manifest.version === 2 && typeof manifest.chunks === "number" && manifest.chunks >= 0) {
        const keys = Array.from({ length: manifest.chunks }, (_, index) => `${SIGHTINGS_CHUNK_PREFIX}${index}`);
        const values = keys.length ? await AsyncStorage.multiGet(keys) : [];
        return values.flatMap(([, raw]) => parseSightings(raw));
      }
    } catch { /* fallback to migration below */ }
  }
  const legacy = await AsyncStorage.getItem(SIGHTINGS_KEY);
  return parseSightings(legacy);
}

let writeQueue: Promise<void> = Promise.resolve();
function persistSightings(next: Sighting[]): Promise<void> {
  const clean = next.filter(isSighting);
  const chunks = Array.from({ length: Math.ceil(clean.length / SIGHTINGS_CHUNK_SIZE) }, (_, index) => clean.slice(index * SIGHTINGS_CHUNK_SIZE, (index + 1) * SIGHTINGS_CHUNK_SIZE));
  const manifest: SightingManifest = { version: 2, count: clean.length, chunks: chunks.length, updatedAt: new Date().toISOString() };
  writeQueue = writeQueue.then(async () => {
    const previousRaw = await AsyncStorage.getItem(SIGHTINGS_MANIFEST_KEY);
    let previousChunks = 0;
    try { const previous: unknown = previousRaw ? JSON.parse(previousRaw) : null; if (isRecord(previous) && typeof previous.chunks === "number") previousChunks = previous.chunks; } catch { /* ignore malformed metadata */ }
    if (chunks.length) await AsyncStorage.multiSet(chunks.map((chunk, index) => [`${SIGHTINGS_CHUNK_PREFIX}${index}`, JSON.stringify(chunk)]));
    await AsyncStorage.setItem(SIGHTINGS_MANIFEST_KEY, JSON.stringify(manifest));
    const obsolete = Array.from({ length: Math.max(0, previousChunks - chunks.length) }, (_, index) => `${SIGHTINGS_CHUNK_PREFIX}${chunks.length + index}`);
    if (obsolete.length) await AsyncStorage.multiRemove(obsolete);
    await AsyncStorage.removeItem(SIGHTINGS_KEY);
  }).catch(() => undefined);
  return writeQueue;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [settings, setSettingsState] = useState<Settings>({ defaultLanguage: "Português", quickLanguages: ["Português", "English"] });
  const [ready, setReady] = useState(false);
  const sightingsRef = useRef<Sighting[]>([]);
  useEffect(() => { (async () => { try { const [storedSightings, storedSettings] = await Promise.all([loadSightings(), AsyncStorage.getItem(SETTINGS_KEY)]); sightingsRef.current = storedSightings; setSightings(storedSightings); const safeSettings = parseSettings(storedSettings); if (safeSettings) setSettingsState(safeSettings); } finally { setReady(true); } })(); }, []);
  const commitSightings = useCallback((next: Sighting[]) => { sightingsRef.current = next; setSightings(next); return persistSightings(next); }, []);
  const addSighting = useCallback((sighting: Sighting) => commitSightings([sighting, ...sightingsRef.current]), [commitSightings]);
  const updateSighting = useCallback((sighting: Sighting) => commitSightings(sightingsRef.current.map((item) => item.id === sighting.id ? sighting : item)), [commitSightings]);
  const deleteSighting = useCallback((id: string) => commitSightings(sightingsRef.current.filter((item) => item.id !== id)), [commitSightings]);
  const setSettings = useCallback(async (next: Settings) => { setSettingsState(next); await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next)); }, []);
  const value = useMemo<AppContextValue>(() => ({ sightings, settings, ready, addSighting, updateSighting, deleteSighting, setSettings }), [sightings, settings, ready, addSighting, updateSighting, deleteSighting, setSettings]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp() { const context = useContext(AppContext); if (!context) throw new Error("useApp must be used within AppProvider"); return context; }
export function createExportJson(sightings: Sighting[]) { return JSON.stringify({ version: "1.0", exportedAt: new Date().toISOString(), sightings }, null, 2); }
export function createExportCsv(sightings: Sighting[]) { const header = "id,speciesId,date,time,locationLabel,latitude,longitude,locationPrecision,quantity,notes,visibility"; const rows = sightings.map((s) => [s.id, s.speciesId, s.date, s.time ?? "", s.locationLabel ?? "", s.latitude ?? "", s.longitude ?? "", s.locationPrecision, s.quantity ?? "", (s.notes ?? "").replaceAll('"', '""'), s.visibility].map((v) => `"${v}"`).join(",")); return [header, ...rows].join("\n"); }
export const isWeb = Platform.OS === "web";
export const sightingsStorageConfig = { chunkSize: SIGHTINGS_CHUNK_SIZE, formatVersion: 2 } as const;
