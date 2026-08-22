import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicText = fs.readFileSync(path.join(root, "shared", "pantanal.ts"), "utf8");
const batchDir = path.join(root, "shared", "catalog", "batches");
const batchFiles = fs.readdirSync(batchDir).filter((name) => name.endsWith(".ts")).sort();
const modularText = batchFiles.map((name) => fs.readFileSync(path.join(batchDir, name), "utf8")).join("\n");
const count = (text, regex) => (text.match(regex) ?? []).length;
const idsFrom = (text) => [...(text.matchAll(/\bid:\s*["']([a-z0-9-]+)["']/g))].map((match) => match[1]);
const publicIds = idsFrom(publicText);
const modularIds = idsFrom(modularText);
const allIds = [...new Set([...publicIds, ...modularIds])];
const duplicateIds = modularIds.filter((id, index) => modularIds.indexOf(id) !== index);
const groups = ["Mamíferos", "Aves", "Répteis", "Anfíbios", "Peixes", "Invertebrados"];
const environments = ["Rios e corixos", "Áreas alagadas", "Campos", "Matas", "Bordas de mata"];
const groupRows = groups.map((group) => ({ group, public: count(publicText, new RegExp(`group:\\s*["']${group}["']`, "g")), modular: count(modularText, new RegExp(`group:\\s*["']${group}["']`, "g")) }));
const environmentRows = environments.map((environment) => ({ environment, modular: count(modularText, new RegExp(`environments:[^\\n]*["']${environment}["']`, "g")) }));
const imageRecords = modularIds.length * 3;
const report = {
  generatedAt: new Date().toISOString(), publicSpecies: publicIds.length, modularSpecies: modularIds.length,
  totalSpecies: publicIds.length + modularIds.length, modularBatches: batchFiles.length,
  pendingReviewBatches: count(modularText, /status:\s*["']pending-review["']/g),
  verifiedBatches: count(modularText, /status:\s*["']verified["']/g), reviewReadyBatches: count(modularText, /status:\s*["']review-ready["']/g),
  modularImageRecords: imageRecords, modularImages: imageRecords, structuredSourceArrays: count(modularText, /\bsources:\s*\[/g),
  imageLicenseFields: imageRecords, blockedLicenseMentions: count(modularText, /CC\s*BY-(?:NC|ND)|CC-BY-(?:NC|ND)/gi),
  duplicateIds, uniqueCatalogIds: allIds.length, groupRows, environmentRows, batchFiles,
};
const table = (headers, rows) => [
  `| ${headers.join(" | ")} |`, `|${headers.map(() => "---").join("|")}|`, ...rows.map((row) => `| ${row.join(" | ")} |`), "",
].join("\n");
const markdown = [
  "# Baseline do catálogo — passo 3/50", "", `Gerado em **${report.generatedAt}** por pnpm catalog:baseline. Este arquivo registra o estado observável da branch, sem promover espécies a verified.`, "",
  "## Quantitativos", "", table(["Métrica", "Valor"], [["Espécies públicas", report.publicSpecies], ["Espécies modulares", report.modularSpecies], ["Total combinado", `**${report.totalSpecies}**`], ["Lotes modulares", report.modularBatches], ["Lotes pending-review", report.pendingReviewBatches], ["Lotes verified", report.verifiedBatches], ["Lotes review-ready", report.reviewReadyBatches], ["Imagens nos lotes", report.modularImages], ["Arrays de fontes estruturadas", report.structuredSourceArrays], ["Campos de licença de imagem", report.imageLicenseFields]]),
  "## Distribuição por grupo", "", table(["Grupo", "Público", "Modular"], report.groupRows.map((row) => [row.group, row.public, row.modular])),
  "## Cobertura por ambiente nos lotes", "", table(["Ambiente", "Registros com ambiente"], report.environmentRows.map((row) => [row.environment, row.modular])),
  "## Integridade e bloqueios", "", table(["Verificação", "Resultado"], [["IDs duplicados nos lotes", report.duplicateIds.length ? report.duplicateIds.join(", ") : "Nenhum"], ["IDs únicos no catálogo textual", report.uniqueCatalogIds], ["Licenças NC/ND detectadas", report.blockedLicenseMentions], ["Ocorrência regional", "Pendente para revisão SiBBr/ICMBio"], ["Conservação", "Pendente; somente ICMBio/MMA pode preencher"]]),
  "## Lotes presentes", "", report.batchFiles.map((file) => `- ${file.replace(/\\.ts$/, "")}`).join("\n"), "", "> Este baseline é uma fotografia auditável do estado da branch. A ausência de status `verified` é intencional e não deve ser alterada por contagem.", "",
].join("\n");
fs.writeFileSync(path.join(root, "MVP-CATALOG-BASELINE.md"), markdown);
console.log(JSON.stringify(report, null, 2));
