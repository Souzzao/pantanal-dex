import type { SightingSortDirection, SightingSortKey, SightingVisibilityFilter } from "./sightings-filter";

export const SIGHTINGS_PREFERENCES_KEY = "pantanal-dex:sightings:preferences";
export const SIGHTINGS_PREFERENCES_VERSION = 1 as const;
export type SightingsPreferences = { sortKey: SightingSortKey; sortDirection: SightingSortDirection; dateFrom: string; dateTo: string; visibility: SightingVisibilityFilter; locatedOnly: boolean };

export const DEFAULT_SIGHTINGS_PREFERENCES: SightingsPreferences = { sortKey: "date", sortDirection: "desc", dateFrom: "", dateTo: "", visibility: "all", locatedOnly: false };

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null; }
function oneOf<T extends string>(value: unknown, allowed: readonly T[], fallback: T) { return typeof value === "string" && allowed.includes(value as T) ? value as T : fallback; }

export function parseSightingsPreferences(raw: string | null): SightingsPreferences {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    if (!isRecord(parsed) || parsed.version !== SIGHTINGS_PREFERENCES_VERSION) return DEFAULT_SIGHTINGS_PREFERENCES;
    return { sortKey: oneOf(parsed.sortKey, ["date", "species", "location", "updatedAt"], "date"), sortDirection: oneOf(parsed.sortDirection, ["asc", "desc"], "desc"), dateFrom: typeof parsed.dateFrom === "string" ? parsed.dateFrom.slice(0, 10) : "", dateTo: typeof parsed.dateTo === "string" ? parsed.dateTo.slice(0, 10) : "", visibility: oneOf(parsed.visibility, ["all", "private", "shareable"], "all"), locatedOnly: parsed.locatedOnly === true };
  } catch { return DEFAULT_SIGHTINGS_PREFERENCES; }
}

export function serializeSightingsPreferences(preferences: SightingsPreferences) { return JSON.stringify({ version: SIGHTINGS_PREFERENCES_VERSION, ...preferences }); }
