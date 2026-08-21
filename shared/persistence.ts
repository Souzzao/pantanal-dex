import { sanitizeSettings, sanitizeStoredSightings, type Sighting } from "./pantanal";
import type { Settings } from "./contracts";

const STORAGE_VERSION = 1;

type StoredSightingsEnvelope = { version: number; sightings: unknown };
type StoredSettingsEnvelope = { version: number; settings: unknown };
export type RestoreStatus = "empty" | "restored" | "legacy-migrated" | "corrupted" | "unsupported-version";
export type RestoreResult<T> = { value: T; status: RestoreStatus };

export async function withStorageRetry(operation: () => Promise<void>, attempts = 2): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt < Math.max(1, attempts); attempt += 1) {
    try {
      await operation();
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Falha persistente no armazenamento local");
}

export async function readStorageWithRetry<T>(operation: () => Promise<T>, attempts = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < Math.max(1, attempts); attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Falha persistente na leitura local");
}

export function serializeSettings(settings: Settings): string {
  return JSON.stringify({ version: STORAGE_VERSION, settings: sanitizeSettings(settings) });
}

export function restoreSettingsWithStatus(value: string | null, fallback: Settings): RestoreResult<Settings> {
  if (!value) return { value: fallback, status: "empty" };
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object") return { value: fallback, status: "corrupted" };
    const record = parsed as Partial<StoredSettingsEnvelope>;
    if ("version" in record) {
      return record.version === STORAGE_VERSION
        ? { value: sanitizeSettings(record.settings), status: "restored" }
        : { value: fallback, status: "unsupported-version" };
    }
    return { value: sanitizeSettings(parsed), status: "legacy-migrated" };
  } catch {
    return { value: fallback, status: "corrupted" };
  }
}

export function restoreSettings(value: string | null, fallback: Settings): Settings {
  return restoreSettingsWithStatus(value, fallback).value;
}

export function serializeSightings(sightings: Sighting[]): string {
  return JSON.stringify({ version: STORAGE_VERSION, sightings });
}

export function restoreSightingsWithStatus(value: string | null): RestoreResult<Sighting[]> {
  if (!value) return { value: [], status: "empty" };
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) return { value: sanitizeStoredSightings(parsed), status: "legacy-migrated" };
    if (!parsed || typeof parsed !== "object") return { value: [], status: "corrupted" };
    const envelope = parsed as Partial<StoredSightingsEnvelope>;
    if (envelope.version !== STORAGE_VERSION) return { value: [], status: "unsupported-version" };
    return { value: sanitizeStoredSightings(envelope.sightings), status: "restored" };
  } catch {
    return { value: [], status: "corrupted" };
  }
}

export function restoreSightings(value: string | null): Sighting[] {
  return restoreSightingsWithStatus(value).value;
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
