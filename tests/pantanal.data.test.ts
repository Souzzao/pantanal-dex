import { describe, expect, it } from "vitest";

import { mergeSightings, restoreSettings, restoreSettingsWithStatus, restoreSightings, restoreSightingsWithStatus, serializeSettings, serializeSightings } from "../shared/persistence";
import { catalogBatches, catalogP1AuditQueue, catalogReview, catalogReviewReport, catalogSpecies } from "../shared/catalog/index";
import { validateCatalogBatch as validateEditorialCatalogBatch, validateCatalogBatches } from "../shared/catalog/types";
import { createCatalogLoader } from "../shared/catalog-loader";
import { filterSpeciesCatalog, paginateSpeciesCatalog, sortSpeciesCatalog } from "../shared/catalog";
import { currentCatalogBatch, mergeCatalogBatch, validateCatalogBatch } from "../shared/catalog-batches";
import { createCatalogReviewReport, isCatalogBatchReviewReady } from "../shared/catalog/review";
import { createLicenseAuditReport } from "../shared/catalog/license-audit";
import { createP1AuditQueue, MVP_P1_NAMES } from "../shared/catalog/p1-audit";
import { readStorageWithRetry, withStorageRetry } from "../shared/persistence";
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

  it("creates a deterministic P1 queue and blocks unreviewed batches", () => {
    const queue = createP1AuditQueue(catalogSpecies, catalogBatches, createLicenseAuditReport(catalogSpecies));
    expect(MVP_P1_NAMES).toHaveLength(20);
    expect(queue).toHaveLength(20);
    expect(new Set(queue.map((row) => row.priority)).size).toBe(20);
    expect(queue.every((row) => row.status !== "ready-for-review")).toBe(true);
    expect(queue.every((row) => row.blockers.length > 0)).toBe(true);
    expect(queue.some((row) => row.status === "missing")).toBe(true);
    expect(queue.some((row) => row.blockers.includes("checklist editorial do lote incompleto"))).toBe(true);
  });

  it("keeps the first P1 batch explicitly blocked until editorial evidence is complete", () => {
    const firstBatch = catalogBatches.find((batch) => batch.batchId === "catalog-mammals-01");
    expect(firstBatch?.species.map((item) => item.commonName)).toEqual(["Lobo-guará", "Queixada", "Cateto"]);
    expect(catalogP1AuditQueue.filter((row) => ["Lobo-guará", "Queixada", "Cateto"].includes(row.commonName)).every((row) => row.status === "blocked")).toBe(true);
  });

  it("keeps the second P1 batch blocked until its evidence is attached", () => {
    const secondBatch = catalogBatches.find((batch) => batch.batchId === "catalog-mammals-02");
    expect(secondBatch?.species.map((item) => item.commonName)).toEqual(["Veado-campeiro", "Morcego-pescador", "Ouriço-cacheiro"]);
    const auditedNames = ["Veado-campeiro", "Ouriço-cacheiro"];
    expect(catalogP1AuditQueue.filter((row) => auditedNames.includes(row.commonName)).every((row) => row.status === "blocked")).toBe(true);
  });

  it("keeps the first bird batch blocked until evidence is complete", () => {
    const firstBirdBatch = catalogBatches.find((batch) => batch.batchId === "catalog-birds-01");
    expect(firstBirdBatch?.species.map((item) => item.commonName)).toEqual(["Seriema", "Mutum-de-penacho", "Anhuma"]);
    expect(catalogP1AuditQueue.find((row) => row.commonName === "Seriema")?.status).toBe("blocked");
    expect(firstBirdBatch?.status).toBe("pending-review");
  });

  it("audits the second bird batch without promoting it", () => {
    const secondBirdBatch = catalogBatches.find((batch) => batch.batchId === "catalog-birds-02");
    expect(secondBirdBatch?.species.map((item) => item.commonName)).toEqual(["Gavião-belo", "Urubu-rei"]);
    expect(secondBirdBatch?.status).toBe("pending-review");
    expect(secondBirdBatch?.species).toHaveLength(2);
    expect(secondBirdBatch?.species.every((item) => item.images.length === 3)).toBe(true);
    expect(secondBirdBatch?.species.flatMap((item) => item.images).map((image) => image.license)).toEqual([
      "CC BY-SA 4.0", "CC BY-SA 4.0", "CC BY-SA 4.0", "CC BY 2.0", "CC BY-SA 3.0", "CC BY 4.0",
    ]);
    expect(validateEditorialCatalogBatch(secondBirdBatch!)).toEqual([]);
    expect(isCatalogBatchReviewReady(secondBirdBatch!)).toBe(false);
  });

  it("audits the third bird batch with reachable commercial images", () => {
    const thirdBirdBatch = catalogBatches.find((batch) => batch.batchId === "catalog-birds-03");
    expect(thirdBirdBatch?.species.map((item) => item.commonName)).toEqual(["Arara-canindé", "Urubu-de-cabeça-preta", "Tucano-toco"]);
    expect(thirdBirdBatch?.status).toBe("pending-review");
    expect(thirdBirdBatch?.species).toHaveLength(3);
    expect(thirdBirdBatch?.species.flatMap((item) => item.images)).toHaveLength(9);
    expect(thirdBirdBatch?.species.flatMap((item) => item.images).every((image) => image.sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:"))).toBe(true);
    expect(thirdBirdBatch?.species.flatMap((item) => item.images).map((image) => image.license)).toEqual([
      "CC BY 2.0", "CC BY 3.0", "CC BY-SA 3.0", "CC BY-SA 3.0", "CC BY-SA 3.0", "CC BY-SA 3.0", "CC BY-SA 4.0", "CC BY-SA 4.0", "CC BY-SA 2.0",
    ]);
    expect(validateEditorialCatalogBatch(thirdBirdBatch!)).toEqual([]);
    expect(isCatalogBatchReviewReady(thirdBirdBatch!)).toBe(false);
  });

  it("audits the first reptile batch without promoting it", () => {
    const firstReptileBatch = catalogBatches.find((batch) => batch.batchId === "catalog-reptiles-01");
    expect(firstReptileBatch?.species.map((item) => item.commonName)).toEqual(["Teiú", "Cobra-cipó"]);
    expect(firstReptileBatch?.status).toBe("pending-review");
    expect(firstReptileBatch?.species).toHaveLength(2);
    expect(firstReptileBatch?.species.flatMap((item) => item.images)).toHaveLength(6);
    expect(firstReptileBatch?.species.flatMap((item) => item.images).every((image) => image.sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:"))).toBe(true);
    expect(firstReptileBatch?.species.flatMap((item) => item.images).map((image) => image.license)).toEqual([
      "CC BY-SA 4.0", "CC BY-SA 4.0", "CC BY-SA 4.0", "CC BY 2.0", "CC BY-SA 2.0", "CC BY-SA 4.0",
    ]);
    expect(validateEditorialCatalogBatch(firstReptileBatch!)).toEqual([]);
    expect(isCatalogBatchReviewReady(firstReptileBatch!)).toBe(false);
  });

  it("audits the second reptile batch with reachable commercial images", () => {
    const secondReptileBatch = catalogBatches.find((batch) => batch.batchId === "catalog-reptiles-02");
    expect(secondReptileBatch?.species.map((item) => item.commonName)).toEqual(["Cágado-cabeçudo", "Cobra-d'água", "Jacaré-do-Pantanal", "Teiú-vermelho"]);
    expect(secondReptileBatch?.status).toBe("pending-review");
    expect(secondReptileBatch?.species).toHaveLength(4);
    expect(secondReptileBatch?.species.flatMap((item) => item.images)).toHaveLength(12);
    expect(secondReptileBatch?.species.flatMap((item) => item.images).every((image) => image.sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:"))).toBe(true);
    expect(secondReptileBatch?.species.flatMap((item) => item.images).map((image) => image.license)).toEqual([
      "CC BY-SA 3.0", "CC BY-SA 2.0", "CC BY-SA 2.0", "CC BY-SA 2.5", "CC BY 4.0", "CC BY 4.0",
      "CC BY-SA 4.0", "CC BY-SA 4.0", "CC BY-SA 4.0", "CC BY-SA 3.0", "CC BY 4.0", "CC0",
    ]);
    expect(validateEditorialCatalogBatch(secondReptileBatch!)).toEqual([]);
    expect(isCatalogBatchReviewReady(secondReptileBatch!)).toBe(false);
  });

  it("closes the reptile batch inventory without inventing a third lot", () => {
    const reptileBatches = catalogBatches.filter((batch) => batch.group === "Répteis");
    expect(reptileBatches.map((batch) => batch.batchId)).toEqual(["catalog-reptiles-01", "catalog-reptiles-02"]);
    expect(reptileBatches).toHaveLength(2);
    expect(reptileBatches.every((batch) => batch.status === "pending-review")).toBe(true);
    expect(reptileBatches.flatMap((batch) => batch.species)).toHaveLength(6);
    expect(reptileBatches.every((batch) => validateEditorialCatalogBatch(batch).length === 0)).toBe(true);
  });

  it("audits the first amphibian batch and excludes prohibited conservation sources", () => {
    const firstAmphibianBatch = catalogBatches.find((batch) => batch.batchId === "catalog-amphibians-01");
    expect(firstAmphibianBatch?.species.map((item) => item.commonName)).toEqual(["Perereca", "Perereca-macaco"]);
    expect(firstAmphibianBatch?.status).toBe("pending-review");
    expect(firstAmphibianBatch?.species).toHaveLength(2);
    expect(firstAmphibianBatch?.species.flatMap((item) => item.images)).toHaveLength(6);
    expect(firstAmphibianBatch?.species.flatMap((item) => item.images).every((image) => image.sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:"))).toBe(true);
    expect(firstAmphibianBatch?.pendingNotes?.join(" ") ?? "").not.toMatch(/IUCN/i);
    expect(firstAmphibianBatch?.species.flatMap((item) => item.images).map((image) => image.license)).toEqual([
      "CC BY-SA 2.5", "CC BY 4.0", "CC BY-SA 4.0", "CC BY-SA 3.0", "CC BY-SA 3.0", "Public domain",
    ]);
    expect(validateEditorialCatalogBatch(firstAmphibianBatch!)).toEqual([]);
    expect(isCatalogBatchReviewReady(firstAmphibianBatch!)).toBe(false);
  });

  it("audits the second amphibian batch and keeps incomplete image sets blocked", () => {
    const secondAmphibianBatch = catalogBatches.find((batch) => batch.batchId === "catalog-amphibians-02");
    expect(secondAmphibianBatch?.species.map((item) => item.commonName)).toEqual(["Sapo-cururu", "Rã-pimenta", "Perereca-de-margem-escura", "Perereca-de-folhagem-azul"]);
    expect(secondAmphibianBatch?.status).toBe("pending-review");
    expect(secondAmphibianBatch?.species).toHaveLength(4);
    expect(secondAmphibianBatch?.species[0].images).toHaveLength(3);
    expect(secondAmphibianBatch?.species[1].images).toHaveLength(3);
    expect(secondAmphibianBatch?.species[2].images).toHaveLength(2);
    expect(secondAmphibianBatch?.species[3].images).toHaveLength(2);
    expect(secondAmphibianBatch?.species.flatMap((item) => item.images).every((image) => image.sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:"))).toBe(true);
    expect(secondAmphibianBatch?.species.flatMap((item) => item.images).map((image) => image.license)).toEqual([
      "CC BY-SA 2.5", "CC BY 4.0", "CC BY 4.0", "CC BY-SA 2.5", "CC BY-SA 2.5", "CC0",
      "CC BY-SA 2.5", "CC BY-SA 2.5", "CC BY-SA 2.5", "CC BY-SA 2.5",
    ]);
    expect(validateEditorialCatalogBatch(secondAmphibianBatch!)).toEqual([
      "perereca-fuscomarginata: deve ter exatamente três imagens",
      "perereca-folhagem-azul: deve ter exatamente três imagens",
    ]);
    expect(isCatalogBatchReviewReady(secondAmphibianBatch!)).toBe(false);
  });

  it("audits fish-01 and keeps cachara blocked without inventing images", () => {
    const firstFishBatch = catalogBatches.find((batch) => batch.batchId === "catalog-fish-01");
    expect(firstFishBatch?.species.map((item) => item.commonName)).toEqual(["Dourado", "Pacu", "Piraputanga", "Cachara"]);
    expect(firstFishBatch?.status).toBe("pending-review");
    expect(firstFishBatch?.species).toHaveLength(4);
    expect(firstFishBatch?.species[0].images).toHaveLength(3);
    expect(firstFishBatch?.species[1].images).toHaveLength(3);
    expect(firstFishBatch?.species[2].images).toHaveLength(3);
    expect(firstFishBatch?.species[3].images).toHaveLength(1);
    expect(firstFishBatch?.species.flatMap((item) => item.images).every((image) => image.sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:"))).toBe(true);
    expect(firstFishBatch?.species.flatMap((item) => item.images).map((image) => image.license)).toEqual([
      "CC0", "CC0", "CC0", "CC BY 2.0", "CC BY 4.0", "CC BY 4.0",
      "CC BY-SA 2.0", "CC BY-SA 4.0", "CC BY 4.0", "CC BY-SA 3.0",
    ]);
    expect(validateEditorialCatalogBatch(firstFishBatch!)).toContain("cachara: deve ter exatamente três imagens");
    expect(isCatalogBatchReviewReady(firstFishBatch!)).toBe(false);
  });

  it("audits fish-02 without inventing missing species images", () => {
    const secondFishBatch = catalogBatches.find((batch) => batch.batchId === "catalog-fish-02");
    expect(secondFishBatch?.species.map((item) => item.scientificName)).toEqual([
      "Zungaro jahu",
      "Acestrorhynchus pantaneiro",
      "Myloplus tiete",
    ]);
    expect(secondFishBatch?.status).toBe("pending-review");
    expect(secondFishBatch?.species[0].images).toHaveLength(0);
    expect(secondFishBatch?.species[1].images).toHaveLength(3);
    expect(secondFishBatch?.species[2].images).toHaveLength(1);
    expect(secondFishBatch?.species.flatMap((item) => item.images).map((image) => image.license)).toEqual([
      "CC0", "CC BY 4.0", "CC0", "CC BY 4.0",
    ]);
    expect(secondFishBatch?.species.flatMap((item) => item.images).every((image) => image.sourceUrl.startsWith("https://commons.wikimedia.org/wiki/File:"))).toBe(true);
    expect(validateEditorialCatalogBatch(secondFishBatch!)).toEqual([
      "jau: deve ter exatamente três imagens",
      "pacupeva: deve ter exatamente três imagens",
    ]);
    expect(isCatalogBatchReviewReady(secondFishBatch!)).toBe(false);
  });

  it("closes the fish batch inventory without inventing a third lot", () => {
    const fishBatches = catalogBatches.filter((batch) => batch.group === "Peixes");
    expect(fishBatches.map((batch) => batch.batchId)).toEqual([
      "catalog-fish-01",
      "catalog-fish-02",
    ]);
    expect(fishBatches).toHaveLength(2);
    expect(fishBatches.flatMap((batch) => batch.species)).toHaveLength(7);
    expect(fishBatches.every((batch) => batch.status === "pending-review")).toBe(true);
  });

  it("reports incomplete species records", () => {
    const broken = [{ ...species[0], id: species[0].id, images: species[0].images.slice(0, 2), sources: [] }];
    const errors = validateSpeciesCatalog(broken);
    expect(errors).toContain("species[0](tuiuiu).images deve ter pelo menos 3 imagens");
    expect(errors).toContain("species[0](tuiuiu).sources inválido");
  });

  it("rejects non-commercial or derivative-restricted image licenses", () => {
    const broken = [{ ...species[0], images: [{ ...species[0].images[0], license: "CC BY-NC 4.0" }, ...species[0].images.slice(1)] }];
    expect(validateSpeciesCatalog(broken)).toContain("species[0](tuiuiu).images[0] sem licença comercial, crédito ou fonte completos");
  });

  it("requires an official conservation source when a status is supplied", () => {
    const broken = [{ ...species[0], conservationStatus: "Vulnerável" }];
    expect(validateSpeciesCatalog(broken)).toContain("species[0](tuiuiu).conservationSource deve ser Livro Vermelho ICMBio ou Portaria MMA/ICMBio");
    const valid = [{ ...species[0], conservationStatus: "Vulnerável", conservationSource: { title: "Livro Vermelho ICMBio", url: "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade" } }];
    expect(validateSpeciesCatalog(valid)).toEqual([]);
  });

  it("reports invalid editorial URLs", () => {
    const broken = [{ ...species[0], images: [{ ...species[0].images[0], sourceUrl: "javascript:alert(1)" }, ...species[0].images.slice(1)], sources: [{ title: "Fonte", url: "not-a-url" }] }];
    const errors = validateSpeciesCatalog(broken);
    expect(errors).toContain("species[0](tuiuiu).images[0] sem licença comercial, crédito ou fonte completos");
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

  it("validates the modular pilot batches and reports their throughput", () => {
    expect(catalogBatches).toHaveLength(12);
    expect(catalogSpecies).toHaveLength(36);
    expect(validateCatalogBatches(catalogBatches)).toEqual([
      "cachara: deve ter exatamente três imagens",
      "perereca-fuscomarginata: deve ter exatamente três imagens",
      "perereca-folhagem-azul: deve ter exatamente três imagens",
      "jau: deve ter exatamente três imagens",
      "pacupeva: deve ter exatamente três imagens",
    ]);
    expect(new Set(catalogSpecies.map((item) => item.id)).size).toBe(catalogSpecies.length);
    expect(catalogReview.pendingBatches).toBe(12);
    expect(catalogReview.pendingSpecies).toBe(36);
    expect(catalogReview.verifiedBatches).toBe(0);
    expect(catalogReviewReport.totalBatches).toBe(12);
    expect(catalogReviewReport.pendingBatches).toBe(9);
    expect(catalogReviewReport.invalidBatches).toBe(3);
  });

  it("retries transient local writes and preserves the final error", async () => {
    let attempts = 0;
    await withStorageRetry(async () => {
      attempts += 1;
      if (attempts < 2) throw new Error("transient");
    });
    expect(attempts).toBe(2);
    await expect(withStorageRetry(async () => { throw new Error("persistent"); }, 2)).rejects.toThrow("persistent");
    let reads = 0;
    await expect(readStorageWithRetry(async () => { reads += 1; if (reads < 2) throw new Error("read transient"); return "ok"; })).resolves.toBe("ok");
    expect(reads).toBe(2);
  });

  it("audits commercial image licensing without promoting pending batches", () => {
    const clean = createLicenseAuditReport([species[0]]);
    expect(clean.images).toBe(3);
    expect(clean.commercialImages).toBe(3);
    expect(clean.speciesWithBlockers).toBe(0);
    const blocked = createLicenseAuditReport([{ ...species[0], images: [{ ...species[0].images[0], license: "CC BY-NC 4.0" }, ...species[0].images.slice(1)] }]);
    expect(blocked.speciesWithBlockers).toBe(1);
    expect(blocked.rows[0].blockedImages).toBe(1);
  });

  it("accepts a verified batch only with a complete editorial checklist", () => {
    const reviewed = { ...catalogBatches[0], status: "verified" as const, reviewedAt: "2026-08-22", reviewedBy: "quality-agent", reviewChecklist: { taxonomy: true, occurrence: true, licenses: true, conservation: true } };
    expect(isCatalogBatchReviewReady(reviewed)).toBe(true);
    const report = createCatalogReviewReport([reviewed]);
    expect(report.rows[0]?.status).toBe("verified");
    expect(report.rows[0]?.reviewReady).toBe(true);
    expect(isCatalogBatchReviewReady({ ...reviewed, reviewedAt: "22/08/2026" })).toBe(false);
  });

  it("blocks verified batches without a complete editorial checklist", () => {
    const verified = { ...catalogBatches[0], status: "verified" as const };
    const report = createCatalogReviewReport([verified]);
    expect(report.rows[0]?.status).toBe("invalid");
    expect(report.rows[0]?.reviewReady).toBe(false);
    expect(report.rows[0]?.blockers.join(" ")).toContain("checklist editorial");
  });

  it("marks a batch invalid in the operational report when validation errors identify it", () => {
    const invalid = createCatalogReviewReport(catalogBatches.slice(0, 1), [`${catalogBatches[0].batchId}: licença ausente`]);
    expect(invalid.rows[0]?.status).toBe("invalid");
    expect(invalid.invalidBatches).toBe(1);
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

  it("restores versioned and legacy Settings without trusting corrupted values", () => {
    const settings = { defaultLanguage: "Español" as const, quickLanguages: ["Español", "Português"] };
    const serialized = serializeSettings(settings);
    expect(JSON.parse(serialized).version).toBe(1);
    expect(restoreSettings(serialized, { defaultLanguage: "Português", quickLanguages: ["Português"] })).toEqual(settings);
    expect(restoreSettings(JSON.stringify(settings), { defaultLanguage: "Português", quickLanguages: ["Português"] })).toEqual(settings);
    expect(restoreSettings(JSON.stringify({ version: 99, settings }), { defaultLanguage: "Português", quickLanguages: ["Português"] })).toEqual({ defaultLanguage: "Português", quickLanguages: ["Português"] });
    expect(restoreSettings("broken", { defaultLanguage: "Português", quickLanguages: ["Português"] })).toEqual({ defaultLanguage: "Português", quickLanguages: ["Português"] });
  });

  it("reports precise restoration status without changing the safe fallback", () => {
    const fallback = { defaultLanguage: "Português" as const, quickLanguages: ["Português"] };
    expect(restoreSettingsWithStatus(null, fallback).status).toBe("empty");
    expect(restoreSettingsWithStatus(JSON.stringify({ version: 99, settings: fallback }), fallback)).toEqual({ value: fallback, status: "unsupported-version" });
    expect(restoreSettingsWithStatus("broken", fallback).status).toBe("corrupted");
    expect(restoreSettingsWithStatus(JSON.stringify(fallback), fallback).status).toBe("legacy-migrated");
    expect(restoreSightingsWithStatus(null).status).toBe("empty");
    expect(restoreSightingsWithStatus(JSON.stringify({ version: 99, sightings: [sighting] })).status).toBe("unsupported-version");
    expect(restoreSightingsWithStatus("broken").status).toBe("corrupted");
    expect(restoreSightingsWithStatus(JSON.stringify([sighting])).status).toBe("legacy-migrated");
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
