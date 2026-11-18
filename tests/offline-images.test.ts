import { describe, expect, it } from "vitest";

import { filterSpeciesCatalog } from "../shared/catalog";
import { displayImageUri } from "../shared/image-url";
import { catalogImageUrls, prefetchAll } from "../shared/offline-images";

describe("fotos para uso offline", () => {
  it("baixa os mesmos endereços que as telas mostram (miniatura), sem repetir", () => {
    const catalog = filterSpeciesCatalog();
    const covers = catalogImageUrls(catalog, "covers");
    expect(new Set(covers).size).toBe(covers.length);
    for (const url of covers) expect(url).toBe(displayImageUri(url));
    const first = catalog.find((item) => item.images[0])!;
    expect(covers).toContain(displayImageUri(first.images[0].uri));
  });

  it("não baixa de novo as fotos que já vêm embutidas no app", () => {
    const catalog = filterSpeciesCatalog();
    expect(catalogImageUrls(catalog, "covers", () => true)).toEqual([]);
  });

  it("tenta de novo cada foto e uma falha não derruba as outras", async () => {
    const tries: Record<string, number> = {};
    const result = await prefetchAll(["a", "b", "c", "d"], async (url) => {
      tries[url] = (tries[url] ?? 0) + 1;
      if (url === "b") return tries[url] >= 2; // falha uma vez, depois funciona
      return url !== "d"; // "d" nunca responde
    }, { concurrency: 2, retries: 2, wait: async () => {} });
    expect(result.completed).toBe(3);
    expect(result.failed).toEqual(["d"]);
    expect(tries.d).toBe(3);
  });

  it("para quando a pessoa cancela", async () => {
    let calls = 0;
    const result = await prefetchAll(["a", "b", "c", "d"], async () => { calls += 1; return true; }, { concurrency: 1, isCancelled: () => calls >= 2 });
    expect(result.cancelled).toBe(true);
    expect(result.completed).toBe(2);
  });
});
