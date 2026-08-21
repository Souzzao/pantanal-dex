import type { Sighting } from "./pantanal";

const roundCoordinate = (value: number) => Math.round(value * 100) / 100;

export function toExportableSighting(sighting: Sighting): Sighting {
  if (sighting.visibility !== "shareable" || sighting.latitude === undefined || sighting.longitude === undefined) {
    return { ...sighting };
  }
  return {
    ...sighting,
    latitude: roundCoordinate(sighting.latitude),
    longitude: roundCoordinate(sighting.longitude),
    locationPrecision: "approximate",
  };
}

export function createExportJson(sightings: Sighting[]) {
  return JSON.stringify({ version: "1.0", exportedAt: new Date().toISOString(), sightings: sightings.map(toExportableSighting) }, null, 2);
}

export function createExportCsv(sightings: Sighting[]) {
  const header = "id,speciesId,date,time,locationLabel,latitude,longitude,locationPrecision,quantity,notes,visibility";
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
