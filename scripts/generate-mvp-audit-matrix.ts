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
  "# MVP — Passo 2/50: Matriz de Auditoria Atualizada (Meta 500 Espécies)",
  "",
  `Gerado em ${new Date().toISOString()}. Esta matriz é a base operacional para a meta de 500 espécies verificadas no MVP.`,
  "",
  "| Lote | Estado | Espécie | Científico | Grupo | Imagens | Fontes | Conservação | Bloqueios automáticos |",
  "|---|---|---|---|---|---:|---:|---|---|",
  ...rows.map((row) => `| ${row.batch} | ${row.status} | ${row.species} | ${row.scientific} | ${row.group} | ${row.images} | ${row.sources} | ${row.conservation} | ${row.blockers} |`),
  "",
  "## Resumo da Auditoria",
  "",
  `- Meta Mínima MVP: **500 espécies verificadas**.`,
  `- Espécies modulares atualmente no catálogo: **${rows.length}** (${Math.round((rows.length / 500) * 100)}% da meta).`,
  `- Lotes Totais: **${catalogReviewReport.totalBatches}**; Pending-review: **${catalogReviewReport.pendingBatches}**; Verificados: **${catalogReviewReport.verifiedBatches}**; Inválidos: **${catalogReviewReport.invalidBatches}**.`,
  `- Acervo de Imagens: **${rows.reduce((total, row) => total + row.images, 0)}** arquivos; Fontes registradas: **${rows.reduce((total, row) => total + row.sources, 0)}**.`,
  "",
  "## Próximos Passos e Governança",
  "",
  "1. **Agente 2 (Catálogo):** Deve expandir o catálogo em lotes de 10-20 espécies até atingir a meta de 500. Cada espécie deve ter 3 imagens licenciadas.",
  "2. **Agente 3 (Qualidade):** Deve realizar a auditoria manual de cada lote pendente, verificando ocorrência regional e validade das licenças.",
  "3. **Promoção de Lotes:** Um lote só passa de `pending-review` para `verified` após checklist editorial completo e validação técnica via `isCatalogBatchReviewReady`.",
];

writeFileSync("docs/MVP-STEP-02-AUDIT-MATRIX.md", `${lines.join("\n")}\n`);
console.log(`Matriz gerada com ${rows.length} espécies modulares.`);
