import { describe, expect, it, vi } from "vitest";

import {
  createFeedQueue,
  enqueue,
  fetchPublicFeed,
  flushQueue,
  generateDeviceSecret,
  operationRequest,
  publicIdFor,
  readFeedConfig,
  restoreFeedQueue,
  rowToRecord,
  type FeedOperation,
  type FetchLike,
} from "../shared/public-feed";

const config = { url: "https://exemplo.supabase.co", anonKey: "chave-anon" };
const secret = "a".repeat(64);
const publish = (id: string): FeedOperation => ({ type: "publish", queuedAt: "2026-11-07T10:00:00.000Z", record: { id, speciesId: "tuiuiu", date: "2026-11-06", latitude: -16.43, longitude: -56.87, expiresAt: null } });

function response(status: number, body: unknown = []) {
  return { ok: status >= 200 && status < 300, status, json: async () => body, text: async () => JSON.stringify(body) };
}

describe("configuração do servidor", () => {
  it("só liga com URL https e chave anon", () => {
    expect(readFeedConfig({})).toBeNull();
    expect(readFeedConfig({ EXPO_PUBLIC_SUPABASE_URL: "http://inseguro.co", EXPO_PUBLIC_SUPABASE_ANON_KEY: "k" })).toBeNull();
    expect(readFeedConfig({ EXPO_PUBLIC_SUPABASE_URL: "https://x.supabase.co/", EXPO_PUBLIC_SUPABASE_ANON_KEY: " k " })).toEqual({ url: "https://x.supabase.co", anonKey: "k" });
  });
});

describe("leitura do mapa público", () => {
  it("converte linhas, mantém a grade pública e marca os registros deste aparelho", async () => {
    const rows = [
      { id: "meu", species_id: "tuiuiu", observed_on: "2026-11-06", observed_time: null, cell_lat: "-16.4", cell_lon: "-56.9", published_at: "2026-11-06T10:00:00Z", expires_at: null },
      { id: "outro", species_id: "capivara", observed_on: "2026-11-05", observed_time: "07:30", cell_lat: -17.43, cell_lon: -56.77, published_at: "2026-11-05T10:00:00Z", expires_at: "2026-12-05T10:00:00Z" },
      { id: "ruim", species_id: "x", observed_on: "ontem", observed_time: null, cell_lat: 0, cell_lon: 0, published_at: "", expires_at: null },
    ];
    const fetchImpl = vi.fn(async () => response(200, rows)) as unknown as FetchLike;
    const records = await fetchPublicFeed(config, fetchImpl, new Set(["meu"]));
    expect(records.map((item) => [item.id, item.owner, item.latitude, item.longitude])).toEqual([["meu", "me", -16.4, -56.9], ["outro", "others", -17.4, -56.8]]);
    expect((fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0]).toContain("/rest/v1/public_feed?");
    expect((fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1].headers.apikey).toBe("chave-anon");
  });

  it("falha com mensagem clara quando o servidor responde erro", async () => {
    await expect(fetchPublicFeed(config, async () => response(503), new Set())).rejects.toThrow("503");
  });

  it("descarta linha com coordenada impossível", () => {
    expect(rowToRecord({ id: "x", species_id: "tuiuiu", observed_on: "2026-11-06", observed_time: null, cell_lat: 120, cell_lon: 0, published_at: "", expires_at: null }, new Set())).toBeNull();
  });
});

describe("fila de envio", () => {
  it("a última operação de um registro substitui a anterior", () => {
    let queue = enqueue(createFeedQueue(), publish("a"));
    queue = enqueue(queue, publish("b"));
    queue = enqueue(queue, { type: "end", id: "a", queuedAt: "2026-11-07T11:00:00.000Z" });
    expect(queue.operations.map((item) => (item.type === "end" ? `end:${item.id}` : `pub:${item.record.id}`))).toEqual(["pub:b", "end:a"]);
  });

  it("restaura do armazenamento e ignora lixo", () => {
    const queue = enqueue(createFeedQueue(), publish("a"));
    expect(restoreFeedQueue(JSON.stringify(queue))).toEqual(queue);
    expect(restoreFeedQueue("{quebrado")).toEqual(createFeedQueue());
    expect(restoreFeedQueue(JSON.stringify({ version: 1, operations: [{ type: "publish" }, publish("b")] })).operations).toHaveLength(1);
  });

  it("monta o pedido de publicação com a coordenada generalizada e o segredo", () => {
    const request = operationRequest(publish("a"), secret);
    expect(request.name).toBe("publish_sighting");
    expect(request.body).toMatchObject({ p_id: "a", p_cell_lat: -16.4, p_cell_lon: -56.9, p_secret: secret, p_observed_time: null });
    expect(operationRequest({ type: "end", id: "a", queuedAt: "" }, secret)).toEqual({ name: "end_publication", body: { p_id: "a", p_secret: secret } });
  });

  it("envia tudo quando há rede", async () => {
    const fetchImpl = vi.fn(async () => response(204)) as unknown as FetchLike;
    const result = await flushQueue(enqueue(enqueue(createFeedQueue(), publish("a")), publish("b")), config, fetchImpl, secret);
    expect(result).toMatchObject({ sent: 2, stoppedByNetwork: false });
    expect(result.queue.operations).toEqual([]);
  });

  it("para no erro de rede e guarda o restante para depois", async () => {
    let calls = 0;
    const fetchImpl: FetchLike = async () => {
      calls += 1;
      if (calls === 2) throw new Error("sem rede");
      return response(204);
    };
    const result = await flushQueue(enqueue(enqueue(enqueue(createFeedQueue(), publish("a")), publish("b")), publish("c")), config, fetchImpl, secret);
    expect(result.sent).toBe(1);
    expect(result.stoppedByNetwork).toBe(true);
    expect(result.queue.operations.map((item) => (item.type === "publish" ? item.record.id : item.id))).toEqual(["b", "c"]);
  });

  it("tira da fila o que o servidor recusou pelas regras (4xx) e segue com o resto", async () => {
    const fetchImpl: FetchLike = async (_url, init) => (init?.body?.includes('"p_id":"a"') ? response(400, { message: "limite de 30 publicações por dia" }) : response(204));
    const result = await flushQueue(enqueue(enqueue(createFeedQueue(), publish("a")), publish("b")), config, fetchImpl, secret);
    expect(result.sent).toBe(1);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0].message).toContain("limite de 30");
    expect(result.queue.operations).toEqual([]);
  });
});

describe("segredo do aparelho", () => {
  it("tem 64 caracteres hexadecimais e usa a fonte aleatória recebida", () => {
    const value = generateDeviceSecret((bytes) => bytes.fill(171));
    expect(value).toBe("ab".repeat(32));
    expect(generateDeviceSecret()).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("id público", () => {
  it("separa aparelhos diferentes com o mesmo id local", () => {
    expect(publicIdFor("sighting-1", "a".repeat(64))).toBe("sighting-1@aaaaaaaa");
    expect(publicIdFor("sighting-1", "b".repeat(64))).not.toBe(publicIdFor("sighting-1", "a".repeat(64)));
    expect(publicIdFor("x".repeat(100), "a".repeat(64))).toHaveLength(80);
  });
});

