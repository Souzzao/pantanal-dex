import { describe, expect, it } from "vitest";

import { createExportCsv, createExportJson } from "../shared/exports";
import { sanitizeSettings, sanitizeStoredSightings, species, validateSpeciesCatalog, type Sighting } from "../shared/pantanal";

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
});
