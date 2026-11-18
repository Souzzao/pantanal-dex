import { describe, expect, it } from "vitest";

import { AUDIT_PROCESS, createDemoQueue, demoScenario, DEMO_PREFIX, simulatePublication } from "../shared/audit-demo";
import { filterSpeciesCatalog } from "../shared/catalog";
import { isInsidePantanal } from "../shared/pantanal-boundary";

const NOW = new Date("2026-11-17T15:00:00");

describe("modo demonstração da auditoria", () => {
  it("monta uma pilha simulada com espécies reais, dentro do Pantanal", () => {
    const queue = createDemoQueue(NOW);
    const ids = new Set(filterSpeciesCatalog().map((s) => s.id));
    expect(queue.length).toBeGreaterThanOrEqual(5);
    expect(queue.every((item) => item.id.startsWith(DEMO_PREFIX))).toBe(true);
    expect(queue.every((item) => ids.has(item.speciesId))).toBe(true);
    expect(queue.every((item) => isInsidePantanal(item.exactLat, item.exactLon))).toBe(true);
  });

  it("aceita uma publicação válida e cria um item pendente", () => {
    const result = simulatePublication(demoScenario("valid", "tuiuiu", NOW), NOW);
    expect(result.accepted).toBe(true);
    expect(result.checks.every((check) => check.ok)).toBe(true);
    expect(result.item).toMatchObject({ speciesId: "tuiuiu" });
  });

  it("recusa ponto fora do Pantanal, data futura, sem conta ou acima do limite", () => {
    expect(simulatePublication(demoScenario("invalid", "tuiuiu", NOW), NOW).checks.find((c) => !c.ok)?.label).toBe("Dentro do Pantanal");
    const base = demoScenario("valid", "tuiuiu", NOW);
    expect(simulatePublication({ ...base, observedOn: "2999-01-01" }, NOW).accepted).toBe(false);
    expect(simulatePublication({ ...base, signedIn: false }, NOW).accepted).toBe(false);
    expect(simulatePublication({ ...base, publishedToday: 30 }, NOW).accepted).toBe(false);
  });

  it("explica as cinco etapas do processo", () => {
    expect(AUDIT_PROCESS.map((step) => step.title)).toEqual(["Registro", "Servidor confere", "Pendente", "Auditor decide", "Mapa público"]);
  });
});
