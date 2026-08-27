import fs from "node:fs";
import path from "node:path";
import { conservationReviewRecords, validateConservationReviewRecords } from "../shared/catalog/conservation";

const expectedIds = ["pintado", "pacu", "piraputanga", "caranguejo-agua-doce", "camarao-agua-doce"];
const errors = validateConservationReviewRecords(conservationReviewRecords);
if (conservationReviewRecords.length !== expectedIds.length) errors.push(`ledger deveria conter ${expectedIds.length} registros`);
if (JSON.stringify(conservationReviewRecords.map((record) => record.speciesId)) !== JSON.stringify(expectedIds)) errors.push("cobertura ou ordem das espécies divergente do contrato");
const pintado = conservationReviewRecords.find((record) => record.speciesId === "pintado");
const pacu = conservationReviewRecords.find((record) => record.speciesId === "pacu");
if (!pintado || pintado.status !== "confirmed" || pintado.category !== "VU" || pintado.sourceKind !== "Portaria MMA/ICMBio" || !pintado.evidence.includes("linha 448")) errors.push("pintado não possui confirmação normativa individual VU");
if (!pacu || pacu.status !== "confirmed" || pacu.finding !== "not-listed" || pacu.sourceKind !== "Portaria MMA/ICMBio" || !pacu.evidence.includes("não contém correspondência exata")) errors.push("pacu não possui finding oficial de não listagem");
if (conservationReviewRecords.filter((record) => !["pintado", "pacu"].includes(record.speciesId)).some((record) => record.status !== "pending-review")) errors.push("registro além de pintado e pacu foi confirmado sem evidência individual");
if (conservationReviewRecords.filter((record) => !["pintado", "pacu"].includes(record.speciesId)).some((record) => record.category || record.finding)) errors.push("registro pendente possui classificação preenchida");
if (conservationReviewRecords.some((record) => record.checkedAt !== "2026-08-27")) errors.push("data de verificação desatualizada");
const allowedHosts = new Set(["salve.icmbio.gov.br", "www.gov.br"]);
for (const record of conservationReviewRecords) {
  try {
    if (!allowedHosts.has(new URL(record.sourceUrl).hostname)) errors.push(`${record.speciesId}: host de conservação fora da lista oficial`);
  } catch {
    errors.push(`${record.speciesId}: URL de conservação inválida`);
  }
}

const markdown = [
  "# Auditoria da trilha oficial de conservação — passo 23/50",
  "",
  "A trilha usa SALVE/ICMBio, Livro Vermelho da Fauna Brasileira e listas/portarias MMA/ICMBio como fontes elegíveis. No passo 22, `pintado` foi confirmado individualmente como VU pela Portaria MMA nº 148/2022. No passo 23, `pacu` foi confirmado como `not-listed` na mesma lista após busca exata; isso não equivale a LC e não representa uma avaliação de baixo risco.",
  "",
  "| ID | Nome científico | Categoria | Fonte | Estado | Regra |",
  "|---|---|---|---|---|---|",
  ...conservationReviewRecords.map((record) => `| \`${record.speciesId}\` | ${record.scientificName} | \`${record.category ?? "—"}\` | [${record.sourceKind}](${record.sourceUrl}) | \`${record.status}\` | ${record.decisionRule} |`),
  "",
  `**Resultado:** ${errors.length ? "FAIL" : "PASS"}. ${conservationReviewRecords.length}/5 registros cobertos; ${conservationReviewRecords.filter((record) => record.status === "confirmed").length} confirmado(s); ${conservationReviewRecords.filter((record) => record.status === "pending-review").length} pendentes; ${errors.length} erro(s).`,
  "",
  "> Nenhuma categoria de ameaça foi inventada. A promoção de `pintado` para `confirmed` exige categoria individual na Portaria MMA nº 148/2022. Para `pacu`, `not-listed` registra apenas a ausência de correspondência na lista nacional consultada; os demais registros seguem `pending-review`.",
  "",
].join("\n");
fs.writeFileSync(path.join(process.cwd(), "CATALOG-CONSERVATION-AUDIT.md"), markdown);
console.log(JSON.stringify({ records: conservationReviewRecords.length, pending: conservationReviewRecords.filter((record) => record.status === "pending-review").length, errors, status: errors.length ? "FAIL" : "PASS" }, null, 2));
if (errors.length) process.exitCode = 1;
