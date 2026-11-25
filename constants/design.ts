/**
 * PantanalDex — Tokens de design (sistema visual "Órbita pantaneira").
 *
 * Adaptado do kit Órbita UI: mesmos papéis (fundo quase preto, painel com degradê, contorno fino,
 * raio de 18 px, curva de movimento suave e quatro gradientes assinatura), com a paleta do Pantanal.
 * Os quatro gradientes do kit viram paisagens do bioma:
 *   Aurora → "Aurora"  (água verde-azulada do amanhecer)     · Eclipse → "Ocaso"  (pôr do sol âmbar)
 *   Plasma → "Ipê"     (flor do ipê, rosa e roxo)             · Íon     → "Rio"    (azul das baías)
 * e cada grupo de animais ganha o seu (usado em cartões, coleção e filtros).
 *
 * @author Felipe de Souza Aquino
 */
export const radius = { sm: 12, md: 18, lg: 24, xl: 28, pill: 999 } as const;
export const space = { xs: 6, sm: 10, md: 14, lg: 18, xl: 24 } as const;
export const motion = { fast: 160, base: 260, slow: 420, ease: [0.2, 0.75, 0.25, 1] as const } as const;

/** Painel do Órbita: degradê sutil de 145° + contorno fino. */
export const panel = { from: "#221E18", to: "#1A1815", outline: "#2F2B25", outlineStrong: "#4A4234" } as const;

export type Gradient = { name: string; glow: string; from: string; via: string; to: string; ink: string };

export const gradients = {
  aurora: { name: "Aurora", glow: "#7CFFD0", from: "#08201C", via: "#155C55", to: "#1E3F5A", ink: "#D8FFF1" },
  ocaso: { name: "Ocaso", glow: "#FFC400", from: "#1A0F06", via: "#7A3A0C", to: "#C2410C", ink: "#FFF3D6" },
  ipe: { name: "Ipê", glow: "#FFA8D9", from: "#1E0F24", via: "#6B2A7A", to: "#C2457A", ink: "#FFE6F3" },
  rio: { name: "Rio", glow: "#A1EAFF", from: "#0B1530", via: "#1C428D", to: "#3F57C9", ink: "#E3F6FF" },
  mata: { name: "Mata", glow: "#B6F56B", from: "#0C1A0B", via: "#2E5A1C", to: "#5E8A1E", ink: "#F0FFDC" },
  terra: { name: "Terra", glow: "#FFB27A", from: "#1A1210", via: "#5A3322", to: "#8A5A2B", ink: "#FFEBDD" },
} satisfies Record<string, Gradient>;

/** Gradiente de cada grupo de animais. */
export const groupGradient: Record<string, Gradient> = {
  Mamíferos: gradients.ocaso,
  Aves: gradients.aurora,
  Répteis: gradients.mata,
  Anfíbios: gradients.ipe,
  Peixes: gradients.rio,
  Invertebrados: gradients.terra,
};

export const groupIcon: Record<string, string> = {
  Mamíferos: "🐆", Aves: "🦜", Répteis: "🐊", Anfíbios: "🐸", Peixes: "🐟", Invertebrados: "🦋",
};

export const gradientFor = (group: string): Gradient => groupGradient[group] ?? gradients.ocaso;
