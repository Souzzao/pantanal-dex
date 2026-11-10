import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Ellipse, Line, Path, Rect } from "react-native-svg";
import boundary from "@/shared/geography/pantanal-ibge-2025.json";
import world from "@/shared/geography/world-land-110m.json";
import { createMapViewport, MIN_MAP_ZOOM, PANTANAL_CENTER, projectMapPoint, unprojectMapPoint, type GeoPoint } from "@/shared/map-projection";
import { useColors } from "@/hooks/use-colors";

export type MapSightingPoint = GeoPoint & { id: string; label: string };
const worldLand = (world as { rings: number[][][] }).rings.map(ring => ring.map(([lon, lat], index) => `${index ? "L" : "M"}${lon},${-lat}`).join("") + "Z").join("");
const outline = boundary.geometry.coordinates.map(ring => ring.map(([lon, lat], index) => `${index ? "L" : "M"}${lon},${-lat}`).join("") + "Z").join("");

/** Regional offline map rendered from the official biome boundary. */
export function PantanalMap({ points = [], selected, onSelect, onOpenPoint }: { points?: MapSightingPoint[]; selected?: GeoPoint; onSelect?: (point: GeoPoint) => void; onOpenPoint?: (id: string) => void }) {
  const colors = useColors();
  const [size, setSize] = useState({ width: 320, height: 300 });
  const [center, setCenter] = useState<GeoPoint>(selected ?? PANTANAL_CENTER);
  const [zoom, setZoom] = useState(selected ? 4 : 1);
  const view = useMemo(() => createMapViewport(size.width, size.height, center, zoom), [size, center, zoom]);
  const lonSpan = view.east - view.west;
  const latSpan = view.north - view.south;
  const control = (label: string, action: () => void, accessibilityLabel = label) => <Pressable onPress={action} accessibilityRole="button" accessibilityLabel={accessibilityLabel} style={{ minWidth: 42, minHeight: 42, padding: 10, borderRadius: 10, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, alignItems: "center", justifyContent: "center" }}><Text style={{ color: colors.primary, fontWeight: "800" }}>{label}</Text></Pressable>;
  const move = (dx: number, dy: number) => setCenter(c => ({ longitude: c.longitude + dx * lonSpan, latitude: c.latitude + dy * latSpan }));
  return <View>
    <Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 8 }}>Mapa offline (contorno do Pantanal em destaque)</Text>
    <Pressable accessibilityRole="button" accessibilityLabel={onSelect ? "Toque no mapa para escolher a localização do avistamento" : "Mapa dos seus avistamentos"} onLayout={event => { const { width, height } = event.nativeEvent.layout; if (width && height) setSize({ width, height }); }} onPress={event => {
      const { locationX: x, locationY: y } = event.nativeEvent;
      if (onSelect) { onSelect(unprojectMapPoint(x, y, view, size.width, size.height)); return; }
      const nearest = points.map(point => ({ point, distance: Math.hypot(projectMapPoint(point, view, size.width, size.height).x - x, projectMapPoint(point, view, size.width, size.height).y - y) })).sort((a, b) => a.distance - b.distance)[0];
      if (nearest && nearest.distance <= 24) onOpenPoint?.(nearest.point.id);
    }} style={{ height: 300, overflow: "hidden", borderRadius: 14, borderWidth: 1, borderColor: colors.border }}>
      <View pointerEvents="none" style={{ flex: 1 }}>
        <Svg width="100%" height="100%" viewBox={`${view.west} ${-view.north} ${lonSpan} ${latSpan}`} preserveAspectRatio="none">
          <Rect x={view.west} y={-view.north} width={lonSpan} height={latSpan} fill="#e4eff0" />
          {Array.from({ length: 5 }, (_, i) => <Line key={`v${i}`} x1={view.west + lonSpan * (i + 1) / 6} y1={-view.north} x2={view.west + lonSpan * (i + 1) / 6} y2={-view.south} stroke="#cadbda" strokeWidth={lonSpan / size.width} />)}
          {Array.from({ length: 5 }, (_, i) => <Line key={`h${i}`} x1={view.west} y1={-view.north + latSpan * (i + 1) / 6} x2={view.east} y2={-view.north + latSpan * (i + 1) / 6} stroke="#cadbda" strokeWidth={latSpan / size.height} />)}
          <Path d={worldLand} fill="#e9e4d4" stroke="#b9b29a" strokeWidth={lonSpan / size.width} />
          <Path d={outline} fill="#b5d7a8" stroke="#497b5d" strokeWidth={lonSpan / size.width * 1.5} fillRule="evenodd" />
          {points.map(point => <Ellipse key={point.id} cx={point.longitude} cy={-point.latitude} rx={lonSpan / size.width * 7} ry={latSpan / size.height * 7} fill="#195946" stroke="#fff" strokeWidth={lonSpan / size.width * 2} />)}
          {selected && <Ellipse cx={selected.longitude} cy={-selected.latitude} rx={lonSpan / size.width * 9} ry={latSpan / size.height * 9} fill="#ca6137" stroke="#fff" strokeWidth={lonSpan / size.width * 2} />}
        </Svg>
      </View>
    </Pressable>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {control("+", () => setZoom(z => Math.min(32, z * 2)), "Ampliar mapa")}
      {control("−", () => setZoom(z => Math.max(MIN_MAP_ZOOM, z / 2)), "Reduzir mapa")}
      {control("←", () => move(-0.3, 0), "Mover mapa para oeste")}
      {control("↑", () => move(0, 0.3), "Mover mapa para norte")}
      {control("↓", () => move(0, -0.3), "Mover mapa para sul")}
      {control("→", () => move(0.3, 0), "Mover mapa para leste")}
      {control("Enquadrar", () => { setCenter(PANTANAL_CENTER); setZoom(1); })}
      {selected && control("Ver ponto", () => setCenter(selected))}
    </View>
    <Text style={{ color: colors.muted, fontSize: 11, marginTop: 8 }}>Contorno do bioma brasileiro · IBGE 2025 · N ↑{onSelect ? " · toque para marcar" : ""}</Text>
  </View>;
}
