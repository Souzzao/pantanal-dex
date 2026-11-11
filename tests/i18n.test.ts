import { afterEach, describe, expect, it } from "vitest";

import { filterSpeciesCatalog } from "../shared/catalog";
import { hasSpeciesTranslation, languageCodes, localizeSpecies, setLanguage, tr } from "../shared/i18n";
import { speciesDe } from "../shared/i18n/species.de";
import { speciesEn } from "../shared/i18n/species.en";
import { speciesEs } from "../shared/i18n/species.es";
import { uiDe } from "../shared/i18n/ui.de";
import { uiEn } from "../shared/i18n/ui.en";
import { uiEs } from "../shared/i18n/ui.es";
import { languages } from "../shared/pantanal";

afterEach(() => setLanguage("Português"));

describe("traduções embutidas (offline)", () => {
  it("todo idioma oferecido em Ajustes tem tabela de tradução", () => {
    expect(languages).toEqual(["Português", "English", "Español", "Deutsch"]);
    for (const name of languages) expect(languageCodes[name]).toBeTruthy();
  });

  it("todas as espécies do catálogo têm ficha completa em inglês, espanhol e alemão", () => {
    const ids = filterSpeciesCatalog().map((item) => item.id);
    for (const table of [speciesEn, speciesEs, speciesDe]) {
      expect(ids.filter((id) => !table[id])).toEqual([]);
      for (const id of ids) {
        expect(table[id]).toHaveLength(9);
        expect(table[id][6].length).toBeGreaterThan(0);
      }
    }
  });

  it("o catálogo sai no idioma escolhido e a busca aceita o nome traduzido ou em português", () => {
    setLanguage("Deutsch");
    const jaguar = filterSpeciesCatalog().find((item) => item.id === "onca-pintada");
    expect(jaguar?.commonName).toBe("Jaguar");
    expect(jaguar?.description).toContain("Katze");
    expect(filterSpeciesCatalog({ query: "wasserschwein" }).map((item) => item.id)).toContain("capivara");
    expect(filterSpeciesCatalog({ query: "capivara" }).map((item) => item.id)).toContain("capivara");
    expect(hasSpeciesTranslation("onca-pintada")).toBe(true);
    setLanguage("Português");
    expect(filterSpeciesCatalog().find((item) => item.id === "onca-pintada")?.commonName).toBe("Onça-pintada");
  });

  it("traduz textos fixos, textos com valores e textos separados por ponto médio", () => {
    expect(tr("Novo avistamento", undefined, "en")).toBe("New sighting");
    expect(tr("Novo avistamento", undefined, "es")).toBe("Nuevo avistamiento");
    expect(tr("Novo avistamento", undefined, "de")).toBe("Neue Sichtung");
    expect(tr("102 espécie(s) encontrada(s)", undefined, "de")).toBe("102 Art(en) gefunden");
    expect(tr("Mamíferos · Matas", undefined, "en")).toBe("Mammals · Forests");
    expect(tr("Texto que não existe", undefined, "de")).toBe("Texto que não existe");
    expect(tr("Novo avistamento")).toBe("Novo avistamento");
  });

  it("inglês, espanhol e alemão cobrem as mesmas telas, e os valores {n} são preservados", () => {
    expect(Object.keys(uiEn).filter((key) => !(key in uiEs))).toEqual([]);
    expect(Object.keys(uiEn).filter((key) => !(key in uiDe))).toEqual([]);
    const marks = (text: string) => (text.match(/\{\d+\}/g) ?? []).sort().join();
    for (const table of [uiEn, uiEs, uiDe]) for (const [key, value] of Object.entries(table)) expect(marks(value), key).toBe(marks(key));
  });

  it("sem tradução para uma espécie, a ficha continua em português", () => {
    const base = filterSpeciesCatalog()[0];
    expect(localizeSpecies({ ...base, id: "especie-nova" }, "de").commonName).toBe(base.commonName);
  });
});
