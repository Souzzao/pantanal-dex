/**
 * PantanalDex — Consultas ao catálogo: filtros, ordenação, paginação, traços (dieta/IUCN) e área da espécie no mapa (até 3 km).
 *
 * @author Felipe de Souza Aquino
 */
import { environments, groups, species, type Environment, type Species, type SpeciesGroup } from "./pantanal";
import { createCatalogLoader, sortItems, type CatalogLoaderFilters, type CatalogLoaderSort } from "./catalog-loader";
import { catalogLicenseAudit, catalogReview, catalogSpecies } from "./catalog/index";
import { generatedSpecies, retiredSpecies } from "./catalog/generated";
import { SPECIES_ID_ALIASES } from "./species-aliases";
import baseAreas from "./catalog/base-areas.json";
import baseTraits from "./catalog/base-traits.json";
import curatedPhotos from "./catalog/generated/fotos-curadas.json";
export { resolveSpeciesId, SPECIES_ID_ALIASES } from "./species-aliases";
import { getLanguageCode, localizeSpecies } from "./i18n";

export type CatalogFilters = CatalogLoaderFilters;
export type CatalogSort = CatalogLoaderSort;

const areas = baseAreas as Record<string, number>;
const GROUP_AREA_KM: Record<string, number> = { Mamíferos: 1.2, Aves: 0.6, Répteis: 0.6, Anfíbios: 0.3, Peixes: 1.2 };

/** Raio (km) da área desenhada no mapa para a espécie: cada animal tem o seu, pela área de vida típica. */
export function speciesAreaKm(item: Pick<Species, "id" | "group"> & { areaKm?: number }): number {
  return Math.min(item.areaKm ?? areas[item.id] ?? GROUP_AREA_KM[item.group] ?? 0.3, 3);
}

const extraPhotos = curatedPhotos as unknown as Record<string, Species["images"]>;
const MAX_PHOTOS = 6;
/** Fichas escritas à mão: fotos próprias primeiro, completadas com as de uso livre achadas pelo build. */
const withExtraPhotos = (item: Species): Species => {
  const extra = extraPhotos[item.id];
  if (!extra?.length || item.images.length >= MAX_PHOTOS) return item;
  const seen = new Set(item.images.map((image) => image.uri));
  return { ...item, images: [...item.images, ...extra.filter((image) => !seen.has(image.uri))].slice(0, MAX_PHOTOS) };
};
const withoutAliases = (items: Species[]) =>
  items.filter((item) => !(item.id in SPECIES_ID_ALIASES)).map(withExtraPhotos).map((item) => (item.areaKm ? item : { ...item, areaKm: speciesAreaKm(item) }));
/** Mínimo de fotos de uso livre para a espécie aparecer no app (as raras demais saem, mas os avistamentos antigos abrem). */
export const MIN_SPECIES_PHOTOS = 5;
const curated = [...withoutAliases(species), ...withoutAliases(catalogSpecies)];
const curatedRetired = curated.filter((item) => item.images.length < MIN_SPECIES_PHOTOS);
const catalogLoader = createCatalogLoader([curated.filter((item) => item.images.length >= MIN_SPECIES_PHOTOS), generatedSpecies]);

const normalizeQuery = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

type TraitLines = { diet: string; physical: string; status?: string };
const traitsById = baseTraits as unknown as Record<string, Partial<Record<"pt" | "en" | "es" | "de", TraitLines>> & { code?: string }>;
const joinText = (a: string | undefined, b: string) => (!b ? a ?? "" : a?.trim() ? `${a.trim()}\n\n${b}` : b);

/** Fichas escritas à mão ganham, no fim, a dieta medida (EltonTraits/AmphiBIO) e a massa média, com fonte. */
function withTraits(item: Species): Species {
  const row = traitsById[item.id];
  const extra = row?.[getLanguageCode()];
  if (!extra) return row?.code && !item.iucn ? { ...item, iucn: row.code } : item;
  return {
    ...item,
    diet: joinText(item.diet, extra.diet),
    physicalCharacteristics: joinText(item.physicalCharacteristics, extra.physical),
    conservationStatus: item.conservationStatus?.trim() ? item.conservationStatus : extra.status || item.conservationStatus,
    iucn: item.iucn ?? row?.code,
  };
}

/** Catálogo no idioma escolhido. A busca aceita o nome em português, no idioma atual ou o nome científico. */
export function filterSpeciesCatalog(filters: CatalogFilters = {}): Species[] {
  return searchCatalog(filters).map(withTraits);
}

function searchCatalog(filters: CatalogFilters): Species[] {
  if (getLanguageCode() === "pt") return catalogLoader.search(filters);
  const { query, ...rest } = filters;
  const localized = catalogLoader.search(rest).map((item) => localizeSpecies(item));
  const wanted = normalizeQuery(query ?? "");
  if (!wanted) return localized;
  const matchedInPortuguese = new Set(catalogLoader.search(filters).map((item) => item.id));
  return localized.filter((item) => matchedInPortuguese.has(item.id) || normalizeQuery(item.commonName).includes(wanted));
}

/** Ordena a lista inteira (antes passava pela paginação e cortava em 200 espécies). */
export function sortSpeciesCatalog(items: Species[], sort: CatalogSort = "name"): Species[] {
  return sortItems(items, sort);
}

/**
 * Devolve uma página do catálogo (começando em 0).
 * @param pageSize Quantidade de espécies por página.
 */
export function paginateSpeciesCatalog(items: Species[], page: number, pageSize = 60): Species[] {
  const safePage = Number.isInteger(page) && page >= 0 ? page : 0;
  const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? Math.min(pageSize, 200) : 60;
  return items.slice(safePage * safePageSize, (safePage + 1) * safePageSize);
}

let speciesIndex: Map<string, Species> | null = null;
/**
 * Acha a espécie de um avistamento: catálogo completo (curadas, lotes e geradas) e, se não estiver mais
 * no catálogo, a lista de espécies aposentadas. Ids antigos passam por SPECIES_ID_ALIASES.
 */
export function findSpeciesById(id: string | undefined): Species | undefined {
  if (!id) return undefined;
  speciesIndex ??= new Map([...retiredSpecies, ...curatedRetired, ...filterSpeciesCatalog()].map((item) => [item.id, item]));
  return speciesIndex.get(SPECIES_ID_ALIASES[id] ?? id);
}

export const catalogCoverage = { species: catalogLoader.size, groups: groups.length, environments: environments.length };
export { catalogLicenseAudit, catalogReview };
export { createCatalogLoader } from "./catalog-loader";
