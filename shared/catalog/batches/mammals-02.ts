import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });

export const mammals02: CatalogBatch = {
  batchId: "catalog-mammals-02",
  cycle: 3,
  group: "Mamíferos",
  status: "review-ready",
  sources: [
    { title: "GBIF Species Match — Ozotoceros bezoarticus", url: "https://api.gbif.org/v1/species/match?name=Ozotoceros%20bezoarticus" },
    { title: "ICMBio — PAN Cervídeos", url: "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/pan/pan-cervideos" },
    { title: "ICMBio — Portaria de aprovação do PAN Cervídeos", url: "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/pan/pan-cervideos/1-ciclo/pan-cervideos-portaria-aprovacao.pdf" },
  ],
  pendingNotes: [
    "A subespécie pantaneira Ozotoceros bezoarticus leucogaster possui histórico próprio de avaliação; não atribuir automaticamente sua categoria à espécie nominal sem conferir a fonte taxonômica e o escopo da avaliação.",
    "As imagens são de indivíduos fotografados no Uruguai e no Pantanal brasileiro; imagens são evidência visual e crédito/licença, não substituem a trilha de ocorrência regional.",
  ],
  species: [
    {
      id: "veado-campeiro", commonName: "Veado-campeiro", scientificName: "Ozotoceros bezoarticus", group: "Mamíferos", environments: ["Campos"],
      description: "Cervo de áreas abertas da América do Sul, associado a campos naturais, savanas e mosaicos campestres do Pantanal e de outras formações abertas.",
      physicalCharacteristics: "Cervo de porte médio, pelagem castanho-amarelada a parda, ventre claro e, nos machos, galhadas ramificadas que são renovadas periodicamente.",
      habitat: "Campos naturais, savanas, cerrados abertos e áreas campestres do Pantanal, com acesso a abrigo, alimento e água.",
      behavior: "Pode formar pequenos grupos, desloca-se em áreas abertas e alterna períodos de alimentação, vigilância e repouso conforme a disponibilidade de recursos e o risco de perturbação.",
      diet: "Predominantemente herbívora, composta por gramíneas, folhas, brotos, flores e outros recursos vegetais disponíveis nos campos.",
      curiosities: ["O nome científico da espécie é aceito no GBIF como Ozotoceros bezoarticus (Linnaeus, 1758).", "A população do Pantanal é tradicionalmente associada à subespécie Ozotoceros bezoarticus leucogaster, uma distinção que exige cuidado taxonômico ao interpretar avaliações de conservação."],
      distribution: "Distribuição sul-americana em áreas abertas, incluindo o Pantanal brasileiro; estudos de ecologia e estrutura social documentam a espécie no Pantanal.",
      ecologicalImportance: "Contribui para a dinâmica dos campos naturais como herbívoro e integra as relações tróficas de áreas abertas e savânicas.",
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Venado-UY-Ozotoceros%20bezoarticus.jpg", "Fedaro", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Venado-UY-Ozotoceros_bezoarticus.jpg", "Fedaro / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Pampas%20deer%20nursing%20fwan.jpg", "Scott Presnell", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Pampas_deer_nursing_fwan.jpg", "Scott Presnell / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Venado-Campo-UY-Ozotoceros%20bezoarticus.jpg", "Fedaro", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Venado-Campo-UY-Ozotoceros_bezoarticus.jpg", "Fedaro / Wikimedia Commons"),
      ],
      sources: [
        { title: "GBIF Species Match — Ozotoceros bezoarticus", url: "https://api.gbif.org/v1/species/match?name=Ozotoceros%20bezoarticus" },
        { title: "ICMBio — PAN Cervídeos", url: "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/pan/pan-cervideos" },
        { title: "ICMBio — Portaria de aprovação do PAN Cervídeos", url: "https://www.gov.br/icmbio/pt-br/assuntos/biodiversidade/pan/pan-cervideos/1-ciclo/pan-cervideos-portaria-aprovacao.pdf" },
      ],
    },
  ],
};
