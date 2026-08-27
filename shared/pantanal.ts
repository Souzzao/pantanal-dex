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
  conservationSource?: { title: string; url: string };
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

/**
 * Catálogo legado (vazio). 
 * Todas as espécies foram migradas para o sistema modular em shared/catalog/batches/.
 */
export const species: Species[] = [];

const isHttpUrl = (value: string) => /^https?:\/\/\S+$/i.test(value);
const isApprovedConservationUrl = (value: string) => /^https:\/\/(?:[a-z0-9-]+\.)*(?:icmbio|mma|in|gov)\.br\//i.test(value);
const isCommercialImageLicense = (value: string) => /^(?:CC0|Public Domain|CC BY(?:-SA)?(?: 4\.0)?)(?:\s|$)/i.test(value.trim()) && !/\b(?:NC|ND)\b/i.test(value);

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
      if (!(item as any)[field]?.trim()) errors.push(`${prefix}.${field} ausente`);
    }
    if (item.curiosities.length === 0 || item.curiosities.some((curiosity) => !curiosity.trim())) errors.push(`${prefix}.curiosities inválido`);
    if (item.images.length < 3) errors.push(`${prefix}.images deve ter pelo menos 3 imagens`);
    item.images.forEach((image, imageIndex) => {
      if (!image.uri || !isHttpUrl(image.uri) || !image.author || !image.license || !isCommercialImageLicense(image.license) || !isHttpUrl(image.sourceUrl) || !image.credit) errors.push(`${prefix}.images[${imageIndex}] sem licença comercial, crédito ou fonte completos`);
    });
    if (item.sources.length === 0 || item.sources.some((source) => !source.title.trim() || !isHttpUrl(source.url))) errors.push(`${prefix}.sources inválido`);
    if (item.conservationStatus && (!item.conservationSource || !item.conservationSource.title.trim() || !isApprovedConservationUrl(item.conservationSource.url))) errors.push(`${prefix}.conservationSource deve ser Livro Vermelho ICMBio ou Portaria MMA/ICMBio`);
    if (item.conservationSource && (!item.conservationSource.title.trim() || !isApprovedConservationUrl(item.conservationSource.url))) errors.push(`${prefix}.conservationSource inválido`);
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
      typeof sighting.speciesId === "string" && 
      // Nota: Agora verificamos contra o catálogo modular via import circular ou apenas validamos a estrutura
      // Para o contrato de persistência, o speciesId deve ser uma string não vazia.
      sighting.speciesId.length > 0 &&
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
