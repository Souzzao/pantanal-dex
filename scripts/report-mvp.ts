import { catalogBatches, catalogLicenseAudit, catalogReviewReport, catalogSpecies } from "../shared/catalog/index";
import { filterSpeciesCatalog } from "../shared/catalog";
import { groups } from "../shared/pantanal";

const publicSpecies = filterSpeciesCatalog();
const byGroup = Object.fromEntries(groups.map((group) => [group, publicSpecies.filter((item) => item.group === group).length]));
const report = {
  generatedAt: new Date().toISOString(),
  species: publicSpecies.length,
  modularSpecies: catalogSpecies.length,
  batches: catalogBatches.length,
  verifiedBatches: catalogReviewReport.verifiedBatches,
  pendingBatches: catalogReviewReport.pendingBatches,
  invalidBatches: catalogReviewReport.invalidBatches,
  images: catalogLicenseAudit.images,
  publicCatalogImages: publicSpecies.reduce((total, item) => total + item.images.length, 0),
  commercialImagesByPattern: catalogLicenseAudit.commercialImages,
  speciesWithLicenseBlockers: catalogLicenseAudit.speciesWithBlockers,
  byGroup,
  reviewReady: catalogReviewReport.rows.filter((row) => row.reviewReady).length,
};
console.log(JSON.stringify(report, null, 2));
