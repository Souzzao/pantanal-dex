import fs from "node:fs";
import path from "node:path";
import { regionalOccurrenceRecords, validateRegionalOccurrenceRecords } from "../shared/catalog/regional-occurrence";

const errors = validateRegionalOccurrenceRecords(regionalOccurrenceRecords);
const expectedIds = ["pintado", "pacu", "piraputanga", "caranguejo-agua-doce", "camarao-agua-doce"];
const ids = regionalOccurrenceRecords.map((record) => record.speciesId);
if (regionalOccurrenceRecords.length !== expectedIds.length) errors.push(`ledger deveria conter ${expectedIds.length} registros`);
if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) errors.push("ordem ou cobertura de espécies divergente do contrato");
if (regionalOccurrenceRecords.some((record) => record.status !== "pending-review")) errors.push("ocorrência foi promovida sem evidência estruturada");
if (regionalOccurrenceRecords.some((record) => record.sourceUrl !== "https://collectory.sibbr.gov.br/collectory/public/show/dr327")) errors.push("fonte regional não corresponde ao dataset ICMBio/SISBio dr327");
if (regionalOccurrenceRecords.some((record) => record.checkedAt !== "2026-08-27")) errors.push("data de verificação regional desatualizada");

const markdown = [
  "# Auditoria do ledger de ocorrência regional — passo 8/50",
  "",
  "O ledger registra consultas oficiais do dataset ICMBio/SISBio `dr327` no SiBBr para cinco espécies legadas.",
  "",
  "| ID | Região | Estado | Fonte | Evidência conservadora |",
  "|---|---|---|---|---|",
  ...regionalOccurrenceRecords.map((record) => `| \`${record.speciesId}\` | ${record.region} | \`${record.status}\` | [${record.sourceTitle}](${record.sourceUrl}) | ${record.evidence} |`),
  "",
  `**Resultado:** ${errors.length ? "FAIL" : "PASS"}. ${regionalOccurrenceRecords.length}/5 registros cobertos; ${regionalOccurrenceRecords.filter((record) => record.status === "pending-review").length} permanecem pendentes; ${errors.length} erro(s).`,
  "",
  "> `pending-review` significa que a consulta não forneceu evidência estruturada suficiente nesta execução. Não significa ausência de ocorrência.",
  "",
  "## Limite da evidência",
  "",
  "O dataset oficial foi localizado e sua licença CC BY 4.0 foi confirmada. A consulta filtrada no ALA-Hub/SiBBr não forneceu contagem estruturada confiável no ambiente de execução; por isso, nenhuma espécie foi promovida a `confirmed`, e nenhuma ausência foi inferida.",
  "",
].join("\n");
fs.writeFileSync(path.join(process.cwd(), "CATALOG-REGIONAL-OCCURRENCE-AUDIT.md"), markdown);
console.log(JSON.stringify({ records: regionalOccurrenceRecords.length, pending: regionalOccurrenceRecords.filter((record) => record.status === "pending-review").length, errors, status: errors.length ? "FAIL" : "PASS" }, null, 2));
if (errors.length) process.exitCode = 1;
