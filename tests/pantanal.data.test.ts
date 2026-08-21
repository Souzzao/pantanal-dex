import { describe, expect, it } from "vitest";

import { mergeSightings, restoreSightings, serializeSightings } from "../shared/persistence";
import { createCatalogLoader } from "../shared/catalog-loader";
import { filterSpeciesCatalog, paginateSpeciesCatalog, sortSpeciesCatalog } from "../shared/catalog";
import { currentCatalogBatch, mergeCatalogBatch, validateCatalogBatch } from "../shared/catalog-batches";
import { createExportCsv, createExportJson, EXPORT_CSV_HEADER, parseExportJson, toExportableSighting } from "../shared/exports";
import { isValidCoordinatePair, isValidSightingDate, isValidSightingTime, sanitizeSettings, sanitizeStoredSightings, species, validateSpeciesCatalog, type Sighting } from "../shared/pantanal";

const sighting: Sighting = {
  id: "sighting-1",
  speciesId: "tuiuiu",
  date: "2026-08-21",
  time: "07:30",
  locationLabel: "Baía das Garças",
  latitude: -16.25,
  longitude: -56.65,
  locationPrecision: "approximate",
  quantity: 2,
  notes: 'Perto do ninho; observação com "binóculo".',
  visibility: "private",
  createdAt: "2026-08-21T07:30:00.000Z",
  updatedAt: "2026-08-21T07:30:00.000Z",
};

describe("PantanalDex data contracts", () => {
  it("validates the expanded species catalog without errors", () => {
    expect(species.length).toBeGreaterThanOrEqual(20);
    expect(validateSpeciesCatalog()).toEqual([]);
    expect(new Set(species.map((item) => item.group))).toEqual(
      new Set(["Mamíferos", "Aves", "Répteis", "Anfíbios", "Peixes", "Invertebrados"]),
    );
  });

  it("reports incomplete species records", () => {
    const broken = [{ ...species[0], id: species[0].id, images: species[0].images.slice(0, 2), sources: [] }];
    const errors = validateSpeciesCatalog(broken);
    expect(errors).toContain("species[0](tuiuiu).images deve ter pelo menos 3 imagens");
    expect(errors).toContain("species[0](tuiuiu).sources inválido");
  });

  it("reports invalid editorial URLs", () => {
    const broken = [{ ...species[0], images: [{ ...species[0].images[0], sourceUrl: "javascript:alert(1)" }, ...species[0].images.slice(1)], sources: [{ title: "Fonte", url: "not-a-url" }] }];
    const errors = validateSpeciesCatalog(broken);
    expect(errors).toContain("species[0](tuiuiu).images[0] sem crédito/licença/fonte completos");
    expect(errors).toContain("species[0](tuiuiu).sources inválido");
  });

  it("keeps the catalog IDs unique and editorially valid", () => {
    expect(new Set(species.map((item) => item.id)).size).toBe(species.length);
    expect(validateSpeciesCatalog(species)).toEqual([]);
  });

  it("validates and merges scientific catalog batches deterministically", () => {
    expect(validateCatalogBatch(currentCatalogBatch)).toEqual([]);
    const sample = currentCatalogBatch.species.slice(0, 1);
    const merged = mergeCatalogBatch([], { ...currentCatalogBatch, id: "test-batch", species: sample });
    expect(merged.added).toBe(1);
    expect(mergeCatalogBatch(merged.species, { ...currentCatalogBatch, id: "test-batch-2", species: sample }).skipped).toBe(1);
    expect(validateCatalogBatch({ id: "", version: 0, source: "coordenacao", species: [] })).not.toEqual([]);
  });

  it("loads modular batches with deterministic deduplication and paging", () => {
    const loader = createCatalogLoader([[species[0], species[1]], [species[1], species[2]]]);
    expect(loader.size).toBe(3);
    expect(loader.search({ query: "tuiuíu" }).map((item) => item.id)).toEqual(["tuiuiu"]);
    expect(loader.page({}, 0, 2, "name")).toHaveLength(2);
    expect(loader.page({}, 99, 2)).toEqual([]);
  });

  it("searches the catalog without accents and paginates deterministically", () => {
    expect(filterSpeciesCatalog({ query: "ariranha" }).map((item) => item.id)).toContain("ariranha");
    expect(filterSpeciesCatalog({ query: "tuiuíu" }).map((item) => item.id)).toContain("tuiuiu");
    const sorted = sortSpeciesCatalog(species, "name");
    expect(paginateSpeciesCatalog(sorted, 0, 5)).toHaveLength(5);
    expect(paginateSpeciesCatalog(sorted, 999, 5)).toEqual([]);
  });

  it("exports sightings as versioned JSON without losing fields", () => {
    const exported = JSON.parse(createExportJson([sighting]));
    expect(exported.version).toBe("1.0");
    expect(exported.sightings).toEqual([sighting]);
  });

  it("quotes CSV fields and escapes notes safely", () => {
    const csv = createExportCsv([sighting]);
    expect(csv.split("\n")).toHaveLength(2);
    expect(csv).toContain('"sighting-1","tuiuiu","2026-08-21","07:30"');
    expect(csv).toContain('"Perto do ninho; observação com ""binóculo""."');
  });

  it("drops malformed stored sightings without crashing the app", () => {
    expect(sanitizeStoredSightings(null)).toEqual([]);
    expect(sanitizeStoredSightings([{ ...sighting, speciesId: "species-inexistente" }, sighting, { broken: true }])).toEqual([sighting]);
  });

  it("repairs invalid settings and preserves only supported languages", () => {
    expect(sanitizeSettings({ defaultLanguage: "Klingon", quickLanguages: ["English", "English", "Unknown"] })).toEqual({ defaultLanguage: "English", quickLanguages: ["English"] });
    expect(sanitizeSettings({})).toEqual({ defaultLanguage: "Português", quickLanguages: ["Português", "English"] });
  });

  it("validates field dates, times, and coordinate bounds", () => {
    expect(isValidSightingDate("2026-02-28")).toBe(true);
    expect(isValidSightingDate("2026-02-30")).toBe(false);
    expect(isValidSightingDate("21/08/2026")).toBe(false);
    expect(isValidSightingTime("")).toBe(true);
    expect(isValidSightingTime("23:59")).toBe(true);
    expect(isValidSightingTime("24:00")).toBe(false);
    expect(isValidCoordinatePair(-16.25, -56.65)).toBe(true);
    expect(isValidCoordinatePair(91, -56.65)).toBe(false);
    expect(isValidCoordinatePair(undefined, -56.65)).toBe(false);
  });

  it("rejects corrupted sighting quantities, coordinates, dates, and times", () => {
    const invalid = [
      { ...sighting, quantity: 0 },
      { ...sighting, quantity: 1.5 },
      { ...sighting, latitude: 120 },
      { ...sighting, date: "2026-02-30" },
      { ...sighting, time: "25:00" },
    ];
    expect(sanitizeStoredSightings([...invalid, sighting])).toEqual([sighting]);
  });

  it("restores valid local JSON and safely recovers from corruption", () => {
    const serialized = serializeSightings([sighting]);
    expect(JSON.parse(serialized).version).toBe(1);
    expect(restoreSightings(serialized)).toEqual([sighting]);
    expect(restoreSightings(JSON.stringify([sighting]))).toEqual([sighting]);
    expect(restoreSightings(JSON.stringify({ version: 99, sightings: [sighting] }))).toEqual([]);
    expect(restoreSightings("{not-json")).toEqual([]);
    expect(restoreSightings(null)).toEqual([]);
    expect(restoreSightings(JSON.stringify([{ ...sighting, longitude: 250 }]))).toEqual([]);
  });

  it("exports without mutating the local sighting collection", () => {
    const source = [{ ...sighting }];
    createExportJson(source);
    createExportCsv(source);
    expect(source).toEqual([sighting]);
  });

  it("masks exact coordinates for shareable records", () => {
    const shareable = { ...sighting, visibility: "shareable" as const, locationPrecision: "exact" as const, latitude: -16.2537, longitude: -56.6519 };
    const exportable = toExportableSighting(shareable);
    expect(exportable.latitude).toBe(-16.25);
    expect(exportable.longitude).toBe(-56.65);
    expect(exportable.locationPrecision).toBe("approximate");
    expect(JSON.parse(createExportJson([shareable])).sightings[0].latitude).toBe(-16.25);
    expect(createExportCsv([shareable])).toContain('"-16.25","-56.65","approximate"');
  });

  it("validates exported JSON and preserves the CSV header contract", () => {
    const json = createExportJson([sighting]);
    expect(parseExportJson(json)).toEqual([sighting]);
    expect(parseExportJson(JSON.stringify({ version: "0.9", sightings: [sighting] }))).toEqual([]);
    expect(parseExportJson("not-json")).toEqual([]);
    expect(createExportCsv([sighting]).split("\n")[0]).toBe(EXPORT_CSV_HEADER);
  });

  it("merges imported sightings by id and keeps the newest version", () => {
    const newer = { ...sighting, notes: "atualizado", updatedAt: "2026-08-21T10:00:00.000Z" };
    const added = { ...sighting, id: "sighting-2", updatedAt: "2026-08-21T09:00:00.000Z" };
    const result = mergeSightings([sighting], [newer, added, { ...sighting, id: "bad", quantity: -1 }]);
    expect(result.added).toBe(1);
    expect(result.updated).toBe(1);
    expect(result.skipped).toBe(1);
    expect(result.sightings.find((item) => item.id === sighting.id)?.notes).toBe("atualizado");
    expect(result.sightings.some((item) => item.id === "sighting-2")).toBe(true);
  });
});
