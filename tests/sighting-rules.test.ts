import { describe, expect, it, vi } from "vitest";

import {
  countSightingCreations,
  createSightingCreationLedger,
  recordSightingCreation,
  restoreSightingCreationLedger,
  serializeSightingCreationLedger,
  SightingDailyLimitError,
  validateSightingOperation,
  type SightingDraft,
  type SightingValidationOptions,
} from "../shared/sighting-rules";

const now = new Date(2026, 10, 6, 23, 55);
const draft: SightingDraft = {
  id: "new-1",
  speciesId: "tuiuiu",
  photoUri: "file:///documents/avistamento.jpg",
  latitude: -16.25,
  longitude: -56.65,
  date: "2026-11-06",
  time: "23:50",
  quantity: 1,
  notes: "Ave na margem da baía.",
};

function options(overrides: Partial<SightingValidationOptions> = {}): SightingValidationOptions {
  return { operation: "create", now, ledger: createSightingCreationLedger(), isWithinArea: () => true, ...overrides };
}

function codes(value: SightingDraft, overrides: Partial<SightingValidationOptions> = {}) {
  return validateSightingOperation(value, options(overrides)).errors.map((issue) => issue.code);
}

function filledLedger(count: number) {
  let ledger = createSightingCreationLedger();
  for (let index = 0; index < count; index += 1) ledger = recordSightingCreation(ledger, `saved-${index}`, now);
  return ledger;
}

describe("UC06 validation of new writes", () => {
  it("accepts a valid operation and species available only in a modular catalog batch", () => {
    expect(validateSightingOperation(draft, options())).toEqual({ valid: true, errors: [] });
    expect(codes({ ...draft, speciesId: "jau", quantity: undefined, time: undefined })).toEqual([]);
  });

  it("requires a catalog species and a photograph without mutating the draft", () => {
    const before = { ...draft, photoUri: "  ", speciesId: "desconhecida" };
    const snapshot = { ...before };
    expect(codes(before)).toEqual(["SPECIES_UNKNOWN", "PHOTO_REQUIRED"]);
    expect(before).toEqual(snapshot);
    expect(codes({ ...draft, speciesId: "" })).toContain("SPECIES_REQUIRED");
  });

  it("checks actual calendar dates and the device's local day, including midnight", () => {
    expect(codes({ ...draft, date: "2026-02-30" })).toContain("DATE_INVALID");
    expect(codes({ ...draft, date: "06/11/2026" })).toContain("DATE_INVALID");
    expect(codes({ ...draft, date: "2026-11-07" })).toContain("DATE_FUTURE");
    expect(codes({ ...draft, date: "2026-11-07" }, { now: new Date(2026, 10, 7, 0, 1) })).not.toContain("DATE_FUTURE");
    expect(codes({ ...draft, date: "2024-02-29" })).toEqual([]);
  });

  it("requires a valid coordinate pair before invoking the boundary check", () => {
    const isWithinArea = vi.fn(() => true);
    expect(codes({ ...draft, latitude: undefined }, { isWithinArea })).toContain("LOCATION_REQUIRED");
    for (const latitude of [Number.NaN, Number.POSITIVE_INFINITY, -91, 91]) {
      expect(codes({ ...draft, latitude }, { isWithinArea })).toContain("LOCATION_INVALID");
    }
    expect(codes({ ...draft, longitude: 181 }, { isWithinArea })).toContain("LOCATION_INVALID");
    expect(isWithinArea).not.toHaveBeenCalled();
  });

  it("rejects locations outside the supplied Pantanal boundary and fails closed when its check errors", () => {
    const isWithinArea = vi.fn(() => false);
    expect(codes(draft, { isWithinArea })).toContain("LOCATION_OUTSIDE_PANTANAL");
    expect(isWithinArea).toHaveBeenCalledWith(-16.25, -56.65);
    expect(codes(draft, { isWithinArea: () => { throw new Error("boundary unavailable"); } })).toContain("LOCATION_CHECK_UNAVAILABLE");
  });

  it("validates the optional time and count and the 500-character note limit", () => {
    expect(codes({ ...draft, time: "00:00", quantity: undefined, notes: "a".repeat(500) })).toEqual([]);
    expect(codes({ ...draft, time: "23:59" })).toEqual([]);
    expect(codes({ ...draft, time: "24:00", quantity: 0, notes: "a".repeat(501) })).toEqual([
      "TIME_INVALID", "NOTES_TOO_LONG", "QUANTITY_INVALID",
    ]);
    for (const quantity of [-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(codes({ ...draft, quantity })).toContain("QUANTITY_INVALID");
    }
  });

  it("blocks the 31st creation but permits edits without releasing or consuming a slot", () => {
    const ledger = filledLedger(30);
    expect(codes(draft, { ledger })).toContain("DAILY_LIMIT_REACHED");
    expect(codes(draft, { ledger, operation: "update" })).toEqual([]);
    expect(codes({ ...draft, photoUri: undefined }, { ledger, operation: "update" })).toEqual(["PHOTO_REQUIRED"]);
    expect(countSightingCreations(ledger, now)).toBe(30);
  });
});

describe("persistent per-device creation ledger", () => {
  it("is immutable and idempotent when retrying the same creation, including a later day", () => {
    const empty = createSightingCreationLedger();
    const once = recordSightingCreation(empty, "saved-1", now);
    const twice = recordSightingCreation(once, "saved-1", now);
    const tomorrow = new Date(2026, 10, 7, 9);
    const retriedTomorrow = recordSightingCreation(once, "saved-1", tomorrow);
    expect(empty.days).toEqual({});
    expect(twice).toEqual(once);
    expect(countSightingCreations(once, now)).toBe(1);
    expect(countSightingCreations(retriedTomorrow, tomorrow)).toBe(0);
  });

  it("retains the full quota across a storage round trip even when no notebook records remain", () => {
    const ledger = filledLedger(30);
    const restored = restoreSightingCreationLedger(serializeSightingCreationLedger(ledger));
    expect(restored.status).toBe("restored");
    expect(countSightingCreations(restored.ledger, now)).toBe(30);
    expect(() => recordSightingCreation(restored.ledger, "another", now)).toThrow(SightingDailyLimitError);
    expect(codes(draft, { ledger: restored.ledger })).toContain("DAILY_LIMIT_REACHED");
  });

  it("allows a new quota after local midnight and preserves the previous day's count", () => {
    const ledger = filledLedger(30);
    const tomorrow = new Date(2026, 10, 7, 0, 1);
    const next = recordSightingCreation(ledger, "tomorrow-1", tomorrow);
    expect(countSightingCreations(next, now)).toBe(30);
    expect(countSightingCreations(next, tomorrow)).toBe(1);
    expect(codes({ ...draft, id: "tomorrow-2", date: "2026-11-07" }, { ledger: next, now: tomorrow })).toEqual([]);
  });

  it("reports corrupt or unknown persisted versions instead of silently claiming an unused quota", () => {
    expect(restoreSightingCreationLedger(null).status).toBe("empty");
    expect(restoreSightingCreationLedger("broken").status).toBe("corrupted");
    expect(restoreSightingCreationLedger('{"version":2,"days":{}}').status).toBe("unsupported-version");
    expect(restoreSightingCreationLedger('{"version":1,"days":{"2026-02-30":["x"]}}').status).toBe("corrupted");
    expect(restoreSightingCreationLedger('{"version":1,"days":{"2026-11-06":[null]}}').status).toBe("corrupted");
    expect(restoreSightingCreationLedger('{"version":1}').status).toBe("corrupted");
  });

  it("normalizes retried IDs in persisted data without inflating the count", () => {
    const raw = JSON.stringify({ version: 1, days: { "2026-11-06": ["x", "x"], "2026-11-07": ["x", "y"] } });
    const restored = restoreSightingCreationLedger(raw);
    expect(restored.status).toBe("restored");
    expect(countSightingCreations(restored.ledger, now)).toBe(1);
    expect(countSightingCreations(restored.ledger, new Date(2026, 10, 7))).toBe(1);
  });

  it("rejects invalid clock values and blank identifiers", () => {
    const ledger = createSightingCreationLedger();
    expect(() => recordSightingCreation(ledger, " ", now)).toThrow("identificador válido");
    expect(() => countSightingCreations(ledger, new Date("invalid"))).toThrow(RangeError);
    expect(() => validateSightingOperation(draft, options({ now: new Date("invalid") }))).toThrow(RangeError);
  });
});
