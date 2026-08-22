import type { Species } from "@/shared/pantanal";
import { mammals01 } from "./batches/mammals-01";
import { birds01 } from "./batches/birds-01";
import { reptiles01 } from "./batches/reptiles-01";
import { amphibians01 } from "./batches/amphibians-01";
import { birds02 } from "./batches/birds-02";
import { fish01 } from "./batches/fish-01";
import { mammals02 } from "./batches/mammals-02";
import { birds03 } from "./batches/birds-03";
import { reptiles02 } from "./batches/reptiles-02";
import { amphibians02 } from "./batches/amphibians-02";
import { fish02 } from "./batches/fish-02";
import { invertebrates01 } from "./batches/invertebrates-01";
import { validateCatalogBatches, type CatalogBatch } from "./types";
import { createCatalogReviewReport } from "./review";
import { createLicenseAuditReport } from "./license-audit";
import { createP1AuditQueue } from "./p1-audit";

export const catalogBatches: CatalogBatch[] = [mammals01, birds01, reptiles01, amphibians01, birds02, fish01, mammals02, birds03, reptiles02, amphibians02, fish02, invertebrates01];
export const catalogSpecies: Species[] = catalogBatches.flatMap((batch) => batch.species);
export const catalogReview = {
  batches: catalogBatches.length,
  pendingBatches: catalogBatches.filter((batch) => batch.status === "pending-review").length,
  verifiedBatches: catalogBatches.filter((batch) => batch.status === "verified").length,
  pendingSpecies: catalogBatches.filter((batch) => batch.status === "pending-review").reduce((total, batch) => total + batch.species.length, 0),
  verifiedSpecies: catalogBatches.filter((batch) => batch.status === "verified").reduce((total, batch) => total + batch.species.length, 0),
};
export const catalogValidationErrors = validateCatalogBatches(catalogBatches);
export const catalogReviewReport = createCatalogReviewReport(catalogBatches, catalogValidationErrors);
export const catalogLicenseAudit = createLicenseAuditReport(catalogSpecies);
export const catalogP1AuditQueue = createP1AuditQueue(catalogSpecies, catalogBatches, catalogLicenseAudit);

if (catalogValidationErrors.length) {
  throw new Error(`Catálogo inválido: ${catalogValidationErrors.join("; ")}`);
}
