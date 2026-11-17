import { environments, groups, species, type Environment, type Species, type SpeciesGroup } from "./pantanal";
import { createCatalogLoader, type CatalogLoaderFilters, type CatalogLoaderSort } from "./catalog-loader";
import { catalogLicenseAudit, catalogReview, catalogSpecies } from "./catalog/index";
import { generatedSpecies } from "./catalog/generated";
import { SPECIES_ID_ALIASES } from "./species-aliases";
import baseAreas from "./catalog/base-areas.json";
export { resolveSpeciesId, SPECIES_ID_ALIASES } from "./species-aliases";
import { getLanguageCode, localizeSpecies } from "./i18n";

export type CatalogFilters = CatalogLoaderFilters;
export type CatalogSort = CatalogLoaderSort;

const areas = baseAreas as Record<string, number>;
const GROUP_AREA_KM: Record<string, number> = { Mamíferos: 1.2, Aves: 0.6, Répteis: 0.6, Anfíbios: 0.3, Peixes: 1.2 };

/** Raio (km) da área desenhada no mapa para a espécie: cada animal tem o seu, pela área de vida típica. */
export function speciesAreaKm(item: Pick<Species, "id" | "group"> & { areaKm?: number }): number {
  return item.areaKm ?? areas[item.id] ?? GROUP_AREA_KM[item.group] ?? 0.3;
}

const withoutAliases = (items: Species[]) =>
  items.filter((item) => !(item.id in SPECIES_ID_ALIASES)).map((item) => (item.areaKm ? item : { ...item, areaKm: speciesAreaKm(item) }));
const catalogLoader = createCatalogLoader([withoutAliases(species), withoutAliases(catalogSpecies), generatedSpecies]);

const normalizeQuery = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/** Catálogo no idioma escolhido. A busca aceita o nome em português, no idioma atual ou o nome científico. */
export function filterSpeciesCatalog(filters: CatalogFilters = {}): Species[] {
  if (getLanguageCode() === "pt") return catalogLoader.search(filters);
  const { query, ...rest } = filters;
  const localized = catalogLoader.search(rest).map((item) => localizeSpecies(item));
  const wanted = normalizeQuery(query ?? "");
  if (!wanted) return localized;
  const matchedInPortuguese = new Set(catalogLoader.search(filters).map((item) => item.id));
  return localized.filter((item) => matchedInPortuguese.has(item.id) || normalizeQuery(item.commonName).includes(wanted));
}

export function sortSpeciesCatalog(items: Species[], sort: CatalogSort = "name"): Species[] {
  return createCatalogLoader([items]).page({}, 0, Math.max(items.length, 1), sort);
}

export function paginateSpeciesCatalog(items: Species[], page: number, pageSize = 60): Species[] {
  const safePage = Number.isInteger(page) && page >= 0 ? page : 0;
  const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? Math.min(pageSize, 200) : 60;
  return items.slice(safePage * safePageSize, (safePage + 1) * safePageSize);
}

export const catalogCoverage = { species: catalogLoader.size, groups: groups.length, environments: environments.length };
export { catalogLicenseAudit, catalogReview };
export { createCatalogLoader } from "./catalog-loader";
