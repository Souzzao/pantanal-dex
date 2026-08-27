import fs from "node:fs";
import path from "node:path";
import { catalogSpecies } from "../shared/catalog";

type Check = { speciesId: string; kind: "image" | "credit"; url: string; status: number | string; ok: boolean };
const checks: Check[] = [];
const isRateLimited = (status: number | string) => status === 429;
const queue = catalogSpecies.flatMap((species) => species.images.flatMap((image) => [
  { speciesId: species.id, kind: "image" as const, url: image.uri },
  { speciesId: species.id, kind: "credit" as const, url: image.sourceUrl },
]));
async function checkUrl(item: typeof queue[number]): Promise<Check> {
  try {
    let response = await fetch(item.url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(12000) });
    if (response.status === 405 || response.status === 403) response = await fetch(item.url, { method: "GET", redirect: "follow", headers: { Range: "bytes=0-0" }, signal: AbortSignal.timeout(12000) });
    return { ...item, status: response.status, ok: response.status >= 200 && response.status < 400 };
  } catch (error) {
    return { ...item, status: error instanceof Error ? error.name : "erro", ok: false };
  }
}
async function main() {
  for (let index = 0; index < queue.length; index += 8) {
    const batch = await Promise.all(queue.slice(index, index + 8).map(checkUrl));
    checks.push(...batch);
  }
  const errors = checks.filter((check) => !check.ok && !isRateLimited(check.status));
  const rateLimited = checks.filter((check) => isRateLimited(check.status));
  const report = [
    "# Auditoria de disponibilidade de imagens — passo 16/50",
    "",
    `Foram verificadas ${catalogSpecies.length} espécies, ${catalogSpecies.reduce((total, species) => total + species.images.length, 0)} imagens e ${checks.length} URLs de imagem/crédito.`,
    "",
    "| Tipo | URLs | Disponíveis | Rate limited | Falhas |",
    "|---|---:|---:|---:|---:|",
    `| Arquivo de imagem | ${checks.filter((check) => check.kind === "image").length} | ${checks.filter((check) => check.kind === "image" && check.ok).length} | ${checks.filter((check) => check.kind === "image" && isRateLimited(check.status)).length} | ${checks.filter((check) => check.kind === "image" && !check.ok && !isRateLimited(check.status)).length} |`,
    `| Página de crédito | ${checks.filter((check) => check.kind === "credit").length} | ${checks.filter((check) => check.kind === "credit" && check.ok).length} | ${checks.filter((check) => check.kind === "credit" && isRateLimited(check.status)).length} | ${checks.filter((check) => check.kind === "credit" && !check.ok && !isRateLimited(check.status)).length} |`,
    `| Total | ${checks.length} | ${checks.filter((check) => check.ok).length} | ${rateLimited.length} | ${errors.length} |`,
    "",
    errors.length ? `## Falhas\n\n${errors.map((check) => `- \`${check.speciesId}\` (${check.kind}) — HTTP ${check.status} — ${check.url}`).join("\n")}` : "Nenhuma URL respondeu com erro definitivo.",
    "",
    `> Disponibilidade HTTP não substitui a conferência de autoria, licença ou adequação taxonômica. ${rateLimited.length} URLs responderam HTTP 429 e permanecem pendentes de rechecagem, sem serem classificadas como quebradas.`,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(process.cwd(), "CATALOG-IMAGE-AVAILABILITY-AUDIT.md"), report);
  console.log(JSON.stringify({ species: catalogSpecies.length, imageUrls: checks.filter((check) => check.kind === "image").length, creditUrls: checks.filter((check) => check.kind === "credit").length, available: checks.filter((check) => check.ok).length, rateLimited: rateLimited.length, errors: errors.length, status: errors.length ? "FAIL" : rateLimited.length ? "PASS_WITH_LIMITATION" : "PASS" }, null, 2));
  if (errors.length) process.exitCode = 1;
}
void main();
