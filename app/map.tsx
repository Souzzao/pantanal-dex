import { Linking, Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import NativeMapView from "@/components/NativeMapView";

import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import { species } from "@/shared/pantanal";
import { useColors } from "@/hooks/use-colors";

const roundCoordinate = (value: number) => Math.round(value * 100) / 100;

export default function MapScreen() {
  const colors = useColors();
  const located = useApp().sightings.filter((item) => item.latitude !== undefined && item.longitude !== undefined);

  const openExternalMap = (latitude: number, longitude: number) => {
    void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5">
      <Pressable onPress={() => router.back()}><Text style={{ color: colors.primary, fontWeight: "700", paddingVertical: 14 }}>‹ Voltar</Text></Pressable>
      <Text style={{ color: colors.foreground, fontSize: 28, fontWeight: "800" }}>Mapa de avistamentos</Text>
      <Text style={{ color: colors.muted, marginTop: 5 }}>Seus registros georreferenciados do caderno de campo</Text>
      <NativeMapView />
      <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 18, marginTop: 18 }}>
        <Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 17 }}>Visualização web</Text>
        <Text style={{ color: colors.muted, lineHeight: 21, marginTop: 8 }}>Na prévia web, os pontos aparecem em cartões para preservar o funcionamento sem depender de uma API cartográfica. No aparelho, a mesma tela usa marcadores nativos quando o módulo de mapas está disponível.</Text>
        <Text style={{ color: colors.primary, fontWeight: "800", marginTop: 14 }}>{located.length} registro(s) com localização · catálogo e registros disponíveis offline</Text>
      </View>
      {located.length === 0 ? <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginTop: 18 }}><Text style={{ color: colors.foreground, fontWeight: "800" }}>Nenhum avistamento com coordenadas ainda.</Text><Text style={{ color: colors.muted, marginTop: 6 }}>Use a localização do aparelho ao criar um registro para vê-lo aqui.</Text></View> : located.map((item) => {
        const animal = species.find((entry) => entry.id === item.speciesId);
        const isPrivateExact = item.visibility === "private" && item.locationPrecision === "exact";
        const latitude = isPrivateExact ? item.latitude! : roundCoordinate(item.latitude!);
        const longitude = isPrivateExact ? item.longitude! : roundCoordinate(item.longitude!);
        return <View key={item.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 12 }}><Pressable onPress={() => router.push({ pathname: "/sightings/[id]", params: { id: item.id } } as any)} accessibilityRole="button"><Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 16 }}>{animal?.commonName ?? "Animal"}</Text><Text style={{ color: colors.muted, marginTop: 4 }}>{item.locationLabel || item.date}</Text><Text style={{ color: colors.primary, marginTop: 6, fontSize: 12 }}>{latitude.toFixed(2)}, {longitude.toFixed(2)}{isPrivateExact ? "" : " · posição aproximada"}</Text></Pressable><Pressable onPress={() => openExternalMap(latitude, longitude)} accessibilityRole="button" style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 10, padding: 9, marginTop: 12 }}><Text style={{ color: colors.primary, textAlign: "center", fontWeight: "800", fontSize: 12 }}>Abrir no mapa externo</Text></Pressable></View>;
      })}
    </ScreenContainer>
  );
}
