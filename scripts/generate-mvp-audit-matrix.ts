import { writeFileSync } from "node:fs";
import { catalogBatches, catalogLicenseAudit, catalogReviewReport } from "../shared/catalog/index";

const rows = catalogBatches.flatMap((batch) => batch.species.map((item) => {
  const blockers = catalogLicenseAudit.rows.find((entry) => entry.speciesId === item.id)?.blockers ?? [];
  return {
    batch: batch.batchId,
    status: batch.status,
    species: item.commonName,
    scientific: item.scientificName,
    group: item.group,
    images: item.images.length,
    sources: item.sources.length,
    conservation: item.conservationStatus ? "informada" : "não informada",
    blockers: blockers.length ? blockers.join("; ") : "nenhum bloqueio automático",
  };
}));

const lines = [
  "# MVP — Passo 2/50: matriz de auditoria P1 e lotes modulares",
  "",
  `Gerado em ${new Date().toISOString()}. Esta matriz é operacional e não promove lotes automaticamente.`,
  "",
  "| Lote | Estado | Espécie | Científico | Grupo | Imagens | Fontes | Conservação | Bloqueios automáticos |",
  "|---|---|---|---|---|---:|---:|---|---|",
  ...rows.map((row) => `| ${row.batch} | ${row.status} | ${row.species} | ${row.scientific} | ${row.group} | ${row.images} | ${row.sources} | ${row.conservation} | ${row.blockers} |`),
  "",
  "## Resumo",
  "",
  `- Espécies modulares auditáveis na matriz: **${rows.length}**.`,
  `- Lotes: **${catalogReviewReport.totalBatches}**; pending-review: **${catalogReviewReport.pendingBatches}**; verificados: **${catalogReviewReport.verifiedBatches}**; inválidos: **${catalogReviewReport.invalidBatches}**.`,
  `- Imagens modulares: **${rows.reduce((total, row) => total + row.images, 0)}**; fontes registradas: **${rows.reduce((total, row) => total + row.sources, 0)}**.`,
  "",
  "## Regra do próximo passo",
  "",
  "A Conta 2 deve conferir cada linha contra a página individual da imagem, ocorrência no Pantanal, nomenclatura e fonte oficial de conservação quando houver status. Licença, crédito ou ocorrência não podem ser inferidos pelo padrão automático. Um lote só pode ser promovido quando isCatalogBatchReviewReady for verdadeiro e a evidência estiver registrada no PR.",
];

writeFileSync("docs/MVP-STEP-02-AUDIT-MATRIX.md", `${lines.join("\n")}\n`);
console.log(`Matriz gerada com ${rows.length} espécies modulares.`);
