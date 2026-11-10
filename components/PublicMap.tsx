import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

import { useColors } from "@/hooks/use-colors";
import world from "@/shared/geography/world-land-110m.json";
import pantanal from "@/shared/geography/pantanal-ibge-2025.json";
import { clusterCellForSpan, clusterRecords, createWorldViewport, fitZoomToPoints, MAX_WORLD_ZOOM, type GeoPoint, type PublicRecord, type RecordCluster } from "@/shared/public-map";

type Ring = number[][];
const toPath = (rings: Ring[]) => rings.map((ring) => ring.map(([lon, lat], index) => `${index ? "L" : "M"}${lon},${-lat}`).join("") + "Z").join("");

// Calculados uma vez: contornos dos continentes (Natural Earth) e do bioma Pantanal (IBGE), como referência visual.
const WORLD_PATH = toPath((world as { rings: Ring[] }).rings);
const PANTANAL_PATH = toPath((pantanal as { geometry: { coordinates: Ring[] } }).geometry.coordinates);

export type PublicMapLabels = {
  zoomIn: string; zoomOut: string; west: string; north: string; south: string; east: string; fit: string; world: string;
  cluster: (cluster: RecordCluster) => string;
  credit: string;
};

type Props = {
  records: PublicRecord[];
  selectedKey?: string | null;
  onSelectCluster: (cluster: RecordCluster | null) => void;
  labels: PublicMapLabels;
  height?: number;
};

const MARKER_MIN = 26;
const MARKER_MAX = 52;

/** Mapa-múndi offline com agrupamento por área. Coordenadas recebidas já são públicas (célula de 0,1°). */
export function PublicMap({ records, selectedKey, onSelectCluster, labels, height = 320 }: Props) {
  const colors = useColors();
  const [size, setSize] = useState({ width: 340, height });
  const initial = useMemo(() => fitZoomToPoints(records, 340, height), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [center, setCenter] = useState<GeoPoint>(initial.center);
  const [zoom, setZoom] = useState(initial.zoom);

  const view = useMemo(() => createWorldViewport(size.width, size.height, center, zoom), [size, center, zoom]);
  const lonSpan = view.east - view.west;
  const latSpan = view.north - view.south;
  const cell = clusterCellForSpan(lonSpan);
  const clusters = useMemo(() => clusterRecords(records, cell), [records, cell]);
  const maxCount = clusters.reduce((max, item) => Math.max(max, item.count), 1);

  const project = (point: GeoPoint) => ({
    x: ((point.longitude - view.west) / lonSpan) * size.width,
    y: ((view.north - point.latitude) / latSpan) * size.height,
  });

  const visible = clusters
    .map((cluster) => ({ cluster, ...project(cluster) }))
    .filter(({ x, y }) => x >= -MARKER_MAX && x <= size.width + MARKER_MAX && y >= -MARKER_MAX && y <= size.height + MARKER_MAX);

  const move = (dx: number, dy: number) => setCenter((current) => ({ longitude: current.longitude + dx * lonSpan, latitude: Math.max(-80, Math.min(80, current.latitude + dy * latSpan)) }));
  const fit = () => {
    const next = fitZoomToPoints(records, size.width, size.height);
    setCenter(next.center);
    setZoom(next.zoom);
  };
  const control = (text: string, label: string, action: () => void) => (
    <Pressable key={label} onPress={action} accessibilityRole="button" accessibilityLabel={label}
      style={({ pressed }) => [{ minWidth: 44, minHeight: 44, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" }, pressed && { opacity: 0.7 }]}>
      <Text style={{ color: colors.foreground, fontWeight: "800" }}>{text}</Text>
    </Pressable>
  );

  const stroke = lonSpan / Math.max(1, size.width);

  return (
    <View>
      <View
        onLayout={(event) => setSize({ width: event.nativeEvent.layout.width, height })}
        style={{ height, overflow: "hidden", borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: "#cfe3ea" }}>
        <Pressable accessible={false} onPress={() => onSelectCluster(null)} style={{ flex: 1 }}>
          <Svg width="100%" height="100%" viewBox={`${view.west} ${-view.north} ${lonSpan} ${latSpan}`} preserveAspectRatio="none" pointerEvents="none">
            <Rect x={view.west} y={-view.north} width={lonSpan} height={latSpan} fill="#cfe3ea" />
            {/* O mundo se repete à esquerda e à direita para o mapa não "acabar" ao arrastar no meridiano 180°. */}
            {[-360, 0, 360].map((shift) => (
              <Path key={shift} d={WORLD_PATH} transform={`translate(${shift},0)`} fill="#e9e4d4" stroke="#b9b29a" strokeWidth={stroke} />
            ))}
            {zoom >= 6 && <Path d={PANTANAL_PATH} fill="#b5d7a8" fillOpacity={0.7} stroke="#497b5d" strokeWidth={stroke * 1.2} fillRule="evenodd" />}
          </Svg>
        </Pressable>

        {visible.map(({ cluster, x, y }) => {
          const sizePx = MARKER_MIN + ((MARKER_MAX - MARKER_MIN) * Math.sqrt(cluster.count)) / Math.sqrt(maxCount);
          const selected = cluster.key === selectedKey;
          const fill = cluster.highIncidence ? "#C2410C" : colors.primary;
          return (
            <Pressable key={cluster.key} onPress={() => onSelectCluster(cluster)} accessibilityRole="button" accessibilityLabel={labels.cluster(cluster)} accessibilityState={{ selected }}
              hitSlop={8}
              style={{ position: "absolute", left: x - sizePx / 2, top: y - sizePx / 2, width: sizePx, height: sizePx, borderRadius: sizePx / 2, backgroundColor: fill, borderWidth: selected ? 4 : 2, borderColor: selected ? "#FACC15" : "#FFFFFF", alignItems: "center", justifyContent: "center",
                shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 4 }}>
              {cluster.highIncidence && <View pointerEvents="none" style={{ position: "absolute", width: sizePx + 14, height: sizePx + 14, borderRadius: (sizePx + 14) / 2, borderWidth: 3, borderColor: "rgba(194,65,12,0.35)" }} />}
              <Text style={{ color: "#FFFFFF", fontWeight: "900", fontSize: cluster.count > 99 ? 11 : 13 }}>{cluster.count}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        {control("+", labels.zoomIn, () => setZoom((value) => Math.min(MAX_WORLD_ZOOM, value * 2)))}
        {control("−", labels.zoomOut, () => setZoom((value) => Math.max(1, value / 2)))}
        {control("←", labels.west, () => move(-0.3, 0))}
        {control("↑", labels.north, () => move(0, 0.3))}
        {control("↓", labels.south, () => move(0, -0.3))}
        {control("→", labels.east, () => move(0.3, 0))}
        {control(labels.fit, labels.fit, fit)}
        {control(labels.world, labels.world, () => { setCenter({ latitude: 0, longitude: center.longitude }); setZoom(1); })}
      </View>
      <Text style={{ color: colors.muted, fontSize: 11, marginTop: 6 }}>{labels.credit}</Text>
    </View>
  );
}
