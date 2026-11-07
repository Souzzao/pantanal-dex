import { describe, expect, it } from "vitest";

import { LEAFLET_CSS, LEAFLET_JS, LEAFLET_VERSION } from "../shared/leaflet-assets";
import { buildStreetMapHtml, parseStreetMapEvent, serializeState, TILE_LAYERS, type StreetMapState } from "../shared/street-map";

const state: StreetMapState = {
  mode: "public",
  points: [{ id: "a", latitude: -16.4, longitude: -56.9 }, { id: "b", latitude: Number.NaN, longitude: 0 }],
  pick: null,
  selectedIds: ["a"],
  highIncidenceMin: 5,
  fitKey: 3,
  labels: { high: "alta incidência", records: (n) => `${n} ${n === 1 ? "registro" : "registros"}`, pickHint: "Toque" },
};

describe("página do mapa de ruas", () => {
  const html = buildStreetMapHtml({ js: LEAFLET_JS, css: LEAFLET_CSS });

  it("traz o Leaflet embutido e não carrega código de fora", () => {
    expect(LEAFLET_VERSION).toBe("1.9.4");
    expect(html).toContain("<!doctype html>");
    expect(html).not.toMatch(/<script[^>]+src=/i);
    expect(html).not.toMatch(/<link[^>]+href=/i);
    // O código embutido não pode fechar a tag <script> antes da hora.
    expect(LEAFLET_JS.toLowerCase()).not.toContain("</script");
  });

  it("usa satélite Sentinel-2 com crédito e nomes como camada opcional", () => {
    const [satellite, names] = TILE_LAYERS;
    expect(satellite.overlay).toBe(false);
    expect(satellite.attribution).toContain("Copernicus Sentinel data 2024");
    expect(names.overlay).toBe(true);
    expect(names.attribution).toContain("OpenStreetMap");
    for (const layer of TILE_LAYERS) {
      expect(layer.url.startsWith("https://")).toBe(true);
      expect(html).toContain(layer.url);
    }
  });
});

describe("mensagens do mapa", () => {
  it("aceita só mensagens marcadas como do mapa", () => {
    expect(parseStreetMapEvent(JSON.stringify({ source: "pantanal-dex-map", type: "ready" }))).toEqual({ type: "ready" });
    expect(parseStreetMapEvent(JSON.stringify({ type: "ready" }))).toBeNull();
    expect(parseStreetMapEvent("{quebrado")).toBeNull();
    expect(parseStreetMapEvent({ source: "pantanal-dex-map", type: "select", ids: ["a", 3, "b"] })).toEqual({ type: "select", ids: ["a", "b"] });
  });

  it("normaliza a longitude quando o mapa dá a volta no mundo", () => {
    const event = parseStreetMapEvent({ source: "pantanal-dex-map", type: "pick", latitude: -16.5, longitude: -56.8 + 360 });
    expect(event?.type).toBe("pick");
    if (event?.type === "pick") expect(event.longitude).toBeCloseTo(-56.8, 6);
    expect(parseStreetMapEvent({ source: "pantanal-dex-map", type: "pick", latitude: 120, longitude: 0 })).toBeNull();
  });

  it("serializa o estado sem pontos inválidos e com os textos prontos", () => {
    const parsed = JSON.parse(serializeState(state));
    expect(parsed.points).toEqual([{ id: "a", lat: -16.4, lon: -56.9, label: "", pending: false }]);
    expect(parsed.labels.one).toBe("1 registro");
    expect(parsed.labels.many).toBe("{n} registros");
    expect(parsed.fitKey).toBe(3);
  });
});
