import { describe, expect, it } from "vitest";

import { filterSpeciesCatalog } from "../shared/catalog";
import {
  computeCollection,
  filterCollectionEntries,
  findNewDiscoveries,
  formatCollectionNumber,
  PANTANAL_ICONS,
  XP_PER_LEVEL,
  XP_PER_NEW_SPECIES,
  XP_PER_SIGHTING,
} from "../shared/collection";
import type { Sighting } from "../shared/pantanal";

const catalog = filterSpeciesCatalog();

let counter = 0;
function sighting(speciesId: string, date = "2026-11-01"): Sighting {
  counter += 1;
  return {
    id: `s-${counter}`,
    speciesId,
    date,
    locationPrecision: "none",
    visibility: "private",
    createdAt: `${date}T10:00:00.000Z`,
    updatedAt: `${date}T10:00:00.000Z`,
  };
}

describe("Minha Coleção", () => {
  it("começa vazia, com todas as espécies do catálogo numeradas", () => {
    const summary = computeCollection(catalog, []);
    expect(summary.totalSpecies).toBe(catalog.length);
    expect(summary.discoveredSpecies).toBe(0);
    expect(summary.percent).toBe(0);
    expect(summary.level).toBe(1);
    expect(summary.xp).toBe(0);
    expect(summary.entries[0].number).toBe(1);
    expect(summary.entries.at(-1)?.number).toBe(catalog.length);
    expect(summary.badges.every((badge) => !badge.unlocked)).toBe(true);
  });

  it("conta espécie descoberta uma vez, mesmo com vários registros", () => {
    const summary = computeCollection(catalog, [sighting("capivara", "2026-11-02"), sighting("capivara", "2026-10-30"), sighting("capivara", "2026-11-05")]);
    const capivara = summary.entries.find((entry) => entry.species.id === "capivara");
    expect(summary.discoveredSpecies).toBe(1);
    expect(capivara?.discovered).toBe(true);
    expect(capivara?.sightingCount).toBe(3);
    expect(capivara?.firstSeenDate).toBe("2026-10-30");
    expect(capivara?.lastSeenDate).toBe("2026-11-05");
    expect(summary.fieldDays).toBe(3);
    expect(summary.xp).toBe(XP_PER_NEW_SPECIES + 3 * XP_PER_SIGHTING);
  });

  it("ignora espécie fora do catálogo na descoberta, mas mantém o registro no total", () => {
    const summary = computeCollection(catalog, [sighting("nao-sei"), sighting("especie-inexistente"), sighting("tuiuiu")]);
    expect(summary.totalSightings).toBe(3);
    expect(summary.unmatchedSightings).toBe(2);
    expect(summary.discoveredSpecies).toBe(1);
    expect(summary.xp).toBe(XP_PER_NEW_SPECIES + XP_PER_SIGHTING);
    expect(summary.badges.find((badge) => badge.id === "first-sighting")?.unlocked).toBe(true);
  });

  it("calcula percentuais por grupo coerentes com o catálogo", () => {
    const summary = computeCollection(catalog, [sighting("tuiuiu"), sighting("arara-azul")]);
    const birds = summary.groups.find((item) => item.group === "Aves");
    const totalBirds = catalog.filter((item) => item.group === "Aves").length;
    expect(birds).toEqual({ group: "Aves", total: totalBirds, discovered: 2, percent: Math.round((2 / totalBirds) * 100) });
    expect(summary.groups.reduce((sum, item) => sum + item.total, 0)).toBe(summary.totalSpecies);
  });

  it("libera a conquista dos cinco ícones do Pantanal", () => {
    const partial = computeCollection(catalog, PANTANAL_ICONS.slice(0, 4).map((id) => sighting(id)));
    const icons = partial.badges.find((badge) => badge.id === "pantanal-icons");
    expect(icons).toMatchObject({ unlocked: false, current: 4, target: 5 });
    const full = computeCollection(catalog, PANTANAL_ICONS.map((id) => sighting(id)));
    expect(full.badges.find((badge) => badge.id === "pantanal-icons")?.unlocked).toBe(true);
    expect(full.badges.find((badge) => badge.id === "five-species")?.unlocked).toBe(true);
  });

  it("libera 'todos os grupos' com uma espécie de cada grupo", () => {
    const onePerGroup = [...new Map(catalog.map((item) => [item.group, item.id])).values()];
    const summary = computeCollection(catalog, onePerGroup.map((id) => sighting(id)));
    expect(summary.badges.find((badge) => badge.id === "all-groups")?.unlocked).toBe(true);
  });

  it("sobe de nível a cada bloco de XP", () => {
    const ids = catalog.slice(0, 4).map((item) => item.id);
    const summary = computeCollection(catalog, ids.map((id) => sighting(id)));
    const expectedXp = 4 * XP_PER_NEW_SPECIES + 4 * XP_PER_SIGHTING;
    expect(summary.xp).toBe(expectedXp);
    expect(summary.level).toBe(Math.floor(expectedXp / XP_PER_LEVEL) + 1);
    expect(summary.levelXp).toBe(expectedXp % XP_PER_LEVEL);
  });

  it("não quebra com datas inválidas vindas de importação", () => {
    const summary = computeCollection(catalog, [{ ...sighting("anta"), date: "data-ruim" }]);
    const anta = summary.entries.find((entry) => entry.species.id === "anta");
    expect(anta?.discovered).toBe(true);
    expect(anta?.firstSeenDate).toBeUndefined();
    expect(summary.fieldDays).toBe(0);
  });

  it("filtra por descobertas, faltantes e grupo", () => {
    const summary = computeCollection(catalog, [sighting("tuiuiu"), sighting("capivara")]);
    expect(filterCollectionEntries(summary.entries, { filter: "discovered" }).map((entry) => entry.species.id).sort()).toEqual(["capivara", "tuiuiu"]);
    expect(filterCollectionEntries(summary.entries, { filter: "missing" })).toHaveLength(summary.totalSpecies - 2);
    expect(filterCollectionEntries(summary.entries, { filter: "discovered", group: "Aves" }).map((entry) => entry.species.id)).toEqual(["tuiuiu"]);
  });

  it("formata o número da coleção com três dígitos", () => {
    expect(formatCollectionNumber(1)).toBe("#001");
    expect(formatCollectionNumber(42)).toBe("#042");
    expect(formatCollectionNumber(1234)).toBe("#1234");
  });

  it("detecta apenas espécies inéditas entre dois estados do caderno", () => {
    const before = [sighting("capivara")];
    const after = [sighting("onca-pintada"), sighting("capivara"), sighting("capivara"), sighting("nao-sei")];
    const found = findNewDiscoveries(catalog, before, after);
    expect(found.map((entry) => entry.species.id)).toEqual(["onca-pintada"]);
    expect(found[0].number).toBe(computeCollection(catalog, after).entries.find((entry) => entry.species.id === "onca-pintada")?.number);
  });

  it("não avisa ao repetir espécie, excluir registros ou manter o caderno igual", () => {
    const base = [sighting("capivara"), sighting("tuiuiu")];
    expect(findNewDiscoveries(catalog, base, [...base, sighting("capivara")])).toEqual([]);
    expect(findNewDiscoveries(catalog, base, base.slice(0, 1))).toEqual([]);
    expect(findNewDiscoveries(catalog, base, base)).toEqual([]);
  });

  it("lista várias descobertas de uma importação na ordem da coleção", () => {
    const found = findNewDiscoveries(catalog, [], PANTANAL_ICONS.map((id) => sighting(id)));
    expect(found).toHaveLength(PANTANAL_ICONS.length);
    expect(found.map((entry) => entry.number)).toEqual([...found.map((entry) => entry.number)].sort((a, b) => a - b));
  });
});
