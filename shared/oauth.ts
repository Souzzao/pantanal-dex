/**
 * PantanalDex — Leitura do retorno do login social (Google) pelo Supabase.
 *
 * O Supabase devolve a pessoa ao app pelo endereço pantanaldex://auth-callback com um `code`
 * (fluxo PKCE) ou com `access_token` + `refresh_token` no fragmento (fluxo implícito), ou com `error`.
 *
 * @author Felipe de Souza Aquino
 */
export type OAuthCallback =
  | { kind: "code"; code: string }
  | { kind: "tokens"; accessToken: string; refreshToken: string }
  | { kind: "error"; message: string }
  | { kind: "none" };

export function parseOAuthCallback(url: string): OAuthCallback {
  const read = (part: string) => new URLSearchParams(part.replace(/^[?#]/, ""));
  const qIndex = url.indexOf("?");
  const hIndex = url.indexOf("#");
  const query = qIndex >= 0 ? read(url.slice(qIndex, hIndex > qIndex ? hIndex : undefined)) : new URLSearchParams();
  const hash = hIndex >= 0 ? read(url.slice(hIndex)) : new URLSearchParams();
  const get = (key: string) => hash.get(key) ?? query.get(key);
  const error = get("error_description") ?? get("error");
  if (error) return { kind: "error", message: error };
  const code = query.get("code");
  if (code) return { kind: "code", code };
  const accessToken = get("access_token");
  const refreshToken = get("refresh_token");
  if (accessToken && refreshToken) return { kind: "tokens", accessToken, refreshToken };
  return { kind: "none" };
}

/** Mensagem amigável para erros do login social. */
export function oauthErrorMessage(message: string | undefined): string {
  const text = (message ?? "").toLowerCase();
  if (text.includes("provider is not enabled") || text.includes("unsupported provider")) return "O login com Google ainda não foi ativado no servidor. Use e-mail e senha por enquanto.";
  if (text.includes("cancel")) return "Login cancelado.";
  if (text.includes("network") || text.includes("fetch")) return "Sem internet. Tente de novo quando houver sinal.";
  return "Não foi possível entrar com o Google. Tente de novo ou use e-mail e senha.";
}
