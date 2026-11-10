import type { Species } from "./pantanal";

/** Quantas imagens pedir de uma vez ao baixar o catálogo para uso offline. */
export const OFFLINE_PREFETCH_BATCH_SIZE = 6;

export type OfflineImageScope = "covers" | "all";

/**
 * URLs das fotos do catálogo, sem repetição e em ordem estável.
 * - "covers": a primeira foto de cada espécie (usada na Home, na lista de animais, na coleção e no caderno).
 * - "all": todas as fotos das galerias das fichas.
 */
export function catalogImageUrls(catalog: readonly Species[], scope: OfflineImageScope): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const species of catalog) {
    const images = scope === "covers" ? species.images.slice(0, 1) : species.images;
    for (const image of images) {
      const uri = image.uri?.trim();
      if (!uri || !/^https:\/\//i.test(uri) || seen.has(uri)) continue;
      seen.add(uri);
      urls.push(uri);
    }
  }
  return urls;
}

export function chunkUrls(urls: readonly string[], size = OFFLINE_PREFETCH_BATCH_SIZE): string[][] {
  const step = Math.max(1, Math.trunc(size));
  const chunks: string[][] = [];
  for (let index = 0; index < urls.length; index += step) chunks.push(urls.slice(index, index + step));
  return chunks;
}

export type OfflinePrefetchResult = { requested: number; completed: number; failedBatches: number; cancelled: boolean };

/**
 * Baixa as imagens em lotes, informando o progresso. `prefetch` recebe um lote e responde se todas
 * as imagens dele foram salvas. Um lote com falha não interrompe os outros (rede instável em campo).
 */
export async function prefetchInBatches(
  urls: readonly string[],
  prefetch: (batch: string[]) => Promise<boolean>,
  options: { onProgress?: (done: number, total: number) => void; isCancelled?: () => boolean; batchSize?: number } = {},
): Promise<OfflinePrefetchResult> {
  const batches = chunkUrls(urls, options.batchSize);
  let completed = 0;
  let processed = 0;
  let failedBatches = 0;
  options.onProgress?.(0, urls.length);
  for (const batch of batches) {
    if (options.isCancelled?.()) return { requested: urls.length, completed, failedBatches, cancelled: true };
    let ok = false;
    try {
      ok = await prefetch(batch);
    } catch {
      ok = false;
    }
    if (ok) completed += batch.length;
    else failedBatches += 1;
    processed += batch.length;
    options.onProgress?.(processed, urls.length);
  }
  return { requested: urls.length, completed, failedBatches, cancelled: false };
}
