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

/** Aspas duplicadas conforme RFC 4180; vale para todas as colunas, não só observações. */
const csvCell = (value: string | number | undefined) => `"${String(value ?? "").replaceAll('"', '""')}"`;

/**
 * Texto livre digitado pela pessoa: se começar com =, +, -, @, tab ou CR, planilhas (Excel, Google
 * Planilhas, LibreOffice) podem executá-lo como fórmula ("CSV injection", OWASP). O apóstrofo inicial
 * faz a planilha tratar o conteúdo como texto. Não se aplica a números (latitude negativa continua número).
 */
const csvText = (value: string | undefined) => csvCell(value && /^[=+\-@\t\r]/.test(value) ? `'${value}` : value);

export function createExportCsv(sightings: Sighting[]) {
  const header = EXPORT_CSV_HEADER;
  const rows = sightings.map(toExportableSighting).map((sighting) =>
    [
      csvCell(sighting.id),
      csvCell(sighting.speciesId),
      csvCell(sighting.date),
      csvCell(sighting.time),
      csvText(sighting.locationLabel),
      csvCell(sighting.latitude),
      csvCell(sighting.longitude),
      csvCell(sighting.locationPrecision),
      csvCell(sighting.quantity),
      csvText(sighting.notes),
      csvCell(sighting.visibility),
    ].join(","),
  );
  return [header, ...rows].join("\n");
}
