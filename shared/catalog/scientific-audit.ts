import type { Species } from "../pantanal";
import { validateSpeciesRecords } from "./types";

export const scientificRequiredFields: (keyof Species)[] = [
  "id", "commonName", "scientificName", "description", "physicalCharacteristics",
  "habitat", "behavior", "diet", "distribution", "ecologicalImportance",
];

export type ScientificCatalogAudit = {
  records: number;
  uniqueIds: number;
  duplicateIds: string[];
  missingFields: Record<string, number>;
  errors: string[];
  status: "PASS" | "FAIL";
};

export function createScientificCatalogAudit(records: readonly Species[]): ScientificCatalogAudit {
  const ids = records.map((record) => record.id);
  const seen = new Set<string>();
  const duplicateIds = [...new Set(ids.filter((id) => seen.has(id) || !seen.add(id)))];
  const missingFields = Object.fromEntries(scientificRequiredFields.map((field) => [field, records.filter((record) => typeof record[field] !== "string" || !String(record[field]).trim()).length]));
  const errors = validateSpeciesRecords([...records]);
  return { records: records.length, uniqueIds: seen.size, duplicateIds, missingFields, errors, status: errors.length ? "FAIL" : "PASS" };
}
