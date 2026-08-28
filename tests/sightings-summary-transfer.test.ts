import { describe, expect, it } from "vitest";
import { createSummaryCsv, createSummaryJson } from "../lib/sightings-summary-transfer";
import type { SightingsSummary } from "../lib/sightings-summary";

const summary: SightingsSummary = { total: 3, located: 2, privateCount: 1, shareableCount: 2, speciesCount: 2, earliestDate: "2026-08-01", latestDate: "2026-08-20", bySpecies: [{ speciesId: "capivara", commonName: "Capivara", count: 2 }, { speciesId: "tuiuiu", commonName: "Tuiuiú", count: 1 }] };

describe("sightings summary transfer", () => {
  it("exporta JSON versionado somente com métricas agregadas", () => { const parsed = JSON.parse(createSummaryJson(summary)); expect(parsed.version).toBe("1.0"); expect(parsed.summary).toMatchObject({ total: 3, located: 2, speciesCount: 2 }); expect(parsed.summary.bySpecies).toHaveLength(2); expect(parsed.summary.privateCount).toBe(1); expect(JSON.stringify(parsed)).not.toContain("notes"); expect(JSON.stringify(parsed)).not.toContain("locationLabel"); });
  it("exporta CSV com métricas e distribuição por espécie", () => { const csv = createSummaryCsv(summary); expect(csv).toContain('"metric","total","3"'); expect(csv).toContain('"species","capivara","Capivara","2"'); expect(csv).not.toContain("notes"); });
  it("mantém o formato válido para resumo vazio", () => { const csv = createSummaryCsv({ total: 0, located: 0, privateCount: 0, shareableCount: 0, speciesCount: 0, bySpecies: [] }); const json = JSON.parse(createSummaryJson({ total: 0, located: 0, privateCount: 0, shareableCount: 0, speciesCount: 0, bySpecies: [] })); expect(csv.split("\n")).toHaveLength(9); expect(json.summary.total).toBe(0); });
});
