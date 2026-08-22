import type { CatalogBatch } from "./types";
import type { Environment, Species, SpeciesGroup } from "../pantanal";

/** Versão congelada do contrato de catálogo usado pelo MVP. */
export const CATALOG_CONTRACT_VERSION = "mvp-1" as const;

export const CATALOG_REQUIRED_SPECIES_FIELDS = [
  "id",
  "commonName",
  "scientificName",
  "group",
  "environments",
  "description",
  "physicalCharacteristics",
  "habitat",
  "behavior",
  "diet",
  "curiosities",
  "distribution",
  "ecologicalImportance",
  "images",
  "sources",
] as const satisfies readonly (keyof Species)[];

export const CATALOG_ENVIRONMENTS = [
  "Rios e corixos",
  "Áreas alagadas",
  "Campos",
  "Matas",
  "Bordas de mata",
] as const satisfies readonly Environment[];

export const CATALOG_GROUPS = [
  "Mamíferos",
  "Aves",
  "Répteis",
  "Anfíbios",
  "Peixes",
  "Invertebrados",
] as const satisfies readonly SpeciesGroup[];

/** Export surface estável para consumidores do catálogo e para o relatório MVP. */
export type FrozenCatalogContract = {
  readonly version: typeof CATALOG_CONTRACT_VERSION;
  readonly batches: readonly CatalogBatch[];
  readonly species: readonly Species[];
};

export function createFrozenCatalogContract(
  batches: readonly CatalogBatch[],
  species: readonly Species[],
): FrozenCatalogContract {
  return Object.freeze({
    version: CATALOG_CONTRACT_VERSION,
    batches,
    species,
  });
}
