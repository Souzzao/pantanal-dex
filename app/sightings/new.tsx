import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import { ScreenContainer } from "@/components/screen-container";
import { species, type Sighting, type Visibility } from "@/shared/pantanal";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";

export default function NewSightingScreen() {
  const colors = useColors();
  const { id, speciesId } = useLocalSearchParams<{ id?: string; speciesId?: string }>();
  const { sightings, addSighting, updateSighting } = useApp();
  const existing = id ? sightings.find((item) => item.id === id) : undefined;
  const [selected, setSelected] = useState(speciesId ?? existing?.speciesId ?? species[0].id);
  const [date, setDate] = useState(existing?.date ?? new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(existing?.time ?? "");
  const [locationLabel, setLocationLabel] = useState(existing?.locationLabel ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [quantity, setQuantity] = useState(existing?.quantity ? String(existing.quantity) : "");
  const [photoUri, setPhotoUri] = useState<string | undefined>(existing?.photoUri);
  const [visibility, setVisibility] = useState<Visibility>(existing?.visibility ?? "private");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | undefined>(
    existing?.latitude !== undefined && existing.longitude !== undefined
      ? { latitude: existing.latitude, longitude: existing.longitude }
      : undefined,
  );

  useEffect(() => {
    if (!existing) return;
    setSelected(existing.speciesId);
    setDate(existing.date);
    setTime(existing.time ?? "");
    setLocationLabel(existing.locationLabel ?? "");
    setNotes(existing.notes ?? "");
    setQuantity(existing.quantity ? String(existing.quantity) : "");
    setPhotoUri(existing.photoUri);
    setVisibility(existing.visibility);
    if (existing.latitude !== undefined && existing.longitude !== undefined) {
      setCoords({ latitude: existing.latitude, longitude: existing.longitude });
    }
  }, [existing]);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const useLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Localização não autorizada", "Você pode salvar o registro sem coordenadas.");
      return;
    }
    const current = await Location.getCurrentPositionAsync({});
    setCoords({ latitude: current.coords.latitude, longitude: current.coords.longitude });
    setLocationLabel("Localização atual");
  };

  const save = async () => {
    if (!date.trim()) {
      Alert.alert("Data obrigatória", "Informe a data do avistamento.");
      return;
    }
    const numericQuantity = quantity.trim() ? Number(quantity) : undefined;
    if (numericQuantity !== undefined && (!Number.isInteger(numericQuantity) || numericQuantity < 1)) {
      Alert.alert("Quantidade inválida", "Informe um número inteiro maior que zero.");
      return;
    }
    const now = new Date().toISOString();
    const sighting: Sighting = {
      id: existing?.id ?? `sighting-${Date.now()}`,
      speciesId: selected,
      photoUri,
      date: date.trim(),
      time: time.trim() || undefined,
      locationLabel: locationLabel.trim() || undefined,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      locationPrecision: coords ? "exact" : existing?.locationPrecision ?? "none",
      quantity: numericQuantity,
      notes: notes.trim() || undefined,
      visibility,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    if (existing) await updateSighting(sighting);
    else await addSighting(sighting);
    router.replace({ pathname: "/sightings/[id]", params: { id: sighting.id } } as any);
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5">
      <ScrollView contentContainerStyle={{ paddingBottom: 35 }}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "700", paddingVertical: 14 }}>‹ Voltar</Text>
        </Pressable>
        <Text style={{ color: colors.foreground, fontSize: 30, fontWeight: "800" }}>{existing ? "Editar avistamento" : "Novo avistamento"}</Text>
        <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 20 }}>{existing ? "Atualize os detalhes do registro" : "Registre os detalhes do encontro"}</Text>
        <Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 8 }}>Espécie</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 15 }}>
          {species.map((item) => (
            <Pressable key={item.id} onPress={() => setSelected(item.id)} style={{ backgroundColor: selected === item.id ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9 }}>
              <Text style={{ color: selected === item.id ? "#fff" : colors.foreground, fontWeight: "700", fontSize: 12 }}>{item.commonName}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {[
          ["Data *", date, setDate, "2026-08-21"],
          ["Horário", time, setTime, "14:30"],
          ["Local", locationLabel, setLocationLabel, "Baía ou município"],
          ["Quantidade", quantity, setQuantity, "Ex.: 2"],
        ].map(([label, value, setter, placeholder]) => (
          <View key={label as string} style={{ marginBottom: 14 }}>
            <Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>{label as string}</Text>
            <TextInput value={value as string} onChangeText={setter as any} placeholder={placeholder as string} placeholderTextColor={colors.muted} keyboardType={label === "Quantidade" ? "numeric" : "default"} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground }} />
          </View>
        ))}
        <Pressable onPress={pickPhoto} style={{ borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 14, marginBottom: 14 }}>
          <Text style={{ color: colors.primary, fontWeight: "800" }}>{photoUri ? "Fotografia selecionada" : "Adicionar fotografia (opcional)"}</Text>
        </Pressable>
        <Pressable onPress={useLocation} style={{ borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 14, marginBottom: 14 }}>
          <Text style={{ color: colors.primary, fontWeight: "800" }}>{coords ? "Localização adicionada" : "Usar localização do aparelho"}</Text>
        </Pressable>
        <Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>Observações</Text>
        <TextInput value={notes} onChangeText={setNotes} multiline placeholder="Comportamento, ambiente e outras notas" placeholderTextColor={colors.muted} style={{ minHeight: 105, textAlignVertical: "top", backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground, marginBottom: 14 }} />
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
          {(["private", "shareable"] as Visibility[]).map((item) => (
            <Pressable key={item} onPress={() => setVisibility(item)} style={{ flex: 1, backgroundColor: visibility === item ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 12 }}>
              <Text style={{ textAlign: "center", color: visibility === item ? "#fff" : colors.foreground, fontWeight: "700" }}>{item === "private" ? "Pessoal" : "Compartilhável"}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={save} style={({ pressed }) => [{ backgroundColor: colors.primary, borderRadius: 16, padding: 16 }, pressed && { opacity: 0.82, transform: [{ scale: 0.98 }] }]}>
          <Text style={{ color: "#fff", fontWeight: "800", textAlign: "center", fontSize: 16 }}>{existing ? "Salvar alterações" : "Salvar avistamento"}</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
