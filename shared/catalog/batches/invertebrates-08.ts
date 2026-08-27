import type { CatalogBatch } from "../types";

type Image = { uri: string; author: string; license: string; sourceUrl: string; credit: string };
const image = (uri: string, author: string, license: string, sourceUrl: string): Image => ({ uri, author, license, sourceUrl, credit: `${author} / Wikimedia Commons` });
const gbif = (name: string) => ({ title: `GBIF Species Match — ${name}`, url: `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(name)}` });

export const invertebrates08: CatalogBatch = {
  batchId: "catalog-invertebrates-08",
  cycle: 12,
  group: "Invertebrados",
  status: "review-ready",
  sources: [
    gbif("Phoneutria nigriventer"),
    { title: "Ministério da Saúde — Guia de Animais Peçonhentos do Brasil", url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/animais-peconhentos/publicacoes/guia-animais-peconhentos-do-brasil.pdf" },
  ],
  pendingNotes: [
    "Ocorrência regional sustentada por compilação científica da araneofauna do Mato Grosso do Sul, que inclui amostragens em Corumbá/Passo do Lontra e registra Phoneutria nigriventer entre as espécies com mais de dez registros no estado.",
    "Nenhuma categoria de conservação nacional foi inferida; a revisão normativa MMA/ICMBio permanece pendente.",
    "Aranha-armadeira é espécie de interesse em saúde pública; o catálogo é educativo e não substitui orientação médica ou identificação profissional.",
  ],
  species: [{
    id: "phoneutria-nigriventer",
    commonName: "Aranha-armadeira",
    scientificName: "Phoneutria nigriventer",
    group: "Invertebrados",
    environments: ["Matas", "Bordas de mata"],
    description: "Aranha errante de grande porte, de hábitos predominantemente noturnos e importância médica, registrada na fauna do Mato Grosso do Sul.",
    physicalCharacteristics: "Corpo robusto, pernas longas, coloração castanha e postura defensiva com os dois primeiros pares de pernas elevados quando ameaçada.",
    habitat: "Serapilheira, troncos, vegetação baixa, bordas de mata e outros abrigos terrestres; registros no estado incluem localidades do Pantanal Sul.",
    behavior: "Caçadora ativa, principalmente noturna, que não depende de teia para capturar presas e pode adotar postura defensiva quando perturbada.",
    diet: "Insetos e outros artrópodes, além de pequenas presas compatíveis com seu porte.",
    curiosities: ["O gênero Phoneutria é conhecido como grupo de aranhas errantes brasileiras de interesse em saúde pública.", "A compilação da araneofauna do Mato Grosso do Sul destaca lacunas de amostragem, especialmente no Pantanal norte."],
    distribution: "Brasil e outros países do Cone Sul conforme a literatura taxonômica; no Brasil, a espécie está documentada no Mato Grosso do Sul, incluindo o recorte do Pantanal Sul.",
    ecologicalImportance: "Predadora de artrópodes e componente da fauna terrestre de matas, bordas e serapilheira.",
    images: [
      image("https://upload.wikimedia.org/wikipedia/commons/9/99/Phoneutria_nigriventer.jpg", "João P. Burini", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Phoneutria_nigriventer.jpg"),
      image("https://upload.wikimedia.org/wikipedia/commons/0/09/Phoneutria_nigriventer_Brisbane.jpg", "Graham Wise", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Phoneutria_nigriventer_Brisbane.jpg"),
      image("https://upload.wikimedia.org/wikipedia/commons/7/70/Phoneutria_nigriventer_male.jpg", "pablohcapovilla", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Phoneutria_nigriventer_male.jpg"),
    ],
    sources: [
      gbif("Phoneutria nigriventer"),
      { title: "Ministério da Saúde — Guia de Animais Peçonhentos do Brasil", url: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/animais-peconhentos/publicacoes/guia-animais-peconhentos-do-brasil.pdf" },
    ],
  }],
};
