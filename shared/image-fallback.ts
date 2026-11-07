function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, entry]) => [key, stableValue(entry)]));
  return value;
}

export function buildImageFallbackPlan(source: unknown, alternatives: readonly unknown[] = []) {
  const entries = [source, ...alternatives].flatMap(entry => Array.isArray(entry) ? entry : [entry]);
  const seen = new Set<string>();
  const candidates: unknown[] = [];
  const keys: string[] = [];
  for (const entry of entries) {
    if (!(typeof entry === "number" && Number.isFinite(entry) && entry > 0) &&
      !(entry && typeof entry === "object" && "uri" in entry && typeof entry.uri === "string" && entry.uri.trim())) continue;
    const key = JSON.stringify(stableValue(entry));
    if (seen.has(key)) continue;
    seen.add(key); keys.push(key); candidates.push(entry);
  }
  return { key: JSON.stringify(keys), candidates };
}
