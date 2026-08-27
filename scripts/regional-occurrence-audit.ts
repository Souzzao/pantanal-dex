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
const caranguejo = regionalOccurrenceRecords.find((record) => record.speciesId === "caranguejo-agua-doce");
const camarao = regionalOccurrenceRecords.find((record) => record.speciesId === "camarao-agua-doce");
if (!pintado || pintado.status !== "confirmed" || !pintado.sourceTitle.includes("Embrapa") || !pintado.evidence.includes("GBIF/Catalogue of Life")) errors.push("pintado não possui promoção sustentada por evidência regional e taxonômica");
if (!pacu || pacu.status !== "confirmed" || !pacu.sourceTitle.includes("SciELO") || !pacu.evidence.includes("GBIF/Catalogue of Life")) errors.push("pacu não possui promoção sustentada por evidência regional e taxonômica");
if (!piraputanga || piraputanga.status !== "confirmed" || !piraputanga.sourceTitle.includes("Springer") || !piraputanga.evidence.includes("GBIF/Catalogue of Life")) errors.push("piraputanga não possui promoção sustentada por evidência regional e taxonômica");
if (!caranguejo || caranguejo.status !== "confirmed" || !caranguejo.sourceTitle.includes("SciELO") || !caranguejo.evidence.includes("GBIF/Catalogue of Life")) errors.push("caranguejo não possui promoção sustentada por evidência regional e taxonômica");
if (!camarao || camarao.status !== "confirmed" || !camarao.sourceTitle.includes("PubMed") || !camarao.evidence.includes("GBIF/Catalogue of Life")) errors.push("camarao não possui promoção sustentada por evidência regional e taxonômica");
if (regionalOccurrenceRecords.some((record) => record.status !== "confirmed")) errors.push("registro regional permanece pendente após o fechamento da validação científica");
if (regionalOccurrenceRecords.some((record) => record.checkedAt !== "2026-08-27")) errors.push("data de verificação regional desatualizada");

const markdown = [
  "# Auditoria do ledger de ocorrência regional — passo 21/50",
  "",
  "O ledger registra a validação individual de ocorrência para cinco espécies legadas. `pintado` foi confirmado por estudo da Embrapa, `pacu` por artigo SciELO, `piraputanga` por estudos Springer/SciELO, `caranguejo-agua-doce` por artigo SciELO e `camarao-agua-doce` por estudo indexado no PubMed; os cinco têm identidade taxonômica confirmada pelo GBIF e estão confirmados regionalmente.",
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
  "A publicação da Embrapa descreve Pseudoplatystoma corruscans no Pantanal de Mato Grosso do Sul. O artigo SciELO informa que Piaractus mesopotamicus é uma das espécies mais capturadas no Pantanal. Os estudos Springer/SciELO documentam Brycon hilarii no Pantanal e na sub-bacia do rio Miranda. O artigo SciELO sobre Trichodactylidae nomeia Dilocarcinus pagei entre as espécies registradas em alagados do Pantanal e na bacia do Alto Paraguai. O estudo indexado no PubMed analisou 2.270 exemplares de Macrobrachium amazonicum coletados no rio Miranda e na Lagoa Baiazinha, no Pantanal de Mato Grosso do Sul. O GBIF/Catalogue of Life apresenta os cinco nomes como espécies aceitas. Com a evidência publicada do último registro, não restam pendências no ledger regional; nenhuma categoria de conservação foi inferida.",
  "## Referências",
  "",
  "[1]: https://www.infoteca.cnptia.embrapa.br/infoteca/handle/doc/789558 \"Embrapa Infoteca-e — estudo do pintado na bacia do rio Miranda\"",
  "[2]: https://www.gbif.org/taxon/4P84P \"GBIF — Pseudoplatystoma corruscans (Spix & Agassiz, 1829)\"",
  "[3]: https://www.scielo.br/j/bjb/a/dNGnkpjV7M9Fx7GtyGBD7zg/?format=html&lang=en&ilang=pt_BR \"SciELO — estudo do pacu no Pantanal de Mato Grosso do Sul\"",
  "[4]: https://www.gbif.org/taxon/4HPL3 \"GBIF — Piaractus mesopotamicus (Holmberg, 1887)\"",
  "[5]: https://link.springer.com/article/10.1134/S0032945217030092 \"Springer — Brycon hilarii no Pantanal\"",
  "[6]: https://www.scielo.br/j/bjb/a/5Jr637JnZKHkSxR4GRj6y9b/?format=html&lang=en&ilang=pt_BR \"SciELO — Brycon hilarii na sub-bacia do rio Miranda\"",
  "[7]: https://www.gbif.org/taxon/NH7H \"GBIF — Brycon hilarii (Valenciennes, 1850)\"",
  "[8]: https://www.scielo.br/j/paz/a/8d5vM7nQbcDxLyVHgvPnvQb/?lang=pt \"SciELO — Trichodactylidae em alagados do Pantanal\"",
  "[9]: https://www.gbif.org/taxon/365S7 \"GBIF — Dilocarcinus pagei Stimpson, 1861\"",
  "[10]: https://pubmed.ncbi.nlm.nih.gov/23894962/ \"PubMed — Macrobrachium amazonicum no Pantanal\"",
  "[11]: https://www.gbif.org/taxon/9GQ5P \"GBIF — Macrobrachium amazonicum (Heller, 1862)\"",
  "",
  ].join("\n");
fs.writeFileSync(path.join(process.cwd(), "CATALOG-REGIONAL-OCCURRENCE-AUDIT.md"), markdown);
console.log(JSON.stringify({ records: regionalOccurrenceRecords.length, pending: regionalOccurrenceRecords.filter((record) => record.status === "pending-review").length, errors, status: errors.length ? "FAIL" : "PASS" }, null, 2));
if (errors.length) process.exitCode = 1;
