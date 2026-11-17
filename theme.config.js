/**
 * Identidade PantanalDex (17/11/2026): preto, branco e amarelo.
 * O app usa a mesma paleta escura nos dois modos do sistema, para manter a identidade
 * (fundo preto, texto branco, amarelo para ações e destaques).
 * @type {const}
 */
const brand = {
  primary: '#FFC400',
  background: '#0B0B0B',
  surface: '#181818',
  foreground: '#FFFFFF',
  muted: '#B5B5B5',
  border: '#2C2C2C',
  success: '#4ADE80',
  warning: '#FFC400',
  error: '#FF6B5E',
  accent: '#FFC400',
  onAccent: '#0B0B0B',
};

const themeColors = Object.fromEntries(Object.entries(brand).map(([name, value]) => [name, { light: value, dark: value }]));

module.exports = { themeColors };
