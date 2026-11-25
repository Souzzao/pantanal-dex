/**
 * PantanalDex — Proteções para o que vem de fora: links e arquivos importados.
 *
 * @author Felipe de Souza Aquino
 */

/**
 * Só abre fora do app endereços https comuns. Bloqueia esquemas que o Android poderia usar para abrir
 * outros apps ou arquivos (intent:, file:, content:, javascript:...), endereços com usuário/senha
 * embutidos e espaços.
 */
export function isSafeExternalUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048 || /\s/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !!url.hostname && url.hostname.includes(".");
  } catch {
    return false;
  }
}

/** Tamanho máximo de arquivo importado (cadernos e backups). Um caderno grande real fica bem abaixo. */
export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

/** true quando o arquivo escolhido pode ser lido; tamanho desconhecido é conferido depois pelo texto. */
export function isImportSizeOk(size: number | null | undefined): boolean {
  return size == null || (Number.isFinite(size) && size >= 0 && size <= MAX_IMPORT_BYTES);
}
