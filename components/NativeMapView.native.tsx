import { useI18n } from "@/contexts/LanguageContext";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import { Pressable, Text } from "@/components/Localized";
import { router } from "expo-router";
import { PantanalMap } from "./PantanalMap";
import { StreetMap } from "./StreetMap";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";
import { localizedSpeciesCatalog } from "@/shared/catalog";
import { roundToPublicLocationGrid } from "@/shared/location";
import type { StreetMapEvent, StreetMapState } from "@/shared/street-map";

export default function NativeMapView() {
  const { locale } = useI18n();
  const colors = useColors();
  const { sightings } = useApp();
  const [mapKind, setMapKind] = useState<"streets" | "offline">("streets");
  const catalog = useMemo(() => new Map(localizedSpeciesCatalog(locale, ).map(item => [item.id, item.commonName])), [locale]);
  const points = useMemo(() => sightings.filter(item => item.latitude !== undefined && item.longitude !== undefined).map(item => {
    const exact = item.visibility === "private" && item.locationPrecision === "exact";
    return { id: item.id, label: catalog.get(item.speciesId) ?? "Espécie não identificada", latitude: exact ? item.latitude! : roundToPublicLocationGrid(item.latitude!), longitude: exact ? item.longitude! : roundToPublicLocationGrid(item.longitude!) };
  }), [sightings, catalog]);
  const open = (id: string) => router.push({ pathname: "/sightings/[id]", params: { id } } as any);
  const state = useMemo<StreetMapState>(() => ({ mode: "points", points, pick: null, selectedIds: [], highIncidenceMin: 5, fitKey: points.length, labels: { high: "", records: n => String(n), pickHint: "" } }), [points]);
  const onEvent = useCallback((event: StreetMapEvent) => {
    if (event.type === "open") open(event.id);
    else if (event.type === "tiles" && !event.ok) setMapKind("offline");
  }, []);
  const toggle = (label: string, active: boolean, onPress: () => void) => <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }} style={{ paddingHorizontal: 12, minHeight: 36, justifyContent: "center", borderRadius: 999, borderWidth: 1, borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.surface }}><Text style={{ color: active ? colors.background : colors.foreground, fontWeight: "700", fontSize: 13 }}>{label}</Text></Pressable>;
  return <View style={{ marginTop: 14 }}>
    <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
      {toggle("Satélite", mapKind === "streets", () => setMapKind("streets"))}
      {toggle("Mapa offline", mapKind === "offline", () => setMapKind("offline"))}
    </View>
    {mapKind === "streets"
      ? <View style={{ height: 460, borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor: colors.border }}><StreetMap state={state} onEvent={onEvent} accessibilityLabel="Mapa de satélite dos seus avistamentos" /></View>
      : <PantanalMap points={points} onOpenPoint={open} />}
  </View>;
}
