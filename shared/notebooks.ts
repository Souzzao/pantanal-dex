/**
 * PantanalDex — Cadernos: separa os avistamentos em cadernos (Principal, Teste, criados pela pessoa e
 * importados), registra o histórico de exportações e junta cadernos sem perder registros.
 *
 * Regras:
 * - Todo avistamento pertence a um caderno; sem `notebookId` ele está no Principal (compatível com
 *   cadernos antigos, que nunca tiveram esse campo).
 * - O Principal não pode ser apagado nem renomeado.
 * - Juntar cadernos move os registros para o destino e, se pedido, remove duplicatas
 *   (mesma espécie, data, hora e local), mantendo a versão mais recente.
 *
 * @author Felipe de Souza Aquino
 */
import type { Sighting } from "./pantanal";

export const MAIN_NOTEBOOK_ID = "principal";
export const TEST_NOTEBOOK_ID = "teste";
export const NOTEBOOK_STORE_VERSION = 1;
export const MAX_NOTEBOOK_NAME = 40;
export const MAX_EXPORT_HISTORY = 30;

export type NotebookKind = "main" | "test" | "custom" | "imported";
export type NotebookFileFormat = "json" | "csv" | "geojson";

export type Notebook = {
  id: string;
  name: string;
  kind: NotebookKind;
  createdAt: string;
  updatedAt: string;
  /** Para cadernos importados: de onde vieram. */
  source?: { format: NotebookFileFormat; fileName?: string; importedAt: string };
};

export type ExportRecord = {
  id: string;
  notebookIds: string[];
  notebookNames: string[];
  format: NotebookFileFormat;
  count: number;
  exportedAt: string;
};

export type NotebookStore = {
  version: typeof NOTEBOOK_STORE_VERSION;
  notebooks: Notebook[];
  exports: ExportRecord[];
  /** Caderno onde os novos avistamentos entram. */
  activeId: string;
};

/** Cria o conjunto inicial: Principal e Teste. */
export function createNotebookStore(now: Date = new Date()): NotebookStore {
  const at = now.toISOString();
  return {
    version: NOTEBOOK_STORE_VERSION,
    notebooks: [
      { id: MAIN_NOTEBOOK_ID, name: "Principal", kind: "main", createdAt: at, updatedAt: at },
      { id: TEST_NOTEBOOK_ID, name: "Teste", kind: "test", createdAt: at, updatedAt: at },
    ],
    exports: [],
    activeId: MAIN_NOTEBOOK_ID,
  };
}

const isKind = (value: unknown): value is NotebookKind => value === "main" || value === "test" || value === "custom" || value === "imported";
const isFormat = (value: unknown): value is NotebookFileFormat => value === "json" || value === "csv" || value === "geojson";

/**
 * Restaura os cadernos salvos. Conteúdo vazio ou corrompido volta ao conjunto inicial,
 * e o Principal é recriado se tiver sumido.
 */
export function restoreNotebookStore(raw: string | null, now: Date = new Date()): { store: NotebookStore; status: "empty" | "restored" | "corrupted" } {
  if (!raw) return { store: createNotebookStore(now), status: "empty" };
  try {
    const parsed = JSON.parse(raw) as Partial<NotebookStore>;
    if (parsed.version !== NOTEBOOK_STORE_VERSION || !Array.isArray(parsed.notebooks)) throw new Error("versão");
    const seen = new Set<string>();
    const notebooks = parsed.notebooks.filter((item): item is Notebook => {
      if (!item || typeof item !== "object") return false;
      const ok = typeof item.id === "string" && item.id.length > 0 && typeof item.name === "string" && isKind(item.kind) && !seen.has(item.id);
      if (ok) seen.add(item.id);
      return ok;
    }).map((item): Notebook => {
      const { source, ...rest } = item;
      return source && isFormat(source.format) ? { ...rest, source } : rest;
    });
    if (!seen.has(MAIN_NOTEBOOK_ID)) notebooks.unshift(createNotebookStore(now).notebooks[0]);
    const exports = Array.isArray(parsed.exports)
      ? parsed.exports.filter((item): item is ExportRecord => !!item && typeof item.id === "string" && isFormat(item.format) && Array.isArray(item.notebookIds)).slice(0, MAX_EXPORT_HISTORY)
      : [];
    const activeId = typeof parsed.activeId === "string" && seen.has(parsed.activeId) ? parsed.activeId : MAIN_NOTEBOOK_ID;
    return { store: { version: NOTEBOOK_STORE_VERSION, notebooks, exports, activeId }, status: "restored" };
  } catch {
    return { store: createNotebookStore(now), status: "corrupted" };
  }
}

/** Converte os cadernos em texto para o AsyncStorage. */
export function serializeNotebookStore(store: NotebookStore): string {
  return JSON.stringify(store);
}

/** Caderno de um avistamento (registros antigos ficam no Principal). */
export function notebookOf(sighting: Pick<Sighting, "notebookId">): string {
  return sighting.notebookId || MAIN_NOTEBOOK_ID;
}

/** Avistamentos de um caderno, ou de todos com `"all"`. */
export function sightingsIn<T extends Pick<Sighting, "notebookId">>(sightings: readonly T[], notebookId: string | "all"): T[] {
  return notebookId === "all" ? [...sightings] : sightings.filter((item) => notebookOf(item) === notebookId);
}

/** Quantidade de avistamentos por caderno. */
export function countByNotebook(sightings: readonly Pick<Sighting, "notebookId">[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of sightings) out[notebookOf(item)] = (out[notebookOf(item)] ?? 0) + 1;
  return out;
}

/** Normaliza e valida o nome de um caderno. Devolve a mensagem de erro, ou `null` se estiver tudo certo. */
export function validateNotebookName(store: NotebookStore, name: string, ignoreId?: string): string | null {
  const clean = name.trim().replace(/\s+/g, " ");
  if (!clean) return "Dê um nome ao caderno.";
  if (clean.length > MAX_NOTEBOOK_NAME) return `Use no máximo ${MAX_NOTEBOOK_NAME} caracteres.`;
  const lower = clean.toLocaleLowerCase("pt-BR");
  if (store.notebooks.some((item) => item.id !== ignoreId && item.name.toLocaleLowerCase("pt-BR") === lower)) return "Já existe um caderno com esse nome.";
  return null;
}

const slug = (name: string) => name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "caderno";

/** Gera um nome livre a partir de uma base ("Importado", "Importado (2)"…). */
export function uniqueNotebookName(store: NotebookStore, base: string): string {
  const clean = base.trim().slice(0, MAX_NOTEBOOK_NAME - 5) || "Caderno";
  if (!validateNotebookName(store, clean)) return clean;
  for (let i = 2; i < 1000; i += 1) {
    const candidate = `${clean} (${i})`;
    if (!validateNotebookName(store, candidate)) return candidate;
  }
  return `${clean} ${Date.now()}`;
}

/**
 * Cria um caderno.
 * @throws Error com a mensagem para a pessoa quando o nome não é válido.
 */
export function addNotebook(store: NotebookStore, name: string, kind: Exclude<NotebookKind, "main"> = "custom", now: Date = new Date(), source?: Notebook["source"]): { store: NotebookStore; notebook: Notebook } {
  const error = validateNotebookName(store, name);
  if (error) throw new Error(error);
  const clean = name.trim().replace(/\s+/g, " ");
  let id = `${slug(clean)}-${now.getTime().toString(36)}`;
  while (store.notebooks.some((item) => item.id === id)) id += "x";
  const at = now.toISOString();
  const notebook: Notebook = { id, name: clean, kind, createdAt: at, updatedAt: at, ...(source ? { source } : {}) };
  return { store: { ...store, notebooks: [...store.notebooks, notebook] }, notebook };
}

/**
 * Renomeia um caderno (o Principal não pode).
 * @throws Error se o caderno não existir, for o Principal ou o nome for inválido.
 */
export function renameNotebook(store: NotebookStore, id: string, name: string, now: Date = new Date()): NotebookStore {
  if (id === MAIN_NOTEBOOK_ID) throw new Error("O caderno Principal não pode ser renomeado.");
  if (!store.notebooks.some((item) => item.id === id)) throw new Error("Caderno não encontrado.");
  const error = validateNotebookName(store, name, id);
  if (error) throw new Error(error);
  const clean = name.trim().replace(/\s+/g, " ");
  return { ...store, notebooks: store.notebooks.map((item) => (item.id === id ? { ...item, name: clean, updatedAt: now.toISOString() } : item)) };
}

/**
 * Remove um caderno. Os registros dele vão para o Principal (`"move"`) ou são apagados (`"delete"`).
 * @throws Error se for o Principal ou não existir.
 */
export function removeNotebook<T extends Sighting>(store: NotebookStore, sightings: readonly T[], id: string, mode: "move" | "delete"): { store: NotebookStore; sightings: T[]; affected: number } {
  if (id === MAIN_NOTEBOOK_ID) throw new Error("O caderno Principal não pode ser apagado.");
  if (!store.notebooks.some((item) => item.id === id)) throw new Error("Caderno não encontrado.");
  const affected = sightings.filter((item) => notebookOf(item) === id).length;
  const next = mode === "delete"
    ? sightings.filter((item) => notebookOf(item) !== id)
    : sightings.map((item) => (notebookOf(item) === id ? { ...item, notebookId: undefined } : item));
  return {
    store: { ...store, notebooks: store.notebooks.filter((item) => item.id !== id), activeId: store.activeId === id ? MAIN_NOTEBOOK_ID : store.activeId },
    sightings: next,
    affected,
  };
}

/** Define o caderno onde os novos avistamentos entram. */
export function setActiveNotebook(store: NotebookStore, id: string): NotebookStore {
  return store.notebooks.some((item) => item.id === id) ? { ...store, activeId: id } : store;
}

/** Chave usada para reconhecer o mesmo avistamento em cadernos diferentes. */
export function duplicateKey(sighting: Sighting): string {
  const lat = sighting.latitude === undefined ? "" : sighting.latitude.toFixed(4);
  const lon = sighting.longitude === undefined ? "" : sighting.longitude.toFixed(4);
  return [sighting.speciesId, sighting.date, sighting.time ?? "", lat, lon].join("|");
}

/**
 * Junta cadernos: move os registros das origens para o destino.
 * Com `removeDuplicates`, registros repetidos no destino ficam só na versão mais recente.
 */
export function mergeNotebooks<T extends Sighting>(sightings: readonly T[], sourceIds: readonly string[], targetId: string, removeDuplicates = true): { sightings: T[]; moved: number; duplicatesRemoved: number } {
  const sources = new Set(sourceIds.filter((id) => id !== targetId));
  let moved = 0;
  const reassigned = sightings.map((item) => {
    if (!sources.has(notebookOf(item))) return item;
    moved += 1;
    return { ...item, notebookId: targetId === MAIN_NOTEBOOK_ID ? undefined : targetId };
  });
  if (!removeDuplicates) return { sightings: reassigned, moved, duplicatesRemoved: 0 };
  const newest = new Map<string, T>();
  for (const item of reassigned) {
    if (notebookOf(item) !== targetId) continue;
    const key = duplicateKey(item);
    const previous = newest.get(key);
    if (!previous || new Date(item.updatedAt).getTime() > new Date(previous.updatedAt).getTime()) newest.set(key, item);
  }
  const keep = new Set(Array.from(newest.values()).map((item) => item.id));
  const result = reassigned.filter((item) => notebookOf(item) !== targetId || keep.has(item.id));
  return { sightings: result, moved, duplicatesRemoved: reassigned.length - result.length };
}

/** Coloca os avistamentos importados dentro de um caderno. */
export function assignNotebook<T extends Sighting>(sightings: readonly T[], notebookId: string): T[] {
  return sightings.map((item) => ({ ...item, notebookId: notebookId === MAIN_NOTEBOOK_ID ? undefined : notebookId }));
}

/** Registra uma exportação no histórico (as mais recentes primeiro). */
export function recordExport(store: NotebookStore, notebookIds: readonly string[], format: NotebookFileFormat, count: number, now: Date = new Date()): NotebookStore {
  const names = notebookIds.map((id) => store.notebooks.find((item) => item.id === id)?.name ?? id);
  const entry: ExportRecord = { id: `exp-${now.getTime().toString(36)}`, notebookIds: [...notebookIds], notebookNames: names, format, count, exportedAt: now.toISOString() };
  return { ...store, exports: [entry, ...store.exports].slice(0, MAX_EXPORT_HISTORY) };
}

const TEST_SAMPLES: { speciesId: string; daysAgo: number; time: string; lat: number; lon: number; place: string; quantity: number; notes: string }[] = [
  { speciesId: "tuiuiu", daysAgo: 0, time: "07:40", lat: -16.4128, lon: -56.4214, place: "Transpantaneira, km 17", quantity: 2, notes: "Casal no ninho, sobre um piúval." },
  { speciesId: "onca-pintada", daysAgo: 1, time: "06:15", lat: -17.3389, lon: -56.7472, place: "Porto Jofre, Rio Cuiabá", quantity: 1, notes: "Macho descansando na barranca." },
  { speciesId: "jacare-do-pantanal", daysAgo: 2, time: "15:20", lat: -16.5631, lon: -56.7402, place: "Transpantaneira, ponte de madeira", quantity: 12, notes: "Grupo tomando sol na lagoa." },
  { speciesId: "capivara", daysAgo: 3, time: "17:05", lat: -16.0703, lon: -57.6810, place: "Cáceres, Rio Paraguai", quantity: 6, notes: "Família com filhotes na margem." },
  { speciesId: "arara-azul", daysAgo: 5, time: "08:30", lat: -19.5793, lon: -56.2446, place: "Nhecolândia", quantity: 3, notes: "Comendo frutos de acuri." },
  { speciesId: "ariranha", daysAgo: 7, time: "10:10", lat: -17.8540, lon: -57.4500, place: "Rio Paraguai", quantity: 4, notes: "Grupo pescando e vocalizando." },
];

/**
 * Avistamentos de exemplo para o caderno Teste: animais conhecidos, em pontos do Pantanal,
 * nos últimos dias. Ficam privados, não entram na coleção nem no limite diário.
 */
export function createTestSightings(now: Date = new Date()): Sighting[] {
  return TEST_SAMPLES.map((sample, index) => {
    const day = new Date(now.getTime() - sample.daysAgo * 86400000);
    const date = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    const at = new Date(now.getTime() - (TEST_SAMPLES.length - index) * 1000).toISOString();
    return {
      id: `teste-${index + 1}`,
      speciesId: sample.speciesId,
      date,
      time: sample.time,
      locationLabel: sample.place,
      latitude: sample.lat,
      longitude: sample.lon,
      locationPrecision: "exact",
      quantity: sample.quantity,
      notes: `[TESTE] ${sample.notes}`,
      visibility: "private",
      createdAt: at,
      updatedAt: at,
      notebookId: TEST_NOTEBOOK_ID,
    };
  });
}

/** Indica se o avistamento é de exemplo (caderno Teste) e deve ficar fora da coleção. */
export function isTestSighting(sighting: Pick<Sighting, "notebookId">): boolean {
  return sighting.notebookId === TEST_NOTEBOOK_ID;
}
