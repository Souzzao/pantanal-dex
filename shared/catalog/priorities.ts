import type { Species } from "../pantanal";

export type ReviewPriority = "P1" | "P2";
export type PriorityReviewArea = "taxonomy" | "occurrence" | "licenses" | "conservation" | "editorial";

export type CatalogPriority = {
  priority: ReviewPriority;
  commonName: string;
  scientificName?: string;
  speciesId: string | null;
  groups: Species["group"][];
  environments: Species["environments"];
  rationale: string;
  reviewAreas: PriorityReviewArea[];
  sourceUrl: string;
};

const taxonSource = (scientificName: string) => `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}`;
const p1 = (commonName: string, scientificName: string, speciesId: string | null, groups: Species["group"][], environments: Species["environments"], rationale: string): CatalogPriority => ({ priority: "P1", commonName, scientificName, speciesId, groups, environments, rationale, reviewAreas: ["taxonomy", "occurrence", "licenses", "conservation", "editorial"], sourceUrl: taxonSource(scientificName) });
const p2 = (commonName: string, scientificName: string, speciesId: string, groups: Species["group"][], environments: Species["environments"], rationale: string): CatalogPriority => ({ priority: "P2", commonName, scientificName, speciesId, groups, environments, rationale, reviewAreas: ["taxonomy", "occurrence", "licenses", "editorial"], sourceUrl: taxonSource(scientificName) });

/**
 * P1 reproduz o núcleo de campo definido pelo pacote MVP. Espécies sem registro
 * atual permanecem explícitas como speciesId=null e não podem ser promovidas; entradas
 * validadas devem apontar para o ID modular correspondente.
 */
export const catalogP1Priorities: readonly CatalogPriority[] = [
  p1("Onça-pintada", "Panthera onca", "onca-pintada", ["Mamíferos"], ["Matas", "Bordas de mata"], "Espécie emblemática e predador de referência do Pantanal."),
  p1("Capivara", "Hydrochoerus hydrochaeris", "capivara", ["Mamíferos"], ["Áreas alagadas", "Rios e corixos"], "Espécie abundante e diretamente associada a ambientes aquáticos."),
  p1("Anta", "Tapirus terrestris", "anta", ["Mamíferos"], ["Matas", "Rios e corixos"], "Grande herbívoro e dispersor de sementes prioritário."),
  p1("Tamanduá-bandeira", "Myrmecophaga tridactyla", "tamandua-bandeira", ["Mamíferos"], ["Campos", "Bordas de mata"], "Mamífero emblemático com necessidade de auditoria de ocorrência e conservação."),
  p1("Queixada", "Tayassu pecari", "queixada", ["Mamíferos"], ["Matas"], "Herbívoro social e indicador de conectividade florestal."),
  p1("Lobo-guará", "Chrysocyon brachyurus", "lobo-guara", ["Mamíferos"], ["Campos", "Bordas de mata"], "Espécie emblemática de áreas abertas."),
  p1("Veado-campeiro", "Ozotoceros bezoarticus", "veado-campeiro", ["Mamíferos"], ["Campos"], "Espécie campestre P1 validada taxonomicamente e regionalmente no passo 27."),
  p1("Tuiuiú", "Jabiru mycteria", "tuiuiu", ["Aves"], ["Áreas alagadas", "Rios e corixos"], "Símbolo do Pantanal e espécie de referência para áreas alagadas."),
  p1("Arara-azul", "Anodorhynchus hyacinthinus", "arara-azul", ["Aves"], ["Matas", "Bordas de mata"], "Espécie emblemática e prioritária para revisão de conservação."),
  p1("Arara-canindé", "Ara ararauna", "arara-caninde", ["Aves"], ["Matas", "Bordas de mata"], "Espécie P1 validada taxonomicamente e regionalmente no passo 28."),
  p1("Tucano-toco", "Ramphastos toco", "tucano-toco", ["Aves"], ["Matas", "Bordas de mata"], "Espécie P1 validada taxonomicamente e regionalmente no passo 29."),
  p1("Seriema", "Cariama cristata", "seriema", ["Aves"], ["Campos", "Bordas de mata"], "Ave terrestre emblemática de áreas abertas."),
  p1("Anhuma", "Anhima cornuta", "anhuma", ["Aves"], ["Áreas alagadas", "Rios e corixos"], "Ave de referência para áreas úmidas e campos alagáveis."),
  p1("Garça-branca", "Ardea alba", "garca-branca", ["Aves"], ["Áreas alagadas", "Rios e corixos"], "Indicadora visual de ambientes aquáticos rasos."),
  p1("Colhereiro", "Platalea ajaja", "colhereiro", ["Aves"], ["Áreas alagadas"], "Ave aquática prioritária para revisão de ocorrência e imagens."),
  p1("Jacaré-do-Pantanal", "Caiman yacare", "jacare-do-pantanal", ["Répteis"], ["Áreas alagadas", "Rios e corixos"], "Réptil emblemático e predador de ambientes aquáticos."),
  p1("Sucuri-verde", "Eunectes murinus", "sucuri-verde", ["Répteis"], ["Áreas alagadas", "Rios e corixos"], "Grande predador associado a corpos d'água."),
  p1("Teiú", "Salvator merianae", "teiu", ["Répteis"], ["Campos", "Bordas de mata"], "Réptil generalista de ampla interação trófica."),
  p1("Sapo-cururu", "Rhinella diptycha", "sapo-cururu", ["Anfíbios"], ["Campos", "Bordas de mata"], "Anfíbio comum e sensível a alterações ambientais."),
  p1("Rã-pimenta", "Leptodactylus labyrinthicus", "ra-pimenta", ["Anfíbios"], ["Áreas alagadas", "Campos"], "Anfíbio de referência para ambientes úmidos."),
  p1("Dourado", "Salminus brasiliensis", "salminus-brasiliensis", ["Peixes"], ["Rios e corixos"], "Predador e migrador de referência dos rios."),
  p1("Pacu", "Piaractus mesopotamicus", "pacu", ["Peixes"], ["Rios e corixos", "Áreas alagadas"], "Peixe frugívoro associado ao pulso de inundação."),
  p1("Piraputanga", "Brycon hilarii", "piraputanga", ["Peixes"], ["Rios e corixos", "Matas"], "Peixe associado à mata ciliar e dispersão de sementes."),
  p1("Cachara", "Pseudoplatystoma reticulatum", "pseudoplatystoma-reticulatum", ["Peixes"], ["Rios e corixos", "Áreas alagadas"], "Grande bagre de importância ecológica e regional."),
  p1("Jaú", "Zungaro jahu", "zungaro-jahu", ["Peixes"], ["Rios e corixos"], "Espécie P1 validada taxonomicamente e regionalmente no passo 30; a categoria normativa brasileira permanece pendente."),
  p1("Abelha-jataí", "Tetragonisca angustula", "tetragonisca-angustula", ["Invertebrados"], ["Matas", "Bordas de mata"], "Polinizador social de relevância ecológica."),
  p1("Formiga-cortadeira", "Atta sexdens", "atta-sexdens", ["Invertebrados"], ["Campos", "Matas"], "Engenheira de ecossistema e espécie de referência do solo."),
  p1("Aranha-armadeira", "Phoneutria nigriventer", "phoneutria-nigriventer", ["Invertebrados"], ["Matas", "Bordas de mata"], "Espécie P1 validada taxonomicamente e regionalmente no passo 31; a categoria normativa brasileira permanece pendente."),
];

/** P2 amplia a auditoria com cobertura equilibrada dos grupos e ambientes já cadastrados. */
export const catalogP2Priorities: readonly CatalogPriority[] = [
  p2("Cateto", "Pecari tajacu", "cateto", ["Mamíferos"], ["Matas", "Bordas de mata"], "Mamífero modular para completar a cobertura P2 de grupos."),
  p2("Dança-ninfas", "Heliconius erato", "heliconius-erato", ["Invertebrados"], ["Matas", "Bordas de mata"], "Invertebrado modular para balancear a auditoria de P1."),
  p2("Garça-branca-pequena", "Egretta thula", "egretta-thula", ["Aves"], ["Áreas alagadas"], "Ave aquática modular para ampliar cobertura de áreas alagadas."),
  p2("Tucanuçu-de-garganta-azul", "Megaceryle torquata", "megaceryle-torquata", ["Aves"], ["Rios e corixos", "Áreas alagadas"], "Ave ribeirinha modular para cobertura complementar."),
  p2("Curimbatá", "Prochilodus lineatus", "prochilodus-lineatus", ["Peixes"], ["Rios e corixos", "Áreas alagadas"], "Peixe detritívoro migrador já presente no catálogo, sem criar um nome ou ID sintético de lote."),
  p2("Traíra", "Hoplias malabaricus", "hoplias-malabaricus", ["Peixes"], ["Rios e corixos", "Áreas alagadas"], "Peixe predador de água doce já presente no catálogo, selecionado sem criar um nome ou ID sintético de lote."),
  p2("Pintada-do-sul", "Vanessa myrinna", "vanessa-myrinna", ["Invertebrados"], ["Campos", "Bordas de mata"], "Invertebrado modular para completar a matriz."),
  p2("Mandi", "Pimelodus maculatus", "pimelodus-maculatus", ["Peixes"], ["Rios e corixos", "Áreas alagadas"], "Revisão cruzada de peixe modular com forte valor de campo."),
  p2("Bem-te-vi", "Pitangus sulphuratus", "pitangus-sulphuratus", ["Aves"], ["Campos", "Bordas de mata"], "Revisão cruzada de ave modular em ambientes abertos."),
  p2("Cobra-cipó", "Oxybelis aeneus", "cobra-cipo", ["Répteis"], ["Matas", "Bordas de mata"], "Revisão cruzada de réptil modular arborícola."),
  p2("Perereca-do-banheiro", "Boana albopunctata", "perereca-do-banheiro", ["Anfíbios"], ["Áreas alagadas", "Bordas de mata"], "Revisão cruzada de anfíbio modular em área antropizada."),
  p2("Piava", "Leporinus obtusidens", "leporinus-obtusidens", ["Peixes"], ["Rios e corixos", "Áreas alagadas"], "Revisão cruzada da relação peixe–mata ciliar."),
  p2("Mamangava-de-chão", "Bombus pauloensis", "bombus-pauloensis", ["Invertebrados"], ["Campos", "Bordas de mata"], "Revisão cruzada de polinizador modular em borda."),
];

export const catalogPriorityMatrix: readonly CatalogPriority[] = [...catalogP1Priorities, ...catalogP2Priorities];

export function validateCatalogPriorities(priorities: readonly CatalogPriority[] = catalogPriorityMatrix, catalog: readonly Species[] = []): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const taxa = new Set<string>();
  for (const priority of priorities) {
    const scientificName = priority.scientificName?.trim() ?? "";
    const label = priority.speciesId ?? scientificName;
    if (!priority.commonName.trim() || !scientificName || !priority.rationale.trim()) errors.push(`${label}: seleção prioritária incompleta`);
    if (!/^https:\/\/api\.gbif\.org\/v1\/species\/match\?name=/.test(priority.sourceUrl)) errors.push(`${label}: fonte taxonômica GBIF inválida`);
    if (priority.speciesId !== null) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(priority.speciesId)) errors.push(`${priority.speciesId}: ID prioritário inválido`);
      if (ids.has(priority.speciesId)) errors.push(`${priority.speciesId}: ID prioritário duplicado`);
      ids.add(priority.speciesId);
      const record = catalog.find((item) => item.id === priority.speciesId);
      if (catalog.length && !record) errors.push(`${priority.speciesId}: ID prioritário ausente no catálogo`);
      if (record && scientificName && record.scientificName !== scientificName) errors.push(`${priority.speciesId}: nome científico diverge do catálogo`);
      if (record && (record.group !== priority.groups[0] || priority.environments.some((environment) => !record.environments.includes(environment)))) errors.push(`${priority.speciesId}: grupo ou ambiente diverge do catálogo`);
    }
    const taxonKey = scientificName.toLowerCase();
    if (taxa.has(taxonKey)) errors.push(`${priority.scientificName}: táxon prioritário duplicado`);
    taxa.add(taxonKey);
  }
  return errors;
}
