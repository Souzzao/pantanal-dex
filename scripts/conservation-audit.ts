import fs from "node:fs";
import path from "node:path";
import { conservationReviewRecords, validateConservationReviewRecords } from "../shared/catalog/conservation";

const expectedIds = ["prochilodus-lineatus", "megaceryle-torquata", "egretta-thula", "heliconius-erato", "cateto", "phoneutria-nigriventer", "zungaro-jahu", "tucano-toco", "arara-caninde", "veado-campeiro", "pintado", "pacu", "piraputanga", "caranguejo-agua-doce", "camarao-agua-doce"];
const errors = validateConservationReviewRecords(conservationReviewRecords);
if (conservationReviewRecords.length !== expectedIds.length) errors.push(`ledger deveria conter ${expectedIds.length} registros`);
if (JSON.stringify(conservationReviewRecords.map((record) => record.speciesId)) !== JSON.stringify(expectedIds)) errors.push("cobertura ou ordem das espécies divergente do contrato");
const curimbata = conservationReviewRecords.find((record) => record.speciesId === "prochilodus-lineatus");
const tucanucu = conservationReviewRecords.find((record) => record.speciesId === "megaceryle-torquata");
const garca = conservationReviewRecords.find((record) => record.speciesId === "egretta-thula");
const danca = conservationReviewRecords.find((record) => record.speciesId === "heliconius-erato");
const cateto = conservationReviewRecords.find((record) => record.speciesId === "cateto");
const armadeira = conservationReviewRecords.find((record) => record.speciesId === "phoneutria-nigriventer");
const jau = conservationReviewRecords.find((record) => record.speciesId === "zungaro-jahu");
const tucano = conservationReviewRecords.find((record) => record.speciesId === "tucano-toco");
const arara = conservationReviewRecords.find((record) => record.speciesId === "arara-caninde");
const veado = conservationReviewRecords.find((record) => record.speciesId === "veado-campeiro");
const pintado = conservationReviewRecords.find((record) => record.speciesId === "pintado");
const pacu = conservationReviewRecords.find((record) => record.speciesId === "pacu");
const piraputanga = conservationReviewRecords.find((record) => record.speciesId === "piraputanga");
const caranguejo = conservationReviewRecords.find((record) => record.speciesId === "caranguejo-agua-doce");
const camarao = conservationReviewRecords.find((record) => record.speciesId === "camarao-agua-doce");
if (!curimbata || curimbata.status !== "confirmed" || curimbata.finding !== "not-listed" || curimbata.sourceKind !== "Portaria MMA/ICMBio" || !curimbata.evidence.includes("Prochilodus lineatus")) errors.push("curimbatá não possui finding oficial conservador de não listagem");
if (!tucanucu || tucanucu.status !== "confirmed" || tucanucu.finding !== "not-listed" || tucanucu.sourceKind !== "Portaria MMA/ICMBio" || !tucanucu.evidence.includes("Megaceryle torquata")) errors.push("tucanuçu-de-garganta-azul não possui finding oficial conservador de não listagem");
if (!garca || garca.status !== "confirmed" || garca.finding !== "not-listed" || garca.sourceKind !== "Portaria MMA/ICMBio" || !garca.evidence.includes("Egretta thula")) errors.push("garça-branca-pequena não possui finding oficial conservador de não listagem");
if (!danca || danca.status !== "confirmed" || danca.finding !== "not-listed" || danca.sourceKind !== "Portaria MMA/ICMBio" || !danca.evidence.includes("Heliconius erato")) errors.push("dança-ninfas não possui finding oficial conservador de não listagem");
if (!cateto || cateto.status !== "confirmed" || cateto.category !== "LC" || cateto.sourceKind !== "SALVE" || !cateto.evidence.includes("Pecari tajacu (Linnaeus, 1758)")) errors.push("cateto não possui confirmação oficial SALVE LC");
if (!armadeira || armadeira.status !== "confirmed" || armadeira.finding !== "not-listed" || armadeira.sourceKind !== "Portaria MMA/ICMBio" || !armadeira.evidence.includes("Phoneutria nigriventer")) errors.push("aranha-armadeira não possui finding oficial conservador de não listagem");
if (!jau || jau.status !== "confirmed" || jau.finding !== "not-listed" || jau.sourceKind !== "Portaria MMA/ICMBio" || !jau.evidence.includes("Zungaro jahu")) errors.push("jaú não possui finding oficial conservador de não listagem");
if (!tucano || tucano.status !== "confirmed" || tucano.category !== "LC" || tucano.sourceKind !== "SALVE" || !tucano.evidence.includes("Ramphastos toco Statius Muller")) errors.push("tucano-toco não possui confirmação oficial SALVE LC");
if (!arara || arara.status !== "confirmed" || arara.finding !== "not-listed" || arara.sourceKind !== "Portaria MMA/ICMBio" || !arara.evidence.includes("não contém correspondência exata") && !arara.evidence.includes("sem correspondência exata")) errors.push("arara-canindé não possui finding oficial de não listagem");
if (!veado || veado.status !== "confirmed" || veado.category !== "VU" || veado.sourceKind !== "SALVE" || !veado.evidence.includes("Ozotoceros bezoarticus bezoarticus")) errors.push("veado-campeiro não possui confirmação oficial SALVE VU");
if (!pintado || pintado.status !== "confirmed" || pintado.category !== "VU" || pintado.sourceKind !== "Portaria MMA/ICMBio" || !pintado.evidence.includes("linha 448")) errors.push("pintado não possui confirmação normativa individual VU");
if (!pacu || pacu.status !== "confirmed" || pacu.finding !== "not-listed" || pacu.sourceKind !== "Portaria MMA/ICMBio" || !pacu.evidence.includes("não contém correspondência exata")) errors.push("pacu não possui finding oficial de não listagem");
if (!piraputanga || piraputanga.status !== "confirmed" || piraputanga.finding !== "not-listed" || piraputanga.sourceKind !== "Portaria MMA/ICMBio" || !piraputanga.evidence.includes("Brycon hilarii nem para piraputanga")) errors.push("piraputanga não possui finding oficial de não listagem");
if (!caranguejo || caranguejo.status !== "confirmed" || caranguejo.category !== "LC" || caranguejo.sourceKind !== "Avaliação ICMBio" || !caranguejo.evidence.includes("avaliações realizadas entre 2010 e 2014")) errors.push("caranguejo não possui avaliação oficial individual LC");
if (!camarao || camarao.status !== "confirmed" || camarao.category !== "LC" || camarao.sourceKind !== "Avaliação ICMBio" || !camarao.evidence.includes("avaliação realizada entre 2013 e 2014")) errors.push("camarao não possui avaliação oficial individual LC");
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
  "# Auditoria da trilha oficial de conservação — passo 26/50",
  "",
  "A trilha usa SALVE/ICMBio, Livro Vermelho da Fauna Brasileira e listas/portarias MMA/ICMBio como fontes elegíveis. No passo 41, `curimbatá` foi mantido como `not-listed` na Portaria MMA nº 148/2022, sem confundir Prochilodus britskii ou Prochilodus vimboides com o táxon-alvo. No passo 40, `tucanuçu-de-garganta-azul` foi mantido como `not-listed` na Portaria MMA nº 148/2022, sem inferir LC ou outra categoria. No passo 39, `garça-branca-pequena` foi mantida como `not-listed` na Portaria MMA nº 148/2022, sem inferir LC ou outra categoria. No passo 38, `dança-ninfas` foi mantida como `not-listed` na Portaria MMA nº 148/2022, sem inferir LC ou outra categoria. No passo 37, `cateto` foi confirmado como LC por ficha específica do SALVE/ICMBio. No passo 36, `aranha-armadeira` foi mantida como `not-listed` na Portaria MMA nº 148/2022, sem inferir risco ou LC. No passo 35, `jaú` foi mantido como `not-listed` na Portaria MMA nº 148/2022, pois a fonte oficial localizada usa grafia divergente e não permite promover NT/VU. No passo 34, `tucano-toco` foi confirmado como LC por ficha específica do SALVE/ICMBio. No passo 33, `arara-canindé` foi confirmada como `not-listed` na Portaria MMA nº 148/2022, sem conversão da ausência em LC. No passo 32, `veado-campeiro` foi confirmado como VU pelo SALVE/ICMBio, preservando o escopo da subespécie avaliada. No passo 22, `pintado` foi confirmado individualmente como VU pela Portaria MMA nº 148/2022. Nos passos 23 e 24, `pacu` e `piraputanga` foram confirmados como `not-listed` na mesma lista após busca exata; isso não equivale a LC e não representa uma avaliação de baixo risco. No passo 25, `caranguejo-agua-doce` recebeu LC e, no passo 26, `camarao-agua-doce` recebeu LC em avaliações técnicas oficiais do ICMBio.",
  "",
  "| ID | Nome científico | Categoria | Fonte | Estado | Regra |",
  "|---|---|---|---|---|---|",
  ...conservationReviewRecords.map((record) => `| \`${record.speciesId}\` | ${record.scientificName} | \`${record.category ?? "—"}\` | [${record.sourceKind}](${record.sourceUrl}) | \`${record.status}\` | ${record.decisionRule} |`),
  "",
  `**Resultado:** ${errors.length ? "FAIL" : "PASS"}. ${conservationReviewRecords.length}/${expectedIds.length} registros cobertos; ${conservationReviewRecords.filter((record) => record.status === "confirmed").length} confirmado(s); ${conservationReviewRecords.filter((record) => record.status === "pending-review").length} pendentes; ${errors.length} erro(s).`,
  "",
  "> Nenhuma categoria de ameaça foi inventada. `curimbatá` tem finding `not-listed` na Portaria MMA nº 148/2022; `tucanuçu-de-garganta-azul` tem finding `not-listed` na Portaria MMA nº 148/2022; `garça-branca-pequena` tem finding `not-listed` na Portaria MMA nº 148/2022; `dança-ninfas` tem finding `not-listed` na Portaria MMA nº 148/2022; `cateto` tem LC em ficha específica do SALVE/ICMBio; `aranha-armadeira` tem finding `not-listed` na Portaria MMA nº 148/2022; `jaú` tem finding `not-listed` na Portaria MMA nº 148/2022; `tucano-toco` tem LC em ficha específica do SALVE/ICMBio; `arara-canindé` tem finding `not-listed` na Portaria MMA nº 148/2022; `pintado` tem VU na mesma Portaria; `pacu` e `piraputanga` têm finding `not-listed`; `caranguejo-agua-doce` e `camarao-agua-doce` têm LC nas avaliações técnicas oficiais do ICMBio. O veado-campeiro tem VU na ficha oficial do SALVE, cuja unidade avaliada é a subespécie O. b. bezoarticus. As avaliações LC são datadas e não devem ser confundidas automaticamente com uma lista legal posterior.",
  "",
].join("\n");
fs.writeFileSync(path.join(process.cwd(), "CATALOG-CONSERVATION-AUDIT.md"), markdown);
console.log(JSON.stringify({ records: conservationReviewRecords.length, pending: conservationReviewRecords.filter((record) => record.status === "pending-review").length, errors, status: errors.length ? "FAIL" : "PASS" }, null, 2));
if (errors.length) process.exitCode = 1;
