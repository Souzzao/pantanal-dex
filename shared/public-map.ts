import type { Sighting, Species } from "./pantanal";

/** Data local AAAA-MM-DD (mesma regra do caderno; local para não depender da ordem dos merges). */
function getLocalTodayISODate(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Mapa público do PantanalDex.
 *
 * - "Público" = avistamento marcado como compartilhável (`visibility: "shareable"`) com uma publicação ativa.
 *   A publicação fica guardada à parte (não altera o contrato `Sighting`).
 * - A pessoa escolhe por quanto tempo o registro fica público e pode encerrar ou renovar.
 * - No mapa público nunca vai a coordenada exata: só o centro da célula de 0,1° (~11 km), regra RN03.
 * - Registros próximos são agrupados; áreas com muitos registros aparecem como "alta incidência".
 * - Funciona para qualquer lugar do mundo: o Pantanal é só o recorte do catálogo do MVP.
 */

// ───────────────────────────── Duração das publicações ─────────────────────────────

export type PublicDurationId = "1d" | "7d" | "30d" | "90d" | "365d" | "forever";

export const PUBLIC_DURATIONS: readonly { id: PublicDurationId; days: number | null }[] = [
  { id: "1d", days: 1 },
  { id: "7d", days: 7 },
  { id: "30d", days: 30 },
  { id: "90d", days: 90 },
  { id: "365d", days: 365 },
  { id: "forever", days: null },
];

export const DEFAULT_PUBLIC_DURATION: PublicDurationId = "30d";
const DAY_MS = 24 * 60 * 60 * 1000;

export type Publication = {
  sightingId: string;
  publishedAt: string;
  /** `null` = sem prazo. */
  expiresAt: string | null;
  /** Preenchido quando a pessoa encerra a publicação antes do prazo. */
  endedAt: string | null;
};

export type PublicationStore = { version: 1; items: Record<string, Publication> };
export const PUBLICATION_STORE_VERSION = 1;

export function createPublicationStore(): PublicationStore {
  return { version: PUBLICATION_STORE_VERSION, items: {} };
}

function isIsoDateTime(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(new Date(value).getTime());
}

export function expiryFor(durationId: PublicDurationId, now: Date): string | null {
  const duration = PUBLIC_DURATIONS.find((item) => item.id === durationId);
  if (!duration) throw new RangeError(`Duração desconhecida: ${durationId}`);
  return duration.days === null ? null : new Date(now.getTime() + duration.days * DAY_MS).toISOString();
}

/** Publica (ou renova) um avistamento pelo prazo escolhido, a partir de agora. */
export function publishSighting(store: PublicationStore, sightingId: string, durationId: PublicDurationId, now: Date): PublicationStore {
  const publication: Publication = { sightingId, publishedAt: now.toISOString(), expiresAt: expiryFor(durationId, now), endedAt: null };
  return { ...store, items: { ...store.items, [sightingId]: publication } };
}

/** Encerra antes do prazo. O histórico (quando foi publicado) é mantido. */
export function endPublication(store: PublicationStore, sightingId: string, now: Date): PublicationStore {
  const current = store.items[sightingId];
  if (!current || current.endedAt) return store;
  return { ...store, items: { ...store.items, [sightingId]: { ...current, endedAt: now.toISOString() } } };
}

/** Remove publicações de avistamentos que não existem mais no caderno. */
export function prunePublications(store: PublicationStore, existingIds: Iterable<string>): PublicationStore {
  const keep = new Set(existingIds);
  const items = Object.fromEntries(Object.entries(store.items).filter(([id]) => keep.has(id)));
  return Object.keys(items).length === Object.keys(store.items).length ? store : { ...store, items };
}

export function serializePublicationStore(store: PublicationStore): string {
  return JSON.stringify(store);
}

export function restorePublicationStore(raw: string | null): { store: PublicationStore; status: "empty" | "restored" | "corrupted" } {
  if (!raw) return { store: createPublicationStore(), status: "empty" };
  try {
    const parsed = JSON.parse(raw) as { version?: unknown; items?: unknown };
    if (!parsed || parsed.version !== PUBLICATION_STORE_VERSION || !parsed.items || typeof parsed.items !== "object" || Array.isArray(parsed.items)) {
      return { store: createPublicationStore(), status: "corrupted" };
    }
    const items: Record<string, Publication> = {};
    for (const [id, value] of Object.entries(parsed.items as Record<string, unknown>)) {
      const item = value as Partial<Publication>;
      if (!item || item.sightingId !== id || !isIsoDateTime(item.publishedAt)) continue;
      if (item.expiresAt !== null && !isIsoDateTime(item.expiresAt)) continue;
      if (item.endedAt != null && !isIsoDateTime(item.endedAt)) continue;
      items[id] = { sightingId: id, publishedAt: item.publishedAt, expiresAt: item.expiresAt ?? null, endedAt: item.endedAt ?? null };
    }
    return { store: { version: PUBLICATION_STORE_VERSION, items }, status: "restored" };
  } catch {
    return { store: createPublicationStore(), status: "corrupted" };
  }
}

export type PublicationStatus = "private" | "no-location" | "not-published" | "active" | "expired" | "ended";

export function publicationStatus(sighting: Sighting, publication: Publication | undefined, now: Date): PublicationStatus {
  if (sighting.visibility !== "shareable") return "private";
  if (!hasValidCoordinates(sighting)) return "no-location";
  if (!publication) return "not-published";
  if (publication.endedAt) return "ended";
  if (publication.expiresAt && new Date(publication.expiresAt).getTime() <= now.getTime()) return "expired";
  return "active";
}

// ───────────────────────────── Registros públicos ─────────────────────────────

export const PUBLIC_CELL_DEGREES = 0.1;

export type PublicRecord = {
  id: string;
  speciesId: string;
  date: string;
  time?: string;
  /** Centro da célula de 0,1°: nunca a coordenada exata. */
  latitude: number;
  longitude: number;
  publishedAt: string;
  expiresAt: string | null;
  /** "me" = deste aparelho; "others" = de outras pessoas (servidor ou exemplo). */
  owner: "me" | "others";
  /** Registro de demonstração, sempre identificado como exemplo na interface. */
  sample?: boolean;
};

function hasValidCoordinates(sighting: Pick<Sighting, "latitude" | "longitude">): sighting is { latitude: number; longitude: number } {
  return typeof sighting.latitude === "number" && typeof sighting.longitude === "number" &&
    Number.isFinite(sighting.latitude) && Number.isFinite(sighting.longitude) &&
    Math.abs(sighting.latitude) <= 90 && Math.abs(sighting.longitude) <= 180;
}

/** Arredonda para a grade pública de 0,1° sem ruído de ponto flutuante. */
export function toPublicCell(value: number): number {
  return Number((Math.round(value / PUBLIC_CELL_DEGREES) * PUBLIC_CELL_DEGREES).toFixed(1));
}

export function toPublicRecord(sighting: Sighting, publication: Publication | undefined, now: Date): PublicRecord | null {
  if (publicationStatus(sighting, publication, now) !== "active" || !publication || !hasValidCoordinates(sighting)) return null;
  return {
    id: sighting.id,
    speciesId: sighting.speciesId,
    date: sighting.date,
    time: sighting.time,
    latitude: toPublicCell(sighting.latitude),
    longitude: toPublicCell(sighting.longitude),
    publishedAt: publication.publishedAt,
    expiresAt: publication.expiresAt,
    owner: "me",
  };
}

export function myPublicRecords(sightings: readonly Sighting[], store: PublicationStore, now: Date): PublicRecord[] {
  return sightings.map((item) => toPublicRecord(item, store.items[item.id], now)).filter((item): item is PublicRecord => item !== null);
}

export function isRecordActive(record: PublicRecord, now: Date): boolean {
  return record.expiresAt === null || new Date(record.expiresAt).getTime() > now.getTime();
}

// ───────────────────────────── Filtro por data ─────────────────────────────

export type DatePreset = "7d" | "30d" | "365d" | "all";
export type DateFilter = { preset: DatePreset } | { from?: string; to?: string };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Filtra pela data do avistamento (não pela data de publicação). Datas no formato AAAA-MM-DD. */
export function filterByDate<T extends { date: string }>(records: readonly T[], filter: DateFilter, now: Date): T[] {
  let from: string | undefined;
  let to: string | undefined;
  if ("preset" in filter) {
    if (filter.preset !== "all") {
      const days = filter.preset === "7d" ? 7 : filter.preset === "30d" ? 30 : 365;
      from = getLocalTodayISODate(new Date(now.getTime() - (days - 1) * DAY_MS));
      to = getLocalTodayISODate(now);
    }
  } else {
    from = filter.from && ISO_DATE.test(filter.from) ? filter.from : undefined;
    to = filter.to && ISO_DATE.test(filter.to) ? filter.to : undefined;
    if (from && to && from > to) [from, to] = [to, from];
  }
  return records.filter((record) => ISO_DATE.test(record.date) && (!from || record.date >= from) && (!to || record.date <= to));
}

// ───────────────────────────── Agrupamento por área ─────────────────────────────

/** A partir de quantos registros uma área é destacada como "alta incidência". */
export const HIGH_INCIDENCE_MIN = 5;

export type RecordCluster = {
  key: string;
  latitude: number;
  longitude: number;
  count: number;
  speciesCount: number;
  records: PublicRecord[];
  highIncidence: boolean;
};

const NICE_CELL_STEPS = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 45];

/** Tamanho da célula de agrupamento para a largura visível do mapa (em graus de longitude). */
export function clusterCellForSpan(lonSpan: number, columns = 10): number {
  const target = Math.abs(lonSpan) / Math.max(1, columns);
  return NICE_CELL_STEPS.find((step) => step >= target) ?? NICE_CELL_STEPS[NICE_CELL_STEPS.length - 1];
}

export function clusterRecords(records: readonly PublicRecord[], cellDegrees: number, highIncidenceMin = HIGH_INCIDENCE_MIN): RecordCluster[] {
  const cell = Math.max(PUBLIC_CELL_DEGREES, cellDegrees);
  const groups = new Map<string, PublicRecord[]>();
  for (const record of records) {
    // Pequena tolerância para valores que caem exatamente na borda (ex.: -16.4 / 0.2).
    const row = Math.floor(record.latitude / cell + 1e-9);
    const col = Math.floor(record.longitude / cell + 1e-9);
    const key = `${cell}:${row}:${col}`;
    const list = groups.get(key);
    if (list) list.push(record);
    else groups.set(key, [record]);
  }
  return [...groups.entries()]
    .map(([key, list]) => ({
      key,
      latitude: list.reduce((sum, item) => sum + item.latitude, 0) / list.length,
      longitude: list.reduce((sum, item) => sum + item.longitude, 0) / list.length,
      count: list.length,
      speciesCount: new Set(list.map((item) => item.speciesId)).size,
      records: [...list].sort((a, b) => `${b.date}T${b.time ?? ""}`.localeCompare(`${a.date}T${a.time ?? ""}`)),
      highIncidence: list.length >= highIncidenceMin,
    }))
    .sort((a, b) => b.count - a.count || a.key.localeCompare(b.key));
}

// ───────────────────────────── Enquadramento do mapa-múndi ─────────────────────────────

export type GeoPoint = { latitude: number; longitude: number };
export type WorldViewport = { west: number; east: number; north: number; south: number };

export const MAX_WORLD_ZOOM = 512;

/** Equiretangular com correção de cosseno no centro; zoom 1 mostra o mundo inteiro. */
export function createWorldViewport(width: number, height: number, center: GeoPoint, zoom: number): WorldViewport {
  const ratio = Math.max(1, width) / Math.max(1, height);
  const safeZoom = Math.max(1, Math.min(MAX_WORLD_ZOOM, Number.isFinite(zoom) ? zoom : 1));
  const latCenter = Math.max(-80, Math.min(80, center.latitude));
  const cosine = Math.max(0.2, Math.cos((latCenter * Math.PI) / 180));
  const lonSpan = 360 / safeZoom;
  const latSpan = (lonSpan * cosine) / ratio;
  if (latSpan >= 170) {
    // Tela mais alta que o mapa: mostra o mundo inteiro centralizado, com faixa de oceano acima/abaixo.
    return { west: center.longitude - lonSpan / 2, east: center.longitude + lonSpan / 2, north: latSpan / 2, south: -latSpan / 2 };
  }
  let north = Math.min(85, latCenter + latSpan / 2);
  let south = north - latSpan;
  if (south < -85) {
    south = -85;
    north = south + latSpan;
  }
  return { west: center.longitude - lonSpan / 2, east: center.longitude + lonSpan / 2, north, south };
}

/** Zoom que enquadra todos os pontos (com folga), limitado entre o mundo inteiro e o detalhe máximo. */
export function fitZoomToPoints(points: readonly GeoPoint[], width: number, height: number): { center: GeoPoint; zoom: number } {
  if (points.length === 0) return { center: { latitude: -17.5, longitude: -56.5 }, zoom: 24 };
  const lats = points.map((point) => point.latitude);
  const lons = points.map((point) => point.longitude);
  const center = { latitude: (Math.min(...lats) + Math.max(...lats)) / 2, longitude: (Math.min(...lons) + Math.max(...lons)) / 2 };
  const lonSpan = Math.max(1.5, (Math.max(...lons) - Math.min(...lons)) * 1.4);
  const latSpan = Math.max(1.5, (Math.max(...lats) - Math.min(...lats)) * 1.4);
  const ratio = Math.max(1, width) / Math.max(1, height);
  const cosine = Math.max(0.2, Math.cos((center.latitude * Math.PI) / 180));
  const neededLon = Math.max(lonSpan, (latSpan * ratio) / cosine);
  const zoom = Math.max(1, Math.min(MAX_WORLD_ZOOM, 360 / neededLon));
  return { center, zoom };
}

// ───────────────────────────── Registros de exemplo (demonstração) ─────────────────────────────

/** Pontos de observação conhecidos, já na grade pública de 0,1°. */
const SAMPLE_SPOTS: readonly GeoPoint[] = [
  { latitude: -17.4, longitude: -56.8 }, // Porto Jofre
  { latitude: -16.6, longitude: -56.7 }, // Transpantaneira (início)
  { latitude: -16.2, longitude: -56.0 }, // Barão de Melgaço
  { latitude: -19.6, longitude: -57.0 }, // Estrada Parque (Corumbá)
  { latitude: -16.1, longitude: -57.7 }, // Cáceres
  { latitude: -20.2, longitude: -56.4 }, // Miranda
];

/**
 * Registros de demonstração para o mapa não ficar vazio antes do servidor existir.
 * São sempre marcados como `sample: true` e identificados como "exemplo" na interface.
 */
export function buildSampleRecords(catalog: readonly Pick<Species, "id">[], now: Date, total = 36): PublicRecord[] {
  if (catalog.length === 0) return [];
  const records: PublicRecord[] = [];
  for (let index = 0; index < total; index += 1) {
    // Distribuição determinística: o primeiro ponto concentra mais registros (área de alta incidência).
    const spot = SAMPLE_SPOTS[index < 12 ? 0 : index % SAMPLE_SPOTS.length];
    const offset = (index % 3) - 1;
    const daysAgo = (index * 5) % 75;
    const observed = new Date(now.getTime() - daysAgo * DAY_MS);
    records.push({
      id: `exemplo-${index + 1}`,
      speciesId: catalog[(index * 7) % catalog.length].id,
      date: getLocalTodayISODate(observed),
      latitude: toPublicCell(spot.latitude + offset * 0.1),
      longitude: toPublicCell(spot.longitude + ((index % 2) * 0.1)),
      publishedAt: observed.toISOString(),
      expiresAt: null,
      owner: "others",
      sample: true,
    });
  }
  return records;
}
