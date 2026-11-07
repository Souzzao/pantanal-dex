import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { PantanalMap } from "./PantanalMap";
import { ScreenContainer } from "./screen-container";
import { isInsidePantanal } from "@/shared/pantanal-boundary";
import type { GeoPoint } from "@/shared/map-projection";
import { useColors } from "@/hooks/use-colors";

export function SightingLocationModal({ visible, initial, onClose, onConfirm }: { visible: boolean; initial?: GeoPoint; onClose: () => void; onConfirm: (point: GeoPoint) => void }) {
  const colors = useColors();
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  useEffect(() => { if (visible) { setLatitude(initial ? String(initial.latitude) : ""); setLongitude(initial ? String(initial.longitude) : ""); } }, [visible, initial?.latitude, initial?.longitude]);
  const parse = (value: string) => value.trim() ? Number(value.replace(",", ".")) : NaN;
  const point = { latitude: parse(latitude), longitude: parse(longitude) };
  const hasPoint = Number.isFinite(point.latitude) && Number.isFinite(point.longitude);
  const inside = hasPoint && isInsidePantanal(point.latitude, point.longitude);
  return <Modal visible={visible} animationType="slide" onRequestClose={onClose}><ScreenContainer className="px-5"><ScrollView contentContainerStyle={{ paddingBottom: 25 }} keyboardShouldPersistTaps="handled">
    <Pressable onPress={onClose} accessibilityRole="button" style={{ paddingVertical: 16 }}><Text style={{ color: colors.primary, fontWeight: "800" }}>‹ Voltar ao registro</Text></Pressable>
    <Text style={{ color: colors.foreground, fontSize: 25, fontWeight: "800", marginBottom: 8 }}>Onde foi o avistamento?</Text>
    <Text style={{ color: colors.muted, marginBottom: 16 }}>Toque no mapa ou informe as coordenadas do local observado. O registro deve ficar dentro do bioma Pantanal.</Text>
    <PantanalMap selected={hasPoint ? point : undefined} onSelect={next => { setLatitude(next.latitude.toFixed(6)); setLongitude(next.longitude.toFixed(6)); }} />
    {[["Latitude", latitude, setLatitude, "Ex.: -16.50"], ["Longitude", longitude, setLongitude, "Ex.: -56.80"]].map(([label, value, setter, placeholder]) => <View key={label as string} style={{ marginTop: 14 }}><Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 6 }}>{label as string}</Text><TextInput accessibilityLabel={label as string} value={value as string} onChangeText={setter as (value: string) => void} placeholder={placeholder as string} keyboardType="numbers-and-punctuation" placeholderTextColor={colors.muted} style={{ color: colors.foreground, padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 12 }} /></View>)}
    <Text accessibilityLiveRegion="polite" style={{ color: inside ? colors.success : colors.muted, marginVertical: 14 }}>{inside ? "Ponto dentro do Pantanal." : hasPoint ? "Este ponto está fora do Pantanal. Escolha outro local." : "Nenhum ponto selecionado."}</Text>
    <Pressable disabled={!inside} onPress={() => onConfirm(point)} accessibilityRole="button" accessibilityState={{ disabled: !inside }} style={{ backgroundColor: colors.primary, opacity: inside ? 1 : 0.5, padding: 16, borderRadius: 14 }}><Text style={{ color: "#fff", fontWeight: "800", textAlign: "center" }}>Usar este local</Text></Pressable>
  </ScrollView></ScreenContainer></Modal>;
}
