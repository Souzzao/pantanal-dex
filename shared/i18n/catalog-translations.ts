import type { Species } from "../pantanal";
import english from "./catalog-en.json";
import spanish from "./catalog-es.json";
import german from "./catalog-de.json";

export type CatalogLanguageCode = "pt" | "en" | "es" | "de";

type TranslatedSpeciesFields = Pick<
  Species,
  | "commonName"
  | "description"
  | "physicalCharacteristics"
  | "habitat"
  | "behavior"
  | "diet"
  | "curiosities"
  | "distribution"
  | "ecologicalImportance"
  | "conservationStatus"
>;

const translations: Record<
  Exclude<CatalogLanguageCode, "pt">,
  Record<string, TranslatedSpeciesFields>
> = { en: english, es: spanish, de: german };

/** All translations are bundled locally; scientific/editorial review is pending. */
export const catalogTranslationReview = {
  method: "machine-translation-with-common-name-corrections",
  reviewStatus: "pending",
  offline: true,
} as const;

/** Translate presentation fields while preserving identifiers, taxonomy and credits. */
export function getTranslatedSpecies(species: Species, languageCode: string): Species {
  const language = languageCode.toLowerCase().split(/[-_]/)[0];
  if (language !== "en" && language !== "es" && language !== "de") return species;

  const translated = translations[language][species.id];
  if (!translated) return species;

  // Explicit fields prevent translated data from replacing IDs or source metadata.
  return {
    ...species,
    commonName: translated.commonName,
    description: translated.description,
    physicalCharacteristics: translated.physicalCharacteristics,
    habitat: translated.habitat,
    behavior: translated.behavior,
    diet: translated.diet,
    curiosities: [...translated.curiosities],
    distribution: translated.distribution,
    ecologicalImportance: translated.ecologicalImportance,
    ...(translated.conservationStatus !== undefined
      ? { conservationStatus: translated.conservationStatus }
      : {}),
  };
}
