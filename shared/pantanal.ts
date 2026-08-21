export type SpeciesGroup = "Mamíferos" | "Aves" | "Répteis" | "Anfíbios" | "Peixes" | "Invertebrados";
export type Environment = "Rios e corixos" | "Áreas alagadas" | "Campos" | "Matas" | "Bordas de mata";
export type LocationPrecision = "exact" | "approximate" | "municipality" | "none";
export type Visibility = "private" | "shareable";

export type Species = {
  id: string;
  commonName: string;
  scientificName: string;
  group: SpeciesGroup;
  environments: Environment[];
  description: string;
  physicalCharacteristics: string;
  habitat: string;
  behavior: string;
  diet: string;
  curiosities: string[];
  distribution: string;
  ecologicalImportance: string;
  conservationStatus?: string;
  images: { uri: string; author: string; license: string; sourceUrl: string; credit: string }[];
  sources: { title: string; url: string }[];
};

export type Sighting = {
  id: string;
  speciesId: string;
  photoUri?: string;
  date: string;
  time?: string;
  locationLabel?: string;
  latitude?: number;
  longitude?: number;
  locationPrecision: LocationPrecision;
  quantity?: number;
  notes?: string;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
};

export const groups: SpeciesGroup[] = ["Mamíferos", "Aves", "Répteis", "Anfíbios", "Peixes", "Invertebrados"];
export const environments: Environment[] = ["Rios e corixos", "Áreas alagadas", "Campos", "Matas", "Bordas de mata"];
export const languages = ["Português", "English", "Español"];

const commons = (file: string, author: string) => ({
  uri: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=900`,
  author,
  license: "CC BY-SA 4.0",
  sourceUrl: "https://commons.wikimedia.org/",
  credit: `${author} / Wikimedia Commons`,
});

export const species: Species[] = [
  {
    id: "tuiuiu", commonName: "Tuiuiú", scientificName: "Jabiru mycteria", group: "Aves", environments: ["Áreas alagadas", "Rios e corixos"],
    description: "Grande ave pernalta símbolo do Pantanal, frequentemente observada em áreas abertas e alagadas.", physicalCharacteristics: "Plumagem branca, cabeça preta e papo vermelho, com pernas longas e bico robusto.", habitat: "Campos inundáveis, baías, vazantes e margens de rios.", behavior: "Constrói ninhos altos e pode ser visto forrageando em águas rasas.", diet: "Peixes, anfíbios, répteis, insetos e pequenos vertebrados.", curiosities: ["É uma das maiores aves voadoras da América do Sul.", "Seu ninho pode ser reutilizado por vários anos."], distribution: "América Central e América do Sul, incluindo todo o Pantanal.", ecologicalImportance: "Ajuda a indicar a disponibilidade de alimento e a saúde das áreas úmidas.", conservationStatus: "Pouco preocupante", images: [commons("Jabiru mycteria - Brazil.jpg", "Wikimedia Commons"), commons("Jabiru mycteria flying.jpg", "Wikimedia Commons"), commons("Jabiru mycteria nest.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Jabiru mycteria", url: "https://www.iucnredlist.org/species/22697710/93625378" }]
  },
  {
    id: "arara-azul", commonName: "Arara-azul", scientificName: "Anodorhynchus hyacinthinus", group: "Aves", environments: ["Matas", "Bordas de mata"],
    description: "Arara de grande porte, reconhecida pela plumagem azul-cobalto e pelo bico poderoso.", physicalCharacteristics: "Azul intenso, anel amarelo ao redor dos olhos e da base do bico.", habitat: "Matas ciliares, áreas de carandazais e bordas de mata.", behavior: "Vive em pares ou grupos familiares e usa ocos de árvores para nidificar.", diet: "Principalmente frutos de palmeiras, como acuri e bocaiúva.", curiosities: ["O bico quebra frutos muito resistentes.", "A conservação depende da oferta de palmeiras e árvores com ocos."], distribution: "Brasil central, Bolívia e Paraguai, com população importante no Pantanal.", ecologicalImportance: "Dispersa sementes e participa da regeneração das palmeiras pantaneiras.", conservationStatus: "Vulnerável", images: [commons("Anodorhynchus hyacinthinus -Brazil-8.jpg", "Wikimedia Commons"), commons("Hyacinth Macaw.jpg", "Wikimedia Commons"), commons("Anodorhynchus hyacinthinus in flight.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Anodorhynchus hyacinthinus", url: "https://www.iucnredlist.org/species/22685516/132559780" }]
  },
  {
    id: "onca-pintada", commonName: "Onça-pintada", scientificName: "Panthera onca", group: "Mamíferos", environments: ["Matas", "Bordas de mata", "Rios e corixos"],
    description: "Maior felino das Américas e predador de topo dos ambientes pantaneiros.", physicalCharacteristics: "Pelagem dourada com rosetas, corpo musculoso e mordida muito potente.", habitat: "Matas próximas a rios, corixos e áreas com boa oferta de presas.", behavior: "Solitária, territorial e excelente nadadora.", diet: "Capivaras, jacarés, queixadas, cervos e outros vertebrados.", curiosities: ["As rosetas podem apresentar pequenos pontos centrais.", "Rios e baías são importantes corredores para a espécie."], distribution: "Do México ao norte da Argentina, com população relevante no Pantanal.", ecologicalImportance: "Regula populações de presas e ajuda a manter o equilíbrio das cadeias alimentares.", conservationStatus: "Quase ameaçada", images: [commons("Jaguar (Panthera onca) female.jpg", "Wikimedia Commons"), commons("Panthera onca at the river.jpg", "Wikimedia Commons"), commons("Jaguar portrait.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Panthera onca", url: "https://www.iucnredlist.org/species/15953/123791436" }]
  },
  {
    id: "capivara", commonName: "Capivara", scientificName: "Hydrochoerus hydrochaeris", group: "Mamíferos", environments: ["Rios e corixos", "Áreas alagadas", "Campos"],
    description: "Maior roedor vivo do mundo, muito associado às margens de corpos d’água.", physicalCharacteristics: "Corpo robusto, patas parcialmente palmadas e pelagem castanho-avermelhada.", habitat: "Margens de rios, lagoas, baías e campos úmidos.", behavior: "Social, vive em grupos e busca refúgio na água quando ameaçada.", diet: "Gramíneas e plantas aquáticas.", curiosities: ["Pode permanecer submersa por vários minutos.", "Grupos costumam apresentar forte organização social."], distribution: "Grande parte da América do Sul, incluindo o Pantanal.", ecologicalImportance: "É presa importante para grandes predadores e influencia a vegetação das margens.", conservationStatus: "Pouco preocupante", images: [commons("Hydrochoerus hydrochaeris.jpg", "Wikimedia Commons"), commons("Capybara swimming.jpg", "Wikimedia Commons"), commons("Capybara group.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Hydrochoerus hydrochaeris", url: "https://www.iucnredlist.org/species/10300/22190115" }]
  },
  {
    id: "jacare-do-pantanal", commonName: "Jacaré-do-pantanal", scientificName: "Caiman yacare", group: "Répteis", environments: ["Rios e corixos", "Áreas alagadas"], description: "Jacaré abundante nas águas pantaneiras, adaptado à dinâmica sazonal das cheias.", physicalCharacteristics: "Corpo alongado, focinho estreito e faixas claras na mandíbula.", habitat: "Baías, corixos, lagoas e rios de águas lentas.", behavior: "Toma sol nas margens e caça principalmente durante o período de atividade noturna.", diet: "Peixes, crustáceos, anfíbios e pequenos vertebrados.", curiosities: ["As áreas alagadas oferecem abrigo e alimento durante a seca.", "Filhotes usam vegetação marginal como proteção."], distribution: "Centro da América do Sul, especialmente Brasil, Bolívia e Paraguai.", ecologicalImportance: "Participa do controle de populações aquáticas e transporta nutrientes entre água e margens.", conservationStatus: "Pouco preocupante", images: [commons("Caiman yacare.jpg", "Wikimedia Commons"), commons("Yacare caiman river.jpg", "Wikimedia Commons"), commons("Caiman yacare closeup.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Caiman yacare", url: "https://www.iucnredlist.org/species/46584/3009948" }]
  },
];
