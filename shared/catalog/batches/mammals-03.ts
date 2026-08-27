import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });

export const mammals03: CatalogBatch = {
  batchId: "catalog-mammals-03",
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
      id: "onca-pintada",
      commonName: "Onça-pintada",
      scientificName: "Panthera onca",
      group: "Mamíferos",
      environments: ["Matas", "Bordas de mata", "Rios e corixos"],
      description: "Maior felino das Américas e predador de topo dos ambientes pantaneiros.",
      physicalCharacteristics: "Pelagem dourada com rosetas, corpo musculoso e mordida muito potente.",
      habitat: "Matas próximas a rios, corixos e áreas com boa oferta de presas.",
      behavior: "Solitária, territorial e excelente nadadora.",
      diet: "Capivaras, jacarés, queixadas, cervos e outros vertebrados.",
      curiosities: ["As rosetas podem apresentar pequenos pontos centrais.", "Rios e baías são importantes corredores para a espécie."],
      distribution: "Do México ao norte da Argentina, com população relevante no Pantanal.",
      ecologicalImportance: "Regula populações de presas e ajuda a manter o equilíbrio das cadeias alimentares.",
      conservationStatus: "Vulnerável (VU)",
      conservationSource: { title: "Portaria MMA nº 1.704/2026", url: "https://www.in.gov.br/en/web/dou/-/portaria-mma-n-1.704-de-16-de-junho-de-2026-712968917" },
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Jaguar%20(Panthera%20onca)%20female.jpg?width=900", "Charles J. Sharp", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Jaguar_(Panthera_onca)_female.jpg", "Charles J. Sharp / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Panthera%20onca%20at%20the%20river.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Panthera_onca_at_the_river.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Jaguar%20portrait.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Jaguar_portrait.jpg", "iNaturalist / Wikimedia Commons")
      ],
      sources: [
        { title: "GBIF — Panthera onca", url: "https://www.gbif.org/species/2435194" },
        { title: "ICMBio — Mosaico Pantanal (Ocorrência)", url: "https://www.gov.br/icmbio/pt-br/acesso-a-informacao/participacao-social/resumo_executivo_mosaico_pantanal.pdf" }
      ],
    },
    {
      id: "anta",
      commonName: "Anta",
      scientificName: "Tapirus terrestris",
      group: "Mamíferos",
      environments: ["Matas", "Rios e corixos"],
      description: "Grande mamífero herbívoro que percorre matas, veredas e margens de rios no Pantanal.",
      physicalCharacteristics: "Corpo volumoso, focinho alongado e pelagem castanha curta.",
      habitat: "Matas ciliares, capões e áreas próximas à água.",
      behavior: "Solitária, geralmente mais ativa no crepúsculo e à noite.",
      diet: "Folhas, frutos, brotos e outras partes de plantas.",
      curiosities: ["É uma importante dispersora de sementes.", "Nada bem e usa a água para fugir de ameaças."],
      distribution: "América do Sul a leste dos Andes, incluindo o Pantanal.",
      ecologicalImportance: "Transporta sementes entre diferentes ambientes e contribui para a regeneração florestal.",
      conservationStatus: "Vulnerável (VU)",
      conservationSource: { title: "Portaria MMA nº 1.704/2026", url: "https://www.in.gov.br/en/web/dou/-/portaria-mma-n-1.704-de-16-de-junho-de-2026-712968917" },
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Lowland%20tapir%20(Tapirus%20terrestris).jpg?width=900", "Charles J. Sharp", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Lowland_tapir_(Tapirus_terrestris).jpg", "Charles J. Sharp / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Tapirus%20terrestris%2001.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Tapirus_terrestris_01.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Tapirus%20terrestris%20swimming.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Tapirus_terrestris_swimming.jpg", "iNaturalist / Wikimedia Commons")
      ],
      sources: [
        { title: "GBIF — Tapirus terrestris", url: "https://www.gbif.org/species/2440899" },
        { title: "ICMBio — Mosaico Pantanal (Ocorrência)", url: "https://www.gov.br/icmbio/pt-br/acesso-a-informacao/participacao-social/resumo_executivo_mosaico_pantanal.pdf" }
      ],
    },
    {
      id: "tamandua-bandeira",
      commonName: "Tamanduá-bandeira",
      scientificName: "Myrmecophaga tridactyla",
      group: "Mamíferos",
      environments: ["Campos", "Bordas de mata"],
      description: "Mamífero especializado em capturar formigas e cupins com a língua longa e pegajosa.",
      physicalCharacteristics: "Focinho tubular, cauda muito volumosa e faixa diagonal escura no corpo.",
      habitat: "Campos, savanas e bordas de matas com solo adequado para escavação.",
      behavior: "Caminha longas distâncias e pode ser ativo de dia ou à noite.",
      diet: "Formigas e cupins.",
      curiosities: ["Não possui dentes funcionais.", "A língua pode ser projetada repetidamente para retirar insetos dos ninhos."],
      distribution: "América Central e América do Sul, incluindo áreas abertas do Pantanal.",
      ecologicalImportance: "Controla populações de insetos sociais e revolve o solo ao abrir formigueiros e cupinzeiros.",
      conservationStatus: "Vulnerável (VU)",
      conservationSource: { title: "Portaria MMA nº 1.704/2026", url: "https://www.in.gov.br/en/web/dou/-/portaria-mma-n-1.704-de-16-de-junho-de-2026-712968917" },
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Myrmecophaga%20tridactyla.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Myrmecophaga_tridactyla.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Giant%20anteater%20walking.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Giant_anteater_walking.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Myrmecophaga%20tridactyla%20Pantanal.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Myrmecophaga_tridactyla_Pantanal.jpg", "iNaturalist / Wikimedia Commons")
      ],
      sources: [
        { title: "GBIF — Myrmecophaga tridactyla", url: "https://www.gbif.org/species/2436351" },
        { title: "ICMBio — Mosaico Pantanal (Ocorrência)", url: "https://www.gov.br/icmbio/pt-br/acesso-a-informacao/participacao-social/resumo_executivo_mosaico_pantanal.pdf" }
      ],
    },
    {
      id: "cervo-do-pantanal",
      commonName: "Cervo-do-pantanal",
      scientificName: "Blastocerus dichotomus",
      group: "Mamíferos",
      environments: ["Áreas alagadas", "Campos"],
      description: "Maior cervídeo da América do Sul, associado a várzeas, brejos e campos inundáveis.",
      physicalCharacteristics: "Pernas longas, pelagem castanho-avermelhada e galhadas ramificadas nos machos.",
      habitat: "Brejos, baías, campos inundáveis e margens de rios.",
      behavior: "Usa áreas alagadas como abrigo e desloca-se em busca de vegetação aquática.",
      diet: "Gramíneas, plantas aquáticas, folhas e brotos.",
      curiosities: ["As adaptações das pernas favorecem o deslocamento em terrenos úmidos.", "A espécie depende da manutenção de áreas úmidas conectadas."],
      distribution: "Centro e sul da América do Sul, com ocorrência no Pantanal.",
      ecologicalImportance: "Participa da dinâmica da vegetação de áreas úmidas e dispersa sementes.",
      conservationStatus: "Vulnerável (VU)",
      conservationSource: { title: "Portaria MMA nº 1.704/2026", url: "https://www.in.gov.br/en/web/dou/-/portaria-mma-n-1.704-de-16-de-junho-de-2026-712968917" },
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Blastocerus%20dichotomus.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Blastocerus_dichotomus.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Marsh%20deer%20Pantanal.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Marsh_deer_Pantanal.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Blastocerus%20dichotomus%20male.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Blastocerus_dichotomus_male.jpg", "iNaturalist / Wikimedia Commons")
      ],
      sources: [
        { title: "GBIF — Blastocerus dichotomus", url: "https://www.gbif.org/species/2440957" },
        { title: "ICMBio — Mosaico Pantanal (Ocorrência)", url: "https://www.gov.br/icmbio/pt-br/acesso-a-informacao/participacao-social/resumo_executivo_mosaico_pantanal.pdf" }
      ],
    },
    {
      id: "ariranha",
      commonName: "Ariranha",
      scientificName: "Pteronura brasiliensis",
      group: "Mamíferos",
      environments: ["Rios e corixos", "Áreas alagadas"],
      description: "Mamífero social e semiaquático que caça em rios, baías e corixos do Pantanal.",
      physicalCharacteristics: "Corpo alongado, patas palmadas, cauda forte e manchas claras no pescoço.",
      habitat: "Rios, lagoas, baías e margens com abrigo vegetal.",
      behavior: "Vive em grupos familiares, vocaliza e caça principalmente peixes.",
      diet: "Peixes, crustáceos e pequenos vertebrados aquáticos.",
      curiosities: ["Cada indivíduo pode apresentar marcas claras distintas no pescoço.", "A espécie depende de águas relativamente preservadas e conectadas."],
      distribution: "Bacias hidrográficas da América do Sul, com população importante no Pantanal.",
      ecologicalImportance: "É predadora de topo dos ambientes aquáticos e indica a qualidade dos rios.",
      conservationStatus: "Vulnerável (VU)",
      conservationSource: { title: "Portaria MMA nº 1.704/2026", url: "https://www.in.gov.br/en/web/dou/-/portaria-mma-n-1.704-de-16-de-junho-de-2026-712968917" },
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Pteronura%20brasiliensis.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Pteronura_brasiliensis.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Giant%20otter%20Pantanal.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Giant_otter_Pantanal.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Giant%20otter%20swimming.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Giant_otter_swimming.jpg", "iNaturalist / Wikimedia Commons")
      ],
      sources: [
        { title: "GBIF — Pteronura brasiliensis", url: "https://www.gbif.org/species/2433728" },
        { title: "ICMBio — Mosaico Pantanal (Ocorrência)", url: "https://www.gov.br/icmbio/pt-br/acesso-a-informacao/participacao-social/resumo_executivo_mosaico_pantanal.pdf" }
      ],
    },
    {
      id: "capivara",
      commonName: "Capivara",
      scientificName: "Hydrochoerus hydrochaeris",
      group: "Mamíferos",
      environments: ["Rios e corixos", "Áreas alagadas", "Campos"],
      description: "Maior roedor vivo do mundo, muito associado às margens de corpos d’água.",
      physicalCharacteristics: "Corpo robusto, patas parcialmente palmadas e pelagem castanho-avermelhada.",
      habitat: "Margens de rios, lagoas, baías e campos úmidos.",
      behavior: "Social, vive em grupos e busca refúgio na água quando ameaçada.",
      diet: "Gramíneas e plantas aquáticas.",
      curiosities: ["Pode permanecer submersa por vários minutos.", "Grupos costumam apresentar forte organização social."],
      distribution: "Grande parte da América do Sul, incluindo o Pantanal.",
      ecologicalImportance: "É presa importante para grandes predadores e influencia a vegetação das margens.",
      conservationStatus: "Menos Preocupante (LC)",
      conservationSource: { title: "Portaria MMA nº 1.704/2026", url: "https://www.in.gov.br/en/web/dou/-/portaria-mma-n-1.704-de-16-de-junho-de-2026-712968917" },
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Hydrochoerus%20hydrochaeris.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Hydrochoerus_hydrochaeris.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Capybara%20swimming.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Capybara_swimming.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Capybara%20group.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Capybara_group.jpg", "iNaturalist / Wikimedia Commons")
      ],
      sources: [
        { title: "GBIF — Hydrochoerus hydrochaeris", url: "https://www.gbif.org/species/2439871" },
        { title: "ICMBio — Mosaico Pantanal (Ocorrência)", url: "https://www.gov.br/icmbio/pt-br/acesso-a-informacao/participacao-social/resumo_executivo_mosaico_pantanal.pdf" }
      ],
    },
    {
      id: "bugio-preto",
      commonName: "Bugio-preto",
      scientificName: "Alouatta caraya",
      group: "Mamíferos",
      environments: ["Matas", "Bordas de mata"],
      description: "Primata de vocalização potente, associado a matas ciliares e capões do Pantanal.",
      physicalCharacteristics: "Pelagem escura nos machos, rosto marcado e cauda preênsil.",
      habitat: "Matas ciliares, capões e bordas de floresta.",
      behavior: "Vive em grupos e emite vocalizações territoriais ao amanhecer.",
      diet: "Folhas, frutos, flores e brotos.",
      curiosities: ["As vocalizações podem ser ouvidas a grandes distâncias.", "A cauda auxilia na locomoção entre galhos."],
      distribution: "Centro e leste da América do Sul, incluindo o Pantanal.",
      ecologicalImportance: "Dispersa sementes e influencia a regeneração das matas.",
      conservationStatus: "Menos Preocupante (LC)",
      conservationSource: { title: "Portaria MMA nº 1.704/2026", url: "https://www.in.gov.br/en/web/dou/-/portaria-mma-n-1.704-de-16-de-junho-de-2026-712968917" },
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Alouatta%20caraya.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Alouatta_caraya.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Alouatta%20caraya%20male.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Alouatta_caraya_male.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Black%20howler%20monkey.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Black_howler_monkey.jpg", "iNaturalist / Wikimedia Commons")
      ],
      sources: [
        { title: "GBIF — Alouatta caraya", url: "https://www.gbif.org/species/2436653" },
        { title: "ICMBio — Mosaico Pantanal (Ocorrência)", url: "https://www.gov.br/icmbio/pt-br/acesso-a-informacao/participacao-social/resumo_executivo_mosaico_pantanal.pdf" }
      ],
    },
    {
      id: "lontra-neotropical",
      commonName: "Lontra-neotropical",
      scientificName: "Lontra longicaudis",
      group: "Mamíferos",
      environments: ["Rios e corixos", "Matas"],
      description: "Lontra de hábitos discretos que utiliza rios, córregos e lagoas com margens vegetadas.",
      physicalCharacteristics: "Corpo fusiforme, patas parcialmente palmadas e pelagem marrom densa.",
      habitat: "Cursos d’água, lagoas e matas ciliares.",
      behavior: "Solta ou em pequenos grupos, nada com agilidade e repousa em tocas e barrancos.",
      diet: "Peixes, crustáceos, anfíbios e pequenos vertebrados.",
      curiosities: ["Pode deixar marcas e fezes em pontos de passagem nas margens.", "A vegetação ciliar oferece abrigo e locais de descanso."],
      distribution: "América Central e América do Sul, incluindo o Pantanal.",
      ecologicalImportance: "Participa do controle de organismos aquáticos e conecta ambientes terrestres e aquáticos.",
      conservationStatus: "Quase Ameaçada (NT)",
      conservationSource: { title: "SALVE/ICMBio", url: "https://salve.icmbio.gov.br/" },
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Lontra%20longicaudis.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Lontra_longicaudis.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Neotropical%20otter%20river.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Neotropical_otter_river.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Lontra%20longicaudis%20swimming.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Lontra_longicaudis_swimming.jpg", "iNaturalist / Wikimedia Commons")
      ],
      sources: [
        { title: "GBIF — Lontra longicaudis", url: "https://www.gbif.org/species/2433755" },
        { title: "ICMBio — Mosaico Pantanal (Ocorrência)", url: "https://www.gov.br/icmbio/pt-br/acesso-a-informacao/participacao-social/resumo_executivo_mosaico_pantanal.pdf" }
      ],
    },
  ],
};
