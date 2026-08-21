import type { Species } from "../pantanal";

const COMMERCIAL_LICENSE = /^(CC0|CC BY(?:-SA)?(?: 2\.0| 2\.5| 3\.0| 4\.0)?|CC BY-SA(?: 2\.0| 2\.5| 3\.0| 4\.0)?|Public domain)$/i;
const BLOCKED_LICENSE = /\b(?:NC|ND|NON[- ]?COMMERCIAL|NO[- ]?DERIVATIVES)\b/i;

export type LicenseAuditRow = {
  speciesId: string;
  images: number;
  commercialImages: number;
  missingCredits: number;
  blockedImages: number;
  invalidImageUrls: number;
  sources: number;
  blockers: string[];
};

export type LicenseAuditReport = {
  species: number;
  images: number;
  commercialImages: number;
  speciesWithBlockers: number;
  rows: LicenseAuditRow[];
};

export function createLicenseAuditReport(items: Species[]): LicenseAuditReport {
  const rows = items.map((item) => {
    const missingCredits = item.images.filter((image) => !image.credit.trim() || !image.license.trim()).length;
    const blockedImages = item.images.filter((image) => BLOCKED_LICENSE.test(image.license) || !COMMERCIAL_LICENSE.test(image.license)).length;
    const invalidImageUrls = item.images.filter((image) => !/^https?:\/\//i.test(image.uri) || !/^https?:\/\//i.test(image.sourceUrl)).length;
    const blockers: string[] = [];
    if (item.images.length !== 3) blockers.push("quantidade de imagens diferente de três");
    if (missingCredits) blockers.push(`${missingCredits} imagem(ns) sem crédito/licença`);
    if (blockedImages) blockers.push(`${blockedImages} imagem(ns) com licença incompatível ou não confirmada`);
    if (invalidImageUrls) blockers.push(`${invalidImageUrls} imagem(ns) com URL inválida`);
    if (!item.sources.length) blockers.push("fonte estruturada ausente");
    if (item.conservationStatus && !item.conservationSource) blockers.push("conservação sem fonte oficial");
    return { speciesId: item.id, images: item.images.length, commercialImages: item.images.length - blockedImages - missingCredits, missingCredits, blockedImages, invalidImageUrls, sources: item.sources.length, blockers };
  });
  return {
    species: rows.length,
    images: rows.reduce((total, row) => total + row.images, 0),
    commercialImages: rows.reduce((total, row) => total + Math.max(0, row.commercialImages), 0),
    speciesWithBlockers: rows.filter((row) => row.blockers.length > 0).length,
    rows,
  };
}
