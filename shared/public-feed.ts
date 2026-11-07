import { toPublicCell, type PublicRecord } from "./public-map";

/**
 * Servidor do mapa público (Supabase, API REST).
 *
 * - Desligado por padrão: só liga quando EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY
 *   estiverem no `.env`. Sem elas, o mapa usa só os registros públicos do aparelho (e os exemplos).
 * - A chave "anon" é pública por definição; a segurança está no banco (ver supabase/migrations).
 * - Publicar/encerrar viram operações numa fila guardada no aparelho; a fila é enviada quando houver internet.
 * - O `fetch` é recebido por parâmetro para ser testável sem rede.
 */

export type FeedConfig = { url: string; anonKey: string };
export type FetchLike = (input: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ ok: boolean; status: number; json: () => Promise<unknown>; text: () => Promise<string> }>;

export function readFeedConfig(env: Record<string, string | undefined>): FeedConfig | null {
  const url = env.EXPO_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/, "");
  const anonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey || !/^https:\/\/[^\s/]+/i.test(url)) return null;
  return { url, anonKey };
}

/**
 * A chave antiga (`anon`, um JWT que começa com "eyJ") também vai no Authorization.
 * A chave nova (`sb_publishable_…`) não é JWT: vai só no cabeçalho `apikey`.
 */
export const headers = (config: FeedConfig): Record<string, string> => ({
  apikey: config.anonKey,
  ...(config.anonKey.startsWith("eyJ") ? { Authorization: `Bearer ${config.anonKey}` } : {}),
  "Content-Type": "application/json",
});

// ───────────────────────────── Leitura ─────────────────────────────

type FeedRow = {
  id: string; species_id: string; observed_on: string; observed_time: string | null;
  cell_lat: number | string; cell_lon: number | string; published_at: string; expires_at: string | null;
};

export function rowToRecord(row: FeedRow, myIds: ReadonlySet<string>): PublicRecord | null {
  const latitude = Number(row.cell_lat);
  const longitude = Number(row.cell_lon);
  if (!row || typeof row.id !== "string" || typeof row.species_id !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(row.observed_on ?? "")) return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  return {
    id: row.id,
    speciesId: row.species_id,
    date: row.observed_on,
    time: row.observed_time ?? undefined,
    // Garante a grade pública mesmo que o servidor devolva algo fora dela.
    latitude: toPublicCell(latitude),
    longitude: toPublicCell(longitude),
    publishedAt: row.published_at,
    expiresAt: row.expires_at,
    owner: myIds.has(row.id) ? "me" : "others",
  };
}

export async function fetchPublicFeed(config: FeedConfig, fetchImpl: FetchLike, myIds: ReadonlySet<string>, limit = 2000): Promise<PublicRecord[]> {
  const response = await fetchImpl(`${config.url}/rest/v1/public_feed?select=*&order=observed_on.desc&limit=${limit}`, { method: "GET", headers: headers(config) });
  if (!response.ok) throw new Error(`Servidor respondeu ${response.status}`);
  const rows = (await response.json()) as unknown;
  if (!Array.isArray(rows)) throw new Error("Resposta inesperada do servidor");
  return rows.map((row) => rowToRecord(row as FeedRow, myIds)).filter((item): item is PublicRecord => item !== null);
}

// ───────────────────────────── Fila de envio ─────────────────────────────

export type FeedOperation =
  | { type: "publish"; record: Pick<PublicRecord, "id" | "speciesId" | "date" | "time" | "latitude" | "longitude" | "expiresAt">; queuedAt: string }
  | { type: "end"; id: string; queuedAt: string };

export type FeedQueue = { version: 1; operations: FeedOperation[] };
export const FEED_QUEUE_KEY = "pantanal-dex:public-feed-queue-v1";
export const FEED_SECRET_KEY = "pantanal-dex-public-feed-secret";

export function createFeedQueue(): FeedQueue {
  return { version: 1, operations: [] };
}

/** Coloca uma operação na fila; uma operação nova para o mesmo registro substitui a anterior. */
export function enqueue(queue: FeedQueue, operation: FeedOperation): FeedQueue {
  const id = operation.type === "publish" ? operation.record.id : operation.id;
  const rest = queue.operations.filter((item) => (item.type === "publish" ? item.record.id : item.id) !== id);
  return { ...queue, operations: [...rest, operation] };
}

export function restoreFeedQueue(raw: string | null): FeedQueue {
  if (!raw) return createFeedQueue();
  try {
    const parsed = JSON.parse(raw) as Partial<FeedQueue>;
    if (parsed.version !== 1 || !Array.isArray(parsed.operations)) return createFeedQueue();
    const operations = parsed.operations.filter((item): item is FeedOperation =>
      !!item && typeof item === "object" &&
      ((item as FeedOperation).type === "end" ? typeof (item as { id?: unknown }).id === "string" :
        (item as FeedOperation).type === "publish" && typeof (item as { record?: { id?: unknown } }).record?.id === "string"));
    return { version: 1, operations };
  } catch {
    return createFeedQueue();
  }
}

async function callRpc(config: FeedConfig, fetchImpl: FetchLike, name: string, body: Record<string, unknown>) {
  const response = await fetchImpl(`${config.url}/rest/v1/rpc/${name}`, { method: "POST", headers: headers(config), body: JSON.stringify(body) });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const error = new Error(`Servidor recusou (${response.status}) ${detail}`.trim()) as Error & { permanent?: boolean };
    // 4xx = regra do servidor recusou (não adianta reenviar); 5xx/rede = tentar depois.
    error.permanent = response.status >= 400 && response.status < 500;
    throw error;
  }
}

export function operationRequest(operation: FeedOperation, secret: string): { name: string; body: Record<string, unknown> } {
  if (operation.type === "end") return { name: "end_publication", body: { p_id: operation.id, p_secret: secret } };
  const { record } = operation;
  return {
    name: "publish_sighting",
    body: {
      p_id: record.id,
      p_species_id: record.speciesId,
      p_observed_on: record.date,
      p_observed_time: record.time ?? null,
      p_cell_lat: toPublicCell(record.latitude),
      p_cell_lon: toPublicCell(record.longitude),
      p_expires_at: record.expiresAt,
      p_secret: secret,
    },
  };
}

export type FlushResult = { queue: FeedQueue; sent: number; rejected: { operation: FeedOperation; message: string }[]; stoppedByNetwork: boolean };

/**
 * Envia a fila em ordem. Para no primeiro erro de rede/servidor (5xx) e mantém o restante;
 * operações recusadas pelas regras do servidor (4xx) saem da fila e são informadas.
 */
export async function flushQueue(queue: FeedQueue, config: FeedConfig, fetchImpl: FetchLike, secret: string): Promise<FlushResult> {
  const remaining = [...queue.operations];
  const rejected: FlushResult["rejected"] = [];
  let sent = 0;
  while (remaining.length) {
    const operation = remaining[0];
    const request = operationRequest(operation, secret);
    try {
      await callRpc(config, fetchImpl, request.name, request.body);
      sent += 1;
      remaining.shift();
    } catch (error) {
      if ((error as { permanent?: boolean }).permanent) {
        rejected.push({ operation, message: (error as Error).message });
        remaining.shift();
        continue;
      }
      return { queue: { ...queue, operations: remaining }, sent, rejected, stoppedByNetwork: true };
    }
  }
  return { queue: { ...queue, operations: [] }, sent, rejected, stoppedByNetwork: false };
}

/**
 * Id público do registro no servidor: id do avistamento + prefixo do aparelho. Evita colisão quando dois
 * aparelhos geram o mesmo id local por coincidência. O prefixo (8 de 64 caracteres) não permite deduzir o segredo.
 */
export function publicIdFor(sightingId: string, secret: string): string {
  return `${sightingId}@${secret.slice(0, 8)}`.slice(0, 80);
}

/** Segredo do aparelho (64 caracteres hex). Usa crypto.getRandomValues quando disponível. */
export function generateDeviceSecret(random: (bytes: Uint8Array) => void = defaultRandom): string {
  const bytes = new Uint8Array(32);
  random(bytes);
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

function defaultRandom(bytes: Uint8Array) {
  const cryptoObject = (globalThis as { crypto?: { getRandomValues?: (array: Uint8Array) => Uint8Array } }).crypto;
  if (cryptoObject?.getRandomValues) {
    cryptoObject.getRandomValues(bytes);
    return;
  }
  // Alternativa sem API de criptografia (aparelhos antigos): menos forte, mas o segredo só protege
  // o direito de encerrar/renovar as próprias publicações.
  for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
}
