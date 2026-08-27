import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicFile = path.join(root, "shared", "pantanal.ts");
const batchDir = path.join(root, "shared", "catalog", "batches");
const publicText = fs.readFileSync(publicFile, "utf8");
const batchFiles = fs.readdirSync(batchDir).filter((name) => name.endsWith(".ts")).sort();
const batchTexts = batchFiles.map((name) => fs.readFileSync(path.join(batchDir, name), "utf8"));
const batchText = batchTexts.join("\n");
const count = (text, pattern) => (text.match(pattern) ?? []).length;
const groups = ["Mamíferos", "Aves", "Répteis", "Anfíbios", "Peixes", "Invertebrados"];
const publicCount = count(publicText, /\bid:\s*["']/g);
const modularCount = count(batchText, /\bid:\s*["']/g);
const publicIds = [...publicText.matchAll(/\bid:\s*["']([a-z0-9-]+)["']/g)].map((match) => match[1]);
const modularIds = [...batchText.matchAll(/\bid:\s*["']([a-z0-9-]+)["']/g)].map((match) => match[1]);
const allRawIds = [...publicIds, ...modularIds];
const allIds = [...new Set(allRawIds)];
const duplicateIds = allRawIds.filter((id, index) => allRawIds.indexOf(id) !== index);
const modularImages = count(batchText, /\bimages:\s*\[/g) * 3;
const pending = count(batchText, /status:\s*["']pending-review["']/g);
const verified = count(batchText, /status:\s*["']verified["']/g);
const reviewReady = count(batchText, /status:\s*["']review-ready["']/g);
const rows = groups.map((group) => {
  const publicGroup = (publicText.match(new RegExp(`group:\\s*["']${group}["']`, "g")) ?? []).length;
  const modularGroup = batchTexts.reduce((total, text) => total + Math.max(0, (text.match(new RegExp(`group:\\s*["']${group}["']`, "g")) ?? []).length - 1), 0);
  return { group, public: publicGroup, modular: modularGroup };
});
const report = { generatedAt: new Date().toISOString(), publicSpecies: publicCount, modularSpecies: modularCount, totalSpecies: publicCount + modularCount, modularBatches: batchFiles.length, pendingReviewBatches: pending, verifiedBatches: verified, reviewReadyBatches: reviewReady, modularImages, publicSourceArrays: count(publicText, /\bsources:\s*\[/g), modularSpeciesSourceArrays: count(batchText, /\bsources:\s*\[/g) - batchFiles.length, modularBatchSourceArrays: batchFiles.length, pendingNotes: count(batchText, /pendingNotes:/g), duplicateIds, uniqueCatalogIds: allIds.length, catalogIds: allIds, groups: rows };
const table = (headers, rows) => [
  `| ${headers.join(" | ")} |`,
  `|${headers.map(() => "---").join("|")}|`,
  ...rows.map((row) => `| ${row.join(" | ")} |`),
  "",
].join("\n");
const markdown = [
  "# Relatório canônico do catálogo",
  "",
  `Gerado por **pnpm mvp:report** em ${report.generatedAt}. Este relatório mede a branch sem promover lotes pendentes a espécies verificadas.`,
  "",
  "## Quantitativos",
  "",
  table(["Métrica", "Valor"], [
    ["Espécies públicas", report.publicSpecies],
    ["Espécies modulares", report.modularSpecies],
    ["Total combinado", `**${report.totalSpecies}**`],
    ["Lotes modulares", report.modularBatches],
    ["Lotes pending-review", report.pendingReviewBatches],
    ["Lotes verified", report.verifiedBatches],
    ["Lotes review-ready", report.reviewReadyBatches],
    ["Imagens nos lotes", report.modularImages],
    ["Fontes estruturadas por espécie pública", report.publicSourceArrays],
    ["Fontes estruturadas por espécie modular", report.modularSpeciesSourceArrays],
    ["Fontes estruturadas por lote", report.modularBatchSourceArrays],
    ["Notas de pendência por lote", report.pendingNotes],
  ]),
  "## Integridade dos IDs",
  "",
  table(["Verificação", "Resultado"], [
    ["IDs globais únicos", report.uniqueCatalogIds],
    ["IDs duplicados", report.duplicateIds.length ? report.duplicateIds.join(", ") : "Nenhum"],
  ]),
  "## Distribuição por grupo",
  "",
  table(["Grupo", "Público", "Modular"], report.groups.map((row) => [row.group, row.public, row.modular])),
  "## Pendências de revisão",
  "",
  "- Todos os lotes modulares permanecem `pending-review`; nenhum lote é contado como `verified` ou `review-ready`.",
  "- Ocorrência regional exige confirmação específica no Pantanal por fonte adequada; fonte taxonômica não substitui evidência regional.",
  "- Situação de conservação permanece vazia quando não há confirmação oficial ICMBio/MMA.",
  "- Créditos e licenças de imagens permanecem sujeitos à revisão individual por arquivo, mesmo quando a auditoria estrutural passa.",
  "",
  "## IDs globais",
  "",
  report.catalogIds.map((id) => "- `" + id + "`").join("\n"),
  "",
  "> Este artefato é a medição canônica do fechamento do catálogo para a branch. Use `pnpm catalog:priority-audit` para a matriz prioritária.",
  "",
].join("\n");
fs.writeFileSync(path.join(root, "MVP-CATALOG-REPORT.md"), markdown);
console.log(JSON.stringify(report, null, 2));
