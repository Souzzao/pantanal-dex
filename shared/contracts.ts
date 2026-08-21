import type { Environment, Species, SpeciesGroup, Sighting } from "./pantanal";

export type Settings = {
  defaultLanguage: string;
  quickLanguages: string[];
};

export type CatalogFilters = {
  query?: string;
  group?: SpeciesGroup;
  environment?: Environment;
};

export type ExportEnvelope = {
  version: string;
  exportedAt: string;
  sightings: Sighting[];
};

export type { Environment, Species, SpeciesGroup, Sighting };
