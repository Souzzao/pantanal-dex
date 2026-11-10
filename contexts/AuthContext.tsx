import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@supabase/supabase-js";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { supabase } from "@/lib/supabase";
import { ACCOUNT_CACHE_KEY, authErrorKey, isRole, restoreAccount, type Account } from "@/shared/auth";

/**
 * Login obrigatório (e-mail e senha) com "modo offline":
 *  - depois de entrar uma vez, a conta fica guardada no aparelho e o app abre mesmo sem internet;
 *  - offline funcionam o caderno da própria conta e o catálogo; o que depende do servidor
 *    (mapa público, auditoria, área dev) espera a internet voltar;
 *  - sem servidor configurado (sem .env), o app funciona como antes, sem login ("local").
 */
export type AuthStatus = "loading" | "signedOut" | "signedIn" | "local";

type AuthContextValue = {
  status: AuthStatus;
  account: Account | null;
  /** Token para chamar o servidor; null sem sessão. */
  accessToken: string | null;
  /** true quando a conta está aberta só com o que ficou guardado (sem internet agora). */
  offline: boolean;
  signIn: (email: string, password: string) => Promise<{ error: ReturnType<typeof authErrorKey> | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: ReturnType<typeof authErrorKey> | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  refreshAccount: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Erro de rede do Supabase Auth (não quer dizer que a sessão acabou). */
function isNetworkError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const { name, status } = error as { name?: string; status?: number };
  return name === "AuthRetryableFetchError" || status === 0;
}

/** Conta mínima a partir da sessão (antes de o perfil do servidor chegar). */
function baseAccount(session: Session): Account {
  const email = session.user.email ?? "";
  return { id: session.user.id, email, displayName: (session.user.user_metadata?.display_name as string | undefined) ?? email.split("@")[0], role: "user" };
}

async function saveAccount(account: Account | null) {
  try {
    if (account) await AsyncStorage.setItem(ACCOUNT_CACHE_KEY, JSON.stringify(account));
    else await AsyncStorage.removeItem(ACCOUNT_CACHE_KEY);
  } catch {
    // Sem armazenamento: o login ainda funciona nesta abertura.
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(supabase ? "loading" : "local");
  const [account, setAccount] = useState<Account | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [offline, setOffline] = useState(false);
  const accountRef = useRef<Account | null>(null);
  /** Conta da sessão ativa agora. Respostas atrasadas de outra conta são ignoradas. */
  const activeUserId = useRef<string | null>(null);

  const applyAccount = useCallback((next: Account | null) => {
    accountRef.current = next;
    setAccount(next);
    void saveAccount(next);
  }, []);

  /** Lê nome e papel no servidor; sem internet, mantém o que estava guardado. */
  const loadProfile = useCallback(async (current: Session) => {
    if (!supabase) return;
    const userId = current.user.id;
    activeUserId.current = userId;
    const base: Account = accountRef.current?.id === current.user.id
      ? accountRef.current
      : baseAccount(current);
    try {
      const { data, error } = await supabase.from("profiles").select("display_name, role").eq("id", current.user.id).maybeSingle();
      if (error) throw error;
      if (activeUserId.current !== userId) return; // saiu ou trocou de conta enquanto esperava
      setOffline(false);
      applyAccount({ ...base, email: current.user.email ?? base.email, displayName: data?.display_name ?? base.displayName, role: isRole(data?.role) ? data.role : base.role });
    } catch {
      if (activeUserId.current !== userId) return;
      setOffline(true);
      // Mantém o que já foi carregado desta conta (ex.: papel), se houver.
      applyAccount(accountRef.current?.id === userId ? accountRef.current : base);
    }
  }, [applyAccount]);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    (async () => {
      const cached = restoreAccount(await AsyncStorage.getItem(ACCOUNT_CACHE_KEY).catch(() => null));
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;
      const current = data.session;
      if (!current && cached && isNetworkError(error)) {
        // Sem internet e com o token vencido: abre com a conta guardada (modo offline).
        activeUserId.current = cached.id;
        applyAccount(cached);
        setOffline(true);
        setStatus("signedIn");
        return;
      }
      if (current) {
        activeUserId.current = current.user.id;
        applyAccount(cached?.id === current.user.id ? cached : baseAccount(current));
        setSession(current);
        setStatus("signedIn");
        void loadProfile(current);
      } else {
        // Sem sessão guardada: precisa entrar (a conta antiga do aparelho não abre sem sessão).
        applyAccount(null);
        setStatus("signedOut");
      }
    })().catch(() => {
      if (mounted) setStatus("signedOut");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, next) => {
      if (!mounted) return;
      setSession(next);
      if (event === "SIGNED_OUT" || !next) {
        activeUserId.current = null;
        applyAccount(null);
        setStatus("signedOut");
      } else if (event === "SIGNED_IN" || event === "USER_UPDATED" || event === "TOKEN_REFRESHED") {
        // A conta certa entra antes de as telas abrirem; o perfil do servidor chega depois.
        activeUserId.current = next.user.id;
        if (accountRef.current?.id !== next.user.id) applyAccount(baseAccount(next));
        setStatus("signedIn");
        void loadProfile(next);
      }
    });
    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [applyAccount, loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: "unknown" as const };
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      return { error: error ? authErrorKey(error.message) : null };
    } catch (error) {
      return { error: authErrorKey((error as Error).message || "network") };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    if (!supabase) return { error: "unknown" as const, needsConfirmation: false };
    try {
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { display_name: displayName.trim() } } });
      if (error) return { error: authErrorKey(error.message), needsConfirmation: false };
      return { error: null, needsConfirmation: !data.session };
    } catch (error) {
      return { error: authErrorKey((error as Error).message || "network"), needsConfirmation: false };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    // scope "local": sai deste aparelho mesmo sem internet.
    activeUserId.current = null;
    await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
    applyAccount(null);
    setSession(null);
    setStatus("signedOut");
  }, [applyAccount]);

  const refreshAccount = useCallback(async () => {
    if (session) await loadProfile(session);
  }, [session, loadProfile]);

  const getAccessToken = useCallback(async () => {
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    status, account, accessToken: session?.access_token ?? null, offline, signIn, signUp, signOut, refreshAccount, getAccessToken,
  }), [status, account, session, offline, signIn, signUp, signOut, refreshAccount, getAccessToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
