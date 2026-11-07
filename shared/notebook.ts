import { sanitizeStoredSightings, getLocalTodayISODate, type Sighting } from "./pantanal";
import { restoreSightingsWithStatus, type RestoreStatus } from "./persistence";
import { createSightingCreationLedger, restoreSightingCreationLedger, serializeSightingCreationLedger, type SightingCreationLedger } from "./sighting-rules";

export type RestoredNotebook = { sightings: Sighting[]; ledger: SightingCreationLedger; status: RestoreStatus; canWrite: boolean };

export function serializeNotebook(sightings: Sighting[], ledger: SightingCreationLedger): string {
  return JSON.stringify({ version: 2, sightings, creationLedger: JSON.parse(serializeSightingCreationLedger(ledger)) });
}

function seedLedger(sightings: Sighting[]): SightingCreationLedger {
  const ledger = createSightingCreationLedger();
  const seen = new Set<string>();
  for (const sighting of sightings) {
    const date = new Date(sighting.createdAt);
    if (!Number.isFinite(date.getTime()) || seen.has(sighting.id)) continue;
    const day = getLocalTodayISODate(date);
    (ledger.days[day] ??= []).push(sighting.id);
    seen.add(sighting.id);
  }
  return ledger;
}

/** The new notebook and quota are stored in one key so a successful write contains both. */
export function restoreNotebook(raw: string | null, legacyRaw: string | null): RestoredNotebook {
  const empty = (): RestoredNotebook => ({ sightings: [], ledger: createSightingCreationLedger(), status: "corrupted", canWrite: false });
  if (raw === null) {
    const legacy = restoreSightingsWithStatus(legacyRaw);
    return { sightings: legacy.value, ledger: seedLedger(legacy.value), status: legacy.status === "empty" ? "empty" : legacy.status === "restored" ? "legacy-migrated" : legacy.status, canWrite: legacy.status !== "corrupted" && legacy.status !== "unsupported-version" };
  }
  try {
    const parsed = JSON.parse(raw) as { version?: unknown; sightings?: unknown; creationLedger?: unknown };
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return empty();
    if (parsed.version !== 2) return { ...empty(), status: "unsupported-version" };
    const sightings = sanitizeStoredSightings(parsed.sightings);
    const restored = restoreSightingCreationLedger(JSON.stringify(parsed.creationLedger) ?? "");
    const validLedger = restored.status === "restored";
    const validSightings = Array.isArray(parsed.sightings) && parsed.sightings.length === sightings.length;
    return { sightings, ledger: restored.ledger, status: validLedger && validSightings ? "restored" : restored.status === "unsupported-version" ? "unsupported-version" : "corrupted", canWrite: validLedger && validSightings };
  } catch { return empty(); }
}
