import type { CatalogBatch } from "../types";

type Image = { uri: string; author: string; credit: string; license: string; sourceUrl: string; source: string };
const image = (uri: string, author: string, license: string, sourceUrl: string, source: string): Image => ({ uri, author, credit: author, license, sourceUrl, source });
const gbif = (name: string) => ({ title: `GBIF Species Match — ${name}`, url: `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(name)}` });

export const fish07: CatalogBatch = {
  batchId: "catalog-fish-07",
  cycle: 12,
  group: "Peixes",
  status: "review-ready",
  sources: [
    gbif("Zungaro jahu"),
    { title: "PubMed — Myxobolus cordeiroi em Zungaro jahu no Pantanal brasileiro", url: "https://pubmed.ncbi.nlm.nih.gov/19372007/" },
  ],
  pendingNotes: [
    "Ocorrência no Pantanal confirmada por estudo primário que examinou 50 jaús brasileiros; a publicação é parasitológica, mas identifica explicitamente o hospedeiro Zungaro jahu.",
    "A avaliação Near Threatened exibida pelo GBIF é global e não foi convertida em categoria normativa brasileira; conservação permanece pendente de fonte MMA/ICMBio específica.",
    "As imagens do lote são figuras do artigo SciELO sobre o jaú, licenciadas em CC BY 4.0; a licença permite uso comercial com atribuição e as figuras não constituem evidência independente de ocorrência regional.",
  ],
  species: [{
    id: "zungaro-jahu",
    commonName: "Jaú",
    scientificName: "Zungaro jahu",
    group: "Peixes",
    environments: ["Rios e corixos"],
    description: "Grande bagre predador de água doce, associado a canais profundos e rios da bacia do Prata, incluindo o Pantanal.",
    physicalCharacteristics: "Corpo robusto, cabeça larga e achatada, barbilhões longos e coloração parda ou olivácea com ventre mais claro.",
    habitat: "Canais profundos, calhas de rios, poços e trechos com abrigo estrutural; no Pantanal, está ligado à rede de rios e ambientes conectados.",
    behavior: "Predador de grande porte que utiliza o fundo e estruturas do canal para repouso e captura de presas.",
    diet: "Principalmente peixes e outros animais aquáticos de tamanho compatível.",
    curiosities: ["O GBIF registra Zungaro jahu como espécie aceita e lista Paulicea jahu como nome original de uso histórico.", "É um dos grandes pimelodídeos associados aos rios da bacia do Prata."],
    distribution: "Bacia do Prata, com ocorrência documentada no Pantanal brasileiro; a espécie também foi registrada fora de sua área nativa no alto rio Iguaçu.",
    ecologicalImportance: "Predador de grande porte que participa da estruturação das comunidades de peixes e depende da conectividade longitudinal dos rios.",
    images: [
      image("https://minio.scielo.br/documentstore/2179-975X/9SwFrcF7SCMSf4H5cczJvSh/eb5356f76ea4ae038beae2ff4c61e58b1afe041c.jpg", "Frota et al. / SciELO", "CC BY 4.0", "https://actalb.org/journal/alb/article/doi/10.1590/S2179-975X4322", "SciELO / Acta Limnologica Brasiliensia"),
      image("https://minio.scielo.br/documentstore/2179-975X/9SwFrcF7SCMSf4H5cczJvSh/bbe751f3163c3c5c784e0b420675e8b4a95bee3f.jpg", "Frota et al. / SciELO", "CC BY 4.0", "https://actalb.org/journal/alb/article/doi/10.1590/S2179-975X4322", "SciELO / Acta Limnologica Brasiliensia"),
      image("https://minio.scielo.br/documentstore/2179-975X/9SwFrcF7SCMSf4H5cczJvSh/10d4d6c32f2e72335dc553c39b6318bc30ad09cf.jpg", "Frota et al. / SciELO", "CC BY 4.0", "https://actalb.org/journal/alb/article/doi/10.1590/S2179-975X4322", "SciELO / Acta Limnologica Brasiliensia"),
    ],
    sources: [
      gbif("Zungaro jahu"),
      { title: "PubMed — Myxobolus cordeiroi em Zungaro jahu no Pantanal brasileiro", url: "https://pubmed.ncbi.nlm.nih.gov/19372007/" },
    ],
  }],
};
