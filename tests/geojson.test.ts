import { describe, expect, it } from "vitest";

import { filterSpeciesCatalog } from "../shared/catalog";
import { createExportGeoJson, createExportGeoJsonObject } from "../shared/geojson";
import type { Sighting } from "../shared/pantanal";

const catalog = filterSpeciesCatalog();
const now = new Date("2026-11-06T22:00:00.000Z");

function sighting(overrides: Partial<Sighting>): Sighting {
  return {
    id: "s1",
    speciesId: "onca-pintada",
    date: "2026-11-05",
    locationPrecision: "exact",
    visibility: "private",
    createdAt: "2026-11-05T10:00:00.000Z",
    updatedAt: "2026-11-05T10:00:00.000Z",
    ...overrides,
  };
}

describe("exportação GeoJSON", () => {
  it("gera uma FeatureCollection válida com coordenadas na ordem [longitude, latitude]", () => {
    const result = createExportGeoJsonObject([sighting({ latitude: -16.4321, longitude: -56.8765 })], catalog, now);
    expect(result.type).toBe("FeatureCollection");
    expect(result.features).toHaveLength(1);
    expect(result.features[0]).toMatchObject({
      type: "Feature",
      id: "s1",
      geometry: { type: "Point", coordinates: [-56.8765, -16.4321] },
      properties: { speciesId: "onca-pintada", commonName: "Onça-pintada", scientificName: "Panthera onca", group: "Mamíferos" },
    });
    expect(result.pantanalDex).toMatchObject({ exportedAt: "2026-11-06T22:00:00.000Z", total: 1, withoutLocation: 0 });
  });

  it("aplica a proteção de localização a registros compartilháveis (grade de 0,01°)", () => {
    const result = createExportGeoJsonObject([sighting({ visibility: "shareable", latitude: -16.4321, longitude: -56.8765 })], catalog, now);
    expect(result.features[0].geometry.coordinates).toEqual([-56.88, -16.43]);
    expect(result.features[0].properties.locationPrecision).toBe("approximate");
  });

  it("não cria ponto para registro sem coordenada, mas conta no resumo", () => {
    const result = createExportGeoJsonObject([sighting({ id: "a" }), sighting({ id: "b", latitude: -18, longitude: -57 })], catalog, now);
    expect(result.features.map((feature) => feature.id)).toEqual(["b"]);
    expect(result.pantanalDex).toMatchObject({ total: 2, withoutLocation: 1 });
  });

  it("ignora coordenadas inválidas em vez de gerar geometria quebrada", () => {
    const result = createExportGeoJsonObject([sighting({ latitude: Number.NaN, longitude: -57 }), sighting({ id: "x", latitude: 120, longitude: -57 })], catalog, now);
    expect(result.features).toHaveLength(0);
    expect(result.pantanalDex.withoutLocation).toBe(2);
  });

  it("identifica registros \"Não sei\" sem inventar nome científico", () => {
    const result = createExportGeoJsonObject([sighting({ speciesId: "unknown", latitude: -18, longitude: -57 })], catalog, now);
    expect(result.features[0].properties).toMatchObject({ commonName: "Espécie não identificada", scientificName: null, group: null });
  });

  it("serializa para JSON que pode ser lido de volta", () => {
    const text = createExportGeoJson([sighting({ latitude: -18, longitude: -57, notes: "Perto do \"corixo\"" })], catalog, now);
    const parsed = JSON.parse(text) as { features: { properties: { notes: string } }[] };
    expect(parsed.features[0].properties.notes).toBe("Perto do \"corixo\"");
  });
});
