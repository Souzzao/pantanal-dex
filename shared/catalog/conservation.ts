export type ConservationReviewStatus = "pending-review" | "confirmed";
export type ConservationSourceKind = "SALVE" | "Livro Vermelho ICMBio" | "Portaria MMA/ICMBio";
export type ConservationCategory = "CR" | "EN" | "VU" | "NT" | "LC" | "DD" | "NE";

export type ConservationReviewRecord = {
  speciesId: string;
  scientificName: string;
  status: ConservationReviewStatus;
  category?: ConservationCategory;
  sourceKind: ConservationSourceKind;
  sourceUrl: string;
  decisionRule: string;
  evidence: string;
  checkedAt: string;
};

const salveUrl = "https://salve.icmbio.gov.br/";
const redBookUrl = "https://www.gov.br/icmbio/pt-br/centrais-de-conteudo/publicacoes/publicacoes-diversas/livro-vermelho/livro-vermelho-da-fauna-brasileira-ameacada-de-extincao-2018";
const officialListsUrl = "https://www.gov.br/mma/pt-br/assuntos/biodiversidade-e-biomas/biodiversidade1/conservacao-de-especies";
const checkedAt = "2026-08-27";

/**
 * Trilha conservadora: SALVE/Livro Vermelho orientam a busca, mas nenhum
 * status entra no catálogo sem correspondência individual e fonte oficial.
 */
export const conservationReviewRecords: readonly ConservationReviewRecord[] = [
  { speciesId: "pintado", scientificName: "Pseudoplatystoma corruscans", status: "confirmed", category: "VU", sourceKind: "Portaria MMA/ICMBio", sourceUrl: "https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf", decisionRule: "Promover somente com correspondência taxonômica exata na lista oficial aplicável.", evidence: "A linha 448 do anexo de peixes da Portaria MMA nº 148, de 7 de junho de 2022, registra Pseudoplatystoma corruscans na família Pimelodidae com categoria VU (Vulnerável). Correspondência individual normativa; não inferida de ocorrência, imagem ou fonte secundária.", checkedAt },
  { speciesId: "pacu", scientificName: "Piaractus mesopotamicus", status: "pending-review", sourceKind: "SALVE", sourceUrl: salveUrl, decisionRule: "Preencher somente com categoria individual do SALVE/Livro Vermelho ou lista oficial aplicável.", evidence: "Trilha oficial preparada; nenhuma correspondência individual foi registrada nesta etapa.", checkedAt },
  { speciesId: "piraputanga", scientificName: "Brycon hilarii", status: "pending-review", sourceKind: "Livro Vermelho ICMBio", sourceUrl: redBookUrl, decisionRule: "Preencher somente após localizar a espécie no volume taxonômico e conferir a categoria oficial.", evidence: "Trilha oficial preparada; nenhuma correspondência individual foi registrada nesta etapa.", checkedAt },
  { speciesId: "caranguejo-agua-doce", scientificName: "Dilocarcinus pagei", status: "pending-review", sourceKind: "Livro Vermelho ICMBio", sourceUrl: redBookUrl, decisionRule: "Preencher somente após localizar a espécie no volume de invertebrados e conferir a categoria oficial.", evidence: "Trilha oficial preparada; nenhuma correspondência individual foi registrada nesta etapa.", checkedAt },
  { speciesId: "camarao-agua-doce", scientificName: "Macrobrachium amazonicum", status: "pending-review", sourceKind: "Portaria MMA/ICMBio", sourceUrl: officialListsUrl, decisionRule: "Conferir a lista oficial aplicável a peixes/invertebrados aquáticos e só preencher com correspondência taxonômica exata.", evidence: "Trilha oficial preparada; nenhuma correspondência individual foi registrada nesta etapa.", checkedAt },
];

export function validateConservationReviewRecords(records: readonly ConservationReviewRecord[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const record of records) {
    if (!record.speciesId.trim() || ids.has(record.speciesId)) errors.push(`${record.speciesId || "sem-id"}: ID de conservação ausente ou duplicado`);
    ids.add(record.speciesId);
    if (!record.scientificName.trim()) errors.push(`${record.speciesId}: nome científico ausente`);
    if (!/^https:\/\//.test(record.sourceUrl)) errors.push(`${record.speciesId}: fonte de conservação sem HTTPS`);
    if (!record.decisionRule.trim() || !record.evidence.trim()) errors.push(`${record.speciesId}: regra/evidência de conservação ausente`);
    if (record.status === "confirmed" && record.evidence.includes("nenhuma correspondência")) errors.push(`${record.speciesId}: confirmação sem evidência individual`);
    if (record.status === "confirmed" && !record.category) errors.push(`${record.speciesId}: confirmação sem categoria oficial`);
    if (record.status === "pending-review" && record.category) errors.push(`${record.speciesId}: categoria preenchida em registro pendente`);
  }
  return errors;
}
