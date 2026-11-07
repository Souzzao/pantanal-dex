import { toExportableSighting, EXPORT_VERSION } from "./exports";
import type { Sighting, Species } from "./pantanal";

/**
 * Exportação GeoJSON (RFC 7946) do caderno, prometida no pitch ("exportação de seus dados geojson").
 *
 * Usa a mesma regra de privacidade do JSON/CSV (`toExportableSighting`): registros compartilháveis
 * saem na célula de 0,1°; registros pessoais com coordenada exata só chegam aqui depois da
 * confirmação explícita feita pela tela de Configurações.
 * Registros sem coordenada não viram pontos, mas são contados em `pantanalDex.withoutLocation`.
 */

export type GeoJsonPointFeature = {
  type: "Feature";
  id: string;
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: {
    speciesId: string;
    commonName: string;
    scientificName: string | null;
    group: string | null;
    date: string;
    time: string | null;
    locationLabel: string | null;
    locationPrecision: Sighting["locationPrecision"];
    quantity: number | null;
    notes: string | null;
    visibility: Sighting["visibility"];
  };
};

export type PantanalDexGeoJson = {
  type: "FeatureCollection";
  features: GeoJsonPointFeature[];
  /** Membro externo permitido pela RFC 7946 §6.1: metadados da extração (RF13: licença e data). */
  pantanalDex: {
    version: string;
    exportedAt: string;
    total: number;
    withoutLocation: number;
    coordinateNote: string;
    license: string;
  };
};

const UNIDENTIFIED = "Espécie não identificada";

const isCoordinate = (value: unknown, limit: number): value is number =>
  typeof value === "number" && Number.isFinite(value) && Math.abs(value) <= limit;

/** Remove ruído de ponto flutuante das coordenadas já arredondadas para a grade de 0,1° (ex.: -16.400000000000002). */
const tidy = (value: number, precision: Sighting["locationPrecision"]) => (precision === "approximate" ? Number(value.toFixed(1)) : value);

export function createExportGeoJsonObject(
  sightings: readonly Sighting[],
  catalog: readonly Species[],
  now: Date = new Date(),
): PantanalDexGeoJson {
  const byId = new Map(catalog.map((item) => [item.id, item]));
  const features: GeoJsonPointFeature[] = [];
  let withoutLocation = 0;

  for (const original of sightings) {
    const sighting = toExportableSighting(original);
    if (!isCoordinate(sighting.latitude, 90) || !isCoordinate(sighting.longitude, 180)) {
      withoutLocation += 1;
      continue;
    }
    const species = byId.get(sighting.speciesId);
    features.push({
      type: "Feature",
      id: sighting.id,
      // RFC 7946: ordem [longitude, latitude].
      geometry: { type: "Point", coordinates: [tidy(sighting.longitude, sighting.locationPrecision), tidy(sighting.latitude, sighting.locationPrecision)] },
      properties: {
        speciesId: sighting.speciesId,
        commonName: species?.commonName ?? UNIDENTIFIED,
        scientificName: species?.scientificName ?? null,
        group: species?.group ?? null,
        date: sighting.date,
        time: sighting.time ?? null,
        locationLabel: sighting.locationLabel ?? null,
        locationPrecision: sighting.locationPrecision,
        quantity: sighting.quantity ?? null,
        notes: sighting.notes ?? null,
        visibility: sighting.visibility,
      },
    });
  }

  return {
    type: "FeatureCollection",
    features,
    pantanalDex: {
      version: EXPORT_VERSION,
      exportedAt: now.toISOString(),
      total: sightings.length,
      withoutLocation,
      coordinateNote: "Registros compartilháveis têm as coordenadas arredondadas para a grade de 0,1° (~11 km). Registros pessoais podem conter a coordenada exata informada pelo autor.",
      license: "Dados pessoais de observação exportados pelo próprio autor a partir do PantanalDex.",
    },
  };
}

export function createExportGeoJson(sightings: readonly Sighting[], catalog: readonly Species[], now?: Date): string {
  return JSON.stringify(createExportGeoJsonObject(sightings, catalog, now), null, 2);
}
