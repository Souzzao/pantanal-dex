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
import { validateCatalogBatches, type CatalogBatch } from "./types";

export const catalogBatches: CatalogBatch[] = [mammals01, birds01, reptiles01, amphibians01, birds02, fish01, mammals02, birds03, reptiles02, amphibians02];
export const catalogSpecies: Species[] = catalogBatches.flatMap((batch) => batch.species);
export const catalogValidationErrors = validateCatalogBatches(catalogBatches);

if (catalogValidationErrors.length) {
  throw new Error(`Catálogo inválido: ${catalogValidationErrors.join("; ")}`);
}
