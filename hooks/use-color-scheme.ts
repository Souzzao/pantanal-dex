/**
 * PantanalDex — Esquema de cores do sistema (nativo).
 *
 * @author Felipe de Souza Aquino
 */
import { useThemeContext } from "@/lib/theme-provider";

export function useColorScheme() {
  return useThemeContext().colorScheme;
}
