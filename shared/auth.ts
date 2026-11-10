/**
 * Regras puras do login (sem React), para poder testar.
 */

export type Role = "user" | "auditor" | "dev";
export type Account = { id: string; email: string; displayName: string; role: Role };

export const ACCOUNT_CACHE_KEY = "pantanal-dex:account-v1";

export function isRole(value: unknown): value is Role {
  return value === "user" || value === "auditor" || value === "dev";
}

/** Conta guardada no aparelho para funcionar sem internet. */
export function restoreAccount(raw: string | null): Account | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<Account>;
    if (typeof parsed.id !== "string" || typeof parsed.email !== "string" || typeof parsed.displayName !== "string" || !isRole(parsed.role)) return null;
    return { id: parsed.id, email: parsed.email, displayName: parsed.displayName, role: parsed.role };
  } catch {
    return null;
  }
}

export const canAudit = (account: Account | null) => account?.role === "auditor" || account?.role === "dev";
export const isDev = (account: Account | null) => account?.role === "dev";

export function validateSignUp(input: { email: string; password: string; displayName: string }): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) return "email";
  if (input.password.length < 8) return "password";
  const name = input.displayName.trim();
  if (name.length < 2 || name.length > 40) return "name";
  return null;
}

/** Traduz os erros do Supabase Auth para uma chave de mensagem do app. */
export function authErrorKey(message: string | undefined): "invalid" | "exists" | "network" | "confirm" | "weak" | "rate" | "unknown" {
  const text = (message ?? "").toLowerCase();
  if (text.includes("invalid login credentials")) return "invalid";
  if (text.includes("already registered") || text.includes("already exists")) return "exists";
  if (text.includes("email not confirmed")) return "confirm";
  if (text.includes("password") && (text.includes("weak") || text.includes("at least") || text.includes("characters"))) return "weak";
  if (text.includes("rate limit") || text.includes("too many")) return "rate";
  if (text.includes("network") || text.includes("fetch") || text.includes("failed to")) return "network";
  return "unknown";
}
