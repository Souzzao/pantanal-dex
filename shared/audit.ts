/** Tipos e conversões puras da auditoria (respostas das funções audit_queue e review_log). */

export type AuditItem = {
  id: string; speciesId: string; observedOn: string; observedTime: string | null;
  exactLat: number; exactLon: number; notes: string | null; photoPath: string | null; publishedAt: string; ownerName: string;
};

export type LogItem = {
  createdAt: string; sightingId: string; decision: "approved" | "rejected";
  oldSpeciesId: string | null; newSpeciesId: string | null; note: string | null; auditorName: string;
};

const str = (value: unknown) => (typeof value === "string" ? value : null);

export function normalizeAuditRow(row: unknown): AuditItem | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  const exactLat = r.exact_lat == null ? NaN : Number(r.exact_lat);
  const exactLon = r.exact_lon == null ? NaN : Number(r.exact_lon);
  if (!str(r.id) || !str(r.species_id) || !str(r.observed_on) || !Number.isFinite(exactLat) || !Number.isFinite(exactLon)) return null;
  return {
    id: r.id as string, speciesId: r.species_id as string, observedOn: r.observed_on as string, observedTime: str(r.observed_time),
    exactLat, exactLon, notes: str(r.notes), photoPath: str(r.photo_path), publishedAt: str(r.published_at) ?? "", ownerName: str(r.owner_name) ?? "",
  };
}

export function normalizeLogRow(row: unknown): LogItem | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  if (!str(r.sighting_id) || (r.decision !== "approved" && r.decision !== "rejected")) return null;
  return {
    createdAt: str(r.created_at) ?? "", sightingId: r.sighting_id as string, decision: r.decision,
    oldSpeciesId: str(r.old_species_id), newSpeciesId: str(r.new_species_id), note: str(r.note), auditorName: str(r.auditor_name) ?? "",
  };
}

/** Motivos rápidos de reprovação (o auditor ainda pode escrever o próprio). */
export const REJECT_REASONS = {
  pt: ["A foto não mostra o animal", "Espécie errada e não dá para corrigir", "Local improvável para a espécie", "Registro repetido", "Data ou hora impossível"],
  en: ["The photo does not show the animal", "Wrong species and cannot be fixed", "Unlikely location for the species", "Duplicate record", "Impossible date or time"],
  es: ["La foto no muestra el animal", "Especie equivocada y no se puede corregir", "Lugar improbable para la especie", "Registro repetido", "Fecha u hora imposible"],
} as const;
