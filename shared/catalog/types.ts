import type { Species } from "../pantanal";

const validGroups = new Set(["Mamíferos", "Aves", "Répteis", "Anfíbios", "Peixes", "Invertebrados"]);
const validEnvironments = new Set(["Rios e corixos", "Áreas alagadas", "Campos", "Matas", "Bordas de mata"]);
const approvedSourceHosts = ["api.gbif.org", "sibbr.gov.br", "icmbio.gov.br", "gov.br", "www.gov.br", "pubmed.ncbi.nlm.nih.gov", "pt.wikipedia.org", "www.wikidata.org"];
const commercialImageLicenses = /^(CC0|CC BY(?:-SA)?(?: 2\.0| 2\.5| 3\.0| 4\.0)?|CC BY-SA(?: 2\.0| 2\.5| 3\.0| 4\.0)?|Public domain)$/i;
const blockedImageLicenses = /\b(?:NC|ND|NON[- ]?COMMERCIAL|NO[- ]?DERIVATIVES)\b/i;
const asciiSpeciesId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type CatalogBatch = {
  batchId: string;
  cycle: number;
  group: Species["group"];
  status: "verified" | "pending-review" | "review-ready";
  species: Species[];
  sources: { title: string; url: string }[];
  pendingNotes?: string[];
};

const requiredTextFields: (keyof Species)[] = [
  "id", "commonName", "scientificName", "description", "physicalCharacteristics",
  "habitat", "behavior", "diet", "distribution", "ecologicalImportance",
];

export function validateSpeciesRecord(item: Species, seenIds = new Set<string>(), options: { enforceApprovedSources?: boolean } = { enforceApprovedSources: true }): string[] {
  const errors: string[] = [];
  for (const field of requiredTextFields) {
    if (typeof item[field] !== "string" || !String(item[field]).trim()) errors.push(`${item.id || "sem-id"}: campo ${field} ausente`);
  }
  if (!asciiSpeciesId.test(item.id)) errors.push(`${item.id || "sem-id"}: ID deve ser ASCII em kebab-case`);
  if (seenIds.has(item.id)) errors.push(`${item.id}: ID duplicado`);
  seenIds.add(item.id);
  if (!validGroups.has(item.group)) errors.push(`${item.id}: grupo inválido`);
  if (!item.environments.length) errors.push(`${item.id}: ambiente ausente`);
  if (item.environments.some((environment) => !validEnvironments.has(environment))) errors.push(`${item.id}: ambiente inválido`);
  if (item.images.length !== 3) errors.push(`${item.id}: deve ter exatamente três imagens`);
  for (const image of item.images) {
    if (!/^https?:\/\//i.test(image.uri) || !/^https?:\/\//i.test(image.sourceUrl)) errors.push(`${item.id}: imagem sem URL HTTP válida`);
    if (!image.credit.trim() || !image.license.trim()) errors.push(`${item.id}: crédito/licença de imagem ausente`);
    if (!commercialImageLicenses.test(image.license) || blockedImageLicenses.test(image.license)) errors.push(`${item.id}: licença de imagem incompatível com uso comercial`);
  }
  if (!item.sources.length || item.sources.some((source) => !source.title.trim() || !/^https?:\/\//i.test(source.url))) errors.push(`${item.id}: fonte estruturada ausente ou inválida`);
  if (options.enforceApprovedSources !== false && item.sources.some((source) => { try { return !approvedSourceHosts.includes(new URL(source.url).hostname); } catch { return true; } })) errors.push(`${item.id}: fonte fora da lista aprovada`);
  return errors;
}

export function validateSpeciesRecords(records: Species[], options: { enforceApprovedSources?: boolean } = { enforceApprovedSources: true }): string[] {
  const ids = new Set<string>();
  return records.flatMap((item) => validateSpeciesRecord(item, ids, options));
}

export function validateCatalogBatch(batch: CatalogBatch): string[] {
  const errors: string[] = [];
  if (!/^catalog-[a-z0-9-]+$/.test(batch.batchId)) errors.push(`${batch.batchId}: batchId inválido`);
  if (!Number.isInteger(batch.cycle) || batch.cycle < 1 || batch.cycle > 20) errors.push(`${batch.batchId}: ciclo fora de 1–20`);
  if (!batch.species.length) errors.push(`${batch.batchId}: lote vazio`);
  const ids = new Set<string>();
  for (const item of batch.species) {
    errors.push(...validateSpeciesRecord(item, ids));
    if (item.group !== batch.group) errors.push(`${item.id}: grupo não corresponde ao lote`);
  }
  if (batch.sources.some((source) => !source.title.trim() || !/^https?:\/\//i.test(source.url))) errors.push(`${batch.batchId}: fonte do lote inválida`);
  if (batch.sources.some((source) => { try { return !approvedSourceHosts.includes(new URL(source.url).hostname); } catch { return true; } })) errors.push(`${batch.batchId}: fonte do lote fora da lista aprovada`);
  return errors;
}

export function validateCatalogBatches(batches: CatalogBatch[]): string[] {
  const errors = batches.flatMap(validateCatalogBatch);
  const ids = new Set<string>();
  for (const batch of batches) for (const item of batch.species) {
    if (ids.has(item.id)) errors.push(`${item.id}: ID duplicado entre lotes`);
    ids.add(item.id);
  }
  return errors;
}
