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
  {
    id: "anta", commonName: "Anta", scientificName: "Tapirus terrestris", group: "Mamíferos", environments: ["Matas", "Rios e corixos"],
    description: "Grande mamífero herbívoro que percorre matas, veredas e margens de rios no Pantanal.", physicalCharacteristics: "Corpo volumoso, focinho alongado e pelagem castanha curta.", habitat: "Matas ciliares, capões e áreas próximas à água.", behavior: "Solitária, geralmente mais ativa no crepúsculo e à noite.", diet: "Folhas, frutos, brotos e outras partes de plantas.", curiosities: ["É uma importante dispersora de sementes.", "Nada bem e usa a água para fugir de ameaças."], distribution: "América do Sul a leste dos Andes, incluindo o Pantanal.", ecologicalImportance: "Transporta sementes entre diferentes ambientes e contribui para a regeneração florestal.", conservationStatus: "Vulnerável", images: [commons("Lowland tapir (Tapirus terrestris).jpg", "Wikimedia Commons"), commons("Tapirus terrestris 01.jpg", "Wikimedia Commons"), commons("Tapirus terrestris swimming.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Tapirus terrestris", url: "https://www.iucnredlist.org/search?query=Tapirus%20terrestris&searchType=species" }]
  },
  {
    id: "tamandua-bandeira", commonName: "Tamanduá-bandeira", scientificName: "Myrmecophaga tridactyla", group: "Mamíferos", environments: ["Campos", "Bordas de mata"],
    description: "Mamífero especializado em capturar formigas e cupins com a língua longa e pegajosa.", physicalCharacteristics: "Focinho tubular, cauda muito volumosa e faixa diagonal escura no corpo.", habitat: "Campos, savanas e bordas de matas com solo adequado para escavação.", behavior: "Caminha longas distâncias e pode ser ativo de dia ou à noite.", diet: "Formigas e cupins.", curiosities: ["Não possui dentes funcionais.", "A língua pode ser projetada repetidamente para retirar insetos dos ninhos."], distribution: "América Central e América do Sul, incluindo áreas abertas do Pantanal.", ecologicalImportance: "Controla populações de insetos sociais e revolve o solo ao abrir formigueiros e cupinzeiros.", conservationStatus: "Vulnerável", images: [commons("Myrmecophaga tridactyla.jpg", "Wikimedia Commons"), commons("Giant anteater walking.jpg", "Wikimedia Commons"), commons("Myrmecophaga tridactyla Pantanal.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Myrmecophaga tridactyla", url: "https://www.iucnredlist.org/search?query=Myrmecophaga%20tridactyla&searchType=species" }]
  },
  {
    id: "cervo-do-pantanal", commonName: "Cervo-do-pantanal", scientificName: "Blastocerus dichotomus", group: "Mamíferos", environments: ["Áreas alagadas", "Campos"],
    description: "Maior cervídeo da América do Sul, associado a várzeas, brejos e campos inundáveis.", physicalCharacteristics: "Pernas longas, pelagem castanho-avermelhada e galhadas ramificadas nos machos.", habitat: "Brejos, baías, campos inundáveis e margens de rios.", behavior: "Usa áreas alagadas como abrigo e desloca-se em busca de vegetação aquática.", diet: "Gramíneas, plantas aquáticas, folhas e brotos.", curiosities: ["As adaptações das pernas favorecem o deslocamento em terrenos úmidos.", "A espécie depende da manutenção de áreas úmidas conectadas."], distribution: "Centro e sul da América do Sul, com ocorrência no Pantanal.", ecologicalImportance: "Participa da dinâmica da vegetação de áreas úmidas e dispersa sementes.", conservationStatus: "Vulnerável", images: [commons("Blastocerus dichotomus.jpg", "Wikimedia Commons"), commons("Marsh deer Pantanal.jpg", "Wikimedia Commons"), commons("Blastocerus dichotomus male.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Blastocerus dichotomus", url: "https://www.iucnredlist.org/search?query=Blastocerus%20dichotomus&searchType=species" }]
  },
  {
    id: "ema", commonName: "Ema", scientificName: "Rhea americana", group: "Aves", environments: ["Campos", "Bordas de mata"],
    description: "Ave corredora de grande porte que ocupa campos e áreas abertas do Pantanal.", physicalCharacteristics: "Pescoço longo, asas reduzidas, pernas fortes e plumagem parda.", habitat: "Campos, cerrados e áreas abertas com vegetação baixa.", behavior: "Vive em grupos e corre rapidamente quando perturbada.", diet: "Frutos, sementes, folhas e pequenos animais.", curiosities: ["O macho participa da incubação e do cuidado dos filhotes.", "As asas ajudam no equilíbrio durante a corrida."], distribution: "América do Sul, com ocorrência em áreas abertas do Pantanal.", ecologicalImportance: "Dispersa sementes e integra as cadeias alimentares dos campos.", conservationStatus: "Pouco preocupante", images: [commons("Rhea americana.jpg", "Wikimedia Commons"), commons("Greater rhea running.jpg", "Wikimedia Commons"), commons("Rhea americana Pantanal.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Rhea americana", url: "https://www.iucnredlist.org/search?query=Rhea%20americana&searchType=species" }]
  },
  {
    id: "colhereiro", commonName: "Colhereiro", scientificName: "Platalea ajaja", group: "Aves", environments: ["Áreas alagadas", "Rios e corixos"],
    description: "Ave aquática de bico espatulado, observada em águas rasas e margens lamacentas.", physicalCharacteristics: "Plumagem rosada, pescoço claro e bico longo com ponta em forma de colher.", habitat: "Lagoas, baías, brejos e margens de rios.", behavior: "Move o bico de um lado para o outro na água para localizar alimento.", diet: "Peixes pequenos, crustáceos, insetos e outros invertebrados aquáticos.", curiosities: ["A coloração rosada está relacionada à alimentação.", "Costuma forragear em grupos em áreas rasas."], distribution: "Américas, principalmente zonas úmidas costeiras e continentais.", ecologicalImportance: "Conecta as cadeias alimentares de invertebrados e pequenos peixes em áreas úmidas.", conservationStatus: "Pouco preocupante", images: [commons("Platalea ajaja -Brazil-8.jpg", "Wikimedia Commons"), commons("Roseate spoonbill feeding.jpg", "Wikimedia Commons"), commons("Platalea ajaja flight.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Platalea ajaja", url: "https://www.iucnredlist.org/search?query=Platalea%20ajaja&searchType=species" }]
  },
  {
    id: "garca-branca", commonName: "Garça-branca", scientificName: "Ardea alba", group: "Aves", environments: ["Áreas alagadas", "Rios e corixos"],
    description: "Garça grande e clara, comum em margens, campos inundáveis e corpos d’água do Pantanal.", physicalCharacteristics: "Plumagem branca, pescoço comprido, bico amarelo e pernas escuras.", habitat: "Rios, baías, corixos, brejos e campos alagados.", behavior: "Caminha lentamente em águas rasas e captura presas com um golpe rápido do bico.", diet: "Peixes, anfíbios, répteis pequenos, crustáceos e insetos.", curiosities: ["Pode permanecer imóvel por longos períodos durante a caça.", "Reúne-se em colônias para reprodução."], distribution: "Ampla distribuição mundial, com presença em todo o Brasil.", ecologicalImportance: "Preda diversos organismos aquáticos e indica a disponibilidade de alimento nas margens.", conservationStatus: "Pouco preocupante", images: [commons("Ardea alba -Brazil-8.jpg", "Wikimedia Commons"), commons("Great egret fishing.jpg", "Wikimedia Commons"), commons("Ardea alba in flight.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Ardea alba", url: "https://www.iucnredlist.org/search?query=Ardea%20alba&searchType=species" }]
  },
  {
    id: "sucuri-verde", commonName: "Sucuri-verde", scientificName: "Eunectes murinus", group: "Répteis", environments: ["Rios e corixos", "Áreas alagadas"],
    description: "Grande serpente semiaquática que utiliza rios, baías e áreas alagadas para caçar.", physicalCharacteristics: "Corpo robusto, coloração verde-oliva com manchas escuras e olhos posicionados no alto da cabeça.", habitat: "Brejos, lagoas, baías, corixos e margens de rios.", behavior: "Permanece parcialmente submersa e captura presas por constrição.", diet: "Peixes, aves, mamíferos e outros vertebrados de tamanho compatível.", curiosities: ["As narinas e os olhos ajudam a observar o entorno com o corpo submerso.", "É uma das maiores serpentes do mundo em massa corporal."], distribution: "Regiões tropicais da América do Sul, incluindo o Pantanal.", ecologicalImportance: "Atua como predadora de topo em ambientes aquáticos e ribeirinhos.", conservationStatus: "Pouco preocupante", images: [commons("Eunectes murinus.jpg", "Wikimedia Commons"), commons("Green anaconda swimming.jpg", "Wikimedia Commons"), commons("Eunectes murinus closeup.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Eunectes murinus", url: "https://www.iucnredlist.org/search?query=Eunectes%20murinus&searchType=species" }]
  },
  {
    id: "jabuti-piranga", commonName: "Jabuti-piranga", scientificName: "Chelonoidis carbonaria", group: "Répteis", environments: ["Matas", "Bordas de mata"],
    description: "Jabuti terrestre de hábitos predominantemente diurnos, encontrado em áreas florestadas e seus arredores.", physicalCharacteristics: "Carapaça escura com manchas amarelas ou alaranjadas e escamas coloridas nas patas.", habitat: "Matas, capões, bordas de mata e áreas com serapilheira.", behavior: "Desloca-se pelo chão e procura alimento entre folhas e frutos caídos.", diet: "Frutos, folhas, flores, fungos e pequenos invertebrados.", curiosities: ["Pode contribuir para a dispersão de sementes de frutos que consome.", "A carapaça oferece proteção, mas não torna a espécie imune a queimadas e perda de habitat."], distribution: "Norte e centro da América do Sul, incluindo áreas do Brasil central.", ecologicalImportance: "Dispersa sementes e participa da ciclagem de matéria orgânica no solo.", conservationStatus: "Vulnerável", images: [commons("Chelonoidis carbonaria.jpg", "Wikimedia Commons"), commons("Red-footed tortoise walking.jpg", "Wikimedia Commons"), commons("Chelonoidis carbonaria head.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Chelonoidis carbonaria", url: "https://www.iucnredlist.org/search?query=Chelonoidis%20carbonaria&searchType=species" }]
  },
  {
    id: "sapo-cururu", commonName: "Sapo-cururu", scientificName: "Rhinella diptycha", group: "Anfíbios", environments: ["Campos", "Bordas de mata"],
    description: "Sapo de grande porte, adaptável a áreas abertas e frequentemente observado após chuvas.", physicalCharacteristics: "Pele rugosa, glândulas parotoides evidentes e coloração variável em tons terrosos.", habitat: "Campos, bordas de mata, áreas úmidas temporárias e ambientes modificados.", behavior: "É mais ativo à noite e reproduz-se em corpos d’água temporários ou permanentes.", diet: "Insetos e outros pequenos invertebrados.", curiosities: ["As glândulas cutâneas produzem substâncias defensivas.", "Girinos dependem de água para completar o desenvolvimento."], distribution: "Brasil central e outras áreas da América do Sul, incluindo o Pantanal.", ecologicalImportance: "Controla invertebrados e serve de alimento para predadores.", conservationStatus: "Pouco preocupante", images: [commons("Rhinella diptycha.jpg", "Wikimedia Commons"), commons("Rhinella toad closeup.jpg", "Wikimedia Commons"), commons("Rhinella diptycha in water.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Rhinella diptycha", url: "https://www.iucnredlist.org/search?query=Rhinella%20diptycha&searchType=species" }]
  },
  {
    id: "ra-pimenta", commonName: "Rã-pimenta", scientificName: "Leptodactylus labyrinthicus", group: "Anfíbios", environments: ["Áreas alagadas", "Campos"],
    description: "Rã de grande porte associada a áreas úmidas, poças e margens com vegetação.", physicalCharacteristics: "Corpo robusto, dorso castanho com desenhos contrastantes e membros posteriores fortes.", habitat: "Brejos, lagoas temporárias, campos úmidos e margens de córregos.", behavior: "Pode construir ninhos de espuma e vocaliza principalmente no período reprodutivo.", diet: "Insetos, aranhas e outros pequenos animais.", curiosities: ["A espuma ajuda a proteger ovos em ambientes sujeitos à variação do nível da água.", "A espécie é conhecida por vocalizações fortes durante as chuvas."], distribution: "Brasil e países vizinhos, com ocorrência em áreas abertas e úmidas do centro-sul.", ecologicalImportance: "Participa do controle de invertebrados e é sensível à alteração de áreas reprodutivas.", conservationStatus: "Pouco preocupante", images: [commons("Leptodactylus labyrinthicus.jpg", "Wikimedia Commons"), commons("Leptodactylus labyrinthicus frog.jpg", "Wikimedia Commons"), commons("Leptodactylus labyrinthicus profile.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Leptodactylus labyrinthicus", url: "https://www.iucnredlist.org/search?query=Leptodactylus%20labyrinthicus&searchType=species" }]
  },
  {
    id: "pintado", commonName: "Pintado", scientificName: "Pseudoplatystoma corruscans", group: "Peixes", environments: ["Rios e corixos"],
    description: "Peixe de couro de grande porte, importante nos rios e na pesca tradicional do Pantanal.", physicalCharacteristics: "Corpo alongado, cabeça achatada, barbilhões e manchas escuras em faixas.", habitat: "Canais de rios, poços e trechos com correnteza.", behavior: "Predador ativo, especialmente ao localizar peixes em movimento.", diet: "Peixes e outros organismos aquáticos.", curiosities: ["Os barbilhões auxiliam na percepção do ambiente.", "A reprodução acompanha o pulso de cheias e a migração pelos rios."], distribution: "Bacias do Paraná-Paraguai e do São Francisco, incluindo o Pantanal.", ecologicalImportance: "É predador relevante e indicador da conectividade dos ambientes fluviais.", conservationStatus: "Dados insuficientes", images: [commons("Pseudoplatystoma corruscans.jpg", "Wikimedia Commons"), commons("Pintado fish Pantanal.jpg", "Wikimedia Commons"), commons("Pseudoplatystoma corruscans head.jpg", "Wikimedia Commons")], sources: [{ title: "FishBase — Pseudoplatystoma corruscans", url: "https://www.fishbase.se/summary/Pseudoplatystoma-corruscans.html" }]
  },
  {
    id: "pacu", commonName: "Pacu", scientificName: "Piaractus mesopotamicus", group: "Peixes", environments: ["Rios e corixos", "Áreas alagadas"],
    description: "Peixe onívoro de água doce que se desloca entre rios, baías e áreas alagadas durante o ciclo de cheias.", physicalCharacteristics: "Corpo alto e comprimido, dentes fortes e coloração prateada com tons avermelhados.", habitat: "Rios, baías, corixos e lagoas conectadas durante as cheias.", behavior: "Forma cardumes e aproveita frutos e sementes que caem na água.", diet: "Frutos, sementes, plantas aquáticas e pequenos animais.", curiosities: ["Pode transportar sementes ao longo da rede de drenagem.", "A sazonalidade das cheias influencia alimentação e migração."], distribution: "Bacia do Paraguai e outras bacias do centro-sul da América do Sul.", ecologicalImportance: "Conecta a vegetação terrestre às cadeias alimentares aquáticas e dispersa sementes.", conservationStatus: "Pouco preocupante", images: [commons("Piaractus mesopotamicus.jpg", "Wikimedia Commons"), commons("Pacu fish underwater.jpg", "Wikimedia Commons"), commons("Piaractus mesopotamicus side.jpg", "Wikimedia Commons")], sources: [{ title: "FishBase — Piaractus mesopotamicus", url: "https://www.fishbase.se/summary/Piaractus-mesopotamicus.html" }]
  },
  {
    id: "piraputanga", commonName: "Piraputanga", scientificName: "Brycon hilarii", group: "Peixes", environments: ["Rios e corixos", "Matas"],
    description: "Peixe de água doce veloz, comum em rios de águas claras e associado a matas ciliares.", physicalCharacteristics: "Corpo prateado, dorso escuro, nadadeira caudal avermelhada e escamas bem marcadas.", habitat: "Rios, córregos e trechos com correnteza e vegetação nas margens.", behavior: "Nada em cardumes e explora frutos, sementes e pequenos organismos.", diet: "Frutos, sementes, insetos e pequenos invertebrados aquáticos.", curiosities: ["A mata ciliar fornece alimento que cai sobre a água.", "É uma espécie apreciada na pesca esportiva e na culinária regional."], distribution: "Bacias do Paraguai e do Paraná, incluindo rios do Pantanal.", ecologicalImportance: "Ajuda a transportar matéria orgânica entre a mata ciliar e o rio.", conservationStatus: "Pouco preocupante", images: [commons("Brycon hilarii.jpg", "Wikimedia Commons"), commons("Piraputanga fish.jpg", "Wikimedia Commons"), commons("Brycon hilarii river.jpg", "Wikimedia Commons")], sources: [{ title: "FishBase — Brycon hilarii", url: "https://www.fishbase.se/summary/Brycon-hilarii.html" }]
  },
  {
    id: "caranguejo-agua-doce", commonName: "Caranguejo-de-água-doce", scientificName: "Dilocarcinus pagei", group: "Invertebrados", environments: ["Rios e corixos", "Áreas alagadas"],
    description: "Caranguejo de água doce encontrado em ambientes lênticos e margens de rios da bacia do Paraguai.", physicalCharacteristics: "Carapaça achatada, pinças desenvolvidas e coloração castanha a avermelhada.", habitat: "Lagoas, baías, corixos, margens e vegetação aquática.", behavior: "Utiliza o fundo e a vegetação para buscar alimento e abrigo.", diet: "Detritos, algas, matéria vegetal e pequenos organismos.", curiosities: ["A espécie participa da decomposição de matéria orgânica aquática.", "A disponibilidade de abrigo varia com a cheia e a seca."], distribution: "Bacias interiores da América do Sul, incluindo a bacia do Paraguai.", ecologicalImportance: "Recicla matéria orgânica e serve de alimento para peixes e aves aquáticas.", conservationStatus: "Dados insuficientes", images: [commons("Dilocarcinus pagei.jpg", "Wikimedia Commons"), commons("Freshwater crab Pantanal.jpg", "Wikimedia Commons"), commons("Dilocarcinus pagei carapace.jpg", "Wikimedia Commons")], sources: [{ title: "WoRMS — Dilocarcinus pagei", url: "https://www.marinespecies.org/aphia.php?p=taxdetails&id=439231" }]
  },
  {
    id: "camarao-agua-doce", commonName: "Camarão-da-amazônia", scientificName: "Macrobrachium amazonicum", group: "Invertebrados", environments: ["Rios e corixos", "Áreas alagadas"],
    description: "Camarão de água doce associado a rios, lagoas e áreas alagáveis de diversas bacias brasileiras.", physicalCharacteristics: "Corpo segmentado, rostro alongado e primeiro par de quelas desenvolvido.", habitat: "Rios, lagoas, baías e áreas de vegetação aquática.", behavior: "Busca alimento no fundo e entre plantas, com atividade variável ao longo do dia.", diet: "Detritos, algas, pequenos invertebrados e matéria orgânica.", curiosities: ["O ciclo de vida pode usar águas doces e ambientes com maior salinidade em diferentes populações.", "É uma espécie relevante para cadeias alimentares e para comunidades ribeirinhas."], distribution: "Ampla distribuição na América do Sul, com registros em bacias brasileiras.", ecologicalImportance: "Transfere energia do detrito e da vegetação para peixes e aves aquáticas.", conservationStatus: "Pouco preocupante", images: [commons("Macrobrachium amazonicum.jpg", "Wikimedia Commons"), commons("Amazon river prawn.jpg", "Wikimedia Commons"), commons("Macrobrachium amazonicum closeup.jpg", "Wikimedia Commons")], sources: [{ title: "FishBase — Macrobrachium amazonicum", url: "https://www.fishbase.se/summary/Macrobrachium-amazonicum.html" }]
  },
  {
    id: "bugio-preto", commonName: "Bugio-preto", scientificName: "Alouatta caraya", group: "Mamíferos", environments: ["Matas", "Bordas de mata"],
    description: "Primata de vocalização potente, associado a matas ciliares e capões do Pantanal.", physicalCharacteristics: "Pelagem escura nos machos, rosto marcado e cauda preênsil.", habitat: "Matas ciliares, capões e bordas de floresta.", behavior: "Vive em grupos e emite vocalizações territoriais ao amanhecer.", diet: "Folhas, frutos, flores e brotos.", curiosities: ["As vocalizações podem ser ouvidas a grandes distâncias.", "A cauda auxilia na locomoção entre galhos."], distribution: "Centro e leste da América do Sul, incluindo o Pantanal.", ecologicalImportance: "Dispersa sementes e influencia a regeneração das matas.", conservationStatus: "Pouco preocupante", images: [commons("Alouatta caraya.jpg", "Wikimedia Commons"), commons("Alouatta caraya male.jpg", "Wikimedia Commons"), commons("Black howler monkey.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Alouatta caraya", url: "https://www.iucnredlist.org/search?query=Alouatta%20caraya&searchType=species" }]
  },
  {
    id: "ariranha", commonName: "Ariranha", scientificName: "Pteronura brasiliensis", group: "Mamíferos", environments: ["Rios e corixos", "Áreas alagadas"],
    description: "Mamífero social e semiaquático que caça em rios, baías e corixos do Pantanal.", physicalCharacteristics: "Corpo alongado, patas palmadas, cauda forte e manchas claras no pescoço.", habitat: "Rios, lagoas, baías e margens com abrigo vegetal.", behavior: "Vive em grupos familiares, vocaliza e caça principalmente peixes.", diet: "Peixes, crustáceos e pequenos vertebrados aquáticos.", curiosities: ["Cada indivíduo pode apresentar marcas claras distintas no pescoço.", "A espécie depende de águas relativamente preservadas e conectadas."], distribution: "Bacias hidrográficas da América do Sul, com população importante no Pantanal.", ecologicalImportance: "É predadora de topo dos ambientes aquáticos e indica a qualidade dos rios.", conservationStatus: "Em perigo", images: [commons("Pteronura brasiliensis.jpg", "Wikimedia Commons"), commons("Giant otter Pantanal.jpg", "Wikimedia Commons"), commons("Giant otter swimming.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Pteronura brasiliensis", url: "https://www.iucnredlist.org/search?query=Pteronura%20brasiliensis&searchType=species" }]
  },
  {
    id: "lontra-neotropical", commonName: "Lontra-neotropical", scientificName: "Lontra longicaudis", group: "Mamíferos", environments: ["Rios e corixos", "Matas"],
    description: "Lontra de hábitos discretos que utiliza rios, córregos e lagoas com margens vegetadas.", physicalCharacteristics: "Corpo fusiforme, patas parcialmente palmadas e pelagem marrom densa.", habitat: "Cursos d’água, lagoas e matas ciliares.", behavior: "Solta ou em pequenos grupos, nada com agilidade e repousa em tocas e barrancos.", diet: "Peixes, crustáceos, anfíbios e pequenos vertebrados.", curiosities: ["Pode deixar marcas e fezes em pontos de passagem nas margens.", "A vegetação ciliar oferece abrigo e locais de descanso."], distribution: "América Central e América do Sul, incluindo o Pantanal.", ecologicalImportance: "Participa do controle de organismos aquáticos e conecta ambientes terrestres e aquáticos.", conservationStatus: "Quase ameaçada", images: [commons("Lontra longicaudis.jpg", "Wikimedia Commons"), commons("Neotropical otter river.jpg", "Wikimedia Commons"), commons("Lontra longicaudis swimming.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Lontra longicaudis", url: "https://www.iucnredlist.org/search?query=Lontra%20longicaudis&searchType=species" }]
  },
  {
    id: "queixada", commonName: "Queixada", scientificName: "Tayassu pecari", group: "Mamíferos", environments: ["Matas", "Campos"],
    description: "Porco-do-mato social que percorre grandes áreas em busca de frutos, raízes e invertebrados.", physicalCharacteristics: "Pelagem escura, faixa clara no queixo e corpo compacto.", habitat: "Matas, cerrados, capões e bordas de mata.", behavior: "Forma bandos numerosos, desloca-se por longas distâncias e usa vocalizações de contato.", diet: "Frutos, sementes, raízes, folhas e pequenos animais.", curiosities: ["Bandos grandes podem modificar o solo ao forragear.", "A espécie é sensível à fragmentação e à caça."], distribution: "América Central e América do Sul, com ocorrência no Pantanal.", ecologicalImportance: "Dispersa sementes e movimenta a camada superficial do solo.", conservationStatus: "Vulnerável", images: [commons("Tayassu pecari.jpg", "Wikimedia Commons"), commons("White-lipped peccary group.jpg", "Wikimedia Commons"), commons("Tayassu pecari Pantanal.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Tayassu pecari", url: "https://www.iucnredlist.org/search?query=Tayassu%20pecari&searchType=species" }]
  },
  {
    id: "mutum-de-penacho", commonName: "Mutum-de-penacho", scientificName: "Crax fasciolata", group: "Aves", environments: ["Matas", "Bordas de mata"],
    description: "Ave terrestre de grande porte encontrada em matas e bordas com oferta de frutos.", physicalCharacteristics: "Crista encaracolada, corpo robusto e dimorfismo entre machos e fêmeas.", habitat: "Matas ciliares, capões e bordas de floresta.", behavior: "Forrageia no chão e pode empoleirar-se em árvores ao anoitecer.", diet: "Frutos, sementes, folhas e pequenos invertebrados.", curiosities: ["Machos e fêmeas possuem padrões de plumagem diferentes.", "A espécie pode ser ouvida antes de ser avistada."], distribution: "Brasil central e meridional, Bolívia e Paraguai.", ecologicalImportance: "Dispersa sementes de plantas das matas pantaneiras.", conservationStatus: "Vulnerável", images: [commons("Crax fasciolata.jpg", "Wikimedia Commons"), commons("Bare-faced curassow.jpg", "Wikimedia Commons"), commons("Crax fasciolata male.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Crax fasciolata", url: "https://www.iucnredlist.org/search?query=Crax%20fasciolata&searchType=species" }]
  },
  {
    id: "carau", commonName: "Carão", scientificName: "Aramus guarauna", group: "Aves", environments: ["Áreas alagadas", "Rios e corixos"],
    description: "Ave de áreas úmidas, conhecida pelo chamado forte e pela busca de caramujos entre a vegetação.", physicalCharacteristics: "Plumagem parda estriada, pernas longas e bico curvo.", habitat: "Brejos, campos alagados, baías e margens com macrófitas.", behavior: "Caminha lentamente em águas rasas e vocaliza ao amanhecer e ao entardecer.", diet: "Principalmente caramujos e outros invertebrados aquáticos.", curiosities: ["O bico curvo ajuda a retirar moluscos das conchas.", "É frequentemente detectado pelo canto antes do avistamento."], distribution: "América Central e América do Sul, incluindo todo o Pantanal.", ecologicalImportance: "Regula populações de moluscos em áreas alagadas.", conservationStatus: "Pouco preocupante", images: [commons("Aramus guarauna.jpg", "Wikimedia Commons"), commons("Limpkin wetland.jpg", "Wikimedia Commons"), commons("Aramus guarauna Pantanal.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Aramus guarauna", url: "https://www.iucnredlist.org/search?query=Aramus%20guarauna&searchType=species" }]
  },
  {
    id: "seriema", commonName: "Seriema", scientificName: "Cariama cristata", group: "Aves", environments: ["Campos", "Bordas de mata"],
    description: "Ave corredora de campos e cerrados, reconhecida pela crista e pelo canto distante.", physicalCharacteristics: "Pernas longas, bico forte, crista frontal e plumagem acinzentada.", habitat: "Campos secos, cerrados e bordas de mata.", behavior: "Caminha pelo solo, corre diante de ameaças e caça presas pequenas.", diet: "Insetos, pequenos vertebrados, frutos e sementes.", curiosities: ["Seu chamado pode atravessar grandes áreas abertas.", "Pode usar o bico e as pernas para dominar pequenas presas."], distribution: "Centro e leste da América do Sul, incluindo o Pantanal.", ecologicalImportance: "Controla invertebrados e pequenos vertebrados dos campos.", conservationStatus: "Pouco preocupante", images: [commons("Cariama cristata.jpg", "Wikimedia Commons"), commons("Red-legged seriema.jpg", "Wikimedia Commons"), commons("Cariama cristata grassland.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Cariama cristata", url: "https://www.iucnredlist.org/search?query=Cariama%20cristata&searchType=species" }]
  },
  {
    id: "teiú", commonName: "Teiú", scientificName: "Salvator merianae", group: "Répteis", environments: ["Campos", "Bordas de mata"],
    description: "Lagarto de grande porte que ocupa campos, bordas e áreas próximas a habitações rurais.", physicalCharacteristics: "Corpo robusto, cauda longa, coloração escura com manchas claras e língua bifurcada.", habitat: "Campos, bordas de mata, solos arenosos e áreas antropizadas.", behavior: "Ativo durante o dia, explora o solo e abriga-se em tocas.", diet: "Frutos, ovos, insetos, pequenos vertebrados e carniça.", curiosities: ["É um onívoro oportunista.", "A língua auxilia na coleta de informações químicas do ambiente."], distribution: "Leste e centro da América do Sul, incluindo o Pantanal.", ecologicalImportance: "Contribui para a dispersão de sementes e o controle de pequenos animais.", conservationStatus: "Pouco preocupante", images: [commons("Salvator merianae.jpg", "Wikimedia Commons"), commons("Argentine black and white tegu.jpg", "Wikimedia Commons"), commons("Tegu lizard Pantanal.jpg", "Wikimedia Commons")], sources: [{ title: "IUCN Red List — Salvator merianae", url: "https://www.iucnredlist.org/search?query=Salvator%20merianae&searchType=species" }]
  },
  {
    id: "dourado", commonName: "Dourado", scientificName: "Salminus brasiliensis", group: "Peixes", environments: ["Rios e corixos"],
    description: "Peixe predador de rios, valorizado como indicador da conectividade e da qualidade dos ambientes aquáticos.", physicalCharacteristics: "Corpo alongado, coloração dourada e cabeça robusta.", habitat: "Rios com correnteza, corredeiras e trechos conectados às planícies de inundação.", behavior: "Predador ativo, desloca-se em busca de peixes e responde à dinâmica sazonal dos rios.", diet: "Peixes e outros organismos aquáticos.", curiosities: ["A migração depende da conectividade dos rios.", "É uma espécie importante para cadeias alimentares e pesca sustentável."], distribution: "Bacias do Paraná, Paraguai e Uruguai.", ecologicalImportance: "Regula populações de peixes e sinaliza a integridade dos corredores aquáticos.", conservationStatus: "Dados insuficientes", images: [commons("Salminus brasiliensis.jpg", "Wikimedia Commons"), commons("Dourado fish river.jpg", "Wikimedia Commons"), commons("Salminus brasiliensis closeup.jpg", "Wikimedia Commons")], sources: [{ title: "FishBase — Salminus brasiliensis", url: "https://www.fishbase.se/summary/Salminus-brasiliensis.html" }]
  },
];

const isHttpUrl = (value: string) => /^https?:\/\/\S+$/i.test(value);

export function validateSpeciesCatalog(items: Species[] = species): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  items.forEach((item, index) => {
    const prefix = `species[${index}](${item.id || "sem-id"})`;
    if (!item.id || ids.has(item.id)) errors.push(`${prefix}.id deve ser único e não vazio`);
    ids.add(item.id);
    if (!item.commonName.trim()) errors.push(`${prefix}.commonName ausente`);
    if (!item.scientificName.trim()) errors.push(`${prefix}.scientificName ausente`);
    if (!groups.includes(item.group)) errors.push(`${prefix}.group inválido`);
    if (item.environments.length === 0 || item.environments.some((environment) => !environments.includes(environment))) errors.push(`${prefix}.environments inválido`);
    for (const field of ["description", "physicalCharacteristics", "habitat", "behavior", "diet", "distribution", "ecologicalImportance"] as const) {
      if (!item[field]?.trim()) errors.push(`${prefix}.${field} ausente`);
    }
    if (item.curiosities.length === 0 || item.curiosities.some((curiosity) => !curiosity.trim())) errors.push(`${prefix}.curiosities inválido`);
    if (item.images.length < 3) errors.push(`${prefix}.images deve ter pelo menos 3 imagens`);
    item.images.forEach((image, imageIndex) => {
      if (!image.uri || !isHttpUrl(image.uri) || !image.author || !image.license || !isHttpUrl(image.sourceUrl) || !image.credit) errors.push(`${prefix}.images[${imageIndex}] sem crédito/licença/fonte completos`);
    });
    if (item.sources.length === 0 || item.sources.some((source) => !source.title.trim() || !isHttpUrl(source.url))) errors.push(`${prefix}.sources inválido`);
  });
  return errors;
}


const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function isValidSightingDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function isValidSightingTime(value: string): boolean {
  return value === "" || TIME_PATTERN.test(value);
}

export function isValidCoordinatePair(latitude: unknown, longitude: unknown): boolean {
  if (latitude === undefined && longitude === undefined) return true;
  return typeof latitude === "number" && Number.isFinite(latitude) && latitude >= -90 && latitude <= 90 &&
    typeof longitude === "number" && Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
}

export function sanitizeStoredSightings(value: unknown): Sighting[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is Sighting => {
    if (!item || typeof item !== "object") return false;
    const sighting = item as Partial<Sighting>;
    const quantityIsValid = sighting.quantity === undefined ||
      (typeof sighting.quantity === "number" && Number.isInteger(sighting.quantity) && sighting.quantity > 0);
    const timeIsValid = sighting.time === undefined || (typeof sighting.time === "string" && isValidSightingTime(sighting.time));
    return typeof sighting.id === "string" && sighting.id.length > 0 &&
      typeof sighting.speciesId === "string" && species.some((entry) => entry.id === sighting.speciesId) &&
      typeof sighting.date === "string" && isValidSightingDate(sighting.date) &&
      typeof sighting.createdAt === "string" && typeof sighting.updatedAt === "string" &&
      ["exact", "approximate", "municipality", "none"].includes(sighting.locationPrecision ?? "") &&
      ["private", "shareable"].includes(sighting.visibility ?? "") &&
      timeIsValid && isValidCoordinatePair(sighting.latitude, sighting.longitude) && quantityIsValid;
  });
}

export function sanitizeSettings(value: unknown): { defaultLanguage: string; quickLanguages: string[] } {
  const fallback = { defaultLanguage: "Português", quickLanguages: ["Português", "English"] };
  if (!value || typeof value !== "object") return fallback;
  const candidate = value as { defaultLanguage?: unknown; quickLanguages?: unknown };
  const quickLanguages = Array.isArray(candidate.quickLanguages) ? candidate.quickLanguages.filter((item): item is string => typeof item === "string" && languages.includes(item)) : fallback.quickLanguages;
  const safeQuickLanguages = quickLanguages.length ? Array.from(new Set(quickLanguages)) : fallback.quickLanguages;
  const defaultLanguage = typeof candidate.defaultLanguage === "string" && languages.includes(candidate.defaultLanguage) ? candidate.defaultLanguage : safeQuickLanguages[0];
  return { defaultLanguage, quickLanguages: safeQuickLanguages };
}
