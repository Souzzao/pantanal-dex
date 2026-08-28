import fs from "node:fs";
import path from "node:path";
import { catalogBatches, catalogSpecies, catalogSpeciesByEnvironment, catalogSpeciesByGroup } from "../shared/catalog";
import { CATALOG_ENVIRONMENTS, CATALOG_GROUPS } from "../shared/catalog/contract";

const batchIds = catalogBatches.map((batch) => batch.batchId);
const speciesIds = catalogSpecies.map((species) => species.id);
const duplicate = (values: string[]) => [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
const errors: string[] = [];
const duplicateBatchIds = duplicate(batchIds);
const duplicateSpeciesIds = duplicate(speciesIds);
if (duplicateBatchIds.length) errors.push(`IDs de lote duplicados: ${duplicateBatchIds.join(", ")}`);
if (duplicateSpeciesIds.length) errors.push(`IDs de espécie duplicados: ${duplicateSpeciesIds.join(", ")}`);
for (const batch of catalogBatches) {
  if (!batch.batchId || !batch.species.length) errors.push(`${batch.batchId || "lote sem ID"}: lote vazio ou sem ID`);
  if (!("pending-review" === batch.status || "review-ready" === batch.status || "verified" === batch.status)) errors.push(`${batch.batchId}: lote fora dos estados modulares permitidos`);
  if (batch.species.some((species) => !catalogSpecies.some((candidate) => candidate.id === species.id))) errors.push(`${batch.batchId}: índice combinado não contém espécie do lote`);
}
for (const group of CATALOG_GROUPS) if (!catalogSpeciesByGroup[group]?.length) errors.push(`${group}: índice de grupo vazio`);
for (const environment of CATALOG_ENVIRONMENTS) if (!catalogSpeciesByEnvironment[environment]?.length) errors.push(`${environment}: índice de ambiente vazio`);
const totalIndexedByGroup = Object.values(catalogSpeciesByGroup).reduce((total, records) => total + records.length, 0);
const totalIndexedByEnvironment = Object.values(catalogSpeciesByEnvironment).reduce((total, records) => total + records.length, 0);
const report = [
  "# Auditoria da arquitetura modular — passo 15/50",
  "",
  `A arquitetura foi auditada contra ${catalogBatches.length} lotes modulares e ${catalogSpecies.length} espécies combinadas.`,
  "",
  "| Verificação | Resultado |",
  "|---|---:|",
  `| Lotes modulares | ${catalogBatches.length} |`,
  `| Espécies modulares | ${catalogSpecies.length} |`,
  `| IDs de lote únicos | ${duplicateBatchIds.length ? "não" : "sim"} |`,
  `| IDs de espécie únicos | ${duplicateSpeciesIds.length ? "não" : "sim"} |`,
  `| Grupos indexados | ${Object.keys(catalogSpeciesByGroup).length}/${CATALOG_GROUPS.length} |`,
  `| Ambientes indexados | ${Object.keys(catalogSpeciesByEnvironment).length}/${CATALOG_ENVIRONMENTS.length} |`,
  `| Registros indexados por grupo | ${totalIndexedByGroup} |`,
  `| Registros indexados por ambiente | ${totalIndexedByEnvironment} |`,
  `| Falhas estruturais | ${errors.length} |`,
  `| Resultado | **${errors.length ? "FAIL" : "PASS"}** |`,
  "",
  "> Cada registro modular permanece em seu lote de origem e é agregado ao índice combinado sem criar IDs duplicados. Os índices por ambiente podem conter o mesmo registro mais de uma vez quando a espécie ocupa múltiplos ambientes.",
  "",
  errors.length ? `## Falhas\n\n${errors.map((error) => `- ${error}`).join("\n")}` : "Nenhuma falha de isolamento, indexação ou unicidade foi encontrada.",
  "",
].join("\n");
fs.writeFileSync(path.join(process.cwd(), "CATALOG-ARCHITECTURE-AUDIT.md"), report);
console.log(JSON.stringify({ batches: catalogBatches.length, species: catalogSpecies.length, duplicateBatchIds, duplicateSpeciesIds, groups: Object.keys(catalogSpeciesByGroup).length, environments: Object.keys(catalogSpeciesByEnvironment).length, totalIndexedByGroup, totalIndexedByEnvironment, errors, status: errors.length ? "FAIL" : "PASS" }, null, 2));
if (errors.length) process.exitCode = 1;
