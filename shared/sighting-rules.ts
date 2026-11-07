import { filterSpeciesCatalog } from "./catalog";
import { getLocalTodayISODate, isValidSightingTime, UNKNOWN_SPECIES_ID, type Sighting } from "./pantanal";

export const DAILY_SIGHTING_CREATION_LIMIT = 30;
export const MAX_SIGHTING_NOTES_LENGTH = 500;
export const SIGHTING_CREATION_LEDGER_VERSION = 1;

const knownSpeciesIds = new Set(filterSpeciesCatalog().map((item) => item.id));
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Separate from the notebook so deleting an observation does not release its daily slot. */
export type SightingCreationLedger = {
  version: typeof SIGHTING_CREATION_LEDGER_VERSION;
  days: Record<string, string[]>;
};

export type SightingLedgerRestoreStatus = "empty" | "restored" | "corrupted" | "unsupported-version";
export type SightingLedgerRestoreResult = {
  ledger: SightingCreationLedger;
  status: SightingLedgerRestoreStatus;
};

export type SightingDraft = Pick<Sighting, "speciesId" | "date"> & Partial<Pick<Sighting,
  "id" | "photoUri" | "time" | "latitude" | "longitude" | "notes" | "quantity"
>>;

export type SightingValidationCode =
  | "SPECIES_REQUIRED"
  | "SPECIES_UNKNOWN"
  | "PHOTO_REQUIRED"
  | "LOCATION_REQUIRED"
  | "LOCATION_INVALID"
  | "LOCATION_OUTSIDE_PANTANAL"
  | "LOCATION_CHECK_UNAVAILABLE"
  | "DATE_INVALID"
  | "DATE_FUTURE"
  | "TIME_INVALID"
  | "NOTES_TOO_LONG"
  | "QUANTITY_INVALID"
  | "DAILY_LIMIT_REACHED";

export type SightingValidationIssue = {
  field: "speciesId" | "photoUri" | "coordinates" | "date" | "time" | "notes" | "quantity" | "dailyLimit";
  code: SightingValidationCode;
  message: string;
};

export type SightingValidationOptions = {
  operation: "create" | "update";
  now: Date;
  ledger: SightingCreationLedger;
  isWithinArea: (latitude: number, longitude: number) => boolean;
};

function isCalendarDate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function localDay(now: Date): string {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) {
    throw new RangeError("Informe uma data válida do aparelho para verificar o limite diário.");
  }
  return getLocalTodayISODate(now);
}

function isLedgerId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value === value.trim();
}

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function parseLedger(value: unknown): SightingLedgerRestoreResult {
  const empty = createSightingCreationLedger();
  if (!isObject(value)) return { ledger: empty, status: "corrupted" };
  if (value.version !== SIGHTING_CREATION_LEDGER_VERSION) {
    return { ledger: empty, status: "unsupported-version" };
  }
  if (!isObject(value.days)) return { ledger: empty, status: "corrupted" };

  const days: Record<string, string[]> = {};
  const seenIds = new Set<string>();
  for (const day of Object.keys(value.days).sort()) {
    const ids = value.days[day];
    if (!isCalendarDate(day) || !Array.isArray(ids) || ids.some((id) => !isLedgerId(id))) {
      return { ledger: empty, status: "corrupted" };
    }
    days[day] = [];
    for (const id of ids as string[]) {
      if (!seenIds.has(id)) {
        days[day].push(id);
        seenIds.add(id);
      }
    }
  }
  return { ledger: { version: SIGHTING_CREATION_LEDGER_VERSION, days }, status: "restored" };
}

function assertLedger(ledger: SightingCreationLedger): SightingCreationLedger {
  const parsed = parseLedger(ledger);
  if (parsed.status !== "restored") throw new Error("O histórico de criações precisa ser restaurado antes de continuar.");
  return parsed.ledger;
}

export function createSightingCreationLedger(): SightingCreationLedger {
  return { version: SIGHTING_CREATION_LEDGER_VERSION, days: {} };
}

/** Invalid or unknown data is reported explicitly; callers must not treat it as an unused quota. */
export function restoreSightingCreationLedger(raw: string | null): SightingLedgerRestoreResult {
  if (raw === null || raw === "") return { ledger: createSightingCreationLedger(), status: "empty" };
  try {
    return parseLedger(JSON.parse(raw) as unknown);
  } catch {
    return { ledger: createSightingCreationLedger(), status: "corrupted" };
  }
}

export function serializeSightingCreationLedger(ledger: SightingCreationLedger): string {
  return JSON.stringify(assertLedger(ledger));
}

export function countSightingCreations(ledger: SightingCreationLedger, now: Date): number {
  return assertLedger(ledger).days[localDay(now)]?.length ?? 0;
}

function hasCreationId(ledger: SightingCreationLedger, id: string | undefined): boolean {
  return !!id && Object.values(ledger.days).some((ids) => ids.includes(id));
}

export class SightingDailyLimitError extends Error {
  readonly code = "DAILY_LIMIT_REACHED";

  constructor() {
    super("Você já criou 30 avistamentos hoje neste aparelho. Tente novamente amanhã.");
    this.name = "SightingDailyLimitError";
  }
}

/** Call only for a successful new creation; edits and imports must not call this function. */
export function recordSightingCreation(ledger: SightingCreationLedger, id: string, now: Date): SightingCreationLedger {
  if (!isLedgerId(id)) throw new Error("O registro precisa ter um identificador válido.");
  const safe = assertLedger(ledger);
  const day = localDay(now);
  if (hasCreationId(safe, id)) return safe;
  const ids = safe.days[day] ?? [];
  if (ids.length >= DAILY_SIGHTING_CREATION_LIMIT) throw new SightingDailyLimitError();
  return { ...safe, days: { ...safe.days, [day]: [...ids, id] } };
}

/** Applies to new writes only. Existing stored/imported records keep their legacy compatibility. */
export function validateSightingOperation(draft: SightingDraft, options: SightingValidationOptions): {
  valid: boolean;
  errors: SightingValidationIssue[];
} {
  const today = localDay(options.now);
  const errors: SightingValidationIssue[] = [];
  const add = (field: SightingValidationIssue["field"], code: SightingValidationCode, message: string) => {
    errors.push({ field, code, message });
  };

  if (typeof draft.speciesId !== "string" || !draft.speciesId.trim()) {
    add("speciesId", "SPECIES_REQUIRED", "Escolha uma espécie do catálogo.");
  } else if (draft.speciesId !== UNKNOWN_SPECIES_ID && !knownSpeciesIds.has(draft.speciesId)) {
    add("speciesId", "SPECIES_UNKNOWN", "A espécie selecionada não pertence ao catálogo. Escolha novamente.");
  }
  if (typeof draft.photoUri !== "string" || !draft.photoUri.trim()) {
    add("photoUri", "PHOTO_REQUIRED", "Adicione uma fotografia pela galeria ou pela câmera para salvar o avistamento.");
  }

  const { latitude, longitude } = draft;
  if (latitude === undefined || longitude === undefined) {
    add("coordinates", "LOCATION_REQUIRED", "Informe a localização do avistamento pelo GPS ou pelo mapa.");
  } else if (typeof latitude !== "number" || !Number.isFinite(latitude) || latitude < -90 || latitude > 90 ||
    typeof longitude !== "number" || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    add("coordinates", "LOCATION_INVALID", "As coordenadas informadas são inválidas. Escolha a localização novamente.");
  } else {
    try {
      if (options.isWithinArea(latitude, longitude) !== true) {
        add("coordinates", "LOCATION_OUTSIDE_PANTANAL", "Escolha um ponto dentro do bioma Pantanal para registrar o avistamento.");
      }
    } catch {
      add("coordinates", "LOCATION_CHECK_UNAVAILABLE", "Não foi possível conferir o limite do Pantanal. Tente selecionar o ponto novamente.");
    }
  }

  const date = typeof draft.date === "string" ? draft.date.trim() : draft.date;
  if (!isCalendarDate(date)) {
    add("date", "DATE_INVALID", "Informe uma data existente no formato AAAA-MM-DD.");
  } else if (date > today) {
    add("date", "DATE_FUTURE", "A data do avistamento não pode estar no futuro.");
  }
  if (draft.time !== undefined && (typeof draft.time !== "string" || !isValidSightingTime(draft.time.trim()))) {
    add("time", "TIME_INVALID", "Informe o horário no formato HH:MM, entre 00:00 e 23:59.");
  }
  if (draft.notes !== undefined && (typeof draft.notes !== "string" || draft.notes.length > MAX_SIGHTING_NOTES_LENGTH)) {
    add("notes", "NOTES_TOO_LONG", "As observações podem ter no máximo 500 caracteres.");
  }
  if (draft.quantity !== undefined && (typeof draft.quantity !== "number" || !Number.isInteger(draft.quantity) || draft.quantity < 1)) {
    add("quantity", "QUANTITY_INVALID", "Informe uma quantidade inteira maior que zero.");
  }

  if (options.operation === "create") {
    const ledger = assertLedger(options.ledger);
    if (!hasCreationId(ledger, draft.id) && (ledger.days[today]?.length ?? 0) >= DAILY_SIGHTING_CREATION_LIMIT) {
      add("dailyLimit", "DAILY_LIMIT_REACHED", "Você já criou 30 avistamentos hoje neste aparelho. Tente novamente amanhã.");
    }
  }
  return { valid: errors.length === 0, errors };
}
