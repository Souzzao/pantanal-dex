import { describe, expect, it } from "vitest";
import { environments, groups, species } from "../shared/pantanal";

describe("PantanalDex catalog", () => {
  it("contains at least 20 species across all supported groups and environments", () => {
    expect(species.length).toBeGreaterThanOrEqual(20);
    expect(new Set(species.map((item) => item.id)).size).toBe(species.length);
    for (const group of groups) {
      expect(species.some((item) => item.group === group)).toBe(true);
    }
    for (const environment of environments) {
      expect(species.some((item) => item.environments.includes(environment))).toBe(true);
    }
  });

  it("keeps the required scientific fields populated", () => {
    for (const item of species) {
      expect(item.commonName.trim()).not.toBe("");
      expect(item.scientificName.trim()).not.toBe("");
      expect(item.description.trim()).not.toBe("");
      expect(item.physicalCharacteristics.trim()).not.toBe("");
      expect(item.habitat.trim()).not.toBe("");
      expect(item.behavior.trim()).not.toBe("");
      expect(item.diet.trim()).not.toBe("");
      expect(item.distribution.trim()).not.toBe("");
      expect(item.ecologicalImportance.trim()).not.toBe("");
      expect(item.curiosities.length).toBeGreaterThan(0);
      expect(item.sources.length).toBeGreaterThan(0);
    }
  });

  it("keeps three credited and licensed image references per species", () => {
    for (const item of species) {
      expect(item.images).toHaveLength(3);
      for (const image of item.images) {
        expect(image.uri).toMatch(/^https?:\/\//);
        expect(image.author.trim()).not.toBe("");
        expect(image.license.trim()).not.toBe("");
        expect(image.credit.trim()).not.toBe("");
        expect(image.sourceUrl).toMatch(/^https?:\/\//);
      }
    }
  });
});
