import { sanitizeStoredSightings, type Sighting } from "./pantanal";

const STORAGE_VERSION = 1;

type StoredSightingsEnvelope = {
  version: number;
  sightings: unknown;
};

export function serializeSightings(sightings: Sighting[]): string {
  return JSON.stringify({ version: STORAGE_VERSION, sightings });
}

export function restoreSightings(value: string | null): Sighting[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) return sanitizeStoredSightings(parsed);
    if (!parsed || typeof parsed !== "object") return [];
    const envelope = parsed as Partial<StoredSightingsEnvelope>;
    if (envelope.version !== STORAGE_VERSION) return [];
    return sanitizeStoredSightings(envelope.sightings);
  } catch {
    return [];
  }
}
