import { useRef, useState } from "react";
import { Alert, Image, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { ScreenContainer } from "@/components/screen-container";
import { species, type Visibility } from "@/shared/pantanal";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";

export default function NewSightingScreen() {
  const colors = useColors();
  const { speciesId } = useLocalSearchParams<{ speciesId?: string }>();
  const { addSighting } = useApp();
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [selected, setSelected] = useState(speciesId ?? species[0].id);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState("");
  const [photoUri, setPhotoUri] = useState<string>();
  const [cameraOpen, setCameraOpen] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>("private");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number }>();

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Galeria não autorizada", "Permita o acesso à galeria para selecionar uma fotografia.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8, allowsEditing: false });
    if (!result.canceled && result.assets[0]?.uri) setPhotoUri(result.assets[0].uri);
  };

  const openCamera = async () => {
    if (Platform.OS === "web") {
      Alert.alert("Câmera no navegador", "A captura nativa não está disponível na Web. Selecione uma imagem pela galeria.");
      await pickPhoto();
      return;
    }
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert("Câmera não autorizada", "Permita o acesso à câmera para capturar uma fotografia. Você também pode usar a galeria.");
        return;
      }
    }
    setCameraOpen(true);
  };

  const takePhoto = async () => {
    const result = await cameraRef.current?.takePictureAsync({ quality: 0.8, skipProcessing: true });
    if (result?.uri) {
      setPhotoUri(result.uri);
      setCameraOpen(false);
    }
  };

  const useLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") { Alert.alert("Localização não autorizada", "Você pode salvar o registro sem coordenadas."); return; }
    const current = await Location.getCurrentPositionAsync({});
    setCoords({ latitude: current.coords.latitude, longitude: current.coords.longitude });
    setLocationLabel("Localização atual");
  };

  const save = async () => {
    if (!date) return Alert.alert("Data obrigatória", "Informe a data do avistamento.");
    const id = `${Date.now()}`;
    const now = new Date().toISOString();
    await addSighting({ id, speciesId: selected, photoUri, date, time: time || undefined, locationLabel: locationLabel || undefined, latitude: coords?.latitude, longitude: coords?.longitude, locationPrecision: coords ? "exact" : "none", quantity: quantity ? Number(quantity) : undefined, notes: notes || undefined, visibility, createdAt: now, updatedAt: now });
    router.replace({ pathname: "/sightings/[id]", params: { id } } as any);
  };

  return <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5">
    <ScrollView contentContainerStyle={{ paddingBottom: 35 }}>
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar"><Text style={{ color: colors.primary, fontSize: 16, fontWeight: "700", paddingVertical: 14 }}>‹ Voltar</Text></Pressable>
      <Text style={{ color: colors.foreground, fontSize: 30, fontWeight: "800" }}>Novo avistamento</Text>
      <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 20 }}>Registre os detalhes do encontro</Text>
      <Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 8 }}>Espécie</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 15 }}>{species.map((item) => <Pressable key={item.id} onPress={() => setSelected(item.id)} accessibilityRole="button" accessibilityLabel={`Selecionar ${item.commonName}`} accessibilityState={{ selected: selected === item.id }} style={{ backgroundColor: selected === item.id ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9 }}><Text style={{ color: selected === item.id ? "#fff" : colors.foreground, fontWeight: "700", fontSize: 12 }}>{item.commonName}</Text></Pressable>)}</ScrollView>
      {[['Data *', date, setDate, '2026-08-21'], ['Horário', time, setTime, '14:30'], ['Local', locationLabel, setLocationLabel, 'Baía ou município'], ['Quantidade', quantity, setQuantity, 'Ex.: 2']].map(([label, value, setter, placeholder]) => <View key={label as string} style={{ marginBottom: 14 }}><Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>{label as string}</Text><TextInput value={value as string} onChangeText={setter as any} placeholder={placeholder as string} placeholderTextColor={colors.muted} keyboardType={label === "Quantidade" ? "numeric" : "default"} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground }} /></View>)}
      {cameraOpen ? <View style={{ height: 300, borderRadius: 16, overflow: "hidden", marginBottom: 12, backgroundColor: "#111" }}><CameraView ref={cameraRef} facing="back" style={{ flex: 1 }} /><View style={{ position: "absolute", left: 0, right: 0, bottom: 14, flexDirection: "row", justifyContent: "center", gap: 10 }}><Pressable onPress={() => setCameraOpen(false)} accessibilityRole="button" accessibilityLabel="Cancelar câmera" style={{ backgroundColor: "rgba(0,0,0,.65)", borderRadius: 18, paddingHorizontal: 16, paddingVertical: 11 }}><Text style={{ color: "#fff", fontWeight: "800" }}>Cancelar</Text></Pressable><Pressable onPress={takePhoto} accessibilityRole="button" accessibilityLabel="Capturar fotografia" style={{ backgroundColor: colors.primary, borderRadius: 18, paddingHorizontal: 18, paddingVertical: 11 }}><Text style={{ color: "#fff", fontWeight: "800" }}>Capturar</Text></Pressable></View></View> : null}
      {photoUri ? <View style={{ marginBottom: 14 }}><Image source={{ uri: photoUri }} accessibilityLabel="Pré-visualização da fotografia do avistamento" style={{ width: "100%", height: 210, borderRadius: 14, backgroundColor: colors.border }} /><Pressable onPress={() => setPhotoUri(undefined)} accessibilityRole="button" accessibilityLabel="Remover fotografia" style={{ alignSelf: "flex-start", marginTop: 8 }}><Text style={{ color: colors.primary, fontWeight: "800" }}>Remover fotografia</Text></Pressable></View> : null}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}><Pressable onPress={openCamera} accessibilityRole="button" accessibilityLabel="Abrir câmera" accessibilityHint="Solicita permissão e abre a câmera nativa no aparelho" style={{ flex: 1, borderColor: colors.primary, borderWidth: 1, borderRadius: 13, padding: 14 }}><Text style={{ color: colors.primary, fontWeight: "800", textAlign: "center" }}>{Platform.OS === "web" ? "Selecionar foto" : "Abrir câmera"}</Text></Pressable><Pressable onPress={pickPhoto} accessibilityRole="button" accessibilityLabel="Selecionar foto da galeria" style={{ flex: 1, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 14 }}><Text style={{ color: colors.primary, fontWeight: "800", textAlign: "center" }}>Galeria</Text></Pressable></View>
      <Pressable onPress={useLocation} accessibilityRole="button" accessibilityLabel="Usar localização do aparelho" style={{ borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 14, marginBottom: 14 }}><Text style={{ color: colors.primary, fontWeight: "800" }}>{coords ? "Localização adicionada" : "Usar localização do aparelho"}</Text></Pressable>
      <Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>Observações</Text><TextInput value={notes} onChangeText={setNotes} multiline placeholder="Comportamento, ambiente e outras notas" placeholderTextColor={colors.muted} style={{ minHeight: 105, textAlignVertical: "top", backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground, marginBottom: 14 }} />
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>{(["private", "shareable"] as Visibility[]).map((item) => <Pressable key={item} onPress={() => setVisibility(item)} accessibilityRole="button" accessibilityLabel={item === "private" ? "Registro pessoal" : "Registro compartilhável"} accessibilityState={{ selected: visibility === item }} style={{ flex: 1, backgroundColor: visibility === item ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 12 }}><Text style={{ textAlign: "center", color: visibility === item ? "#fff" : colors.foreground, fontWeight: "700" }}>{item === "private" ? "Pessoal" : "Compartilhável"}</Text></Pressable>)}</View>
      <Pressable onPress={save} accessibilityRole="button" accessibilityLabel="Salvar avistamento" style={{ backgroundColor: colors.primary, borderRadius: 16, padding: 16 }}><Text style={{ color: "#fff", textAlign: "center", fontWeight: "800", fontSize: 16 }}>Salvar avistamento</Text></Pressable>
    </ScrollView>
  </ScreenContainer>;
}
