import { describe, expect, it } from "vitest";

import { createExportCsv, createExportJson, mergeImportedSightings, parseImportJson } from "../shared/exports";
import { isValidCoordinate, isValidIsoDate, isValidTime, normalizeCatalogSearch, species, validateSpeciesCatalog, type Sighting } from "../shared/pantanal";

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
    for (const item of species) {
      expect(item.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(`${item.reviewedAt}T12:00:00Z`))).toBe(false);
    }
  });

  it("validates sighting dates, times, and coordinates", () => {
    expect(isValidIsoDate("2026-02-28")).toBe(true);
    expect(isValidIsoDate("2026-02-30")).toBe(false);
    expect(isValidIsoDate("2026-2-3")).toBe(false);
    expect(isValidTime("23:59")).toBe(true);
    expect(isValidTime("24:00")).toBe(false);
    expect(isValidTime("9:30")).toBe(false);
    expect(isValidCoordinate(0, 0)).toBe(true);
    expect(isValidCoordinate(90, 180)).toBe(true);
    expect(isValidCoordinate(90.1, 0)).toBe(false);
    expect(isValidCoordinate(0, -180.1)).toBe(false);
  });

  it("normalizes accents and surrounding whitespace for catalog search", () => {
    expect(normalizeCatalogSearch("  Onca-pintada ")).toBe("onca-pintada");
    expect(normalizeCatalogSearch("TUIUIÚ")).toBe("tuiuiu");
    expect(normalizeCatalogSearch("Panthera onca")).toBe("panthera onca");
  });

  it("reports incomplete species records", () => {
    const broken = [{ ...species[0], id: species[0].id, images: species[0].images.slice(0, 2), sources: [] }];
    const errors = validateSpeciesCatalog(broken);
    expect(errors).toContain("species[0](tuiuiu).images deve ter exatamente 3 imagens");
    expect(errors).toContain("species[0](tuiuiu).sources inválido");
  });

  it("rejects malformed image and source URLs", () => {
    const broken = [{ ...species[0], images: species[0].images.map((image, index) => index === 0 ? { ...image, uri: "not-a-url", sourceUrl: "not-a-url" } : image), sources: [{ title: "Fonte", url: "not-a-url" }] }];
    const errors = validateSpeciesCatalog(broken);
    expect(errors).toContain("species[0](tuiuiu).images[0] uri/sourceUrl inválida");
    expect(errors).toContain("species[0](tuiuiu).sources inválido");
  });

  it("reports duplicate image and source references", () => {
    const broken = [{ ...species[0], images: [species[0].images[0], species[0].images[0], species[0].images[2]], sources: [species[0].sources[0], species[0].sources[0]] }];
    const errors = validateSpeciesCatalog(broken);
    expect(errors).toContain("species[0](tuiuiu).images não pode repetir referências");
    expect(errors).toContain("species[0](tuiuiu).sources não pode repetir URLs");
  });

  it("reports partial runtime records without throwing", () => {
    const broken = [{ id: "broken" }] as unknown as typeof species;
    expect(() => validateSpeciesCatalog(broken)).not.toThrow();
    expect(validateSpeciesCatalog(broken)).toEqual(expect.arrayContaining([
      "species[0](broken).commonName ausente",
      "species[0](broken).images deve ter exatamente 3 imagens",
      "species[0](broken).sources inválido",
    ]));
  });

  it("keeps exactly three credited image references per species", () => {
    for (const item of species) {
      expect(item.images).toHaveLength(3);
      for (const image of item.images) {
        expect(image.sourceUrl).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
        expect(image.credit.trim()).not.toBe("");
        expect(image.license.trim()).not.toBe("");
      }
    }
  });

  it("exports sightings as versioned JSON without losing fields", () => {
    const exported = JSON.parse(createExportJson([sighting]));
    expect(exported.version).toBe("1.0");
    expect(exported.sightings).toEqual([sighting]);
  });

  it("quotes every CSV field with commas, quotes, and line breaks safely", () => {
    const complex = { ...sighting, id: "sighting,1", locationLabel: "Baía, das Garças", notes: "Linha 1\nLinha 2 com \"aspas\"" };
    const csv = createExportCsv([complex]);
    expect(csv.split("\n")).toHaveLength(3);
    expect(csv).toContain('"sighting,1","tuiuiu"');
    expect(csv).toContain('"Baía, das Garças"');
    expect(csv).toContain('"Linha 1\nLinha 2 com ""aspas"""');
  });

  it("exports a privacy-safe copy without mutating local records", () => {
    const shareable = { ...sighting, id: "shareable", visibility: "shareable" as const };
    const privateRecord = { ...sighting, id: "private" };
    const exported = JSON.parse(createExportJson([privateRecord, shareable], { shareableOnly: true, redactLocations: true }));
    expect(exported.sightings).toHaveLength(1);
    expect(exported.sightings[0]).toMatchObject({ id: "shareable", locationPrecision: "none" });
    expect(exported.sightings[0]).not.toHaveProperty("latitude");
    expect(exported.sightings[0]).not.toHaveProperty("longitude");
    expect(privateRecord.latitude).toBe(-16.25);
    expect(shareable.longitude).toBe(-56.65);
    const csv = createExportCsv([privateRecord, shareable], { shareableOnly: true, redactLocations: true });
    expect(csv).not.toContain("private");
    expect(csv).toContain('"shareable","tuiuiu"');
    expect(csv).toContain('"none"');
  });

  it("imports valid JSON sightings and skips malformed or unknown records", () => {
    const payload = JSON.stringify({ version: "1.0", sightings: [sighting, { ...sighting, id: "unknown", speciesId: "nao-existe" }, { ...sighting, id: "bad-date", date: "2026-02-30" }] });
    const result = parseImportJson(payload);
    expect(result.version).toBe("1.0");
    expect(result.sightings).toHaveLength(1);
    expect(result.sightings[0]).toMatchObject({ id: "sighting-1", speciesId: "tuiuiu" });
    expect(result.skipped).toBe(2);
  });

  it("deduplicates imported IDs against local data and within the file", () => {
    const duplicate = { ...sighting };
    const result = mergeImportedSightings([sighting], [duplicate, { ...sighting, id: "new-record" }]);
    expect(result.imported).toBe(1);
    expect(result.duplicates).toBe(1);
    expect(result.sightings.map((item) => item.id)).toEqual(["new-record", "sighting-1"]);
  });

  it("rejects JSON without the versioned sightings envelope", () => {
    expect(() => parseImportJson(JSON.stringify([{ ...sighting }]))).toThrow("lista de avistamentos");
    expect(() => parseImportJson("not-json")).toThrow();
  });

  it("accepts privacy-safe exports without coordinates", () => {
    const safe = JSON.parse(createExportJson([{ ...sighting, latitude: undefined, longitude: undefined, locationPrecision: "none" }], { redactLocations: true }));
    const result = parseImportJson(JSON.stringify(safe));
    expect(result.sightings).toHaveLength(1);
    expect(result.sightings[0].locationPrecision).toBe("none");
    expect(result.sightings[0].latitude).toBeUndefined();
  });

  it("quotes CSV fields and escapes notes safely", () => {
    const csv = createExportCsv([sighting]);
    expect(csv.split("\n")).toHaveLength(2);
    expect(csv).toContain('"sighting-1","tuiuiu","2026-08-21","07:30"');
    expect(csv).toContain('"Perto do ninho; observação com ""binóculo""."');
  });
});
