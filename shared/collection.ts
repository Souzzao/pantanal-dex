import { groups, type Sighting, type Species, type SpeciesGroup } from "./pantanal";

/**
 * "Minha Coleção" — progresso pessoal no estilo Pokédex.
 *
 * Cálculo puro e determinístico sobre o caderno local. Não altera avistamentos
 * nem depende de rede. Registros com espécie fora do catálogo (por exemplo,
 * "Não sei") contam como registro, mas não como espécie descoberta.
 */

export const XP_PER_NEW_SPECIES = 50;
export const XP_PER_SIGHTING = 10;
export const XP_PER_LEVEL = 200;

/** Espécies emblemáticas usadas na conquista "Cinco do Pantanal". */
export const PANTANAL_ICONS = ["onca-pintada", "tuiuiu", "arara-azul", "capivara", "jacare-do-pantanal"] as const;

export type CollectionEntry = {
  /** Número da espécie na coleção (#001, #002, ...), estável pela ordem do catálogo. */
  number: number;
  species: Species;
  discovered: boolean;
  sightingCount: number;
  firstSeenDate?: string;
  lastSeenDate?: string;
};

export type GroupProgress = {
  group: SpeciesGroup;
  total: number;
  discovered: number;
  percent: number;
};

export type BadgeId =
  | "first-sighting"
  | "five-species"
  | "twenty-five-species"
  | "all-groups"
  | "pantanal-icons"
  | "birdwatcher"
  | "ten-field-days"
  | "full-group";

export type Badge = {
  id: BadgeId;
  unlocked: boolean;
  /** Progresso atual em direção à meta (para barras e textos "3/5"). */
  current: number;
  target: number;
};

export type CollectionSummary = {
  entries: CollectionEntry[];
  totalSpecies: number;
  discoveredSpecies: number;
  percent: number;
  totalSightings: number;
  /** Registros cuja espécie não está no catálogo. */
  unmatchedSightings: number;
  fieldDays: number;
  groups: GroupProgress[];
  xp: number;
  level: number;
  /** XP acumulado dentro do nível atual (0 até XP_PER_LEVEL - 1). */
  levelXp: number;
  badges: Badge[];
};

export type CollectionFilter = "all" | "discovered" | "missing";

const percentOf = (part: number, total: number) => (total > 0 ? Math.round((part / total) * 100) : 0);

const isValidDate = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

export function formatCollectionNumber(value: number): string {
  return `#${String(Math.max(0, Math.trunc(value))).padStart(3, "0")}`;
}

export function computeCollection(catalog: readonly Species[], sightings: readonly Sighting[]): CollectionSummary {
  const bySpecies = new Map<string, { count: number; first?: string; last?: string }>();
  const knownIds = new Set(catalog.map((item) => item.id));
  const days = new Set<string>();
  let unmatched = 0;

  for (const sighting of sightings) {
    if (isValidDate(sighting.date)) days.add(sighting.date);
    if (!knownIds.has(sighting.speciesId)) {
      unmatched += 1;
      continue;
    }
    const current = bySpecies.get(sighting.speciesId) ?? { count: 0 };
    current.count += 1;
    if (isValidDate(sighting.date)) {
      if (!current.first || sighting.date < current.first) current.first = sighting.date;
      if (!current.last || sighting.date > current.last) current.last = sighting.date;
    }
    bySpecies.set(sighting.speciesId, current);
  }

  const seenIds = new Set<string>();
  const entries: CollectionEntry[] = [];
  for (const species of catalog) {
    if (seenIds.has(species.id)) continue;
    seenIds.add(species.id);
    const stats = bySpecies.get(species.id);
    entries.push({
      number: entries.length + 1,
      species,
      discovered: Boolean(stats),
      sightingCount: stats?.count ?? 0,
      firstSeenDate: stats?.first,
      lastSeenDate: stats?.last,
    });
  }

  const discoveredEntries = entries.filter((entry) => entry.discovered);
  const groupProgress: GroupProgress[] = groups
    .map((group) => {
      const inGroup = entries.filter((entry) => entry.species.group === group);
      const found = inGroup.filter((entry) => entry.discovered).length;
      return { group, total: inGroup.length, discovered: found, percent: percentOf(found, inGroup.length) };
    })
    .filter((item) => item.total > 0);

  const matchedSightings = sightings.length - unmatched;
  const xp = discoveredEntries.length * XP_PER_NEW_SPECIES + matchedSightings * XP_PER_SIGHTING;
  const discoveredIds = new Set(discoveredEntries.map((entry) => entry.species.id));
  const iconsInCatalog = PANTANAL_ICONS.filter((id) => knownIds.has(id));
  const iconsFound = iconsInCatalog.filter((id) => discoveredIds.has(id)).length;
  const birds = groupProgress.find((item) => item.group === "Aves");
  const bestGroup = groupProgress.reduce<GroupProgress | undefined>((best, item) => (!best || item.percent > best.percent ? item : best), undefined);
  const groupsStarted = groupProgress.filter((item) => item.discovered > 0).length;

  const badge = (id: BadgeId, current: number, target: number): Badge => ({ id, current: Math.min(current, target), target, unlocked: target > 0 && current >= target });
  const badges: Badge[] = [
    badge("first-sighting", sightings.length, 1),
    badge("five-species", discoveredEntries.length, 5),
    badge("twenty-five-species", discoveredEntries.length, 25),
    badge("all-groups", groupsStarted, groupProgress.length),
    badge("pantanal-icons", iconsFound, iconsInCatalog.length),
    badge("birdwatcher", birds?.discovered ?? 0, Math.min(10, birds?.total ?? 0)),
    badge("ten-field-days", days.size, 10),
    badge("full-group", bestGroup?.discovered ?? 0, bestGroup?.total ?? 0),
  ];

  return {
    entries,
    totalSpecies: entries.length,
    discoveredSpecies: discoveredEntries.length,
    percent: percentOf(discoveredEntries.length, entries.length),
    totalSightings: sightings.length,
    unmatchedSightings: unmatched,
    fieldDays: days.size,
    groups: groupProgress,
    xp,
    level: Math.floor(xp / XP_PER_LEVEL) + 1,
    levelXp: xp % XP_PER_LEVEL,
    badges,
  };
}

export function filterCollectionEntries(
  entries: readonly CollectionEntry[],
  options: { filter?: CollectionFilter; group?: SpeciesGroup | "all" } = {},
): CollectionEntry[] {
  const { filter = "all", group = "all" } = options;
  return entries.filter((entry) => {
    if (group !== "all" && entry.species.group !== group) return false;
    if (filter === "discovered") return entry.discovered;
    if (filter === "missing") return !entry.discovered;
    return true;
  });
}
