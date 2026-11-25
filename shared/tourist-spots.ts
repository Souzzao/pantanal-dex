/**
 * PantanalDex — Pontos turísticos e cidades pantaneiras, distância Haversine, check-in (RN06) e insígnias de Explorador.
 *
 * @author Felipe de Souza Aquino
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ArtName } from "./art-names";

/**
 * Pontos turísticos do Pantanal no mapa (no estilo "Pokéstop"): chegando perto com o GPS,
 * a pessoa faz check-in e ganha a insígnia do lugar. Coordenadas do Wikidata (fonte em cada ponto).
 * O raio é a distância máxima para o check-in valer: maior em parques extensos, menor em monumentos.
 */
export type SpotKind = "parque" | "estrada" | "historico" | "cidade" | "natureza";
type L4 = { pt: string; en: string; es: string; de: string };
export type TouristSpot = { id: string; name: L4; about: L4; kind: SpotKind; latitude: number; longitude: number; radiusM: number; icon: ArtName; source: string; /** Um dos 16 municípios do Pantanal (Embrapa). */ city?: boolean };

const W = (q: string) => `https://www.wikidata.org/wiki/${q}`;

export const TOURIST_SPOTS: TouristSpot[] = [
  { id: "pocone", kind: "cidade", city: true, icon: "cidade", latitude: -16.2569, longitude: -56.6228, radiusM: 4000, source: "https://pt.wikipedia.org/wiki/Pocon%C3%A9",
    name: { pt: "Poconé, porta da Transpantaneira", en: "Poconé, gateway to the Transpantaneira", es: "Poconé, puerta de la Transpantaneira", de: "Poconé, Tor zur Transpantaneira" },
    about: { pt: "Cidade de onde sai a Transpantaneira (MT-060), a estrada de terra que corta o Pantanal norte rumo a Porto Jofre.", en: "Town where the Transpantaneira (MT-060) begins, the dirt road crossing the northern Pantanal to Porto Jofre.", es: "Ciudad donde empieza la Transpantaneira (MT-060), el camino de tierra que cruza el Pantanal norte hasta Porto Jofre.", de: "Stadt am Beginn der Transpantaneira (MT-060), der Schotterstraße durch das nördliche Pantanal bis Porto Jofre." } },
  { id: "transpantaneira", kind: "estrada", icon: "ponte", latitude: -16.8174, longitude: -56.8454, radiusM: 6000, source: W("Q7834764"),
    name: { pt: "Transpantaneira (MT-060)", en: "Transpantaneira (MT-060)", es: "Transpantaneira (MT-060)", de: "Transpantaneira (MT-060)" },
    about: { pt: "Estrada com mais de cem pontes de madeira; nas margens alagadas é comum ver jacarés, tuiuiús e capivaras.", en: "Road with over a hundred wooden bridges; caimans, jabirus and capybaras are common along its flooded edges.", es: "Camino con más de cien puentes de madera; en sus orillas inundadas es común ver yacarés, tuyuyús y carpinchos.", de: "Straße mit über hundert Holzbrücken; an den überfluteten Rändern sieht man oft Kaimane, Jabirus und Capybaras." } },
  { id: "porto-jofre", kind: "natureza", icon: "onca", latitude: -17.3333, longitude: -56.8, radiusM: 4000, source: W("Q1637633"),
    name: { pt: "Porto Jofre", en: "Porto Jofre", es: "Porto Jofre", de: "Porto Jofre" },
    about: { pt: "Fim da Transpantaneira, às margens do rio Cuiabá. Ponto de saída dos barcos para observar onças-pintadas.", en: "End of the Transpantaneira on the Cuiabá River. Boats leave from here to watch jaguars.", es: "Fin de la Transpantaneira, a orillas del río Cuiabá. De aquí salen los barcos para ver jaguares.", de: "Ende der Transpantaneira am Cuiabá-Fluss. Von hier fahren Boote zur Jaguarbeobachtung." } },
  { id: "encontro-das-aguas", kind: "parque", icon: "rio", latitude: -17.12, longitude: -56.69, radiusM: 15000, source: W("Q10344991"),
    name: { pt: "Parque Estadual Encontro das Águas", en: "Encontro das Águas State Park", es: "Parque Estatal Encontro das Águas", de: "Staatspark Encontro das Águas" },
    about: { pt: "Unidade de conservação de Mato Grosso no encontro dos rios Cuiabá e São Lourenço, uma das áreas com mais onças-pintadas do mundo.", en: "Mato Grosso protected area where the Cuiabá and São Lourenço rivers meet, one of the world's densest jaguar areas.", es: "Área protegida de Mato Grosso donde se unen los ríos Cuiabá y São Lourenço, una de las zonas con más jaguares del mundo.", de: "Schutzgebiet in Mato Grosso am Zusammenfluss von Cuiabá und São Lourenço, eines der jaguarreichsten Gebiete der Welt." } },
  { id: "sesc-pantanal", kind: "parque", icon: "arvore", latitude: -16.6667, longitude: -56.25, radiusM: 15000, source: W("Q96740014"),
    name: { pt: "RPPN Sesc Pantanal", en: "Sesc Pantanal Private Reserve", es: "Reserva privada Sesc Pantanal", de: "Privatreservat Sesc Pantanal" },
    about: { pt: "Reserva Particular do Patrimônio Natural criada em 1997 em Barão de Melgaço, a maior RPPN do Brasil.", en: "Private natural heritage reserve created in 1997 in Barão de Melgaço, the largest of its kind in Brazil.", es: "Reserva privada del patrimonio natural creada en 1997 en Barão de Melgaço, la mayor de su tipo en Brasil.", de: "1997 gegründetes privates Naturerbe-Reservat in Barão de Melgaço, das größte seiner Art in Brasilien." } },
  { id: "chacorore", kind: "natureza", icon: "tuiuiu", latitude: -16.3, longitude: -55.9333, radiusM: 6000, source: W("Q22046016"),
    name: { pt: "Baía de Chacororé", en: "Chacororé Bay", es: "Bahía de Chacororé", de: "Chacororé-Bucht" },
    about: { pt: "Grande lagoa ligada ao rio Cuiabá, perto de Barão de Melgaço, conhecida pela pesca e pelas aves aquáticas.", en: "Large lagoon linked to the Cuiabá River near Barão de Melgaço, known for fishing and waterbirds.", es: "Gran laguna unida al río Cuiabá cerca de Barão de Melgaço, conocida por la pesca y las aves acuáticas.", de: "Große Lagune am Cuiabá-Fluss bei Barão de Melgaço, bekannt für Fischfang und Wasservögel." } },
  { id: "caceres", kind: "cidade", city: true, icon: "anzol", latitude: -16.0711, longitude: -57.6789, radiusM: 4000, source: "https://pt.wikipedia.org/wiki/C%C3%A1ceres_(Mato_Grosso)",
    name: { pt: "Cáceres e o rio Paraguai", en: "Cáceres and the Paraguay River", es: "Cáceres y el río Paraguay", de: "Cáceres und der Paraguay-Fluss" },
    about: { pt: "Cidade histórica às margens do rio Paraguai, porta de entrada do Pantanal pelo oeste de Mato Grosso.", en: "Historic town on the Paraguay River, a western gateway to the Mato Grosso Pantanal.", es: "Ciudad histórica a orillas del río Paraguay, puerta de entrada al Pantanal por el oeste de Mato Grosso.", de: "Historische Stadt am Paraguay-Fluss, westliches Tor zum Pantanal von Mato Grosso." } },
  { id: "taiama", kind: "parque", icon: "peixe", latitude: -16.853, longitude: -57.505, radiusM: 10000, source: W("Q7675867"),
    name: { pt: "Estação Ecológica de Taiamã", en: "Taiamã Ecological Station", es: "Estación Ecológica de Taiamã", de: "Ökologische Station Taiamã" },
    about: { pt: "Ilha fluvial no rio Paraguai protegida pelo governo federal, entre Cáceres e Poconé; visita só com autorização.", en: "Federally protected river island on the Paraguay River between Cáceres and Poconé; visits need permission.", es: "Isla fluvial en el río Paraguay protegida por el gobierno federal, entre Cáceres y Poconé; visitas solo con permiso.", de: "Bundesweit geschützte Flussinsel im Paraguay zwischen Cáceres und Poconé; Besuch nur mit Genehmigung." } },
  { id: "parna-pantanal", kind: "parque", icon: "montanha", latitude: -17.65, longitude: -57.4333, radiusM: 20000, source: W("Q3179800"),
    name: { pt: "Parque Nacional do Pantanal Matogrossense", en: "Pantanal Matogrossense National Park", es: "Parque Nacional del Pantanal Matogrossense", de: "Nationalpark Pantanal Matogrossense" },
    about: { pt: "Parque nacional no encontro dos rios Paraguai e Cuiabá, parte do Sítio do Patrimônio Mundial da UNESCO no Pantanal.", en: "National park where the Paraguay and Cuiabá rivers meet, part of the Pantanal UNESCO World Heritage Site.", es: "Parque nacional donde se unen los ríos Paraguay y Cuiabá, parte del sitio Patrimonio Mundial de la UNESCO en el Pantanal.", de: "Nationalpark am Zusammenfluss von Paraguay und Cuiabá, Teil des UNESCO-Welterbes Pantanal." } },
  { id: "guira", kind: "parque", icon: "folhas", latitude: -17.3607, longitude: -57.8842, radiusM: 15000, source: W("Q10344997"),
    name: { pt: "Parque Estadual do Guirá", en: "Guirá State Park", es: "Parque Estatal del Guirá", de: "Staatspark Guirá" },
    about: { pt: "Unidade de conservação de Mato Grosso no Pantanal de Cáceres, junto à fronteira com a Bolívia.", en: "Mato Grosso protected area in the Cáceres Pantanal, next to the Bolivian border.", es: "Área protegida de Mato Grosso en el Pantanal de Cáceres, junto a la frontera con Bolivia.", de: "Schutzgebiet von Mato Grosso im Pantanal von Cáceres an der Grenze zu Bolivien." } },
  { id: "cristo-rei", kind: "historico", icon: "igreja", latitude: -19.0189, longitude: -57.6404, radiusM: 500, source: W("Q130286908"),
    name: { pt: "Cristo Rei do Pantanal", en: "Christ the King of the Pantanal", es: "Cristo Rey del Pantanal", de: "Christkönig des Pantanal" },
    about: { pt: "Estátua no Mirante Izulina Xavier, em Corumbá, com vista para o rio Paraguai e a planície alagável.", en: "Statue at the Izulina Xavier lookout in Corumbá, overlooking the Paraguay River and the floodplain.", es: "Estatua en el Mirador Izulina Xavier, en Corumbá, con vista al río Paraguay y la llanura inundable.", de: "Statue am Aussichtspunkt Izulina Xavier in Corumbá mit Blick auf den Paraguay und die Schwemmebene." } },
  { id: "forte-junqueira", kind: "historico", icon: "forte", latitude: -18.9968, longitude: -57.6365, radiusM: 500, source: W("Q130269872"),
    name: { pt: "Forte Junqueira", en: "Fort Junqueira", es: "Fuerte Junqueira", de: "Fort Junqueira" },
    about: { pt: "Fortificação histórica de Corumbá, bem de interesse histórico e cultural da cidade.", en: "Historic fortification in Corumbá, listed as a site of historic and cultural interest.", es: "Fortificación histórica de Corumbá, bien de interés histórico y cultural de la ciudad.", de: "Historische Festung in Corumbá, als Kulturdenkmal der Stadt eingetragen." } },
  { id: "forte-coimbra", kind: "historico", icon: "ancora", latitude: -19.9203, longitude: -57.7921, radiusM: 3000, source: W("Q18479243"),
    name: { pt: "Forte Coimbra", en: "Fort Coimbra", es: "Fuerte Coimbra", de: "Fort Coimbra" },
    about: { pt: "Distrito de Corumbá às margens do rio Paraguai, onde fica o forte colonial do século XVIII.", en: "District of Corumbá on the Paraguay River, home to the 18th-century colonial fort.", es: "Distrito de Corumbá a orillas del río Paraguay, donde está el fuerte colonial del siglo XVIII.", de: "Bezirk von Corumbá am Paraguay mit der Kolonialfestung aus dem 18. Jahrhundert." } },
  { id: "passo-do-lontra", kind: "natureza", icon: "ariranha", latitude: -19.5755, longitude: -57.0373, radiusM: 4000, source: W("Q18481340"),
    name: { pt: "Passo do Lontra", en: "Passo do Lontra", es: "Passo do Lontra", de: "Passo do Lontra" },
    about: { pt: "Área do Pantanal sul-mato-grossense na Estrada Parque, às margens do rio Miranda, procurada para observar fauna e pescar.", en: "Southern Pantanal area on the Estrada Parque by the Miranda River, sought for wildlife watching and fishing.", es: "Zona del Pantanal sur en la Estrada Parque, a orillas del río Miranda, buscada para ver fauna y pescar.", de: "Gebiet im südlichen Pantanal an der Estrada Parque am Miranda-Fluss, beliebt für Tierbeobachtung und Angeln." } },
  { id: "morro-do-azeite", kind: "natureza", icon: "montanha", latitude: -19.4833, longitude: -57.3167, radiusM: 3000, source: W("Q22047959"),
    name: { pt: "Morro do Azeite", en: "Morro do Azeite", es: "Morro do Azeite", de: "Morro do Azeite" },
    about: { pt: "Morro isolado no meio da planície, na região da Estrada Parque Pantanal, em Corumbá.", en: "Isolated hill rising from the plain in the Estrada Parque Pantanal area of Corumbá.", es: "Cerro aislado en medio de la llanura, en la zona de la Estrada Parque Pantanal, en Corumbá.", de: "Einzelner Hügel inmitten der Ebene im Gebiet der Estrada Parque Pantanal bei Corumbá." } },
  { id: "rio-negro", kind: "parque", icon: "arara", latitude: -19.6228, longitude: -56.7083, radiusM: 15000, source: W("Q10345082"),
    name: { pt: "Parque Estadual do Pantanal do Rio Negro", en: "Rio Negro Pantanal State Park", es: "Parque Estatal del Pantanal del Río Negro", de: "Staatspark Pantanal do Rio Negro" },
    about: { pt: "Unidade de conservação de Mato Grosso do Sul no Pantanal do Rio Negro, região de lagoas, cordilheiras e salinas.", en: "Mato Grosso do Sul protected area in the Rio Negro Pantanal, a region of lagoons, forest ridges and salt pans.", es: "Área protegida de Mato Grosso do Sul en el Pantanal del Río Negro, región de lagunas, cordilleras y salinas.", de: "Schutzgebiet in Mato Grosso do Sul im Pantanal do Rio Negro, mit Lagunen, Waldrücken und Salzseen." } },
  { id: "aquidauana", kind: "cidade", city: true, icon: "portal", latitude: -20.4708, longitude: -55.7869, radiusM: 4000, source: "https://pt.wikipedia.org/wiki/Aquidauana",
    name: { pt: "Aquidauana, portal do Pantanal", en: "Aquidauana, Pantanal gateway", es: "Aquidauana, portal del Pantanal", de: "Aquidauana, Tor zum Pantanal" },
    about: { pt: "Cidade sul-mato-grossense conhecida como Portal do Pantanal, ponto de partida para o Pantanal do Rio Negro e do Aquidauana.", en: "Mato Grosso do Sul town known as the Pantanal Gateway, starting point for the Rio Negro and Aquidauana Pantanal.", es: "Ciudad de Mato Grosso do Sul conocida como Portal del Pantanal, punto de partida al Pantanal del Río Negro y del Aquidauana.", de: "Stadt in Mato Grosso do Sul, bekannt als Tor zum Pantanal und Ausgangspunkt für das Pantanal des Rio Negro und Aquidauana." } },
  { id: "porto-murtinho", kind: "cidade", city: true, icon: "canoa", latitude: -21.6989, longitude: -57.8828, radiusM: 4000, source: "https://pt.wikipedia.org/wiki/Porto_Murtinho",
    name: { pt: "Porto Murtinho", en: "Porto Murtinho", es: "Porto Murtinho", de: "Porto Murtinho" },
    about: { pt: "Cidade no extremo sul do Pantanal, às margens do rio Paraguai, na fronteira com o Paraguai.", en: "Town at the southern tip of the Pantanal on the Paraguay River, on the border with Paraguay.", es: "Ciudad en el extremo sur del Pantanal, a orillas del río Paraguay, en la frontera con Paraguay.", de: "Stadt an der Südspitze des Pantanal am Paraguay-Fluss, an der Grenze zu Paraguay." } },
  { id: "corumba", kind: "cidade", city: true, icon: "cidade", latitude: -19.0089, longitude: -57.6528, radiusM: 5000, source: "https://pt.wikipedia.org/wiki/Corumb%C3%A1",
    name: { pt: "Corumbá", en: "Corumbá", es: "Corumbá", de: "Corumbá" },
    about: { pt: "Maior município do Pantanal, às margens do rio Paraguai, na fronteira com a Bolívia.", en: "Largest municipality in the Pantanal, on the Paraguay River at the Bolivian border.", es: "Mayor municipio del Pantanal, a orillas del río Paraguay, en la frontera con Bolivia.", de: "Größte Gemeinde im Pantanal, am Paraguay-Fluss an der Grenze zu Bolivien." } },
  { id: "ladario", kind: "cidade", city: true, icon: "cidade", latitude: -19.005, longitude: -57.6019, radiusM: 5000, source: "https://pt.wikipedia.org/wiki/Lad%C3%A1rio",
    name: { pt: "Ladário", en: "Ladário", es: "Ladário", de: "Ladário" },
    about: { pt: "Cidade vizinha de Corumbá, sede de base da Marinha no rio Paraguai.", en: "Town next to Corumbá, home to a Brazilian Navy base on the Paraguay River.", es: "Ciudad vecina de Corumbá, sede de una base de la Marina en el río Paraguay.", de: "Nachbarstadt von Corumbá mit einem Marinestützpunkt am Paraguay-Fluss." } },
  { id: "miranda", kind: "cidade", city: true, icon: "cidade", latitude: -20.2408, longitude: -56.3778, radiusM: 5000, source: "https://pt.wikipedia.org/wiki/Miranda_(Mato_Grosso_do_Sul)",
    name: { pt: "Miranda", en: "Miranda", es: "Miranda", de: "Miranda" },
    about: { pt: "Município do Pantanal sul às margens do rio Miranda, porta de entrada para fazendas de ecoturismo.", en: "Southern Pantanal town on the Miranda River, gateway to ecotourism ranches.", es: "Municipio del Pantanal sur a orillas del río Miranda, puerta a estancias de ecoturismo.", de: "Stadt im südlichen Pantanal am Miranda-Fluss, Tor zu Ökotourismus-Farmen." } },
  { id: "coxim", kind: "cidade", city: true, icon: "cidade", latitude: -18.5069, longitude: -54.76, radiusM: 5000, source: "https://www.wikidata.org/wiki/Q1793013",
    name: { pt: "Coxim", en: "Coxim", es: "Coxim", de: "Coxim" },
    about: { pt: "Município na borda leste do Pantanal, junto ao rio Taquari.", en: "Town on the eastern edge of the Pantanal, by the Taquari River.", es: "Municipio en el borde este del Pantanal, junto al río Taquari.", de: "Stadt am Ostrand des Pantanal am Taquari-Fluss." } },
  { id: "rio-verde-mt", kind: "cidade", city: true, icon: "cidade", latitude: -18.9178, longitude: -54.8439, radiusM: 5000, source: "https://pt.wikipedia.org/wiki/Rio_Verde_de_Mato_Grosso",
    name: { pt: "Rio Verde de Mato Grosso", en: "Rio Verde de Mato Grosso", es: "Rio Verde de Mato Grosso", de: "Rio Verde de Mato Grosso" },
    about: { pt: "Município sul-mato-grossense com parte do território no Pantanal, conhecido por cachoeiras.", en: "Mato Grosso do Sul town partly within the Pantanal, known for waterfalls.", es: "Municipio de Mato Grosso do Sul con parte en el Pantanal, conocido por sus cascadas.", de: "Gemeinde in Mato Grosso do Sul, teils im Pantanal, bekannt für Wasserfälle." } },
  { id: "sonora", kind: "cidade", city: true, icon: "cidade", latitude: -17.5769, longitude: -54.7578, radiusM: 5000, source: "https://pt.wikipedia.org/wiki/Sonora_(Mato_Grosso_do_Sul)",
    name: { pt: "Sonora", en: "Sonora", es: "Sonora", de: "Sonora" },
    about: { pt: "Município no norte de Mato Grosso do Sul com área no Pantanal.", en: "Town in northern Mato Grosso do Sul with land in the Pantanal.", es: "Municipio del norte de Mato Grosso do Sul con área en el Pantanal.", de: "Gemeinde im Norden von Mato Grosso do Sul mit Flächen im Pantanal." } },
  { id: "bodoquena", kind: "cidade", city: true, icon: "cidade", latitude: -20.5389, longitude: -56.715, radiusM: 5000, source: "https://pt.wikipedia.org/wiki/Bodoquena",
    name: { pt: "Bodoquena", en: "Bodoquena", es: "Bodoquena", de: "Bodoquena" },
    about: { pt: "Município entre a Serra da Bodoquena e a planície do Pantanal.", en: "Town between the Bodoquena range and the Pantanal plain.", es: "Municipio entre la Sierra de Bodoquena y la llanura del Pantanal.", de: "Gemeinde zwischen der Serra da Bodoquena und der Pantanal-Ebene." } },
  { id: "barao-de-melgaco", kind: "cidade", city: true, icon: "cidade", latitude: -16.1953, longitude: -55.9678, radiusM: 5000, source: "https://pt.wikipedia.org/wiki/Bar%C3%A3o_de_Melga%C3%A7o",
    name: { pt: "Barão de Melgaço", en: "Barão de Melgaço", es: "Barão de Melgaço", de: "Barão de Melgaço" },
    about: { pt: "Cidade ribeirinha às margens do rio Cuiabá, no Pantanal norte.", en: "Riverside town on the Cuiabá River in the northern Pantanal.", es: "Ciudad ribereña a orillas del río Cuiabá, en el Pantanal norte.", de: "Flussstadt am Cuiabá im nördlichen Pantanal." } },
  { id: "leverger", kind: "cidade", city: true, icon: "cidade", latitude: -15.8658, longitude: -56.0769, radiusM: 5000, source: "https://pt.wikipedia.org/wiki/Santo_Ant%C3%B4nio_de_Leverger",
    name: { pt: "Santo Antônio de Leverger", en: "Santo Antônio de Leverger", es: "Santo Antônio de Leverger", de: "Santo Antônio de Leverger" },
    about: { pt: "Município às margens do rio Cuiabá, perto da capital, com grande área de Pantanal.", en: "Town on the Cuiabá River near the state capital, with a large Pantanal area.", es: "Municipio a orillas del río Cuiabá, cerca de la capital, con gran área de Pantanal.", de: "Gemeinde am Cuiabá nahe der Hauptstadt mit großem Pantanal-Anteil." } },
  { id: "livramento", kind: "cidade", city: true, icon: "cidade", latitude: -15.775, longitude: -56.3458, radiusM: 5000, source: "https://pt.wikipedia.org/wiki/Nossa_Senhora_do_Livramento_(Mato_Grosso)",
    name: { pt: "Nossa Senhora do Livramento", en: "Nossa Senhora do Livramento", es: "Nossa Senhora do Livramento", de: "Nossa Senhora do Livramento" },
    about: { pt: "Município histórico de Mato Grosso com parte do território no Pantanal.", en: "Historic Mato Grosso town partly within the Pantanal.", es: "Municipio histórico de Mato Grosso con parte de su territorio en el Pantanal.", de: "Historische Gemeinde in Mato Grosso, teils im Pantanal." } },
  { id: "itiquira", kind: "cidade", city: true, icon: "cidade", latitude: -17.2089, longitude: -54.15, radiusM: 5000, source: "https://pt.wikipedia.org/wiki/Itiquira",
    name: { pt: "Itiquira", en: "Itiquira", es: "Itiquira", de: "Itiquira" },
    about: { pt: "Município no sul de Mato Grosso com parte do território no Pantanal.", en: "Town in southern Mato Grosso partly within the Pantanal.", es: "Municipio del sur de Mato Grosso con parte en el Pantanal.", de: "Gemeinde im Süden von Mato Grosso, teils im Pantanal." } },
  { id: "lambari-doeste", kind: "cidade", city: true, icon: "cidade", latitude: -15.3228, longitude: -58.0039, radiusM: 5000, source: "https://pt.wikipedia.org/wiki/Lambari_d%27Oeste",
    name: { pt: "Lambari d'Oeste", en: "Lambari d'Oeste", es: "Lambari d'Oeste", de: "Lambari d'Oeste" },
    about: { pt: "Município do oeste de Mato Grosso com área no Pantanal de Cáceres.", en: "Western Mato Grosso town with land in the Cáceres Pantanal.", es: "Municipio del oeste de Mato Grosso con área en el Pantanal de Cáceres.", de: "Gemeinde im Westen von Mato Grosso mit Flächen im Pantanal von Cáceres." } },
  { id: "urucum", kind: "natureza", icon: "montanha", latitude: -19.2, longitude: -57.6, radiusM: 6000, source: "https://www.wikidata.org/wiki/Q6724175",
    name: { pt: "Maciço do Urucum", en: "Urucum Massif", es: "Macizo del Urucum", de: "Urucum-Massiv" },
    about: { pt: "Conjunto de morros na zona rural de Corumbá, o ponto mais alto do Pantanal, rico em minério de ferro e manganês.", en: "Group of hills in rural Corumbá, the highest point of the Pantanal, rich in iron and manganese ore.", es: "Conjunto de cerros en la zona rural de Corumbá, el punto más alto del Pantanal, rico en hierro y manganeso.", de: "Hügelgruppe bei Corumbá, höchster Punkt des Pantanal, reich an Eisen- und Manganerz." } },
  { id: "mandiore", kind: "natureza", icon: "ilha", latitude: -18.1333, longitude: -57.55, radiusM: 8000, source: "https://www.wikidata.org/wiki/Q3176332",
    name: { pt: "Lagoa Mandioré", en: "Mandioré Lake", es: "Laguna Mandioré", de: "Mandioré-See" },
    about: { pt: "Grande lagoa na fronteira entre Brasil e Bolívia, ligada ao rio Paraguai.", en: "Large lake on the Brazil–Bolivia border, linked to the Paraguay River.", es: "Gran laguna en la frontera entre Brasil y Bolivia, unida al río Paraguay.", de: "Großer See an der Grenze Brasilien–Bolivien, mit dem Paraguay-Fluss verbunden." } },
  { id: "abobral", kind: "natureza", icon: "jacare", latitude: -19.317, longitude: -57.2586, radiusM: 6000, source: "https://www.wikidata.org/wiki/Q4668201",
    name: { pt: "Rio Abobral", en: "Abobral River", es: "Río Abobral", de: "Abobral-Fluss" },
    about: { pt: "Rio da região do Abobral, cortado pela Estrada Parque, área muito procurada para ver jacarés e aves.", en: "River in the Abobral region crossed by the Estrada Parque, popular for watching caimans and birds.", es: "Río de la región del Abobral, cruzado por la Estrada Parque, muy buscado para ver yacarés y aves.", de: "Fluss in der Abobral-Region an der Estrada Parque, beliebt zur Kaiman- und Vogelbeobachtung." } },
  { id: "nhecolandia", kind: "natureza", icon: "cavalo", latitude: -19.25, longitude: -57.0232, radiusM: 15000, source: "https://pt.wikipedia.org/wiki/Nhecol%C3%A2ndia",
    name: { pt: "Nhecolândia", en: "Nhecolândia", es: "Nhecolândia", de: "Nhecolândia" },
    about: { pt: "Sub-região do Pantanal famosa pelas milhares de lagoas, salinas e pela criação de gado pantaneiro.", en: "Pantanal sub-region famous for thousands of lagoons, salt lakes and traditional cattle ranching.", es: "Subregión del Pantanal famosa por miles de lagunas, salinas y la ganadería pantanera.", de: "Teilregion des Pantanal, berühmt für Tausende Lagunen, Salzseen und traditionelle Rinderzucht." } },
  { id: "paiaguas", kind: "natureza", icon: "capim", latitude: -18.4472, longitude: -57.0408, radiusM: 15000, source: "https://www.wikidata.org/wiki/Q10343579",
    name: { pt: "Paiaguás", en: "Paiaguás", es: "Paiaguás", de: "Paiaguás" },
    about: { pt: "Sub-região do Pantanal em Corumbá, entre os rios Taquari e Paraguai, de grandes campos alagáveis.", en: "Pantanal sub-region in Corumbá between the Taquari and Paraguay rivers, with vast floodable fields.", es: "Subregión del Pantanal en Corumbá, entre los ríos Taquari y Paraguay, con grandes campos inundables.", de: "Teilregion des Pantanal bei Corumbá zwischen Taquari und Paraguay mit weiten Überschwemmungsflächen." } },
];

export const PANTANAL_CITIES = TOURIST_SPOTS.filter((s) => s.city);

export const EXPLORER_TIERS = [
  { id: "bronze", need: 3, icon: "medalha", tone: "#C98A55" },
  { id: "prata", need: 12, icon: "medalha", tone: "#C9CED6" },
  { id: "ouro", need: TOURIST_SPOTS.length, icon: "medalha", tone: "#FFC400" },
] as const;

/** Distância em metros entre dois pontos (haversine). */
export function distanceMeters(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const R = 6371000, rad = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * rad, dLon = (b.longitude - a.longitude) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.latitude * rad) * Math.cos(b.latitude * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export type CheckInResult = { ok: true; distance: number } | { ok: false; reason: "far" | "accuracy"; distance: number };

/** Check-in só vale dentro do raio do ponto e com GPS razoavelmente preciso (até 200 m). */
export function checkIn(spot: TouristSpot, position: { latitude: number; longitude: number; accuracy?: number | null }): CheckInResult {
  const distance = distanceMeters(spot, position);
  if (position.accuracy != null && position.accuracy > 200) return { ok: false, reason: "accuracy", distance };
  if (distance > spot.radiusM) return { ok: false, reason: "far", distance };
  return { ok: true, distance };
}

/** Visitas: id do ponto -> data ISO do primeiro check-in. Ficam só no aparelho. */
export type SpotVisits = Record<string, string>;
const KEY = "pantanal-dex:tourist-visits:v1";
const known = new Set(TOURIST_SPOTS.map((s) => s.id));

/**
 * Limpa as visitas lidas do armazenamento: mantém só pontos conhecidos com data válida.
 * @param raw Valor bruto vindo do AsyncStorage.
 */
export function sanitizeVisits(raw: unknown): SpotVisits {
  if (!raw || typeof raw !== "object") return {};
  const out: SpotVisits = {};
  for (const [id, at] of Object.entries(raw as Record<string, unknown>)) {
    if (known.has(id) && typeof at === "string" && !Number.isNaN(Date.parse(at))) out[id] = at;
  }
  return out;
}

/**
 * Carrega as visitas (check-ins) salvas no aparelho.
 */
export async function loadVisits(): Promise<SpotVisits> {
  try { return sanitizeVisits(JSON.parse((await AsyncStorage.getItem(KEY)) ?? "{}")); } catch { return {}; }
}

/**
 * Registra o check-in em um ponto e devolve o conjunto atualizado de visitas.
 * @param id Identificador do ponto turístico.
 * @param at Momento do check-in (padrão: agora).
 */
export async function saveVisit(id: string, at = new Date()): Promise<SpotVisits> {
  const visits = await loadVisits();
  if (known.has(id) && !visits[id]) visits[id] = at.toISOString();
  try { await AsyncStorage.setItem(KEY, JSON.stringify(visits)); } catch { /* fica para a próxima */ }
  return visits;
}

export type ExplorerProgress = { visited: number; total: number; tier: (typeof EXPLORER_TIERS)[number] | null; next: (typeof EXPLORER_TIERS)[number] | null; cities: number; citiesTotal: number; allCities: boolean };

/**
 * Calcula o progresso de Explorador do Pantanal: lugares e cidades visitados, nível atual e próximo nível.
 */
export function explorerProgress(visits: SpotVisits): ExplorerProgress {
  const visited = Object.keys(sanitizeVisits(visits)).length;
  const reached = EXPLORER_TIERS.filter((t) => visited >= t.need);
  const clean = sanitizeVisits(visits);
  const cities = PANTANAL_CITIES.filter((c) => clean[c.id]).length;
  return { visited, total: TOURIST_SPOTS.length, tier: reached[reached.length - 1] ?? null, next: EXPLORER_TIERS.find((t) => visited < t.need) ?? null, cities, citiesTotal: PANTANAL_CITIES.length, allCities: cities === PANTANAL_CITIES.length };
}
