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

const squash = (value: string) => value.replace(/\s+/g, " ").trim();
type Pattern = { regex: RegExp; template: string };
const patternCache = new Map<LanguageCode, Pattern[]>();
const resultCache = new Map<string, string>();

function patternsFor(code: Exclude<LanguageCode, "pt">): Pattern[] {
  const cached = patternCache.get(code);
  if (cached) return cached;
  const built = Object.entries(uiTables[code])
    .filter(([key]) => /\{\d+\}/.test(key) && !/\}\{/.test(key) && /[A-Za-zÀ-ÿ]{3,}/.test(key.replace(/\{\d+\}/g, "")))
    .sort((a, b) => b[0].length - a[0].length)
    .map(([key, template]) => ({
      regex: new RegExp(`^${key.replace(/[.*+?^$()|[\]\\]/g, "\\$&").replace(/\{\d+\}/g, "(.+?)")}$`),
      template,
    }));
  patternCache.set(code, built);
  return built;
}

/**
 * Traduz um texto de interface escrito em português. Sem tradução, devolve o texto como veio.
 * Aceita texto fixo ("Voltar") e texto com valores no meio ("3 registro(s) encontrado(s)"),
 * que casa com a chave "{0} registro(s) encontrado(s)". `vars` troca `{nome}` no resultado.
 */
export function tr(pt: string, vars?: Record<string, string | number>, code: LanguageCode = current): string {
  let text = pt;
  if (code !== "pt" && pt) {
    const cacheKey = `${code}\u0000${pt}`;
    const cached = resultCache.get(cacheKey);
    if (cached !== undefined) text = cached;
    else {
      const table = uiTables[code];
      const core = squash(pt);
      let translated = table[core];
      if (translated === undefined && core.length <= 400) {
        for (const { regex, template } of patternsFor(code)) {
          const match = regex.exec(core);
          if (!match) continue;
          translated = template.replace(/\{(\d+)\}/g, (_, index: string) => {
            const part = match[Number(index) + 1] ?? "";
            return table[part] ?? part;
          });
          break;
        }
      }
      // "Mamíferos · Matas", "Minha coleção ›": traduz cada parte.
      if (translated === undefined && / [·›] |[›:]$/.test(core)) {
        const parts = core.split(/( · | › | ›$|:$)/);
        const mapped = parts.map((part, index) => (index % 2 ? part : part && tr(part, undefined, code)));
        if (mapped.some((part, index) => part !== parts[index])) translated = mapped.join("");
      }
      if (translated !== undefined) {
        const lead = /^\s*/.exec(pt)?.[0] ?? "";
        const trail = /\s*$/.exec(pt)?.[0] ?? "";
        text = core === pt ? translated : `${lead}${translated}${trail}`;
      }
      if (resultCache.size > 4000) resultCache.clear();
      resultCache.set(cacheKey, text);
    }
  }
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
