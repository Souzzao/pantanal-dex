import { normalizeCatalogSearch, type Sighting, type Species } from "../shared/pantanal";

export type SightingVisibilityFilter = "all" | "private" | "shareable";
export type SightingFilters = { query: string; dateFrom: string; dateTo: string; visibility: SightingVisibilityFilter; locatedOnly: boolean };

export type SightingSortKey = "date" | "species" | "location" | "updatedAt";
export type SightingSortDirection = "asc" | "desc";

export function sortSightings(sightings: readonly Sighting[], catalog: readonly Species[], key: SightingSortKey, direction: SightingSortDirection = "desc") {
  return sightings.map((item, index) => ({ item, index })).sort((a, b) => {
    const animalA = catalog.find((entry) => entry.id === a.item.speciesId);
    const animalB = catalog.find((entry) => entry.id === b.item.speciesId);
    const valueA = key === "species" ? animalA?.commonName ?? "" : key === "location" ? a.item.locationLabel ?? "" : key === "updatedAt" ? a.item.updatedAt : a.item.date;
    const valueB = key === "species" ? animalB?.commonName ?? "" : key === "location" ? b.item.locationLabel ?? "" : key === "updatedAt" ? b.item.updatedAt : b.item.date;
    const comparison = valueA.localeCompare(valueB, "pt-BR", { numeric: true, sensitivity: "base" });
    return comparison === 0 ? a.index - b.index : direction === "asc" ? comparison : -comparison;
  }).map(({ item }) => item);
}

export function filterSightings(sightings: readonly Sighting[], catalog: readonly Species[], filters: SightingFilters) {
  const query = normalizeCatalogSearch(filters.query);
  return sightings.filter((sighting) => {
    const animal = catalog.find((item) => item.id === sighting.speciesId);
    const searchable = normalizeCatalogSearch([animal?.commonName ?? "", animal?.scientificName ?? "", sighting.locationLabel ?? "", sighting.notes ?? ""].join(" "));
    if (query && !searchable.includes(query)) return false;
    if (filters.dateFrom && sighting.date < filters.dateFrom) return false;
    if (filters.dateTo && sighting.date > filters.dateTo) return false;
    if (filters.visibility !== "all" && sighting.visibility !== filters.visibility) return false;
    if (filters.locatedOnly && sighting.latitude === undefined) return false;
    return true;
  });
}
