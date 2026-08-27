import { species, validateSpeciesCatalog, type Species } from "./pantanal";
import { catalogSpecies } from "./catalog/index";

export type CatalogBatch = {
  id: string;
  version: number;
  source: "conta-2-catalogo" | "coordenacao";
  species: Species[];
};

export type CatalogMergeResult = { species: Species[]; added: number; updated: number; skipped: number };

export function validateCatalogBatch(batch: CatalogBatch): string[] {
  const errors: string[] = [];
  if (!batch || typeof batch.id !== "string" || !batch.id.trim()) errors.push("batch.id inválido");
  if (!Number.isInteger(batch?.version) || batch.version < 1) errors.push("batch.version inválido");
  if (batch?.source !== "conta-2-catalogo" && batch?.source !== "coordenacao") errors.push("batch.source inválido");
  if (!Array.isArray(batch?.species) || batch.species.length === 0) errors.push("batch.species vazio ou inválido");
  if (Array.isArray(batch?.species)) errors.push(...validateSpeciesCatalog(batch.species).map((error) => `batch(${batch.id || "?"}).${error}`));
  return errors;
}

export function mergeCatalogBatch(existing: Species[], incoming: CatalogBatch): CatalogMergeResult {
  const errors = validateCatalogBatch(incoming);
  if (errors.length) return { species: existing, added: 0, updated: 0, skipped: incoming?.species?.length ?? 0 };
  const byId = new Map(existing.map((item) => [item.id, item]));
  let added = 0;
  let updated = 0;
  let skipped = 0;
  for (const item of incoming.species) {
    const current = byId.get(item.id);
    if (!current) { byId.set(item.id, item); added += 1; }
    else if (JSON.stringify(current) !== JSON.stringify(item)) { byId.set(item.id, item); updated += 1; }
    else skipped += 1;
  }
  return { species: Array.from(byId.values()), added, updated, skipped };
}

export const currentCatalogBatch: CatalogBatch = { id: "coordenacao-core-2026-08", version: 1, source: "coordenacao", species: catalogSpecies.length > 0 ? catalogSpecies : species };
