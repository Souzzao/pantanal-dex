import { describe, expect, it } from "vitest";

import { isInsidePantanal, PANTANAL_BOUNDARY_METADATA, PANTANAL_BOUNDS } from "../shared/pantanal-boundary";

describe("official Brazilian Pantanal boundary", () => {
  it.each([
    [-17.36, -56.77],
    [-19, -56.5],
    [-21, -57.5],
    [-16.7, -57.7],
  ])("accepts field coordinates within the north, central and south biome: %s, %s", (latitude, longitude) => {
    expect(isInsidePantanal(latitude, longitude)).toBe(true);
  });

  it.each([
    [-15.6, -56.1], // North of the biome, near Cuiabá.
    [-20.47, -54.62], // East of the biome, near Campo Grande.
    [-16, -59], // Inside the bounding rectangle, outside the actual outline.
    [-20, -55], // Inside the bounding rectangle, outside its eastern edge.
    [-21, -59], // Inside the bounding rectangle, outside its western edge.
    [0, 0],
  ])("rejects coordinates outside the polygon: %s, %s", (latitude, longitude) => {
    expect(isInsidePantanal(latitude, longitude)).toBe(false);
  });

  it("uses the polygon rather than accepting its entire bounding rectangle", () => {
    expect(-59).toBeGreaterThan(PANTANAL_BOUNDS.west);
    expect(-59).toBeLessThan(PANTANAL_BOUNDS.east);
    expect(-16).toBeGreaterThan(PANTANAL_BOUNDS.south);
    expect(-16).toBeLessThan(PANTANAL_BOUNDS.north);
    expect(isInsidePantanal(-16, -59)).toBe(false);
  });

  it("includes an official boundary vertex and a point along an official segment", () => {
    expect(isInsidePantanal(-15.647264, -57.788851)).toBe(true);
    expect(isInsidePantanal(-17.5073845, -57.81956)).toBe(true);
  });

  it("distinguishes points on opposite sides of a mapped boundary segment", () => {
    expect(isInsidePantanal(-17.5063845, -57.81856)).toBe(true);
    expect(isInsidePantanal(-17.5083845, -57.82056)).toBe(false);
  });

  it.each([
    [Number.NaN, -56],
    [-17, Number.NaN],
    [Number.POSITIVE_INFINITY, -56],
    [-17, Number.NEGATIVE_INFINITY],
    [91, -56],
    [-17, -181],
  ])("rejects invalid geographic coordinates: %s, %s", (latitude, longitude) => {
    expect(isInsidePantanal(latitude, longitude)).toBe(false);
  });

  it("expects latitude first and reports the pinned data provenance", () => {
    expect(isInsidePantanal(-56.77, -17.36)).toBe(false);
    expect(PANTANAL_BOUNDARY_METADATA.publisher).toBe("IBGE");
    expect(PANTANAL_BOUNDARY_METADATA.edition).toBe(2025);
    expect(PANTANAL_BOUNDARY_METADATA.vertexCount).toBe(32918);
  });
});
