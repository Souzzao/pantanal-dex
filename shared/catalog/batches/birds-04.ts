import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });

export const birds04: CatalogBatch = {
  batchId: "catalog-birds-04",
  cycle: 5,
  group: "Aves",
  status: "pending-review",
  pendingNotes: [
    "O lote representa parte da frente P1 solicitada: Tuiuiú/Jabiru e Arara-azul. Arara-canindé permanece em birds-03; Colhereiro foi acrescentado neste lote após validação taxonômica e de imagens.",
    "Não promover enquanto a ocorrência individual no Pantanal e a conservação oficial brasileira não estiverem documentadas em fonte ICMBio/MMA ou ficha SALVE reproduzível."
  ],
  sources: [
    { title: "GBIF — Jabiru mycteria", url: "https://www.gbif.org/species/2481932" },
    { title: "GBIF — Anodorhynchus hyacinthinus", url: "https://www.gbif.org/species/2479359" },
    { title: "GBIF — Platalea ajaja", url: "https://www.gbif.org/species/2480803" },
    { title: "Wikipédia — Colhereiro", url: "https://pt.wikipedia.org/wiki/Colhereiro" },
  ],
  species: [
    {
      id: "tuiuiu",
      commonName: "Tuiuiú",
      scientificName: "Jabiru mycteria",
      group: "Aves",
      environments: ["Áreas alagadas", "Rios e corixos"],
      description: "Grande ave pernalta símbolo do Pantanal, frequentemente observada em áreas abertas e alagadas.",
      physicalCharacteristics: "Plumagem branca, cabeça preta e papo vermelho, com pernas longas e bico robusto.",
      habitat: "Campos inundáveis, baías, vazantes e margens de rios.",
      behavior: "Constrói ninhos altos e pode ser visto forrageando em águas rasas.",
      diet: "Peixes, anfíbios, répteis, insetos e pequenos vertebrados.",
      curiosities: ["É uma das maiores aves voadoras da América do Sul.", "Seu ninho pode ser reutilizado por vários anos."],
      distribution: "América Central e América do Sul, incluindo todo o Pantanal.",
      ecologicalImportance: "Ajuda a indicar a disponibilidade de alimento e a saúde das áreas úmidas.",
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Jabiru%20mycteria%20-%20Brazil.jpg?width=900", "Dario Sanches", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Jabiru_mycteria_-_Brazil.jpg", "Dario Sanches / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Jabiru%20mycteria%20flying.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Jabiru_mycteria_flying.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Jabiru%20mycteria%20nest.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Jabiru_mycteria_nest.jpg", "iNaturalist / Wikimedia Commons")
      ],
      sources: [{ title: "GBIF — Jabiru mycteria", url: "https://www.gbif.org/species/2481932" }],
    },
    {
      id: "arara-azul",
      commonName: "Arara-azul",
      scientificName: "Anodorhynchus hyacinthinus",
      group: "Aves",
      environments: ["Matas", "Bordas de mata"],
      description: "Arara de grande porte, reconhecida pela plumagem azul-cobalto e pelo bico poderoso.",
      physicalCharacteristics: "Azul intenso, anel amarelo ao redor dos olhos e da base do bico.",
      habitat: "Matas ciliares, áreas de carandazais e bordas de mata.",
      behavior: "Vive em pares ou grupos familiares e usa ocos de árvores para nidificar.",
      diet: "Principalmente frutos de palmeiras, como acuri e bocaiúva.",
      curiosities: ["O bico quebra frutos muito resistentes.", "A conservação depende da oferta de palmeiras e árvores com ocos."],
      distribution: "Brasil central, Bolívia e Paraguai, com população importante no Pantanal.",
      ecologicalImportance: "Dispersa sementes e participa da regeneração das palmeiras pantaneiras.",
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Anodorhynchus%20hyacinthinus%20-Brazil-8.jpg", "Dario Sanches", "CC BY-SA 2.0", "https://commons.wikimedia.org/wiki/File:Anodorhynchus_hyacinthinus_-Brazil-8.jpg", "Dario Sanches / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Hyacinth%20Macaw.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Hyacinth_Macaw.jpg", "iNaturalist / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/017%20Hyacinth%20macaw%20flying%20in%20Encontro%20das%20%C3%81guas%20State%20Park%20Photo%20by%20Giles%20Laurent.jpg?width=900", "Giles Laurent", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:017_Hyacinth_macaw_flying_in_Encontro_das_%C3%81guas_State_Park_Photo_by_Giles_Laurent.jpg", "Giles Laurent / Wikimedia Commons")
      ],
      sources: [{ title: "GBIF — Anodorhynchus hyacinthinus", url: "https://www.gbif.org/species/2479359" }],
    },
    {
      id: "colhereiro",
      commonName: "Colhereiro",
      scientificName: "Platalea ajaja",
      group: "Aves",
      environments: ["Áreas alagadas", "Rios e corixos"],
      description: "Ave pernalta de áreas úmidas, reconhecida pelo bico achatado em forma de colher e pela plumagem rosada.",
      physicalCharacteristics: "Pescoço longo, pernas compridas, bico largo na extremidade e plumagem rosada.",
      habitat: "Águas rasas, margens de lagoas, baías, rios e outras áreas alagadas.",
      behavior: "Revira o fundo da água com o bico para localizar pequenos animais e pode forragear em bandos.",
      diet: "Peixes, crustáceos, insetos e outros pequenos animais aquáticos.",
      curiosities: ["O formato do bico favorece a busca de alimento em águas rasas.", "A intensidade da coloração rosada pode variar com a dieta."],
      distribution: "Américas tropicais e subtropicais; a confirmação de ocorrência específica no Pantanal permanece pendente nesta auditoria.",
      ecologicalImportance: "Integra as comunidades de aves limícolas e participa do fluxo de energia das áreas úmidas.",
      images: [
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Platalea_ajaja_5.jpg?width=900", "Riverbanks Outdoor Store / berichard", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Platalea_ajaja_5.jpg", "Riverbanks Outdoor Store / berichard / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Roseate_Spoonbill_Platalea_ajaja_JG.jpg?width=900", "JeffreyGammon", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Roseate_Spoonbill_Platalea_ajaja_JG.jpg", "JeffreyGammon / Wikimedia Commons"),
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Roseate_Spoonbill_Platalea_ajaja_National_Aviary_2650px.jpg?width=900", "Derek Ramsey (Ram-Man)", "CC BY-SA 2.5", "https://commons.wikimedia.org/wiki/File:Roseate_Spoonbill_Platalea_ajaja_National_Aviary_2650px.jpg", "Derek Ramsey (Ram-Man) / Wikimedia Commons")
      ],
      sources: [
        { title: "GBIF — Platalea ajaja", url: "https://www.gbif.org/species/2480803" },
        { title: "Wikipédia — Colhereiro", url: "https://pt.wikipedia.org/wiki/Colhereiro" }
      ],
    },
  ],
};
