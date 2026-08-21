import { environments, groups, species, type Environment, type Species, type SpeciesGroup } from "./pantanal";

export type CatalogFilters = { query?: string; group?: SpeciesGroup | ""; environment?: Environment | "" };
export type CatalogSort = "name" | "group";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
const catalogIndex = species.map((item) => ({ item, searchText: normalize(`${item.commonName} ${item.scientificName} ${item.group} ${item.environments.join(" ")}`) }));

export function filterSpeciesCatalog(filters: CatalogFilters = {}): Species[] {
  const query = normalize(filters.query ?? "");
  return catalogIndex.filter(({ item, searchText }) => (!query || searchText.includes(query)) && (!filters.group || item.group === filters.group) && (!filters.environment || item.environments.includes(filters.environment))).map(({ item }) => item);
}

export function sortSpeciesCatalog(items: Species[], sort: CatalogSort = "name"): Species[] {
  return [...items].sort((a, b) => sort === "group" ? a.group.localeCompare(b.group, "pt-BR") || a.commonName.localeCompare(b.commonName, "pt-BR") : a.commonName.localeCompare(b.commonName, "pt-BR") || a.scientificName.localeCompare(b.scientificName, "pt-BR"));
}

export function paginateSpeciesCatalog(items: Species[], page: number, pageSize = 60): Species[] {
  const safePage = Number.isInteger(page) && page >= 0 ? page : 0;
  const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? Math.min(pageSize, 200) : 60;
  return items.slice(safePage * safePageSize, (safePage + 1) * safePageSize);
}

export const catalogCoverage = { species: species.length, groups: groups.length, environments: environments.length };
