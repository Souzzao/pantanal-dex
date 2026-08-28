import { describe, expect, it } from "vitest";
import { summarizeSightings } from "../lib/sightings-summary";
import type { Sighting, Species } from "../shared/pantanal";

const catalog: Species[] = [
  { id: "capivara", commonName: "Capivara", scientificName: "Hydrochoerus hydrochaeris", group: "Mamíferos", environments: ["Áreas alagadas"], description: "", physicalCharacteristics: "", habitat: "", behavior: "", diet: "", curiosities: [], distribution: "", ecologicalImportance: "", images: [], sources: [] },
  { id: "tuiuiu", commonName: "Tuiuiú", scientificName: "Jabiru mycteria", group: "Aves", environments: ["Áreas alagadas"], description: "", physicalCharacteristics: "", habitat: "", behavior: "", diet: "", curiosities: [], distribution: "", ecologicalImportance: "", images: [], sources: [] },
];
function make(id: string, speciesId: string, date: string, visibility: Sighting["visibility"], latitude?: number): Sighting { return { id, speciesId, date, latitude, locationPrecision: latitude === undefined ? "none" : "exact", visibility, createdAt: `${date}T00:00:00Z`, updatedAt: `${date}T00:00:00Z` }; }

describe("sightings summary", () => {
  it("agrega total, espécies, GPS, visibilidade e período", () => { const result = summarizeSightings([make("1", "capivara", "2026-08-03", "private", -17), make("2", "capivara", "2026-08-10", "shareable"), make("3", "tuiuiu", "2026-08-20", "shareable", -18)], catalog); expect(result).toMatchObject({ total: 3, located: 2, privateCount: 1, shareableCount: 2, speciesCount: 2, earliestDate: "2026-08-03", latestDate: "2026-08-20" }); expect(result.bySpecies[0]).toMatchObject({ speciesId: "capivara", count: 2 }); });
  it("não retorna conteúdo privado individual", () => { const result = summarizeSightings([{ ...make("1", "capivara", "2026-08-03", "private"), notes: "local secreto", locationLabel: "coordenada sensível" }], catalog); expect(JSON.stringify(result)).not.toContain("local secreto"); expect(JSON.stringify(result)).not.toContain("coordenada sensível"); });
  it("retorna resumo neutro para caderno vazio", () => expect(summarizeSightings([], catalog)).toEqual({ total: 0, located: 0, privateCount: 0, shareableCount: 0, speciesCount: 0, earliestDate: undefined, latestDate: undefined, bySpecies: [] }));
  it("processa 3.000 registros sem alterar a coleção", () => { const records = Array.from({ length: 3000 }, (_, index) => make(String(index), "capivara", "2026-08-01", "private")); const result = summarizeSightings(records, catalog); expect(result.total).toBe(3000); expect(result.bySpecies).toHaveLength(1); expect(records).toHaveLength(3000); });
});
