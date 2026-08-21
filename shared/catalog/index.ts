import type { Species } from "@/shared/pantanal";
import { mammals01 } from "./batches/mammals-01";
import { birds01 } from "./batches/birds-01";
import { reptiles01 } from "./batches/reptiles-01";
import { amphibians01 } from "./batches/amphibians-01";
import { fish01 } from "./batches/fish-01";
import { invertebrates01 } from "./batches/invertebrates-01";
import { validateCatalogBatches, type CatalogBatch } from "./types";

export const catalogBatches: CatalogBatch[] = [mammals01, birds01, reptiles01, amphibians01, fish01, invertebrates01];
export const catalogSpecies: Species[] = catalogBatches.flatMap((batch) => batch.species);
export const catalogValidationErrors = validateCatalogBatches(catalogBatches);

if (catalogValidationErrors.length) {
  throw new Error(`Catálogo inválido: ${catalogValidationErrors.join("; ")}`);
}
