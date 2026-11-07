import { describe, expect, it } from "vitest";

import { filterSpeciesCatalog } from "../shared/catalog";
import type { Sighting } from "../shared/pantanal";
import {
  diffPublicNotebook,
  publicSignature,
  buildSampleRecords,
  clusterCellForSpan,
  clusterRecords,
  createPublicationStore,
  createWorldViewport,
  endPublication,
  expiryFor,
  filterByDate,
  fitZoomToPoints,
  HIGH_INCIDENCE_MIN,
  isRecordActive,
  myPublicRecords,
  prunePublications,
  publicationStatus,
  publishSighting,
  restorePublicationStore,
  serializePublicationStore,
  toPublicCell,
  toPublicRecord,
  type PublicRecord,
} from "../shared/public-map";

const now = new Date("2026-11-06T22:00:00.000Z");

function sighting(overrides: Partial<Sighting> = {}): Sighting {
  return {
    id: "s1",
    speciesId: "tuiuiu",
    date: "2026-11-05",
    latitude: -16.4321,
    longitude: -56.8765,
    locationPrecision: "exact",
    visibility: "shareable",
    createdAt: "2026-11-05T10:00:00.000Z",
    updatedAt: "2026-11-05T10:00:00.000Z",
    ...overrides,
  };
}

function record(overrides: Partial<PublicRecord>): PublicRecord {
  return { id: "r", speciesId: "tuiuiu", date: "2026-11-05", latitude: -16.4, longitude: -56.9, publishedAt: now.toISOString(), expiresAt: null, owner: "others", ...overrides };
}

describe("publicações com prazo", () => {
  it("calcula o vencimento pela duração escolhida; 'sem prazo' não vence", () => {
    expect(expiryFor("7d", now)).toBe("2026-11-13T22:00:00.000Z");
    expect(expiryFor("1d", now)).toBe("2026-11-07T22:00:00.000Z");
    expect(expiryFor("forever", now)).toBeNull();
  });

  it("percorre os estados: não publicado → ativo → vencido; e encerrado pela pessoa", () => {
    const item = sighting();
    let store = createPublicationStore();
    expect(publicationStatus(item, store.items.s1, now)).toBe("not-published");
    store = publishSighting(store, "s1", "7d", now);
    expect(publicationStatus(item, store.items.s1, now)).toBe("active");
    expect(publicationStatus(item, store.items.s1, new Date("2026-11-14T00:00:00.000Z"))).toBe("expired");
    const ended = endPublication(store, "s1", new Date("2026-11-07T10:00:00.000Z"));
    expect(publicationStatus(item, ended.items.s1, now)).toBe("ended");
    expect(ended.items.s1.publishedAt).toBe(store.items.s1.publishedAt);
  });

  it("renovar recomeça o prazo a partir de agora e desfaz o encerramento", () => {
    let store = publishSighting(createPublicationStore(), "s1", "1d", now);
    store = endPublication(store, "s1", now);
    const later = new Date("2026-11-20T12:00:00.000Z");
    store = publishSighting(store, "s1", "30d", later);
    expect(store.items.s1).toMatchObject({ endedAt: null, publishedAt: later.toISOString(), expiresAt: "2026-12-20T12:00:00.000Z" });
  });

  it("registro pessoal ou sem localização nunca fica público", () => {
    const store = publishSighting(createPublicationStore(), "s1", "forever", now);
    expect(publicationStatus(sighting({ visibility: "private" }), store.items.s1, now)).toBe("private");
    expect(publicationStatus(sighting({ latitude: undefined, longitude: undefined }), store.items.s1, now)).toBe("no-location");
    expect(toPublicRecord(sighting({ visibility: "private" }), store.items.s1, now)).toBeNull();
  });

  it("remove publicações de registros apagados do caderno", () => {
    let store = publishSighting(createPublicationStore(), "s1", "7d", now);
    store = publishSighting(store, "s2", "7d", now);
    expect(Object.keys(prunePublications(store, ["s2"]).items)).toEqual(["s2"]);
    expect(prunePublications(store, ["s1", "s2"])).toBe(store);
  });

  it("salva e restaura; descarta entradas inválidas; trata JSON corrompido", () => {
    const store = publishSighting(createPublicationStore(), "s1", "7d", now);
    expect(restorePublicationStore(serializePublicationStore(store))).toEqual({ store, status: "restored" });
    const messy = JSON.stringify({ version: 1, items: { s1: store.items.s1, s2: { sightingId: "outro", publishedAt: "x" } } });
    expect(Object.keys(restorePublicationStore(messy).store.items)).toEqual(["s1"]);
    expect(restorePublicationStore("{quebrado").status).toBe("corrupted");
    expect(restorePublicationStore(null).status).toBe("empty");
  });
});

describe("registros públicos", () => {
  it("nunca expõem a coordenada exata: só a célula de 0,1°", () => {
    const store = publishSighting(createPublicationStore(), "s1", "30d", now);
    const result = toPublicRecord(sighting(), store.items.s1, now);
    expect(result).toMatchObject({ latitude: -16.4, longitude: -56.9, owner: "me" });
    expect(toPublicCell(-16.45)).toBe(-16.4);
    expect(toPublicCell(0.06)).toBe(0.1);
  });

  it("funciona fora do Pantanal (o app é para o mundo todo)", () => {
    const store = publishSighting(createPublicationStore(), "s1", "30d", now);
    expect(toPublicRecord(sighting({ latitude: 48.8566, longitude: 2.3522 }), store.items.s1, now)).toMatchObject({ latitude: 48.9, longitude: 2.4 });
  });

  it("lista só os publicados e ativos do caderno", () => {
    let store = publishSighting(createPublicationStore(), "a", "7d", now);
    store = publishSighting(store, "b", "1d", new Date("2026-10-01T00:00:00.000Z"));
    const list = myPublicRecords([sighting({ id: "a" }), sighting({ id: "b" }), sighting({ id: "c" })], store, now);
    expect(list.map((item) => item.id)).toEqual(["a"]);
  });

  it("registro com prazo vencido deixa de aparecer", () => {
    expect(isRecordActive(record({ expiresAt: "2026-11-06T21:59:59.000Z" }), now)).toBe(false);
    expect(isRecordActive(record({ expiresAt: null }), now)).toBe(true);
  });
});

describe("filtro por data", () => {
  const list = [record({ id: "hoje", date: "2026-11-06" }), record({ id: "semana", date: "2026-10-31" }), record({ id: "mes", date: "2026-10-10" }), record({ id: "antigo", date: "2025-01-01" })];

  it("aplica os atalhos 7 dias, 30 dias, 12 meses e tudo", () => {
    expect(filterByDate(list, { preset: "7d" }, now).map((item) => item.id)).toEqual(["hoje", "semana"]);
    expect(filterByDate(list, { preset: "30d" }, now).map((item) => item.id)).toEqual(["hoje", "semana", "mes"]);
    expect(filterByDate(list, { preset: "365d" }, now)).toHaveLength(3);
    expect(filterByDate(list, { preset: "all" }, now)).toHaveLength(4);
  });

  it("aceita intervalo personalizado, inclusive invertido, e ignora datas inválidas", () => {
    expect(filterByDate(list, { from: "2026-10-01", to: "2026-10-31" }, now).map((item) => item.id)).toEqual(["semana", "mes"]);
    expect(filterByDate(list, { from: "2026-10-31", to: "2026-10-01" }, now).map((item) => item.id)).toEqual(["semana", "mes"]);
    expect(filterByDate(list, { from: "ontem" }, now)).toHaveLength(4);
  });
});

describe("agrupamento por área", () => {
  it("junta registros da mesma área num só ponto e marca alta incidência", () => {
    const crowded = Array.from({ length: HIGH_INCIDENCE_MIN }, (_, index) => record({ id: `p${index}`, speciesId: index % 2 ? "tuiuiu" : "capivara" }));
    const clusters = clusterRecords([...crowded, record({ id: "longe", latitude: -19.6, longitude: -57.0 })], 0.5);
    expect(clusters).toHaveLength(2);
    expect(clusters[0]).toMatchObject({ count: HIGH_INCIDENCE_MIN, speciesCount: 2, highIncidence: true });
    expect(clusters[1]).toMatchObject({ count: 1, highIncidence: false });
  });

  it("células maiores quando o mapa mostra uma área maior", () => {
    expect(clusterCellForSpan(360)).toBe(45);
    expect(clusterCellForSpan(20)).toBe(2);
    expect(clusterCellForSpan(1)).toBe(0.1);
    const spread = [record({ id: "a", latitude: -16.4, longitude: -56.9 }), record({ id: "b", latitude: -16.1, longitude: -57.7 })];
    expect(clusterRecords(spread, 0.1)).toHaveLength(2);
    expect(clusterRecords(spread, 2)).toHaveLength(1);
  });

  it("ordena os registros de cada área do mais recente para o mais antigo", () => {
    const [cluster] = clusterRecords([record({ id: "velho", date: "2026-01-01" }), record({ id: "novo", date: "2026-11-01" })], 1);
    expect(cluster.records.map((item) => item.id)).toEqual(["novo", "velho"]);
  });
});

describe("mapa-múndi", () => {
  it("zoom 1 mostra o mundo; zoom maior aproxima mantendo o centro", () => {
    const world = createWorldViewport(360, 300, { latitude: 0, longitude: 0 }, 1);
    expect(world.east - world.west).toBe(360);
    const near = createWorldViewport(360, 300, { latitude: -17, longitude: -56 }, 64);
    expect(near.east - near.west).toBeCloseTo(360 / 64);
    expect((near.west + near.east) / 2).toBeCloseTo(-56);
    expect(near.north).toBeLessThanOrEqual(85);
    expect(near.south).toBeGreaterThanOrEqual(-85);
  });

  it("enquadra os pontos existentes", () => {
    const { center, zoom } = fitZoomToPoints([{ latitude: -16, longitude: -57 }, { latitude: -20, longitude: -56 }], 360, 300);
    expect(center).toEqual({ latitude: -18, longitude: -56.5 });
    expect(zoom).toBeGreaterThan(10);
  });
});

describe("registros de exemplo", () => {
  it("são determinísticos, identificados como exemplo, generalizados e com uma área de alta incidência", () => {
    const catalog = filterSpeciesCatalog();
    const a = buildSampleRecords(catalog, now);
    expect(buildSampleRecords(catalog, now)).toEqual(a);
    expect(a.every((item) => item.sample === true && item.owner === "others")).toBe(true);
    expect(a.every((item) => toPublicCell(item.latitude) === item.latitude && toPublicCell(item.longitude) === item.longitude)).toBe(true);
    expect(clusterRecords(a, 0.5).some((cluster) => cluster.highIncidence)).toBe(true);
  });
});

describe("mudanças no caderno que afetam o mapa público", () => {
  it("primeira leitura não gera ações", () => {
    const diff = diffPublicNotebook(null, [sighting()]);
    expect([diff.fresh, diff.removed, diff.lost, diff.changed]).toEqual([[], [], [], []]);
    expect(diff.signatures.get("s1")).toBe(publicSignature(sighting()));
  });

  it("separa novos, apagados, que viraram pessoais e que mudaram", () => {
    const before = diffPublicNotebook(null, [sighting({ id: "a" }), sighting({ id: "b" }), sighting({ id: "c" }), sighting({ id: "d" })]).signatures;
    const diff = diffPublicNotebook(before, [
      sighting({ id: "a" }), // igual
      sighting({ id: "b", visibility: "private" }), // virou pessoal
      sighting({ id: "c", speciesId: "capivara" }), // mudou a espécie
      // "d" apagado
      sighting({ id: "e" }), // novo compartilhável
      sighting({ id: "f", visibility: "private" }), // novo pessoal: não publica
    ]);
    expect(diff.fresh).toEqual(["e"]);
    expect(diff.lost).toEqual(["b"]);
    expect(diff.changed).toEqual(["c"]);
    expect(diff.removed).toEqual(["d"]);
  });

  it("mexer na coordenada dentro da mesma célula pública não conta como mudança", () => {
    const before = diffPublicNotebook(null, [sighting({ id: "a", latitude: -16.41 })]).signatures;
    expect(diffPublicNotebook(before, [sighting({ id: "a", latitude: -16.42 })]).changed).toEqual([]);
    expect(diffPublicNotebook(before, [sighting({ id: "a", latitude: -16.52 })]).changed).toEqual(["a"]);
  });
});
