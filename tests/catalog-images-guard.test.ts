import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { filterSpeciesCatalog } from "../shared/catalog";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("espécies sem foto não derrubam as telas", () => {
  it("toda foto do catálogo permite uso comercial (o app é pago)", () => {
    const blocked = filterSpeciesCatalog().flatMap((item) => item.images.filter((image) => /\b(NC|ND)\b/i.test(image.license)).map(() => item.id));
    expect(blocked).toEqual([]);
  });

  it("toda espécie do app tem pelo menos 5 fotos (as raras demais saem do catálogo)", () => {
    const low = filterSpeciesCatalog().filter((item) => item.images.length < 5).map((item) => item.id);
    expect(low).toEqual([]);
  });

  it("nenhum nome popular se repete no catálogo", () => {
    const norm = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[\s'’-]+/g, "");
    const seen = new Map<string, string>();
    const repeated: string[] = [];
    for (const item of filterSpeciesCatalog()) {
      const key = norm(item.commonName);
      if (seen.has(key)) repeated.push(`${item.commonName}: ${seen.get(key)} / ${item.scientificName}`);
      seen.set(key, item.scientificName);
    }
    expect(repeated).toEqual([]);
  });

  it("nenhuma tela acessa images[0].uri sem verificar se a imagem existe", () => {
    const offenders: string[] = [];
    for (const file of [...sourceFiles("app"), ...sourceFiles("components")]) {
      readFileSync(file, "utf8").split("\n").forEach((line, index) => {
        // Aceita `images[0]?.uri` e o padrão `images[0] ? { uri: images[0].uri } : undefined`.
        const unsafe = /images\[0\]\.uri/.test(line) && !/images\[0\](\?\.uri| \?)/.test(line);
        if (unsafe) offenders.push(`${file}:${index + 1}`);
      });
    }
    expect(offenders).toEqual([]);
  });
});

describe("espécies raras demais saem do catálogo sem perder avistamentos", () => {
  it("nenhuma espécie gerada no catálogo tem menos de 5 fotos", async () => {
    const { generatedSpecies, retiredSpecies } = await import("../shared/catalog/generated");
    expect(generatedSpecies.every((item) => item.images.length >= 5)).toBe(true);
    const ids = new Set(filterSpeciesCatalog().map((item) => item.id));
    expect(retiredSpecies.every((item) => !ids.has(item.id))).toBe(true);
  });

  it("avistamento antigo de espécie aposentada, gerada ou com id antigo ainda acha a espécie", async () => {
    const { findSpeciesById } = await import("../shared/catalog");
    const { retiredSpecies, generatedSpecies } = await import("../shared/catalog/generated");
    if (retiredSpecies[0]) expect(findSpeciesById(retiredSpecies[0].id)?.id).toBe(retiredSpecies[0].id);
    expect(findSpeciesById(generatedSpecies[0].id)?.id).toBe(generatedSpecies[0].id);
    expect(findSpeciesById("sapo-cururu-marina")?.id).toBe("sapo-cururu");
    expect(findSpeciesById("nao-existe")).toBeUndefined();
  });
});
