import type { Species } from "../pantanal";
import type { LicenseAuditReport } from "./license-audit";
import type { CatalogBatch } from "./types";
import { isCatalogBatchReviewReady } from "./review";

export const MVP_P1_NAMES = [
  "Jacaré-do-Pantanal", "Arara-canindé", "Tucano-toco", "Tuiuiú", "Capivara",
  "Lobo-guará", "Queixada", "Cateto", "Veado-campeiro", "Sucuri-amarela",
  "Teiú", "Dourado", "Pacu", "Piraputanga", "Sapo-cururu", "Rã-pimenta",
  "Seriema", "Urubu-rei", "Ouriço-cacheiro", "Abelha-jataí",
  "Onça-pintada", "Ariranha", "Anta", "Tamanduá-bandeira", "Cervo-do-pantanal",
  "Arara-azul", "Gavião-belo", "Colhereiro", "Cabeça-seca", "Carão",
  "Sucuri-verde", "Cobra-cipó", "Cágado-cabeçudo", "Teiú-vermelho", "Cobra-d'água",
  "Jaú", "Peixe-cachorro", "Pacupeva", "Formiga-cortadeira", "Aranha-armadeira",
] as const;

export type P1AuditStatus = "verified" | "ready-for-review" | "blocked" | "missing";

export type P1AuditRow = {
  priority: number;
  commonName: string;
  speciesId?: string;
  status: P1AuditStatus;
  blockers: string[];
};

export function createP1AuditQueue(
  species: Species[],
  batches: CatalogBatch[],
  licenseAudit: LicenseAuditReport,
): P1AuditRow[] {
  return MVP_P1_NAMES.map((commonName, index) => {
    const item = species.find((candidate) => candidate.commonName === commonName);
    if (!item) return { priority: index + 1, commonName, status: "missing", blockers: ["espécie prioritária ausente do catálogo"] };

    const blockers = licenseAudit.rows.find((row) => row.speciesId === item.id)?.blockers ?? [];
    const owningBatch = batches.find((batch) => batch.species.some((candidate) => candidate.id === item.id));
    if (!owningBatch) blockers.push("lote proprietário ausente");
    if (owningBatch && !isCatalogBatchReviewReady(owningBatch)) blockers.push("checklist editorial do lote incompleto");

    const status: P1AuditStatus = blockers.length ? "blocked" : (owningBatch?.status === "verified" ? "verified" : "ready-for-review");
    return {
      priority: index + 1,
      commonName,
      speciesId: item.id,
      status,
      blockers: [...new Set(blockers)],
    };
  });
}
