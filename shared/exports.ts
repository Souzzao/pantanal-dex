import { sanitizeStoredSightings, type Sighting } from "./pantanal";
import { roundToPublicLocationGrid } from "./location";

export const EXPORT_VERSION = "1.0";
export const EXPORT_CSV_HEADER = "id,speciesId,date,time,locationLabel,latitude,longitude,locationPrecision,quantity,notes,visibility";

export function toExportableSighting(sighting: Sighting): Sighting {
  if (sighting.visibility !== "shareable" || sighting.latitude === undefined || sighting.longitude === undefined) {
    return { ...sighting };
  }
  return {
    ...sighting,
    latitude: roundToPublicLocationGrid(sighting.latitude),
    longitude: roundToPublicLocationGrid(sighting.longitude),
    locationPrecision: "approximate",
  };
}

export function createExportJson(sightings: Sighting[]) {
  return JSON.stringify({ version: EXPORT_VERSION, exportedAt: new Date().toISOString(), sightings: sightings.map(toExportableSighting) }, null, 2);
}

export function parseExportJson(value: string): Sighting[] {
  try {
    const parsed = JSON.parse(value) as { version?: unknown; sightings?: unknown };
    if (parsed.version !== EXPORT_VERSION || !Array.isArray(parsed.sightings)) return [];
    return sanitizeStoredSightings(parsed.sightings);
  } catch {
    return [];
  }
}

export function createExportCsv(sightings: Sighting[]) {
  const header = EXPORT_CSV_HEADER;
  const rows = sightings.map(toExportableSighting).map((sighting) =>
    [
      sighting.id,
      sighting.speciesId,
      sighting.date,
      sighting.time ?? "",
      sighting.locationLabel ?? "",
      sighting.latitude ?? "",
      sighting.longitude ?? "",
      sighting.locationPrecision,
      sighting.quantity ?? "",
      (sighting.notes ?? "").replaceAll('"', '""'),
      sighting.visibility,
    ]
      .map((value) => `"${value}"`)
      .join(","),
  );
  return [header, ...rows].join("\n");
}
