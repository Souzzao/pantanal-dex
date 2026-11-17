import { describe, expect, it, vi } from "vitest";
vi.mock("@react-native-async-storage/async-storage", () => ({ default: { getItem: vi.fn(async () => null), setItem: vi.fn(async () => undefined) } }));
import { checkIn, distanceMeters, EXPLORER_TIERS, explorerProgress, sanitizeVisits, TOURIST_SPOTS } from "../shared/tourist-spots";

describe("pontos turísticos (Pokéstops)", () => {
  it("todos os pontos estão dentro do Pantanal, com textos nos 4 idiomas e fonte", () => {
    const ids = new Set<string>();
    for (const s of TOURIST_SPOTS) {
      expect(ids.has(s.id)).toBe(false); ids.add(s.id);
      expect(s.latitude).toBeGreaterThan(-22.5); expect(s.latitude).toBeLessThan(-15.0);
      expect(s.longitude).toBeGreaterThan(-58.5); expect(s.longitude).toBeLessThan(-54.0);
      for (const l of ["pt", "en", "es", "de"] as const) { expect(s.name[l].length).toBeGreaterThan(2); expect(s.about[l].length).toBeGreaterThan(20); }
      expect(s.source).toMatch(/^https:\/\//);
    }
  });
  it("distância de Poconé a Porto Jofre é de uns 120 km", () => {
    const [a, b] = ["pocone", "porto-jofre"].map((id) => TOURIST_SPOTS.find((s) => s.id === id)!);
    expect(distanceMeters(a, b) / 1000).toBeGreaterThan(110);
    expect(distanceMeters(a, b) / 1000).toBeLessThan(130);
  });
  it("check-in só vale perto e com GPS preciso", () => {
    const s = TOURIST_SPOTS.find((x) => x.id === "cristo-rei")!;
    expect(checkIn(s, { latitude: s.latitude + 0.001, longitude: s.longitude, accuracy: 15 }).ok).toBe(true);
    expect(checkIn(s, { latitude: s.latitude + 0.05, longitude: s.longitude, accuracy: 15 })).toMatchObject({ ok: false, reason: "far" });
    expect(checkIn(s, { latitude: s.latitude, longitude: s.longitude, accuracy: 900 })).toMatchObject({ ok: false, reason: "accuracy" });
  });
  it("níveis de explorador e visitas inválidas descartadas", () => {
    const at = "2026-11-17T12:00:00.000Z";
    const v = sanitizeVisits({ pocone: at, "porto-jofre": at, inventado: at, caceres: "ontem" });
    expect(Object.keys(v)).toEqual(["pocone", "porto-jofre"]);
    expect(explorerProgress(v).tier).toBeNull();
    const three = { ...v, caceres: at };
    expect(explorerProgress(three).tier?.id).toBe("bronze");
    const all = Object.fromEntries(TOURIST_SPOTS.map((s) => [s.id, at]));
    expect(explorerProgress(all).tier?.id).toBe("ouro");
    expect(EXPLORER_TIERS[2].need).toBe(TOURIST_SPOTS.length);
    expect(explorerProgress(all).allCities).toBe(true);
    expect(explorerProgress(three).citiesTotal).toBe(16);
  });
});
