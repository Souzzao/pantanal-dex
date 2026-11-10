import { PANTANAL_BOUNDS } from "./pantanal-boundary";

export type GeoPoint = { latitude: number; longitude: number };
export type MapViewport = { west: number; east: number; north: number; south: number };
export const PANTANAL_CENTER: GeoPoint = { latitude: (PANTANAL_BOUNDS.north + PANTANAL_BOUNDS.south) / 2, longitude: (PANTANAL_BOUNDS.west + PANTANAL_BOUNDS.east) / 2 };

export const MIN_MAP_ZOOM = 1 / 64;

export function createMapViewport(width: number, height: number, center = PANTANAL_CENTER, zoom = 1): MapViewport {
  const ratio = Math.max(1, width) / Math.max(1, height);
  const cosine = Math.cos(PANTANAL_CENTER.latitude * Math.PI / 180);
  let lonSpan = (PANTANAL_BOUNDS.east - PANTANAL_BOUNDS.west) * 1.12;
  let latSpan = (PANTANAL_BOUNDS.north - PANTANAL_BOUNDS.south) * 1.12;
  if (lonSpan * cosine / latSpan < ratio) lonSpan = latSpan * ratio / cosine;
  else latSpan = lonSpan * cosine / ratio;
  // Zoom abaixo de 1 afasta além do Pantanal, até o mundo inteiro (o app aceita registros de qualquer lugar).
  const safeZoom = Math.max(MIN_MAP_ZOOM, Math.min(32, Number.isFinite(zoom) ? zoom : 1));
  lonSpan /= safeZoom; latSpan /= safeZoom;
  return { west: center.longitude - lonSpan / 2, east: center.longitude + lonSpan / 2, north: center.latitude + latSpan / 2, south: center.latitude - latSpan / 2 };
}

export function projectMapPoint(point: GeoPoint, view: MapViewport, width: number, height: number) {
  return { x: (point.longitude - view.west) / (view.east - view.west) * width, y: (view.north - point.latitude) / (view.north - view.south) * height };
}

export function unprojectMapPoint(x: number, y: number, view: MapViewport, width: number, height: number): GeoPoint {
  return { longitude: view.west + x / Math.max(1, width) * (view.east - view.west), latitude: view.north - y / Math.max(1, height) * (view.north - view.south) };
}
