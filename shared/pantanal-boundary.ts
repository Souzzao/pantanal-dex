import pantanal from "./geography/pantanal-ibge-2025.json";

/** This boundary covers the Brazilian Pantanal biome, rather than the whole river basin. */
export const PANTANAL_BOUNDARY_METADATA = Object.freeze({
  publisher: "IBGE",
  edition: 2025,
  scale: "1:250.000",
  coordinateReferenceSystem: "SIRGAS 2000 (EPSG:4674)",
  sourceUrl: "https://geoftp.ibge.gov.br/informacoes_ambientais/estudos_ambientais/biomas/vetores/2025_Biomas-e-Sistema-Costeiro-Marinho-do-Brasil-1-250000_shp.zip",
  featureCode: "6",
  vertexCount: 32918,
});

export const PANTANAL_BOUNDS = Object.freeze({
  west: pantanal.bbox[0],
  south: pantanal.bbox[1],
  east: pantanal.bbox[2],
  north: pantanal.bbox[3],
});

// Numerical tolerance only: this is not a GPS-accuracy buffer around the biome.
const EDGE_EPSILON_DEGREES = 1e-9;

function isOnSegment(longitude: number, latitude: number, start: number[], end: number[]): boolean {
  if (longitude < Math.min(start[0], end[0]) - EDGE_EPSILON_DEGREES ||
      longitude > Math.max(start[0], end[0]) + EDGE_EPSILON_DEGREES ||
      latitude < Math.min(start[1], end[1]) - EDGE_EPSILON_DEGREES ||
      latitude > Math.max(start[1], end[1]) + EDGE_EPSILON_DEGREES) return false;

  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.hypot(dx, dy);
  if (length === 0) return Math.hypot(longitude - start[0], latitude - start[1]) <= EDGE_EPSILON_DEGREES;
  const crossProduct = (longitude - start[0]) * dy - (latitude - start[1]) * dx;
  return Math.abs(crossProduct) <= EDGE_EPSILON_DEGREES * length;
}

/**
 * Offline point-in-polygon check against the official IBGE 2025 Pantanal feature.
 * Latitude comes first; GeoJSON stores each vertex as [longitude, latitude].
 * A point exactly on the mapped boundary is included. Invalid inputs are rejected.
 * The source is regional (1:250,000), so this is not a survey-precision geofence.
 */
export function isInsidePantanal(latitude: number, longitude: number): boolean {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return false;
  if (longitude < PANTANAL_BOUNDS.west - EDGE_EPSILON_DEGREES ||
      longitude > PANTANAL_BOUNDS.east + EDGE_EPSILON_DEGREES ||
      latitude < PANTANAL_BOUNDS.south - EDGE_EPSILON_DEGREES ||
      latitude > PANTANAL_BOUNDS.north + EDGE_EPSILON_DEGREES) return false;

  let inside = false;
  for (const ring of pantanal.geometry.coordinates) {
    for (let index = 1; index < ring.length; index += 1) {
      const start = ring[index - 1];
      const end = ring[index];
      if (isOnSegment(longitude, latitude, start, end)) return true;
      if ((start[1] > latitude) !== (end[1] > latitude) &&
          longitude < start[0] + (end[0] - start[0]) * (latitude - start[1]) / (end[1] - start[1])) {
        inside = !inside;
      }
    }
  }
  return inside;
}
