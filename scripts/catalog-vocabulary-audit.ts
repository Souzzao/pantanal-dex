import fs from "node:fs";
import path from "node:path";
import { catalogSpecies } from "../shared/catalog";
import { CATALOG_ENVIRONMENTS, CATALOG_GROUPS } from "../shared/catalog/contract";

const groups = Object.fromEntries(CATALOG_GROUPS.map((group) => [group, catalogSpecies.filter((species) => species.group === group).length]));
const environments = Object.fromEntries(CATALOG_ENVIRONMENTS.map((environment) => [environment, catalogSpecies.filter((species) => species.environments.includes(environment)).length]));
const invalidGroups = catalogSpecies.filter((species) => !CATALOG_GROUPS.includes(species.group)).map((species) => species.id);
const invalidEnvironments = catalogSpecies.flatMap((species) => species.environments.filter((environment) => !CATALOG_ENVIRONMENTS.includes(environment)).map((environment) => `${species.id}:${environment}`));
const uncoveredGroups = CATALOG_GROUPS.filter((group) => groups[group] === 0);
const uncoveredEnvironments = CATALOG_ENVIRONMENTS.filter((environment) => environments[environment] === 0);
const errors = [...invalidGroups.map((id) => `${id}: grupo fora do contrato`), ...invalidEnvironments.map((entry) => `${entry}: ambiente fora do contrato`), ...uncoveredGroups.map((group) => `${group}: grupo sem registro`), ...uncoveredEnvironments.map((environment) => `${environment}: ambiente sem registro`)];
const report = [
  "# Auditoria de grupos e ambientes — passo 14/50",
  "",
  `Foram auditados ${catalogSpecies.length} registros modulares contra o vocabulário congelado do contrato MVP.`,
  "",
  "## Distribuição por grupo",
  "",
  "| Grupo | Registros |",
  "|---|---:|",
  ...Object.entries(groups).map(([group, count]) => `| ${group} | ${count} |`),
  "",
  "## Cobertura por ambiente",
  "",
  "| Ambiente | Registros |",
  "|---|---:|",
  ...Object.entries(environments).map(([environment, count]) => `| ${environment} | ${count} |`),
  "",
  `- Vocabulário de grupos válido: **${invalidGroups.length ? "não" : "sim"}**`,
  `- Vocabulário de ambientes válido: **${invalidEnvironments.length ? "não" : "sim"}**`,
  `- Cobertura de todos os grupos: **${uncoveredGroups.length ? "não" : "sim"}**`,
  `- Cobertura de todos os ambientes: **${uncoveredEnvironments.length ? "não" : "sim"}**`,
  `- Resultado: **${errors.length ? "FAIL" : "PASS"}**`,
  "",
  errors.length ? `## Falhas\n\n${errors.map((error) => `- ${error}`).join("\n")}` : "Nenhuma divergência de vocabulário ou lacuna de cobertura foi encontrada.",
  "",
  "> A distribuição representa registros que podem ocupar mais de um ambiente; por isso, os totais por ambiente não precisam somar exatamente o total de espécies.",
  "",
].join("\n");
fs.writeFileSync(path.join(process.cwd(), "CATALOG-VOCABULARY-AUDIT.md"), report);
console.log(JSON.stringify({ species: catalogSpecies.length, groups, environments, invalidGroups, invalidEnvironments, uncoveredGroups, uncoveredEnvironments, errors, status: errors.length ? "FAIL" : "PASS" }, null, 2));
if (errors.length) process.exitCode = 1;
