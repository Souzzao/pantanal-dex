/**
 * PantanalDex — Equipes no app: cache offline por conta, atualização sem perder dados e envio do
 * resumo dos avistamentos quando há internet.
 *
 * Funciona assim:
 *  - Ao abrir, mostra na hora o que está guardado no aparelho (funciona sem sinal).
 *  - Com internet, busca as equipes e a visão de cada uma; erro de rede nunca apaga nada do aparelho.
 *  - Quando os avistamentos mudam, envia o resumo (espécies, contagem, zonas de ~11 km) — só se mudou.
 *  - Sair da equipe só acontece pelo botão Sair, com confirmação pelo nome da equipe.
 *  - Coleção da equipe: registros enviados por escolha explícita (ao salvar ou na ficha do registro).
 *    O envio entra numa fila no aparelho e segue quando houver internet; repetir não duplica (opId).
 *  - Personagem: guardado no perfil do servidor e em cache no aparelho.
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
import { photosOf } from "@/shared/photo-gallery";
import type { Sighting } from "@/shared/pantanal";
import {
  buildShareRequest, DEFAULT_AVATAR, enqueueShare, sanitizeAvatar, sanitizeShareQueue,
  type Avatar, type ShareRequest, type TeamRecord,
} from "@/shared/team-records";
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
  myUserId: string | null;
  avatar: Avatar;
  saveAvatar: (avatar: Avatar) => Promise<Outcome>;
  records: Record<string, { items: TeamRecord[]; fetchedAt: string }>;
  loadRecords: (teamId: string) => Promise<TeamRecord[] | null>;
  /** Envia (ou põe na fila) um registro do caderno para a coleção de uma equipe. */
  shareRecord: (teamId: string, sighting: Sighting) => Promise<Outcome>;
  pendingShares: ShareRequest[];
  editRecord: (teamId: string, recordId: string, description: string) => Promise<Outcome>;
  removeRecord: (teamId: string, recordId: string) => Promise<Outcome>;
  photoUrls: (paths: string[]) => Promise<Record<string, string>>;
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
  const [avatar, setAvatar] = useState<Avatar>(DEFAULT_AVATAR);
  const [records, setRecords] = useState<TeamsContextValue["records"]>({});
  const recordsRef = useRef(records);
  const [shareQueue, setShareQueue] = useState<ShareRequest[]>([]);
  const queueRef = useRef<ShareRequest[]>([]);
  const flushing = useRef(false);
  const signed = useRef<Record<string, { url: string; at: number }>>({});

  const save = useCallback(async (next: TeamsCache) => {
    cacheRef.current = next;
    setCache(next);
    if (key) await AsyncStorage.setItem(key, JSON.stringify(next)).catch(() => undefined);
  }, [key]);

  const saveRecords = useCallback(async (next: TeamsContextValue["records"]) => {
    recordsRef.current = next;
    setRecords(next);
    if (key) await AsyncStorage.setItem(`${key}:records`, JSON.stringify(next)).catch(() => undefined);
  }, [key]);
  const saveQueue = useCallback(async (next: ShareRequest[]) => {
    queueRef.current = next;
    setShareQueue(next);
    if (key) await AsyncStorage.setItem(`${key}:share-queue`, JSON.stringify(next)).catch(() => undefined);
  }, [key]);

  // Registros, fila de envio e personagem guardados no aparelho (funcionam sem sinal).
  useEffect(() => {
    let alive = true;
    setRecords({}); recordsRef.current = {}; setShareQueue([]); queueRef.current = []; setAvatar(DEFAULT_AVATAR);
    if (!key) return;
    AsyncStorage.multiGet([`${key}:records`, `${key}:share-queue`, `${key}:avatar`]).then(([[, rec], [, queue], [, av]]) => {
      if (!alive) return;
      try { const parsed = rec ? JSON.parse(rec) : {}; if (parsed && typeof parsed === "object") { recordsRef.current = parsed; setRecords(parsed); } } catch { /* cache ilegível: ignora */ }
      try { const q = sanitizeShareQueue(queue ? JSON.parse(queue) : []); queueRef.current = q; setShareQueue(q); } catch { /* idem */ }
      try { if (av) setAvatar(sanitizeAvatar(JSON.parse(av))); } catch { /* idem */ }
    }).catch(() => undefined);
    return () => { alive = false; };
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

  const loadRecords = useCallback(async (teamId: string) => {
    const result = await api.fetchTeamRecords(teamId);
    if (result.error !== null) { setOffline(true); return null; }
    setOffline(false);
    await saveRecords({ ...recordsRef.current, [teamId]: { items: result.data, fetchedAt: new Date().toISOString() } });
    return result.data;
  }, [saveRecords]);

  // Envia a fila: primeiro as fotos (retoma de onde parou), depois o registro. Erro de rede mantém na fila.
  const flushShares = useCallback(async () => {
    if (!available || !account || flushing.current || queueRef.current.length === 0) return;
    flushing.current = true;
    const touched = new Set<string>();
    try {
      for (const original of [...queueRef.current]) {
        const request: ShareRequest = { ...original, uploaded: [...original.uploaded], attempts: original.attempts + 1 };
        let blocked = false;
        for (let i = 0; i < request.localPhotos.length; i++) {
          if (request.uploaded[i]) continue;
          const up = await api.uploadTeamPhoto(request.teamId, account.id, request.opId, i, request.localPhotos[i]);
          if (up.error !== null) {
            if (up.error === "foto local indisponível") { request.uploaded[i] = ""; continue; } // foto sumiu do aparelho: segue sem ela
            blocked = true; request.lastError = up.error; break;
          }
          request.uploaded[i] = up.data;
        }
        if (!blocked) {
          const result = await api.shareTeamRecord(request, request.uploaded.filter((p): p is string => !!p));
          if (result.error === null) { await saveQueue(queueRef.current.filter((q) => q.opId !== request.opId)); touched.add(request.teamId); continue; }
          request.lastError = result.error;
          // Erro definitivo (não é mais da equipe, dados inválidos): sai da fila para não tentar para sempre.
          if (/não é desta equipe|inválid|limite/.test(result.error)) { await saveQueue(queueRef.current.filter((q) => q.opId !== request.opId)); continue; }
        }
        await saveQueue(queueRef.current.map((q) => (q.opId === request.opId ? request : q)));
        setOffline(true);
        break;
      }
    } finally {
      flushing.current = false;
    }
    await Promise.all([...touched].map((teamId) => loadRecords(teamId)));
  }, [available, account, saveQueue, loadRecords]);

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
      await flushShares();
      await Promise.all(result.data.map((team) => loadRecords(team.id)));
      const me = await api.fetchMyAvatar();
      if (me.error === null) { setAvatar(me.data); if (key) await AsyncStorage.setItem(`${key}:avatar`, JSON.stringify(me.data)).catch(() => undefined); }
    } finally {
      setLoading(false);
    }
  }, [available, save, syncSummary, loadOverview, flushShares, loadRecords, key]);

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
    myUserId: account?.id ?? null,
    avatar,
    saveAvatar: async (next) => {
      const result = await api.saveMyAvatar(next);
      if (result.error !== null) return { ok: false, message: "Não foi possível salvar no perfil. Tente novamente quando estiver conectado." };
      setAvatar(next);
      if (key) await AsyncStorage.setItem(`${key}:avatar`, JSON.stringify(next)).catch(() => undefined);
      await Promise.all(cacheRef.current.teams.map((team) => loadOverview(team.id)));

      return { ok: true, message: "Personagem salvo." };
    },
    records,
    loadRecords,
    shareRecord: async (teamId, sighting) => {
      await saveQueue(enqueueShare(queueRef.current, buildShareRequest(sighting, teamId, photosOf(sighting))));
      await flushShares();
      const still = queueRef.current.some((q) => q.teamId === teamId && q.sightingId === sighting.id);
      return still ? { ok: true, message: "Sem internet agora: o registro vai para a equipe assim que o sinal voltar." } : { ok: true, message: "Registro enviado para a equipe." };
    },
    pendingShares: shareQueue,
    editRecord: async (teamId, recordId, description) => {
      const result = await api.updateTeamRecord(recordId, description);
      if (result.error !== null) return { ok: false, message: result.error };
      await loadRecords(teamId);
      return { ok: true };
    },
    removeRecord: async (teamId, recordId) => {
      const result = await api.deleteTeamRecord(recordId);
      if (result.error !== null) return { ok: false, message: result.error };
      await loadRecords(teamId);
      return { ok: true };
    },
    photoUrls: async (paths) => {
      const now = Date.now();
      const missing = paths.filter((p) => !(signed.current[p] && now - signed.current[p].at < 50 * 60 * 1000));
      if (missing.length) {
        const fresh = await api.signTeamPhotos(missing);
        for (const [p, url] of Object.entries(fresh)) signed.current[p] = { url, at: now };
      }
      const out: Record<string, string> = {};
      for (const p of paths) if (signed.current[p]) out[p] = signed.current[p].url;
      return out;
    },
    newCode: async (teamId) => {
      const result = await api.regenerateTeamCode(teamId);
      if (result.error !== null) return { ok: false, message: result.error };
      await afterChange();
      return { ok: true, code: result.data ?? undefined };
    },
  }), [available, cache, loading, offline, refresh, loadOverview, afterChange, save, syncSummary, account, avatar, key, records, loadRecords, saveQueue, flushShares, shareQueue]);

  return <TeamsContext.Provider value={value}>{children}</TeamsContext.Provider>;
}

export function useTeams() {
  const value = useContext(TeamsContext);
  if (!value) throw new Error("useTeams precisa estar dentro de TeamsProvider");
  return value;
}
