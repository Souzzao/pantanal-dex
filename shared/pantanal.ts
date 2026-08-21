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
  reviewedAt: string;
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

const commons = (file: string, author: string, license = "CC BY-SA 4.0") => ({
  uri: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=900`,
  author,
  license,
  sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replaceAll(" ", "_"))}`,
  credit: `${author} / Wikimedia Commons`,
});

export function normalizeCatalogSearch(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const species: Species[] = [
  {
    id: "tuiuiu", commonName: "Tuiuiú", scientificName: "Jabiru mycteria", group: "Aves", environments: ["Áreas alagadas", "Rios e corixos"],
    description: "Grande ave pernalta símbolo do Pantanal, frequentemente observada em áreas abertas e alagadas.", physicalCharacteristics: "Plumagem branca, cabeça preta e papo vermelho, com pernas longas e bico robusto.", habitat: "Campos inundáveis, baías, vazantes e margens de rios.", behavior: "Constrói ninhos altos e pode ser visto forrageando em águas rasas.", diet: "Peixes, anfíbios, répteis, insetos e pequenos vertebrados.", curiosities: ["É uma das maiores aves voadoras da América do Sul.", "Seu ninho pode ser reutilizado por vários anos."], distribution: "América Central e América do Sul, incluindo todo o Pantanal.", ecologicalImportance: "Ajuda a indicar a disponibilidade de alimento e a saúde das áreas úmidas.", conservationStatus: "Pouco preocupante", reviewedAt: "2026-08-21", images: [commons("002 Jabiru feeding its babies in their nest in Encontro das Águas State Park Photo by Giles Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0"), commons("Jabiru (Jabiru mycteria) 2.JPG", "Charles J. Sharp", "CC BY-SA 4.0"), commons("Jabirus (Jabiru mycteria) on nest.JPG", "Charles J. Sharp", "CC BY-SA 4.0")], sources: [{ title: "IUCN Red List — Jabiru mycteria", url: "https://www.iucnredlist.org/species/22697710/93625378" }]
  },
  {
    id: "arara-azul", commonName: "Arara-azul", scientificName: "Anodorhynchus hyacinthinus", group: "Aves", environments: ["Matas", "Bordas de mata"],
    description: "Arara de grande porte, reconhecida pela plumagem azul-cobalto e pelo bico poderoso.", physicalCharacteristics: "Azul intenso, anel amarelo ao redor dos olhos e da base do bico.", habitat: "Matas ciliares, áreas de carandazais e bordas de mata.", behavior: "Vive em pares ou grupos familiares e usa ocos de árvores para nidificar.", diet: "Principalmente frutos de palmeiras, como acuri e bocaiúva.", curiosities: ["O bico quebra frutos muito resistentes.", "A conservação depende da oferta de palmeiras e árvores com ocos."], distribution: "Brasil central, Bolívia e Paraguai, com população importante no Pantanal.", ecologicalImportance: "Dispersa sementes e participa da regeneração das palmeiras pantaneiras.", conservationStatus: "Vulnerável", reviewedAt: "2026-08-21", images: [commons("007 Hyacinth macaw couple under Pink Ipê tree in Encontro das Águas State Park Photo by Giles Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0"), commons("017 Hyacinth macaw flying in Encontro das Águas State Park Photo by Giles Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0"), commons("Hyacinth Macaw (Anodorhynchus hyacinthinus), Parque Estadual Encontro das Águas Thomas-Fuhrmann 2.jpg", "Thomas Fuhrmann", "CC BY-SA 4.0")], sources: [{ title: "IUCN Red List — Anodorhynchus hyacinthinus", url: "https://www.iucnredlist.org/species/22685516/132559780" }]
  },
  {
    id: "onca-pintada", commonName: "Onça-pintada", scientificName: "Panthera onca", group: "Mamíferos", environments: ["Matas", "Bordas de mata", "Rios e corixos"],
    description: "Maior felino das Américas e predador de topo dos ambientes pantaneiros.", physicalCharacteristics: "Pelagem dourada com rosetas, corpo musculoso e mordida muito potente.", habitat: "Matas próximas a rios, corixos e áreas com boa oferta de presas.", behavior: "Solitária, territorial e excelente nadadora.", diet: "Capivaras, jacarés, queixadas, cervos e outros vertebrados.", curiosities: ["As rosetas podem apresentar pequenos pontos centrais.", "Rios e baías são importantes corredores para a espécie."], distribution: "Do México ao norte da Argentina, com população relevante no Pantanal.", ecologicalImportance: "Regula populações de presas e ajuda a manter o equilíbrio das cadeias alimentares.", conservationStatus: "Quase ameaçada", reviewedAt: "2026-08-21", images: [commons("Chapultepec Zoo - Jaguar (02).jpg", "Katie Chan", "CC BY-SA 4.0"), commons("Jaguar (Panthera onca palustris) female Piquiri River 2.JPG", "Charles J. Sharp", "CC BY-SA 4.0"), commons("Jaguar (Panthera onca palustris) male Rio Negro 2.JPG", "Charles J. Sharp", "CC BY-SA 4.0")], sources: [{ title: "IUCN Red List — Panthera onca", url: "https://www.iucnredlist.org/species/15953/123791436" }]
  },
  {
    id: "capivara", commonName: "Capivara", scientificName: "Hydrochoerus hydrochaeris", group: "Mamíferos", environments: ["Rios e corixos", "Áreas alagadas", "Campos"],
    description: "Maior roedor vivo do mundo, muito associado às margens de corpos d’água.", physicalCharacteristics: "Corpo robusto, patas parcialmente palmadas e pelagem castanho-avermelhada.", habitat: "Margens de rios, lagoas, baías e campos úmidos.", behavior: "Social, vive em grupos e busca refúgio na água quando ameaçada.", diet: "Gramíneas e plantas aquáticas.", curiosities: ["Pode permanecer submersa por vários minutos.", "Grupos costumam apresentar forte organização social."], distribution: "Grande parte da América do Sul, incluindo o Pantanal.", ecologicalImportance: "É presa importante para grandes predadores e influencia a vegetação das margens.", conservationStatus: "Pouco preocupante", reviewedAt: "2026-08-21", images: [commons("046 Capybara by the river in Encontro das Águas State Park Photo by Giles Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0"), commons("Capivara(Hydrochoerus hydrochaeris).jpg", "Clodomiro Esteves Junior", "CC BY-SA 4.0"), commons("Capybara skeleton.jpg", "Museum of Veterinary Anatomy FMVZ USP / Wagner Souza e Silva", "CC BY-SA 4.0")], sources: [{ title: "IUCN Red List — Hydrochoerus hydrochaeris", url: "https://www.iucnredlist.org/species/10300/22190115" }]
  },
  {
    id: "jacare-do-pantanal", commonName: "Jacaré-do-pantanal", scientificName: "Caiman yacare", group: "Répteis", environments: ["Rios e corixos", "Áreas alagadas"], description: "Jacaré abundante nas águas pantaneiras, adaptado à dinâmica sazonal das cheias.", physicalCharacteristics: "Corpo alongado, focinho estreito e faixas claras na mandíbula.", habitat: "Baías, corixos, lagoas e rios de águas lentas.", behavior: "Toma sol nas margens e caça principalmente durante o período de atividade noturna.", diet: "Peixes, crustáceos, anfíbios e pequenos vertebrados.", curiosities: ["As áreas alagadas oferecem abrigo e alimento durante a seca.", "Filhotes usam vegetação marginal como proteção."], distribution: "Centro da América do Sul, especialmente Brasil, Bolívia e Paraguai.", ecologicalImportance: "Participa do controle de populações aquáticas e transporta nutrientes entre água e margens.", conservationStatus: "Pouco preocupante", reviewedAt: "2026-08-21", images: [commons("023 Yacare caiman sunbathing in Encontro das Águas State Park Photo by Giles Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0"), commons("Brillenkaiman Caiman yacare.jpg", "Andreas Trepte", "CC BY-SA 4.0"), commons("Jacaré do pantanal.jpg", "Jairmoreirafotografia", "CC BY-SA 4.0")], sources: [{ title: "IUCN Red List — Caiman yacare", url: "https://www.iucnredlist.org/species/46584/3009948" }]
  },
  {
    id: "anta", commonName: "Anta", scientificName: "Tapirus terrestris", group: "Mamíferos", environments: ["Matas", "Rios e corixos"],
    description: "Grande mamífero herbívoro que percorre matas, veredas e margens de rios no Pantanal.", physicalCharacteristics: "Corpo volumoso, focinho alongado e pelagem castanha curta.", habitat: "Matas ciliares, capões e áreas próximas à água.", behavior: "Solitária, geralmente mais ativa no crepúsculo e à noite.", diet: "Folhas, frutos, brotos e outras partes de plantas.", curiosities: ["É uma importante dispersora de sementes.", "Nada bem e usa a água para fugir de ameaças."], distribution: "América do Sul a leste dos Andes, incluindo o Pantanal.", ecologicalImportance: "Transporta sementes entre diferentes ambientes e contribui para a regeneração florestal.", conservationStatus: "Vulnerável", reviewedAt: "2026-08-21", images: [commons("036 South American tapir in Encontro das Águas State Park Photo by Giles Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0"), commons("South American tapir (Tapirus terrestris).JPG", "Charles J. Sharp", "CC BY-SA 4.0"), commons("South American tapir (Tapirus terrestris) swimming Cristalino.jpg", "Charles J. Sharp", "CC BY-SA 4.0")], sources: [{ title: "IUCN Red List — Tapirus terrestris", url: "https://www.iucnredlist.org/search?query=Tapirus%20terrestris&searchType=species" }]
  },
  {
    id: "tamandua-bandeira", commonName: "Tamanduá-bandeira", scientificName: "Myrmecophaga tridactyla", group: "Mamíferos", environments: ["Campos", "Bordas de mata"],
    description: "Mamífero especializado em capturar formigas e cupins com a língua longa e pegajosa.", physicalCharacteristics: "Focinho tubular, cauda muito volumosa e faixa diagonal escura no corpo.", habitat: "Campos, savanas e bordas de matas com solo adequado para escavação.", behavior: "Caminha longas distâncias e pode ser ativo de dia ou à noite.", diet: "Formigas e cupins.", curiosities: ["Não possui dentes funcionais.", "A língua pode ser projetada repetidamente para retirar insetos dos ninhos."], distribution: "América Central e América do Sul, incluindo áreas abertas do Pantanal.", ecologicalImportance: "Controla populações de insetos sociais e revolve o solo ao abrir formigueiros e cupinzeiros.", conservationStatus: "Vulnerável", reviewedAt: "2026-08-21", images: [commons("037 Giant anteater in Encontro das Águas State Park Photo by Giles Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0"), commons("185 Giant anteater in Encontro das Águas State Park Photo by Giles Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0"), commons("Giant anteater at MAV-USP.jpg", "Museum of Veterinary Anatomy FMVZ USP / Wagner Souza e Silva", "CC BY-SA 4.0")], sources: [{ title: "IUCN Red List — Myrmecophaga tridactyla", url: "https://www.iucnredlist.org/search?query=Myrmecophaga%20tridactyla&searchType=species" }]
  },
  {
    id: "cervo-do-pantanal", commonName: "Cervo-do-pantanal", scientificName: "Blastocerus dichotomus", group: "Mamíferos", environments: ["Áreas alagadas", "Campos"],
    description: "Maior cervídeo da América do Sul, associado a várzeas, brejos e campos inundáveis.", physicalCharacteristics: "Pernas longas, pelagem castanho-avermelhada e galhadas ramificadas nos machos.", habitat: "Brejos, baías, campos inundáveis e margens de rios.", behavior: "Usa áreas alagadas como abrigo e desloca-se em busca de vegetação aquática.", diet: "Gramíneas, plantas aquáticas, folhas e brotos.", curiosities: ["As adaptações das pernas favorecem o deslocamento em terrenos úmidos.", "A espécie depende da manutenção de áreas úmidas conectadas."], distribution: "Centro e sul da América do Sul, com ocorrência no Pantanal.", ecologicalImportance: "Participa da dinâmica da vegetação de áreas úmidas e dispersa sementes.", conservationStatus: "Vulnerável", reviewedAt: "2026-08-21", images: [commons("001 Marsh deer and Pink Ipê tree in Encontro das Águas State Park Photo by Giles Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0"), commons("Blastocerus dichotomus in Jardim Zoológico de Curitiba.jpg", "Wilfredor", "CC0"), commons("044 Marsh deer in Encontro das Águas State Park Photo by Giles Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0")], sources: [{ title: "IUCN Red List — Blastocerus dichotomus", url: "https://www.iucnredlist.org/search?query=Blastocerus%20dichotomus&searchType=species" }]
  },
  {
    id: "ema", commonName: "Ema", scientificName: "Rhea americana", group: "Aves", environments: ["Campos", "Bordas de mata"],
    description: "Ave corredora de grande porte que ocupa campos e áreas abertas do Pantanal.", physicalCharacteristics: "Pescoço longo, asas reduzidas, pernas fortes e plumagem parda.", habitat: "Campos, cerrados e áreas abertas com vegetação baixa.", behavior: "Vive em grupos e corre rapidamente quando perturbada.", diet: "Frutos, sementes, folhas e pequenos animais.", curiosities: ["O macho participa da incubação e do cuidado dos filhotes.", "As asas ajudam no equilíbrio durante a corrida."], distribution: "América do Sul, com ocorrência em áreas abertas do Pantanal.", ecologicalImportance: "Dispersa sementes e integra as cadeias alimentares dos campos.", conservationStatus: "Pouco preocupante", reviewedAt: "2026-08-21", images: [commons("032 Greater rhea and Pink Ipê trees in Encontro das Águas State Park Photo by Giles Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0"), commons("Erfurt - Thüringer Zoopark - Rhea americana 01.jpg", "H. Zell", "CC BY-SA 3.0"), commons("Greater rhea (Rhea americana).JPG", "Charles J. Sharp", "CC BY-SA 4.0")], sources: [{ title: "IUCN Red List — Rhea americana", url: "https://www.iucnredlist.org/search?query=Rhea%20americana&searchType=species" }]
  },
  {
    id: "colhereiro", commonName: "Colhereiro", scientificName: "Platalea ajaja", group: "Aves", environments: ["Áreas alagadas", "Rios e corixos"],
    description: "Ave aquática de bico espatulado, observada em águas rasas e margens lamacentas.", physicalCharacteristics: "Plumagem rosada, pescoço claro e bico longo com ponta em forma de colher.", habitat: "Lagoas, baías, brejos e margens de rios.", behavior: "Move o bico de um lado para o outro na água para localizar alimento.", diet: "Peixes pequenos, crustáceos, insetos e outros invertebrados aquáticos.", curiosities: ["A coloração rosada está relacionada à alimentação.", "Costuma forragear em grupos em áreas rasas."], distribution: "Américas, principalmente zonas úmidas costeiras e continentais.", ecologicalImportance: "Conecta as cadeias alimentares de invertebrados e pequenos peixes em áreas úmidas.", conservationStatus: "Pouco preocupante", reviewedAt: "2026-08-21", images: [commons("042 Roseate spoonbill in Encontro das Águas State Park Photo by Giles Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0"), commons("Roseate spoonbill (Platalea ajaja) young adult Rio Napo.jpg", "Charles J. Sharp", "CC BY-SA 4.0"), commons("Prague 07-2016 Zoo img07 Platalea ajaja.jpg", "A.Savin", "FAL")], sources: [{ title: "IUCN Red List — Platalea ajaja", url: "https://www.iucnredlist.org/search?query=Platalea%20ajaja&searchType=species" }]
  },
  {
    id: "garca-branca", commonName: "Garça-branca", scientificName: "Ardea alba", group: "Aves", environments: ["Áreas alagadas", "Rios e corixos"],
    description: "Garça grande e clara, comum em margens, campos inundáveis e corpos d’água do Pantanal.", physicalCharacteristics: "Plumagem branca, pescoço comprido, bico amarelo e pernas escuras.", habitat: "Rios, baías, corixos, brejos e campos alagados.", behavior: "Caminha lentamente em águas rasas e captura presas com um golpe rápido do bico.", diet: "Peixes, anfíbios, répteis pequenos, crustáceos e insetos.", curiosities: ["Pode permanecer imóvel por longos períodos durante a caça.", "Reúne-se em colônias para reprodução."], distribution: "Ampla distribuição mundial, com presença em todo o Brasil.", ecologicalImportance: "Preda diversos organismos aquáticos e indica a disponibilidade de alimento nas margens.", conservationStatus: "Pouco preocupante", reviewedAt: "2026-08-21", images: [commons("012 Great egret fishing during a foggy day at Champ-Pittet Photo by Giles Laurent.jpg", "Giles Laurent", "CC BY-SA 4.0"), commons("Ardea alba4.jpg", "Calibas", "CC BY-SA 3.0"), commons("Ardea alba; 3 chicks, Morro Bay Heron Rookery 2 - by Mike Baird.jpg", "Mike Baird from Morro Bay, USA", "CC BY 2.0")], sources: [{ title: "IUCN Red List — Ardea alba", url: "https://www.iucnredlist.org/search?query=Ardea%20alba&searchType=species" }]
  },
  {
    id: "sucuri-verde", commonName: "Sucuri-verde", scientificName: "Eunectes murinus", group: "Répteis", environments: ["Rios e corixos", "Áreas alagadas"],
    description: "Grande serpente semiaquática que utiliza rios, baías e áreas alagadas para caçar.", physicalCharacteristics: "Corpo robusto, coloração verde-oliva com manchas escuras e olhos posicionados no alto da cabeça.", habitat: "Brejos, lagoas, baías, corixos e margens de rios.", behavior: "Permanece parcialmente submersa e captura presas por constrição.", diet: "Peixes, aves, mamíferos e outros vertebrados de tamanho compatível.", curiosities: ["As narinas e os olhos ajudam a observar o entorno com o corpo submerso.", "É uma das maiores serpentes do mundo em massa corporal."], distribution: "Regiões tropicais da América do Sul, incluindo o Pantanal.", ecologicalImportance: "Atua como predadora de topo em ambientes aquáticos e ribeirinhos.", conservationStatus: "Pouco preocupante", reviewedAt: "2026-08-21", images: [commons("Anaconda común (Eunectes murinus), Tierpark Hellabrunn, Múnich, Alemania, 2012-06-17, DD 01.JPG", "Diego Delso", "CC BY-SA 3.0"), commons("Eunectes murinus (1).jpg", "TimVickers", "Public domain"), commons("Eunectes murinus 114583278.jpg", "Ken Kneidel", "CC0")], sources: [{ title: "IUCN Red List — Eunectes murinus", url: "https://www.iucnredlist.org/search?query=Eunectes%20murinus&searchType=species" }]
  },
  {
    id: "jabuti-piranga", commonName: "Jabuti-piranga", scientificName: "Chelonoidis carbonaria", group: "Répteis", environments: ["Matas", "Bordas de mata"],
    description: "Jabuti terrestre de hábitos predominantemente diurnos, encontrado em áreas florestadas e seus arredores.", physicalCharacteristics: "Carapaça escura com manchas amarelas ou alaranjadas e escamas coloridas nas patas.", habitat: "Matas, capões, bordas de mata e áreas com serapilheira.", behavior: "Desloca-se pelo chão e procura alimento entre folhas e frutos caídos.", diet: "Frutos, folhas, flores, fungos e pequenos invertebrados.", curiosities: ["Pode contribuir para a dispersão de sementes de frutos que consome.", "A carapaça oferece proteção, mas não torna a espécie imune a queimadas e perda de habitat."], distribution: "Norte e centro da América do Sul, incluindo áreas do Brasil central.", ecologicalImportance: "Dispersa sementes e participa da ciclagem de matéria orgânica no solo.", conservationStatus: "Vulnerável", reviewedAt: "2026-08-21", images: [commons("Geochelone carbonaria 1.jpg", "E. Schüler", "CC BY-SA 3.0"), commons("Red-footed Tortoise (Chelonoidis carbonaria) (9194511084).jpg", "Bernard DUPONT from FRANCE", "CC BY-SA 2.0"), commons("Red-footed tortoise.jpg", "Tzim78", "CC BY 4.0")], sources: [{ title: "IUCN Red List — Chelonoidis carbonaria", url: "https://www.iucnredlist.org/search?query=Chelonoidis%20carbonaria&searchType=species" }]
  },
  {
    id: "sapo-cururu", commonName: "Sapo-cururu", scientificName: "Rhinella diptycha", group: "Anfíbios", environments: ["Campos", "Bordas de mata"],
    description: "Sapo de grande porte, adaptável a áreas abertas e frequentemente observado após chuvas.", physicalCharacteristics: "Pele rugosa, glândulas parotoides evidentes e coloração variável em tons terrosos.", habitat: "Campos, bordas de mata, áreas úmidas temporárias e ambientes modificados.", behavior: "É mais ativo à noite e reproduz-se em corpos d’água temporários ou permanentes.", diet: "Insetos e outros pequenos invertebrados.", curiosities: ["As glândulas cutâneas produzem substâncias defensivas.", "Girinos dependem de água para completar o desenvolvimento."], distribution: "Brasil central e outras áreas da América do Sul, incluindo o Pantanal.", ecologicalImportance: "Controla invertebrados e serve de alimento para predadores.", conservationStatus: "Pouco preocupante", reviewedAt: "2026-08-21", images: [commons("Rhinella diptycha (Cururú) en el Paisaje Protegido Valle del Lunarejo, Rivera, Uruguay.jpg", "Cellosuite", "CC BY-SA 4.0"), commons("Rhinella diptycha - Alessandher Piva - 489825971.jpeg", "Alessandher Piva", "CC BY 4.0"), commons("Rhinella diptycha 249854697.jpg", "Thomaz de Carvalho Callado", "CC BY 4.0")], sources: [{ title: "IUCN Red List — Rhinella diptycha", url: "https://www.iucnredlist.org/search?query=Rhinella%20diptycha&searchType=species" }]
  },
  {
    id: "ra-pimenta", commonName: "Rã-pimenta", scientificName: "Leptodactylus labyrinthicus", group: "Anfíbios", environments: ["Áreas alagadas", "Campos"],
    description: "Rã de grande porte associada a áreas úmidas, poças e margens com vegetação.", physicalCharacteristics: "Corpo robusto, dorso castanho com desenhos contrastantes e membros posteriores fortes.", habitat: "Brejos, lagoas temporárias, campos úmidos e margens de córregos.", behavior: "Pode construir ninhos de espuma e vocaliza principalmente no período reprodutivo.", diet: "Insetos, aranhas e outros pequenos animais.", curiosities: ["A espuma ajuda a proteger ovos em ambientes sujeitos à variação do nível da água.", "A espécie é conhecida por vocalizações fortes durante as chuvas."], distribution: "Brasil e países vizinhos, com ocorrência em áreas abertas e úmidas do centro-sul.", ecologicalImportance: "Participa do controle de invertebrados e é sensível à alteração de áreas reprodutivas.", conservationStatus: "Pouco preocupante", reviewedAt: "2026-08-21", images: [commons("Leptodactylus labyrinthicus.jpg", "Lucas Grandinetti", "CC BY-SA 2.5"), commons("Leptodactylus labyrinthicus01a.jpg", "Felipe Gomes", "CC BY-SA 2.5"), commons("Leptodactylus labyrinthicus04.jpg", "Ariovaldo Giaretta", "CC BY-SA 2.5")], sources: [{ title: "IUCN Red List — Leptodactylus labyrinthicus", url: "https://www.iucnredlist.org/search?query=Leptodactylus%20labyrinthicus&searchType=species" }]
  },
  {
    id: "pintado", commonName: "Pintado", scientificName: "Pseudoplatystoma corruscans", group: "Peixes", environments: ["Rios e corixos"],
    description: "Peixe de couro de grande porte, importante nos rios e na pesca tradicional do Pantanal.", physicalCharacteristics: "Corpo alongado, cabeça achatada, barbilhões e manchas escuras em faixas.", habitat: "Canais de rios, poços e trechos com correnteza.", behavior: "Predador ativo, especialmente ao localizar peixes em movimento.", diet: "Peixes e outros organismos aquáticos.", curiosities: ["Os barbilhões auxiliam na percepção do ambiente.", "A reprodução acompanha o pulso de cheias e a migração pelos rios."], distribution: "Bacias do Paraná-Paraguai e do São Francisco, incluindo o Pantanal.", ecologicalImportance: "É predador relevante e indicador da conectividade dos ambientes fluviais.", conservationStatus: "Dados insuficientes", reviewedAt: "2026-08-21", images: [commons("Pseudoplatystoma corruscans 484849557.jpg", "Rocío Esmeralda Pose", "CC BY 4.0"), commons("Pseudoplatystoma corruscans 484851514.jpg", "Rocío Esmeralda Pose", "CC BY 4.0"), commons("Surubí (Pseudoplatystoma corruscans), Itá Ibaté.jpg", "Martín Acosta Albarracín", "CC BY 4.0")], sources: [{ title: "FishBase — Pseudoplatystoma corruscans", url: "https://www.fishbase.se/summary/Pseudoplatystoma-corruscans.html" }]
  },
  {
    id: "pacu", commonName: "Pacu", scientificName: "Piaractus mesopotamicus", group: "Peixes", environments: ["Rios e corixos", "Áreas alagadas"],
    description: "Peixe onívoro de água doce que se desloca entre rios, baías e áreas alagadas durante o ciclo de cheias.", physicalCharacteristics: "Corpo alto e comprimido, dentes fortes e coloração prateada com tons avermelhados.", habitat: "Rios, baías, corixos e lagoas conectadas durante as cheias.", behavior: "Forma cardumes e aproveita frutos e sementes que caem na água.", diet: "Frutos, sementes, plantas aquáticas e pequenos animais.", curiosities: ["Pode transportar sementes ao longo da rede de drenagem.", "A sazonalidade das cheias influencia alimentação e migração."], distribution: "Bacia do Paraguai e outras bacias do centro-sul da América do Sul.", ecologicalImportance: "Conecta a vegetação terrestre às cadeias alimentares aquáticas e dispersa sementes.", conservationStatus: "Pouco preocupante", reviewedAt: "2026-08-21", images: [commons("Detalle de cabeza de pacú (Piaractus mesopotamicus), vitrina del Museo de La Plata.jpg", "Calimecita", "CC BY-SA 4.0"), commons("MergulhoemBonito2.jpg", "David Morimoto (treez44est)", "CC BY-SA 2.0"), commons("Piaractus mesopotamicus - Flickr - Dick Culbert.jpg", "Dick Culbert from Gibsons, B.C., Canada", "CC BY 2.0")], sources: [{ title: "FishBase — Piaractus mesopotamicus", url: "https://www.fishbase.se/summary/Piaractus-mesopotamicus.html" }]
  },
  {
    id: "piraputanga", commonName: "Piraputanga", scientificName: "Brycon hilarii", group: "Peixes", environments: ["Rios e corixos", "Matas"],
    description: "Peixe de água doce veloz, comum em rios de águas claras e associado a matas ciliares.", physicalCharacteristics: "Corpo prateado, dorso escuro, nadadeira caudal avermelhada e escamas bem marcadas.", habitat: "Rios, córregos e trechos com correnteza e vegetação nas margens.", behavior: "Nada em cardumes e explora frutos, sementes e pequenos organismos.", diet: "Frutos, sementes, insetos e pequenos invertebrados aquáticos.", curiosities: ["A mata ciliar fornece alimento que cai sobre a água.", "É uma espécie apreciada na pesca esportiva e na culinária regional."], distribution: "Bacias do Paraguai e do Paraná, incluindo rios do Pantanal.", ecologicalImportance: "Ajuda a transportar matéria orgânica entre a mata ciliar e o rio.", conservationStatus: "Pouco preocupante", reviewedAt: "2026-08-21", images: [commons("Bonito05.jpg", "Sérgio Veludo", "Public domain"), commons("Brycon hilarii.jpg", "David Morimoto (treez44est)", "CC BY-SA 2.0"), commons("Brycon hilarii - Piraputanga no Monumento Natural do Rio Formoso.jpg", "BRASIL AQUA", "CC BY-SA 4.0")], sources: [{ title: "FishBase — Brycon hilarii", url: "https://www.fishbase.se/summary/Brycon-hilarii.html" }]
  },
  {
    id: "caranguejo-agua-doce", commonName: "Caranguejo-de-água-doce", scientificName: "Dilocarcinus pagei", group: "Invertebrados", environments: ["Rios e corixos", "Áreas alagadas"],
    description: "Caranguejo de água doce encontrado em ambientes lênticos e margens de rios da bacia do Paraguai.", physicalCharacteristics: "Carapaça achatada, pinças desenvolvidas e coloração castanha a avermelhada.", habitat: "Lagoas, baías, corixos, margens e vegetação aquática.", behavior: "Utiliza o fundo e a vegetação para buscar alimento e abrigo.", diet: "Detritos, algas, matéria vegetal e pequenos organismos.", curiosities: ["A espécie participa da decomposição de matéria orgânica aquática.", "A disponibilidade de abrigo varia com a cheia e a seca."], distribution: "Bacias interiores da América do Sul, incluindo a bacia do Paraguai.", ecologicalImportance: "Recicla matéria orgânica e serve de alimento para peixes e aves aquáticas.", conservationStatus: "Dados insuficientes", reviewedAt: "2026-08-21", images: [commons("Dilocarcinus pagei, Bolivia.jpg", "Vincent A. Vos", "CC BY 4.0"), commons("Dilocarcinus pagei (10.1590-2358-2936e2020026) Figure 2.jpg", "PONTES, Nelcilene de Almeida; SANT’ANNA, Bruno Sampaio; HATTORI, Gustavo Yomar. Color variation of the freshwater crab Dilocarcinus pagei Stimpson, 1861 captured in the Amazon region at Itacoatiara, Amazonas, Brazil. Nauplius. 28: e2020026", "CC BY 4.0"), commons("Dilocarcinus pagei distribution.jpg", "Basenji1908", "CC BY-SA 4.0")], sources: [{ title: "WoRMS — Dilocarcinus pagei", url: "https://www.marinespecies.org/aphia.php?p=taxdetails&id=439231" }]
  },
  {
    id: "camarao-agua-doce", commonName: "Camarão-da-amazônia", scientificName: "Macrobrachium amazonicum", group: "Invertebrados", environments: ["Rios e corixos", "Áreas alagadas"],
    description: "Camarão de água doce associado a rios, lagoas e áreas alagáveis de diversas bacias brasileiras.", physicalCharacteristics: "Corpo segmentado, rostro alongado e primeiro par de quelas desenvolvido.", habitat: "Rios, lagoas, baías e áreas de vegetação aquática.", behavior: "Busca alimento no fundo e entre plantas, com atividade variável ao longo do dia.", diet: "Detritos, algas, pequenos invertebrados e matéria orgânica.", curiosities: ["O ciclo de vida pode usar águas doces e ambientes com maior salinidade em diferentes populações.", "É uma espécie relevante para cadeias alimentares e para comunidades ribeirinhas."], distribution: "Ampla distribuição na América do Sul, com registros em bacias brasileiras.", ecologicalImportance: "Transfere energia do detrito e da vegetação para peixes e aves aquáticas.", conservationStatus: "Pouco preocupante", reviewedAt: "2026-08-21", images: [commons("Macrobrachium amazonicum (10.1590-2358-2936e2018017) Figure 3.jpg", "Lianos, Laira et al. Checklist of the species of Macrobrachium Spence Bate, 1868 (Decapoda: Caridea: Palaemonidae) from the lower Parnaíba River basin, Piauí, Brazil. Nauplius [online]. 2018, v. 26 [Accessed 4 July 2021] , e2018017", "CC BY 4.0"), commons("Macrobrachium amazonicum (Heller, 1862).jpg", "Jonathan Vera Caripe", "CC BY 2.0"), commons("Palaemoninae (10.7717-peerj.1167) Figure 2.png", "De Grave S, Fransen CHJM, Page TJ. 2015. Let’s be pals again: major systematic changes in Palaemonidae (Crustacea: Decapoda) PeerJ 3:e1167 https://doi.org/10.7717/peerj.1167", "CC BY 4.0")], sources: [{ title: "FishBase — Macrobrachium amazonicum", url: "https://www.fishbase.se/summary/Macrobrachium-amazonicum.html" }]
  },
];

export function validateSpeciesCatalog(items: Species[] = species): string[] {
  const errors: string[] = [];
  const isHttpUrl = (value: string) => /^https?:\/\//.test(value);
  const ids = new Set<string>();
  items.forEach((item, index) => {
    const prefix = `species[${index}](${item.id || "sem-id"})`;
    if (!item.id || ids.has(item.id)) errors.push(`${prefix}.id deve ser único e não vazio`);
    ids.add(item.id);
    const itemEnvironments = Array.isArray(item.environments) ? item.environments : [];
    const itemCuriosities = Array.isArray(item.curiosities) ? item.curiosities : [];
    const itemImages = Array.isArray(item.images) ? item.images : [];
    const itemSources = Array.isArray(item.sources) ? item.sources : [];
    if (!item.commonName?.trim()) errors.push(`${prefix}.commonName ausente`);
    if (!item.scientificName?.trim()) errors.push(`${prefix}.scientificName ausente`);
    const reviewedAt = item.reviewedAt ?? "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewedAt) || Number.isNaN(Date.parse(`${reviewedAt}T12:00:00Z`))) errors.push(`${prefix}.reviewedAt inválido`);
    if (!groups.includes(item.group)) errors.push(`${prefix}.group inválido`);
    if (itemEnvironments.length === 0 || itemEnvironments.some((environment) => !environments.includes(environment))) errors.push(`${prefix}.environments inválido`);
    for (const field of ["description", "physicalCharacteristics", "habitat", "behavior", "diet", "distribution", "ecologicalImportance"] as const) {
      if (!item[field]?.trim()) errors.push(`${prefix}.${field} ausente`);
    }
    if (itemCuriosities.length === 0 || itemCuriosities.some((curiosity) => !curiosity?.trim())) errors.push(`${prefix}.curiosities inválido`);
    if (itemImages.length !== 3) errors.push(`${prefix}.images deve ter exatamente 3 imagens`);
    if (new Set(itemImages.map((image) => image?.uri)).size !== itemImages.length) errors.push(`${prefix}.images não pode repetir referências`);
    itemImages.forEach((image, imageIndex) => {
      if (!image?.uri || !image?.author || !image?.license || !image?.sourceUrl || !image?.credit) errors.push(`${prefix}.images[${imageIndex}] sem crédito/licença/fonte completos`);
      if (!isHttpUrl(image?.uri ?? "") || !isHttpUrl(image?.sourceUrl ?? "")) errors.push(`${prefix}.images[${imageIndex}] uri/sourceUrl inválida`);
    });
    if (itemSources.length === 0 || itemSources.some((source) => !source?.title?.trim() || !isHttpUrl(source?.url ?? ""))) errors.push(`${prefix}.sources inválido`);
    if (new Set(itemSources.map((source) => source?.url)).size !== itemSources.length) errors.push(`${prefix}.sources não pode repetir URLs`);
  });
  return errors;
}
