import { getActiveLocale, translateUi, type Locale } from './i18n';

/**
 * Mapa de ruas (OpenStreetMap) desenhado com Leaflet dentro de uma WebView (Android/iOS) ou de um
 * iframe (web). Sem chave de API. Precisa de internet para baixar os "azulejos" (tiles) do mapa;
 * sem internet, a tela oferece o mapa offline antigo (contornos).
 *
 * Este arquivo é puro (sem React) para poder ser testado: monta o HTML e define as mensagens
 * trocadas entre o app e a página do mapa.
 */

export type MapMode = "public" | "pick" | "points";

/** Ponto enviado ao mapa. No modo público as coordenadas já vêm generalizadas (célula de 0,1°). */
export type StreetMapPoint = { id: string; latitude: number; longitude: number; label?: string; /** Ainda não verificado por um auditor. */ pending?: boolean };

export type StreetMapState = {
  mode: MapMode;
  points: StreetMapPoint[];
  /** Modo "pick": ponto escolhido (exato, fica só no aparelho). */
  pick: { latitude: number; longitude: number } | null;
  /** Ids destacados (área selecionada no modo público). */
  selectedIds: string[];
  /** A partir de quantos registros a área vira "alta incidência". */
  highIncidenceMin: number;
  /** Mude o número para pedir ao mapa que enquadre todos os pontos de novo. */
  fitKey: number;
  /** Textos curtos usados dentro do mapa (idioma do app). */
  labels: { high: string; records: (count: number) => string; pickHint: string };
};

/** Mensagens que a página do mapa manda para o app. */
export type StreetMapEvent =
  | { type: "ready" }
  | { type: "select"; ids: string[] }
  | { type: "pick"; latitude: number; longitude: number }
  | { type: "open"; id: string }
  | { type: "tiles"; ok: boolean };

export function parseStreetMapEvent(raw: unknown): StreetMapEvent | null {
  let data: unknown = raw;
  if (typeof raw === "string") {
    try {
      data = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!data || typeof data !== "object") return null;
  const event = data as Record<string, unknown>;
  if (event.source !== "pantanal-dex-map") return null;
  switch (event.type) {
    case "ready":
      return { type: "ready" };
    case "select":
      return Array.isArray(event.ids) ? { type: "select", ids: event.ids.filter((id): id is string => typeof id === "string") } : null;
    case "pick": {
      const latitude = Number(event.latitude);
      const longitude = Number(event.longitude);
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90) return null;
      // Leaflet permite dar a volta no mundo: normaliza a longitude para -180..180.
      const wrapped = ((((longitude + 180) % 360) + 360) % 360) - 180;
      return { type: "pick", latitude, longitude: wrapped };
    }
    case "open":
      return typeof event.id === "string" ? { type: "open", id: event.id } : null;
    case "tiles":
      return { type: "tiles", ok: event.ok === true };
    default:
      return null;
  }
}

/** Estado serializável para a página (as funções de texto viram valores prontos). */
export function serializeState(state: StreetMapState, locale: Locale = getActiveLocale()): string {
  return JSON.stringify({
    mode: state.mode,
    points: state.points.filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude)).map((p) => ({ id: p.id, lat: p.latitude, lon: p.longitude, label: p.label ?? "", pending: p.pending === true })),
    pick: state.pick ? { lat: state.pick.latitude, lon: state.pick.longitude } : null,
    selectedIds: state.selectedIds,
    highMin: state.highIncidenceMin,
    fitKey: state.fitKey,
    labels: { high: translateUi(state.labels.high, locale), one: translateUi(state.labels.records(1), locale), many: translateUi(state.labels.records(2), locale).replace(/\d+/, "{n}"), pickHint: translateUi(state.labels.pickHint, locale), layers: translateUi('Nomes', locale), satellite: translateUi('Satélite', locale), borders: translateUi('Nomes e divisas', locale), zoomIn: translateUi('Zoom in', locale), zoomOut: translateUi('Zoom out', locale) },
  });
}

/**
 * Mapa de satélite: mosaico Sentinel-2 sem nuvens (EOxCloudless 2024, EOX IT Services), grátis para
 * uso não comercial com crédito (CC BY-NC-SA 4.0). Resolução de 10 m: mostra rios, matas e áreas
 * alagadas; além do zoom 14 a imagem é ampliada (fica borrada, sem telhados).
 * Por cima, uma camada opcional de nomes e divisas (dados do OpenStreetMap, desenho da EOX).
 */
export const TILE_LAYERS = [
  {
    id: "satelite",
    name: "Satélite",
    url: "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2024_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.jpg",
    attribution: '<a href="https://cloudless.eox.at">EOxCloudless</a> by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2024)',
    maxNativeZoom: 14,
    maxZoom: 17,
    overlay: false,
  },
  {
    id: "nomes",
    name: "Nomes e divisas",
    url: "https://tiles.maps.eox.at/wmts/1.0.0/overlay_3857/default/GoogleMapsCompatible/{z}/{y}/{x}.png",
    attribution: 'Nomes: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, desenho EOX',
    maxNativeZoom: 16,
    maxZoom: 17,
    overlay: true,
  },
] as const;

const PAGE_SCRIPT = String.raw`
(function () {
  var SOURCE = "pantanal-dex-map";
  function send(msg) {
    msg.source = SOURCE;
    var text = JSON.stringify(msg);
    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(text);
    else if (window.parent && window.parent !== window) window.parent.postMessage(text, "*");
  }

  var map = L.map("map", { zoomControl: false, worldCopyJump: true, minZoom: 2, maxZoom: 17, attributionControl: true }).setView([-17.5, -57.0], 6);
  L.control.zoom({ position: "bottomright" }).addTo(map);

  var base = {}, overlays = {};
  LAYERS.forEach(function (layer) {
    var tiles = L.tileLayer(layer.url, { maxZoom: layer.maxZoom, maxNativeZoom: layer.maxNativeZoom, attribution: layer.attribution });
    if (layer.overlay) overlays[layer.name] = tiles; else base[layer.name] = tiles;
    tiles.addTo(map);
  });
  L.control.layers(base, overlays, { position: "bottomright" }).addTo(map);

  // Avisa o app se os azulejos não carregam (sem internet), para ele oferecer o mapa offline.
  var loaded = 0, failed = 0, reported = null;
  map.on("baselayerchange", function () { loaded = 0; failed = 0; reported = null; });
  Object.keys(base).forEach(function (name) {
    base[name].on("tileload", function () { loaded++; if (reported !== true) { reported = true; send({ type: "tiles", ok: true }); } });
    base[name].on("tileerror", function () { failed++; if (loaded === 0 && failed >= 4 && reported !== false) { reported = false; send({ type: "tiles", ok: false }); } });
  });

  var state = null, lastFit = null, overlay = L.layerGroup().addTo(map), pickMarker = null;

  function esc(text) { return String(text).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function countLabel(n) { return n === 1 ? state.labels.one : state.labels.many.replace("{n}", String(n)); }

  function fitAll() {
    var pts = state.mode === "pick" && state.pick ? [[state.pick.lat, state.pick.lon]] : state.points.map(function (p) { return [p.lat, p.lon]; });
    if (!pts.length) return;
    if (pts.length === 1) map.setView(pts[0], state.mode === "pick" ? 14 : 9);
    else map.fitBounds(L.latLngBounds(pts).pad(0.25), { maxZoom: 11 });
  }

  // Agrupa registros próximos na tela (raio de ~56 px, muda com o zoom). Com zoom alto, cada
  // célula pública de 0,1° vira um quadrado (o registro nunca aparece como ponto exato).
  function drawPublic() {
    var zoom = map.getZoom();
    var radius = 56, groups = {};
    var cellMode = zoom >= 10;
    if (cellMode) {
      state.points.forEach(function (p) { var key = p.lat.toFixed(1) + ":" + p.lon.toFixed(1); (groups[key] = groups[key] || []).push(p); });
    } else {
      var clusters = [];
      state.points.forEach(function (p) {
        var pt = map.project([p.lat, p.lon], zoom), best = null, bestDistance = radius;
        clusters.forEach(function (c) { var d = Math.sqrt(Math.pow(c.x - pt.x, 2) + Math.pow(c.y - pt.y, 2)); if (d < bestDistance) { best = c; bestDistance = d; } });
        if (best) { best.items.push(p); best.x = (best.x * (best.items.length - 1) + pt.x) / best.items.length; best.y = (best.y * (best.items.length - 1) + pt.y) / best.items.length; }
        else clusters.push({ x: pt.x, y: pt.y, items: [p] });
      });
      clusters.forEach(function (c, index) { groups["c" + index] = c.items; });
    }
    var selected = {}; state.selectedIds.forEach(function (id) { selected[id] = true; });
    Object.keys(groups).forEach(function (key) {
      var items = groups[key];
      var lat = 0, lon = 0; items.forEach(function (p) { lat += p.lat; lon += p.lon; });
      lat /= items.length; lon /= items.length;
      var high = items.length >= state.highMin;
      var isSelected = items.some(function (p) { return selected[p.id]; });
      var color = high ? "#C2410C" : "#195946";
      var ids = items.map(function (p) { return p.id; });
      var title = countLabel(items.length) + (high ? " · " + state.labels.high : "");
      if (cellMode) {
        var c = items[0], h = 0.05;
        L.rectangle([[c.lat - h, c.lon - h], [c.lat + h, c.lon + h]], { color: isSelected ? "#FACC15" : "#ffffff", weight: isSelected ? 4 : 2, fillColor: color, fillOpacity: high ? 0.45 : 0.32 })
          .on("click", function () { send({ type: "select", ids: ids }); }).addTo(overlay);
      }
      var size = Math.min(58, 30 + Math.round(Math.sqrt(items.length) * 6));
      var allPending = items.every(function (p) { return p.pending; });
      var html = '<div class="bubble' + (high ? " high" : "") + (allPending ? " pending" : "") + (isSelected ? " sel" : "") + '" style="width:' + size + "px;height:" + size + "px;line-height:" + size + 'px">' + items.length + "</div>";
      L.marker([lat, lon], { icon: L.divIcon({ html: html, className: "", iconSize: [size, size] }), title: title, keyboard: true })
        .on("click", function () { send({ type: "select", ids: ids }); }).addTo(overlay);
    });
  }

  function drawPoints() {
    state.points.forEach(function (p) {
      L.circleMarker([p.lat, p.lon], { radius: 9, color: "#fff", weight: 2, fillColor: "#195946", fillOpacity: 1 })
        .bindTooltip(esc(p.label || ""), { direction: "top" })
        .on("click", function () { send({ type: "open", id: p.id }); }).addTo(overlay);
    });
  }

  function drawPick() {
    if (state.pick) {
      var at = [state.pick.lat, state.pick.lon];
      if (!pickMarker) {
        pickMarker = L.marker(at, { draggable: true, icon: L.divIcon({ html: '<div class="pin"></div>', className: "", iconSize: [26, 26], iconAnchor: [13, 26] }) }).addTo(map);
        pickMarker.on("dragend", function () { var ll = pickMarker.getLatLng(); send({ type: "pick", latitude: ll.lat, longitude: ll.lng }); });
      } else pickMarker.setLatLng(at);
    } else if (pickMarker) { map.removeLayer(pickMarker); pickMarker = null; }
    document.getElementById("hint").style.display = state.pick ? "none" : "block";
  }

  function render() {
    if (!state) return;
    overlay.clearLayers();
    if (state.mode === "public") drawPublic();
    else if (state.mode === "points") drawPoints();
    if (state.mode === "pick") drawPick();
    if (lastFit !== state.fitKey) { lastFit = state.fitKey; fitAll(); }
  }

  map.on("zoomend", function () { if (state && state.mode === "public") render(); });
  map.on("click", function (event) {
    if (!state) return;
    if (state.mode === "pick") send({ type: "pick", latitude: event.latlng.lat, longitude: event.latlng.lng });
    else if (state.mode === "public") send({ type: "select", ids: [] });
  });

  window.__pantanalSetState = function (next) {
    state = typeof next === "string" ? JSON.parse(next) : next;
    var toggle = document.querySelector('.leaflet-control-layers-toggle');
    if (toggle) { toggle.setAttribute('data-label', state.labels.layers); toggle.title = state.labels.layers; }
    var zoomIn = document.querySelector('.leaflet-control-zoom-in'), zoomOut = document.querySelector('.leaflet-control-zoom-out');
    if (zoomIn) { zoomIn.title = state.labels.zoomIn; zoomIn.setAttribute('aria-label', state.labels.zoomIn); }
    if (zoomOut) { zoomOut.title = state.labels.zoomOut; zoomOut.setAttribute('aria-label', state.labels.zoomOut); }
    document.querySelectorAll('.leaflet-control-layers label span span').forEach(function (label) {
      var value = label.textContent.trim();
      if (value === 'Satélite') label.textContent = state.labels.satellite;
      if (value === 'Nomes e divisas') label.textContent = state.labels.borders;
    });
    document.getElementById("hint").textContent = state.labels.pickHint;
    if (state.mode !== "pick") document.getElementById("hint").style.display = "none";
    render();
  };
  window.addEventListener("message", function (event) {
    var data = event.data;
    try { if (typeof data === "string") data = JSON.parse(data); } catch (e) { return; }
    if (data && data.target === SOURCE && data.state) window.__pantanalSetState(data.state);
  });
  send({ type: "ready" });
})();
`;

const PAGE_CSS = `
html,body,#map{margin:0;padding:0;height:100%;width:100%;background:#0b1d2a;font-family:-apple-system,Roboto,"Segoe UI",sans-serif}
.bubble{border-radius:50%;background:#195946;color:#fff;font-weight:800;font-size:14px;text-align:center;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);box-sizing:border-box}
.bubble.high{background:#C2410C}
.bubble.pending{border-style:dashed;opacity:.85}
.bubble.sel{border-color:#FACC15;border-width:4px}
.pin{width:26px;height:26px;border-radius:50% 50% 50% 0;background:#ca6137;border:3px solid #fff;transform:rotate(-45deg);box-shadow:0 2px 6px rgba(0,0,0,.4);box-sizing:border-box}
#hint{position:absolute;z-index:1000;left:12px;right:120px;top:12px;background:rgba(25,89,70,.92);color:#fff;padding:8px 14px;border-radius:999px;font-size:14px;font-weight:700;display:none;pointer-events:none;text-align:center}
.leaflet-control-layers-toggle{background-image:none!important;width:auto!important;height:40px!important;padding:0 12px;line-height:40px;color:#195946;font-weight:800;font-size:13px;text-decoration:none}
.leaflet-control-layers-toggle::after{content:attr(data-label)}
.leaflet-control-layers label{font-size:15px;padding:4px 2px}
.leaflet-control-attribution{font-size:9px;line-height:1.25;max-width:100%;background:rgba(255,255,255,.75)!important}
.leaflet-touch .leaflet-bar a{width:40px;height:40px;line-height:40px;font-size:20px}
`;

/** HTML completo da página do mapa, com o Leaflet embutido (nada de código vindo de CDN). */
export function buildStreetMapHtml(leaflet: { js: string; css: string }): string {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>${leaflet.css}</style><style>${PAGE_CSS}</style></head>
<body><div id="map"></div><div id="hint"></div>
<script>${leaflet.js}</script>
<script>var LAYERS = ${JSON.stringify(TILE_LAYERS)};</script>
<script>${PAGE_SCRIPT}</script>
</body></html>`;
}
