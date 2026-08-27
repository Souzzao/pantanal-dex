import type { Species } from "../pantanal";
import type { CatalogBatch } from "./types";

export type CatalogInventoryMetrics = {
  publicSpecies: number;
  modularSpecies: number;
  totalSpecies: number;
  uniqueIds: number;
  duplicateIds: string[];
  modularBatches: number;
  pendingReviewBatches: number;
  verifiedBatches: number;
  reviewReadyBatches: number;
  modularImages: number;
  groups: { group: Species["group"]; total: number }[];
  environments: { environment: Species["environments"][number]; total: number }[];
  validationErrors: string[];
};

const groups: Species["group"][] = ["Mamíferos", "Aves", "Répteis", "Anfíbios", "Peixes", "Invertebrados"];
const environments: Species["environments"][number][] = ["Rios e corixos", "Áreas alagadas", "Campos", "Matas", "Bordas de mata"];

export function createCatalogInventoryMetrics(
  combinedSpecies: readonly Species[],
  modularSpecies: readonly Species[],
  batches: readonly CatalogBatch[],
  validationErrors: readonly string[] = [],
): CatalogInventoryMetrics {
  const ids = combinedSpecies.map((item) => item.id);
  const seenIds = new Set<string>();
  const duplicateIds = ids.filter((id) => {
    if (seenIds.has(id)) return true;
    seenIds.add(id);
    return false;
  });
  return {
    publicSpecies: Math.max(0, combinedSpecies.length - modularSpecies.length),
    modularSpecies: modularSpecies.length,
    totalSpecies: combinedSpecies.length,
    uniqueIds: seenIds.size,
    duplicateIds: [...new Set(duplicateIds)],
    modularBatches: batches.length,
    pendingReviewBatches: batches.filter((batch) => batch.status === "pending-review").length,
    verifiedBatches: batches.filter((batch) => batch.status === "verified").length,
    reviewReadyBatches: batches.filter((batch) => batch.status === "review-ready").length,
    modularImages: modularSpecies.reduce((total, item) => total + item.images.length, 0),
    groups: groups.map((group) => ({ group, total: combinedSpecies.filter((item) => item.group === group).length })),
    environments: environments.map((environment) => ({ environment, total: combinedSpecies.filter((item) => item.environments.includes(environment)).length })),
    validationErrors: [...validationErrors],
  };
}
