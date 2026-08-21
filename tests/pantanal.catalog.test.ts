import { describe, expect, it } from "vitest";
import { environments, groups, normalizeCatalogSearch, species } from "../shared/pantanal";
import { catalogBatches, catalogSpecies, catalogValidationErrors } from "../shared/catalog";
import { validateCatalogBatch } from "../shared/catalog/types";

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

  it("integrates the modular catalog batches without validation errors", () => {
    expect(catalogBatches.length).toBeGreaterThan(0);
    expect(catalogSpecies).toHaveLength(13);
    expect(catalogValidationErrors).toEqual([]);
    expect(validateCatalogBatch(catalogBatches[0])).toEqual([]);
    expect(species.some((item) => item.id === "lobo-guara")).toBe(true);
    expect(species.some((item) => item.id === "anhuma")).toBe(true);
    expect(species.some((item) => item.id === "teiu")).toBe(true);
    expect(species.some((item) => item.id === "perereca-macaco")).toBe(true);
    expect(species.some((item) => item.id === "pintado")).toBe(true);
  });

  it("rejects a batch with inconsistent scientific vocabularies", () => {
    const batch = { ...catalogBatches[0], species: [{ ...catalogSpecies[0], group: "Aves" as const, environments: ["oceano" as never], images: catalogSpecies[0].images.map((image, index) => index === 0 ? { ...image, uri: "arquivo-local" } : image) }] };
    expect(validateCatalogBatch(batch)).toEqual(expect.arrayContaining([expect.stringContaining("grupo não corresponde"), expect.stringContaining("ambiente inválido"), expect.stringContaining("imagem sem URL HTTP válida")]));
  });

  it("rejects commercial-incompatible image licenses and unapproved sources", () => {
    const batch = { ...catalogBatches[0], sources: [{ title: "IUCN", url: "https://www.iucnredlist.org/species/123" }], species: [{ ...catalogSpecies[0], images: catalogSpecies[0].images.map((image, index) => index === 0 ? { ...image, license: "CC BY-NC 4.0" } : image) }] };
    expect(validateCatalogBatch(batch)).toEqual(expect.arrayContaining([expect.stringContaining("incompatível com uso comercial"), expect.stringContaining("fonte do lote fora da lista aprovada")]));
  });

  it("normalizes accents and surrounding whitespace for field search", () => {
    expect(normalizeCatalogSearch("  Onca-pintada ")).toBe("onca-pintada");
    expect(normalizeCatalogSearch("TUIUIÚ")).toBe("tuiuiu");
    expect(normalizeCatalogSearch("Panthera onca")).toBe("panthera onca");
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
        expect(image.sourceUrl).toMatch(/^https?:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      }
    }
  });
});
