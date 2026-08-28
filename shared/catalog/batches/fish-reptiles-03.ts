import type { Species } from "../../pantanal";
import type { CatalogBatch } from "../types";

const image = (uri: string, author: string, license: string, sourceUrl: string, credit: string) => ({ uri, author, license, sourceUrl, credit });
const gbif = (name: string) => ({ title: `GBIF Species Match — ${name}`, url: `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(name)}` });
const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;
const filePath = (file: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${file}`;

const fishReptilesSpecies: Species[] = [
    {
      id: "serrasalmus-maculatus", commonName: "Piranha", scientificName: "Serrasalmus maculatus", group: "Peixes", environments: ["Rios e corixos", "Áreas alagadas"],
      description: "Peixe serrassalmídeo de corpo comprimido, associado a rios, lagoas e ambientes alagáveis da América do Sul.",
      physicalCharacteristics: "Corpo alto e comprimido, dentição cortante, coloração prateada e manchas que variam com idade e ambiente.",
      habitat: "Rios, baías, lagoas marginais e áreas sazonalmente alagadas com abrigo vegetal.",
      behavior: "Move-se individualmente ou em pequenos grupos e utiliza dentes cortantes na captura e processamento de alimento.",
      diet: "Peixes, invertebrados e material animal disponível no ambiente aquático.",
      curiosities: ["A dentição é renovada e adaptada ao corte de tecidos.", "A coloração pode mudar entre juvenis e adultos."],
      distribution: "Bacias Paraná–Paraguai e outras drenagens sul-americanas, conforme a taxonomia aceita.",
      ecologicalImportance: "É predador de ambientes aquáticos e participa da regulação das comunidades de peixes e invertebrados.",
      images: [
        image(filePath("Serrasalmus_maculatus.png"), "Rudolf Kner", "Public domain", commons("Serrasalmus_maculatus.png"), "Rudolf Kner / Wikimedia Commons"),
        image(filePath("Serrasalmus_maculatus_1127079.jpg"), "Nicolas Olejnik", "CC BY 4.0", commons("Serrasalmus_maculatus_1127079.jpg"), "Nicolas Olejnik / iNaturalist / Wikimedia Commons"),
        image(filePath("Serrasalmus_maculatus_123115950.jpg"), "Kozue Kawakami", "CC BY-SA 4.0", commons("Serrasalmus_maculatus_123115950.jpg"), "Kozue Kawakami / iNaturalist / Wikimedia Commons"),
      ], sources: [gbif("Serrasalmus maculatus")],
    },
    {
      id: "serrasalmus-marginatus", commonName: "Piranha", scientificName: "Serrasalmus marginatus", group: "Peixes", environments: ["Rios e corixos", "Áreas alagadas"],
      description: "Piranha de água doce com corpo comprimido, registrada em rios e ambientes alagáveis da bacia Paraná–Paraguai.",
      physicalCharacteristics: "Corpo prateado e comprimido lateralmente, mandíbula robusta e dentes triangulares.", habitat: "Rios, baías, corixos e lagoas marginais com diferentes velocidades de corrente.", behavior: "Explora a coluna d’água e estruturas marginais, alternando deslocamentos e períodos de espera para alimentação.", diet: "Peixes, invertebrados e outros itens animais disponíveis na água.", curiosities: ["A espécie integra uma guilda de predadores com dentição especializada.", "Há variação de coloração associada à idade e às condições ambientais."], distribution: "Bacias Paraná–Paraguai e drenagens relacionadas da América do Sul.", ecologicalImportance: "Contribui para o fluxo de energia e a regulação de populações aquáticas.",
      images: [
        image(filePath("Serrasalmus_marginatus,_Fazenda_São_Francisco,_Corguinho,_MS.jpg"), "Diogo Luiz", "CC BY-SA 4.0", commons("Serrasalmus_marginatus,_Fazenda_São_Francisco,_Corguinho,_MS.jpg"), "Diogo Luiz / Wikimedia Commons"),
        image(filePath("Serrasalmus_marginatus,_Fazenda_São_Francisco,_Corguinho,_MS_(cropped).jpg"), "Diogo Luiz", "CC BY 4.0", commons("Serrasalmus_marginatus,_Fazenda_São_Francisco,_Corguinho,_MS_(cropped).jpg"), "Diogo Luiz / Wikimedia Commons"),
        image(filePath("Serrasalmus_marginatus.jpg"), "Paul Louis Oudart", "Public domain", commons("Serrasalmus_marginatus.jpg"), "Paul Louis Oudart / Wikimedia Commons"),
      ], sources: [gbif("Serrasalmus marginatus")],
    },
    {
      id: "gymnotus-inaequilabiatus", commonName: "Tuvira", scientificName: "Gymnotus inaequilabiatus", group: "Peixes", environments: ["Rios e corixos", "Áreas alagadas"],
      description: "Peixe elétrico de corpo alongado, típico de águas lentas, margens vegetadas e ambientes alagáveis.",
      physicalCharacteristics: "Corpo serpentiforme, nadadeira anal longa e órgãos especializados para produção e recepção de sinais elétricos.", habitat: "Corixos, lagoas marginais, brejos e trechos de baixa correnteza com vegetação ou matéria orgânica.", behavior: "É predominantemente noturno e utiliza sinais elétricos para orientação, comunicação e localização de presas.", diet: "Pequenos invertebrados, larvas e outros organismos aquáticos.", curiosities: ["A nadadeira anal permite deslocamento para frente e para trás.", "Os sinais elétricos são fracos e usados para percepção do entorno."], distribution: "Drenagens sul-americanas, incluindo a bacia Paraná–Paraguai.", ecologicalImportance: "Participa das cadeias alimentares de áreas alagadas e utiliza micro-hábitats de baixa correnteza.",
      images: [
        image(filePath("Gymnotus_inaequilabiatus.jpg"), "Paul Louis Oudart", "Public domain", commons("Gymnotus_inaequilabiatus.jpg"), "Paul Louis Oudart / Wikimedia Commons"),
        image(filePath("Gymnotus_inaequilabiatus_170564039.jpg"), "Gabriel Albelda", "CC BY 4.0", commons("Gymnotus_inaequilabiatus_170564039.jpg"), "Gabriel Albelda / iNaturalist / Wikimedia Commons"),
        image(filePath("Gymnotus_inaequilabiatus_170564052.jpg"), "Gabriel Albelda", "CC BY 4.0", commons("Gymnotus_inaequilabiatus_170564052.jpg"), "Gabriel Albelda / iNaturalist / Wikimedia Commons"),
      ], sources: [gbif("Gymnotus inaequilabiatus")],
    },
    {
      id: "eigenmannia-virescens", commonName: "Ituí-transparente", scientificName: "Eigenmannia virescens", group: "Peixes", environments: ["Rios e corixos", "Áreas alagadas"],
      description: "Peixe elétrico de corpo muito alongado e translúcido, encontrado em águas calmas e vegetadas.",
      physicalCharacteristics: "Corpo estreito, nadadeira anal extensa e coloração clara que pode parecer translúcida.", habitat: "Lagoas, margens de rios, canais e áreas alagadas com vegetação submersa.", behavior: "Usa propulsão pela nadadeira anal e sinais elétricos para deslocamento e percepção em baixa luminosidade.", diet: "Pequenos invertebrados e organismos associados à vegetação aquática.", curiosities: ["Consegue nadar para frente e para trás pela ondulação da nadadeira anal.", "O corpo alongado favorece a exploração de espaços entre plantas aquáticas."], distribution: "Bacias de água doce da América do Sul tropical e subtropical.", ecologicalImportance: "Ocupa uma guilda especializada em ambientes de baixa correnteza e integra a teia alimentar aquática.",
      images: [
        image(filePath("Eigenmannia_virescens-head.jpg"), "Will Kirk; composite by Eric Fortune and Eatai Roth", "CC BY 2.5", commons("Eigenmannia_virescens-head.jpg"), "Will Kirk; Eric Fortune; Eatai Roth / Wikimedia Commons"),
        image(filePath("Eigenmannia_virescens_(16335551097).jpg"), "Ictiologia Universidad Católica de Oriente", "CC BY 2.0", commons("Eigenmannia_virescens_(16335551097).jpg"), "Ictiologia Universidad Católica de Oriente / Wikimedia Commons"),
        image(filePath("Eigenmannia_virescens_000.jpg"), "Luis Ruiz Berti", "CC BY-SA 3.0", commons("Eigenmannia_virescens_000.jpg"), "Luis Ruiz Berti / Wikimedia Commons"),
      ], sources: [gbif("Eigenmannia virescens")],
    },
    {
      id: "rhamdia-quelen", commonName: "Jundiá", scientificName: "Rhamdia quelen", group: "Peixes", environments: ["Rios e corixos", "Áreas alagadas"],
      description: "Bagre de água doce associado a rios, córregos, lagoas e áreas de fundo com abrigo.",
      physicalCharacteristics: "Corpo alongado, barbilhões sensoriais, nadadeiras peitorais e coloração variável entre cinza e castanho.", habitat: "Rios, córregos, lagoas marginais e ambientes com substrato e estruturas de abrigo.", behavior: "Pode ser mais ativo ao entardecer e à noite, explorando o fundo e a vegetação marginal.", diet: "Pequenos peixes, invertebrados e outros recursos encontrados no fundo.", curiosities: ["Os barbilhões ajudam a localizar alimento em águas turvas.", "É conhecido por tolerar diferentes condições de ambientes de água doce."], distribution: "América do Sul, incluindo a bacia Paraná–Paraguai.", ecologicalImportance: "Atua como consumidor bentônico e conecta recursos do fundo às cadeias alimentares aquáticas.",
      images: [
        image(filePath("Rhamdia_quelen,_florida.jpg"), "Deftiks", "CC BY-SA 4.0", commons("Rhamdia_quelen,_florida.jpg"), "Deftiks / Wikimedia Commons"),
        image(filePath("Rhamdia_quelen.jpg"), "Paul Louis Oudart", "Public domain", commons("Rhamdia_quelen.jpg"), "Paul Louis Oudart / Wikimedia Commons"),
        image(filePath("Rhamdia_quelen_(16335507449).jpg"), "Ictiologia Universidad Católica de Oriente", "CC BY 2.0", commons("Rhamdia_quelen_(16335507449).jpg"), "Ictiologia Universidad Católica de Oriente / Wikimedia Commons"),
      ], sources: [gbif("Rhamdia quelen")],
    },
    {
      id: "synbranchus-marmoratus", commonName: "Muçum", scientificName: "Synbranchus marmoratus", group: "Peixes", environments: ["Rios e corixos", "Áreas alagadas"],
      description: "Peixe alongado de ambientes rasos e alagáveis, capaz de utilizar águas com pouco oxigênio dissolvido.",
      physicalCharacteristics: "Corpo serpentiforme, ausência aparente de nadadeiras pares e pele com padrão marmorizado.", habitat: "Brejos, lagoas, canais, margens lodosas e áreas temporariamente alagadas.", behavior: "Pode permanecer oculto no substrato e deslocar-se entre corpos d’água durante períodos de inundação.", diet: "Invertebrados, pequenos peixes e outros organismos aquáticos.", curiosities: ["O corpo alongado facilita a entrada em tocas e fendas.", "A espécie tolera condições ambientais variáveis em áreas sazonalmente alagadas."], distribution: "América do Sul tropical e subtropical, incluindo a bacia Paraná–Paraguai.", ecologicalImportance: "Explora recursos de brejos e fundos lodosos e serve de presa para vertebrados aquáticos.",
      images: [
        image(filePath("Synbranchus_marmoratus.jpg"), "François-Louis Laporte, conde de Castelnau", "Public domain", commons("Synbranchus_marmoratus.jpg"), "François-Louis Laporte, conde de Castelnau / Wikimedia Commons"),
        image(filePath("Synbranchus_marmoratus_456740782.jpg"), "Ezequiel Racker", "CC BY 4.0", commons("Synbranchus_marmoratus_456740782.jpg"), "Ezequiel Racker / iNaturalist / Wikimedia Commons"),
        image(filePath("Vertèbre_d'anguille_des_marais_(Synbranchus_marmoratus)_d'un_site_amazonien_précolombien_(fouille_archeologique)_(Ifremer_00784-89638).jpg"), "Romain (1) Elleboode", "CC BY 4.0", commons("Vertèbre_d'anguille_des_marais_(Synbranchus_marmoratus)_d'un_site_amazonien_précolombien_(fouille_archeologique)_(Ifremer_00784-89638).jpg"), "Romain (1) Elleboode / Wikimedia Commons"),
      ], sources: [gbif("Synbranchus marmoratus")],
    },
    {
      id: "hemisorubim-platyrhynchos", commonName: "Jurupoca", scientificName: "Hemisorubim platyrhynchos", group: "Peixes", environments: ["Rios e corixos", "Áreas alagadas"],
      description: "Bagre predador de médio porte associado a rios e canais de água doce da bacia Paraná–Paraguai.",
      physicalCharacteristics: "Corpo alongado, cabeça achatada, boca ampla e barbilhões que auxiliam a exploração do fundo.", habitat: "Canais de rios, margens, poços e ambientes com correnteza moderada e abrigo.", behavior: "Explora o fundo e as margens, utilizando a boca ampla para capturar presas aquáticas.", diet: "Peixes e invertebrados aquáticos, especialmente em fases de maior atividade predatória.", curiosities: ["A cabeça achatada reduz a resistência junto ao fundo.", "Os barbilhões funcionam como estruturas sensoriais em água turva."], distribution: "Bacias Paraná–Paraguai, Amazonas e outras drenagens sul-americanas conforme a distribuição aceita.", ecologicalImportance: "É predador de rios e participa da transferência de energia entre diferentes níveis tróficos.",
      images: [
        image(filePath("Hemisorubim_platyrhynchos_(16_September_1865).jpg"), "Jacques Burkhardt", "Public domain", commons("Hemisorubim_platyrhynchos_(16_September_1865).jpg"), "Jacques Burkhardt / Wikimedia Commons"),
        image(filePath("Hemisorubim_platyrhynchos_(Tocantins,_Brazil,_21_September_1865).jpg"), "Jacques Burkhardt", "Public domain", commons("Hemisorubim_platyrhynchos_(Tocantins,_Brazil,_21_September_1865).jpg"), "Jacques Burkhardt / Wikimedia Commons"),
        image(filePath("Johann_Natterer_-_Jurupoca_(Hemisorubim_platyrhynchos).jpg"), "Johann Natterer", "Public domain", commons("Johann_Natterer_-_Jurupoca_(Hemisorubim_platyrhynchos).jpg"), "Johann Natterer / Wikimedia Commons"),
      ], sources: [gbif("Hemisorubim platyrhynchos")],
    },
    {
      id: "loricariichthys-platymetopon", commonName: "Cascudo-chinelo", scientificName: "Loricariichthys platymetopon", group: "Peixes", environments: ["Rios e corixos", "Áreas alagadas"],
      description: "Cascudo de fundo com corpo protegido por placas ósseas, associado a rios e ambientes de correnteza baixa a moderada.",
      physicalCharacteristics: "Corpo revestido por placas, boca ventral adaptada à sucção e nadadeiras peitorais e dorsais desenvolvidas.", habitat: "Fundos arenosos ou lodosos, margens, canais e lagoas conectadas a rios.", behavior: "Permanece próximo ao fundo e utiliza a boca para raspar superfícies e coletar recursos.", diet: "Algas, perifíton, detritos e pequenos organismos associados ao substrato.", curiosities: ["As placas ósseas funcionam como proteção corporal.", "A boca ventral facilita a alimentação em superfícies submersas."], distribution: "Bacias sul-americanas, incluindo a drenagem Paraná–Paraguai.", ecologicalImportance: "Contribui para o processamento de matéria orgânica e perifíton nos fundos aquáticos.",
      images: [
        image(filePath("FMIB_52364_Loricaria_typus_(Bleeker).jpeg"), "Carl H. Eigenmann e Waldo Lee McAtee", "Public domain", commons("FMIB_52364_Loricaria_typus_(Bleeker).jpeg"), "Carl H. Eigenmann e Waldo Lee McAtee / Wikimedia Commons"),
        image(filePath("Fish_fauna_from_Río_Pilcomayo_National_Park_(5_of_7).png"), "Florencia Brancolini, Priscilla Minotti, Lucila Protogino, Hugo López e Claudio Baigún", "CC BY 4.0", commons("Fish_fauna_from_Río_Pilcomayo_National_Park_(5_of_7).png"), "Autores / Wikimedia Commons"),
        image(filePath("Loricariichthys_platymetopon.jpg"), "Frank M. Greco", "CC BY 3.0", commons("Loricariichthys_platymetopon.jpg"), "Frank M. Greco / Wikimedia Commons"),
      ], sources: [gbif("Loricariichthys platymetopon")],
    },
    {
      id: "paleosuchus-palpebrosus", commonName: "Jacaré-paguá", scientificName: "Paleosuchus palpebrosus", group: "Répteis", environments: ["Rios e corixos", "Áreas alagadas", "Matas"],
      description: "Pequeno jacaré de focinho curto, associado a riachos, lagoas florestadas e margens com cobertura vegetal.",
      physicalCharacteristics: "Corpo compacto, cabeça curta, osteodermos bem desenvolvidos e coloração escura.", habitat: "Riachos, corixos, lagoas e margens sombreadas com abrigo e água permanente ou sazonal.", behavior: "É discreto e pode permanecer imóvel ou abrigado durante períodos de calor e baixa atividade.", diet: "Peixes, crustáceos, insetos e outros pequenos animais aquáticos ou terrestres.", curiosities: ["É uma das menores espécies de jacaré.", "A armadura dorsal oferece proteção contra abrasão e predadores."], distribution: "América do Sul tropical, incluindo áreas interiores do Brasil.", ecologicalImportance: "Preda organismos aquáticos e terrestres e integra as cadeias alimentares de áreas úmidas.",
      images: [
        image(filePath("Paleosuchus_palpebrosus_01.jpg"), "Llez", "CC BY-SA 3.0", commons("Paleosuchus_palpebrosus_01.jpg"), "Llez / Wikimedia Commons"),
        image(filePath("Paleosuchus_palpebrosus_17009340.jpg"), "Vincent A. Vos", "CC BY 4.0", commons("Paleosuchus_palpebrosus_17009340.jpg"), "Vincent A. Vos / iNaturalist / Wikimedia Commons"),
        image(filePath("Paleosuchus_palpebrosus_18607447.jpg"), "Vincent A. Vos", "CC BY 4.0", commons("Paleosuchus_palpebrosus_18607447.jpg"), "Vincent A. Vos / iNaturalist / Wikimedia Commons"),
      ], sources: [gbif("Paleosuchus palpebrosus")],
    },
    {
      id: "micrablepharus-maximiliani", commonName: "Lagarto-de-cauda-azul", scientificName: "Micrablepharus maximiliani", group: "Répteis", environments: ["Campos", "Bordas de mata"],
      description: "Pequeno lagarto de ambientes abertos, com corpo delicado e cauda que pode apresentar tonalidade azulada.",
      physicalCharacteristics: "Corpo alongado, membros bem desenvolvidos, escamas finas e cauda proporcionalmente longa.", habitat: "Campos, áreas arenosas, bordas de vegetação e clareiras com exposição ao sol.", behavior: "É ágil e termorregula ao sol, buscando pequenos invertebrados entre folhas, areia e detritos.", diet: "Pequenos artrópodes e outros invertebrados terrestres.", curiosities: ["A cauda pode apresentar coloração azulada mais intensa em determinados indivíduos.", "A atividade depende da temperatura e da disponibilidade de abrigo."], distribution: "Formações abertas do Brasil e áreas adjacentes da América do Sul.", ecologicalImportance: "Controla pequenos artrópodes e serve de presa para aves, serpentes e outros predadores.",
      images: [
        image(filePath("Lagarto-de-cauda-azul_(Micrablepharus_maximiliani).jpg"), "VictorlucasBio", "CC BY-SA 4.0", commons("Lagarto-de-cauda-azul_(Micrablepharus_maximiliani).jpg"), "VictorlucasBio / Wikimedia Commons"),
        image(filePath("Micrablepharus_maximiliani_NIE.gif"), "Sacamol", "Public domain", commons("Micrablepharus_maximiliani_NIE.gif"), "Sacamol / Wikimedia Commons"),
        image(filePath("NIEdot340.jpg"), "Dodd, Mead and Company", "Public domain", commons("NIEdot340.jpg"), "Dodd, Mead and Company / Wikimedia Commons"),
      ], sources: [gbif("Micrablepharus maximiliani")],
    },
    {
      id: "phrynops-geoffroanus", commonName: "Cágado-de-barbicha", scientificName: "Phrynops geoffroanus", group: "Répteis", environments: ["Rios e corixos", "Áreas alagadas"],
      description: "Cágado de água doce que utiliza rios, córregos e lagoas, saindo da água para repouso e deslocamento terrestre.",
      physicalCharacteristics: "Carapaça achatada, cabeça larga, pescoço com barbelas e membros adaptados à natação.", habitat: "Rios, córregos, lagoas marginais e áreas alagadas com margens para abrigo e termorregulação.", behavior: "Nada e mergulha com eficiência, alternando períodos aquáticos e repouso em troncos ou margens.", diet: "Invertebrados, peixes, anfíbios, carniça e material vegetal conforme a disponibilidade.", curiosities: ["As barbelas no queixo ajudam a caracterizar a espécie.", "A carapaça achatada favorece a movimentação em água corrente."], distribution: "Bacias hidrográficas do Brasil e países vizinhos da América do Sul.", ecologicalImportance: "Participa das cadeias alimentares aquáticas e transporta matéria e energia entre água e margens.",
      images: [
        image(filePath("Chelidae_Phrynops_geoffroanus_1.jpg"), "NasserHalaweh", "CC BY-SA 4.0", commons("Chelidae_Phrynops_geoffroanus_1.jpg"), "NasserHalaweh / Wikimedia Commons"),
        image(filePath("Phrynops_geoffroanus_-_Zoo_Frankfurt.jpg"), "Jutta234", "CC BY-SA 3.0", commons("Phrynops_geoffroanus_-_Zoo_Frankfurt.jpg"), "Jutta234 / Wikimedia Commons"),
        image(filePath("Phrynops_geoffroanus_405590163.jpg"), "Lucas Mantelo Cruz", "CC BY 4.0", commons("Phrynops_geoffroanus_405590163.jpg"), "Lucas Mantelo Cruz / iNaturalist / Wikimedia Commons"),
      ], sources: [gbif("Phrynops geoffroanus")],
    },
    {
      id: "hydrodynastes-gigas", commonName: "Caninana-do-pantanal", scientificName: "Hydrodynastes gigas", group: "Répteis", environments: ["Áreas alagadas", "Campos", "Rios e corixos"],
      description: "Serpente de grande porte associada a áreas abertas e alagáveis, com hábitos terrestres e capacidade de nadar.",
      physicalCharacteristics: "Corpo robusto, cabeça distinta do pescoço e padrão de manchas e faixas em tons contrastantes.", habitat: "Campos úmidos, brejos, margens de lagoas, rios e áreas sazonalmente inundadas.", behavior: "Explora o solo e a água, deslocando-se em busca de presas e abrigo; pode elevar a porção anterior do corpo quando ameaçada.", diet: "Anfíbios, peixes, pequenos mamíferos, aves e outros vertebrados disponíveis.", curiosities: ["É uma das maiores serpentes colubrídeas da América do Sul.", "A coloração ajuda a quebrar o contorno do corpo em vegetação e margens."], distribution: "Áreas úmidas e savânicas da América do Sul, incluindo o Pantanal e a bacia Paraná–Paraguai.", ecologicalImportance: "Preda vertebrados de ambientes aquáticos e terrestres e integra as cadeias alimentares de áreas úmidas.",
      images: [
        image(filePath("Hydrodynastes_gigas,_male.jpg"), "J. Polák", "CC0", commons("Hydrodynastes_gigas,_male.jpg"), "J. Polák / Wikimedia Commons"),
        image(filePath("Hydrodynastes_gigas,_male2.jpg"), "J. Polák", "CC0", commons("Hydrodynastes_gigas,_male2.jpg"), "J. Polák / Wikimedia Commons"),
        image(filePath("Lectotype_MNHN_3623_Hydrodynastes_gigas.png"), "Carvalho PS, Zaher H, da Silva Jr NJ e Santana DJ", "CC BY 4.0", commons("Lectotype_MNHN_3623_Hydrodynastes_gigas.png"), "Carvalho, Zaher, da Silva Jr e Santana / Wikimedia Commons"),
      ], sources: [gbif("Hydrodynastes gigas")],
    },
  ];

const fishSpecies = fishReptilesSpecies.filter((item) => item.group === "Peixes");
const reptileSpecies = fishReptilesSpecies.filter((item) => item.group === "Répteis");

export const fishReptiles03: CatalogBatch = {
  batchId: "catalog-fish-03",
  cycle: 3,
  group: "Peixes",
  status: "verified",
  sources: fishSpecies.flatMap((item) => item.sources),
  species: fishSpecies,
};

export const reptiles02: CatalogBatch = {
  batchId: "catalog-reptiles-02",
  cycle: 3,
  group: "Répteis",
  status: "verified",
  sources: reptileSpecies.flatMap((item) => item.sources),
  species: reptileSpecies,
};
