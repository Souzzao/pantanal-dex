import { describe, expect, it } from "vitest";
import { createMapViewport, projectMapPoint, unprojectMapPoint, PANTANAL_CENTER } from "../shared/map-projection";
import { PANTANAL_BOUNDS } from "../shared/pantanal-boundary";

describe("offline Pantanal map coordinates", () => {
  it("frames the entire biome in portrait and landscape", () => {
    for (const [width, height] of [[320, 500], [800, 300]]) {
      const view = createMapViewport(width, height);
      expect(view.west).toBeLessThan(PANTANAL_BOUNDS.west);
      expect(view.east).toBeGreaterThan(PANTANAL_BOUNDS.east);
      expect(view.south).toBeLessThan(PANTANAL_BOUNDS.south);
      expect(view.north).toBeGreaterThan(PANTANAL_BOUNDS.north);
    }
  });
  it("converts a tapped point back to its geographic coordinates at different zoom levels", () => {
    for (const zoom of [1, 2, 8, 32]) {
      const view = createMapViewport(360, 300, PANTANAL_CENTER, zoom);
      const pixel = projectMapPoint(PANTANAL_CENTER, view, 360, 300);
      expect(pixel.x).toBeCloseTo(180);
      expect(pixel.y).toBeCloseTo(150);
      const point = unprojectMapPoint(pixel.x + 30, pixel.y - 20, view, 360, 300);
      const roundTrip = projectMapPoint(point, view, 360, 300);
      expect(roundTrip.x).toBeCloseTo(pixel.x + 30);
      expect(roundTrip.y).toBeCloseTo(pixel.y - 20);
    }
  });
});
