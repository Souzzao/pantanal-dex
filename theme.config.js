/**
 * Identidade PantanalDex (17/11/2026): preto, branco e amarelo.
 * O app usa a mesma paleta escura nos dois modos do sistema, para manter a identidade
 * (fundo preto, texto branco, amarelo para ações e destaques).
 * @type {const}
 */
const brand = {
  primary: '#FFC400',
  // Preto quente (tom de couro de caderno de campo) em vez de preto puro: mais sofisticado, mesma identidade.
  background: '#0E0D0B',
  surface: '#1A1815',
  foreground: '#FBF7EF',
  muted: '#B8B0A2',
  border: '#2F2B25',
  success: '#4ADE80',
  warning: '#FFC400',
  error: '#FF6B5E',
  accent: '#FFC400',
  onAccent: '#0E0D0B',
};

const themeColors = Object.fromEntries(Object.entries(brand).map(([name, value]) => [name, { light: value, dark: value }]));

module.exports = { themeColors };
