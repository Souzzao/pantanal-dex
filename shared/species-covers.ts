/**
 * Foto principal de cada espécie embutida no app (funciona sem internet).
 * Gerado por scripts/catalog — não editar à mão. Começa vazio até as fotos serem geradas.
 */
export const speciesCovers: Record<string, number> = {};

export function hasBundledCover(id: string): boolean {
  return id in speciesCovers;
}
