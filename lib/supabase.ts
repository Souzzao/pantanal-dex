import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";

import { readFeedConfig } from "@/shared/public-feed";

/**
 * Cliente do Supabase (login e servidor). Só existe quando o `.env.local`/EAS tem
 * EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY (ver docs/SUPABASE-PASSO-A-PASSO.md).
 *
 * A sessão fica guardada no aparelho (AsyncStorage). Sem internet, a sessão guardada continua
 * valendo para o que é offline (caderno e catálogo), como o "modo offline" de um app de música;
 * quando a internet volta, o token é renovado sozinho.
 */
export const SUPABASE_CONFIG = readFeedConfig({
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
});

// Na renderização estática da web (Node, sem `window`) não há armazenamento: usa memória.
const memory = new Map<string, string>();
const serverStorage = {
  getItem: async (key: string) => memory.get(key) ?? null,
  setItem: async (key: string, value: string) => { memory.set(key, value); },
  removeItem: async (key: string) => { memory.delete(key); },
};
const isServerRender = Platform.OS === "web" && typeof window === "undefined";

export const supabase: SupabaseClient | null = SUPABASE_CONFIG
  ? createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      auth: {
        storage: isServerRender ? serverStorage : AsyncStorage,
        storageKey: "pantanal-dex-auth",
        autoRefreshToken: !isServerRender,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// Renova o token só com o app aberto (recomendação do Supabase para React Native).
if (supabase && Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") void supabase.auth.startAutoRefresh();
    else void supabase.auth.stopAutoRefresh();
  });
}
