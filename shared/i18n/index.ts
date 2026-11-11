import pt from './ui-pt.json';
import en from './ui-en.json';
import es from './ui-es.json';
import de from './ui-de.json';
import { extraMessages } from './extras';

export type Locale = 'pt' | 'en' | 'es' | 'de';
export const localeFor = (language: string): Locale => /^(en|English)/i.test(language) ? 'en' : /^(es|Español)/i.test(language) ? 'es' : /^(de|Deutsch|Alemão)/i.test(language) ? 'de' : 'pt';
let activeLocale: Locale = 'pt';
export const setActiveLocale = (locale: Locale) => { activeLocale = locale; };
export const getActiveLocale = () => activeLocale;
const messages: Record<Locale, Record<string, string>> = { pt, en, es, de };
for (const [source, values] of Object.entries(extraMessages)) {
  messages.pt[source] = source;
  for (const locale of ['en', 'es', 'de'] as const) messages[locale][source] = values[locale];
}
const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const aliases = new Map<string, string>();
const patterns: { regex: RegExp; source: string; order: number[] }[] = [];
for (const source of Object.keys(messages.pt)) {
  for (const locale of ['pt', 'en', 'es', 'de'] as const) {
    const phrase = messages[locale][source] ?? source;
    aliases.set(phrase, source);
    const tokens = [...phrase.matchAll(/\{(\d+)\}/g)];
    if (tokens.length && phrase.replace(/\{\d+\}/g, '').replace(/[^\p{L}]/gu, '').length > 2) {
      let cursor = 0;
      let regex = '^';
      for (const token of tokens) { regex += escape(phrase.slice(cursor, token.index)) + '(.+?)'; cursor = token.index! + token[0].length; }
      regex += escape(phrase.slice(cursor)) + '$';
      patterns.push({ regex: new RegExp(regex), source, order: tokens.map(token => Number(token[1])) });
    }
  }
}
patterns.sort((a, b) => b.source.length - a.source.length);

/** Bundled dictionaries only. Never sends UI text or user notes to a translation service. */
export function translateUi(input: string, locale: Locale = activeLocale): string {
  if (!input || /^\s*[\d.,/%:+−–—↑↓←→✓✨🔎📓🧭🌿]+\s*$/.test(input)) return input;
  // Preserve language autonyms and scientific names/unknown user text.
  if (['Português', 'English', 'Español', 'Deutsch'].includes(input)) return input;
  const source = aliases.get(input) ?? aliases.get(input.trim());
  if (source) {
    const value = messages[locale][source] ?? source;
    return input.trim() === input ? value : input.replace(input.trim(), value);
  }
  const count = /^(\d[\d.,/% -]*\s)(.+)$/.exec(input);
  if (count && aliases.has(count[2].trim())) return count[1] + translateUiPart(count[2], locale);
  for (const pattern of patterns) {
    const match = pattern.regex.exec(input);
    if (!match) continue;
    const values = new Map<number, string>();
    pattern.order.forEach((key, index) => values.set(key, match[index + 1]));
    return (messages[locale][pattern.source] ?? pattern.source).replace(/\{(\d+)\}/g, (token, index) => values.get(Number(index)) ?? token);
  }
  if (/[·\n]/.test(input)) return input.split(/([·\n])/).map(part => /[·\n]/.test(part) ? part : translateUiPart(part, locale)).join('');
  return input;
}
function translateUiPart(input: string, locale: Locale): string {
  const source = aliases.get(input.trim());
  return source ? input.replace(input.trim(), messages[locale][source] ?? source) : input;
}
