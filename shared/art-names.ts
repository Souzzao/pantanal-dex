/**
 * PantanalDex — Figuras do app (as que substituíram os emojis): nomes e onde cada uma é usada.
 *
 * As figuras foram geradas no ChatGPT (imagens da OpenAI, uso comercial permitido pelos termos
 * da OpenAI ao autor), num estilo único: glifo chapado creme #FBF7EF com detalhe amarelo #FFC400.
 * Os arquivos ficam em assets/icons/<nome>.png (192 px, fundo transparente) e o componente
 * components/ArtIcon.tsx as desenha. Este módulo é só de nomes, para ser testável no Node.
 *
 * @author Felipe de Souza Aquino
 */
export const ART_NAMES = [
  // Lote 1: grupos de animais e conquistas
  "onca", "tuiuiu", "jacare", "sapo", "peixe", "borboleta", "caderno", "lupa",
  "bussola", "folhas", "pegada", "pena", "calendario", "trofeu", "equipe", "mapa",
  // Lote 2: lugares do mapa e insígnias
  "cidade", "ponte", "arvore", "rio", "anzol", "igreja", "forte", "ancora",
  "montanha", "ilha", "canoa", "portal", "capim", "cavalo", "medalha", "brilho",
  // Lote 3: cadernos, registro e auditoria
  "camera", "fotos", "frasco", "caderno-lapis", "importar", "escudo", "ampulheta", "aprovado",
  "alfinete", "pasta", "binoculo", "arara", "ariranha", "offline", "globo", "zona",
] as const;

export type ArtName = (typeof ART_NAMES)[number];

export const isArtName = (value: string): value is ArtName => (ART_NAMES as readonly string[]).includes(value);

/** Figura de cada grupo de animais. */
export const GROUP_ART: Record<string, ArtName> = {
  Mamíferos: "onca", Aves: "tuiuiu", Répteis: "jacare", Anfíbios: "sapo", Peixes: "peixe", Invertebrados: "borboleta",
};
export const groupArt = (group: string): ArtName => GROUP_ART[group] ?? "pegada";
