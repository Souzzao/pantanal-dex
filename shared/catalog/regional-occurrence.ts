import type { Species } from "../pantanal";

export type RegionalOccurrenceStatus = "confirmed" | "pending-review";

export type RegionalOccurrenceRecord = {
  speciesId: string;
  scientificName: string;
  region: "Pantanal";
  status: RegionalOccurrenceStatus;
  sourceTitle: string;
  sourceUrl: string;
  queryUrl: string;
  checkedAt: string;
  evidence: string;
};

const sibbrRegionUrl = "https://regions.sibbr.gov.br/regions";
const sibbrOccurrenceUrl = "https://ala-hub.sibbr.gov.br/ala-hub/occurrences/search?taxa=";
const checkedAt = "2026-08-22";

/**
 * Ledger conservador: sem retorno estruturado do portal regional, não há
 * confirmação de ocorrência. `pending-review` não significa ausência.
 */
export const regionalOccurrenceRecords: readonly RegionalOccurrenceRecord[] = [
  { speciesId: "pintado", scientificName: "Pseudoplatystoma corruscans", region: "Pantanal", status: "pending-review", sourceTitle: "SiBBr — ocorrência por região", sourceUrl: sibbrRegionUrl, queryUrl: `${sibbrOccurrenceUrl}Pseudoplatystoma%20corruscans`, checkedAt, evidence: "Consulta oficial iniciada; o ambiente disponível não retornou resposta estruturada para confirmar o recorte regional." },
  { speciesId: "pacu", scientificName: "Piaractus mesopotamicus", region: "Pantanal", status: "pending-review", sourceTitle: "SiBBr — ocorrência por região", sourceUrl: sibbrRegionUrl, queryUrl: `${sibbrOccurrenceUrl}Piaractus%20mesopotamicus`, checkedAt, evidence: "Consulta oficial iniciada; o ambiente disponível não retornou resposta estruturada para confirmar o recorte regional." },
  { speciesId: "piraputanga", scientificName: "Brycon hilarii", region: "Pantanal", status: "pending-review", sourceTitle: "SiBBr — ocorrência por região", sourceUrl: sibbrRegionUrl, queryUrl: `${sibbrOccurrenceUrl}Brycon%20hilarii`, checkedAt, evidence: "Consulta oficial iniciada; o ambiente disponível não retornou resposta estruturada para confirmar o recorte regional." },
  { speciesId: "caranguejo-agua-doce", scientificName: "Dilocarcinus pagei", region: "Pantanal", status: "pending-review", sourceTitle: "SiBBr — ocorrência por região", sourceUrl: sibbrRegionUrl, queryUrl: `${sibbrOccurrenceUrl}Dilocarcinus%20pagei`, checkedAt, evidence: "Consulta oficial iniciada; o ambiente disponível não retornou resposta estruturada para confirmar o recorte regional." },
  { speciesId: "camarao-agua-doce", scientificName: "Macrobrachium amazonicum", region: "Pantanal", status: "pending-review", sourceTitle: "SiBBr — ocorrência por região", sourceUrl: sibbrRegionUrl, queryUrl: `${sibbrOccurrenceUrl}Macrobrachium%20amazonicum`, checkedAt, evidence: "Consulta oficial iniciada; o ambiente disponível não retornou resposta estruturada para confirmar o recorte regional." },
];

export function validateRegionalOccurrenceRecords(records: readonly RegionalOccurrenceRecord[]): string[] {
  const errors: string[] = [];
  for (const record of records) {
    if (!record.speciesId.trim()) errors.push("registro regional sem speciesId");
    if (record.region !== "Pantanal") errors.push(`${record.speciesId}: região regional inválida`);
    if (!/^https:\/\//.test(record.sourceUrl) || !/^https:\/\//.test(record.queryUrl)) errors.push(`${record.speciesId}: fonte regional sem HTTPS`);
    if (!record.evidence.trim()) errors.push(`${record.speciesId}: evidência regional ausente`);
    if (record.status === "confirmed" && record.evidence.includes("não retornou")) errors.push(`${record.speciesId}: confirmação incompatível com evidência pendente`);
  }
  return errors;
}
