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
  it("toda espécie do catálogo tem pelo menos uma imagem", () => {
    const withoutImages = filterSpeciesCatalog().filter((item) => item.images.length === 0).map((item) => item.id);
    expect(withoutImages).toEqual([]);
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
