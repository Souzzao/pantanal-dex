import type { Sighting } from "./pantanal";

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
    [
      sighting.id,
      sighting.speciesId,
      sighting.date,
      sighting.time,
      sighting.locationLabel,
      sighting.latitude,
      sighting.longitude,
      sighting.locationPrecision,
      sighting.quantity,
      sighting.notes,
      sighting.visibility,
    ]
      .map(escapeCsvValue)
      .join(","),
  );
  return [header, ...rows].join("\n");
}
