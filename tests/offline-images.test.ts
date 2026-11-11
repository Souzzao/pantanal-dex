import { describe, expect, it } from "vitest";

import { filterSpeciesCatalog } from "../shared/catalog";
import { catalogImageUrls, chunkUrls, prefetchInBatches } from "../shared/offline-images";

const catalog = filterSpeciesCatalog();

describe("fotos do catálogo para uso offline", () => {
  it("lista uma capa por espécie, sem repetir URL", () => {
    const covers = catalogImageUrls(catalog, "covers");
    expect(covers.length).toBeLessThanOrEqual(catalog.length);
    expect(new Set(covers).size).toBe(covers.length);
    expect(covers[0]).toBe(catalog[0].images[0].uri);
  });

  it("inclui todas as fotos das galerias no modo completo", () => {
    const all = catalogImageUrls(catalog, "all");
    const covers = catalogImageUrls(catalog, "covers");
    expect(all).toEqual([...new Set(catalog.flatMap(animal => animal.images.map(image => image.uri)))]);
    expect(covers.every((uri) => all.includes(uri))).toBe(true);
    expect(all.every((uri) => uri.startsWith("https://"))).toBe(true);
  });

  it("divide em lotes do tamanho pedido", () => {
    expect(chunkUrls(["a", "b", "c", "d", "e"], 2)).toEqual([["a", "b"], ["c", "d"], ["e"]]);
    expect(chunkUrls([], 3)).toEqual([]);
    expect(chunkUrls(["a"], 0)).toEqual([["a"]]);
  });

  it("continua depois de um lote com falha e informa o progresso", async () => {
    const progress: number[] = [];
    const result = await prefetchInBatches(["a", "b", "c", "d", "e"], async (batch) => {
      if (batch.includes("c")) throw new Error("sem rede");
      return true;
    }, { batchSize: 2, onProgress: (done) => progress.push(done) });
    expect(result).toEqual({ requested: 5, completed: 3, failedBatches: 1, cancelled: false });
    expect(progress).toEqual([0, 2, 4, 5]);
  });

  it("para quando a pessoa cancela", async () => {
    let calls = 0;
    let cancel = false;
    const result = await prefetchInBatches(["a", "b", "c", "d"], async () => {
      calls += 1;
      cancel = true;
      return true;
    }, { batchSize: 1, isCancelled: () => cancel });
    expect(calls).toBe(1);
    expect(result).toMatchObject({ completed: 1, cancelled: true });
  });
});
