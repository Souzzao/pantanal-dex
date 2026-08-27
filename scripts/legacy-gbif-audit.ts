import fs from "node:fs";
import path from "node:path";
import { species } from "../shared/pantanal";

const root = process.cwd();
const targets = [
  ["pintado", "Pseudoplatystoma corruscans"],
  ["pacu", "Piaractus mesopotamicus"],
  ["piraputanga", "Brycon hilarii"],
  ["caranguejo-agua-doce", "Dilocarcinus pagei"],
  ["camarao-agua-doce", "Macrobrachium amazonicum"],
] as const;

type GbifMatch = { usageKey?: number; scientificName?: string; canonicalName?: string; status?: string; confidence?: number; matchType?: string };

async function main() {
  const errors: string[] = [];
  const rows: { id: string; expected: string; canonicalName: string; usageKey: number | string; status: string; matchType: string; confidence: number | string; sourceUrl: string }[] = [];

  for (const [id, expected] of targets) {
    const record = species.find((item) => item.id === id);
    if (!record) {
      errors.push(`${id}: registro ausente`);
      continue;
    }
    const source = record.sources.find((item) => item.url.includes("api.gbif.org/v1/species/match?name="));
    if (!source) {
      errors.push(`${id}: fonte GBIF ausente`);
      continue;
    }
    const response = await fetch(source.url);
    if (!response.ok) {
      errors.push(`${id}: GBIF respondeu HTTP ${response.status}`);
      continue;
    }
    const match = await response.json() as GbifMatch;
    if (match.canonicalName !== expected) errors.push(`${id}: canonicalName esperado ${expected}, recebido ${match.canonicalName ?? "ausente"}`);
    if (record.scientificName !== expected) errors.push(`${id}: nome científico do registro diverge de ${expected}`);
    if (match.status !== "ACCEPTED") errors.push(`${id}: status GBIF não é ACCEPTED`);
    if (match.matchType !== "EXACT") errors.push(`${id}: matchType GBIF não é EXACT`);
    if (!match.usageKey) errors.push(`${id}: usageKey GBIF ausente`);
    rows.push({ id, expected, canonicalName: match.canonicalName ?? "", usageKey: match.usageKey ?? "", status: match.status ?? "", matchType: match.matchType ?? "", confidence: match.confidence ?? "", sourceUrl: source.url });
  }

  const markdown = [
    "# Auditoria GBIF das espécies legadas — passo 7/50",
    "",
    `Consulta executada em ${new Date().toISOString()} contra as URLs GBIF versionadas nos registros do catálogo.`,
    "",
    "| ID | Nome esperado | Canonical name GBIF | Usage key | Status | Match type | Confiança | Resultado |",
    "|---|---|---|---:|---|---|---:|---|",
    ...rows.map((row) => `| \`${row.id}\` | ${row.expected} | ${row.canonicalName} | ${row.usageKey} | ${row.status} | ${row.matchType} | ${row.confidence} | ${errors.some((error) => error.startsWith(`${row.id}:`)) ? "FAIL" : "PASS"} |`),
    "",
    `**Resultado geral:** ${errors.length ? "FAIL" : "PASS"}. ${rows.length}/5 registros consultados; ${errors.length} erro(s).`,
    "",
    "## Regra de promoção",
    "",
    "A correspondência taxonômica GBIF confirma apenas identidade e status taxonômico. Ela não confirma ocorrência regional no Pantanal, conservação, licença de imagem ou revisão editorial; essas trilhas permanecem separadas e podem bloquear a promoção a `verified`.",
    "",
    errors.length ? `## Erros\n\n${errors.map((error) => `- ${error}`).join("\n")}` : "Nenhum erro taxonômico foi encontrado.",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(root, "CATALOG-LEGACY-GBIF-AUDIT.md"), markdown);
  console.log(JSON.stringify({ targets: targets.length, queried: rows.length, errors, status: errors.length ? "FAIL" : "PASS", rows }, null, 2));
  if (errors.length) process.exitCode = 1;
}

void main();
