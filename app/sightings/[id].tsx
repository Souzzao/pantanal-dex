/**
 * PantanalDex — Detalhe de um avistamento do caderno, com edição, exclusão e publicação.
 *
 * @author Felipe de Souza Aquino
 */
import { useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { Text } from "@/components/T";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { router, useLocalSearchParams } from "expo-router";

import { useTeams } from "@/contexts/TeamsContext";
import { photosOf } from "@/shared/photo-gallery";
import { RemoteImage } from "@/components/RemoteImage";
import { ScreenContainer } from "@/components/screen-container";
import { UNKNOWN_SPECIES_ID } from "@/shared/pantanal";
import { findSpeciesById } from "@/shared/catalog";
import { createExportJson, toExportableSighting } from "@/shared/exports";
import { roundToPublicLocationGrid } from "@/shared/location";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";

export default function SightingDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sightings, deleteSighting } = useApp();
  const teams = useTeams();
  const [teamPicker, setTeamPicker] = useState(false);
  const [sendingTeam, setSendingTeam] = useState(false);
  const [sharing, setSharing] = useState(false);
  const sighting = sightings.find((item) => item.id === id);
  const animal = findSpeciesById(sighting?.speciesId) ?? (sighting?.speciesId === UNKNOWN_SPECIES_ID ? { commonName: "Espécie não identificada", scientificName: "Registrada como “Não sei”", images: [] } : undefined);

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
  const displayLatitude = sighting.latitude === undefined ? undefined : showExactLocation ? sighting.latitude : roundToPublicLocationGrid(sighting.latitude);
  const displayLongitude = sighting.longitude === undefined ? undefined : showExactLocation ? sighting.longitude : roundToPublicLocationGrid(sighting.longitude);

  const shareSighting = async () => {
    if (sharing) return;
    const exactPrivate = showExactLocation;
    if (exactPrivate) {
      const confirmed = await new Promise<boolean>((resolve) => Alert.alert("Localização exata", "Este registro pessoal contém coordenadas exatas e será compartilhado dessa forma.", [{ text: "Cancelar", style: "cancel", onPress: () => resolve(false) }, { text: "Continuar", onPress: () => resolve(true) }]));
      if (!confirmed) return;
    }
    setSharing(true);
    try {
      const uri = `${FileSystem.cacheDirectory}pantanal-dex-avistamento-${sighting.id}.json`;
      await FileSystem.writeAsStringAsync(uri, createExportJson([toExportableSighting(sighting)]));
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
      else Alert.alert("Arquivo pronto", uri);
    } catch {
      Alert.alert("Compartilhamento não concluído", "Não foi possível gerar o arquivo, mas o registro local foi preservado.");
    } finally {
      setSharing(false);
    }
  };

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
        {(photosOf(sighting).length ? photosOf(sighting) : [animal.images[0]?.uri]).map((uri, index) =>
          <RemoteImage key={uri ?? "placeholder"} label={`Foto ${index + 1} · ${animal.commonName}`} source={uri ? { uri } : undefined}
            style={{ width: "100%", height: 230, borderRadius: 18, marginBottom: 8 }} />)}
        <Text style={{ color: colors.foreground, fontSize: 30, fontFamily: "Fraunces_700Bold", letterSpacing: -0.5, marginTop: 18 }}>{animal.commonName}</Text>
        <Text style={{ color: colors.muted, fontStyle: "italic", marginTop: 3 }}>{animal.scientificName}</Text>
        <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, marginTop: 20 }}>
          <Text style={{ color: colors.foreground, fontWeight: "800" }}>Data e horário</Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>{sighting.date}{sighting.time ? ` · ${sighting.time}` : ""}</Text>
          <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 16 }}>Local</Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>{sighting.locationLabel || "Não informado"}</Text>
          {displayLatitude !== undefined && displayLongitude !== undefined && <Text style={{ color: colors.muted, marginTop: 5 }}>Coordenadas: {displayLatitude.toFixed(showExactLocation ? 4 : 1)}, {displayLongitude.toFixed(showExactLocation ? 4 : 1)}{showExactLocation ? "" : " · posição aproximada (~11 km)"}</Text>}
          <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 16 }}>Quantidade</Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>{sighting.quantity ?? "Não informada"}</Text>
          <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 16 }}>Visibilidade</Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>{sighting.visibility === "shareable" ? "Compartilhável · localização aproximada" : "Pessoal"}</Text>
          <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 16 }}>Observações</Text>
          <Text style={{ color: colors.muted, lineHeight: 21, marginTop: 6 }}>{sighting.notes || "Nenhuma observação adicionada."}</Text>
        </View>
        {displayLatitude !== undefined && displayLongitude !== undefined && <Pressable onPress={() => router.push("/map" as any)} accessibilityRole="button" style={({ pressed }) => [{ borderColor: colors.primary, borderWidth: 1, borderRadius: 15, padding: 14, marginTop: 20 }, pressed && { opacity: 0.8 }]}><Text style={{ color: colors.primary, textAlign: "center", fontWeight: "800" }}>Ver no mapa</Text></Pressable>}
        {teams.available && teams.teams.length > 0 && <View style={{ marginTop: 14, gap: 8 }}>
          <Pressable onPress={() => setTeamPicker(!teamPicker)} accessibilityRole="button" accessibilityState={{ expanded: teamPicker }}
            style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 15, padding: 14 }}>
            <Text style={{ color: colors.primary, fontWeight: "800", textAlign: "center" }}>Enviar para equipe</Text>
          </Pressable>
          {teamPicker && <>
            <Text style={{ color: colors.muted }}>A equipe recebe as fotos, a descrição e a zona aproximada.</Text>
            {teams.teams.map((team) => <Pressable key={team.id} accessibilityRole="button" disabled={sendingTeam}
              style={{ minHeight: 44, justifyContent: "center", paddingHorizontal: 12 }}
              onPress={async () => {
                setSendingTeam(true);
                try {
                  const result = await teams.shareRecord(team.id, sighting);
                  if (result.ok) setTeamPicker(false);
                  Alert.alert("Coleção da equipe", result.message ?? "Registro compartilhado.");
                } catch {
                  Alert.alert("Coleção da equipe", "Não foi possível guardar o envio. Tente novamente.");
                } finally { setSendingTeam(false); }
              }}>
              <Text style={{ color: colors.primary, fontWeight: "700" }}>{team.name}</Text>
            </Pressable>)}
          </>}
        </View>}
        <Pressable onPress={shareSighting} disabled={sharing} accessibilityRole="button" style={({ pressed }) => [{ borderColor: colors.primary, borderWidth: 1, borderRadius: 15, padding: 15, marginTop: displayLatitude !== undefined && displayLongitude !== undefined ? 12 : 20, opacity: sharing ? 0.6 : 1 }, pressed && { opacity: 0.75 }]}>
          <Text style={{ color: colors.primary, textAlign: "center", fontWeight: "800" }}>{sharing ? "Preparando arquivo…" : "Compartilhar registro"}</Text>
        </Pressable>
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
