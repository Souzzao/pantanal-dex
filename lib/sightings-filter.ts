import { normalizeCatalogSearch, type Sighting, type Species } from "../shared/pantanal";

export type SightingVisibilityFilter = "all" | "private" | "shareable";
export type SightingFilters = { query: string; dateFrom: string; dateTo: string; visibility: SightingVisibilityFilter; locatedOnly: boolean };

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
