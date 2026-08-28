import { describe, expect, it } from "vitest";
import { createSightingsStorage, SIGHTINGS_CHUNK_PREFIX, SIGHTINGS_KEY, SIGHTINGS_MANIFEST_KEY, SIGHTINGS_CHUNK_SIZE, type StorageLike } from "../lib/sightings-storage";
import type { Sighting } from "../shared/pantanal";

function makeSighting(index: number): Sighting { return { id: `s-${index}`, speciesId: "capivara", date: "2026-08-27", locationPrecision: "none", visibility: "private", createdAt: "2026-08-27T12:00:00.000Z", updatedAt: "2026-08-27T12:00:00.000Z" }; }
function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  const storage: StorageLike = {
    getItem: async (key) => data.get(key) ?? null,
    setItem: async (key, value) => { data.set(key, value); },
    removeItem: async (key) => { data.delete(key); },
    multiGet: async (keys) => keys.map((key) => [key, data.get(key) ?? null]),
    multiSet: async (entries) => { for (const [key, value] of entries) data.set(key, value); },
    multiRemove: async (keys) => { for (const key of keys) data.delete(key); },
  };
  return { data, storage };
}

describe("sightings storage", () => {
  it("migra o array legado e filtra entradas inválidas", async () => {
    const valid = makeSighting(1);
    const { storage } = memoryStorage({ [SIGHTINGS_KEY]: JSON.stringify([valid, { id: "incompleto" }]) });
    const persisted = createSightingsStorage(storage);
    expect(await persisted.load()).toEqual([valid]);
  });

  it("recupera JSON corrompido sem lançar exceção", async () => {
    const { storage } = memoryStorage({ [SIGHTINGS_MANIFEST_KEY]: "{bad", [SIGHTINGS_KEY]: "{bad" });
    await expect(createSightingsStorage(storage).load()).resolves.toEqual([]);
  });

  it("divide mais de 100 registros em chunks e reconstrói a ordem", async () => {
    const { storage, data } = memoryStorage();
    const sightings = Array.from({ length: SIGHTINGS_CHUNK_SIZE * 2 + 1 }, (_, index) => makeSighting(index));
    const persisted = createSightingsStorage(storage);
    await persisted.save(sightings);
    expect(JSON.parse(data.get(SIGHTINGS_MANIFEST_KEY) ?? "{}")).toMatchObject({ version: 2, count: sightings.length, chunks: 3 });
    expect(data.has(`${SIGHTINGS_CHUNK_PREFIX}0`)).toBe(true);
    expect(await persisted.load()).toEqual(sightings);
  });

  it("serializa gravações concorrentes e mantém a última gravação completa", async () => {
    const { storage } = memoryStorage();
    const persisted = createSightingsStorage(storage);
    const first = Array.from({ length: 150 }, (_, index) => makeSighting(index));
    const second = [makeSighting(999)];
    await Promise.all([persisted.save(first), persisted.save(second)]);
    expect(await persisted.load()).toEqual(second);
  });

  it("preserva identidade e registros vizinhos ao atualizar um avistamento", async () => {
    const { storage } = memoryStorage();
    const persisted = createSightingsStorage(storage);
    const original = [makeSighting(1), makeSighting(2), makeSighting(3)];
    await persisted.save(original);
    const edited = { ...original[1], notes: "revisado", updatedAt: "2026-08-28T12:00:00.000Z" };
    await persisted.save(original.map((item) => item.id === edited.id ? edited : item));
    const loaded = await persisted.load();
    expect(loaded).toHaveLength(3);
    expect(loaded.map((item) => item.id)).toEqual(["s-1", "s-2", "s-3"]);
    expect(loaded[1]).toMatchObject({ id: "s-2", createdAt: original[1].createdAt, notes: "revisado" });
  });

  it("remove chunks excedentes ao reduzir o inventário", async () => {
    const { storage, data } = memoryStorage();
    const persisted = createSightingsStorage(storage);
    await persisted.save(Array.from({ length: 150 }, (_, index) => makeSighting(index)));
    await persisted.save([makeSighting(1)]);
    expect(data.has(`${SIGHTINGS_CHUNK_PREFIX}1`)).toBe(false);
    expect(await persisted.load()).toEqual([makeSighting(1)]);
  });
});
