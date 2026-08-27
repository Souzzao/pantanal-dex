export type ConservationReviewStatus = "pending-review" | "confirmed";
export type ConservationSourceKind = "SALVE" | "Livro Vermelho ICMBio" | "Portaria MMA/ICMBio" | "Avaliação ICMBio";
export type ConservationCategory = "CR" | "EN" | "VU" | "NT" | "LC" | "DD" | "NE";
export type ConservationFinding = "listed" | "not-listed";

export type ConservationReviewRecord = {
  speciesId: string;
  scientificName: string;
  status: ConservationReviewStatus;
  category?: ConservationCategory;
  finding?: ConservationFinding;
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
const salveVeadoUrl = "https://salve.icmbio.gov.br/salve/api/pdf/doi/382b574f73347872452b77383535307574712f6f3146344e796664364c3170367a593753377757333675493d";
const portaria148Url = "https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf";

/**
 * Trilha conservadora: SALVE/Livro Vermelho orientam a busca, mas nenhum
 * status entra no catálogo sem correspondência individual e fonte oficial.
 */
export const conservationReviewRecords: readonly ConservationReviewRecord[] = [
  { speciesId: "arara-caninde", scientificName: "Ara ararauna", status: "confirmed", finding: "not-listed", sourceKind: "Portaria MMA/ICMBio", sourceUrl: portaria148Url, decisionRule: "Registrar como não listado somente após busca textual exata na lista nacional oficial vigente; a ausência não deve ser convertida em categoria LC ou em avaliação de baixo risco.", evidence: "A Portaria MMA nº 148/2022 foi extraída e pesquisada por Ara ararauna e arara-canindé, sem correspondência exata. Foram também revisados resultados relacionados ao gênero Ara e ao termo arara para evitar confusão com outros táxons. Finding oficial limitado à lista nacional consultada; nenhuma categoria de ameaça foi inferida.", checkedAt },
  { speciesId: "veado-campeiro", scientificName: "Ozotoceros bezoarticus", status: "confirmed", category: "VU", sourceKind: "SALVE", sourceUrl: salveVeadoUrl, decisionRule: "Promover a categoria somente com correspondência oficial individual, preservando a unidade taxonômica avaliada quando a ficha do SALVE tratar de subespécie.", evidence: "A ficha oficial do ICMBio/SALVE avalia Ozotoceros bezoarticus bezoarticus (Linnaeus, 1758) como Vulnerável (VU), categoria datada de 08/02/2018 e publicada em 2023. A justificativa aplica o critério A2c e descreve declínio associado à perda de habitat e outras ameaças. O catálogo mantém o táxon específico Ozotoceros bezoarticus e registra explicitamente que a ficha consultada corresponde à subespécie O. b. bezoarticus.", checkedAt },
  { speciesId: "pintado", scientificName: "Pseudoplatystoma corruscans", status: "confirmed", category: "VU", sourceKind: "Portaria MMA/ICMBio", sourceUrl: "https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf", decisionRule: "Promover somente com correspondência taxonômica exata na lista oficial aplicável.", evidence: "A linha 448 do anexo de peixes da Portaria MMA nº 148, de 7 de junho de 2022, registra Pseudoplatystoma corruscans na família Pimelodidae com categoria VU (Vulnerável). Correspondência individual normativa; não inferida de ocorrência, imagem ou fonte secundária.", checkedAt },
  { speciesId: "pacu", scientificName: "Piaractus mesopotamicus", status: "confirmed", finding: "not-listed", sourceKind: "Portaria MMA/ICMBio", sourceUrl: "https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf", decisionRule: "Registrar como não listado somente após busca exata na lista nacional oficial vigente; não converter ausência em categoria LC.", evidence: "A Portaria MMA nº 148/2022 foi consultada por texto e não contém correspondência exata para Piaractus mesopotamicus nem para pacu. O Portal de Dados Abertos do MMA informa que as espécies ameaçadas reconhecidas nacionalmente são as constantes nessa Portaria, além das exceções explicitamente enumeradas. Finding oficial: não listado na lista nacional consultada; nenhuma categoria de ameaça foi inferida.", checkedAt },
  { speciesId: "piraputanga", scientificName: "Brycon hilarii", status: "confirmed", finding: "not-listed", sourceKind: "Portaria MMA/ICMBio", sourceUrl: "https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/aves-silvestres/arquivos/portaria-148-2022.pdf", decisionRule: "Registrar como não listado somente após busca exata na lista nacional oficial vigente; não converter ausência em categoria LC.", evidence: "A Portaria MMA nº 148/2022 foi consultada por texto e não contém correspondência exata para Brycon hilarii nem para piraputanga. O Portal de Dados Abertos do MMA define essa Portaria como base da lista nacional vigente de espécies ameaçadas, além de exceções específicas de elasmobrânquios. Finding oficial: não listado na lista nacional consultada; nenhuma categoria de ameaça foi inferida.", checkedAt },
  { speciesId: "caranguejo-agua-doce", scientificName: "Dilocarcinus pagei", status: "confirmed", category: "LC", sourceKind: "Avaliação ICMBio", sourceUrl: "https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/biodiversidade-marinha-do-sudeste-e-sul/acervo-digital/trabalhos-tecnicos/pub_2016_avaliacao_crustaceos_2010_2014-1.pdf", decisionRule: "Registrar a categoria somente quando a avaliação técnica oficial identificar individualmente o táxon e a categoria, preservando o período e o escopo metodológico da avaliação.", evidence: "O estudo técnico oficial do ICMBio Avaliação do risco de extinção dos crustáceos no Brasil (avaliações realizadas entre 2010 e 2014) registra Dilocarcinus pagei Stimpson, 1861 como Menos Preocupante (LC), conforme critérios de avaliação regional da IUCN (2003). A ficha justifica a categoria pela distribuição ampla, população presumivelmente grande e estável e ausência de ameaças de longo prazo. Trata-se de avaliação científica oficial do ICMBio, não de inferência nem de transposição automática para uma lista legal posterior.", checkedAt },
  { speciesId: "camarao-agua-doce", scientificName: "Macrobrachium amazonicum", status: "confirmed", category: "LC", sourceKind: "Avaliação ICMBio", sourceUrl: "https://www.gov.br/icmbio/pt-br/assuntos/centros-de-pesquisa/biodiversidade-marinha-do-sudeste-e-sul/acervo-digital/trabalhos-tecnicos/pub_2016_avaliacao_crustaceos_2010_2014-1.pdf", decisionRule: "Registrar a categoria somente quando a avaliação técnica oficial identificar individualmente o táxon e a categoria, preservando o período, o escopo e as ressalvas da avaliação.", evidence: "O estudo técnico oficial do ICMBio Avaliação do risco de extinção dos crustáceos no Brasil (avaliação realizada entre 2013 e 2014) registra Macrobrachium amazonicum (Heller, 1862) como Menos Preocupante (LC). A ficha descreve a espécie como abundante e amplamente distribuída, ressalva possível proximidade do limiar de sobrepesca em alguns locais e conclui não haver evidência de ameaças significativas ao longo de toda a distribuição. Trata-se de avaliação científica oficial datada, não de inferência nem de garantia de ausência de impactos atuais.", checkedAt },
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
    if (record.status === "confirmed" && !record.category && !record.finding) errors.push(`${record.speciesId}: confirmação sem categoria ou finding oficial`);
    if (record.status === "pending-review" && (record.category || record.finding)) errors.push(`${record.speciesId}: classificação preenchida em registro pendente`);
    if (record.category && record.finding === "not-listed") errors.push(`${record.speciesId}: não listado não pode ter categoria de ameaça`);
  }
  return errors;
}
