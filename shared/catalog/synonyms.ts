import type { Species } from "../pantanal";

export type DocumentedSynonym = { name: string; sourceUrl: string };

const gbifSynonymUrl = (usageKey: number) => `https://api.gbif.org/v1/species/${usageKey}/synonyms`;

export const documentedSynonyms: Readonly<Record<string, readonly DocumentedSynonym[]>> = {
  tuiuiu: [
    { name: "Ciconia mycteria", sourceUrl: gbifSynonymUrl(2481953) },
    { name: "Jabiru weillsi", sourceUrl: gbifSynonymUrl(2481953) },
  ],
  "arara-azul": [
    { name: "Psittacus hyacinthinus", sourceUrl: gbifSynonymUrl(2479359) },
  ],
  pintado: [
    { name: "Platystoma corruscans", sourceUrl: gbifSynonymUrl(2338660) },
    { name: "Pseudoplatystoma corruscanus", sourceUrl: gbifSynonymUrl(2338660) },
    { name: "Sorubim caparary", sourceUrl: gbifSynonymUrl(2338660) },
  ],
  pacu: [
    { name: "Myletes mesopotamicus", sourceUrl: gbifSynonymUrl(2353219) },
    { name: "Colossoma mitrei", sourceUrl: gbifSynonymUrl(2353219) },
  ],
  piraputanga: [
    { name: "Chalceus hilarii", sourceUrl: gbifSynonymUrl(2353507) },
    { name: "Salmo paraputanga", sourceUrl: gbifSynonymUrl(2353507) },
  ],
};

export function applyDocumentedSynonyms(records: readonly Species[]): Species[] {
  return records.map((species) => {
    const aliases = documentedSynonyms[species.id] ?? [];
    const existing = species.searchNames ?? [];
    const searchNames = [...new Set([...existing, ...aliases.map((alias) => alias.name)])];
    return searchNames.length ? { ...species, searchNames } : species;
  });
}

export function validateDocumentedSynonyms(records: readonly Species[]): string[] {
  const errors: string[] = [];
  for (const [speciesId, aliases] of Object.entries(documentedSynonyms)) {
    const names = new Set<string>();
    for (const alias of aliases) {
      if (!alias.name.trim() || names.has(alias.name.toLocaleLowerCase())) errors.push(`${speciesId}: sinônimo vazio ou duplicado`);
      names.add(alias.name.toLocaleLowerCase());
      if (!/^https:\/\/api\.gbif\.org\//.test(alias.sourceUrl)) errors.push(`${speciesId}: fonte de sinônimo fora do GBIF`);
    }
  }
  return errors;
}
