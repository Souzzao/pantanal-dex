import { describe, expect, it } from "vitest";

import { filterSpeciesCatalog } from "../shared/catalog";
import { createExportCsv, createExportJson, parseExportJson } from "../shared/exports";
import { mergeSightings, restoreSightings, serializeSightings } from "../shared/persistence";
import type { Sighting } from "../shared/pantanal";

const base: Sighting = {
  id: "flow-1",
  speciesId: "tuiuiu",
  date: "2026-08-21",
  time: "07:30",
  locationLabel: "Baía",
  latitude: -16.25,
  longitude: -56.65,
  locationPrecision: "exact",
  quantity: 1,
  notes: "Observação inicial",
  visibility: "private",
  createdAt: "2026-08-21T07:30:00.000Z",
  updatedAt: "2026-08-21T07:30:00.000Z",
};

describe("PantanalDex field flow", () => {
  it("discovers species from the modular catalog in field search", () => {
    expect(filterSpeciesCatalog({ query: "jaú" }).some((item) => item.id === "jau")).toBe(true);
    expect(filterSpeciesCatalog({ query: "jataí" }).some((item) => item.id === "abelha-jatai")).toBe(true);
  });

  it("round-trips a local sighting through update, storage and export", () => {
    const updated = { ...base, notes: "Observação revisada", updatedAt: "2026-08-21T08:00:00.000Z" };
    const merged = mergeSightings([base], [updated]);
    expect(merged.updated).toBe(1);
    expect(merged.sightings[0].notes).toBe("Observação revisada");

    const restored = restoreSightings(serializeSightings(merged.sightings));
    expect(restored).toEqual(merged.sightings);
    expect(parseExportJson(createExportJson(restored))).toHaveLength(1);
    expect(createExportCsv(restored)).toContain('"flow-1","tuiuiu"');
  });

  it("keeps local data when an imported record is older or malformed", () => {
    const older = { ...base, notes: "versão antiga", updatedAt: "2026-08-20T08:00:00.000Z" };
    const result = mergeSightings([base], [older, { id: "broken" } as Sighting]);
    expect(result.updated).toBe(0);
    expect(result.skipped).toBe(1);
    expect(result.sightings).toEqual([base]);
  });
});
