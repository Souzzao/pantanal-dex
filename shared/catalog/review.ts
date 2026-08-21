import type { CatalogBatch } from "./types";

export type CatalogReviewRow = {
  batchId: string;
  status: CatalogBatch["status"] | "invalid";
  group: CatalogBatch["group"];
  species: number;
  blockers: string[];
};

export type CatalogReviewReport = {
  totalBatches: number;
  verifiedBatches: number;
  pendingBatches: number;
  invalidBatches: number;
  totalSpecies: number;
  rows: CatalogReviewRow[];
};

export function createCatalogReviewReport(batches: CatalogBatch[], validationErrors: string[] = []): CatalogReviewReport {
  const rows = batches.map((batch) => {
    const blockers = validationErrors.filter((error) => error.startsWith(`${batch.batchId}:`) || batch.species.some((item) => error.startsWith(`${item.id}:`)));
    const status: CatalogReviewRow["status"] = blockers.length ? "invalid" : batch.status;
    return { batchId: batch.batchId, status, group: batch.group, species: batch.species.length, blockers };
  });
  return {
    totalBatches: rows.length,
    verifiedBatches: rows.filter((row) => row.status === "verified").length,
    pendingBatches: rows.filter((row) => row.status === "pending-review").length,
    invalidBatches: rows.filter((row) => row.status === "invalid").length,
    totalSpecies: rows.reduce((total, row) => total + row.species, 0),
    rows,
  };
}
