import type { Species } from "../pantanal";
import { speciesDe } from "./species.de";
import { speciesEn } from "./species.en";
import { speciesEs } from "./species.es";
import { uiDe } from "./ui.de";
import { uiEn } from "./ui.en";
import { uiEs } from "./ui.es";

/** Traduções embutidas no app: funcionam sem internet. O português é o texto de origem. */
export type LanguageCode = "pt" | "en" | "es" | "de";
export type SpeciesTranslation = [name: string, description: string, physical: string, habitat: string, behavior: string, diet: string, curiosities: string[], distribution: string, importance: string];

export const languageCodes: Record<string, LanguageCode> = { "Português": "pt", English: "en", "Español": "es", Deutsch: "de" };
const speciesTables: Record<Exclude<LanguageCode, "pt">, Record<string, SpeciesTranslation>> = { en: speciesEn, es: speciesEs, de: speciesDe };
const uiTables: Record<Exclude<LanguageCode, "pt">, Record<string, string>> = { en: uiEn, es: uiEs, de: uiDe };

let current: LanguageCode = "pt";

export function setLanguage(name: string): void { current = languageCodes[name] ?? "pt"; }
export function getLanguageCode(): LanguageCode { return current; }

/** Traduz um texto de interface escrito em português. Sem tradução, devolve o português. `{nome}` é trocado por `vars.nome`. */
export function tr(pt: string, vars?: Record<string, string | number>, code: LanguageCode = current): string {
  const text = code === "pt" ? pt : uiTables[code][pt] ?? pt;
  return vars ? text.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match)) : text;
}

export function hasSpeciesTranslation(id: string, code: LanguageCode = current): boolean {
  return code === "pt" || Boolean(speciesTables[code][id]);
}

/** Devolve a ficha no idioma atual; campos sem tradução continuam em português. */
export function localizeSpecies(item: Species, code: LanguageCode = current): Species {
  if (code === "pt") return item;
  const t = speciesTables[code][item.id];
  if (!t) return item;
  return { ...item, commonName: t[0], description: t[1], physicalCharacteristics: t[2], habitat: t[3], behavior: t[4], diet: t[5], curiosities: t[6], distribution: t[7], ecologicalImportance: t[8] };
}
