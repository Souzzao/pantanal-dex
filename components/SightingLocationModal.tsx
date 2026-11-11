import { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "@/components/T";
import * as Location from "expo-location";
import { PantanalMap } from "./PantanalMap";
import { ScreenContainer } from "./screen-container";
import { StreetMap } from "./StreetMap";
import { isInsidePantanal } from "@/shared/pantanal-boundary";
import type { GeoPoint } from "@/shared/map-projection";
import type { StreetMapEvent, StreetMapState } from "@/shared/street-map";
import { useColors } from "@/hooks/use-colors";

export function SightingLocationModal({ visible, initial, onClose, onConfirm }: { visible: boolean; initial?: GeoPoint; onClose: () => void; onConfirm: (point: GeoPoint) => void }) {
  const colors = useColors();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  // Mapa de ruas (precisa de internet) ou mapa offline de contornos.
  const [mapKind, setMapKind] = useState<"streets" | "offline">("streets");
  const [noTiles, setNoTiles] = useState(false);
  const [fitKey, setFitKey] = useState(1);
  useEffect(() => {
    if (!visible) return;
    setLatitude(initial ? String(initial.latitude) : "");
    setLongitude(initial ? String(initial.longitude) : "");
    setFitKey((k) => k + 1);
    setMapKind("streets");
    if (initial) return;
    // Sem ponto escolhido: abre o mapa onde a pessoa está e já marca ali (ela ajusta se quiser).
    let cancelled = false;
    (async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.granted) return;
        const current = (await Location.getLastKnownPositionAsync()) ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
        if (cancelled || !current) return;
        setLatitude(current.coords.latitude.toFixed(6));
        setLongitude(current.coords.longitude.toFixed(6));
        setFitKey((k) => k + 1);
      } catch { /* sem GPS: a pessoa toca no mapa */ }
    })();
    return () => { cancelled = true; };
  }, [visible, initial?.latitude, initial?.longitude]); // eslint-disable-line react-hooks/exhaustive-deps
  const parse = (value: string) => value.trim() ? Number(value.replace(",", ".")) : NaN;
  const point = { latitude: parse(latitude), longitude: parse(longitude) };
  const hasPoint = Number.isFinite(point.latitude) && Number.isFinite(point.longitude) && Math.abs(point.latitude) <= 90 && Math.abs(point.longitude) <= 180;
  const inside = hasPoint && isInsidePantanal(point.latitude, point.longitude);
  const setPoint = (next: GeoPoint) => { setLatitude(next.latitude.toFixed(6)); setLongitude(next.longitude.toFixed(6)); };

  const mapState = useMemo<StreetMapState>(() => ({
    mode: "pick",
    points: [],
    pick: hasPoint ? point : null,
    selectedIds: [],
    highIncidenceMin: 5,
    fitKey,
    labels: { high: "", records: (n) => String(n), pickHint: "Toque no mapa para marcar o local" },
  }), [hasPoint, point.latitude, point.longitude, fitKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMapEvent = useCallback((event: StreetMapEvent) => {
    if (event.type === "pick") setPoint(event);
    else if (event.type === "tiles" && !event.ok) { setNoTiles(true); setMapKind("offline"); }
  }, []);


  return <Modal visible={visible} animationType="slide" onRequestClose={onClose}><ScreenContainer edges={["top", "left", "right", "bottom"]}><View style={{ flex: 1 }}>
    <View style={{ paddingHorizontal: 16 }}>
      <Pressable onPress={onClose} accessibilityRole="button" style={{ paddingVertical: 10 }}><Text style={{ color: colors.primary, fontWeight: "800" }}>‹ Voltar ao registro</Text></Pressable>
      <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 22, fontWeight: "800" }}>Onde foi o avistamento?</Text>
      <Text style={{ color: colors.muted, marginBottom: 8 }}>Toque no mapa (ou arraste o marcador). Pode ser em qualquer lugar do mundo.</Text>
      {noTiles && mapKind === "offline" && <Text style={{ color: colors.warning, marginBottom: 6 }}>Sem internet para o satélite: usando o mapa offline.</Text>}
    </View>
    <View style={{ flex: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border }}>
      {mapKind === "streets"
        ? <StreetMap state={mapState} onEvent={onMapEvent} accessibilityLabel="Mapa de satélite. Toque para escolher a localização do avistamento" />
        : <ScrollView contentContainerStyle={{ padding: 12 }}><PantanalMap selected={hasPoint ? point : undefined} onSelect={setPoint} /></ScrollView>}
    </View>
    <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {([["Latitude", latitude, setLatitude, "-16.50"], ["Longitude", longitude, setLongitude, "-56.80"]] as const).map(([label, value, setter, placeholder]) => <View key={label} style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontWeight: "700", fontSize: 12, marginBottom: 4 }}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={(text) => { setter(text); }} onEndEditing={() => setFitKey((k) => k + 1)} placeholder={placeholder} keyboardType="numbers-and-punctuation" placeholderTextColor={colors.muted} style={{ color: colors.foreground, padding: 10, borderWidth: 1, borderColor: colors.border, borderRadius: 12 }} /></View>)}
      </View>
      <Text accessibilityLiveRegion="polite" style={{ color: hasPoint ? colors.success : colors.muted, marginVertical: 8 }}>{inside ? "Ponto dentro do Pantanal." : hasPoint ? "Ponto selecionado." : "Nenhum ponto selecionado."}</Text>
      <Pressable disabled={!hasPoint} onPress={() => onConfirm(point)} accessibilityRole="button" accessibilityState={{ disabled: !hasPoint }} style={{ backgroundColor: colors.primary, opacity: hasPoint ? 1 : 0.5, padding: 14, borderRadius: 14, marginBottom: 8 }}><Text style={{ color: colors.background, fontWeight: "800", textAlign: "center" }}>Usar este local</Text></Pressable>
    </View>
  </View></ScreenContainer></Modal>;
}
