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

export function mergeSightings(current: Sighting[], incoming: Sighting[]): { sightings: Sighting[]; added: number; updated: number; skipped: number } {
  const safeIncoming = sanitizeStoredSightings(incoming);
  const byId = new Map(current.map((item) => [item.id, item]));
  let added = 0;
  let updated = 0;
  for (const item of safeIncoming) {
    const existing = byId.get(item.id);
    if (!existing) {
      byId.set(item.id, item);
      added += 1;
      continue;
    }
    if (new Date(item.updatedAt).getTime() > new Date(existing.updatedAt).getTime()) {
      byId.set(item.id, item);
      updated += 1;
    }
  }
  return { sightings: Array.from(byId.values()).sort((a, b) => `${b.date}T${b.time || "00:00"}`.localeCompare(`${a.date}T${a.time || "00:00"}`)), added, updated, skipped: incoming.length - safeIncoming.length };
}
