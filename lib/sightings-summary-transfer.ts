import type { SightingsSummary } from "./sightings-summary";

export const SIGHTINGS_SUMMARY_TRANSFER_VERSION = "1.0" as const;

export function createSummaryJson(summary: SightingsSummary) {
  return JSON.stringify({ version: SIGHTINGS_SUMMARY_TRANSFER_VERSION, exportedAt: new Date().toISOString(), summary: { total: summary.total, located: summary.located, privateCount: summary.privateCount, shareableCount: summary.shareableCount, speciesCount: summary.speciesCount, earliestDate: summary.earliestDate ?? null, latestDate: summary.latestDate ?? null, bySpecies: summary.bySpecies.map(({ speciesId, commonName, count }) => ({ speciesId, commonName, count })) } }, null, 2);
}

function csvCell(value: string | number) { return `"${String(value).replaceAll('"', '""')}"`; }
export function createSummaryCsv(summary: SightingsSummary) {
  const rows = [["tipo", "chave", "valor"], ["metric", "total", summary.total], ["metric", "located", summary.located], ["metric", "privateCount", summary.privateCount], ["metric", "shareableCount", summary.shareableCount], ["metric", "speciesCount", summary.speciesCount], ["metric", "earliestDate", summary.earliestDate ?? ""], ["metric", "latestDate", summary.latestDate ?? ""], ["species", "speciesId", "commonName", "count"], ...summary.bySpecies.map((item) => ["species", item.speciesId, item.commonName, item.count])];
  return rows.map((row) => row.map((value) => csvCell(value)).join(",")).join("\n");
}
