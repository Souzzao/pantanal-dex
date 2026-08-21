import type { Environment, Species, SpeciesGroup } from "./pantanal";

export type CatalogLoaderFilters = {
  query?: string;
  group?: SpeciesGroup | "";
  environment?: Environment | "";
};

export type CatalogLoaderSort = "name" | "group";

type IndexedSpecies = {
  item: Species;
  searchText: string;
};

export type CatalogLoader = {
  readonly size: number;
  readonly items: Species[];
  search(filters?: CatalogLoaderFilters): Species[];
  page(filters: CatalogLoaderFilters | undefined, page: number, pageSize?: number, sort?: CatalogLoaderSort): Species[];
};

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();

const sortItems = (items: Species[], sort: CatalogLoaderSort) => [...items].sort((a, b) => (
  sort === "group"
    ? a.group.localeCompare(b.group, "pt-BR") || a.commonName.localeCompare(b.commonName, "pt-BR")
    : a.commonName.localeCompare(b.commonName, "pt-BR") || a.scientificName.localeCompare(b.scientificName, "pt-BR")
));

export function createCatalogLoader(batches: readonly Species[][]): CatalogLoader {
  const items = Array.from(new Map(batches.flat().map((item) => [item.id, item])).values());
  const index: IndexedSpecies[] = items.map((item) => ({
    item,
    searchText: normalize(`${item.commonName} ${item.scientificName} ${item.group} ${item.environments.join(" ")}`),
  }));

  const search = (filters: CatalogLoaderFilters = {}) => {
    const query = normalize(filters.query ?? "");
    return index
      .filter(({ item, searchText }) => (
        (!query || searchText.includes(query)) &&
        (!filters.group || item.group === filters.group) &&
        (!filters.environment || item.environments.includes(filters.environment))
      ))
      .map(({ item }) => item);
  };

  return {
    items,
    size: items.length,
    search,
    page(filters = {}, page, pageSize = 60, sort = "name") {
      const safePage = Number.isInteger(page) && page >= 0 ? page : 0;
      const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? Math.min(pageSize, 200) : 60;
      const filtered = sortItems(search(filters), sort);
      return filtered.slice(safePage * safePageSize, (safePage + 1) * safePageSize);
    },
  };
}
