import fs from "node:fs";
import path from "node:path";
import { catalogBatches, catalogSpecies } from "../shared/catalog";

const approvedHosts = new Set(["api.gbif.org", "sibbr.gov.br", "icmbio.gov.br", "gov.br", "pt.wikipedia.org", "www.wikidata.org"]);
const sources = catalogSpecies.flatMap((species) => species.sources.map((source) => ({ species, source })));
const errors: string[] = [];
const hosts = new Map<string, number>();
for (const { species, source } of sources) {
  if (!source.title.trim()) errors.push(`${species.id}: fonte sem título`);
  try {
    const url = new URL(source.url);
    hosts.set(url.hostname, (hosts.get(url.hostname) ?? 0) + 1);
    if (url.protocol !== "https:") errors.push(`${species.id}: fonte sem HTTPS`);
    if (![...approvedHosts].some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) errors.push(`${species.id}: host fora da lista aprovada (${url.hostname})`);
  } catch {
    errors.push(`${species.id}: URL inválida`);
  }
}
const gbifSpeciesUrls = sources.filter(({ source }) => source.url.startsWith("https://api.gbif.org/")).length;
const batchSources = catalogBatches.flatMap((batch) => batch.sources);
const gbifBatchUrls = batchSources.filter((source) => source.url.startsWith("https://api.gbif.org/")).length;
const gbifUrls = gbifSpeciesUrls + gbifBatchUrls;
const report = [
  "# Auditoria de fontes estruturadas — passo 12/50",
  "",
  `Auditoria de ${catalogSpecies.length} espécies modulares, ${sources.length} fontes por espécie e ${catalogBatches.length} lotes.`,
  "",
  "## Resultado",
  "",
  `- Fontes por espécie: **${sources.length}**`,
  `- URLs GBIF: **${gbifUrls}** (${gbifSpeciesUrls} por espécie + ${gbifBatchUrls} por lote)`,
  `- Fontes de lote: **${batchSources.length}**`,
  `- Títulos presentes: **${sources.filter(({ source }) => source.title.trim()).length}/${sources.length}**`,
  `- URLs HTTPS: **${sources.filter(({ source }) => source.url.startsWith("https://")).length}/${sources.length}**`,
  `- Erros estruturais: **${errors.length}**`,
  `- Status: **${errors.length ? "FAIL" : "PASS"}**`,
  "",
  "## Distribuição por host",
  "",
  "| Host | Fontes |",
  "|---|---:|",
  ...[...hosts.entries()].sort((a, b) => b[1] - a[1]).map(([host, count]) => `| ${host} | ${count} |`),
  "",
  "## Cobertura por grupo",
  "",
  "| Grupo | Espécies | Fontes |",
  "|---|---:|---:|",
  ...[...new Set(catalogSpecies.map((species) => species.group))].map((group) => `| ${group} | ${catalogSpecies.filter((species) => species.group === group).length} | ${sources.filter(({ species }) => species.group === group).length} |`),
  "",
  errors.length ? `## Falhas\n\n${errors.map((error) => `- ${error}`).join("\n")}` : "Nenhuma falha de título, HTTPS ou host aprovado foi encontrada.",
  "",
  "> Uma fonte taxonômica estruturada comprova rastreabilidade da referência, mas não substitui evidência de ocorrência regional, conservação ou licença de imagem.",
  "",
].join("\n");
fs.writeFileSync(path.join(process.cwd(), "CATALOG-SOURCE-AUDIT.md"), report);
console.log(JSON.stringify({ batches: catalogBatches.length, species: catalogSpecies.length, speciesSources: sources.length, batchSources: batchSources.length, gbifSpeciesUrls, gbifBatchUrls, gbifUrls, hosts: Object.fromEntries(hosts), errors, status: errors.length ? "FAIL" : "PASS" }, null, 2));
if (errors.length) process.exitCode = 1;
