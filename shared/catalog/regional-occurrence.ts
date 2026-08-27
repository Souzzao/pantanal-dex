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
const gbifMatchUrl = "https://api.gbif.org/v1/species/match?name=Pseudoplatystoma%20corruscans";
const embrapaMirandaUrl = "https://www.infoteca.cnptia.embrapa.br/infoteca/handle/doc/789558";
const gbifPacuUrl = "https://api.gbif.org/v1/species/match?name=Piaractus%20mesopotamicus";
const scieloPacuUrl = "https://www.scielo.br/j/bjb/a/dNGnkpjV7M9Fx7GtyGBD7zg/?format=html&lang=en&ilang=pt_BR";
const gbifPiraputangaUrl = "https://api.gbif.org/v1/species/match?name=Brycon%20hilarii";
const springerPiraputangaUrl = "https://link.springer.com/article/10.1134/S0032945217030092";
const gbifCaranguejoUrl = "https://api.gbif.org/v1/species/match?name=Dilocarcinus%20pagei";
const scieloCaranguejoUrl = "https://www.scielo.br/j/paz/a/8d5vM7nQbcDxLyVHgvPnvQb/?lang=pt";
const gbifCamaraoUrl = "https://api.gbif.org/v1/species/match?name=Macrobrachium%20amazonicum";
const pubmedCamaraoUrl = "https://pubmed.ncbi.nlm.nih.gov/23894962/";
const gbifJauUrl = "https://api.gbif.org/v1/species/match?name=Zungaro%20jahu";
const pubmedJauUrl = "https://pubmed.ncbi.nlm.nih.gov/19372007/";
const gbifArmadeiraUrl = "https://api.gbif.org/v1/species/match?name=Phoneutria%20nigriventer";
const scieloArmadeiraUrl = "https://www.scielo.br/j/isz/a/VnwWHnXJMxyw8mbMxbgsVmx/?lang=pt";
const checkedAt = "2026-08-27";

/**
 * Ledger conservador: sem retorno estruturado do portal regional, não há
 * confirmação de ocorrência. `pending-review` não significa ausência.
 */
export const regionalOccurrenceRecords: readonly RegionalOccurrenceRecord[] = [
  { speciesId: "pintado", scientificName: "Pseudoplatystoma corruscans", region: "Pantanal", status: "confirmed", sourceTitle: "Embrapa-CPAP — estudo da bacia do rio Miranda, Pantanal de Mato Grosso do Sul", sourceUrl: embrapaMirandaUrl, queryUrl: gbifMatchUrl, checkedAt, evidence: "A publicação da Embrapa analisa explicitamente Pseudoplatystoma corruscans na bacia hidrográfica do rio Miranda, Pantanal do Mato Grosso do Sul, e descreve sua migração, desova nos rios Miranda e Aquidauana e dispersão pelas áreas alagadas. O GBIF/Catalogue of Life confirma Pseudoplatystoma corruscans (Spix & Agassiz, 1829) como espécie aceita. Evidências separadas de ocorrência regional e identidade taxonômica; conservação não inferida." },
  { speciesId: "pacu", scientificName: "Piaractus mesopotamicus", region: "Pantanal", status: "confirmed", sourceTitle: "SciELO — estudo de rendimento por recruta do pacu no Pantanal de Mato Grosso do Sul", sourceUrl: scieloPacuUrl, queryUrl: gbifPacuUrl, checkedAt, evidence: "O artigo publicado no Brazilian Journal of Biology informa que Piaractus mesopotamicus é uma das espécies mais capturadas no Pantanal de Mato Grosso do Sul e analisa dados de peixes capturados na região. O GBIF/Catalogue of Life confirma Piaractus mesopotamicus (Holmberg, 1887) como espécie aceita. Evidências separadas de ocorrência regional e identidade taxonômica; conservação não inferida." },
  { speciesId: "piraputanga", scientificName: "Brycon hilarii", region: "Pantanal", status: "confirmed", sourceTitle: "Springer — populações de Brycon hilarii no Pantanal", sourceUrl: springerPiraputangaUrl, queryUrl: gbifPiraputangaUrl, checkedAt, evidence: "O artigo do Journal of Ichthyology descreve Brycon hilarii como espécie endêmica da bacia hidrográfica do Alto Paraguai e analisa seis coleções na região do Pantanal. Estudo SciELO independente registra 80 exemplares coletados em quatro pontos da sub-bacia do rio Miranda e descreve a espécie como amplamente distribuída pela bacia do rio Paraguai. O GBIF/Catalogue of Life confirma Brycon hilarii (Valenciennes, 1850) como espécie aceita. Evidências separadas de ocorrência regional e identidade taxonômica; conservação não inferida." },
  { speciesId: "caranguejo-agua-doce", scientificName: "Dilocarcinus pagei", region: "Pantanal", status: "confirmed", sourceTitle: "SciELO — distribuição de Trichodactylidae em alagados do Pantanal Mato-Grossense", sourceUrl: scieloCaranguejoUrl, queryUrl: gbifCaranguejoUrl, checkedAt, evidence: "O artigo de Papéis Avulsos de Zoologia estudou caranguejos em alagados do Pantanal Mato-Grossense entre os rios Cuiabá e São Lourenço e nomeia Dilocarcinus pagei entre as espécies registradas na bacia do Alto Paraguai, incluindo as três espécies mais abundantes amostradas. O GBIF/Catalogue of Life confirma Dilocarcinus pagei Stimpson, 1861 como espécie aceita. Evidências separadas de ocorrência regional e identidade taxonômica; conservação não inferida." },
  { speciesId: "camarao-agua-doce", scientificName: "Macrobrachium amazonicum", region: "Pantanal", status: "confirmed", sourceTitle: "PubMed — características reprodutivas e morfométricas de Macrobrachium amazonicum no Pantanal", sourceUrl: pubmedCamaraoUrl, queryUrl: gbifCamaraoUrl, checkedAt, evidence: "O artigo da Revista de Biología Tropical estudou 2.270 exemplares de Macrobrachium amazonicum coletados em dois habitats naturais de água doce — rio Miranda e Lagoa Baiazinha — no Pantanal de Mato Grosso do Sul, Brasil. O GBIF/Catalogue of Life confirma Macrobrachium amazonicum (Heller, 1862) como espécie aceita. Evidências separadas de ocorrência regional e identidade taxonômica; conservação não inferida." },
  { speciesId: "zungaro-jahu", scientificName: "Zungaro jahu", region: "Pantanal", status: "confirmed", sourceTitle: "PubMed — Myxobolus cordeiroi em Zungaro jahu no Pantanal brasileiro", sourceUrl: pubmedJauUrl, queryUrl: gbifJauUrl, checkedAt, evidence: "O estudo parasitológico examinou 50 exemplares de jaú no Pantanal brasileiro e identificou explicitamente o hospedeiro como Zungaro jahu; o artigo descreve Myxobolus cordeiroi infectando essa espécie. O GBIF/Catalogue of Life confirma Zungaro jahu (Ihering, 1898) como espécie aceita. A ocorrência regional é confirmada; a categoria de conservação não é inferida deste registro." },
  { speciesId: "phoneutria-nigriventer", scientificName: "Phoneutria nigriventer", region: "Pantanal", status: "confirmed", sourceTitle: "SciELO — Diversidade e composição da araneofauna do Mato Grosso do Sul, Brasil", sourceUrl: scieloArmadeiraUrl, queryUrl: gbifArmadeiraUrl, checkedAt, evidence: "A compilação científica da araneofauna do Mato Grosso do Sul inclui amostragens no Passo do Lontra, município de Corumbá, e na Serra do Amolar, ambas no Pantanal Sul; Phoneutria nigriventer aparece entre as seis espécies com mais de dez registros no estado. O GBIF/Catalogue of Life confirma Phoneutria nigriventer (Keyserling, 1891) como espécie aceita. A fonte sustenta ocorrência regional no recorte do Pantanal Sul, com a ressalva de que o artigo compila registros em escala estadual e não atribui cada registro individual a uma única localidade." },
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
