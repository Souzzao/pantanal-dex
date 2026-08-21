import type { LocationPrecision, Sighting, Visibility } from "./pantanal";
import { isValidCoordinate, isValidIsoDate, isValidTime, species } from "./pantanal";

type ExportOptions = { shareableOnly?: boolean; redactLocations?: boolean };

function prepareSightings(sightings: Sighting[], options: ExportOptions) {
  const filtered = options.shareableOnly ? sightings.filter((sighting) => sighting.visibility === "shareable") : sightings;
  return options.redactLocations
    ? filtered.map((sighting) => ({ ...sighting, latitude: undefined, longitude: undefined, locationPrecision: "none" as const }))
    : filtered;
}

export function createExportJson(sightings: Sighting[], options: ExportOptions = {}) {
  return JSON.stringify({ version: "1.0", exportedAt: new Date().toISOString(), sightings: prepareSightings(sightings, options) }, null, 2);
}

function escapeCsvValue(value: string | number | undefined) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function createExportCsv(sightings: Sighting[], options: ExportOptions = {}) {
  const header = "id,speciesId,date,time,locationLabel,latitude,longitude,locationPrecision,quantity,notes,visibility";
  const rows = prepareSightings(sightings, options).map((sighting) =>
    [sighting.id, sighting.speciesId, sighting.date, sighting.time, sighting.locationLabel, sighting.latitude, sighting.longitude, sighting.locationPrecision, sighting.quantity, sighting.notes, sighting.visibility]
      .map(escapeCsvValue)
      .join(","),
  );
  return [header, ...rows].join("\n");
}

const precisions: LocationPrecision[] = ["exact", "approximate", "municipality", "none"];
const visibilities: Visibility[] = ["private", "shareable"];
const knownSpeciesIds = new Set(species.map((item) => item.id));

function optionalString(value: unknown) {
  return value === undefined || value === null || value === "" ? undefined : typeof value === "string" ? value : null;
}

function optionalNumber(value: unknown) {
  return value === undefined || value === null || value === "" ? undefined : typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeImportedSighting(value: unknown): Sighting | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (typeof item.id !== "string" || !item.id.trim() || typeof item.speciesId !== "string" || !knownSpeciesIds.has(item.speciesId)) return null;
  if (typeof item.date !== "string" || !isValidIsoDate(item.date)) return null;
  if (item.time !== undefined && (typeof item.time !== "string" || !isValidTime(item.time))) return null;
  if (typeof item.locationPrecision !== "string" || !precisions.includes(item.locationPrecision as LocationPrecision)) return null;
  if (typeof item.visibility !== "string" || !visibilities.includes(item.visibility as Visibility)) return null;
  const latitude = optionalNumber(item.latitude);
  const longitude = optionalNumber(item.longitude);
  if (latitude === null || longitude === null || (latitude !== undefined && longitude !== undefined && !isValidCoordinate(latitude, longitude))) return null;
  if ((latitude === undefined) !== (longitude === undefined)) return null;
  const quantity = optionalNumber(item.quantity);
  if (quantity === null || (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 1))) return null;
  const photoUri = optionalString(item.photoUri);
  const locationLabel = optionalString(item.locationLabel);
  const notes = optionalString(item.notes);
  if (photoUri === null || locationLabel === null || notes === null) return null;
  const createdAt = typeof item.createdAt === "string" && !Number.isNaN(Date.parse(item.createdAt)) ? item.createdAt : new Date().toISOString();
  const updatedAt = typeof item.updatedAt === "string" && !Number.isNaN(Date.parse(item.updatedAt)) ? item.updatedAt : createdAt;
  return { id: item.id, speciesId: item.speciesId, date: item.date, time: item.time as string | undefined, photoUri, locationLabel, latitude, longitude, locationPrecision: item.locationPrecision as LocationPrecision, quantity, notes, visibility: item.visibility as Visibility, createdAt, updatedAt };
}

export function mergeImportedSightings(existing: Sighting[], imported: Sighting[]) {
  const ids = new Set(existing.map((item) => item.id));
  const fresh = imported.filter((item) => {
    if (ids.has(item.id)) return false;
    ids.add(item.id);
    return true;
  });
  return { sightings: [...fresh, ...existing], imported: fresh.length, duplicates: imported.length - fresh.length };
}

export function parseImportJson(raw: string): { sightings: Sighting[]; skipped: number; version: string } {
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || !Array.isArray((parsed as { sightings?: unknown }).sightings)) throw new Error("Arquivo incompatível: lista de avistamentos não encontrada.");
  const payload = parsed as { version?: unknown; sightings: unknown[] };
  const sightings = payload.sightings.map(normalizeImportedSighting).filter((item): item is Sighting => item !== null);
  return { sightings, skipped: payload.sightings.length - sightings.length, version: typeof payload.version === "string" ? payload.version : "desconhecida" };
}
