import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });

export const birds06: CatalogBatch = {
  batchId: "catalog-birds-06",
  cycle: 3,
  group: "Aves",
  status: "review-ready",
  sources: [
    { title: "GBIF Species Match — Ara ararauna", url: "https://api.gbif.org/v1/species/match?name=Ara%20ararauna" },
    { title: "ICMBio — Plano de Manejo da RPPN Dona Aracy/Estância Caiman", url: "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/pantanal/lista-de-ucs/rppn-dona-aracy-estancia-caiman/PM_RPPN_Dona_Aracy_Atualizado_13_10_22.pdf" },
  ],
  pendingNotes: [
    "A ocorrência no Pantanal é sustentada por estudo de movimentos sazonais e fonte oficial de avifauna; imagens de outras localidades não substituem evidência regional.",
    "A trilha de conservação permanece separada e não deve receber categoria sem correspondência oficial individual.",
  ],
  species: [{
    id: "arara-caninde", commonName: "Arara-canindé", scientificName: "Ara ararauna", group: "Aves", environments: ["Matas", "Bordas de mata"],
    description: "Arara de grande porte e plumagem azul e amarela, associada a florestas, matas ciliares e áreas abertas com árvores para abrigo e alimentação.",
    physicalCharacteristics: "Dorso e asas azuis, peito amarelo, face branca com linhas escuras, bico forte e cauda longa azulada.",
    habitat: "Matas ciliares, florestas, bordas de mata, savanas arborizadas e áreas do Pantanal com árvores maduras e oferta de frutos.",
    behavior: "Vive frequentemente em pares ou pequenos grupos, realiza deslocamentos diurnos e usa cavidades de árvores para dormir e reproduzir.",
    diet: "Frutos, sementes, castanhas e outras partes vegetais, com uso de bico robusto para abrir recursos protegidos.",
    curiosities: ["A plumagem azul e amarela explica o nome inglês blue-and-yellow macaw.", "A espécie depende de árvores maduras e cavidades para parte de seu ciclo de vida."],
    distribution: "Ampla distribuição na América do Sul, incluindo o Brasil central e o Pantanal; estudos documentam movimentos sazonais nas planícies de inundação do Pantanal setentrional.",
    ecologicalImportance: "Participa da dispersão e do consumo de sementes e funciona como espécie conspícua para monitoramento de paisagens florestais e savânicas.",
    images: [
      image("https://commons.wikimedia.org/wiki/Special:FilePath/Ara-ararauna.jpg", "Jan Smith", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Ara-ararauna.jpg", "Jan Smith / Wikimedia Commons"),
      image("https://commons.wikimedia.org/wiki/Special:FilePath/Ara%20ararauna%20-Jurong%20Bird%20Park%2C%20Singapore-8.jpg", "Jan Smith", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Ara_ararauna_-Jurong_Bird_Park,_Singapore-8.jpg", "Jan Smith / Wikimedia Commons"),
      image("https://commons.wikimedia.org/wiki/Special:FilePath/%22arara-canind%C3%A9%22%20-%20Ara%20ararauna.jpg", "DiogoKanouté", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:%22arara-canind%C3%A9%22_-_Ara_ararauna.jpg", "DiogoKanouté / Wikimedia Commons"),
    ],
    sources: [
      { title: "GBIF Species Match — Ara ararauna", url: "https://api.gbif.org/v1/species/match?name=Ara%20ararauna" },
      { title: "ICMBio — Plano de Manejo da RPPN Dona Aracy/Estância Caiman", url: "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/unidade-de-conservacao/unidades-de-biomas/pantanal/lista-de-ucs/rppn-dona-aracy-estancia-caiman/PM_RPPN_Dona_Aracy_Atualizado_13_10_22.pdf" },
    ],
  }],
};
