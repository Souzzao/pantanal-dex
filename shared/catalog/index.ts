import type { Species } from "../pantanal";
import { mammals01 } from "./batches/mammals-01";
import { mammals02 } from "./batches/mammals-02";
import { birds01 } from "./batches/birds-01";
import { birds02 } from "./batches/birds-02";
import { birds03 } from "./batches/birds-03";
import { birds04 } from "./batches/birds-04";
import { birds05 } from "./batches/birds-05";
import { birds06 } from "./batches/birds-06";
import { birds07 } from "./batches/birds-07";
import { reptiles01 } from "./batches/reptiles-01";
import { amphibians01 } from "./batches/amphibians-01";
import { fish01 } from "./batches/fish-01";
import { fish02 } from "./batches/fish-02";
import { fish03 } from "./batches/fish-03";
import { fish04 } from "./batches/fish-04";
import { fish05 } from "./batches/fish-05";
import { fish06 } from "./batches/fish-06";
import { invertebrates01 } from "./batches/invertebrates-01";
import { invertebrates02 } from "./batches/invertebrates-02";
import { invertebrates03 } from "./batches/invertebrates-03";
import { invertebrates04 } from "./batches/invertebrates-04";
import { invertebrates05 } from "./batches/invertebrates-05";
import { invertebrates06 } from "./batches/invertebrates-06";
import { invertebrates07 } from "./batches/invertebrates-07";
import { validateCatalogBatches, type CatalogBatch } from "./types";
import { createFrozenCatalogContract } from "./contract";
import { catalogPriorityMatrix, validateCatalogPriorities } from "./priorities";
import { regionalOccurrenceRecords, validateRegionalOccurrenceRecords } from "./regional-occurrence";
import { conservationReviewRecords, validateConservationReviewRecords } from "./conservation";
import { applyDocumentedSynonyms, documentedSynonyms, validateDocumentedSynonyms } from "./synonyms";

export const catalogBatches: CatalogBatch[] = [mammals01, mammals02, birds01, birds02, birds03, birds04, birds05, birds06, birds07, reptiles01, amphibians01, fish01, fish02, fish03, fish04, fish05, fish06, invertebrates01, invertebrates02, invertebrates03, invertebrates04, invertebrates05, invertebrates06, invertebrates07];
export const catalogSpecies: Species[] = catalogBatches.flatMap((batch) => batch.species);
export const frozenCatalogContract = createFrozenCatalogContract(catalogBatches, catalogSpecies);
export { catalogP1Priorities, catalogP2Priorities, catalogPriorityMatrix, validateCatalogPriorities } from "./priorities";
export { regionalOccurrenceRecords } from "./regional-occurrence";
export { conservationReviewRecords } from "./conservation";
export { documentedSynonyms } from "./synonyms";
export const catalogPriorityCoverage = catalogPriorityMatrix.map((priority) => ({ ...priority, present: priority.speciesId === null ? false : catalogSpecies.some((species) => species.id === priority.speciesId) }));
export const catalogValidationErrors = validateCatalogBatches(catalogBatches);
export const regionalOccurrenceValidationErrors = validateRegionalOccurrenceRecords(regionalOccurrenceRecords);
export const conservationReviewValidationErrors = validateConservationReviewRecords(conservationReviewRecords);
export const catalogSpeciesWithSynonyms = applyDocumentedSynonyms(catalogSpecies);
export const documentedSynonymValidationErrors = validateDocumentedSynonyms(catalogSpecies);
export const catalogPriorityValidationErrors = validateCatalogPriorities(catalogPriorityMatrix);
export const catalogSpeciesByEnvironment = catalogSpecies.reduce<Record<string, Species[]>>((index, item) => {
  for (const environment of item.environments) (index[environment] ??= []).push(item);
  return index;
}, {});
export const catalogSpeciesByGroup = catalogSpecies.reduce<Record<string, Species[]>>((index, item) => {
  (index[item.group] ??= []).push(item);
  return index;
}, {});

if (catalogValidationErrors.length || catalogPriorityValidationErrors.length) {
  throw new Error(`Catálogo inválido: ${[...catalogValidationErrors, ...catalogPriorityValidationErrors].join("; ")}`);
}
