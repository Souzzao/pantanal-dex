import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });
const gbif = (name: string) => ({ title: `GBIF Species Match — ${name}`, url: `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(name)}` });

export const mammals03: CatalogBatch = {
  batchId: "catalog-mammals-03",
  cycle: 3,
  group: "Mamíferos",
  status: "verified",
  sources: [
    gbif("Puma concolor"),
    gbif("Lontra longicaudis"),
    gbif("Pteronura brasiliensis"),
    gbif("Nasua nasua"),
  ],
  species: [
    {
      id: "puma-concolor", commonName: "Onça-parda", scientificName: "Puma concolor", group: "Mamíferos", environments: ["Campos", "Matas", "Bordas de mata"],
      description: "Felino de ampla distribuição nas Américas, capaz de utilizar mosaicos de campos, matas e áreas de transição.",
      physicalCharacteristics: "Corpo esbelto e musculoso, pelagem geralmente uniforme em tons pardos e cauda longa.",
      habitat: "Campos, cerrados, matas ciliares, bordas florestais e outros mosaicos com cobertura e disponibilidade de presas.",
      behavior: "É predominantemente solitária, territorial e crepuscular ou noturna, ajustando seus deslocamentos à disponibilidade de alimento.",
      diet: "Carnívora, alimenta-se de mamíferos de diferentes portes e de outros vertebrados disponíveis no ambiente.",
      curiosities: ["É um dos felinos de maior distribuição geográfica no continente americano.", "A cauda auxilia no equilíbrio durante deslocamentos e perseguições."],
      distribution: "Américas, do Canadá ao sul da América do Sul, em ambientes naturais e mosaicos preservados.",
      ecologicalImportance: "Atua como predador de topo e contribui para a regulação das populações de vertebrados terrestres.",
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Puma_concolor_puma_1.JPG", "CHUCAO", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Puma_concolor_puma_1.JPG", "CHUCAO / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Puma_concolor_706305049.jpg", "Colin Croft", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Puma_concolor_706305049.jpg", "Colin Croft / iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Puma_concolor_Not_a_Good_Place_to_Be.jpg", "USFWS Mountain-Prairie / Lori Iverson", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Puma_concolor_Not_a_Good_Place_to_Be.jpg", "USFWS Mountain-Prairie / Wikimedia Commons"),
      ],
      sources: [gbif("Puma concolor")],
    },
    {
      id: "lontra-longicaudis", commonName: "Lontra", scientificName: "Lontra longicaudis", group: "Mamíferos", environments: ["Rios e corixos", "Áreas alagadas", "Matas"],
      description: "Mustelídeo semiaquático associado a rios, córregos, lagoas e outros ambientes de água doce da região neotropical.",
      physicalCharacteristics: "Corpo alongado, patas curtas, pelagem densa e cauda musculosa adaptada à natação.",
      habitat: "Rios, corixos, lagoas, margens vegetadas e matas ciliares com abrigo e disponibilidade de presas aquáticas.",
      behavior: "Nada e mergulha com eficiência, utiliza tocas e margens como abrigo e pode apresentar atividade variável conforme o ambiente.",
      diet: "Peixes, crustáceos, anfíbios e outros pequenos animais aquáticos ou associados às margens.",
      curiosities: ["As vibrissas auxiliam na detecção de movimentos na água.", "A vegetação marginal oferece abrigo e corredores importantes para seus deslocamentos."],
      distribution: "América Central e América do Sul, em bacias hidrográficas de água doce.",
      ecologicalImportance: "Integra as cadeias alimentares aquáticas e funciona como predador de ambientes ripários e alagados.",
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Lontra_longicaudis_2.jpeg", "Carla Antonini", "CC BY-SA 2.5", "https://commons.wikimedia.org/wiki/File:Lontra_longicaudis_2.jpeg", "Carla Antonini / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Lontra_longicaudis_4.jpeg", "Carla Antonini", "CC BY-SA 2.5", "https://commons.wikimedia.org/wiki/File:Lontra_longicaudis_4.jpeg", "Carla Antonini / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Lontra_longicaudis_05.jpg", "Encarna Sáez Goñalons e Víctor Martínez Moll", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Lontra_longicaudis_05.jpg", "Encarna Sáez Goñalons e Víctor Martínez Moll / Wikimedia Commons"),
      ],
      sources: [gbif("Lontra longicaudis")],
    },
    {
      id: "pteronura-brasiliensis", commonName: "Ariranha", scientificName: "Pteronura brasiliensis", group: "Mamíferos", environments: ["Rios e corixos", "Áreas alagadas", "Matas"],
      description: "Grande mustelídeo semiaquático social, característico de rios, lagoas e áreas alagadas da América do Sul.",
      physicalCharacteristics: "Corpo alongado, pelagem escura com marcas claras no pescoço, patas palmadas e cauda forte.",
      habitat: "Rios, baías, lagoas, corixos e margens com abrigo, água limpa e oferta de peixes.",
      behavior: "Vive em grupos familiares, caça na água e usa vocalizações e comportamentos cooperativos para manter a coesão.",
      diet: "Principalmente peixes, complementados por crustáceos e outros animais aquáticos.",
      curiosities: ["É uma das maiores espécies de mustelídeos do mundo.", "A comunicação do grupo inclui vocalizações variadas e marcação nas margens."],
      distribution: "Bacias hidrográficas da América do Sul tropical, especialmente em áreas úmidas e rios de grande porte.",
      ecologicalImportance: "É predadora de ambientes aquáticos e indicadora da integridade de rios, lagoas e matas ciliares.",
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Giantotter.jpg", "Renaud d'Avout d'Auerstaedt", "CC BY-SA 2.5", "https://commons.wikimedia.org/wiki/File:Giantotter.jpg", "Renaud d'Avout d'Auerstaedt / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Giant_otter_(Pteronura_brasiliensis)_juvenile.jpg", "Charles J. Sharp", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Giant_otter_(Pteronura_brasiliensis)_juvenile.jpg", "Charles J. Sharp / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Giant_Otter_(Pteronura_brasiliensis)_resting_in_the_sun_..._-_Flickr_-_berniedup.jpg", "Bernard DUPONT", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Giant_Otter_(Pteronura_brasiliensis)_resting_in_the_sun_..._-_Flickr_-_berniedup.jpg", "Bernard DUPONT / Wikimedia Commons"),
      ],
      sources: [gbif("Pteronura brasiliensis")],
    },
    {
      id: "nasua-nasua", commonName: "Quati", scientificName: "Nasua nasua", group: "Mamíferos", environments: ["Matas", "Bordas de mata", "Campos"],
      description: "Mamífero onívoro de focinho alongado e cauda anelada, comum em florestas, cerrados arborizados e bordas de mata.",
      physicalCharacteristics: "Focinho móvel, garras fortes, pelagem castanha e cauda longa frequentemente mantida erguida.",
      habitat: "Matas, cerrados arborizados, bordas florestais, áreas de galeria e ambientes com frutos e abrigo.",
      behavior: "Fêmeas e jovens costumam formar grupos, enquanto machos adultos podem ser mais solitários; forrageia no solo e na vegetação.",
      diet: "Frutos, invertebrados, pequenos vertebrados e outros recursos encontrados no solo e em ocos ou galhos.",
      curiosities: ["O focinho e as garras ajudam a explorar folhas, serapilheira e cavidades.", "A cauda contribui para equilíbrio e comunicação visual durante os deslocamentos."],
      distribution: "América do Sul, em ampla variedade de formações florestais, savânicas e de transição.",
      ecologicalImportance: "Participa da dispersão de sementes, da predação de invertebrados e da transferência de energia entre estratos da vegetação.",
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Nasua_nasua_01.jpg", "MatthiasKabel", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Nasua_nasua_01.jpg", "MatthiasKabel / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Nasua_nasua_qtl1.jpg", "Quartl", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Nasua_nasua_qtl1.jpg", "Quartl / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Nasua_nasua.jpg", "Andrew Magill", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Nasua_nasua.jpg", "Andrew Magill / Wikimedia Commons"),
      ],
      sources: [gbif("Nasua nasua")],
    },
  ],
};
