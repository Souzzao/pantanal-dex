import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string) => ({ uri, author, license, sourceUrl, credit: `${author} / Wikimedia Commons` });

export const mammals02: CatalogBatch = {
  batchId: "catalog-mammals-02",
  cycle: 5,
  group: "Mamíferos",
  status: "verified",
  reviewedAt: "2026-08-27",
  reviewedBy: "Agente 1 (Coordenador)",
  reviewChecklist: {
    taxonomy: true,
    occurrence: true,
    licenses: true,
    conservation: true,
  },
  sources: [
    { title: "Portaria MMA nº 1.704/2026 — Lista Nacional de Espécies Ameaçadas", url: "https://www.in.gov.br/en/web/dou/-/portaria-mma-n-1.704-de-16-de-junho-de-2026-712968917" },
    { title: "ICMBio — Resumo Executivo Mosaico Pantanal (Ocorrência)", url: "https://www.gov.br/icmbio/pt-br/acesso-a-informacao/participacao-social/resumo_executivo_mosaico_pantanal.pdf" },
  ],
  pendingNotes: [],
  species: [
    {
      id: "veado-campeiro", commonName: "Veado-campeiro", scientificName: "Ozotoceros bezoarticus", group: "Mamíferos", environments: ["Campos", "Bordas de mata"], description: "Cervo de áreas abertas que utiliza campos sazonalmente inundáveis e bordas de vegetação.", physicalCharacteristics: "Corpo esbelto, pelagem castanho-clara e galhadas nos machos adultos.", habitat: "Campos, savanas, cerrados e áreas abertas do Pantanal.", behavior: "Desloca-se em pequenos grupos e alterna alimentação, vigilância e repouso.", diet: "Gramíneas, folhas, brotos e outras plantas disponíveis.", curiosities: ["As galhadas são renovadas periodicamente nos machos.", "A abertura da paisagem favorece a detecção de predadores."], distribution: "Centro e leste da América do Sul, incluindo áreas do Pantanal.", ecologicalImportance: "Participa da herbivoria e transporta sementes entre ambientes abertos.",
      conservationStatus: "Vulnerável (VU)",
      conservationSource: { title: "Portaria MMA nº 1.704/2026", url: "https://www.in.gov.br/en/web/dou/-/portaria-mma-n-1.704-de-16-de-junho-de-2026-712968917" },
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Ozotoceros%20bezoarticus%20356636121.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Ozotoceros_bezoarticus_356636121.jpg"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Pampas%20Deer%20588756252.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Pampas_Deer_588756252.jpg"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Couple%20Pampas%20Deer.jpg?width=900", "Spencer Wright", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Couple_Pampas_Deer.jpg")
      ],
      sources: [
        { title: "GBIF Species Match — Ozotoceros bezoarticus", url: "https://api.gbif.org/v1/species/match?name=Ozotoceros%20bezoarticus" },
        { title: "ICMBio — Mosaico Pantanal (Ocorrência)", url: "https://www.gov.br/icmbio/pt-br/acesso-a-informacao/participacao-social/resumo_executivo_mosaico_pantanal.pdf" }
      ],
    },
    {
      id: "morcego-pescador", commonName: "Morcego-pescador", scientificName: "Noctilio leporinus", group: "Mamíferos", environments: ["Rios e corixos", "Áreas alagadas"], description: "Morcego associado a ambientes aquáticos, capaz de localizar presas na superfície da água.", physicalCharacteristics: "Corpo robusto, pés grandes e garras adaptadas para capturar presas aquáticas.", habitat: "Margens de rios, lagoas, baías e áreas úmidas.", behavior: "Ativo à noite, voa rente à água e utiliza ecolocalização para forragear.", diet: "Peixes pequenos, crustáceos e insetos aquáticos.", curiosities: ["As estruturas sensoriais ajudam a detectar ondulações na água.", "Abrigos podem ocorrer em ocos, folhagens e estruturas próximas a rios."], distribution: "América tropical, com registros em bacias brasileiras.", ecologicalImportance: "Controla invertebrados e pequenos peixes, conectando cadeias aquáticas e terrestres.",
      conservationStatus: "Menos Preocupante (LC)",
      conservationSource: { title: "Portaria MMA nº 1.704/2026", url: "https://www.in.gov.br/en/web/dou/-/portaria-mma-n-1.704-de-16-de-junho-de-2026-712968917" },
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Captive%20Noctilio%20leporinus.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Captive_Noctilio_leporinus.jpg"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Noctilio%20leporinus%20407860673.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Noctilio_leporinus_407860673.jpg"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Noctilio%20leporinus%20407860758.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Noctilio_leporinus_407860758.jpg")
      ],
      sources: [
        { title: "GBIF Species Match — Noctilio leporinus", url: "https://api.gbif.org/v1/species/match?name=Noctilio%20leporinus" },
        { title: "ICMBio — Mosaico Pantanal (Ocorrência)", url: "https://www.gov.br/icmbio/pt-br/acesso-a-informacao/participacao-social/resumo_executivo_mosaico_pantanal.pdf" }
      ],
    },
    {
      id: "ourico-cacheiro", commonName: "Ouriço-cacheiro", scientificName: "Coendou prehensilis", group: "Mamíferos", environments: ["Matas", "Bordas de mata"], description: "Roedor arborícola de hábitos noturnos que explora copas e bordas de mata.", physicalCharacteristics: "Corpo coberto por espinhos, cauda preênsil e patas adaptadas à escalada.", habitat: "Matas ciliares, florestas e bordas com árvores e cipós.", behavior: "Move-se lentamente pelas árvores e permanece oculto durante o dia.", diet: "Folhas, frutos, cascas, brotos e sementes.", curiosities: ["A cauda ajuda na sustentação durante a escalada.", "Os espinhos funcionam como defesa contra predadores."], distribution: "América do Sul tropical, incluindo o Pantanal.", ecologicalImportance: "Participa da herbivoria e da movimentação de sementes na vegetação.",
      conservationStatus: "Quase Ameaçada (NT)",
      conservationSource: { title: "SALVE/ICMBio", url: "https://salve.icmbio.gov.br/" },
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Coendou%20prehensilis%2053679112.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Coendou_prehensilis_53679112.jpg"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Prehensile-tailed%20porcupine%20sitting%20in%20tree%20-%20DPLA%20-%20fff999db3a9db19f15867971b2eea9db.jpg?width=900", "DPLA", "Public Domain", "https://commons.wikimedia.org/wiki/File:Prehensile-tailed_porcupine_sitting_in_tree_-_DPLA_-_fff999db3a9db19f15867971b2eea9db.jpg"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Prehensile-tailed%20porcupine%20standing%20in%20tree%20-%20DPLA%20-%202b17b9d581d2b59fea5e593453272b66.jpg?width=900", "DPLA", "Public Domain", "https://commons.wikimedia.org/wiki/File:Prehensile-tailed_porcupine_standing_in_tree_-_DPLA_-_2b17b9d581d2b59fea5e593453272b66.jpg")
      ],
      sources: [
        { title: "GBIF Species Match — Coendou prehensilis", url: "https://api.gbif.org/v1/species/match?name=Coendou%20prehensilis" },
        { title: "ICMBio — Mosaico Pantanal (Ocorrência)", url: "https://www.gov.br/icmbio/pt-br/acesso-a-informacao/participacao-social/resumo_executivo_mosaico_pantanal.pdf" }
      ],
    },
  ],
};
