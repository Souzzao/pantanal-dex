import type { Species } from "@/shared/pantanal";
import { mammals01 } from "./batches/mammals-01";
import { birds01 } from "./batches/birds-01";
import { birds02 } from "./batches/birds-02";
import { birds03 } from "./batches/birds-03";
import { reptiles01 } from "./batches/reptiles-01";
import { amphibians01 } from "./batches/amphibians-01";
import { fish01 } from "./batches/fish-01";
import { fish02 } from "./batches/fish-02";
import { fish03 } from "./batches/fish-03";
import { fish04 } from "./batches/fish-04";
import { invertebrates01 } from "./batches/invertebrates-01";
import { invertebrates02 } from "./batches/invertebrates-02";
import { invertebrates03 } from "./batches/invertebrates-03";
import { invertebrates04 } from "./batches/invertebrates-04";
import { validateCatalogBatches, type CatalogBatch } from "./types";

export const catalogBatches: CatalogBatch[] = [mammals01, birds01, birds02, birds03, reptiles01, amphibians01, fish01, fish02, fish03, fish04, invertebrates01, invertebrates02, invertebrates03, invertebrates04];
export const catalogSpecies: Species[] = catalogBatches.flatMap((batch) => batch.species);
export const catalogValidationErrors = validateCatalogBatches(catalogBatches);
export const catalogSpeciesByEnvironment = catalogSpecies.reduce<Record<string, Species[]>>((index, item) => {
  for (const environment of item.environments) (index[environment] ??= []).push(item);
  return index;
}, {});
export const catalogSpeciesByGroup = catalogSpecies.reduce<Record<string, Species[]>>((index, item) => {
  (index[item.group] ??= []).push(item);
  return index;
}, {});

if (catalogValidationErrors.length) {
  throw new Error(`Catálogo inválido: ${catalogValidationErrors.join("; ")}`);
}
