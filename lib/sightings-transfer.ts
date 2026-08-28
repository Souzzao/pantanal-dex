import type { Sighting } from "@/shared/pantanal";
import { isSighting } from "./sightings-storage";

export const SIGHTINGS_TRANSFER_VERSION = "2.0" as const;
export type ImportRejection = { index: number; reason: "invalid-record" | "duplicate-id"; id?: string };
export type ImportResult = { accepted: Sighting[]; rejected: ImportRejection[]; sourceVersion: string | "unknown" };

export function createSightingExport(sightings: Sighting[]) {
  return JSON.stringify({ version: SIGHTINGS_TRANSFER_VERSION, exportedAt: new Date().toISOString(), sightings }, null, 2);
}

function sanitize(value: Sighting): Sighting {
  return {
    id: value.id, speciesId: value.speciesId, photoUri: value.photoUri, date: value.date, time: value.time,
    locationLabel: value.locationLabel, latitude: value.latitude, longitude: value.longitude, locationPrecision: value.locationPrecision,
    quantity: value.quantity, notes: value.notes, visibility: value.visibility, createdAt: value.createdAt, updatedAt: value.updatedAt,
  };
}

export function parseSightingImport(input: string): ImportResult {
  try {
    const parsed: unknown = JSON.parse(input);
    const envelope = Array.isArray(parsed) ? { sightings: parsed, version: "unknown" } : parsed;
    if (!envelope || typeof envelope !== "object" || !Array.isArray((envelope as { sightings?: unknown }).sightings)) return { accepted: [], rejected: [{ index: 0, reason: "invalid-record" }], sourceVersion: "unknown" };
    const sourceVersion = typeof (envelope as { version?: unknown }).version === "string" ? (envelope as { version: string }).version : "unknown";
    const accepted: Sighting[] = [];
    const rejected: ImportRejection[] = [];
    const ids = new Set<string>();
    for (const [index, candidate] of (envelope as { sightings: unknown[] }).sightings.entries()) {
      if (!isSighting(candidate)) { rejected.push({ index, reason: "invalid-record", id: typeof candidate === "object" && candidate !== null && "id" in candidate && typeof (candidate as { id?: unknown }).id === "string" ? (candidate as { id: string }).id : undefined }); continue; }
      if (ids.has(candidate.id)) { rejected.push({ index, reason: "duplicate-id", id: candidate.id }); continue; }
      ids.add(candidate.id);
      accepted.push(sanitize(candidate));
    }
    return { accepted, rejected, sourceVersion };
  } catch { return { accepted: [], rejected: [{ index: 0, reason: "invalid-record" }], sourceVersion: "unknown" }; }
}
