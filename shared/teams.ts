/**
 * PantanalDex — Equipes (grupos de campo e de estudo): até 100 pessoas, progresso e conquistas em
 * conjunto e estudo das zonas onde cada espécie foi vista.
 *
 * Esta parte é a lógica pura (testada): o resumo que o aparelho compartilha, a soma da equipe, as
 * conquistas e o cache offline. A conversa com o servidor fica em lib/teams.ts.
 *
 * Privacidade: a equipe recebe só espécies, número de avistamentos e zonas de ~11 km (célula de 0,1°,
 * a mesma do mapa público). Nunca coordenada exata, notas ou fotos.
 *
 * @author Felipe de Souza Aquino
 */
import { roundToPublicLocationGrid } from "./location";
import { UNKNOWN_SPECIES_ID, type Sighting } from "./pantanal";

export const TEAM_MAX_MEMBERS = 100;
export const TEAMS_PER_PERSON = 5;
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sem I, O, 0 e 1 (não confundem no campo)

/** Zona: [espécie, latitude da célula, longitude da célula, quantidade de avistamentos]. */
export type TeamZone = [speciesId: string, cellLat: number, cellLon: number, count: number];

export type TeamSummary = { speciesIds: string[]; sightingsCount: number; zones: TeamZone[] };

export type TeamRole = "owner" | "admin" | "member";
export type TeamInfo = { id: string; name: string; code: string; myRole: TeamRole; members: number; createdAt: string };
export type TeamMember = {
  userId: string; displayName: string; role: TeamRole; joinedAt: string;
  speciesIds: string[]; sightingsCount: number; zones: TeamZone[]; updatedAt: string | null;
};

/** Deixa o código digitado no formato do servidor: maiúsculas, sem espaços e traços. */
export function normalizeTeamCode(value: string): string {
  return value.toUpperCase().replace(/[\s-]/g, "");
}

export function isValidTeamCode(value: string): boolean {
  const code = value.toUpperCase().replace(/[\s-]/g, "");
  return code.length === 8 && [...code].every((ch) => CODE_ALPHABET.includes(ch));
}

/** Mostra o código em dois blocos, mais fácil de ditar: "ABCD-EF23". */
export function formatTeamCode(code: string): string {
  return code.length === 8 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;
}

export function validateTeamName(value: string): string | null {
  const name = value.trim().replace(/\s+/g, " ");
  if (name.length < 2 || name.length > 40) return "O nome da equipe precisa ter de 2 a 40 letras.";
  return null;
}

const cell = (value: number) => Number(roundToPublicLocationGrid(value).toFixed(1));

/**
 * Resumo que este aparelho compartilha com as equipes. Ignora registros "Não sei" e os do caderno
 * Teste (exemplos), e arredonda o local para a célula pública.
 */
export function buildTeamSummary(sightings: readonly Sighting[]): TeamSummary {
  const real = sightings.filter((item) => item.speciesId !== UNKNOWN_SPECIES_ID && item.notebookId !== "teste");
  const species = Array.from(new Set(real.map((item) => item.speciesId))).sort().slice(0, 2000);
  const zones = new Map<string, TeamZone>();
  for (const item of real) {
    if (typeof item.latitude !== "number" || typeof item.longitude !== "number") continue;
    const lat = cell(item.latitude);
    const lon = cell(item.longitude);
    const key = `${item.speciesId}|${lat}|${lon}`;
    const current = zones.get(key);
    const amount = 1;
    if (current) current[3] += amount; else zones.set(key, [item.speciesId, lat, lon, amount]);
  }
  return {
    speciesIds: species,
    sightingsCount: real.length,
    zones: Array.from(zones.values()).sort((a, b) => b[3] - a[3]).slice(0, 3000),
  };
}

/** Assinatura do resumo: só reenvia ao servidor quando algo mudou. */
export function summaryKey(summary: TeamSummary): string {
  return `${summary.sightingsCount}:${summary.speciesIds.join(",")}:${summary.zones.map((z) => z.join("/")).join(";")}`;
}

export type TeamZoneStat = { cellLat: number; cellLon: number; species: number; sightings: number; topSpecies: string[] };

export type TeamProgress = {
  members: number;
  activeMembers: number;
  speciesIds: string[];
  sightings: number;
  zones: TeamZoneStat[];
  ranking: { userId: string; displayName: string; species: number; sightings: number }[];
};

/** Soma a equipe: espécies diferentes de todos, avistamentos, zonas estudadas e ranking. */
export function computeTeamProgress(members: readonly TeamMember[]): TeamProgress {
  const species = new Set<string>();
  const zoneMap = new Map<string, { cellLat: number; cellLon: number; bySpecies: Map<string, number> }>();
  for (const member of members) {
    member.speciesIds.forEach((id) => species.add(id));
    for (const [speciesId, lat, lon, count] of member.zones) {
      const key = `${lat}|${lon}`;
      const zone = zoneMap.get(key) ?? { cellLat: lat, cellLon: lon, bySpecies: new Map<string, number>() };
      zone.bySpecies.set(speciesId, (zone.bySpecies.get(speciesId) ?? 0) + count);
      zoneMap.set(key, zone);
    }
  }
  const zones = Array.from(zoneMap.values()).map((zone) => {
    const sorted = Array.from(zone.bySpecies.entries()).sort((a, b) => b[1] - a[1]);
    return { cellLat: zone.cellLat, cellLon: zone.cellLon, species: sorted.length, sightings: sorted.reduce((sum, [, n]) => sum + n, 0), topSpecies: sorted.slice(0, 3).map(([id]) => id) };
  }).sort((a, b) => b.species - a.species || b.sightings - a.sightings);
  return {
    members: members.length,
    activeMembers: members.filter((member) => member.sightingsCount > 0).length,
    speciesIds: Array.from(species).sort(),
    sightings: members.reduce((sum, member) => sum + member.sightingsCount, 0),
    zones,
    ranking: members.map((member) => ({ userId: member.userId, displayName: member.displayName, species: member.speciesIds.length, sightings: member.sightingsCount }))
      .sort((a, b) => b.species - a.species || b.sightings - a.sightings),
  };
}

export type TeamAchievement = { id: string; title: string; description: string; current: number; target: number; unlocked: boolean };

/** Conquistas da equipe (desbloqueiam com o esforço de todos). */
export function teamAchievements(progress: TeamProgress): TeamAchievement[] {
  const item = (id: string, title: string, description: string, current: number, target: number): TeamAchievement =>
    ({ id, title, description, current: Math.min(current, target), target, unlocked: current >= target });
  return [
    item("time-formado", "Equipe formada", "Ter 5 pessoas na equipe", progress.members, 5),
    item("todos-em-campo", "Todos em campo", "10 pessoas com pelo menos um avistamento", progress.activeMembers, 10),
    item("especies-25", "Primeiros registros", "25 espécies diferentes", progress.speciesIds.length, 25),
    item("especies-100", "Inventário", "100 espécies diferentes", progress.speciesIds.length, 100),
    item("especies-300", "Grande inventário", "300 espécies diferentes", progress.speciesIds.length, 300),
    item("avistamentos-500", "Caderno cheio", "500 avistamentos somados", progress.sightings, 500),
    item("zonas-10", "Mapeadores", "10 zonas de ~11 km estudadas", progress.zones.length, 10),
    item("zonas-50", "Cobertura do Pantanal", "50 zonas de ~11 km estudadas", progress.zones.length, 50),
    item("lotacao", "Equipe completa", `${TEAM_MAX_MEMBERS} pessoas na equipe`, progress.members, TEAM_MAX_MEMBERS),
  ];
}

// ─────────── Cache offline ───────────

export type TeamsCache = {
  version: 1;
  teams: TeamInfo[];
  overview: Record<string, { members: TeamMember[]; fetchedAt: string }>;
  lastSyncedKey: string | null;
  lastSyncedAt: string | null;
};

export const emptyTeamsCache = (): TeamsCache => ({ version: 1, teams: [], overview: {}, lastSyncedKey: null, lastSyncedAt: null });

const isRole = (value: unknown): value is TeamRole => value === "owner" || value === "admin" || value === "member";

/** Lê o cache guardado. Lixo vira cache vazio, nunca erro (o app abre sempre). */
export function restoreTeamsCache(raw: string | null): TeamsCache {
  if (!raw) return emptyTeamsCache();
  try {
    const parsed = JSON.parse(raw) as Partial<TeamsCache>;
    if (parsed.version !== 1 || !Array.isArray(parsed.teams)) return emptyTeamsCache();
    const teams = parsed.teams.filter((t): t is TeamInfo => !!t && typeof t.id === "string" && typeof t.name === "string" && typeof t.code === "string" && isRole(t.myRole)).slice(0, TEAMS_PER_PERSON);
    const overview: TeamsCache["overview"] = {};
    for (const team of teams) {
      const entry = parsed.overview?.[team.id];
      if (entry && Array.isArray(entry.members)) overview[team.id] = { members: entry.members.slice(0, TEAM_MAX_MEMBERS), fetchedAt: String(entry.fetchedAt ?? "") };
    }
    return { version: 1, teams, overview, lastSyncedKey: typeof parsed.lastSyncedKey === "string" ? parsed.lastSyncedKey : null, lastSyncedAt: typeof parsed.lastSyncedAt === "string" ? parsed.lastSyncedAt : null };
  } catch {
    return emptyTeamsCache();
  }
}

/**
 * Junta a lista nova do servidor com o cache. Uma equipe só some da lista quando o servidor
 * respondeu com sucesso e ela não está mais lá (a pessoa saiu ou foi removida). Erro de rede nunca
 * apaga equipes do aparelho.
 */
export function mergeTeamsFromServer(cache: TeamsCache, serverTeams: TeamInfo[] | null): TeamsCache {
  if (serverTeams === null) return cache;
  const ids = new Set(serverTeams.map((team) => team.id));
  const overview = Object.fromEntries(Object.entries(cache.overview).filter(([id]) => ids.has(id)));
  return { ...cache, teams: serverTeams.slice(0, TEAMS_PER_PERSON), overview };
}

/** Mensagem amigável para os erros do servidor. */
export function teamErrorMessage(message: string | undefined): string {
  const text = (message ?? "").toLowerCase();
  if (text.includes("cheia")) return `Esta equipe já tem ${TEAM_MAX_MEMBERS} pessoas.`;
  if (text.includes("não encontrado") || text.includes("nao encontrado")) return "Código não encontrado. Confira as 8 letras e números.";
  if (text.includes("limite de 5")) return `Você já participa de ${TEAMS_PER_PERSON} equipes. Saia de uma para entrar em outra.`;
  if (text.includes("passe a equipe")) return "Você é dono da equipe: passe para outra pessoa antes de sair.";
  if (text.includes("não autenticado")) return "Entre na sua conta para usar equipes.";
  if (text.includes("fetch") || text.includes("network") || text.includes("internet")) return "Sem internet agora. A equipe continua salva no aparelho; tente de novo quando tiver sinal.";
  return "Não deu certo agora. Tente de novo.";
}
