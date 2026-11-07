import { useEffect, useMemo, useState } from "react";
import { Alert, Image, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

import { ScreenContainer } from "@/components/screen-container";
import { getLocalTodayISODate, UNKNOWN_SPECIES_ID, type Sighting, type Visibility } from "@/shared/pantanal";
import { filterSpeciesCatalog } from "@/shared/catalog";
import { getNativePermissionCopy, type NativeLanguage } from "@/shared/native-permissions";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";
import { countSightingCreations, validateSightingOperation } from "@/shared/sighting-rules";
import { isInsidePantanal } from "@/shared/pantanal-boundary";
import { persistSightingPhoto, SightingPhotoError, MAX_SIGHTING_PHOTO_BYTES, type SightingPhotoInput } from "@/lib/sighting-photos";
import { SightingLocationModal } from "@/components/SightingLocationModal";

export default function NewSightingScreen() {
  const colors = useColors();
  const { id, speciesId } = useLocalSearchParams<{ id?: string; speciesId?: string }>();
  const { sightings, settings, ready, canWriteSightings, creationLedger, addSighting, updateSighting } = useApp();
  const nativeLanguage = (settings.defaultLanguage === "English" || settings.defaultLanguage === "Español" ? settings.defaultLanguage : "Português") as NativeLanguage;
  const existing = id ? sightings.find((item) => item.id === id) : undefined;
  const [selected, setSelected] = useState(speciesId ?? existing?.speciesId ?? UNKNOWN_SPECIES_ID);
  const [newId] = useState(() => `sighting-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);
  const [speciesQuery, setSpeciesQuery] = useState("");
  const [date, setDate] = useState(existing?.date ?? getLocalTodayISODate());
  const [time, setTime] = useState(existing?.time ?? "");
  const [locationLabel, setLocationLabel] = useState(existing?.locationLabel ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [quantity, setQuantity] = useState(existing?.quantity ? String(existing.quantity) : "");
  const [photoUri, setPhotoUri] = useState<string | undefined>(existing?.photoUri);
  const [photoInput, setPhotoInput] = useState<SightingPhotoInput>();
  const [pickingLocation, setPickingLocation] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>(existing?.visibility ?? "private");
  const [isSaving, setIsSaving] = useState(false);
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
    setCoords(
      existing.latitude !== undefined && existing.longitude !== undefined
        ? { latitude: existing.latitude, longitude: existing.longitude }
        : undefined,
    );
  }, [existing]);

  const visibleSpecies = useMemo(() => {
    const normalized = speciesQuery.trim().toLocaleLowerCase("pt-BR");
    return filterSpeciesCatalog({ query: normalized });
  }, [speciesQuery]);

  useEffect(() => {
    let active = true;
    ImagePicker.getPendingResultAsync().then((result) => {
      if (active && result && "canceled" in result && !result.canceled) applyPickerResult(result);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  const applyPickerResult = (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled || !result.assets[0]?.uri) return;
    const asset = result.assets[0];
    if (asset.fileSize && asset.fileSize > MAX_SIGHTING_PHOTO_BYTES) {
      Alert.alert("Fotografia muito grande", "Escolha uma imagem com até 10 MB.");
      return;
    }
    const uri = Platform.OS === "web" && asset.base64 ? `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}` : asset.uri;
    setPhotoUri(uri);
    setPhotoInput({ ...asset, uri });
  };

  const pickPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: Platform.OS === "web",
      });
      applyPickerResult(result);
    } catch {
      Alert.alert("Não foi possível abrir a galeria", "Tente novamente ou use a câmera do aparelho.");
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== "granted") {
        const copy = getNativePermissionCopy(nativeLanguage, "camera", "denied");
        Alert.alert(copy.title, copy.detail);
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: Platform.OS === "web",
      });
      applyPickerResult(result);
    } catch {
      const copy = getNativePermissionCopy(nativeLanguage, "camera", "error");
      Alert.alert(copy.title, copy.detail);
    }
  };

  const useLocation = async () => {
    try {
      if (!(await Location.hasServicesEnabledAsync())) {
        const copy = getNativePermissionCopy(nativeLanguage, "location", "services-disabled");
        Alert.alert(copy.title, copy.detail);
        return;
      }
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        const copy = getNativePermissionCopy(nativeLanguage, "location", "denied");
        Alert.alert(copy.title, copy.detail);
        return;
      }
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setCoords({ latitude: current.coords.latitude, longitude: current.coords.longitude });
      setLocationLabel("Localização atual");
    } catch {
      const copy = getNativePermissionCopy(nativeLanguage, "location", "error");
      Alert.alert(copy.title, copy.detail);
    }
  };

  const save = async () => {
    if (isSaving) return;
    if (!ready || !canWriteSightings) {
      Alert.alert("Caderno indisponível", "Aguarde a restauração dos dados. Se houver um aviso de armazenamento, exporte os registros disponíveis para recuperação.");
      return;
    }
    setIsSaving(true);
    const numericQuantity = quantity.trim() ? Number(quantity) : undefined;
    const currentTime = new Date();
    const now = currentTime.toISOString();
    const sighting: Sighting = {
      id: existing?.id ?? newId,
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
    try {
      const validation = validateSightingOperation(sighting, { operation: existing ? "update" : "create", now: currentTime, ledger: creationLedger, isWithinArea: isInsidePantanal });
      if (!validation.valid) {
        Alert.alert("Confira o registro", validation.errors[0].message);
        return;
      }
      const durableUri = Platform.OS === "web" ? photoUri! : await persistSightingPhoto(photoInput ?? photoUri!);
      sighting.photoUri = durableUri;
      setPhotoUri(durableUri);
      setPhotoInput(undefined);
      if (existing) await updateSighting(sighting);
      else await addSighting(sighting);
      router.replace({ pathname: "/sightings/[id]", params: { id: sighting.id } } as any);
    } catch (error) {
      Alert.alert(error instanceof SightingPhotoError ? "Confira a fotografia" : "Não foi possível salvar", error instanceof Error ? error.message : "O registro continua nesta tela. Verifique o armazenamento e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5">
      <ScrollView contentContainerStyle={{ paddingBottom: 35 }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar">
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "700", paddingVertical: 14 }}>‹ Voltar</Text>
        </Pressable>
        <Text style={{ color: colors.foreground, fontSize: 30, fontWeight: "800" }}>{existing ? "Editar avistamento" : "Novo avistamento"}</Text>
        <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 20 }}>{existing ? "Atualize os detalhes do registro" : "Registre os detalhes do encontro"}</Text>
        <Text style={{ color: colors.muted, marginBottom: 16 }}>Foto e localização são obrigatórias. {ready && canWriteSightings ? `${countSightingCreations(creationLedger, new Date())}/30 novos registros hoje neste aparelho.` : "Carregando o caderno…"}</Text>

        <Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 8 }}>Espécie</Text>
        <TextInput
          value={speciesQuery}
          onChangeText={setSpeciesQuery}
          placeholder="Buscar espécie pelo nome"
          placeholderTextColor={colors.muted}
          accessibilityLabel="Buscar espécie"
          style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground, marginBottom: 10 }}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 15 }}>
          <Pressable onPress={() => setSelected(UNKNOWN_SPECIES_ID)} accessibilityRole="radio" accessibilityState={{ selected: selected === UNKNOWN_SPECIES_ID }} style={{ backgroundColor: selected === UNKNOWN_SPECIES_ID ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9 }}><Text style={{ color: selected === UNKNOWN_SPECIES_ID ? "#fff" : colors.foreground, fontWeight: "700" }}>Não sei</Text></Pressable>
          {visibleSpecies.map((item) => (
            <Pressable key={item.id} onPress={() => setSelected(item.id)} accessibilityRole="radio" accessibilityState={{ selected: selected === item.id }} style={{ backgroundColor: selected === item.id ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9 }}>
              <Text style={{ color: selected === item.id ? "#fff" : colors.foreground, fontWeight: "700", fontSize: 12 }}>{item.commonName}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {visibleSpecies.length === 0 && <Text style={{ color: colors.muted, marginBottom: 15 }}>Nenhuma espécie encontrada.</Text>}

        {[
          ["Data *", date, setDate, "2026-08-21"],
          ["Horário", time, setTime, "14:30"],
          ["Local", locationLabel, setLocationLabel, "Baía ou município"],
          ["Quantidade", quantity, setQuantity, "Ex.: 2"],
        ].map(([label, value, setter, placeholder]) => (
          <View key={label as string} style={{ marginBottom: 14 }}>
            <Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>{label as string}</Text>
            <TextInput value={value as string} onChangeText={setter as any} placeholder={placeholder as string} placeholderTextColor={colors.muted} keyboardType={label === "Quantidade" ? "numeric" : label === "Data *" || label === "Horário" ? "numbers-and-punctuation" : "default"} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground }} />
          </View>
        ))}

        <Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 8 }}>Fotografia * · até 10 MB</Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
          <Pressable onPress={pickPhoto} accessibilityRole="button" style={{ flex: 1, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 14 }}>
            <Text style={{ color: colors.primary, fontWeight: "800", textAlign: "center" }}>{photoUri ? "Trocar da galeria" : "Galeria"}</Text>
          </Pressable>
          <Pressable onPress={takePhoto} accessibilityRole="button" style={{ flex: 1, borderColor: colors.primary, borderWidth: 1, borderRadius: 13, padding: 14 }}>
            <Text style={{ color: colors.primary, fontWeight: "800", textAlign: "center" }}>Tirar foto</Text>
          </Pressable>
        </View>
        {!!photoUri && <View style={{ marginBottom: 14 }}><Image source={{ uri: photoUri }} accessibilityLabel="Fotografia selecionada para o avistamento" style={{ width: "100%", height: 160, borderRadius: 12, marginBottom: 8 }} /><Text style={{ color: colors.success, fontWeight: "700" }}>Fotografia pronta para salvar.</Text><Pressable onPress={() => { setPhotoUri(undefined); setPhotoInput(undefined); }} accessibilityRole="button" accessibilityLabel="Remover fotografia" style={{ marginTop: 8 }}><Text style={{ color: colors.error, fontWeight: "800" }}>Remover fotografia</Text></Pressable></View>}

        <Pressable onPress={useLocation} accessibilityRole="button" style={{ borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 14, marginBottom: 14 }}>
          <Text style={{ color: colors.primary, fontWeight: "800", textAlign: "center" }}>{coords ? "Atualizar localização do aparelho" : "Usar localização do aparelho"}</Text>
        </Pressable>
        <Pressable onPress={() => setPickingLocation(true)} accessibilityRole="button" style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 13, padding: 14, marginBottom: 10 }}><Text style={{ color: colors.primary, fontWeight: "800", textAlign: "center" }}>Escolher local no mapa</Text></Pressable>
        <Text style={{ color: coords && !isInsidePantanal(coords.latitude, coords.longitude) ? colors.error : colors.muted, marginBottom: 16 }}>{coords ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)} · ${isInsidePantanal(coords.latitude, coords.longitude) ? "dentro do Pantanal" : "fora do Pantanal: ajuste o ponto"}` : "Selecione o local pelo GPS ou pelo mapa."}</Text>
        <Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>Observações</Text>
        <TextInput value={notes} onChangeText={setNotes} multiline maxLength={500} placeholder="Comportamento, ambiente e outras notas (até 500 caracteres)" placeholderTextColor={colors.muted} style={{ minHeight: 105, textAlignVertical: "top", backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground, marginBottom: 14 }} />
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
          {(["private", "shareable"] as Visibility[]).map((item) => (
            <Pressable key={item} onPress={() => setVisibility(item)} accessibilityRole="radio" accessibilityState={{ selected: visibility === item }} style={{ flex: 1, backgroundColor: visibility === item ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 12 }}>
              <Text style={{ textAlign: "center", color: visibility === item ? "#fff" : colors.foreground, fontWeight: "700" }}>{item === "private" ? "Pessoal" : "Compartilhável"}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 14 }}>O ponto exato fica no caderno pessoal. Registros compartilháveis usam uma localização aproximada de 0,1° (cerca de 11 km).</Text>
        <Pressable disabled={isSaving} onPress={save} accessibilityRole="button" accessibilityState={{ busy: isSaving, disabled: isSaving }} style={({ pressed }) => [{ backgroundColor: colors.primary, borderRadius: 16, padding: 16, opacity: isSaving ? 0.65 : 1 }, pressed && !isSaving && { opacity: 0.82, transform: [{ scale: 0.98 }] }]}>
          <Text style={{ color: "#fff", fontWeight: "800", textAlign: "center", fontSize: 16 }}>{isSaving ? "Salvando…" : existing ? "Salvar alterações" : "Salvar avistamento"}</Text>

        </Pressable>
      </ScrollView>
      <SightingLocationModal visible={pickingLocation} initial={coords} onClose={() => setPickingLocation(false)} onConfirm={point => { setCoords(point); if (!locationLabel.trim() || locationLabel === "Localização atual") setLocationLabel("Local selecionado no mapa"); setPickingLocation(false); }} />
    </ScreenContainer>
  );
}
