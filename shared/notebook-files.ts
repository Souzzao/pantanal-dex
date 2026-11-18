/**
 * PantanalDex — Arquivos de cadernos: exporta um ou mais cadernos em JSON, CSV ou GeoJSON levando o
 * nome do caderno junto, e importa qualquer um desses três formatos de volta, reconhecendo o formato
 * pelo conteúdo.
 *
 * As regras de privacidade são as mesmas do backup comum (`toExportableSighting`): registros
 * compartilháveis saem com a posição arredondada.
 *
 * @author Felipe de Souza Aquino
 */
import { createExportJson, csvRowOf, EXPORT_CSV_HEADER, EXPORT_VERSION, toExportableSighting } from "./exports";
import { createExportGeoJsonObject } from "./geojson";
import { MAX_IMPORT_BYTES } from "./safe-url";
import { notebookOf, type Notebook, type NotebookFileFormat } from "./notebooks";
import { sanitizeStoredSightings, type Sighting, type Species } from "./pantanal";

/** Nome sugerido para o arquivo: pantanaldex-<caderno>-<data>.<formato>. */
export function notebookFileName(names: readonly string[], format: NotebookFileFormat, now: Date = new Date()): string {
  const base = (names.length === 1 ? names[0] : `${names.length}-cadernos`)
    .normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "caderno";
  return `pantanaldex-${base}-${now.toISOString().slice(0, 10)}.${format}`;
}

/** Gera o conteúdo do arquivo de exportação, com o nome do caderno de cada registro. */
export function exportNotebookFile(format: NotebookFileFormat, sightings: readonly Sighting[], notebooks: readonly Notebook[], catalog: readonly Species[], now: Date = new Date()): string {
  const nameOf = new Map(notebooks.map((item) => [item.id, item.name]));
  if (format === "json") {
    const envelope = JSON.parse(createExportJson([...sightings])) as Record<string, unknown>;
    const used = Array.from(new Set(sightings.map(notebookOf)));
    envelope.notebooks = used.map((id) => ({ id, name: nameOf.get(id) ?? id }));
    return JSON.stringify(envelope, null, 2);
  }
  if (format === "csv") {
    const rows = sightings.map((item) => `${csvRowOf(toExportableSighting(item))},"${(nameOf.get(notebookOf(item)) ?? "").replaceAll('"', '""')}"`);
    return [`${EXPORT_CSV_HEADER},notebook`, ...rows].join("\n");
  }
  const geo = createExportGeoJsonObject(sightings, catalog, now);
  const byId = new Map(sightings.map((item) => [item.id, item]));
  for (const feature of geo.features) {
    const original = byId.get(feature.id);
    const id = original ? notebookOf(original) : undefined;
    (feature.properties as Record<string, unknown>).notebook = id ? nameOf.get(id) ?? id : null;
  }
  return JSON.stringify(geo, null, 2);
}

export type ParsedNotebookFile = {
  format: NotebookFileFormat;
  sightings: Sighting[];
  /** Nomes de cadernos encontrados no arquivo (para recriar a separação ao importar). */
  notebookNames: string[];
  /** Nome do caderno de cada registro, pelo id do registro. */
  notebookByRecord: Record<string, string>;
  skipped: number;
};

/** Lê uma linha CSV respeitando aspas (RFC 4180). */
export function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { cells.push(cur); cur = ""; }
    else cur += ch;
  }
  cells.push(cur);
  return cells;
}

/** Divide o CSV em linhas sem quebrar quebras de linha que estão dentro de aspas. */
function splitCsvRows(text: string): string[] {
  const rows: string[] = [];
  let cur = "";
  let quoted = false;
  for (const ch of text.replace(/\r\n?/g, "\n")) {
    if (ch === '"') quoted = !quoted;
    if (ch === "\n" && !quoted) { rows.push(cur); cur = ""; } else cur += ch;
  }
  if (cur.trim()) rows.push(cur);
  return rows;
}

const unFormula = (value: string) => (/^'[=+\-@\t\r]/.test(value) ? value.slice(1) : value);
const optNumber = (value: string) => (value.trim() === "" ? undefined : Number(value));

function fromCsv(text: string, now: Date): ParsedNotebookFile {
  const rows = splitCsvRows(text.replace(/^﻿/, ""));
  const header = parseCsvLine(rows[0] ?? "").map((cell) => cell.trim());
  const expected = EXPORT_CSV_HEADER.split(",");
  if (!expected.every((column) => header.includes(column))) throw new Error("O CSV não tem as colunas do PantanalDex.");
  const at = now.toISOString();
  const raw: Sighting[] = [];
  const notebookByRecord: Record<string, string> = {};
  for (const line of rows.slice(1)) {
    if (!line.trim()) continue;
    const cells = parseCsvLine(line);
    const get = (column: string) => cells[header.indexOf(column)] ?? "";
    const id = get("id").trim();
    raw.push({
      id,
      speciesId: get("speciesId").trim(),
      date: get("date").trim(),
      time: get("time").trim() || undefined,
      locationLabel: unFormula(get("locationLabel")) || undefined,
      latitude: optNumber(get("latitude")),
      longitude: optNumber(get("longitude")),
      locationPrecision: (get("locationPrecision").trim() || "none") as Sighting["locationPrecision"],
      quantity: optNumber(get("quantity")),
      notes: unFormula(get("notes")) || undefined,
      visibility: (get("visibility").trim() || "private") as Sighting["visibility"],
      createdAt: at,
      updatedAt: at,
    });
    if (header.includes("notebook") && get("notebook").trim()) notebookByRecord[id] = get("notebook").trim();
  }
  return finish("csv", raw, notebookByRecord);
}

function fromGeoJson(parsed: { features?: unknown[] }, now: Date): ParsedNotebookFile {
  const at = now.toISOString();
  const raw: Sighting[] = [];
  const notebookByRecord: Record<string, string> = {};
  for (const feature of parsed.features ?? []) {
    const f = feature as { id?: unknown; geometry?: { type?: string; coordinates?: unknown[] }; properties?: Record<string, unknown> };
    const p = f.properties ?? {};
    const coords = f.geometry?.type === "Point" ? f.geometry.coordinates : undefined;
    const id = typeof f.id === "string" ? f.id : `geo-${raw.length + 1}-${now.getTime().toString(36)}`;
    raw.push({
      id,
      speciesId: typeof p.speciesId === "string" ? p.speciesId : "",
      date: typeof p.date === "string" ? p.date : "",
      time: typeof p.time === "string" ? p.time : undefined,
      locationLabel: typeof p.locationLabel === "string" ? p.locationLabel : undefined,
      longitude: Array.isArray(coords) && typeof coords[0] === "number" ? coords[0] : undefined,
      latitude: Array.isArray(coords) && typeof coords[1] === "number" ? coords[1] : undefined,
      locationPrecision: (typeof p.locationPrecision === "string" ? p.locationPrecision : "approximate") as Sighting["locationPrecision"],
      quantity: typeof p.quantity === "number" ? p.quantity : undefined,
      notes: typeof p.notes === "string" ? p.notes : undefined,
      visibility: (p.visibility === "shareable" ? "shareable" : "private"),
      createdAt: at,
      updatedAt: at,
    });
    if (typeof p.notebook === "string" && p.notebook.trim()) notebookByRecord[id] = p.notebook.trim();
  }
  return finish("geojson", raw, notebookByRecord);
}

function finish(format: NotebookFileFormat, raw: Sighting[], notebookByRecord: Record<string, string>): ParsedNotebookFile {
  const valid = sanitizeStoredSightings(raw.map(({ notebookId: _ignored, ...rest }) => rest));
  const keep = new Set(valid.map((item) => item.id));
  const byRecord = Object.fromEntries(Object.entries(notebookByRecord).filter(([id]) => keep.has(id)));
  return { format, sightings: valid, notebookNames: Array.from(new Set(Object.values(byRecord))), notebookByRecord: byRecord, skipped: raw.length - valid.length };
}

/**
 * Lê um arquivo exportado pelo PantanalDex em JSON, CSV ou GeoJSON.
 * @throws Error com a mensagem para a pessoa quando o formato não é reconhecido.
 */
export function parseNotebookFile(content: string, now: Date = new Date()): ParsedNotebookFile {
  if (content.length > MAX_IMPORT_BYTES) throw new Error("O arquivo é grande demais (limite de 5 MB).");
  const text = content.trim();
  if (text.startsWith("{")) {
    let parsed: Record<string, unknown>;
    try { parsed = JSON.parse(text) as Record<string, unknown>; } catch { throw new Error("O arquivo JSON está corrompido."); }
    if (parsed.type === "FeatureCollection") return fromGeoJson(parsed as { features?: unknown[] }, now);
    if (parsed.version !== EXPORT_VERSION || !Array.isArray(parsed.sightings)) throw new Error("Este JSON não é um caderno do PantanalDex.");
    const names = new Map(Array.isArray(parsed.notebooks)
      ? (parsed.notebooks as { id?: unknown; name?: unknown }[]).filter((n) => typeof n.id === "string" && typeof n.name === "string").map((n) => [n.id as string, n.name as string])
      : []);
    const raw = parsed.sightings as Sighting[];
    const notebookByRecord: Record<string, string> = {};
    for (const item of raw) {
      if (item && typeof item.id === "string" && typeof item.notebookId === "string" && names.has(item.notebookId)) notebookByRecord[item.id] = names.get(item.notebookId)!;
    }
    return finish("json", raw, notebookByRecord);
  }
  if (text.length > 0) return fromCsv(text, now);
  throw new Error("O arquivo está vazio.");
}
