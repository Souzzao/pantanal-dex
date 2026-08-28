import { describe, expect, it } from "vitest";
import type { Sighting } from "../shared/pantanal";
import { createSightingExport, parseSightingImport } from "../lib/sightings-transfer";

const sighting: Sighting = { id: "s-1", speciesId: "capivara", date: "2026-08-27", time: "10:30", locationLabel: "Baía", latitude: -16.2, longitude: -56.6, locationPrecision: "approximate", quantity: 2, notes: "Grupo observado", visibility: "private", createdAt: "2026-08-27T12:00:00.000Z", updatedAt: "2026-08-27T12:00:00.000Z" };

describe("sightings transfer", () => {
  it("exporta um envelope versionado sem perder dados do registro", () => {
    const parsed = JSON.parse(createSightingExport([sighting]));
    expect(parsed.version).toBe("2.0");
    expect(parsed.sightings).toEqual([sighting]);
  });

  it("importa o formato versionado, sanitiza campos e preserva privacidade", () => {
    const result = parseSightingImport(JSON.stringify({ version: "2.0", sightings: [{ ...sighting, secretToken: "não deve persistir" }] }));
    expect(result.accepted).toEqual([sighting]);
    expect("secretToken" in result.accepted[0]).toBe(false);
    expect(result.sourceVersion).toBe("2.0");
  });

  it("aceita arrays legados e informa a versão desconhecida", () => {
    const result = parseSightingImport(JSON.stringify([sighting]));
    expect(result.accepted).toEqual([sighting]);
    expect(result.sourceVersion).toBe("unknown");
  });

  it("relata registros inválidos e IDs duplicados sem abortar o restante", () => {
    const result = parseSightingImport(JSON.stringify({ version: "1.0", sightings: [sighting, sighting, { id: "bad" }] }));
    expect(result.accepted).toEqual([sighting]);
    expect(result.rejected).toEqual([{ index: 1, reason: "duplicate-id", id: "s-1" }, { index: 2, reason: "invalid-record", id: "bad" }]);
  });

  it("retorna rejeição controlada para JSON inválido ou envelope ausente", () => {
    expect(parseSightingImport("{bad").rejected[0].reason).toBe("invalid-record");
    expect(parseSightingImport(JSON.stringify({ version: "2.0" })).accepted).toEqual([]);
  });
});
