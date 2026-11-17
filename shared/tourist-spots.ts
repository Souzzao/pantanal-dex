import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Pontos turísticos do Pantanal no mapa (no estilo "Pokéstop"): chegando perto com o GPS,
 * a pessoa faz check-in e ganha a insígnia do lugar. Coordenadas do Wikidata (fonte em cada ponto).
 * O raio é a distância máxima para o check-in valer: maior em parques extensos, menor em monumentos.
 */
export type SpotKind = "parque" | "estrada" | "historico" | "cidade" | "natureza";
type L4 = { pt: string; en: string; es: string; de: string };
export type TouristSpot = { id: string; name: L4; about: L4; kind: SpotKind; latitude: number; longitude: number; radiusM: number; icon: string; source: string };

const W = (q: string) => `https://www.wikidata.org/wiki/${q}`;

export const TOURIST_SPOTS: TouristSpot[] = [
  { id: "pocone", kind: "cidade", icon: "🛣️", latitude: -16.2569, longitude: -56.6228, radiusM: 4000, source: "https://pt.wikipedia.org/wiki/Pocon%C3%A9",
    name: { pt: "Poconé, porta da Transpantaneira", en: "Poconé, gateway to the Transpantaneira", es: "Poconé, puerta de la Transpantaneira", de: "Poconé, Tor zur Transpantaneira" },
    about: { pt: "Cidade de onde sai a Transpantaneira (MT-060), a estrada de terra que corta o Pantanal norte rumo a Porto Jofre.", en: "Town where the Transpantaneira (MT-060) begins, the dirt road crossing the northern Pantanal to Porto Jofre.", es: "Ciudad donde empieza la Transpantaneira (MT-060), el camino de tierra que cruza el Pantanal norte hasta Porto Jofre.", de: "Stadt am Beginn der Transpantaneira (MT-060), der Schotterstraße durch das nördliche Pantanal bis Porto Jofre." } },
  { id: "transpantaneira", kind: "estrada", icon: "🌉", latitude: -16.8174, longitude: -56.8454, radiusM: 6000, source: W("Q7834764"),
    name: { pt: "Transpantaneira (MT-060)", en: "Transpantaneira (MT-060)", es: "Transpantaneira (MT-060)", de: "Transpantaneira (MT-060)" },
    about: { pt: "Estrada com mais de cem pontes de madeira; nas margens alagadas é comum ver jacarés, tuiuiús e capivaras.", en: "Road with over a hundred wooden bridges; caimans, jabirus and capybaras are common along its flooded edges.", es: "Camino con más de cien puentes de madera; en sus orillas inundadas es común ver yacarés, tuyuyús y carpinchos.", de: "Straße mit über hundert Holzbrücken; an den überfluteten Rändern sieht man oft Kaimane, Jabirus und Capybaras." } },
  { id: "porto-jofre", kind: "natureza", icon: "🐆", latitude: -17.3333, longitude: -56.8, radiusM: 4000, source: W("Q1637633"),
    name: { pt: "Porto Jofre", en: "Porto Jofre", es: "Porto Jofre", de: "Porto Jofre" },
    about: { pt: "Fim da Transpantaneira, às margens do rio Cuiabá. Ponto de saída dos barcos para observar onças-pintadas.", en: "End of the Transpantaneira on the Cuiabá River. Boats leave from here to watch jaguars.", es: "Fin de la Transpantaneira, a orillas del río Cuiabá. De aquí salen los barcos para ver jaguares.", de: "Ende der Transpantaneira am Cuiabá-Fluss. Von hier fahren Boote zur Jaguarbeobachtung." } },
  { id: "encontro-das-aguas", kind: "parque", icon: "🌊", latitude: -17.12, longitude: -56.69, radiusM: 15000, source: W("Q10344991"),
    name: { pt: "Parque Estadual Encontro das Águas", en: "Encontro das Águas State Park", es: "Parque Estatal Encontro das Águas", de: "Staatspark Encontro das Águas" },
    about: { pt: "Unidade de conservação de Mato Grosso no encontro dos rios Cuiabá e São Lourenço, uma das áreas com mais onças-pintadas do mundo.", en: "Mato Grosso protected area where the Cuiabá and São Lourenço rivers meet, one of the world's densest jaguar areas.", es: "Área protegida de Mato Grosso donde se unen los ríos Cuiabá y São Lourenço, una de las zonas con más jaguares del mundo.", de: "Schutzgebiet in Mato Grosso am Zusammenfluss von Cuiabá und São Lourenço, eines der jaguarreichsten Gebiete der Welt." } },
  { id: "sesc-pantanal", kind: "parque", icon: "🌳", latitude: -16.6667, longitude: -56.25, radiusM: 15000, source: W("Q96740014"),
    name: { pt: "RPPN Sesc Pantanal", en: "Sesc Pantanal Private Reserve", es: "Reserva privada Sesc Pantanal", de: "Privatreservat Sesc Pantanal" },
    about: { pt: "Reserva Particular do Patrimônio Natural criada em 1997 em Barão de Melgaço, a maior RPPN do Brasil.", en: "Private natural heritage reserve created in 1997 in Barão de Melgaço, the largest of its kind in Brazil.", es: "Reserva privada del patrimonio natural creada en 1997 en Barão de Melgaço, la mayor de su tipo en Brasil.", de: "1997 gegründetes privates Naturerbe-Reservat in Barão de Melgaço, das größte seiner Art in Brasilien." } },
  { id: "chacorore", kind: "natureza", icon: "🦆", latitude: -16.3, longitude: -55.9333, radiusM: 6000, source: W("Q22046016"),
    name: { pt: "Baía de Chacororé", en: "Chacororé Bay", es: "Bahía de Chacororé", de: "Chacororé-Bucht" },
    about: { pt: "Grande lagoa ligada ao rio Cuiabá, perto de Barão de Melgaço, conhecida pela pesca e pelas aves aquáticas.", en: "Large lagoon linked to the Cuiabá River near Barão de Melgaço, known for fishing and waterbirds.", es: "Gran laguna unida al río Cuiabá cerca de Barão de Melgaço, conocida por la pesca y las aves acuáticas.", de: "Große Lagune am Cuiabá-Fluss bei Barão de Melgaço, bekannt für Fischfang und Wasservögel." } },
  { id: "caceres", kind: "cidade", icon: "🎣", latitude: -16.0711, longitude: -57.6789, radiusM: 4000, source: "https://pt.wikipedia.org/wiki/C%C3%A1ceres_(Mato_Grosso)",
    name: { pt: "Cáceres e o rio Paraguai", en: "Cáceres and the Paraguay River", es: "Cáceres y el río Paraguay", de: "Cáceres und der Paraguay-Fluss" },
    about: { pt: "Cidade histórica às margens do rio Paraguai, porta de entrada do Pantanal pelo oeste de Mato Grosso.", en: "Historic town on the Paraguay River, a western gateway to the Mato Grosso Pantanal.", es: "Ciudad histórica a orillas del río Paraguay, puerta de entrada al Pantanal por el oeste de Mato Grosso.", de: "Historische Stadt am Paraguay-Fluss, westliches Tor zum Pantanal von Mato Grosso." } },
  { id: "taiama", kind: "parque", icon: "🐟", latitude: -16.853, longitude: -57.505, radiusM: 10000, source: W("Q7675867"),
    name: { pt: "Estação Ecológica de Taiamã", en: "Taiamã Ecological Station", es: "Estación Ecológica de Taiamã", de: "Ökologische Station Taiamã" },
    about: { pt: "Ilha fluvial no rio Paraguai protegida pelo governo federal, entre Cáceres e Poconé; visita só com autorização.", en: "Federally protected river island on the Paraguay River between Cáceres and Poconé; visits need permission.", es: "Isla fluvial en el río Paraguay protegida por el gobierno federal, entre Cáceres y Poconé; visitas solo con permiso.", de: "Bundesweit geschützte Flussinsel im Paraguay zwischen Cáceres und Poconé; Besuch nur mit Genehmigung." } },
  { id: "parna-pantanal", kind: "parque", icon: "🏞️", latitude: -17.65, longitude: -57.4333, radiusM: 20000, source: W("Q3179800"),
    name: { pt: "Parque Nacional do Pantanal Matogrossense", en: "Pantanal Matogrossense National Park", es: "Parque Nacional del Pantanal Matogrossense", de: "Nationalpark Pantanal Matogrossense" },
    about: { pt: "Parque nacional no encontro dos rios Paraguai e Cuiabá, parte do Sítio do Patrimônio Mundial da UNESCO no Pantanal.", en: "National park where the Paraguay and Cuiabá rivers meet, part of the Pantanal UNESCO World Heritage Site.", es: "Parque nacional donde se unen los ríos Paraguay y Cuiabá, parte del sitio Patrimonio Mundial de la UNESCO en el Pantanal.", de: "Nationalpark am Zusammenfluss von Paraguay und Cuiabá, Teil des UNESCO-Welterbes Pantanal." } },
  { id: "guira", kind: "parque", icon: "🌿", latitude: -17.3607, longitude: -57.8842, radiusM: 15000, source: W("Q10344997"),
    name: { pt: "Parque Estadual do Guirá", en: "Guirá State Park", es: "Parque Estatal del Guirá", de: "Staatspark Guirá" },
    about: { pt: "Unidade de conservação de Mato Grosso no Pantanal de Cáceres, junto à fronteira com a Bolívia.", en: "Mato Grosso protected area in the Cáceres Pantanal, next to the Bolivian border.", es: "Área protegida de Mato Grosso en el Pantanal de Cáceres, junto a la frontera con Bolivia.", de: "Schutzgebiet von Mato Grosso im Pantanal von Cáceres an der Grenze zu Bolivien." } },
  { id: "cristo-rei", kind: "historico", icon: "⛪", latitude: -19.0189, longitude: -57.6404, radiusM: 500, source: W("Q130286908"),
    name: { pt: "Cristo Rei do Pantanal", en: "Christ the King of the Pantanal", es: "Cristo Rey del Pantanal", de: "Christkönig des Pantanal" },
    about: { pt: "Estátua no Mirante Izulina Xavier, em Corumbá, com vista para o rio Paraguai e a planície alagável.", en: "Statue at the Izulina Xavier lookout in Corumbá, overlooking the Paraguay River and the floodplain.", es: "Estatua en el Mirador Izulina Xavier, en Corumbá, con vista al río Paraguay y la llanura inundable.", de: "Statue am Aussichtspunkt Izulina Xavier in Corumbá mit Blick auf den Paraguay und die Schwemmebene." } },
  { id: "forte-junqueira", kind: "historico", icon: "🏰", latitude: -18.9968, longitude: -57.6365, radiusM: 500, source: W("Q130269872"),
    name: { pt: "Forte Junqueira", en: "Fort Junqueira", es: "Fuerte Junqueira", de: "Fort Junqueira" },
    about: { pt: "Fortificação histórica de Corumbá, bem de interesse histórico e cultural da cidade.", en: "Historic fortification in Corumbá, listed as a site of historic and cultural interest.", es: "Fortificación histórica de Corumbá, bien de interés histórico y cultural de la ciudad.", de: "Historische Festung in Corumbá, als Kulturdenkmal der Stadt eingetragen." } },
  { id: "forte-coimbra", kind: "historico", icon: "⚓", latitude: -19.9203, longitude: -57.7921, radiusM: 3000, source: W("Q18479243"),
    name: { pt: "Forte Coimbra", en: "Fort Coimbra", es: "Fuerte Coimbra", de: "Fort Coimbra" },
    about: { pt: "Distrito de Corumbá às margens do rio Paraguai, onde fica o forte colonial do século XVIII.", en: "District of Corumbá on the Paraguay River, home to the 18th-century colonial fort.", es: "Distrito de Corumbá a orillas del río Paraguay, donde está el fuerte colonial del siglo XVIII.", de: "Bezirk von Corumbá am Paraguay mit der Kolonialfestung aus dem 18. Jahrhundert." } },
  { id: "passo-do-lontra", kind: "natureza", icon: "🦦", latitude: -19.5755, longitude: -57.0373, radiusM: 4000, source: W("Q18481340"),
    name: { pt: "Passo do Lontra", en: "Passo do Lontra", es: "Passo do Lontra", de: "Passo do Lontra" },
    about: { pt: "Área do Pantanal sul-mato-grossense na Estrada Parque, às margens do rio Miranda, procurada para observar fauna e pescar.", en: "Southern Pantanal area on the Estrada Parque by the Miranda River, sought for wildlife watching and fishing.", es: "Zona del Pantanal sur en la Estrada Parque, a orillas del río Miranda, buscada para ver fauna y pescar.", de: "Gebiet im südlichen Pantanal an der Estrada Parque am Miranda-Fluss, beliebt für Tierbeobachtung und Angeln." } },
  { id: "morro-do-azeite", kind: "natureza", icon: "⛰️", latitude: -19.4833, longitude: -57.3167, radiusM: 3000, source: W("Q22047959"),
    name: { pt: "Morro do Azeite", en: "Morro do Azeite", es: "Morro do Azeite", de: "Morro do Azeite" },
    about: { pt: "Morro isolado no meio da planície, na região da Estrada Parque Pantanal, em Corumbá.", en: "Isolated hill rising from the plain in the Estrada Parque Pantanal area of Corumbá.", es: "Cerro aislado en medio de la llanura, en la zona de la Estrada Parque Pantanal, en Corumbá.", de: "Einzelner Hügel inmitten der Ebene im Gebiet der Estrada Parque Pantanal bei Corumbá." } },
  { id: "rio-negro", kind: "parque", icon: "🦜", latitude: -19.6228, longitude: -56.7083, radiusM: 15000, source: W("Q10345082"),
    name: { pt: "Parque Estadual do Pantanal do Rio Negro", en: "Rio Negro Pantanal State Park", es: "Parque Estatal del Pantanal del Río Negro", de: "Staatspark Pantanal do Rio Negro" },
    about: { pt: "Unidade de conservação de Mato Grosso do Sul no Pantanal do Rio Negro, região de lagoas, cordilheiras e salinas.", en: "Mato Grosso do Sul protected area in the Rio Negro Pantanal, a region of lagoons, forest ridges and salt pans.", es: "Área protegida de Mato Grosso do Sul en el Pantanal del Río Negro, región de lagunas, cordilleras y salinas.", de: "Schutzgebiet in Mato Grosso do Sul im Pantanal do Rio Negro, mit Lagunen, Waldrücken und Salzseen." } },
  { id: "aquidauana", kind: "cidade", icon: "🚪", latitude: -20.4708, longitude: -55.7869, radiusM: 4000, source: "https://pt.wikipedia.org/wiki/Aquidauana",
    name: { pt: "Aquidauana, portal do Pantanal", en: "Aquidauana, Pantanal gateway", es: "Aquidauana, portal del Pantanal", de: "Aquidauana, Tor zum Pantanal" },
    about: { pt: "Cidade sul-mato-grossense conhecida como Portal do Pantanal, ponto de partida para o Pantanal do Rio Negro e do Aquidauana.", en: "Mato Grosso do Sul town known as the Pantanal Gateway, starting point for the Rio Negro and Aquidauana Pantanal.", es: "Ciudad de Mato Grosso do Sul conocida como Portal del Pantanal, punto de partida al Pantanal del Río Negro y del Aquidauana.", de: "Stadt in Mato Grosso do Sul, bekannt als Tor zum Pantanal und Ausgangspunkt für das Pantanal des Rio Negro und Aquidauana." } },
  { id: "porto-murtinho", kind: "cidade", icon: "🛶", latitude: -21.6989, longitude: -57.8828, radiusM: 4000, source: "https://pt.wikipedia.org/wiki/Porto_Murtinho",
    name: { pt: "Porto Murtinho", en: "Porto Murtinho", es: "Porto Murtinho", de: "Porto Murtinho" },
    about: { pt: "Cidade no extremo sul do Pantanal, às margens do rio Paraguai, na fronteira com o Paraguai.", en: "Town at the southern tip of the Pantanal on the Paraguay River, on the border with Paraguay.", es: "Ciudad en el extremo sur del Pantanal, a orillas del río Paraguay, en la frontera con Paraguay.", de: "Stadt an der Südspitze des Pantanal am Paraguay-Fluss, an der Grenze zu Paraguay." } },
];

export const EXPLORER_TIERS = [
  { id: "bronze", need: 3, icon: "🥉" },
  { id: "prata", need: 8, icon: "🥈" },
  { id: "ouro", need: TOURIST_SPOTS.length, icon: "🥇" },
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

export function sanitizeVisits(raw: unknown): SpotVisits {
  if (!raw || typeof raw !== "object") return {};
  const out: SpotVisits = {};
  for (const [id, at] of Object.entries(raw as Record<string, unknown>)) {
    if (known.has(id) && typeof at === "string" && !Number.isNaN(Date.parse(at))) out[id] = at;
  }
  return out;
}

export async function loadVisits(): Promise<SpotVisits> {
  try { return sanitizeVisits(JSON.parse((await AsyncStorage.getItem(KEY)) ?? "{}")); } catch { return {}; }
}

export async function saveVisit(id: string, at = new Date()): Promise<SpotVisits> {
  const visits = await loadVisits();
  if (known.has(id) && !visits[id]) visits[id] = at.toISOString();
  try { await AsyncStorage.setItem(KEY, JSON.stringify(visits)); } catch { /* fica para a próxima */ }
  return visits;
}

export type ExplorerProgress = { visited: number; total: number; tier: (typeof EXPLORER_TIERS)[number] | null; next: (typeof EXPLORER_TIERS)[number] | null };

export function explorerProgress(visits: SpotVisits): ExplorerProgress {
  const visited = Object.keys(sanitizeVisits(visits)).length;
  const reached = EXPLORER_TIERS.filter((t) => visited >= t.need);
  return { visited, total: TOURIST_SPOTS.length, tier: reached[reached.length - 1] ?? null, next: EXPLORER_TIERS.find((t) => visited < t.need) ?? null };
}
