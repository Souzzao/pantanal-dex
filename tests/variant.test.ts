import { afterEach, describe, expect, it, vi } from "vitest";

import { parseVariant } from "../shared/variant";
import { createNotebookStore, createTestSightings, MAIN_NOTEBOOK_ID, stripTestNotebook, TEST_NOTEBOOK_ID } from "../shared/notebooks";
import type { Sighting } from "../shared/pantanal";

const NOW = new Date("2026-11-18T15:00:00Z");
const mine = (id: string, notebookId?: string): Sighting => ({
  id, speciesId: "tuiuiu", date: "2026-11-10", latitude: -16.4, longitude: -56.4, locationPrecision: "exact",
  visibility: "private", createdAt: "2026-11-10T11:00:00Z", updatedAt: "2026-11-10T11:00:00Z", notebookId,
});

describe("versões Demo e Final", () => {
  it("sem variável (ou com valor estranho) é sempre a versão final", () => {
    expect(parseVariant(undefined)).toBe("production");
    expect(parseVariant("")).toBe("production");
    expect(parseVariant("Demo ")).toBe("demo");
    expect(parseVariant("demonstracao")).toBe("production");
  });

  it("versão final começa sem o caderno Teste", () => {
    expect(createNotebookStore(NOW, false).notebooks.map((n) => n.id)).toEqual([MAIN_NOTEBOOK_ID]);
    expect(createNotebookStore(NOW).notebooks.map((n) => n.id)).toEqual([MAIN_NOTEBOOK_ID, TEST_NOTEBOOK_ID]);
  });

  it("ao virar versão final, some com os exemplos e devolve ao Principal o que a pessoa pôs no Teste", () => {
    const store = { ...createNotebookStore(NOW), activeId: TEST_NOTEBOOK_ID };
    const list = [mine("a"), ...createTestSightings(NOW), mine("meu-no-teste", TEST_NOTEBOOK_ID)];
    const result = stripTestNotebook(store, list);
    expect(result.changed).toBe(true);
    expect(result.store.notebooks.some((n) => n.id === TEST_NOTEBOOK_ID)).toBe(false);
    expect(result.store.activeId).toBe(MAIN_NOTEBOOK_ID);
    expect(result.sightings.map((s) => s.id)).toEqual(["a", "meu-no-teste"]);
    expect(result.sightings.every((s) => s.notebookId !== TEST_NOTEBOOK_ID)).toBe(true);
    expect(stripTestNotebook(result.store, result.sightings).changed).toBe(false);
  });
});

describe("app.config por versão", () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

  const load = async (variant?: string) => {
    vi.resetModules();
    if (variant) vi.stubEnv("APP_VARIANT", variant); else vi.stubEnv("APP_VARIANT", "");
    vi.stubEnv("EXPO_PUBLIC_APP_VARIANT", "");
    return (await import("../app.config")).default;
  };

  it("Demo tem outro nome e outro pacote (instala junto da final)", async () => {
    const demo = await load("demo");
    const final = await load("production");
    expect(demo.name).toBe("PantanalDex Demo");
    expect(final.name).toBe("PantanalDex");
    expect(demo.android?.package).toBe(`${final.android?.package}.demo`);
    expect(demo.extra?.variant).toBe("demo");
    expect(final.extra?.variant).toBe("production");
  });

  it("Android blindado: sem backup automático, sem permissões que o app não usa, sem link curinga", async () => {
    const final = await load();
    expect(final.android?.allowBackup).toBe(false);
    expect(final.android?.blockedPermissions).toEqual(expect.arrayContaining(["android.permission.RECORD_AUDIO", "android.permission.ACCESS_BACKGROUND_LOCATION"]));
    expect(final.android?.intentFilters).toBeUndefined();
    expect(final.scheme).toBe("pantanaldex");
  });
});
