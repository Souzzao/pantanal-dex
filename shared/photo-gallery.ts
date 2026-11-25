/**
 * PantanalDex — Galeria pessoal: as fotos que a pessoa vinculou aos próprios avistamentos.
 *
 * Regras (pacote "Auditoria UX", G01–G04):
 *  * Só entram fotos do caderno da própria pessoa (as fotos do catálogo nunca entram).
 *  * Cada item aponta para o registro dono da foto; a mesma foto repetida num registro aparece uma vez.
 *  * Ordem estável: data do avistamento mais recente primeiro, depois horário, depois id e posição.
 *
 * @author Felipe de Souza Aquino
 */
import type { Sighting } from "./pantanal";

export const MAX_PHOTOS_PER_SIGHTING = 8;

export type GalleryPhoto = {
  key: string;
  uri: string;
  sightingId: string;
  speciesId: string;
  date: string;
  time?: string;
  /** Posição da foto dentro do registro (0 = capa). */
  index: number;
  /** Total de fotos do registro. */
  total: number;
};

/** Todas as fotos de um registro, capa primeiro, sem repetidas nem vazias. */
export function photosOf(sighting: Pick<Sighting, "photoUri" | "extraPhotoUris">): string[] {
  const all = [sighting.photoUri, ...(sighting.extraPhotoUris ?? [])];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const uri of all) {
    if (typeof uri !== "string" || !uri.trim() || seen.has(uri)) continue;
    seen.add(uri);
    out.push(uri);
    if (out.length === MAX_PHOTOS_PER_SIGHTING) break;
  }
  return out;
}

export function buildPhotoGallery(sightings: readonly Sighting[]): GalleryPhoto[] {
  const items: GalleryPhoto[] = [];
  for (const sighting of sightings) {
    const photos = photosOf(sighting);
    photos.forEach((uri, index) => items.push({
      key: `${sighting.id}#${index}`, uri, sightingId: sighting.id, speciesId: sighting.speciesId,
      date: sighting.date, time: sighting.time, index, total: photos.length,
    }));
  }
  return items.sort((a, b) =>
    b.date.localeCompare(a.date) || (b.time ?? "").localeCompare(a.time ?? "") || a.sightingId.localeCompare(b.sightingId) || a.index - b.index);
}
