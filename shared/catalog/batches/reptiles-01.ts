import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });

export const reptiles01: CatalogBatch = {
  batchId: "catalog-reptiles-01",
  cycle: 7,
  group: "Répteis",
  status: "pending-review",
  sources: [
    { title: "IUCN Red List — Salvator merianae", url: "https://www.iucnredlist.org/search?query=Salvator%20merianae&searchType=species" },
    { title: "IUCN Red List — Oxybelis aeneus", url: "https://www.iucnredlist.org/search?query=Oxybelis%20aeneus&searchType=species" },
  ],
  pendingNotes: ["Confirmar nomes aceitos, situação de conservação e ocorrência no Pantanal em revisão taxonômica especializada."],
  species: [
    {
      id: "teiu", commonName: "Teiú", scientificName: "Salvator merianae", group: "Répteis", environments: ["Campos", "Bordas de mata", "Matas"],
      description: "Lagarto terrestre de grande porte que utiliza áreas abertas, bordas e ambientes florestados.",
      physicalCharacteristics: "Corpo robusto, cauda longa, coloração escura com manchas claras e membros fortes.",
      habitat: "Campos, cerrados, bordas de mata e clareiras com abrigo e oferta de alimento.",
      behavior: "Forrageia principalmente no solo, alternando períodos de atividade com abrigo em tocas e cavidades.",
      diet: "Frutos, ovos, insetos, pequenos vertebrados e outros itens encontrados durante o forrageamento.",
      curiosities: ["A cauda longa auxilia no equilíbrio e na locomoção.", "Pode usar tocas e abrigos no solo para proteção."],
      distribution: "Regiões do leste e centro da América do Sul, incluindo grande parte do Brasil.",
      ecologicalImportance: "Participa do controle de invertebrados e da movimentação de sementes e matéria orgânica no solo.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/c/cd/Argentine_Black-and-white_Tegu_%28Salvator_merianae%29%2C_Parque_Estadual_Encontro_das_%C3%81guas_Thomas-Fuhrmann.jpg", "Thomas Fuhrmann", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Argentine_Black-and-white_Tegu_(Salvator_merianae),_Parque_Estadual_Encontro_das_Águas_Thomas-Fuhrmann.jpg", "Thomas Fuhrmann / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/2/23/182_Argentine_black_and_white_tegu_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:182_Argentine_black_and_white_tegu_in_Encontro_das_Águas_State_Park_Photo_by_Giles_Laurent.jpg", "Giles Laurent / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/c/ce/Salvator_merianae_-_Rafael_-_470540720.jpeg", "Rafael", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Salvator_merianae_-_Rafael_-_470540720.jpeg", "Rafael / Wikimedia Commons"),
      ],
      sources: [{ title: "IUCN Red List — Salvator merianae", url: "https://www.iucnredlist.org/search?query=Salvator%20merianae&searchType=species" }],
    },
    {
      id: "cobra-cipo", commonName: "Cobra-cipó", scientificName: "Oxybelis aeneus", group: "Répteis", environments: ["Matas", "Bordas de mata"],
      description: "Serpente delgada e arborícola que se desloca entre ramos e folhagens de ambientes tropicais.",
      physicalCharacteristics: "Corpo muito esguio, cabeça alongada e coloração que favorece a camuflagem entre galhos e folhas.",
      habitat: "Matas, bordas florestais e vegetação arbustiva com estrutura para locomoção arborícola.",
      behavior: "Permanece entre a vegetação, observando o entorno e capturando presas por aproximação e bote rápido.",
      diet: "Pequenos vertebrados, especialmente lagartos e outros animais de tamanho compatível.",
      curiosities: ["O corpo fino produz uma silhueta semelhante a um galho.", "A cabeça alongada é uma característica marcante do gênero."],
      distribution: "Ampla distribuição nas Américas tropicais, com ocorrência em diferentes ambientes florestais e savânicos.",
      ecologicalImportance: "Integra as cadeias alimentares arborícolas como predadora de pequenos vertebrados.",
      images: [
        image("https://upload.wikimedia.org/wikipedia/commons/a/a1/Oxybelis_aeneus_01.jpg", "Brian Gratwicke", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Oxybelis_aeneus_01.jpg", "Brian Gratwicke / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/2/2b/Oxybelis_aeneus.jpg", "Tod Baker", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Oxybelis_aeneus.jpg", "Tod Baker / Wikimedia Commons"),
        image("https://upload.wikimedia.org/wikipedia/commons/e/e0/Oxybelis_aeneus_%28Costa_Rica%29.jpg", "Lucas Vogel", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Oxybelis_aeneus_(Costa_Rica).jpg", "Lucas Vogel / Wikimedia Commons"),
      ],
      sources: [{ title: "IUCN Red List — Oxybelis aeneus", url: "https://www.iucnredlist.org/search?query=Oxybelis%20aeneus&searchType=species" }],
    },
  ],
};
