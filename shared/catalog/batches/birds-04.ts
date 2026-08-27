import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });

export const birds04: CatalogBatch = {
  batchId: "catalog-birds-04",
  cycle: 5,
  group: "Aves",
  status: "pending-review",
  sources: [
    { title: "GBIF — Jabiru mycteria", url: "https://www.gbif.org/species/2481932" },
    { title: "GBIF — Anodorhynchus hyacinthinus", url: "https://www.gbif.org/species/2479359" },
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
        image("https://commons.wikimedia.org/wiki/Special:FilePath/Anodorhynchus%20hyacinthinus%20in%20flight.jpg?width=900", "iNaturalist", "CC BY 4.0", "https://commons.wikimedia.org/wiki/File:Anodorhynchus_hyacinthinus_in_flight.jpg", "iNaturalist / Wikimedia Commons")
      ],
      sources: [{ title: "GBIF — Anodorhynchus hyacinthinus", url: "https://www.gbif.org/species/2479359" }],
    },
  ],
};
