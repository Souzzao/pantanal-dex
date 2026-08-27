import fs from "node:fs";
import path from "node:path";
import { conservationReviewRecords, validateConservationReviewRecords } from "../shared/catalog/conservation";

const expectedIds = ["pintado", "pacu", "piraputanga", "caranguejo-agua-doce", "camarao-agua-doce"];
const errors = validateConservationReviewRecords(conservationReviewRecords);
if (conservationReviewRecords.length !== expectedIds.length) errors.push(`ledger deveria conter ${expectedIds.length} registros`);
if (JSON.stringify(conservationReviewRecords.map((record) => record.speciesId)) !== JSON.stringify(expectedIds)) errors.push("cobertura ou ordem das espécies divergente do contrato");
const pintado = conservationReviewRecords.find((record) => record.speciesId === "pintado");
const pacu = conservationReviewRecords.find((record) => record.speciesId === "pacu");
const piraputanga = conservationReviewRecords.find((record) => record.speciesId === "piraputanga");
const caranguejo = conservationReviewRecords.find((record) => record.speciesId === "caranguejo-agua-doce");
if (!pintado || pintado.status !== "confirmed" || pintado.category !== "VU" || pintado.sourceKind !== "Portaria MMA/ICMBio" || !pintado.evidence.includes("linha 448")) errors.push("pintado não possui confirmação normativa individual VU");
if (!pacu || pacu.status !== "confirmed" || pacu.finding !== "not-listed" || pacu.sourceKind !== "Portaria MMA/ICMBio" || !pacu.evidence.includes("não contém correspondência exata")) errors.push("pacu não possui finding oficial de não listagem");
if (!piraputanga || piraputanga.status !== "confirmed" || piraputanga.finding !== "not-listed" || piraputanga.sourceKind !== "Portaria MMA/ICMBio" || !piraputanga.evidence.includes("Brycon hilarii nem para piraputanga")) errors.push("piraputanga não possui finding oficial de não listagem");
if (!caranguejo || caranguejo.status !== "confirmed" || caranguejo.category !== "LC" || caranguejo.sourceKind !== "Avaliação ICMBio" || !caranguejo.evidence.includes("avaliações realizadas entre 2010 e 2014")) errors.push("caranguejo não possui avaliação oficial individual LC");
if (conservationReviewRecords.filter((record) => record.speciesId === "camarao-agua-doce").some((record) => record.status !== "pending-review" || record.category || record.finding)) errors.push("camarao foi classificado sem evidência individual");
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
  "# Auditoria da trilha oficial de conservação — passo 25/50",
  "",
  "A trilha usa SALVE/ICMBio, Livro Vermelho da Fauna Brasileira e listas/portarias MMA/ICMBio como fontes elegíveis. No passo 22, `pintado` foi confirmado individualmente como VU pela Portaria MMA nº 148/2022. Nos passos 23 e 24, `pacu` e `piraputanga` foram confirmados como `not-listed` na mesma lista após busca exata; isso não equivale a LC e não representa uma avaliação de baixo risco. No passo 25, `caranguejo-agua-doce` recebeu a categoria LC em avaliação técnica oficial do ICMBio realizada entre 2010 e 2014.",
  "",
  "| ID | Nome científico | Categoria | Fonte | Estado | Regra |",
  "|---|---|---|---|---|---|",
  ...conservationReviewRecords.map((record) => `| \`${record.speciesId}\` | ${record.scientificName} | \`${record.category ?? "—"}\` | [${record.sourceKind}](${record.sourceUrl}) | \`${record.status}\` | ${record.decisionRule} |`),
  "",
  `**Resultado:** ${errors.length ? "FAIL" : "PASS"}. ${conservationReviewRecords.length}/5 registros cobertos; ${conservationReviewRecords.filter((record) => record.status === "confirmed").length} confirmado(s); ${conservationReviewRecords.filter((record) => record.status === "pending-review").length} pendentes; ${errors.length} erro(s).`,
  "",
  "> Nenhuma categoria de ameaça foi inventada. `pintado` tem VU na Portaria MMA nº 148/2022; `pacu` e `piraputanga` têm finding `not-listed`; `caranguejo-agua-doce` tem LC na avaliação técnica oficial do ICMBio. A avaliação LC é datada e não deve ser confundida automaticamente com uma lista legal posterior; `camarao-agua-doce` segue `pending-review`.",
  "",
].join("\n");
fs.writeFileSync(path.join(process.cwd(), "CATALOG-CONSERVATION-AUDIT.md"), markdown);
console.log(JSON.stringify({ records: conservationReviewRecords.length, pending: conservationReviewRecords.filter((record) => record.status === "pending-review").length, errors, status: errors.length ? "FAIL" : "PASS" }, null, 2));
if (errors.length) process.exitCode = 1;
