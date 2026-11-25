/**
 * PantanalDex — Qual versão do app está rodando.
 *
 * - "production" (padrão): versão final, para a Google Play. Sem caderno Teste e sem auditoria simulada.
 * - "demo": versão de demonstração ("PantanalDex Demo", outro pacote, instala junto da final). Traz o
 *   caderno Teste com exemplos e o modo demonstração da auditoria, para apresentações e testes.
 *
 * Definida na hora do build por APP_VARIANT (app.config.ts repassa como EXPO_PUBLIC_APP_VARIANT,
 * que o Expo embute no código). Sem a variável, vale a versão final: nunca sai Demo por engano.
 *
 * @author Felipe de Souza Aquino
 */
export type AppVariant = "demo" | "production";

export function parseVariant(value: string | undefined | null): AppVariant {
  return value?.trim().toLowerCase() === "demo" ? "demo" : "production";
}

export const APP_VARIANT: AppVariant = parseVariant(process.env.EXPO_PUBLIC_APP_VARIANT);
export const IS_DEMO = APP_VARIANT === "demo";
