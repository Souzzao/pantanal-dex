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

const icmbioDatasetUrl = "https://collectory.sibbr.gov.br/collectory/public/show/dr327";
const icmbioOccurrenceUrl = "https://ala-hub.sibbr.gov.br/ala-hub/occurrence/search?q=data_resource_uid:dr327";
const checkedAt = "2026-08-27";

/**
 * Ledger conservador: sem retorno estruturado do portal regional, não há
 * confirmação de ocorrência. `pending-review` não significa ausência.
 */
export const regionalOccurrenceRecords: readonly RegionalOccurrenceRecord[] = [
  { speciesId: "pintado", scientificName: "Pseudoplatystoma corruscans", region: "Pantanal", status: "pending-review", sourceTitle: "ICMBio/SISBio — dataset de ocorrências no SiBBr", sourceUrl: icmbioDatasetUrl, queryUrl: `${icmbioOccurrenceUrl}%20AND%20scientificName:%22Pseudoplatystoma%20corruscans%22`, checkedAt, evidence: "Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional." },
  { speciesId: "pacu", scientificName: "Piaractus mesopotamicus", region: "Pantanal", status: "pending-review", sourceTitle: "ICMBio/SISBio — dataset de ocorrências no SiBBr", sourceUrl: icmbioDatasetUrl, queryUrl: `${icmbioOccurrenceUrl}%20AND%20scientificName:%22Piaractus%20mesopotamicus%22`, checkedAt, evidence: "Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional." },
  { speciesId: "piraputanga", scientificName: "Brycon hilarii", region: "Pantanal", status: "pending-review", sourceTitle: "ICMBio/SISBio — dataset de ocorrências no SiBBr", sourceUrl: icmbioDatasetUrl, queryUrl: `${icmbioOccurrenceUrl}%20AND%20scientificName:%22Brycon%20hilarii%22`, checkedAt, evidence: "Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional." },
  { speciesId: "caranguejo-agua-doce", scientificName: "Dilocarcinus pagei", region: "Pantanal", status: "pending-review", sourceTitle: "ICMBio/SISBio — dataset de ocorrências no SiBBr", sourceUrl: icmbioDatasetUrl, queryUrl: `${icmbioOccurrenceUrl}%20AND%20scientificName:%22Dilocarcinus%20pagei%22`, checkedAt, evidence: "Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional." },
  { speciesId: "camarao-agua-doce", scientificName: "Macrobrachium amazonicum", region: "Pantanal", status: "pending-review", sourceTitle: "ICMBio/SISBio — dataset de ocorrências no SiBBr", sourceUrl: icmbioDatasetUrl, queryUrl: `${icmbioOccurrenceUrl}%20AND%20scientificName:%22Macrobrachium%20amazonicum%22`, checkedAt, evidence: "Dataset oficial ICMBio/SISBio acessível no SiBBr; a consulta filtrada não retornou contagem estruturada dentro do limite do ambiente, portanto não confirma ocorrência no recorte regional." },
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
