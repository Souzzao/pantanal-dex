/**
 * PantanalDex — Novo avistamento (UC05), "câmera primeiro" (pacote Auditoria UX):
 *  1. Novo registro abre o HUD da câmera (components/CaptureHud). Ali a pessoa tira e importa fotos,
 *     revisa e só então toca em Continuar.
 *  2. Os detalhes (espécie, data, local, observações, caderno e equipe) aparecem depois de Continuar,
 *     com as fotos já anexadas. Voltar para a câmera restaura o mesmo lote.
 *  3. Salvar grava no caderno; se uma equipe foi escolhida, o registro também vai para a coleção dela.
 *
 * @author Felipe de Souza Aquino
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Image, Platform, Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "@/components/T";
import { router, useLocalSearchParams } from "expo-router";
import * as Location from "expo-location";

import { ScreenContainer } from "@/components/screen-container";
import { getLocalTodayISODate, UNKNOWN_SPECIES_ID, type Sighting, type Visibility } from "@/shared/pantanal";
import { filterSpeciesCatalog } from "@/shared/catalog";
import { getNativePermissionCopy, type NativeLanguage } from "@/shared/native-permissions";
import { useApp } from "@/contexts/AppContext";
import { MAIN_NOTEBOOK_ID, notebookOf } from "@/shared/notebooks";
import { useColors } from "@/hooks/use-colors";
import { countSightingCreations, validateSightingOperation } from "@/shared/sighting-rules";
import { isInsidePantanal } from "@/shared/pantanal-boundary";
import { persistSightingPhoto, SightingPhotoError } from "@/lib/sighting-photos";
import { SightingLocationModal } from "@/components/SightingLocationModal";
import { CaptureHud, type DraftPhoto } from "@/components/CaptureHud";
import { ArtIcon } from "@/components/ArtIcon";
import { Icon } from "@/components/Icon";
import { NOTEBOOK_ART } from "@/components/NotebookBar";
import { photosOf } from "@/shared/photo-gallery";
import { useTeams } from "@/contexts/TeamsContext";

export default function NewSightingScreen() {
  const colors = useColors();
  const { id, speciesId } = useLocalSearchParams<{ id?: string; speciesId?: string }>();
  const { sightings, settings, ready, canWriteSightings, creationLedger, addSighting, updateSighting, notebooks, activeNotebookId } = useApp();
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
  const toDraft = (list: string[]): DraftPhoto[] => list.map((uri, i) => ({ id: `salva-${i}-${uri.slice(-12)}`, uri, source: "saved" as const }));
  const [photos, setPhotos] = useState<DraftPhoto[]>(() => (existing ? toDraft(photosOf(existing)) : []));
  // Novo registro começa na câmera; edição começa nos detalhes.
  const [stage, setStage] = useState<"capture" | "details">(id ? "details" : "capture");
  const [hudReview, setHudReview] = useState(false);
  const { teams, available: teamsAvailable, shareRecord } = useTeams();
  const [shareTeamId, setShareTeamId] = useState<string | null>(null);
  const [notebookId, setNotebookId] = useState<string>(existing ? notebookOf(existing) : activeNotebookId);
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
    setPhotos(toDraft(photosOf(existing)));
    setNotebookId(notebookOf(existing));
    setVisibility(existing.visibility);
    setCoords(
      existing.latitude !== undefined && existing.longitude !== undefined
        ? { latitude: existing.latitude, longitude: existing.longitude }
        : undefined,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing]);

  const visibleSpecies = useMemo(() => {
    const normalized = speciesQuery.trim().toLocaleLowerCase("pt-BR");
    return filterSpeciesCatalog({ query: normalized });
  }, [speciesQuery]);

  // Continuar: sai da câmera para os detalhes; o local é pedido aqui, no contexto, se ainda faltar.
  const continueToDetails = () => {
    setStage("details");
    if (!coords && !existing) void fillLocationFromDevice();
  };

  const fillLocationFromDevice = async () => {
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
      photoUri: photos[0]?.uri,
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
      notebookId: notebookId === MAIN_NOTEBOOK_ID ? undefined : notebookId,
    };
    try {
      const validation = validateSightingOperation(sighting, { operation: existing ? "update" : "create", now: currentTime, ledger: creationLedger });
      if (!validation.valid) {
        Alert.alert("Confira o registro", validation.errors[0].message);
        return;
      }
      // Cada foto do lote vai para a pasta permanente do app (na web ficam como data: URI).
      const durable: string[] = [];
      for (const photo of photos) durable.push(Platform.OS === "web" ? photo.uri : await persistSightingPhoto(photo.input ?? photo.uri));
      sighting.photoUri = durable[0];
      sighting.extraPhotoUris = durable.length > 1 ? durable.slice(1) : undefined;
      setPhotos(durable.map((uri, i) => ({ ...photos[i], uri, input: undefined, source: "saved" as const })));
      if (existing) await updateSighting(sighting);
      else await addSighting(sighting);
      // Equipe escolhida explicitamente: o registro também entra na coleção da equipe (com fila offline).
      if (shareTeamId) void shareRecord(shareTeamId, sighting);
      router.replace({ pathname: "/sightings/[id]", params: { id: sighting.id } } as any);
    } catch (error) {
      Alert.alert(error instanceof SightingPhotoError ? "Confira a fotografia" : "Não foi possível salvar", error instanceof Error ? error.message : "O registro continua nesta tela. Verifique o armazenamento e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (stage === "capture") {
    return (
      <CaptureHud photos={photos} onChange={setPhotos} startInReview={hudReview}
        onContinue={() => { setHudReview(false); continueToDetails(); }}
        onClose={() => { setHudReview(false); if (existing) setStage("details"); else router.back(); }} />
    );
  }

  const openHud = (review: boolean) => { setHudReview(review); setStage("capture"); };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5">
      <ScrollView contentContainerStyle={{ paddingBottom: 35 }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => (existing ? router.back() : openHud(false))} accessibilityRole="button" accessibilityLabel={existing ? "Voltar" : "Voltar para a câmera"}
          style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 14 }}>
          <Icon name="arrow-left" size={18} color={colors.primary} mono />
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "700" }}>{existing ? "Voltar" : "Câmera"}</Text>
        </Pressable>
        <Text style={{ color: colors.foreground, fontSize: 30, fontFamily: "Fraunces_700Bold", letterSpacing: -0.5 }}>{existing ? "Editar avistamento" : "Novo avistamento"}</Text>
        <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 20 }}>{existing ? "Atualize os detalhes do registro" : "Registre os detalhes do encontro"}</Text>
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {photos.map((photo, index) => (
              <Pressable key={photo.id} onPress={() => openHud(true)} accessibilityRole="button" accessibilityLabel={`Foto ${index + 1} de ${photos.length}. Abrir revisão`}
                style={{ width: 84, height: 84, borderRadius: 16, overflow: "hidden", borderWidth: index === 0 ? 2 : 1, borderColor: index === 0 ? colors.primary : colors.border }}>
                <Image source={{ uri: photo.uri }} style={{ width: "100%", height: "100%" }} />
                {index === 0 && <Text style={{ position: "absolute", left: 6, bottom: 5, color: colors.background, backgroundColor: colors.primary, fontSize: 10, fontWeight: "900", paddingHorizontal: 6, borderRadius: 6, overflow: "hidden" }}>CAPA</Text>}
              </Pressable>
            ))}
            <Pressable onPress={() => openHud(false)} accessibilityRole="button" accessibilityLabel={photos.length ? "Adicionar mais fotos pela câmera ou galeria" : "Adicionar fotos"}
              style={{ width: 84, height: 84, borderRadius: 16, borderWidth: 1.5, borderStyle: "dashed", borderColor: colors.primary, alignItems: "center", justifyContent: "center", gap: 4 }}>
              <Icon name="camera" size={24} color={colors.primary} />
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "800" }}>{photos.length ? "Mais fotos" : "Fotos"}</Text>
            </Pressable>
          </ScrollView>
        </View>
        <Text style={{ color: colors.muted, marginBottom: 16 }}>Foto e localização são obrigatórias. {ready && canWriteSightings ? `${countSightingCreations(creationLedger, new Date())}/30 novos registros hoje neste aparelho.` : "Carregando o caderno…"}</Text>

        <Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 8 }}>Caderno</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {notebooks.map((item) => (
            <Pressable key={item.id} onPress={() => setNotebookId(item.id)} accessibilityRole="radio" accessibilityState={{ selected: notebookId === item.id }} accessibilityLabel={`Salvar no caderno ${item.name}`}
              style={{ backgroundColor: notebookId === item.id ? colors.primary : colors.surface, borderColor: notebookId === item.id ? colors.primary : colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><ArtIcon name={NOTEBOOK_ART[item.kind]} size={16} /><Text style={{ color: notebookId === item.id ? colors.background : colors.foreground, fontWeight: "800", fontSize: 12 }}>{item.name}</Text></View>
            </Pressable>
          ))}
        </ScrollView>

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

        <Pressable onPress={fillLocationFromDevice} accessibilityRole="button" style={{ borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 14, marginBottom: 14 }}>
          <Text style={{ color: colors.primary, fontWeight: "800", textAlign: "center" }}>{coords ? "Atualizar localização do aparelho" : "Usar localização do aparelho"}</Text>
        </Pressable>
        <Pressable onPress={() => setPickingLocation(true)} accessibilityRole="button" style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 13, padding: 14, marginBottom: 10 }}><Text style={{ color: colors.primary, fontWeight: "800", textAlign: "center" }}>Escolher local no mapa</Text></Pressable>
        <Text style={{ color: colors.muted, marginBottom: 16 }}>{coords ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}${isInsidePantanal(coords.latitude, coords.longitude) ? " · dentro do Pantanal" : ""}` : "Selecione o local pelo GPS ou pelo mapa."}</Text>
        <Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>Observações</Text>
        <TextInput value={notes} onChangeText={setNotes} multiline maxLength={500} placeholder="Comportamento, ambiente e outras notas (até 500 caracteres)" placeholderTextColor={colors.muted} style={{ minHeight: 105, textAlignVertical: "top", backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground, marginBottom: 14 }} />
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>
          {(["private", "shareable"] as Visibility[]).map((item) => (
            <Pressable key={item} onPress={() => setVisibility(item)} accessibilityRole="radio" accessibilityState={{ selected: visibility === item }} style={{ flex: 1, backgroundColor: visibility === item ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 12 }}>
              <Text style={{ textAlign: "center", color: visibility === item ? "#fff" : colors.foreground, fontWeight: "700" }}>{item === "private" ? "Pessoal" : "Compartilhável"}</Text>
            </Pressable>
          ))}
        </View>
        {!existing && teamsAvailable && teams.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 8 }}>Coleção da equipe</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {[{ id: null as string | null, name: "Só no meu caderno" }, ...teams.map((t) => ({ id: t.id as string | null, name: t.name }))].map((option) => {
                const active = shareTeamId === option.id;
                return (
                  <Pressable key={option.id ?? "pessoal"} onPress={() => setShareTeamId(option.id)} accessibilityRole="radio" accessibilityState={{ selected: active }}
                    accessibilityLabel={option.id ? `Também enviar para a equipe ${option.name}` : "Manter só no meu caderno"}
                    style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: active ? colors.primary : colors.surface, borderColor: active ? colors.primary : colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 }}>
                    <ArtIcon name={option.id ? "equipe" : "caderno"} size={16} />
                    <Text style={{ color: active ? colors.background : colors.foreground, fontWeight: "800", fontSize: 12 }}>{option.name}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>{shareTeamId ? "A equipe vê as fotos, a descrição, a data e a zona de ~11 km, com o seu nome. O ponto exato continua só no seu aparelho." : "O registro fica só no seu caderno. Dá para enviar a uma equipe depois, na ficha do registro."}</Text>
          </View>
        )}
        <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 14 }}>O ponto exato fica no caderno pessoal. Registros compartilháveis usam uma localização aproximada de 0,1° (cerca de 11 km).</Text>
        <Pressable disabled={isSaving} onPress={save} accessibilityRole="button" accessibilityState={{ busy: isSaving, disabled: isSaving }} style={({ pressed }) => [{ backgroundColor: colors.primary, borderRadius: 16, padding: 16, opacity: isSaving ? 0.65 : 1 }, pressed && !isSaving && { opacity: 0.82, transform: [{ scale: 0.98 }] }]}>
          <Text style={{ color: "#fff", fontWeight: "800", textAlign: "center", fontSize: 16 }}>{isSaving ? "Salvando…" : existing ? "Salvar alterações" : "Salvar avistamento"}</Text>

        </Pressable>
      </ScrollView>
      <SightingLocationModal visible={pickingLocation} initial={coords} onClose={() => setPickingLocation(false)} onConfirm={point => { setCoords(point); if (!locationLabel.trim() || locationLabel === "Localização atual") setLocationLabel("Local selecionado no mapa"); setPickingLocation(false); }} />
    </ScreenContainer>
  );
}
