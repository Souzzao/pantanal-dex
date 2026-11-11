import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { filterSpeciesCatalog, localizedSpeciesCatalog } from '../shared/catalog';
import { getTranslatedSpecies } from '../shared/i18n/catalog-translations';
import { translateUi, localeFor } from '../shared/i18n';
import manifest from '../assets/images/species/manifest.json';
import en from '../shared/i18n/catalog-en.json';
import es from '../shared/i18n/catalog-es.json';
import de from '../shared/i18n/catalog-de.json';

describe('bundled offline photographs', () => {
  it('covers every catalog ID with a genuine, attributed, hash-verified JPEG', () => {
    const catalog = filterSpeciesCatalog();
    expect(manifest).toHaveLength(catalog.length);
    for (const animal of catalog) {
      const photo = manifest.find(item => item.speciesId === animal.id)!;
      expect(photo, animal.id).toBeDefined();
      expect(photo.author).toBeTruthy();
      expect(photo.license).toMatch(/CC|Public|Dom/i);
      expect(photo.sourceUrl).toMatch(/^https:\/\//);
      const file = join('assets/images/species', photo.file);
      expect(existsSync(file), animal.id).toBe(true);
      const bytes = readFileSync(file);
      expect([...bytes.subarray(0, 3)]).toEqual([255, 216, 255]);
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(photo.sha256);
      expect(animal.images[0].sourceUrl).toBe(photo.sourceUrl);
    }
  });
});

describe('offline translations', () => {
  it.each([['en', en], ['es', es], ['de', de]] as const)('covers all species and preserves identifiers and scientific names in %s', (locale, entries) => {
    const catalog = filterSpeciesCatalog();
    expect(Object.keys(entries).sort()).toEqual(catalog.map(animal => animal.id).sort());
    for (const animal of catalog) {
      const translated = getTranslatedSpecies(animal, locale);
      expect(translated.id).toBe(animal.id);
      expect(translated.scientificName).toBe(animal.scientificName);
      expect(translated.images).toEqual(animal.images);
      expect(translated.description.length).toBeGreaterThan(10);
      expect(translated.curiosities).toHaveLength(animal.curiosities.length);
    }
  });
  it('translates titles, dynamic counts and accepts German settings', () => {
    expect(localeFor('Deutsch')).toBe('de');
    expect(translateUi('Animais', 'en')).toBe('Animals');
    expect(translateUi('Animais', 'de')).toBe('Tiere');
    expect(translateUi('Configurações', 'es')).not.toBe('Configurações');
    expect(translateUi('102 espécies locais', 'de')).not.toBe('102 espécies locais');
    expect(translateUi('4/102 animais com fotografia disponível offline.', 'en')).toContain('4/102');
    expect(translateUi('A user note not present in the dictionaries', 'de')).toBe('A user note not present in the dictionaries');
  });
  it('searches translated and original names without changing group filter IDs', () => {
    const german = localizedSpeciesCatalog('de');
    const jaguar = german.find(animal => animal.scientificName === 'Panthera onca')!;
    expect(localizedSpeciesCatalog('de', {query: jaguar.commonName}).some(animal => animal.id === jaguar.id)).toBe(true);
    expect(localizedSpeciesCatalog('de', {query: 'onça-pintada'}).some(animal => animal.id === jaguar.id)).toBe(true);
    expect(localizedSpeciesCatalog('de', {group: 'Aves'}).every(animal => animal.group === 'Aves')).toBe(true);
  });
});
