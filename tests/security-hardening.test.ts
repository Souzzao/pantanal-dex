import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { isImportSizeOk, isSafeExternalUrl, MAX_IMPORT_BYTES } from "../shared/safe-url";
import { parseNotebookFile } from "../shared/notebook-files";
import { parseExportJson } from "../shared/exports";
import { filterSpeciesCatalog } from "../shared/catalog";

describe("links externos", () => {
  it("só abre https comum", () => {
    expect(isSafeExternalUrl("https://www.inaturalist.org/photos/1")).toBe(true);
    for (const bad of ["http://exemplo.com", "intent://scan#Intent;end", "javascript:alert(1)", "file:///sdcard/x", "content://x",
      "https://user:senha@exemplo.com", "https://exemplo .com", "https://localhost/x", "", null, 42]) {
      expect(isSafeExternalUrl(bad)).toBe(false);
    }
  });

  it("todo link de foto e fonte do catálogo é https seguro", () => {
    const bad = filterSpeciesCatalog().flatMap((item) => [...item.images.map((i) => i.sourceUrl), ...item.sources.map((s) => s.url)]).filter((url) => !isSafeExternalUrl(url));
    expect(bad).toEqual([]);
  });

  it("toda foto do catálogo carrega por https", () => {
    const bad = filterSpeciesCatalog().flatMap((item) => item.images.map((i) => i.uri)).filter((uri) => !uri.startsWith("https://"));
    expect(bad).toEqual([]);
  });
});

describe("arquivos importados", () => {
  it("recusa arquivos acima de 5 MB", () => {
    expect(isImportSizeOk(MAX_IMPORT_BYTES)).toBe(true);
    expect(isImportSizeOk(MAX_IMPORT_BYTES + 1)).toBe(false);
    expect(isImportSizeOk(undefined)).toBe(true);
    const huge = "x".repeat(MAX_IMPORT_BYTES + 1);
    expect(() => parseNotebookFile(huge)).toThrow("grande demais");
    expect(parseExportJson(huge)).toEqual([]);
  });
});

describe("código e configuração", () => {
  it("nenhuma chave secreta no app (service_role só no servidor)", () => {
    const files = ["lib/supabase.ts", "contexts/AuthContext.tsx", "app.config.ts", "eas.json"].filter((f) => { try { readFileSync(f); return true; } catch { return false; } });
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      expect(text).not.toMatch(/service_role|sb_secret_|eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}/);
    }
  });

  it("mapa em WebView sem acesso a arquivos do aparelho", () => {
    const text = readFileSync("components/StreetMap.tsx", "utf8");
    expect(text).toContain("allowFileAccess={false}");
    expect(text).toContain('mixedContentMode="never"');
  });
});
