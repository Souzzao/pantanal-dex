import { catalogSpecies } from "../shared/catalog";

const approved = /^(CC0|CC BY(?:-SA)?(?: [0-9.]+)?|Public domain|Domínio público)$/i;
const blocked = /\b(?:NC|ND|non-commercial|no derivatives|sem fins comerciais|sem derivados)\b/i;
const errors: string[] = [];
let imageCount = 0;
let approvedCount = 0;

for (const species of catalogSpecies) {
  if (species.images.length !== 3) errors.push(`${species.id}: esperado 3 imagens, encontrado ${species.images.length}`);
  for (const image of species.images) {
    imageCount += 1;
    if (!/^https?:\/\//.test(image.uri)) errors.push(`${species.id}: URI de imagem não-HTTP`);
    if (!/^https?:\/\//.test(image.sourceUrl)) errors.push(`${species.id}: sourceUrl não-HTTP`);
    if (!image.author.trim()) errors.push(`${species.id}: autor ausente`);
    if (!image.credit.trim()) errors.push(`${species.id}: crédito ausente`);
    if (blocked.test(image.license) || !approved.test(image.license)) errors.push(`${species.id}: licença não aprovada: ${image.license}`);
    else approvedCount += 1;
  }
}

const report = {
  species: catalogSpecies.length,
  images: imageCount,
  approvedLicenses: approvedCount,
  errors,
  status: errors.length === 0 ? "PASS" : "FAIL",
};
console.log(JSON.stringify(report, null, 2));
if (errors.length > 0) process.exitCode = 1;
