/**
 * PantanalDex — Coleção da equipe, personagem e autoria (regras puras, testáveis no Node).
 *
 * Pacote "Equipes e Personagens": cada registro da equipe tem o seu ID, autor, descrição, data, zona
 * de ~11 km e as suas fotos. O índice mostra cada espécie uma vez com a quantidade de registros; ao abrir
 * a espécie, cada registro aparece separado ("Registro N · Registrado por [nome]").
 *
 * @author Felipe de Souza Aquino
 */
import { roundToPublicLocationGrid } from "./location";
import type { Sighting } from "./pantanal";

// ───────────── Personagem ─────────────
export const AVATAR_TONES = { verde: "#A1F3C4", pessego: "#F9BE8C", lavanda: "#CBB7FF", amarelo: "#FFD966", rio: "#9CCFFF", ipe: "#F7A8D0" } as const;
export const AVATAR_EYES = ["redondos", "curvos", "sono"] as const;
export const AVATAR_ITEMS = ["nenhum", "estrela", "broche", "folha", "chapeu"] as const;
export type AvatarTone = keyof typeof AVATAR_TONES;
export type AvatarEyes = (typeof AVATAR_EYES)[number];
export type AvatarItem = (typeof AVATAR_ITEMS)[number];
export type Avatar = { tone: AvatarTone; eyes: AvatarEyes; item: AvatarItem };

export const DEFAULT_AVATAR: Avatar = { tone: "verde", eyes: "redondos", item: "nenhum" };
export const AVATAR_LABELS = {
  tone: { verde: "Verde", pessego: "Pêssego", lavanda: "Lavanda", amarelo: "Ipê-amarelo", rio: "Rio", ipe: "Ipê-rosa" } as Record<AvatarTone, string>,
  eyes: { redondos: "Redondos", curvos: "Curvos", sono: "Sonolentos" } as Record<AvatarEyes, string>,
  item: { nenhum: "Sem acessório", estrela: "Estrela", broche: "Broche", folha: "Folha", chapeu: "Chapéu de palha" } as Record<AvatarItem, string>,
};

/** Aceita só valores da lista do app; qualquer outra coisa vira o padrão (igual à regra do servidor). */
export function sanitizeAvatar(value: unknown): Avatar {
  if (!value || typeof value !== "object") return DEFAULT_AVATAR;
  const v = value as Record<string, unknown>;
  return {
    tone: typeof v.tone === "string" && v.tone in AVATAR_TONES ? (v.tone as AvatarTone) : DEFAULT_AVATAR.tone,
    eyes: (AVATAR_EYES as readonly unknown[]).includes(v.eyes) ? (v.eyes as AvatarEyes) : DEFAULT_AVATAR.eyes,
    item: (AVATAR_ITEMS as readonly unknown[]).includes(v.item) ? (v.item as AvatarItem) : DEFAULT_AVATAR.item,
  };
}

// ───────────── Registros ─────────────
export type TeamRecord = {
  id: string;
  number: number;
  speciesId: string;
  /** null = autoria indisponível (conta excluída). Nunca atribuir a outra pessoa. */
  authorId: string | null;
  authorName: string | null;
  authorAvatar: Avatar | null;
  description: string;
  observedOn: string;
  zone: { lat: number; lon: number } | null;
  photoPaths: string[];
  createdAt: string;
  updatedAt: string;
};

export const authorLabel = (record: Pick<TeamRecord, "authorName">) => (record.authorName ? `Registrado por ${record.authorName}` : "Autoria indisponível");
export const recordLabel = (record: Pick<TeamRecord, "number">) => `Registro ${record.number}`;

export type TeamSpeciesEntry = { speciesId: string; count: number; latest: string; coverPath?: string };

/** Índice da coleção da equipe: cada espécie UMA vez, com a quantidade de registros visíveis. */
export function teamSpeciesIndex(records: readonly TeamRecord[]): TeamSpeciesEntry[] {
  const map = new Map<string, TeamSpeciesEntry>();
  for (const r of records) {
    const entry = map.get(r.speciesId) ?? { speciesId: r.speciesId, count: 0, latest: "" };
    entry.count += 1;
    if (r.createdAt > entry.latest) { entry.latest = r.createdAt; if (r.photoPaths[0]) entry.coverPath = r.photoPaths[0]; }
    if (!entry.coverPath && r.photoPaths[0]) entry.coverPath = r.photoPaths[0];
    map.set(r.speciesId, entry);
  }
  return [...map.values()].sort((a, b) => b.count - a.count || b.latest.localeCompare(a.latest) || a.speciesId.localeCompare(b.speciesId));
}

/** Registros de uma espécie, em ordem estável (data de criação, depois ID). */
export function recordsOfSpecies(records: readonly TeamRecord[], speciesId: string): TeamRecord[] {
  return records.filter((r) => r.speciesId === speciesId).sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
}

type Row = {
  id: string; number: number; species_id: string; author_id: string | null; author_name: string | null; author_avatar: unknown;
  description: string | null; observed_on: string; zone_lat: number | null; zone_lon: number | null; photo_paths: string[] | null; created_at: string; updated_at: string;
};
export function recordFromRow(row: Row): TeamRecord {
  return {
    id: row.id, number: row.number, speciesId: row.species_id, authorId: row.author_id, authorName: row.author_id ? row.author_name : null,
    authorAvatar: row.author_id ? sanitizeAvatar(row.author_avatar) : null, description: row.description ?? "", observedOn: row.observed_on,
    zone: row.zone_lat !== null && row.zone_lon !== null ? { lat: row.zone_lat, lon: row.zone_lon } : null,
    photoPaths: Array.isArray(row.photo_paths) ? row.photo_paths : [], createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

// ───────────── Envio (fila offline) ─────────────
/** Pedido de envio de um registro do caderno para uma equipe. Só leva zona de 0,1°, nunca o ponto exato. */
export type ShareRequest = {
  /** Chave de idempotência: o mesmo registro enviado à mesma equipe é a mesma operação. */
  opId: string;
  teamId: string;
  sightingId: string;
  speciesId: string;
  description: string;
  observedOn: string;
  zone: { lat: number; lon: number } | null;
  localPhotos: string[];
  /** Fotos já enviadas ao Storage (caminho por índice), para retomar sem reenviar. */
  uploaded: (string | null)[];
  queuedAt: string;
  attempts: number;
  lastError?: string;
};

export const shareOpId = (sightingId: string, teamId: string) => `${sightingId}:${teamId.slice(0, 8)}`.replace(/[^A-Za-z0-9._:-]/g, "-").slice(0, 120);

export function buildShareRequest(sighting: Sighting, teamId: string, photos: string[], now: Date = new Date()): ShareRequest {
  const hasPoint = sighting.latitude !== undefined && sighting.longitude !== undefined;
  return {
    opId: shareOpId(sighting.id, teamId), teamId, sightingId: sighting.id, speciesId: sighting.speciesId,
    description: (sighting.notes ?? "").slice(0, 500), observedOn: sighting.date,
    zone: hasPoint ? { lat: roundToPublicLocationGrid(sighting.latitude!), lon: roundToPublicLocationGrid(sighting.longitude!) } : null,
    localPhotos: photos.slice(0, 8), uploaded: photos.slice(0, 8).map(() => null), queuedAt: now.toISOString(), attempts: 0,
  };
}

/** Coloca na fila sem duplicar: a mesma operação (registro + equipe) substitui a anterior. */
export function enqueueShare(queue: readonly ShareRequest[], request: ShareRequest): ShareRequest[] {
  return [...queue.filter((item) => item.opId !== request.opId), request];
}

export function sanitizeShareQueue(value: unknown): ShareRequest[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is ShareRequest => !!item && typeof item === "object" && typeof (item as ShareRequest).opId === "string"
    && typeof (item as ShareRequest).teamId === "string" && Array.isArray((item as ShareRequest).localPhotos) && Array.isArray((item as ShareRequest).uploaded)).slice(0, 200);
}

/** Caminho no Storage: <equipe>/<autor>/<operação>-<n>.jpg (a pasta do autor é conferida no servidor). */
export const teamPhotoPath = (teamId: string, userId: string, opId: string, index: number) =>
  `${teamId}/${userId}/${opId.replace(/[^A-Za-z0-9._-]/g, "-").slice(0, 70)}-${index}.jpg`;
