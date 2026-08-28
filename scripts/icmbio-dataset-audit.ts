import fs from "node:fs";
import path from "node:path";
import { regionalOccurrenceRecords, validateRegionalOccurrenceRecords } from "../shared/catalog/regional-occurrence";

const datasetUrl = "https://collectory.sibbr.gov.br/collectory/public/show/dr327";
const iptUrl = "https://ipt.icmbio.gov.br/resource?r=sisbio_ocorrencia&v=1.649";
const errors = validateRegionalOccurrenceRecords(regionalOccurrenceRecords);
const checks: { label: string; url: string; httpStatus: number | string; accessible: boolean; structured: boolean; note: string }[] = [];

async function probe(label: string, url: string) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    const body = await response.text();
    const structured = (response.headers.get("content-type") ?? "").includes("json");
    checks.push({ label, url, httpStatus: response.status, accessible: response.ok, structured, note: structured ? "resposta JSON" : "resposta não estruturada para auditoria automática" });
  } catch (error) {
    checks.push({ label, url, httpStatus: "erro", accessible: false, structured: false, note: error instanceof Error ? error.message : "falha desconhecida" });
  }
}

async function main() {
  await probe("Metadados do dataset ICMBio/SISBio dr327", datasetUrl);
  await probe("Referência IPT ICMBio/SISBio v1.649", iptUrl);
  await Promise.all(regionalOccurrenceRecords.map((record) => probe(`Filtro ${record.scientificName}`, record.queryUrl)));

  if (!regionalOccurrenceRecords.length) errors.push("ledger regional sem registros");
  const datasetRecords = regionalOccurrenceRecords.filter((record) => record.sourceUrl === datasetUrl);
  if (datasetRecords.some((record) => record.status !== "pending-review")) errors.push("registro do dataset dr327 promovido sem contagem estruturada");
  if (regionalOccurrenceRecords.some((record) => record.status === "pending-review")) errors.push("há registro regional ainda pendente após a auditoria final");
  const metadata = checks[0];
  if (!metadata?.accessible) errors.push("metadados do dataset não acessíveis nesta execução");

  const markdown = [
    "# Auditoria do dataset ICMBio/SISBio — passo 9/50",
    "",
    "O dataset `dr327` foi auditado como fonte oficial de contexto para ocorrência em Unidades de Conservação Federais. A licença publicada no SiBBr é CC BY 4.0; a confirmação individual de ocorrência continua dependente de resposta estruturada dos filtros.",
    "",
    `- Página de metadados: [SiBBr dr327](${datasetUrl})`,
    `- Referência do IPT: [SISBio v1.649](${iptUrl})`,
    `- Licença declarada: CC BY 4.0`,
    "",
    "## Probes executados",
    "",
    "| Consulta | HTTP | Acessível | Estruturada | Observação |",
    "|---|---:|---|---|---|",
    ...checks.map((check) => `| ${check.label} | ${check.httpStatus} | ${check.accessible ? "sim" : "não"} | ${check.structured ? "sim" : "não"} | ${check.note} |`),
    "",
    `**Resultado do contrato:** ${errors.length ? "FAIL" : "PASS"}. ${regionalOccurrenceRecords.length} registros regionais auditados; ${datasetRecords.length} usam o dataset dr327; ${regionalOccurrenceRecords.filter((record) => record.status === "pending-review").length} permanecem ` + "`pending-review`" + "; ${errors.length} erro(s).",
    "",
    "> Acesso ao dataset e licença não equivalem a confirmação de presença de uma espécie no Pantanal. Sem contagem ou resposta estruturada por filtro, o ledger não promove o registro e não infere ausência.",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(process.cwd(), "CATALOG-ICMBIO-DATASET-AUDIT.md"), markdown);
  console.log(JSON.stringify({ datasetUrl, filters: regionalOccurrenceRecords.length, pending: regionalOccurrenceRecords.filter((record) => record.status === "pending-review").length, checks, errors, status: errors.length ? "FAIL" : "PASS" }, null, 2));
  if (errors.length) process.exitCode = 1;
}

void main();
