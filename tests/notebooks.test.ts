import { describe, expect, it } from "vitest";

import {
  addNotebook, assignNotebook, countByNotebook, createNotebookStore, createTestSightings, isTestSighting, MAIN_NOTEBOOK_ID,
  mergeNotebooks, notebookOf, recordExport, removeNotebook, renameNotebook, restoreNotebookStore, serializeNotebookStore,
  setActiveNotebook, sightingsIn, TEST_NOTEBOOK_ID, uniqueNotebookName, validateNotebookName,
} from "../shared/notebooks";
import { exportNotebookFile, notebookFileName, parseCsvLine, parseNotebookFile } from "../shared/notebook-files";
import { filterSpeciesCatalog } from "../shared/catalog";
import { sanitizeStoredSightings, type Sighting } from "../shared/pantanal";
import { isInsidePantanal } from "../shared/pantanal-boundary";

const NOW = new Date("2026-11-17T15:00:00Z");
const base = (id: string, extra: Partial<Sighting> = {}): Sighting => ({
  id, speciesId: "tuiuiu", date: "2026-11-10", time: "08:00", latitude: -16.4, longitude: -56.4, locationPrecision: "exact",
  visibility: "private", createdAt: "2026-11-10T11:00:00Z", updatedAt: "2026-11-10T11:00:00Z", ...extra,
});

describe("cadernos", () => {
  it("começa com Principal e Teste, e registros antigos ficam no Principal", () => {
    const store = createNotebookStore(NOW);
    expect(store.notebooks.map((n) => n.id)).toEqual([MAIN_NOTEBOOK_ID, TEST_NOTEBOOK_ID]);
    expect(notebookOf(base("a"))).toBe(MAIN_NOTEBOOK_ID);
    expect(store.activeId).toBe(MAIN_NOTEBOOK_ID);
  });

  it("cria, renomeia e valida nomes", () => {
    let { store, notebook } = addNotebook(createNotebookStore(NOW), "  Viagem   Poconé ", "custom", NOW);
    expect(notebook.name).toBe("Viagem Poconé");
    expect(() => addNotebook(store, "viagem poconé")).toThrow("Já existe");
    expect(validateNotebookName(store, "")).toMatch(/nome/);
    store = renameNotebook(store, notebook.id, "Poconé 2026", NOW);
    expect(store.notebooks.find((n) => n.id === notebook.id)?.name).toBe("Poconé 2026");
    expect(() => renameNotebook(store, MAIN_NOTEBOOK_ID, "Outro")).toThrow("Principal");
    expect(uniqueNotebookName(store, "Teste")).toBe("Teste (2)");
  });

  it("apaga caderno movendo ou removendo os registros", () => {
    const { store, notebook } = addNotebook(createNotebookStore(NOW), "Campo", "custom", NOW);
    const list = [base("a"), base("b", { notebookId: notebook.id }), base("c", { notebookId: notebook.id })];
    const moved = removeNotebook(setActiveNotebook(store, notebook.id), list, notebook.id, "move");
    expect(moved.affected).toBe(2);
    expect(moved.sightings.every((s) => notebookOf(s) === MAIN_NOTEBOOK_ID)).toBe(true);
    expect(moved.store.activeId).toBe(MAIN_NOTEBOOK_ID);
    expect(removeNotebook(store, list, notebook.id, "delete").sightings.map((s) => s.id)).toEqual(["a"]);
    expect(() => removeNotebook(store, list, MAIN_NOTEBOOK_ID, "move")).toThrow();
  });

  it("junta cadernos e remove duplicatas mantendo a versão mais nova", () => {
    const list = [
      base("a"),
      base("b", { notebookId: "x", updatedAt: "2026-11-12T00:00:00Z" }), // mesmo animal/data/local que "a", mais novo
      base("c", { notebookId: "x", speciesId: "capivara" }),
      base("d", { notebookId: "y", speciesId: "anta" }),
    ];
    const result = mergeNotebooks(list, ["x", "y"], MAIN_NOTEBOOK_ID, true);
    expect(result.moved).toBe(3);
    expect(result.duplicatesRemoved).toBe(1);
    expect(result.sightings.map((s) => s.id).sort()).toEqual(["b", "c", "d"]);
    expect(countByNotebook(result.sightings)).toEqual({ [MAIN_NOTEBOOK_ID]: 3 });
    expect(mergeNotebooks(list, ["x"], MAIN_NOTEBOOK_ID, false).sightings).toHaveLength(4);
  });

  it("filtra por caderno, atribui importados e guarda histórico de exportações", () => {
    const list = [base("a"), ...assignNotebook([base("b")], "imp")];
    expect(sightingsIn(list, "imp").map((s) => s.id)).toEqual(["b"]);
    expect(sightingsIn(list, "all")).toHaveLength(2);
    const store = recordExport(createNotebookStore(NOW), [MAIN_NOTEBOOK_ID], "csv", 2, NOW);
    expect(store.exports[0]).toMatchObject({ format: "csv", count: 2, notebookNames: ["Principal"] });
  });

  it("salva e restaura, recriando o Principal e recusando lixo", () => {
    const { store } = addNotebook(createNotebookStore(NOW), "Campo", "custom", NOW);
    expect(restoreNotebookStore(serializeNotebookStore(store), NOW).store).toEqual(store);
    expect(restoreNotebookStore("{quebrado", NOW).status).toBe("corrupted");
    const semPrincipal = { ...store, notebooks: store.notebooks.filter((n) => n.id !== MAIN_NOTEBOOK_ID) };
    expect(restoreNotebookStore(JSON.stringify(semPrincipal), NOW).store.notebooks[0].id).toBe(MAIN_NOTEBOOK_ID);
  });

  it("gera exemplos válidos para o caderno Teste", () => {
    const tests = createTestSightings(NOW);
    expect(tests).toHaveLength(6);
    expect(sanitizeStoredSightings(tests)).toHaveLength(6);
    expect(tests.every(isTestSighting)).toBe(true);
    expect(tests.every((s) => isInsidePantanal(s.latitude!, s.longitude!))).toBe(true);
    const ids = new Set(filterSpeciesCatalog().map((s) => s.id));
    expect(tests.every((s) => ids.has(s.speciesId))).toBe(true);
  });
});

describe("arquivos de cadernos", () => {
  const store = addNotebook(createNotebookStore(NOW), "Viagem, \"Poconé\"", "custom", NOW);
  const nb = store.notebook;
  const list = [base("a", { notes: "=perigo" }), base("b", { notebookId: nb.id, speciesId: "capivara", notes: "linha 1\nlinha 2" })];
  const catalog = filterSpeciesCatalog();

  it("lê linhas CSV com aspas e vírgulas", () => {
    expect(parseCsvLine('"a,b","c""d",,e')).toEqual(["a,b", 'c"d', "", "e"]);
  });

  it.each(["json", "csv", "geojson"] as const)("exporta e importa em %s mantendo o caderno", (format) => {
    const content = exportNotebookFile(format, list, store.store.notebooks, catalog, NOW);
    const parsed = parseNotebookFile(content, NOW);
    expect(parsed.format).toBe(format);
    expect(parsed.sightings.map((s) => s.id).sort()).toEqual(["a", "b"]);
    expect(parsed.notebookByRecord.b).toBe(nb.name);
    const b = parsed.sightings.find((s) => s.id === "b")!;
    expect(b.speciesId).toBe("capivara");
    expect(b.notebookId).toBeUndefined();
    if (format !== "geojson") expect(parsed.sightings.find((s) => s.id === "a")!.notes).toBe("=perigo");
  });

  it("recusa arquivos que não são do PantanalDex", () => {
    expect(() => parseNotebookFile('{"hello":1}')).toThrow("não é um caderno");
    expect(() => parseNotebookFile("nome,idade\nAna,3")).toThrow("colunas");
    expect(() => parseNotebookFile("")).toThrow("vazio");
  });

  it("sugere nome de arquivo sem acentos", () => {
    expect(notebookFileName(["Viagem Poconé"], "csv", NOW)).toBe("pantanaldex-viagem-pocone-2026-11-17.csv");
    expect(notebookFileName(["A", "B"], "json", NOW)).toBe("pantanaldex-2-cadernos-2026-11-17.json");
  });
});
