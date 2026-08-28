import { describe, expect, it } from "vitest";
import { DEFAULT_SIGHTINGS_PREFERENCES, parseSightingsPreferences, serializeSightingsPreferences } from "../lib/sightings-preferences";

describe("sightings preferences", () => {
  it("restaura preferências válidas do formato versionado", () => { const parsed = parseSightingsPreferences(serializeSightingsPreferences({ sortKey: "species", sortDirection: "asc", dateFrom: "2026-01-01", dateTo: "2026-12-31", visibility: "shareable", locatedOnly: true })); expect(parsed).toEqual({ sortKey: "species", sortDirection: "asc", dateFrom: "2026-01-01", dateTo: "2026-12-31", visibility: "shareable", locatedOnly: true }); });
  it("volta ao padrão diante de JSON corrompido ou versão desconhecida", () => { expect(parseSightingsPreferences("{bad")).toEqual(DEFAULT_SIGHTINGS_PREFERENCES); expect(parseSightingsPreferences(JSON.stringify({ version: 99, sortKey: "location" }))).toEqual(DEFAULT_SIGHTINGS_PREFERENCES); });
  it("sanitiza valores inválidos sem criar preferências inseguras", () => { const parsed = parseSightingsPreferences(JSON.stringify({ version: 1, sortKey: "privateNotes", sortDirection: "sideways", visibility: "all-users", dateFrom: 42, dateTo: "2026-02-03T10:00:00Z", locatedOnly: "true" })); expect(parsed).toEqual({ ...DEFAULT_SIGHTINGS_PREFERENCES, dateTo: "2026-02-03" }); });
  it("não serializa a busca textual", () => { const serialized = serializeSightingsPreferences(DEFAULT_SIGHTINGS_PREFERENCES); expect(serialized).not.toContain("query"); expect(serialized).not.toContain("notes"); });
});
