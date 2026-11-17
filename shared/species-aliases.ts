/**
 * Espécies que apareciam duas vezes no catálogo (mesmo nome científico ou sinônimo). O id da esquerda
 * sai do catálogo; registros antigos com ele passam a apontar para o da direita.
 */
export const SPECIES_ID_ALIASES: Readonly<Record<string, string>> = {
  "jacare-pagua": "jacare-do-pantanal",
  "ra-pimenta-pantanal": "ra-pimenta",
  "caranguejo-de-agua-doce": "caranguejo-agua-doce",
  pitu: "camarao-agua-doce",
  teiu: "teiú",
  "traira-pantanal": "traira",
  "perereca-macaco": "perereca-de-cera",
  "sapinho-cururu": "sapo-cururu",
};

export function resolveSpeciesId(id: string): string {
  return SPECIES_ID_ALIASES[id] ?? id;
}

