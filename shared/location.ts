/** Public coordinates are rounded to the center of a 0.1° grid cell (~11 km). */
export const PUBLIC_LOCATION_GRID_DEGREES = 0.1;

export function roundToPublicLocationGrid(value: number): number {
  return Math.round(value / PUBLIC_LOCATION_GRID_DEGREES) * PUBLIC_LOCATION_GRID_DEGREES;
}
