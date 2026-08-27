import fs from "node:fs";
import path from "node:path";
import { catalogSpecies } from "../shared/catalog";

const approved = /^(CC0|CC BY(?:-SA)?(?: [0-9.]+)?|Public domain|Domínio público)$/i;
const blocked = /\b(?:NC|ND|non-commercial|no derivatives|sem fins comerciais|sem derivados)\b/i;
const allImages = catalogSpecies.flatMap((species) => species.images.map((image) => ({ species, image })));
const licenses = new Map<string, number>();
const errors: string[] = [];
for (const { species, image } of allImages) {
  licenses.set(image.license, (licenses.get(image.license) ?? 0) + 1);
  if (!/^https?:\/\//.test(image.uri) || !/^https?:\/\//.test(image.sourceUrl)) errors.push(`${species.id}: URL de imagem inválida`);
  if (!image.author.trim() || !image.credit.trim()) errors.push(`${species.id}: autor/crédito ausente`);
  if (blocked.test(image.license) || !approved.test(image.license)) errors.push(`${species.id}: licença incompatível (${image.license})`);
}
const byGroup = [...new Set(catalogSpecies.map((species) => species.group))].map((group) => ({ group, species: catalogSpecies.filter((species) => species.group === group).length, images: allImages.filter(({ species }) => species.group === group).length }));
const report = [
  "# Auditoria de imagens, créditos e licenças — passo 11/50",
  "",
  `Auditoria dos ${catalogSpecies.length} registros modulares e ${allImages.length} imagens versionadas no catálogo.`,
  "",
  "## Resultado",
  "",
  `- Espécies auditadas: **${catalogSpecies.length}**`,
  `- Imagens auditadas: **${allImages.length}**`,
  `- Licenças aprovadas: **${allImages.length - errors.filter((error) => error.includes("licença incompatível")).length}/${allImages.length}**`,
  `- Falhas de URL/crédito/licença: **${errors.length}**`,
  `- Status: **${errors.length ? "FAIL" : "PASS"}**`,
  "",
  "## Distribuição por grupo",
  "",
  "| Grupo | Espécies | Imagens |",
  "|---|---:|---:|",
  ...byGroup.map((row) => `| ${row.group} | ${row.species} | ${row.images} |`),
  "",
  "## Distribuição por licença",
  "",
  "| Licença declarada | Imagens |",
  "|---|---:|",
  ...[...licenses.entries()].sort((a, b) => b[1] - a[1]).map(([license, count]) => `| ${license} | ${count} |`),
  "",
  errors.length ? `## Falhas\n\n${errors.map((error) => `- ${error}`).join("\n")}` : "Nenhuma falha de URL, crédito ou licença foi encontrada.",
  "",
  "> Licenças com restrição NC/ND, ausência de crédito ou URL não verificável bloqueiam a aprovação comercial. A presença da imagem não confirma ocorrência regional nem conservação.",
  "",
].join("\n");
fs.writeFileSync(path.join(process.cwd(), "CATALOG-IMAGE-LICENSE-AUDIT.md"), report);
console.log(JSON.stringify({ species: catalogSpecies.length, images: allImages.length, licenses: Object.fromEntries(licenses), errors, status: errors.length ? "FAIL" : "PASS" }, null, 2));
if (errors.length) process.exitCode = 1;
