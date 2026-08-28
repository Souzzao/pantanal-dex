import { describe, expect, it } from "vitest";
import { filterSightings, sortSightings } from "../lib/sightings-filter";
import type { Sighting, Species } from "../shared/pantanal";

const catalog: Species[] = [
  { id: "capivara", commonName: "Capivara", scientificName: "Hydrochoerus hydrochaeris", group: "Mamíferos", environments: ["Áreas alagadas"], description: "", physicalCharacteristics: "", habitat: "", behavior: "", diet: "", curiosities: [], distribution: "", ecologicalImportance: "", images: [], sources: [] },
  { id: "tuiuiu", commonName: "Tuiuiú", scientificName: "Jabiru mycteria", group: "Aves", environments: ["Áreas alagadas"], description: "", physicalCharacteristics: "", habitat: "", behavior: "", diet: "", curiosities: [], distribution: "", ecologicalImportance: "", images: [], sources: [] },
];
function sighting(id: string, speciesId: string, date: string, visibility: Sighting["visibility"], locationLabel?: string, latitude?: number): Sighting { return { id, speciesId, date, locationLabel, latitude, locationPrecision: latitude === undefined ? "none" : "exact", visibility, createdAt: `${date}T10:00:00.000Z`, updatedAt: `${date}T10:00:00.000Z` }; }
const records = [sighting("1", "capivara", "2026-08-01", "private", "Baía das Pedras", -17.1), sighting("2", "tuiuiu", "2026-08-12", "shareable", "Corixo Azul"), sighting("3", "capivara", "2026-08-20", "shareable", "Rio Miranda", -19.5)];
const all = { query: "", dateFrom: "", dateTo: "", visibility: "all" as const, locatedOnly: false };

describe("sightings filter", () => {
  it("busca por nome sem sensibilidade a acentos e caixa", () => expect(filterSightings(records, catalog, { ...all, query: "tuiuiu" }).map((item) => item.id)).toEqual(["2"]));
  it("busca por local e observação indexados", () => expect(filterSightings(records, catalog, { ...all, query: "rio miranda" }).map((item) => item.id)).toEqual(["3"]));
  it("filtra intervalo de datas inclusivo", () => expect(filterSightings(records, catalog, { ...all, dateFrom: "2026-08-12", dateTo: "2026-08-20" }).map((item) => item.id)).toEqual(["2", "3"]));
  it("separa visibilidade e presença de coordenadas", () => expect(filterSightings(records, catalog, { ...all, visibility: "private", locatedOnly: true }).map((item) => item.id)).toEqual(["1"]));
  it("ordena por data e preserva a estabilidade em empates", () => { const sameDate = [sighting("b", "capivara", "2026-08-01", "private"), sighting("a", "tuiuiu", "2026-08-01", "private"), sighting("c", "capivara", "2026-08-20", "private")]; expect(sortSightings(sameDate, catalog, "date", "desc").map((item) => item.id)).toEqual(["c", "b", "a"]); expect(sortSightings(sameDate, catalog, "date", "asc").map((item) => item.id)).toEqual(["b", "a", "c"]); });
  it("ordena alfabeticamente por espécie e local", () => { expect(sortSightings(records, catalog, "species", "asc").map((item) => item.id)).toEqual(["1", "3", "2"]); expect(sortSightings(records, catalog, "location", "asc").map((item) => item.id)).toEqual(["1", "2", "3"]); });
  it("mantém todos os registros em volume elevado sem mutar a entrada", () => { const large = Array.from({ length: 3000 }, (_, index) => sighting(`large-${index}`, "capivara", "2026-08-01", "private")); const result = filterSightings(large, catalog, { ...all, visibility: "private" }); expect(result).toHaveLength(3000); expect(large).toHaveLength(3000); });
});
