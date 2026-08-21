import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { RemoteImage } from "@/components/RemoteImage";
import { ScreenContainer } from "@/components/screen-container";
import { species } from "@/shared/pantanal";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";

const roundCoordinate = (value: number) => Math.round(value * 100) / 100;

export default function SightingDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sightings, deleteSighting } = useApp();
  const sighting = sightings.find((item) => item.id === id);
  const animal = species.find((item) => item.id === sighting?.speciesId);

  if (!sighting || !animal) {
    return (
      <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5">
        <Pressable onPress={() => router.replace("/(tabs)/sightings" as any)} accessibilityRole="button" accessibilityLabel="Voltar para avistamentos">
          <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 16, paddingVertical: 14 }}>‹ Avistamentos</Text>
        </Pressable>
        <Text style={{ color: colors.foreground, paddingTop: 24, fontSize: 20, fontWeight: "800" }}>Registro não encontrado.</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>Ele pode ter sido removido ou ainda não foi restaurado do armazenamento local.</Text>
      </ScreenContainer>
    );
  }

  const showExactLocation = sighting.visibility === "private" && sighting.locationPrecision === "exact";
  const displayLatitude = sighting.latitude === undefined ? undefined : showExactLocation ? sighting.latitude : roundCoordinate(sighting.latitude);
  const displayLongitude = sighting.longitude === undefined ? undefined : showExactLocation ? sighting.longitude : roundCoordinate(sighting.longitude);

  const confirmDelete = () => Alert.alert("Excluir avistamento?", "Esta ação não pode ser desfeita.", [
    { text: "Cancelar", style: "cancel" },
    { text: "Excluir", style: "destructive", onPress: async () => { await deleteSighting(sighting.id); router.replace("/(tabs)/sightings" as any); } },
  ]);

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5">
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar">
          <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 16, paddingVertical: 14 }}>‹ Voltar</Text>
        </Pressable>
        <RemoteImage label={animal.commonName} source={{ uri: sighting.photoUri || animal.images[0].uri }} style={{ width: "100%", height: 230, borderRadius: 18 }} />
        <Text style={{ color: colors.foreground, fontSize: 30, fontWeight: "800", marginTop: 18 }}>{animal.commonName}</Text>
        <Text style={{ color: colors.muted, fontStyle: "italic", marginTop: 3 }}>{animal.scientificName}</Text>
        <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontWeight: "800" }}>Data e horário</Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>{sighting.date}{sighting.time ? ` · ${sighting.time}` : ""}</Text>
          <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 16 }}>Local</Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>{sighting.locationLabel || "Não informado"}</Text>
          {displayLatitude !== undefined && displayLongitude !== undefined && <Text style={{ color: colors.muted, marginTop: 5 }}>Coordenadas: {displayLatitude.toFixed(showExactLocation ? 4 : 2)}, {displayLongitude.toFixed(showExactLocation ? 4 : 2)}{showExactLocation ? "" : " · posição aproximada"}</Text>}
          <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 16 }}>Quantidade</Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>{sighting.quantity ?? "Não informada"}</Text>
          <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 16 }}>Visibilidade</Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>{sighting.visibility === "shareable" ? "Compartilhável · localização aproximada" : "Pessoal"}</Text>
          <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 16 }}>Observações</Text>
          <Text style={{ color: colors.muted, lineHeight: 21, marginTop: 6 }}>{sighting.notes || "Nenhuma observação adicionada."}</Text>
        </View>
        <Pressable onPress={() => router.push({ pathname: "/sightings/new", params: { id: sighting.id } } as any)} accessibilityRole="button" style={({ pressed }) => [{ backgroundColor: colors.primary, borderRadius: 15, padding: 15, marginTop: 20 }, pressed && { opacity: 0.82, transform: [{ scale: 0.98 }] }]}>
          <Text style={{ color: "#fff", textAlign: "center", fontWeight: "800" }}>Editar registro</Text>
        </Pressable>
        <Pressable onPress={confirmDelete} accessibilityRole="button" style={({ pressed }) => [{ borderColor: colors.error, borderWidth: 1, borderRadius: 15, padding: 15, marginTop: 12 }, pressed && { opacity: 0.75 }]}>
          <Text style={{ color: colors.error, textAlign: "center", fontWeight: "800" }}>Excluir registro</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
