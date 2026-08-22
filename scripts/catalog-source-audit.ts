import { catalogBatches } from "../shared/catalog";

const approvedHosts = new Set(["api.gbif.org", "sibbr.gov.br", "icmbio.gov.br", "gov.br", "pt.wikipedia.org", "www.wikidata.org"]);
const errors: string[] = [];
let sourceCount = 0;
let gbifCount = 0;

for (const batch of catalogBatches) {
  if (!batch.sources.length) errors.push(`${batch.batchId}: lote sem fontes estruturadas`);
  for (const source of batch.sources) {
    sourceCount += 1;
    if (!source.title.trim()) errors.push(`${batch.batchId}: fonte sem título`);
    let url: URL;
    try {
      url = new URL(source.url);
    } catch {
      errors.push(`${batch.batchId}: URL de fonte inválida: ${source.url}`);
      continue;
    }
    if (url.protocol !== "https:") errors.push(`${batch.batchId}: fonte sem HTTPS: ${source.url}`);
    if (![...approvedHosts].some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) errors.push(`${batch.batchId}: host fora da lista aprovada: ${url.hostname}`);
    if (url.hostname === "api.gbif.org") gbifCount += 1;
  }
  for (const species of batch.species) {
    if (!species.sources.length) errors.push(`${species.id}: espécie sem fonte taxonômica estruturada`);
    for (const source of species.sources) {
      if (!source.title.trim()) errors.push(`${species.id}: fonte da espécie sem título`);
      let url: URL;
      try { url = new URL(source.url); } catch { errors.push(`${species.id}: URL taxonômica inválida: ${source.url}`); continue; }
      if (url.protocol !== "https:") errors.push(`${species.id}: URL taxonômica sem HTTPS`);
      if (![...approvedHosts].some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))) errors.push(`${species.id}: URL taxonômica fora da lista aprovada: ${url.hostname}`);
      if (url.hostname === "api.gbif.org") gbifCount += 1;
    }
  }
}

const report = { batches: catalogBatches.length, species: catalogBatches.reduce((total, batch) => total + batch.species.length, 0), structuredSources: sourceCount, gbifUrls: gbifCount, errors, status: errors.length === 0 ? "PASS" : "FAIL" };
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
