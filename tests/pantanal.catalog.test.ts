import { describe, expect, it } from "vitest";
import { environments, groups, normalizeCatalogSearch, species, speciesMatchesCatalogSearch } from "../shared/pantanal";
import { catalogSpeciesByEnvironment, catalogSpeciesByGroup } from "../shared/catalog";
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
    expect(catalogSpecies).toHaveLength(55);
    expect(catalogValidationErrors).toEqual([]);
    expect(validateCatalogBatch(catalogBatches[0])).toEqual([]);
    expect(species.some((item) => item.id === "lobo-guara")).toBe(true);
    expect(species.some((item) => item.id === "anhuma")).toBe(true);
    expect(species.some((item) => item.id === "teiu")).toBe(true);
    expect(species.some((item) => item.id === "perereca-macaco")).toBe(true);
    expect(species.some((item) => item.id === "pintado")).toBe(true);
    expect(species.some((item) => item.id === "morpho-menelaus")).toBe(true);
    expect(species.some((item) => item.id === "tetragonisca-angustula")).toBe(true);
    expect(species.some((item) => item.id === "paraponera-clavata")).toBe(true);
    expect(species.some((item) => item.id === "atta-sexdens")).toBe(true);
    expect(species.some((item) => item.id === "cairina-moschata")).toBe(true);
    expect(species.some((item) => item.id === "penelope-superciliaris")).toBe(true);
    expect(species.some((item) => item.id === "aramides-cajaneus")).toBe(true);
    expect(species.some((item) => item.id === "hoplias-malabaricus")).toBe(true);
    expect(species.some((item) => item.id === "prochilodus-lineatus")).toBe(true);
    expect(species.some((item) => item.id === "leporinus-friderici")).toBe(true);
    expect(species.some((item) => item.id === "brycon-hilarii")).toBe(true);
    expect(species.some((item) => item.id === "myloplus-tiete")).toBe(true);
    expect(species.some((item) => item.id === "gymnotus-carapo")).toBe(true);
    expect(species.some((item) => item.id === "caligo-eurilochus")).toBe(true);
    expect(species.some((item) => item.id === "danaus-gilippus")).toBe(true);
    expect(species.some((item) => item.id === "jabiru-mycteria")).toBe(true);
    expect(species.some((item) => item.id === "anodorhynchus-hyacinthinus")).toBe(true);
    expect(species.some((item) => item.id === "tigrisoma-lineatum")).toBe(true);
    expect(species.some((item) => item.id === "syrigma-sibilatrix")).toBe(true);
    expect(species.some((item) => item.id === "megaceryle-torquata")).toBe(true);
    expect(species.some((item) => item.id === "ardea-alba")).toBe(true);
    expect(species.some((item) => item.id === "pimelodus-maculatus")).toBe(true);
    expect(species.some((item) => item.id === "loricariichthys-anus")).toBe(true);
    expect(species.some((item) => item.id === "corydoras-paleatus")).toBe(true);
    expect(species.some((item) => item.id === "pseudoplatystoma-reticulatum")).toBe(true);
    expect(species.some((item) => item.id === "cichla-piquiti")).toBe(true);
    expect(species.some((item) => item.id === "piaractus-brachypomus")).toBe(true);
    expect(species.some((item) => item.id === "heliconius-erato")).toBe(true);
    expect(species.some((item) => item.id === "papilio-thoas")).toBe(true);
    expect(species.some((item) => item.id === "bombus-pauloensis")).toBe(true);
    expect(species.some((item) => item.id === "egretta-thula")).toBe(true);
    expect(species.some((item) => item.id === "pitangus-sulphuratus")).toBe(true);
    expect(species.some((item) => item.id === "sicalis-flaveola")).toBe(true);
    expect(species.some((item) => item.id === "salminus-brasiliensis-fish06")).toBe(true);
    expect(species.some((item) => item.id === "pseudoplatystoma-corruscans-fish06")).toBe(true);
    expect(species.some((item) => item.id === "leporinus-obtusidens")).toBe(true);
    expect(species.some((item) => item.id === "anartia-jatrophae")).toBe(true);
    expect(species.some((item) => item.id === "battus-polydamas")).toBe(true);
    expect(species.some((item) => item.id === "vanessa-myrinna")).toBe(true);
  });

  it("rejects a batch with inconsistent scientific vocabularies", () => {
    const batch = { ...catalogBatches[0], species: [{ ...catalogSpecies[0], group: "Aves" as const, environments: ["oceano" as never], images: catalogSpecies[0].images.map((image, index) => index === 0 ? { ...image, uri: "arquivo-local" } : image) }] };
    expect(validateCatalogBatch(batch)).toEqual(expect.arrayContaining([expect.stringContaining("grupo não corresponde"), expect.stringContaining("ambiente inválido"), expect.stringContaining("imagem sem URL HTTP válida")]));
  });

  it("rejects non-ASCII species IDs", () => {
    const batch = { ...catalogBatches[0], species: [{ ...catalogSpecies[0], id: "lobo-guará" }] };
    expect(validateCatalogBatch(batch)).toEqual(expect.arrayContaining([expect.stringContaining("ID deve ser ASCII em kebab-case")]));
  });

  it("rejects commercial-incompatible image licenses and unapproved sources", () => {
    const batch = { ...catalogBatches[0], sources: [{ title: "IUCN", url: "https://www.iucnredlist.org/species/123" }], species: [{ ...catalogSpecies[0], images: catalogSpecies[0].images.map((image, index) => index === 0 ? { ...image, license: "CC BY-NC 4.0" } : image) }] };
    expect(validateCatalogBatch(batch)).toEqual(expect.arrayContaining([expect.stringContaining("incompatível com uso comercial"), expect.stringContaining("fonte do lote fora da lista aprovada")]));
  });

  it("indexes modular species by environment and group", () => {
    expect(catalogSpeciesByEnvironment["Rios e corixos"].length).toBeGreaterThan(0);
    expect(catalogSpeciesByGroup["Peixes"].some((item) => item.scientificName === "Salminus brasiliensis")).toBe(true);
  });

  it("matches scientific and alternate names without accent sensitivity", () => {
    const item = { ...catalogSpecies[0], searchNames: ["lobo de crina"] };
    expect(speciesMatchesCatalogSearch(item, "LÔBO DE CRINA")).toBe(true);
    expect(speciesMatchesCatalogSearch(item, "inexistente")).toBe(false);
  });

  it("normalizes accents and surrounding whitespace for field search", () => {
    expect(normalizeCatalogSearch("  Onca-pintada ")).toBe("onca-pintada");
    expect(normalizeCatalogSearch("TUIUIÚ")).toBe("tuiuiu");
    expect(normalizeCatalogSearch("Panthera onca")).toBe("panthera onca");
  });

  it("keeps public catalog sources within the approved commercial policy", () => {
    for (const item of species) {
      expect(item.sources.every((source) => !/iucnredlist|IUCN/i.test(source.url + source.title))).toBe(true);
      expect(item.conservationStatus).toBeUndefined();
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
        expect(image.sourceUrl).toMatch(/^https?:\/\/commons\.wikimedia\.org\/wiki\/File:/);
      }
    }
  });
});
