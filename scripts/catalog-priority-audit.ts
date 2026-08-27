import fs from "node:fs";
import path from "node:path";
import { species } from "../shared/pantanal";
import { catalogP1Priorities, catalogP2Priorities, catalogPriorityMatrix, validateCatalogPriorities } from "../shared/catalog";

const errors = validateCatalogPriorities(catalogPriorityMatrix, species);
const selected = catalogPriorityMatrix.filter((priority) => priority.speciesId !== null);
const pending = catalogPriorityMatrix.filter((priority) => priority.speciesId === null);
const report = {
  priorityEntries: catalogPriorityMatrix.length,
  p1Entries: catalogP1Priorities.length,
  p2Entries: catalogP2Priorities.length,
  selectedEntries: selected.length,
  pendingEntries: pending.length,
  selectedIds: selected.map((priority) => priority.speciesId),
  pendingSpecies: pending.map((priority) => ({ commonName: priority.commonName, scientificName: priority.scientificName })),
  errors,
  status: errors.length ? "FAIL" : "PASS",
};

const table = (rows: string[][]) => [
  "| Prioridade | Nome popular | Nome científico | ID | Grupo | Ambientes | Fonte taxonômica |",
  "|---|---|---|---|---|---|---|",
  ...rows.map((row) => `| ${row.join(" | ")} |`),
].join("\n");
const selectedRows = selected.map((priority) => [
  priority.priority,
  priority.commonName,
  priority.scientificName ?? "",
  priority.speciesId ?? "—",
  priority.groups.join(", "),
  priority.environments.join(", "),
  `[GBIF](${priority.sourceUrl})`,
]);
const pendingRows = pending.map((priority) => [
  priority.priority,
  priority.commonName,
  priority.scientificName ?? "",
  "—",
  priority.groups.join(", "),
  priority.environments.join(", "),
  `[GBIF](${priority.sourceUrl})`,
]);
const markdown = [
  "# Seleção prioritária do catálogo",
  "",
  "> Artefato gerado por `pnpm catalog:priority-audit`. A seleção não promove nenhuma espécie a `verified`; ocorrência regional, licenças de imagens e conservação continuam sujeitas à revisão editorial.",
  "",
  "## Métricas",
  "",
  `| Métrica | Valor |`,
  `|---|---:|`,
  `| Entradas prioritárias | ${report.priorityEntries} |`,
  `| P1 | ${report.p1Entries} |`,
  `| P2 | ${report.p2Entries} |`,
  `| Selecionadas com ID no catálogo combinado | ${report.selectedEntries} |`,
  `| Pendentes sem registro no catálogo | ${report.pendingEntries} |`,
  `| Resultado do validador | **${report.status}** |`,
  "",
  "## Seleções com registro correspondente",
  "",
  table(selectedRows),
  "",
  "## Prioridades ainda sem registro",
  "",
  table(pendingRows),
  "",
  "## Regras aplicadas",
  "",
  "- IDs existentes devem ser únicos, ASCII e em kebab-case.",
  "- Cada prioridade deve ter nome popular, nome científico, grupo, ambiente, justificativa e consulta taxonômica GBIF.",
  "- O validador compara IDs selecionados com o catálogo combinado e rejeita divergência de táxon, grupo ou ambiente.",
  "- Prioridades sem registro permanecem explícitas como pendências; nenhum ID sintético é criado para preencher lacunas.",
  "",
].join("\n");
fs.writeFileSync(path.join(process.cwd(), "CATALOG-PRIORITY-SELECTION.md"), markdown);
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
