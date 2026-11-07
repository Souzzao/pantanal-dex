import { describe, expect, it } from "vitest";

import { createExportCsv, EXPORT_CSV_HEADER } from "../shared/exports";
import type { Sighting } from "../shared/pantanal";

const base: Sighting = {
  id: "csv-1",
  speciesId: "tuiuiu",
  date: "2026-11-05",
  locationPrecision: "exact",
  visibility: "private",
  createdAt: "2026-11-05T10:00:00.000Z",
  updatedAt: "2026-11-05T10:00:00.000Z",
};

const row = (sighting: Sighting) => createExportCsv([sighting]).split("\n")[1];

describe("exportação CSV segura", () => {
  it("escapa aspas em qualquer coluna de texto, não só nas observações", () => {
    expect(row({ ...base, locationLabel: 'Baía "do Tuiuiú"' })).toContain('"Baía ""do Tuiuiú"""');
  });

  it("neutraliza texto que planilhas executariam como fórmula", () => {
    const line = row({ ...base, notes: '=HYPERLINK("http://exemplo.invalido","clique")', locationLabel: "+55 65 9999" });
    expect(line).toContain(`"'=HYPERLINK(""http://exemplo.invalido"",""clique"")"`);
    expect(line).toContain(`"'+55 65 9999"`);
    for (const prefix of ["-", "@", "\t"]) {
      expect(row({ ...base, notes: `${prefix}x` })).toContain(`"'${prefix}x"`);
    }
  });

  it("mantém números negativos como números (latitude/longitude)", () => {
    const line = row({ ...base, latitude: -16.43, longitude: -56.88 });
    expect(line).toContain('"-16.43","-56.88"');
    expect(line).not.toContain("'-16");
  });

  it("preserva cabeçalho, campos vazios e quantidade de colunas", () => {
    const csv = createExportCsv([base]);
    expect(csv.split("\n")[0]).toBe(EXPORT_CSV_HEADER);
    expect(row(base)).toBe('"csv-1","tuiuiu","2026-11-05","","","","","exact","","","private"');
  });
});
