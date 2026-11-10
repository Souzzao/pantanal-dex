import { describe, expect, it, vi } from "vitest";

import {
  applyFlushResult,
  createFeedQueue,
  enqueue,
  fetchMyPublications,
  fetchPublicFeed,
  flushQueue,
  friendlyRejection,
  headers,
  isPermanentPhotoError,
  isWaitingForPhoto,
  PHOTO_REJECTION,
  operationRequest,
  photoPathFor,
  readFeedConfig,
  restoreFeedQueue,
  rowToRecord,
  type FeedOperation,
  type FetchLike,
} from "../shared/public-feed";

const config = { url: "https://exemplo.supabase.co", anonKey: "chave-anon" };
const token = "token-da-conta";
const publish = (localId: string): FeedOperation => ({ type: "publish", localId, queuedAt: "2026-11-07T10:00:00.000Z", payload: { speciesId: "tuiuiu", date: "2026-11-06", latitude: -16.4321, longitude: -56.8765, notes: "  perto do rio ", expiresAt: null } });
const end = (localId: string, queuedAt = "2026-11-07T11:00:00.000Z"): FeedOperation => ({ type: "end", localId, queuedAt });

function response(status: number, body: unknown = []) {
  return { ok: status >= 200 && status < 300, status, json: async () => body, text: async () => JSON.stringify(body) };
}
const ids = (operations: FeedOperation[]) => operations.map((item) => `${item.type}:${item.localId}`);

describe("configuração do servidor", () => {
  it("só liga com URL https e chave", () => {
    expect(readFeedConfig({})).toBeNull();
    expect(readFeedConfig({ EXPO_PUBLIC_SUPABASE_URL: "http://inseguro.co", EXPO_PUBLIC_SUPABASE_ANON_KEY: "k" })).toBeNull();
    expect(readFeedConfig({ EXPO_PUBLIC_SUPABASE_URL: "https://x.supabase.co/", EXPO_PUBLIC_SUPABASE_ANON_KEY: " k " })).toEqual({ url: "https://x.supabase.co", anonKey: "k" });
  });

  it("manda o token da conta; sem conta, só a chave", () => {
    expect(headers(config, token).Authorization).toBe(`Bearer ${token}`);
    expect(headers({ url: config.url, anonKey: "eyJabc" }).Authorization).toBe("Bearer eyJabc");
    expect(headers({ url: config.url, anonKey: "sb_publishable_abc" }).Authorization).toBeUndefined();
  });
});

describe("leitura do mapa público", () => {
  it("converte linhas, mantém a grade, marca os desta conta e esconde reprovados", async () => {
    const rows = [
      { id: "meu", species_id: "tuiuiu", observed_on: "2026-11-06", observed_time: null, cell_lat: "-16.4", cell_lon: "-56.9", published_at: "2026-11-06T10:00:00Z", expires_at: null, status: "approved" },
      { id: "outro", species_id: "capivara", observed_on: "2026-11-05", observed_time: "07:30", cell_lat: -17.43, cell_lon: -56.77, published_at: "2026-11-05T10:00:00Z", expires_at: null, status: "pending" },
      { id: "reprovado", species_id: "capivara", observed_on: "2026-11-05", observed_time: null, cell_lat: 1, cell_lon: 1, published_at: "", expires_at: null, status: "rejected" },
      { id: "ruim", species_id: "x", observed_on: "ontem", observed_time: null, cell_lat: 0, cell_lon: 0, published_at: "", expires_at: null },
    ];
    const fetchImpl = vi.fn(async () => response(200, rows)) as unknown as FetchLike;
    const records = await fetchPublicFeed(config, fetchImpl, token, new Set(["meu"]));
    expect(records.map((item) => [item.id, item.owner, item.latitude, item.longitude, item.status])).toEqual([["meu", "me", -16.4, -56.9, "approved"], ["outro", "others", -17.4, -56.8, "pending"]]);
    const call = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[0]).toContain("/rest/v1/public_feed?");
    expect(call[1].headers.Authorization).toBe(`Bearer ${token}`);
  });

  it("falha com mensagem clara quando o servidor responde erro", async () => {
    await expect(fetchPublicFeed(config, async () => response(503), token, new Set())).rejects.toThrow("503");
  });

  it("descarta linha com coordenada impossível", () => {
    expect(rowToRecord({ id: "x", species_id: "tuiuiu", observed_on: "2026-11-06", observed_time: null, cell_lat: 120, cell_lon: 0, published_at: "", expires_at: null }, new Set())).toBeNull();
  });

  it("lê o resultado da auditoria das minhas publicações", async () => {
    const rows = [{ local_id: "s-1", id: "u1", status: "rejected", review_note: "foto não mostra o animal", ended_at: null }, { local_id: 3 }];
    expect(await fetchMyPublications(config, async () => response(200, rows), token)).toEqual([{ localId: "s-1", id: "u1", status: "rejected", reviewNote: "foto não mostra o animal", endedAt: null }]);
  });
});

describe("fila de envio", () => {
  it("a última operação de um registro substitui a anterior", () => {
    let queue = enqueue(createFeedQueue(), publish("a"));
    queue = enqueue(queue, publish("b"));
    queue = enqueue(queue, end("a"));
    expect(ids(queue.operations)).toEqual(["publish:b", "end:a"]);
  });

  it("restaura do armazenamento e ignora lixo e a fila antiga (sem conta)", () => {
    const queue = enqueue(createFeedQueue(), publish("a"));
    expect(restoreFeedQueue(JSON.stringify(queue))).toEqual(queue);
    expect(restoreFeedQueue("{quebrado")).toEqual(createFeedQueue());
    expect(restoreFeedQueue(JSON.stringify({ version: 1, operations: [{ type: "end", id: "x" }] }))).toEqual(createFeedQueue());
    expect(restoreFeedQueue(JSON.stringify({ version: 2, operations: [{ type: "publish", localId: "x" }, publish("b")] })).operations).toHaveLength(1);
  });

  it("monta o pedido com a coordenada exata (só o auditor vê) e a observação limpa", () => {
    const request = operationRequest(publish("a"));
    expect(request.name).toBe("publish_my_sighting");
    expect(request.body).toMatchObject({ p_local_id: "a", p_exact_lat: -16.4321, p_exact_lon: -56.8765, p_notes: "perto do rio", p_observed_time: null, p_photo_path: null });
    expect(operationRequest(end("a"))).toEqual({ name: "end_my_publication", body: { p_local_id: "a" } });
  });

  it("envia tudo quando há rede, com o token da conta", async () => {
    const fetchImpl = vi.fn(async () => response(200, "id")) as unknown as FetchLike;
    const result = await flushQueue(enqueue(enqueue(createFeedQueue(), publish("a")), publish("b")), config, fetchImpl, token);
    expect(result).toMatchObject({ sent: 2, stoppedByNetwork: false });
    expect(result.queue.operations).toEqual([]);
    expect((fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1].headers.Authorization).toBe(`Bearer ${token}`);
  });

  it("para no erro de rede e guarda o restante para depois", async () => {
    let calls = 0;
    const fetchImpl: FetchLike = async () => {
      calls += 1;
      if (calls === 2) throw new Error("sem rede");
      return response(204);
    };
    const result = await flushQueue(enqueue(enqueue(enqueue(createFeedQueue(), publish("a")), publish("b")), publish("c")), config, fetchImpl, token);
    expect(result.sent).toBe(1);
    expect(result.stoppedByNetwork).toBe(true);
    expect(ids(result.queue.operations)).toEqual(["publish:b", "publish:c"]);
  });

  it("tira da fila o que o servidor recusou pelas regras (400) e segue com o resto", async () => {
    const fetchImpl: FetchLike = async (_url, init) => (init?.body?.includes('"p_local_id":"a"') ? response(400, { message: "limite de 30 publicações por dia" }) : response(204));
    const result = await flushQueue(enqueue(enqueue(createFeedQueue(), publish("a")), publish("b")), config, fetchImpl, token);
    expect(result.sent).toBe(1);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0].message).toContain("limite de 30");
    expect(result.queue.operations).toEqual([]);
  });

  it("401, 403 e 429 não descartam a operação (conta ou limite de pedidos)", async () => {
    for (const status of [401, 403, 429]) {
      const result = await flushQueue(enqueue(createFeedQueue(), publish("a")), config, async () => response(status), token);
      expect(result.stoppedByNetwork).toBe(true);
      expect(result.rejected).toEqual([]);
      expect(result.queue.operations).toHaveLength(1);
    }
  });
});

describe("envio sem perder ações feitas durante o envio", () => {
  it("encerrar durante uma resposta lenta continua na fila", async () => {
    let queue = enqueue(createFeedQueue(), publish("a"));
    let release: () => void = () => undefined;
    const slow: FetchLike = () => new Promise((resolve) => { release = () => resolve(response(204)); });
    const batch = queue.operations;
    const pending = flushQueue(queue, config, slow, token);
    queue = enqueue(queue, end("a", "2026-11-07T12:00:00.000Z"));
    release();
    const result = await pending;
    expect(applyFlushResult(queue, batch, result.queue.operations).operations).toEqual([end("a", "2026-11-07T12:00:00.000Z")]);
  });

  it("operação nova de outro registro também fica", () => {
    const first = enqueue(createFeedQueue(), publish("a"));
    const batch = first.operations;
    const current = enqueue(first, publish("b"));
    expect(ids(applyFlushResult(current, batch, []).operations)).toEqual(["publish:b"]);
  });
});

describe("recusas e fotos", () => {
  it("traduz o motivo da recusa", () => {
    expect(friendlyRejection('Servidor recusou (400) {"message":"limite de 30 publicações por dia"}')).toBe("limite de 30 publicações por dia");
    expect(friendlyRejection("qualquer coisa")).toBe("recusado pelo servidor");
  });

  it("guarda a foto na pasta da conta com nome seguro", () => {
    expect(photoPathFor("uid-1", "sighting-1/../x")).toBe("uid-1/sighting-1____x.jpg");
  });
});

describe("foto antes da publicação", () => {
  it("publicação com foto local ainda não enviada espera; depois do envio, segue", () => {
    const withPhoto: FeedOperation = { ...publish("a"), photoUri: "file:///foto.jpg" } as FeedOperation;
    expect(isWaitingForPhoto(withPhoto)).toBe(true);
    expect(isWaitingForPhoto(publish("b"))).toBe(false);
    expect(isWaitingForPhoto(end("a"))).toBe(false);
    if (withPhoto.type === "publish") withPhoto.payload = { ...withPhoto.payload, photoPath: "uid/a.jpg" };
    expect(isWaitingForPhoto(withPhoto)).toBe(false);
  });

  it("a pendência da foto sobrevive a fechar e abrir o app", () => {
    const queue = enqueue(createFeedQueue(), { ...publish("a"), photoUri: "file:///foto.jpg" } as FeedOperation);
    const restored = restoreFeedQueue(JSON.stringify(queue));
    expect(isWaitingForPhoto(restored.operations[0])).toBe(true);
  });

  it("separa erro definitivo (arquivo sumiu, 413) de temporário (rede, 503)", () => {
    expect(isPermanentPhotoError({ permanentPhoto: true })).toBe(true);
    expect(isPermanentPhotoError({ statusCode: "413" })).toBe(true);
    expect(isPermanentPhotoError({ statusCode: "503" })).toBe(false);
    expect(isPermanentPhotoError(new Error("Network request failed"))).toBe(false);
    expect(friendlyRejection(PHOTO_REJECTION)).toContain("foto");
  });
});
