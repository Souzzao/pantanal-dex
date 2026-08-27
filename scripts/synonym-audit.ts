import fs from "node:fs";
import path from "node:path";
import { documentedSynonyms } from "../shared/catalog/synonyms";

const errors: string[] = [];
const results: { speciesId: string; alias: string; sourceUrl: string; httpStatus: number | string; matched: boolean; note: string }[] = [];
const cache = new Map<string, { status: number | string; names: Set<string> }>();

async function loadSource(url: string) {
  const cached = cache.get(url);
  if (cached) return cached;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
    const body = await response.json() as { results?: { canonicalName?: string; scientificName?: string }[] };
    const names = new Set((body.results ?? []).flatMap((item) => [item.canonicalName, item.scientificName].filter((name): name is string => Boolean(name)).map((name) => name.toLocaleLowerCase())));
    const value = { status: response.status, names };
    cache.set(url, value);
    return value;
  } catch (error) {
    const value = { status: "erro", names: new Set<string>() };
    cache.set(url, value);
    return value;
  }
}

async function main() {
  for (const [speciesId, aliases] of Object.entries(documentedSynonyms)) {
    for (const alias of aliases) {
      const source = await loadSource(alias.sourceUrl);
      const matched = source.names.has(alias.name.toLocaleLowerCase());
      results.push({ speciesId, alias: alias.name, sourceUrl: alias.sourceUrl, httpStatus: source.status, matched, note: matched ? "nome encontrado nos resultados GBIF" : "endpoint acessível, mas nome não encontrado na resposta" });
      if (source.status !== 200) errors.push(`${speciesId}/${alias.name}: GBIF respondeu ${source.status}`);
      if (!matched) errors.push(`${speciesId}/${alias.name}: nome não encontrado na resposta do GBIF`);
    }
  }
  const report = [
    "# Auditoria de sinônimos GBIF — passo 13/50",
    "",
    `Foram auditadas ${results.length} equivalências taxonômicas documentadas para ${Object.keys(documentedSynonyms).length} espécies.`,
    "",
    "| Espécie | Sinônimo | HTTP | Encontrado | Fonte |",
    "|---|---|---:|---|---|",
    ...results.map((result) => `| \`${result.speciesId}\` | ${result.alias} | ${result.httpStatus} | ${result.matched ? "sim" : "não"} | [GBIF](${result.sourceUrl}) |`),
    "",
    `**Resultado:** ${errors.length ? "FAIL" : "PASS"}. ${results.filter((result) => result.matched).length}/${results.length} sinônimos encontrados; ${errors.length} erro(s).`,
    "",
    "> Sinônimos são aliases de busca e não criam novos registros nem duplicam espécies no catálogo principal.",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(process.cwd(), "CATALOG-SYNONYM-AUDIT.md"), report);
  console.log(JSON.stringify({ species: Object.keys(documentedSynonyms).length, synonyms: results.length, matched: results.filter((result) => result.matched).length, errors, status: errors.length ? "FAIL" : "PASS" }, null, 2));
  if (errors.length) process.exitCode = 1;
}

void main();
