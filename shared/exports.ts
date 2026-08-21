import type { Sighting } from "./pantanal";

export function createExportJson(sightings: Sighting[]) {
  return JSON.stringify({ version: "1.0", exportedAt: new Date().toISOString(), sightings }, null, 2);
}

function escapeCsvValue(value: string | number | undefined) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function createExportCsv(sightings: Sighting[]) {
  const header = "id,speciesId,date,time,locationLabel,latitude,longitude,locationPrecision,quantity,notes,visibility";
  const rows = sightings.map((sighting) =>
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
      sighting.notes,
      sighting.visibility,
    ]
      .map(escapeCsvValue)
      .join(","),
  );
  return [header, ...rows].join("\n");
}
