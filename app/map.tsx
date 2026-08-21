import { Linking, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import Svg, { Circle, Line, Rect, Text as SvgText } from "react-native-svg";

import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import { species } from "@/shared/pantanal";
import { useColors } from "@/hooks/use-colors";

const MAP_WIDTH = 340;
const MAP_HEIGHT = 230;

export default function MapScreen() {
  const colors = useColors();
  const located = useApp().sightings.filter((item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude));
  const latitudes = located.map((item) => item.latitude as number);
  const longitudes = located.map((item) => item.longitude as number);
  const minLat = latitudes.length ? Math.min(...latitudes) : -17;
  const maxLat = latitudes.length ? Math.max(...latitudes) : -15;
  const minLon = longitudes.length ? Math.min(...longitudes) : -58;
  const maxLon = longitudes.length ? Math.max(...longitudes) : -54;
  const latSpan = Math.max(maxLat - minLat, 0.02);
  const lonSpan = Math.max(maxLon - minLon, 0.02);

  const project = (latitude: number, longitude: number) => ({
    x: 24 + ((longitude - minLon) / lonSpan) * (MAP_WIDTH - 48),
    y: 24 + ((maxLat - latitude) / latSpan) * (MAP_HEIGHT - 48),
  });

  const openExternalMap = (latitude: number, longitude: number) => {
    void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5">
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar">
        <Text style={{ color: colors.primary, fontWeight: "700", paddingVertical: 14 }}>‹ Voltar</Text>
      </Pressable>
      <Text style={{ color: colors.foreground, fontSize: 28, fontWeight: "800" }}>Mapa de avistamentos</Text>
      <Text style={{ color: colors.muted, marginTop: 5 }}>Seus registros georreferenciados do caderno de campo</Text>
      <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 10, marginTop: 18 }}>
        <Svg width="100%" height={MAP_HEIGHT} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} accessibilityLabel="Mapa esquemático dos avistamentos">
          <Rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} rx="14" fill={colors.background} />
          {[1, 2, 3, 4].map((step) => <Line key={`v-${step}`} x1={step * (MAP_WIDTH / 5)} y1="0" x2={step * (MAP_WIDTH / 5)} y2={MAP_HEIGHT} stroke={colors.border} strokeWidth="1" />)}
          {[1, 2, 3].map((step) => <Line key={`h-${step}`} x1="0" y1={step * (MAP_HEIGHT / 4)} x2={MAP_WIDTH} y2={step * (MAP_HEIGHT / 4)} stroke={colors.border} strokeWidth="1" />)}
          <SvgText x="14" y="18" fill={colors.muted} fontSize="10">PANTANAL · REGISTROS LOCAIS</SvgText>
          {located.map((item) => {
            const point = project(item.latitude as number, item.longitude as number);
            const animal = species.find((entry) => entry.id === item.speciesId);
            return <Circle key={item.id} cx={point.x} cy={point.y} r="8" fill={colors.primary} stroke="#fff" strokeWidth="3" accessibilityLabel={`Marcador de ${animal?.commonName ?? "animal"}`} />;
          })}
        </Svg>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 8, paddingTop: 8 }}>
          <Text style={{ color: colors.muted, fontSize: 11 }}>Oeste</Text>
          <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 12 }}>{located.length} marcador(es)</Text>
          <Text style={{ color: colors.muted, fontSize: 11 }}>Leste</Text>
        </View>
      </View>
      <Text style={{ color: colors.muted, lineHeight: 21, marginTop: 12 }}>Mapa esquemático offline: os marcadores são posicionados pelas coordenadas salvas e não exigem conexão com um provedor de mapas. Toque em um registro para abrir o detalhe.</Text>
      {located.length === 0 ? <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginTop: 18 }}><Text style={{ color: colors.foreground, fontWeight: "800" }}>Nenhum avistamento com coordenadas ainda.</Text><Text style={{ color: colors.muted, marginTop: 6 }}>Use a localização do aparelho ao criar um registro para vê-lo aqui.</Text></View> : located.map((item) => {
        const animal = species.find((entry) => entry.id === item.speciesId);
        const latitude = item.latitude as number;
        const longitude = item.longitude as number;
        return <View key={item.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 12 }}><Pressable onPress={() => router.push({ pathname: "/sightings/[id]", params: { id: item.id } } as any)} accessibilityRole="button" accessibilityLabel={`Abrir registro de ${animal?.commonName ?? "animal"}`}><Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 16 }}>{animal?.commonName ?? "Animal"}</Text><Text style={{ color: colors.muted, marginTop: 4 }}>{item.locationLabel || item.date}</Text><Text style={{ color: colors.primary, marginTop: 6, fontSize: 12 }}>{latitude.toFixed(4)}, {longitude.toFixed(4)}</Text></Pressable><Pressable onPress={() => openExternalMap(latitude, longitude)} accessibilityRole="button" accessibilityLabel="Abrir coordenadas no mapa externo" style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 10, padding: 9, marginTop: 12 }}><Text style={{ color: colors.primary, textAlign: "center", fontWeight: "800", fontSize: 12 }}>Abrir no mapa externo</Text></Pressable></View>;
      })}
    </ScreenContainer>
  );
}
