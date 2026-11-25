/**
 * PantanalDex — Equipes no app: cache offline por conta, atualização sem perder dados e envio do
 * resumo dos avistamentos quando há internet.
 *
 * Funciona assim:
 *  - Ao abrir, mostra na hora o que está guardado no aparelho (funciona sem sinal).
 *  - Com internet, busca as equipes e a visão de cada uma; erro de rede nunca apaga nada do aparelho.
 *  - Quando os avistamentos mudam, envia o resumo (espécies, contagem, zonas de ~11 km) — só se mudou.
 *  - Sair da equipe só acontece pelo botão Sair, com confirmação pelo nome da equipe.
 *
 * @author Felipe de Souza Aquino
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppState } from "react-native";

import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import * as api from "@/lib/teams";
import { supabase } from "@/lib/supabase";
import {
  buildTeamSummary, emptyTeamsCache, mergeTeamsFromServer, restoreTeamsCache, summaryKey,
  type TeamInfo, type TeamMember, type TeamsCache,
} from "@/shared/teams";

type Outcome = { ok: true; message?: string } | { ok: false; message: string };

type TeamsContextValue = {
  available: boolean;
  teams: TeamInfo[];
  overview: TeamsCache["overview"];
  loading: boolean;
  offline: boolean;
  lastSyncedAt: string | null;
  refresh: () => Promise<void>;
  loadOverview: (teamId: string) => Promise<TeamMember[] | null>;
  create: (name: string) => Promise<Outcome & { code?: string }>;
  join: (code: string) => Promise<Outcome>;
  leave: (teamId: string) => Promise<Outcome>;
  manage: (teamId: string, userId: string, action: "remove" | "admin" | "member" | "owner") => Promise<Outcome>;
  newCode: (teamId: string) => Promise<Outcome & { code?: string }>;
};

const TeamsContext = createContext<TeamsContextValue | null>(null);

export function TeamsProvider({ children }: { children: React.ReactNode }) {
  const { account, status } = useAuth();
  const { sightings } = useApp();
  const available = !!supabase && status === "signedIn" && !!account;
  const key = account ? `pantanal-dex-teams:${account.id}` : null;
  const [cache, setCache] = useState<TeamsCache>(emptyTeamsCache);
  const cacheRef = useRef(cache);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  const save = useCallback(async (next: TeamsCache) => {
    cacheRef.current = next;
    setCache(next);
    if (key) await AsyncStorage.setItem(key, JSON.stringify(next)).catch(() => undefined);
  }, [key]);

  // 1) Cache do aparelho primeiro.
  useEffect(() => {
    let alive = true;
    setCache(emptyTeamsCache());
    cacheRef.current = emptyTeamsCache();
    if (!key) return;
    AsyncStorage.getItem(key).then((raw) => {
      if (!alive) return;
      const restored = restoreTeamsCache(raw);
      cacheRef.current = restored;
      setCache(restored);
    }).catch(() => undefined);
    return () => { alive = false; };
  }, [key]);

  const loadOverview = useCallback(async (teamId: string) => {
    const result = await api.fetchTeamOverview(teamId);
    if (result.error !== null) { setOffline(true); return null; }
    setOffline(false);
    await save({ ...cacheRef.current, overview: { ...cacheRef.current.overview, [teamId]: { members: result.data, fetchedAt: new Date().toISOString() } } });
    return result.data;
  }, [save]);

  const syncSummary = useCallback(async () => {
    if (!available || cacheRef.current.teams.length === 0) return;
    const summary = buildTeamSummary(sightings);
    const signature = summaryKey(summary);
    if (signature === cacheRef.current.lastSyncedKey) return;
    const result = await api.syncTeamStats(summary);
    if (result.error !== null) { setOffline(true); return; }
    await save({ ...cacheRef.current, lastSyncedKey: signature, lastSyncedAt: result.data ?? new Date().toISOString() });
  }, [available, sightings, save]);

  // 2) Servidor, sem nunca apagar o cache por erro de rede.
  const refresh = useCallback(async () => {
    if (!available) return;
    setLoading(true);
    try {
      const result = await api.fetchMyTeams();
      if (result.error !== null) { setOffline(true); return; }
      setOffline(false);
      await save(mergeTeamsFromServer(cacheRef.current, result.data));
      await syncSummary();
      await Promise.all(result.data.map((team) => loadOverview(team.id)));
    } finally {
      setLoading(false);
    }
  }, [available, save, syncSummary, loadOverview]);

  useEffect(() => { void refresh(); }, [refresh]);
  // Volta para o app → atualiza.
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => { if (state === "active") void refresh(); });
    return () => sub.remove();
  }, [refresh]);
  // Avistamentos mudaram → envia o resumo (com uma pequena espera para juntar várias mudanças).
  useEffect(() => {
    const timer = setTimeout(() => void syncSummary(), 4000);
    return () => clearTimeout(timer);
  }, [syncSummary]);

  const afterChange = useCallback(async () => {
    const result = await api.fetchMyTeams();
    if (!result.error) await save(mergeTeamsFromServer(cacheRef.current, result.data));
  }, [save]);

  const value = useMemo<TeamsContextValue>(() => ({
    available,
    teams: cache.teams,
    overview: cache.overview,
    loading,
    offline,
    lastSyncedAt: cache.lastSyncedAt,
    refresh,
    loadOverview,
    create: async (name) => {
      const result = await api.createTeam(name);
      if (result.error !== null) return { ok: false, message: result.error };
      await afterChange();
      await save({ ...cacheRef.current, lastSyncedKey: null });
      await syncSummary();
      await loadOverview(result.data.id);
      return { ok: true, code: result.data.code };
    },
    join: async (code) => {
      const result = await api.joinTeam(code);
      if (result.error !== null) return { ok: false, message: result.error };
      await afterChange();
      await save({ ...cacheRef.current, lastSyncedKey: null });
      await syncSummary();
      await loadOverview(result.data.id);
      return { ok: true, message: `Você entrou na equipe ${result.data.name} (${result.data.members} pessoas).` };
    },
    leave: async (teamId) => {
      const result = await api.leaveTeam(teamId);
      if (result.error !== null) return { ok: false, message: result.error };
      await afterChange();
      return { ok: true };
    },
    manage: async (teamId, userId, action) => {
      const result = await api.manageTeamMember(teamId, userId, action);
      if (result.error !== null) return { ok: false, message: result.error };
      await afterChange();
      await loadOverview(teamId);
      return { ok: true };
    },
    newCode: async (teamId) => {
      const result = await api.regenerateTeamCode(teamId);
      if (result.error !== null) return { ok: false, message: result.error };
      await afterChange();
      return { ok: true, code: result.data ?? undefined };
    },
  }), [available, cache, loading, offline, refresh, loadOverview, afterChange, save, syncSummary]);

  return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>;
}

export function useTeams() {
  const value = useContext(TeamsContext);
  if (!value) throw new Error("useTeams precisa estar dentro de TeamsProvider");
  return value;
}
