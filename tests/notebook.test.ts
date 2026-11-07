import { describe, expect, it } from "vitest";
import { restoreNotebook, serializeNotebook } from "../shared/notebook";
import { countSightingCreations, createSightingCreationLedger, recordSightingCreation, validateSightingOperation } from "../shared/sighting-rules";
import { serializeSightings } from "../shared/persistence";
import { UNKNOWN_SPECIES_ID, type Sighting } from "../shared/pantanal";
import { isInsidePantanal } from "../shared/pantanal-boundary";

const now = new Date(2026, 10, 6, 12);
const record: Sighting = { id: "uc06-test", speciesId: UNKNOWN_SPECIES_ID, date: "2026-11-06", photoUri: "file:///photos/unknown.jpg", latitude: -17, longitude: -57, locationPrecision: "exact", visibility: "private", createdAt: now.toISOString(), updatedAt: now.toISOString() };

describe("UC06 durable notebook", () => {
  it("accepts an unidentified species without inventing a catalog discovery", () => {
    expect(validateSightingOperation(record, { operation: "create", now, ledger: createSightingCreationLedger(), isWithinArea: isInsidePantanal }).errors).toEqual([]);
    const ledger = recordSightingCreation(createSightingCreationLedger(), record.id, now);
    expect(restoreNotebook(serializeNotebook([record], ledger), null).sightings).toEqual([record]);
  });
  it("persists a creation and its quota in a single envelope", () => {
    const ledger = recordSightingCreation(createSightingCreationLedger(), record.id, now);
    const restored = restoreNotebook(serializeNotebook([record], ledger), null);
    expect(restored.canWrite).toBe(true);
    expect(restored.status).toBe("restored");
    expect(countSightingCreations(restored.ledger, now)).toBe(1);
  });
  it("does not free the daily quota when the notebook is cleared", () => {
    const ledger = recordSightingCreation(createSightingCreationLedger(), record.id, now);
    const restored = restoreNotebook(serializeNotebook([], ledger), null);
    expect(restored.sightings).toEqual([]);
    expect(countSightingCreations(restored.ledger, now)).toBe(1);
  });
  it("migrates legacy records and seeds creations by their local creation day", () => {
    const restored = restoreNotebook(null, serializeSightings([record]));
    expect(restored.status).toBe("legacy-migrated");
    expect(restored.canWrite).toBe(true);
    expect(countSightingCreations(restored.ledger, now)).toBe(1);
  });
  it("preserves valid observations but blocks writes if the quota is corrupt", () => {
    const restored = restoreNotebook(JSON.stringify({ version: 2, sightings: [record], creationLedger: { version: 1, days: "broken" } }), serializeSightings([]));
    expect(restored.sightings).toEqual([record]);
    expect(restored.canWrite).toBe(false);
    expect(restored.status).toBe("corrupted");
  });
  it("never falls back to old data after an unknown new notebook version", () => {
    const restored = restoreNotebook('{"version":999}', serializeSightings([record]));
    expect(restored.status).toBe("unsupported-version");
    expect(restored.canWrite).toBe(false);
    expect(restored.sightings).toEqual([]);
  });
  it("blocks malformed legacy storage instead of silently resetting its quota", () => {
    expect(restoreNotebook(null, "{broken").canWrite).toBe(false);
    expect(restoreNotebook(null, null).canWrite).toBe(true);
  });
});
