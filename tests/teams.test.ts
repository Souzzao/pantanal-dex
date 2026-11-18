import { describe, expect, it } from "vitest";

import {
  buildTeamSummary, computeTeamProgress, emptyTeamsCache, formatTeamCode, isValidTeamCode, mergeTeamsFromServer, normalizeTeamCode,
  restoreTeamsCache, summaryKey, TEAM_MAX_MEMBERS, teamAchievements, teamErrorMessage, validateTeamName, type TeamInfo, type TeamMember,
} from "../shared/teams";
import type { Sighting } from "../shared/pantanal";

const s = (id: string, speciesId: string, lat?: number, lon?: number, extra: Partial<Sighting> = {}): Sighting => ({
  id, speciesId, date: "2026-11-10", latitude: lat, longitude: lon, locationPrecision: lat === undefined ? "none" : "exact",
  visibility: "private", createdAt: "2026-11-10T11:00:00Z", updatedAt: "2026-11-10T11:00:00Z", ...extra,
});
const member = (userId: string, speciesIds: string[], sightingsCount: number, zones: TeamMember["zones"] = []): TeamMember =>
  ({ userId, displayName: userId.toUpperCase(), role: "member", joinedAt: "2026-11-18T00:00:00Z", speciesIds, sightingsCount, zones, updatedAt: null });
const team = (id: string): TeamInfo => ({ id, name: `Equipe ${id}`, code: "ABCDEF23", myRole: "member", members: 3, createdAt: "2026-11-18T00:00:00Z" });

describe("código e nome da equipe", () => {
  it("aceita o código com traço, espaço ou minúsculas e recusa letras confusas", () => {
    expect(normalizeTeamCode(" abcd-ef23 ")).toBe("ABCDEF23");
    expect(isValidTeamCode("abcd-ef23")).toBe(true);
    expect(isValidTeamCode("ABCDEFO1")).toBe(false); // O e 1 não existem nos códigos
    expect(isValidTeamCode("ABC")).toBe(false);
    expect(formatTeamCode("ABCDEF23")).toBe("ABCD-EF23");
    expect(validateTeamName("A")).toMatch(/2 a 40/);
    expect(validateTeamName("  Expedição   Poconé ")).toBeNull();
  });
});

describe("resumo compartilhado com a equipe", () => {
  it("só espécies, contagem e zonas de 0,1° — nunca o ponto exato", () => {
    const summary = buildTeamSummary([
      s("1", "tuiuiu", -16.5234, -56.7111), s("2", "tuiuiu", -16.5301, -56.6999), s("3", "capivara", -17.01, -57.2),
      s("4", "unknown", -16.5, -56.7), s("5", "anta", undefined, undefined), s("6", "onca-pintada", -16.5, -56.7, { notebookId: "teste" }),
    ]);
    expect(summary.speciesIds).toEqual(["anta", "capivara", "tuiuiu"]);
    expect(summary.sightingsCount).toBe(4);
    expect(summary.zones).toContainEqual(["tuiuiu", -16.5, -56.7, 2]);
    expect(summary.zones.every(([, lat, lon]) => Number(lat.toFixed(1)) === lat && Number(lon.toFixed(1)) === lon)).toBe(true);
    expect(JSON.stringify(summary)).not.toContain("-16.5234");
  });

  it("assinatura muda só quando o resumo muda (evita reenviar à toa)", () => {
    const a = buildTeamSummary([s("1", "tuiuiu", -16.5, -56.7)]);
    expect(summaryKey(a)).toBe(summaryKey(buildTeamSummary([s("9", "tuiuiu", -16.52, -56.71)])));
    expect(summaryKey(a)).not.toBe(summaryKey(buildTeamSummary([s("1", "tuiuiu", -16.5, -56.7), s("2", "anta", -16.5, -56.7)])));
  });
});

describe("progresso e conquistas da equipe", () => {
  it("soma espécies diferentes, avistamentos, zonas e ranking", () => {
    const progress = computeTeamProgress([
      member("a", ["tuiuiu", "anta"], 5, [["tuiuiu", -16.5, -56.7, 3], ["anta", -16.5, -56.7, 2]]),
      member("b", ["tuiuiu", "capivara"], 2, [["capivara", -17, -57.2, 2]]),
      member("c", [], 0),
    ]);
    expect(progress.speciesIds).toEqual(["anta", "capivara", "tuiuiu"]);
    expect(progress.sightings).toBe(7);
    expect(progress.activeMembers).toBe(2);
    expect(progress.zones[0]).toMatchObject({ cellLat: -16.5, cellLon: -56.7, species: 2, sightings: 5, topSpecies: ["tuiuiu", "anta"] });
    expect(progress.ranking.map((r) => r.userId)).toEqual(["a", "b", "c"]);
  });

  it("conquistas desbloqueiam com o esforço de todos e a maior é a equipe completa de 100", () => {
    const many = Array.from({ length: TEAM_MAX_MEMBERS }, (_, i) => member(`m${i}`, [`sp-${i % 30}`], 6, [[`sp-${i % 30}`, -16 - (i % 12) / 10, -56, 1]]));
    const list = teamAchievements(computeTeamProgress(many));
    const byId = Object.fromEntries(list.map((a) => [a.id, a]));
    expect(byId["time-formado"].unlocked).toBe(true);
    expect(byId["especies-25"].unlocked).toBe(true);
    expect(byId["especies-100"].unlocked).toBe(false);
    expect(byId["zonas-10"].unlocked).toBe(true);
    expect(byId["lotacao"]).toMatchObject({ target: 100, unlocked: true });
    expect(list.every((a) => a.current <= a.target)).toBe(true);
  });
});

describe("offline: ninguém sai da equipe sem querer", () => {
  it("erro de rede (null) nunca apaga equipes do aparelho", () => {
    const cache = { ...emptyTeamsCache(), teams: [team("x"), team("y")], overview: { x: { members: [member("a", [], 0)], fetchedAt: "t" } } };
    expect(mergeTeamsFromServer(cache, null)).toBe(cache);
  });

  it("só tira a equipe quando o servidor confirmou que a pessoa não está mais nela", () => {
    const cache = { ...emptyTeamsCache(), teams: [team("x"), team("y")], overview: { x: { members: [], fetchedAt: "t" }, y: { members: [], fetchedAt: "t" } } };
    const next = mergeTeamsFromServer(cache, [team("y")]);
    expect(next.teams.map((t) => t.id)).toEqual(["y"]);
    expect(Object.keys(next.overview)).toEqual(["y"]);
  });

  it("cache corrompido abre vazio sem quebrar e cache bom volta igual", () => {
    expect(restoreTeamsCache("{lixo")).toEqual(emptyTeamsCache());
    const good = { ...emptyTeamsCache(), teams: [team("x")], overview: { x: { members: [member("a", ["tuiuiu"], 1)], fetchedAt: "2026" } }, lastSyncedKey: "k", lastSyncedAt: "2026" };
    expect(restoreTeamsCache(JSON.stringify(good))).toEqual(good);
  });

  it("mensagens claras para equipe cheia, código errado e falta de internet", () => {
    expect(teamErrorMessage("equipe cheia (100 pessoas)")).toMatch(/100 pessoas/);
    expect(teamErrorMessage("código de equipe não encontrado")).toMatch(/Código não encontrado/);
    expect(teamErrorMessage("TypeError: Network request failed")).toMatch(/Sem internet/);
  });
});
