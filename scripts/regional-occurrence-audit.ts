import fs from "node:fs";
import path from "node:path";
import { regionalOccurrenceRecords, validateRegionalOccurrenceRecords } from "../shared/catalog/regional-occurrence";

const errors = validateRegionalOccurrenceRecords(regionalOccurrenceRecords);
const expectedIds = ["pintado", "pacu", "piraputanga", "caranguejo-agua-doce", "camarao-agua-doce"];
const ids = regionalOccurrenceRecords.map((record) => record.speciesId);
if (regionalOccurrenceRecords.length !== expectedIds.length) errors.push(`ledger deveria conter ${expectedIds.length} registros`);
if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) errors.push("ordem ou cobertura de espécies divergente do contrato");
const pintado = regionalOccurrenceRecords.find((record) => record.speciesId === "pintado");
const pacu = regionalOccurrenceRecords.find((record) => record.speciesId === "pacu");
const piraputanga = regionalOccurrenceRecords.find((record) => record.speciesId === "piraputanga");
if (!pintado || pintado.status !== "confirmed" || !pintado.sourceTitle.includes("Embrapa") || !pintado.evidence.includes("GBIF/Catalogue of Life")) errors.push("pintado não possui promoção sustentada por evidência regional e taxonômica");
if (!pacu || pacu.status !== "confirmed" || !pacu.sourceTitle.includes("SciELO") || !pacu.evidence.includes("GBIF/Catalogue of Life")) errors.push("pacu não possui promoção sustentada por evidência regional e taxonômica");
if (!piraputanga || piraputanga.status !== "confirmed" || !piraputanga.sourceTitle.includes("Springer") || !piraputanga.evidence.includes("GBIF/Catalogue of Life")) errors.push("piraputanga não possui promoção sustentada por evidência regional e taxonômica");
if (regionalOccurrenceRecords.filter((record) => !["pintado", "pacu", "piraputanga"].includes(record.speciesId)).some((record) => record.status !== "pending-review")) errors.push("registro além de pintado, pacu e piraputanga foi promovido sem evidência individual");
if (regionalOccurrenceRecords.filter((record) => !["pintado", "pacu", "piraputanga"].includes(record.speciesId)).some((record) => record.sourceUrl !== "https://collectory.sibbr.gov.br/collectory/public/show/dr327")) errors.push("fonte regional pendente não corresponde ao dataset ICMBio/SISBio dr327");
if (regionalOccurrenceRecords.some((record) => record.checkedAt !== "2026-08-27")) errors.push("data de verificação regional desatualizada");

const markdown = [
  "# Auditoria do ledger de ocorrência regional — passo 19/50",
  "",
  "O ledger registra a validação individual de ocorrência para cinco espécies legadas. `pintado` foi confirmado por estudo da Embrapa, `pacu` por artigo SciELO e `piraputanga` por estudos Springer/SciELO; os três têm identidade taxonômica confirmada pelo GBIF. As demais duas espécies permanecem em revisão com o dataset ICMBio/SISBio `dr327`.",
  "",
  "| ID | Região | Estado | Fonte | Evidência conservadora |",
  "|---|---|---|---|---|",
  ...regionalOccurrenceRecords.map((record) => `| \`${record.speciesId}\` | ${record.region} | \`${record.status}\` | [${record.sourceTitle}](${record.sourceUrl}) | ${record.evidence} |`),
  "",
  `**Resultado:** ${errors.length ? "FAIL" : "PASS"}. ${regionalOccurrenceRecords.length}/5 registros cobertos; ${regionalOccurrenceRecords.filter((record) => record.status === "confirmed").length} confirmado(s); ${regionalOccurrenceRecords.filter((record) => record.status === "pending-review").length} permanecem pendentes; ${errors.length} erro(s).`,
  "",
  "> `pending-review` significa que ainda não há evidência individual suficiente para promoção. Não significa ausência de ocorrência; a confirmação de `pintado` foi feita por uma fonte regional independente e uma fonte taxonômica estruturada.",
  "",
  "## Limite da evidência",
  "",
  "A publicação da Embrapa descreve Pseudoplatystoma corruscans no Pantanal de Mato Grosso do Sul. O artigo SciELO informa que Piaractus mesopotamicus é uma das espécies mais capturadas no Pantanal. Os estudos Springer/SciELO documentam Brycon hilarii na região do Pantanal e na sub-bacia do rio Miranda. O GBIF/Catalogue of Life apresenta os três nomes como espécies aceitas. Para as outras duas espécies, o dataset oficial ICMBio/SISBio não forneceu contagem estruturada confiável; por isso, nenhuma outra espécie foi promovida e nenhuma ausência foi inferida.",
  "## Referências",
  "",
  "[1]: https://www.infoteca.cnptia.embrapa.br/infoteca/handle/doc/789558 \"Embrapa Infoteca-e — estudo do pintado na bacia do rio Miranda\"",
  "[2]: https://www.gbif.org/taxon/4P84P \"GBIF — Pseudoplatystoma corruscans (Spix & Agassiz, 1829)\"",
  "[3]: https://www.scielo.br/j/bjb/a/dNGnkpjV7M9Fx7GtyGBD7zg/?format=html&lang=en&ilang=pt_BR \"SciELO — estudo do pacu no Pantanal de Mato Grosso do Sul\"",
  "[4]: https://www.gbif.org/taxon/4HPL3 \"GBIF — Piaractus mesopotamicus (Holmberg, 1887)\"",
  "[5]: https://link.springer.com/article/10.1134/S0032945217030092 \"Springer — Brycon hilarii no Pantanal\"",
  "[6]: https://www.scielo.br/j/bjb/a/5Jr637JnZKHkSxR4GRj6y9b/?format=html&lang=en&ilang=pt_BR \"SciELO — Brycon hilarii na sub-bacia do rio Miranda\"",
  "[7]: https://www.gbif.org/taxon/NH7H \"GBIF — Brycon hilarii (Valenciennes, 1850)\"",
  "",
  ].join("\n");
fs.writeFileSync(path.join(process.cwd(), "CATALOG-REGIONAL-OCCURRENCE-AUDIT.md"), markdown);
console.log(JSON.stringify({ records: regionalOccurrenceRecords.length, pending: regionalOccurrenceRecords.filter((record) => record.status === "pending-review").length, errors, status: errors.length ? "FAIL" : "PASS" }, null, 2));
if (errors.length) process.exitCode = 1;
