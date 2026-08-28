import type { Sighting, Species } from "../shared/pantanal";

export type SightingsSummary = { total: number; located: number; privateCount: number; shareableCount: number; speciesCount: number; earliestDate?: string; latestDate?: string; bySpecies: { speciesId: string; commonName: string; count: number }[] };

export function summarizeSightings(sightings: readonly Sighting[], catalog: readonly Species[]): SightingsSummary {
  const counts = new Map<string, number>();
  let located = 0;
  let privateCount = 0;
  let shareableCount = 0;
  let earliestDate: string | undefined;
  let latestDate: string | undefined;
  for (const sighting of sightings) {
    counts.set(sighting.speciesId, (counts.get(sighting.speciesId) ?? 0) + 1);
    if (sighting.latitude !== undefined) located += 1;
    if (sighting.visibility === "private") privateCount += 1; else shareableCount += 1;
    if (!earliestDate || sighting.date < earliestDate) earliestDate = sighting.date;
    if (!latestDate || sighting.date > latestDate) latestDate = sighting.date;
  }
  const bySpecies = [...counts.entries()].map(([speciesId, count]) => ({ speciesId, commonName: catalog.find((item) => item.id === speciesId)?.commonName ?? "Animal não catalogado", count })).sort((a, b) => b.count - a.count || a.commonName.localeCompare(b.commonName, "pt-BR", { sensitivity: "base" }));
  return { total: sightings.length, located, privateCount, shareableCount, speciesCount: counts.size, earliestDate, latestDate, bySpecies };
}
