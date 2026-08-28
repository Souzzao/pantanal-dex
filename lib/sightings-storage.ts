import type { LocationPrecision, Sighting, Visibility } from "@/shared/pantanal";

export const SIGHTINGS_KEY = "pantanal-dex:sightings";
export const SIGHTINGS_MANIFEST_KEY = "pantanal-dex:sightings:manifest";
export const SIGHTINGS_CHUNK_PREFIX = "pantanal-dex:sightings:chunk:";
export const SIGHTINGS_CHUNK_SIZE = 100;
export const SIGHTINGS_STORAGE_VERSION = 2 as const;

export type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  multiGet: (keys: string[]) => Promise<ReadonlyArray<readonly [string, string | null]>>;
  multiSet: (entries: [string, string][]) => Promise<void>;
  multiRemove: (keys: string[]) => Promise<void>;
};

type Manifest = { version: typeof SIGHTINGS_STORAGE_VERSION; count: number; chunks: number; updatedAt: string };
const LOCATION_PRECISIONS: LocationPrecision[] = ["exact", "approximate", "municipality", "none"];
const VISIBILITIES: Visibility[] = ["private", "shareable"];

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
export function isSighting(value: unknown): value is Sighting {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" && value.id.length > 0 && typeof value.speciesId === "string" && typeof value.date === "string" && typeof value.createdAt === "string" && typeof value.updatedAt === "string" && LOCATION_PRECISIONS.includes(value.locationPrecision as LocationPrecision) && VISIBILITIES.includes(value.visibility as Visibility) && (value.photoUri === undefined || typeof value.photoUri === "string") && (value.latitude === undefined || typeof value.latitude === "number") && (value.longitude === undefined || typeof value.longitude === "number") && (value.quantity === undefined || typeof value.quantity === "number") && (value.notes === undefined || typeof value.notes === "string");
}

export function parseSightings(value: string | null): Sighting[] {
  try { const parsed: unknown = value ? JSON.parse(value) : []; return Array.isArray(parsed) ? parsed.filter(isSighting) : []; } catch { return []; }
}

function parseManifest(value: string | null): Manifest | null {
  try { const parsed: unknown = value ? JSON.parse(value) : null; if (!isRecord(parsed) || parsed.version !== SIGHTINGS_STORAGE_VERSION || typeof parsed.chunks !== "number" || parsed.chunks < 0 || !Number.isInteger(parsed.chunks)) return null; return parsed as unknown as Manifest; } catch { return null; }
}

export function createSightingsStorage(storage: StorageLike) {
  let writeQueue: Promise<void> = Promise.resolve();
  const load = async (): Promise<Sighting[]> => {
    const manifest = parseManifest(await storage.getItem(SIGHTINGS_MANIFEST_KEY));
    if (manifest) {
      const keys = Array.from({ length: manifest.chunks }, (_, index) => `${SIGHTINGS_CHUNK_PREFIX}${index}`);
      const values = keys.length ? await storage.multiGet(keys) : [];
      return values.flatMap(([, raw]) => parseSightings(raw));
    }
    return parseSightings(await storage.getItem(SIGHTINGS_KEY));
  };
  const save = (next: Sighting[]): Promise<void> => {
    const clean = next.filter(isSighting);
    const chunks = Array.from({ length: Math.ceil(clean.length / SIGHTINGS_CHUNK_SIZE) }, (_, index) => clean.slice(index * SIGHTINGS_CHUNK_SIZE, (index + 1) * SIGHTINGS_CHUNK_SIZE));
    const manifest: Manifest = { version: SIGHTINGS_STORAGE_VERSION, count: clean.length, chunks: chunks.length, updatedAt: new Date().toISOString() };
    writeQueue = writeQueue.then(async () => {
      const previous = parseManifest(await storage.getItem(SIGHTINGS_MANIFEST_KEY));
      if (chunks.length) await storage.multiSet(chunks.map((chunk, index) => [`${SIGHTINGS_CHUNK_PREFIX}${index}`, JSON.stringify(chunk)]));
      await storage.setItem(SIGHTINGS_MANIFEST_KEY, JSON.stringify(manifest));
      const obsolete = Array.from({ length: Math.max(0, (previous?.chunks ?? 0) - chunks.length) }, (_, index) => `${SIGHTINGS_CHUNK_PREFIX}${chunks.length + index}`);
      if (obsolete.length) await storage.multiRemove(obsolete);
      await storage.removeItem(SIGHTINGS_KEY);
    }).catch(() => undefined);
    return writeQueue;
  };
  return { load, save };
}
