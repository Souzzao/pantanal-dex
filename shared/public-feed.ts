import { toPublicCell, type PublicRecord } from "./public-map";

/**
 * Servidor do mapa público (Supabase, API REST), com conta (login).
 *
 * - Só liga quando EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY estão no `.env`/EAS.
 * - Toda chamada vai com o token da conta (Authorization: Bearer <token>); a segurança está no banco
 *   (RLS + funções em supabase/migrations).
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
 * `apikey` sempre; Authorization com o token da conta. Sem token, a chave antiga (`anon`, JWT)
 * vai no Authorization; a chave nova (`sb_publishable_…`) não é JWT e vai só no `apikey`.
 */
export const headers = (config: FeedConfig, token?: string | null): Record<string, string> => ({
  apikey: config.anonKey,
  ...(token ? { Authorization: `Bearer ${token}` } : config.anonKey.startsWith("eyJ") ? { Authorization: `Bearer ${config.anonKey}` } : {}),
  "Content-Type": "application/json",
});

// ───────────────────────────── Leitura ─────────────────────────────

type FeedRow = {
  id: string; species_id: string; observed_on: string; observed_time: string | null;
  cell_lat: number | string; cell_lon: number | string; published_at: string; expires_at: string | null; status?: string | null;
};

export function rowToRecord(row: FeedRow, myIds: ReadonlySet<string>): PublicRecord | null {
  const latitude = Number(row?.cell_lat);
  const longitude = Number(row?.cell_lon);
  if (!row || typeof row.id !== "string" || typeof row.species_id !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(row.observed_on ?? "")) return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  if (row.status === "rejected") return null;
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
    status: row.status === "approved" ? "approved" : "pending",
  };
}

async function readJson(response: Awaited<ReturnType<FetchLike>>) {
  if (!response.ok) throw new Error(`Servidor respondeu ${response.status}`);
  return (await response.json()) as unknown;
}

export async function fetchPublicFeed(config: FeedConfig, fetchImpl: FetchLike, token: string | null, myIds: ReadonlySet<string>, limit = 2000): Promise<PublicRecord[]> {
  const response = await fetchImpl(`${config.url}/rest/v1/public_feed?select=*&order=observed_on.desc&limit=${limit}`, { method: "GET", headers: headers(config, token) });
  const rows = await readJson(response);
  if (!Array.isArray(rows)) throw new Error("Resposta inesperada do servidor");
  return rows.map((row) => rowToRecord(row as FeedRow, myIds)).filter((item): item is PublicRecord => item !== null);
}

/** Resultado da auditoria das publicações desta conta, por id local do avistamento. */
export type MyPublication = { localId: string; id: string; status: "pending" | "approved" | "rejected"; reviewNote: string | null; endedAt: string | null };

export async function fetchMyPublications(config: FeedConfig, fetchImpl: FetchLike, token: string): Promise<MyPublication[]> {
  const response = await fetchImpl(`${config.url}/rest/v1/rpc/my_publications`, { method: "POST", headers: headers(config, token), body: "{}" });
  const rows = await readJson(response);
  if (!Array.isArray(rows)) throw new Error("Resposta inesperada do servidor");
  return rows.flatMap((row) => {
    const item = row as Record<string, unknown>;
    if (typeof item.local_id !== "string" || typeof item.id !== "string") return [];
    const status = item.status === "approved" || item.status === "rejected" ? item.status : "pending";
    return [{ localId: item.local_id, id: item.id, status, reviewNote: typeof item.review_note === "string" ? item.review_note : null, endedAt: typeof item.ended_at === "string" ? item.ended_at : null }];
  });
}

// ───────────────────────────── Fila de envio ─────────────────────────────

/** O que vai para o servidor ao publicar. A coordenada exata e a observação só o auditor vê. */
export type PublishPayload = {
  speciesId: string; date: string; time?: string; latitude: number; longitude: number;
  notes?: string; photoPath?: string | null; expiresAt: string | null;
};

export type FeedOperation =
  | { type: "publish"; localId: string; payload: PublishPayload; queuedAt: string; /** Foto local ainda não enviada ao Storage. */ photoUri?: string }
  | { type: "end"; localId: string; queuedAt: string };

export type FeedQueue = { version: 2; operations: FeedOperation[] };
export const FEED_QUEUE_KEY = "pantanal-dex:public-feed-queue-v2";
export const FEED_REJECTIONS_KEY = "pantanal-dex:public-feed-rejections-v1";

export function createFeedQueue(): FeedQueue {
  return { version: 2, operations: [] };
}

/** Coloca uma operação na fila; uma operação nova para o mesmo registro substitui a anterior. */
export function enqueue(queue: FeedQueue, operation: FeedOperation): FeedQueue {
  const rest = queue.operations.filter((item) => item.localId !== operation.localId);
  return { ...queue, operations: [...rest, operation] };
}

export function restoreFeedQueue(raw: string | null): FeedQueue {
  if (!raw) return createFeedQueue();
  try {
    const parsed = JSON.parse(raw) as Partial<FeedQueue>;
    if (parsed.version !== 2 || !Array.isArray(parsed.operations)) return createFeedQueue();
    const operations = parsed.operations.filter((item): item is FeedOperation =>
      !!item && typeof item === "object" && typeof (item as FeedOperation).localId === "string" &&
      ((item as FeedOperation).type === "end" || ((item as FeedOperation).type === "publish" && typeof (item as { payload?: { speciesId?: unknown } }).payload?.speciesId === "string")));
    return { version: 2, operations };
  } catch {
    return createFeedQueue();
  }
}

const PERMANENT_STATUSES = new Set([400, 404, 409, 422]);

async function callRpc(config: FeedConfig, fetchImpl: FetchLike, token: string, name: string, body: Record<string, unknown>) {
  const response = await fetchImpl(`${config.url}/rest/v1/rpc/${name}`, { method: "POST", headers: headers(config, token), body: JSON.stringify(body) });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const error = new Error(`Servidor recusou (${response.status}) ${detail}`.trim()) as Error & { permanent?: boolean; status?: number };
    // 400/404/409/422 = regra do servidor recusou (não adianta reenviar igual).
    // 401/403 (conta/token), 429 (limite de pedidos), 5xx e rede = tentar depois.
    error.permanent = PERMANENT_STATUSES.has(response.status);
    error.status = response.status;
    throw error;
  }
}

export function operationRequest(operation: FeedOperation): { name: string; body: Record<string, unknown> } {
  if (operation.type === "end") return { name: "end_my_publication", body: { p_local_id: operation.localId } };
  const { payload } = operation;
  return {
    name: "publish_my_sighting",
    body: {
      p_local_id: operation.localId,
      p_species_id: payload.speciesId,
      p_observed_on: payload.date,
      p_observed_time: payload.time ?? null,
      p_exact_lat: payload.latitude,
      p_exact_lon: payload.longitude,
      p_notes: payload.notes?.trim() ? payload.notes.trim().slice(0, 500) : null,
      p_photo_path: payload.photoPath ?? null,
      p_expires_at: payload.expiresAt,
    },
  };
}

export type FlushResult = { queue: FeedQueue; sent: number; rejected: { operation: FeedOperation; message: string }[]; stoppedByNetwork: boolean };

/**
 * Envia a fila em ordem. Para no primeiro erro temporário (rede, 5xx, 401/403, 429) e mantém o
 * restante; operações recusadas pelas regras do servidor (400/404/409/422) saem da fila e são
 * informadas em `rejected`.
 */
export async function flushQueue(queue: FeedQueue, config: FeedConfig, fetchImpl: FetchLike, token: string): Promise<FlushResult> {
  const remaining = [...queue.operations];
  const rejected: FlushResult["rejected"] = [];
  let sent = 0;
  while (remaining.length) {
    const operation = remaining[0];
    const request = operationRequest(operation);
    try {
      await callRpc(config, fetchImpl, token, request.name, request.body);
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
 * Aplica o resultado de um envio à fila ATUAL, que pode ter mudado durante o envio.
 * Tira só as operações do lote enviado que foram confirmadas ou recusadas; operações novas
 * (ou que substituíram uma do lote) continuam na fila.
 */
export function applyFlushResult(current: FeedQueue, sentBatch: readonly FeedOperation[], remainingOfBatch: readonly FeedOperation[]): FeedQueue {
  const processed = new Set(sentBatch.filter((operation) => !remainingOfBatch.includes(operation)));
  return { ...current, operations: current.operations.filter((operation) => !processed.has(operation)) };
}

/** Mensagem curta para a pessoa a partir do erro do servidor. */
export function friendlyRejection(message: string): string {
  if (/limite de 30/i.test(message)) return "limite de 30 publicações por dia";
  if (/futuro/i.test(message)) return "data no futuro";
  if (/localiza/i.test(message)) return "localização inválida";
  if (/vencido/i.test(message)) return "prazo já vencido";
  if (/esp[ée]cie/i.test(message)) return "espécie inválida";
  return "recusado pelo servidor";
}

/** Caminho da foto no Storage: pasta da conta + id local do avistamento. */
export function photoPathFor(userId: string, localId: string, extension = "jpg"): string {
  return `${userId}/${localId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80)}.${extension}`;
}
