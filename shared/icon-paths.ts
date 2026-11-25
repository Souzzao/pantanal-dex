/**
 * PantanalDex — Ícones "Traço pantaneiro": desenho próprio, sem emoji e sem pacote de terceiros.
 *
 * Grade de 24 px, traço de 1,75 px com pontas redondas e UM detalhe de destaque por ícone (o "acento",
 * pintado na cor de marca). É o mesmo desenho no app (components/Icon.tsx) e no mapa da WebView
 * (iconSvg), para o ícone ser igual em qualquer tela. Para adicionar um ícone: um nome novo aqui,
 * `d` com o traço principal e `a` com o acento. Não duplique: reutilize os que já existem.
 *
 * @author Felipe de Souza Aquino
 */
export type IconDef = { d: readonly string[]; a?: readonly string[] };

const circle = (cx: number, cy: number, r: number) => `M${cx + r} ${cy}a${r} ${r} 0 1 1-${2 * r} 0a${r} ${r} 0 1 1 ${2 * r} 0`;
const dot = (x: number, y: number) => `M${x} ${y}h.01`;

export const ICONS = {
  // ── Ações e navegação ──
  search: { d: [circle(10.5, 10.5, 6), "M15 15l5 5"], a: ["M8 8.4a3 3 0 0 1 2.4-1.3"] },
  "arrow-right": { d: ["M5 12h13"], a: ["M13 6.5l5.5 5.5-5.5 5.5"] },
  "arrow-left": { d: ["M19 12H6"], a: ["M11 6.5L5.5 12l5.5 5.5"] },
  "chevron-right": { d: ["M9.5 6l6 6-6 6"] },
  "chevron-up": { d: ["M6 15l6-6 6 6"] },
  "chevron-down": { d: ["M6 9l6 6 6-6"] },
  close: { d: ["M6.5 6.5l11 11", "M17.5 6.5l-11 11"] },
  check: { d: ["M5 12.5l4.5 4.5L19 7.5"] },
  plus: { d: ["M12 5v14", "M5 12h14"] },
  minus: { d: ["M5 12h14"] },
  refresh: { d: ["M19.5 12a7.5 7.5 0 1 1-2.2-5.3"], a: ["M19.5 4.5v4h-4"] },
  trash: { d: ["M5 7h14", "M9.5 7V4.5h5V7", "M7 7l.8 12a1.5 1.5 0 0 0 1.5 1.4h5.4a1.5 1.5 0 0 0 1.5-1.4L17 7"], a: ["M10.5 11v5", "M13.5 11v5"] },
  share: { d: ["M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13"], a: ["M12 15V4", "M8 8l4-4 4 4"] },
  list: { d: ["M9 7h11", "M9 12h11", "M9 17h11"], a: [dot(4.5, 7), dot(4.5, 12), dot(4.5, 17)] },
  grid: { d: ["M4.5 4.5h6v6h-6z", "M13.5 13.5h6v6h-6z", "M4.5 13.5h6v6h-6z"], a: ["M13.5 4.5h6v6h-6z"] },
  layers: { d: ["M12 4l8.5 4.5L12 13 3.5 8.5z", "M3.5 12.5L12 17l8.5-4.5"], a: ["M3.5 16.5L12 21l8.5-4.5"] },
  settings: { d: ["M4 7h9", "M19 7h1", "M4 17h3", "M13 17h7"], a: [circle(16, 7, 2.5), circle(10, 17, 2.5)] },
  home: { d: ["M4 11l8-6.5 8 6.5", "M6 9.5V20h12V9.5"], a: ["M10 20v-5h4v5"] },
  user: { d: [circle(12, 8, 4), "M4.5 20.5a7.5 7.5 0 0 1 15 0"] },
  team: { d: [circle(9, 8, 3), "M3.5 19a5.5 5.5 0 0 1 11 0"], a: ["M16 11a2.5 2.5 0 1 0 0-5", "M17.5 19a4.5 4.5 0 0 0-2.5-4"] },
  eye: { d: ["M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"], a: [circle(12, 12, 2.5)] },
  flag: { d: ["M5.5 21V4"], a: ["M5.5 4.5h11l-2 4 2 4h-11"] },

  // ── Câmera e fotos ──
  camera: { d: ["M4 8.5A2.5 2.5 0 0 1 6.5 6h1.8l1.4-2h4.6l1.4 2h1.8A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z", circle(12, 12.5, 3.5)], a: [dot(17, 9)] },
  image: { d: ["M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5z", "M4 16l4.5-4.5 3.5 3.5 2.5-2.5L20 18"], a: [circle(16, 8.5, 1.3)] },
  flash: { d: ["M13 3L6 13.5h5L10.5 21 18 10h-5z"] },
  "flash-off": { d: ["M13 3L9.6 8.1", "M8.3 10.1L6 13.5h5L10.5 21l3.6-5.3", "M15.6 12.6L18 10h-4.2"], a: ["M4 4l16 16"] },
  flip: { d: ["M4 9a8 8 0 0 1 14.5-3", "M20 15a8 8 0 0 1-14.5 3"], a: ["M18.5 3v3h-3", "M5.5 21v-3h3"] },

  // ── Mapa e lugares ──
  map: { d: ["M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6z", "M9 4v14"], a: ["M15 6v14"] },
  pin: { d: ["M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"], a: [circle(12, 10, 2.2)] },
  compass: { d: [circle(12, 12, 8.5)], a: ["M15 9l-2 4-4 2 2-4z"] },
  offline: { d: ["M2.5 9a14 14 0 0 1 5-3", "M12 5.5a14 14 0 0 1 9.5 3.5", "M5.5 12.5a9 9 0 0 1 4-2.2", "M15 11a9 9 0 0 1 3.5 1.5", "M9 16a4.5 4.5 0 0 1 6 0"], a: ["M4 4l16 16"] },
  star: { d: ["M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8-4.2-4.1 5.9-.9z"] },
} as const satisfies Record<string, IconDef>;

export type IconName = keyof typeof ICONS;

export const isIconName = (value: string): value is IconName => Object.prototype.hasOwnProperty.call(ICONS, value);

/** SVG em texto, para a WebView do mapa (mesmo desenho do componente Icon). Nomes desconhecidos viram um alfinete. */
export function iconSvg(name: string, color: string, accent: string = color, size = 22, strokeWidth = 1.75): string {
  const icon: IconDef = isIconName(name) ? ICONS[name] : ICONS.pin;
  const safe = (c: string) => (/^#[0-9a-fA-F]{3,8}$/.test(c) ? c : "#FBF7EF");
  const paths = (list: readonly string[] | undefined, stroke: string) => (list ?? []).map((d) => `<path d="${d}" stroke="${safe(stroke)}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths(icon.d, color)}${paths(icon.a, accent)}</svg>`;
}
