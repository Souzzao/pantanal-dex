/**
 * PantanalDex — Conversa com o servidor sobre equipes. Cada função devolve null/erro em vez de lançar,
 * para a tela continuar funcionando com o cache quando não há internet.
 *
 * @author Felipe de Souza Aquino
 */
import { supabase } from "@/lib/supabase";
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

type MemberRow = { user_id: string; display_name: string; role: TeamRole; joined_at: string; species_ids: string[]; sightings_count: number; zones: TeamZone[]; updated_at: string | null };

export async function fetchTeamOverview(teamId: string): Promise<Result<TeamMember[]>> {
  const result = await rpc<MemberRow[]>("team_overview", { p_team: teamId });
  if (result.error !== null) return result;
  return {
    data: (result.data ?? []).map((row) => ({
      userId: row.user_id, displayName: row.display_name, role: row.role, joinedAt: row.joined_at,
      speciesIds: row.species_ids ?? [], sightingsCount: row.sightings_count ?? 0, zones: Array.isArray(row.zones) ? row.zones : [], updatedAt: row.updated_at,
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
