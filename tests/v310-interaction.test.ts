import { URL } from "node:url";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ART_NAMES } from "../shared/art-names";
import { SPOT_ART } from "../shared/street-map-art";
import { buildPhotoGallery, photosOf } from "../shared/photo-gallery";
import { authorLabel, recordsOfSpecies, teamSpeciesIndex, type TeamRecord } from "../shared/team-records";
import type { Sighting } from "../shared/pantanal";

describe("interações 3.10", () => {
  it("mantém cada registro da mesma espécie com seu autor, descrição e fotos", () => {
    const base = { speciesId: "capivara", zone: null, authorAvatar: null, observedOn: "2026-11-25", createdAt: "2026-11-25", updatedAt: "2026-11-25" };
    const first: TeamRecord = { ...base, id: "a", number: 1, authorId: "joana", authorName: "Joana", description: "Na margem", photoPaths: ["a.jpg"] };
    const second: TeamRecord = { ...base, id: "b", number: 2, authorId: "rafael", authorName: "Rafael", description: "No rio", photoPaths: ["b.jpg"] };
    expect(teamSpeciesIndex([second, first])).toMatchObject([{ speciesId: "capivara", count: 2 }]);
    expect(recordsOfSpecies([second, first], "capivara")).toEqual([first, second]);
    expect([authorLabel(first), authorLabel(second)]).toEqual(["Registrado por Joana", "Registrado por Rafael"]);
  });

  it("mostra as fotos de cada registro, sem repetir a capa", () => {
    const sighting = { id: "a", speciesId: "capivara", date: "2026-11-25", photoUri: "file://capa", extraPhotoUris: ["file://capa", "file://outra"] } as Sighting;
    expect(photosOf(sighting)).toEqual(["file://capa", "file://outra"]);
    expect(buildPhotoGallery([sighting])).toMatchObject([{ sightingId: "a", index: 0 }, { sightingId: "a", index: 1 }]);
  });

  it("mantém as figuras do mapa iguais aos PNGs da interface", () => {
    const readIcon = (name: string) => readFileSync(new URL(`../assets/icons/${name}.png`, import.meta.url));
    for (const name of ART_NAMES) expect(readIcon(name).subarray(1, 4).toString()).toBe("PNG");
    for (const [name, base64] of Object.entries(SPOT_ART)) expect(readIcon(name).toString("base64")).toBe(base64);
  });
});