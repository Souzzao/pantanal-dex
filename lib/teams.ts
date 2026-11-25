import { readShareablePhoto } from "@/lib/shareable-photo";
/**
 * PantanalDex — Conversa com o servidor sobre equipes. Cada função devolve null/erro em vez de lançar,
 * para a tela continuar funcionando com o cache quando não há internet.
 *
 * @author Felipe de Souza Aquino
 */
import { supabase } from "@/lib/supabase";
import { recordFromRow, sanitizeAvatar, teamPhotoPath, type Avatar, type ShareRequest, type TeamRecord } from "@/shared/team-records";
import { teamErrorMessage, type TeamInfo, type TeamMember, type TeamRole, type TeamSummary, type TeamZone } from "@/shared/teams";

type Result<T> = { data: T; error: null } | { data: null; error: string };
const fail = (message: string | undefined): { data: null; error: string } => ({ data: null, error: teamErrorMessage(message) });

async function rpc<T>(name: string, args: Record<string, unknown>): Promise<Result<T>> {
  if (!supabase) return fail("não autenticado");
  try {
    const { data, error } = await supabase.rpc(name, args);
    if (error) return fail(error.message);
    return { data: data as T, error: null };
  } catch (error) {
    return fail((error as Error).message || "network");
  }
}

type TeamRow = { team_id: string; name: string; code: string; my_role: TeamRole; members: number; created_at: string };
const toTeam = (row: TeamRow): TeamInfo => ({ id: row.team_id, name: row.name, code: row.code, myRole: row.my_role, members: row.members, createdAt: row.created_at });

export async function fetchMyTeams(): Promise<Result<TeamInfo[]>> {
  const result = await rpc<TeamRow[]>("my_teams", {});
  return result.error !== null ? result : { data: (result.data ?? []).map(toTeam), error: null };
}

type MemberRow = { user_id: string; display_name: string; role: TeamRole; joined_at: string; species_ids: string[]; sightings_count: number; zones: TeamZone[]; updated_at: string | null; avatar?: unknown };

export async function fetchTeamOverview(teamId: string): Promise<Result<TeamMember[]>> {
  const [result, avatars] = await Promise.all([
    rpc<MemberRow[]>("team_overview", { p_team: teamId }),
    rpc<{ user_id: string; avatar: unknown }[]>("team_member_avatars", { p_team: teamId }),
  ]);
  if (result.error !== null) return result;
  const avatarOf = new Map((avatars.data ?? []).map((row) => [row.user_id, row.avatar]));
  return {
    data: (result.data ?? []).map((row) => ({
      userId: row.user_id, displayName: row.display_name, role: row.role, joinedAt: row.joined_at,
      speciesIds: row.species_ids ?? [], sightingsCount: row.sightings_count ?? 0, zones: Array.isArray(row.zones) ? row.zones : [], updatedAt: row.updated_at,
      avatar: sanitizeAvatar(avatarOf.get(row.user_id) ?? row.avatar),
    })),
    error: null,
  };
}

export async function createTeam(name: string): Promise<Result<{ id: string; code: string }>> {
  const result = await rpc<{ team_id: string; code: string }[]>("create_team", { p_name: name.trim().replace(/\s+/g, " ") });
  if (result.error !== null) return result;
  const row = result.data?.[0];
  return row ? { data: { id: row.team_id, code: row.code }, error: null } : fail(undefined);
}

export async function joinTeam(code: string): Promise<Result<{ id: string; name: string; members: number }>> {
  const result = await rpc<{ team_id: string; name: string; members: number }[]>("join_team", { p_code: code });
  if (result.error !== null) return result;
  const row = result.data?.[0];
  return row ? { data: { id: row.team_id, name: row.name, members: row.members }, error: null } : fail(undefined);
}

export const leaveTeam = (teamId: string) => rpc<null>("leave_team", { p_team: teamId });
export const manageTeamMember = (teamId: string, userId: string, action: "remove" | "admin" | "member" | "owner") =>
  rpc<null>("manage_team_member", { p_team: teamId, p_user: userId, p_action: action });
export const regenerateTeamCode = (teamId: string) => rpc<string>("regenerate_team_code", { p_team: teamId });

export const syncTeamStats = (summary: TeamSummary) =>
  rpc<string>("sync_team_stats", { p_species: summary.speciesIds, p_sightings: summary.sightingsCount, p_zones: summary.zones });

// ───────────── Personagem e coleção da equipe ─────────────

export async function fetchMyAvatar(): Promise<Result<Avatar>> {
  const result = await rpc<{ display_name: string; avatar: unknown }[]>("my_profile", {});
  return result.error !== null ? result : { data: sanitizeAvatar(result.data?.[0]?.avatar), error: null };
}

export const saveMyAvatar = (avatar: Avatar) => rpc<unknown>("set_my_avatar", { p_tone: avatar.tone, p_eyes: avatar.eyes, p_item: avatar.item });

export async function fetchTeamRecords(teamId: string): Promise<Result<TeamRecord[]>> {
  const result = await rpc<Parameters<typeof recordFromRow>[0][]>("team_records", { p_team: teamId });
  return result.error !== null ? result : { data: (result.data ?? []).map(recordFromRow), error: null };
}

export const updateTeamRecord = (id: string, description: string) => rpc<null>("update_team_record", { p_id: id, p_description: description, p_photo_paths: null });

export async function deleteTeamRecord(id: string): Promise<Result<null>> {
  const result = await rpc<string[]>("delete_team_record", { p_id: id });
  if (result.error !== null) return result;
  if (supabase && result.data?.length) await supabase.storage.from("team-media").remove(result.data).catch(() => undefined);
  return { data: null, error: null };
}

/** Envia UMA foto para a pasta do autor na equipe. Erro de leitura do arquivo é definitivo (sem tentar de novo). */
export async function uploadTeamPhoto(teamId: string, userId: string, opId: string, index: number, uri: string): Promise<Result<string>> {
  if (!supabase) return fail("não autenticado");
  const path = teamPhotoPath(teamId, userId, opId, index);
  let body: ArrayBuffer;
  try {
    body = await readShareablePhoto(uri);
  } catch {
    return { data: null, error: "foto local indisponível" };
  }
  const { error } = await supabase.storage.from("team-media").upload(path, body, { contentType: "image/jpeg", upsert: false });
  if (error && ("statusCode" in error && String(error.statusCode) === "409" || /already exists/i.test(error.message))) return { data: path, error: null };
  return error ? fail(error.message) : { data: path, error: null };
}

export async function shareTeamRecord(request: ShareRequest, photoPaths: string[]): Promise<Result<{ id: string; number: number }>> {
  const result = await rpc<{ record_id: string; record_number: number }[]>("share_team_record", {
    p_team: request.teamId, p_op: request.opId, p_species: request.speciesId, p_description: request.description, p_observed_on: request.observedOn,
    p_zone_lat: request.zone?.lat ?? null, p_zone_lon: request.zone?.lon ?? null, p_photo_paths: photoPaths,
  });
  if (result.error !== null) return result;
  const row = result.data?.[0];
  return row ? { data: { id: row.record_id, number: row.record_number }, error: null } : fail(undefined);
}

/** Endereços temporários (10 min) das fotos; o Storage confere se quem pede é da equipe. */
export async function signTeamPhotos(paths: string[]): Promise<Record<string, string>> {
  if (!supabase || paths.length === 0) return {};
  try {
    const { data } = await supabase.storage.from("team-media").createSignedUrls(paths, 600);
    const out: Record<string, string> = {};
    for (const item of data ?? []) if (item.path && item.signedUrl) out[item.path] = item.signedUrl;
    return out;
  } catch {
    return {};
  }
}
