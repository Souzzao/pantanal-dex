import type { Environment, Species, SpeciesGroup } from "../../pantanal";
import data from "./vertebrados.json";

/**
 * Vertebrados do Pantanal gerados por scripts/catalog/build.py a partir do iNaturalist (observações
 * confirmadas no Pantanal brasileiro), GBIF (coleções científicas), Wikipédia e bases de traços.
 * Textos nos 4 idiomas; o português vai na ficha e os outros idiomas em `generatedTranslations`.
 */
type LangText = { name: string; description: string; physical: string; habitat: string; behavior: string; diet: string; distribution: string };
type GeneratedRow = {
  id: string; sci: string; group: SpeciesGroup; env: Environment[]; family: string | null; familyPt: string | null; order: string | null;
  inat: number; count: number; exotic: boolean; areaKm: number; status: string | null; statusText: string[] | null;
  images: Species["images"]; sources: Species["sources"]; t: Record<"pt" | "en" | "es" | "de", LangText>;
  /** Rara demais (menos de 5 fotos de uso livre): fora do catálogo, só para abrir avistamentos antigos. */
  retired?: boolean;
};

const rows = data as unknown as GeneratedRow[];

const toSpecies = (row: GeneratedRow, lang: "pt" | "en" | "es" | "de"): Species => {
  const t = row.t[lang] ?? row.t.pt;
  const statusIndex = { pt: 0, en: 1, es: 2, de: 3 }[lang];
  return {
    id: row.id,
    commonName: t.name,
    scientificName: row.sci,
    group: row.group,
    environments: row.env,
    description: t.description,
    physicalCharacteristics: t.physical,
    habitat: t.habitat,
    behavior: t.behavior,
    diet: t.diet,
    curiosities: [],
    distribution: t.distribution,
    ecologicalImportance: "",
    conservationStatus: row.statusText?.[statusIndex] ?? undefined,
    images: row.images,
    sources: row.sources,
    areaKm: row.areaKm,
    family: row.family ?? undefined,
    exotic: row.exotic,
    generated: true,
    iucn: row.status ?? undefined,
  };
};

export const generatedSpecies: Species[] = rows.filter((row) => !row.retired).map((row) => toSpecies(row, "pt"));

/** Espécies que saíram do catálogo. Não aparecem na busca; servem para mostrar avistamentos antigos. */
export const retiredSpecies: Species[] = rows.filter((row) => row.retired).map((row) => toSpecies(row, "pt"));

/** Mesma tupla usada pelas traduções das fichas escritas à mão (shared/i18n). */
export function generatedTranslation(id: string, lang: "en" | "es" | "de"): Species | undefined {
  const row = rowsById.get(id);
  return row ? toSpecies(row, lang) : undefined;
}

const rowsById = new Map(rows.map((row) => [row.id, row]));
