import type { Species } from "./pantanal";
import { displayImageUri } from "./image-url";

/** Quantas fotos baixar ao mesmo tempo (rede de campo costuma ser fraca). */
export const OFFLINE_PREFETCH_CONCURRENCY = 4;
/** Novas tentativas por foto antes de desistir dela. */
export const OFFLINE_PREFETCH_RETRIES = 2;

export type OfflineImageScope = "covers" | "all";

/**
 * Endereços das fotos do catálogo exatamente como as telas pedem (miniatura leve), sem repetição.
 * Antes o download usava o endereço original da foto, mas as telas mostram a miniatura: o cache
 * nunca batia e as fotos "baixadas" não apareciam sem internet.
 * - "covers": a primeira foto de cada espécie que não vem embutida no app.
 * - "all": todas as fotos das galerias.
 */
export function catalogImageUrls(catalog: readonly Species[], scope: OfflineImageScope, isBundled: (species: Species) => boolean = () => false): string[] {
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const species of catalog) {
    const images = scope === "covers" ? (isBundled(species) ? [] : species.images.slice(0, 1)) : species.images;
    for (const image of images) {
      const raw = image.uri?.trim();
      if (!raw || !/^https:\/\//i.test(raw)) continue;
      const uri = displayImageUri(raw);
      if (seen.has(uri)) continue;
      seen.add(uri);
      urls.push(uri);
    }
  }
  return urls;
}

export type OfflinePrefetchResult = { requested: number; completed: number; failed: string[]; cancelled: boolean };

/**
 * Baixa cada foto separadamente, algumas ao mesmo tempo, com novas tentativas. Uma foto que falha
 * não derruba as outras e fica na lista `failed` para o botão "tentar de novo".
 */
export async function prefetchAll(
  urls: readonly string[],
  prefetchOne: (url: string) => Promise<boolean>,
  options: { onProgress?: (done: number, total: number) => void; isCancelled?: () => boolean; concurrency?: number; retries?: number; wait?: (ms: number) => Promise<void> } = {},
): Promise<OfflinePrefetchResult> {
  const total = urls.length;
  const retries = options.retries ?? OFFLINE_PREFETCH_RETRIES;
  const wait = options.wait ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));
  const failed: string[] = [];
  let completed = 0;
  let processed = 0;
  let next = 0;
  options.onProgress?.(0, total);
  const worker = async () => {
    while (next < urls.length) {
      if (options.isCancelled?.()) return;
      const url = urls[next++];
      let ok = false;
      for (let attempt = 0; attempt <= retries && !ok; attempt += 1) {
        if (attempt > 0) await wait(600 * attempt);
        try {
          ok = await prefetchOne(url);
        } catch {
          ok = false;
        }
      }
      if (ok) completed += 1;
      else failed.push(url);
      processed += 1;
      options.onProgress?.(processed, total);
    }
  };
  const lanes = Math.max(1, Math.min(options.concurrency ?? OFFLINE_PREFETCH_CONCURRENCY, urls.length || 1));
  await Promise.all(Array.from({ length: lanes }, worker));
  return { requested: total, completed, failed, cancelled: Boolean(options.isCancelled?.()) && processed < total };
}
