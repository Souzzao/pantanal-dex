import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import type { LocationPrecision, Visibility } from "@/shared/pantanal";
import { useColors } from "@/hooks/use-colors";

const precisionOptions: LocationPrecision[] = ["exact", "approximate", "municipality", "none"];

export default function EditSightingScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sightings, updateSighting } = useApp();
  const sighting = sightings.find((item) => item.id === id);
  const [date, setDate] = useState(sighting?.date ?? "");
  const [time, setTime] = useState(sighting?.time ?? "");
  const [locationLabel, setLocationLabel] = useState(sighting?.locationLabel ?? "");
  const [notes, setNotes] = useState(sighting?.notes ?? "");
  const [quantity, setQuantity] = useState(sighting?.quantity?.toString() ?? "");
  const [precision, setPrecision] = useState<LocationPrecision>(sighting?.locationPrecision ?? "none");
  const [visibility, setVisibility] = useState<Visibility>(sighting?.visibility ?? "private");
  const [saving, setSaving] = useState(false);

  if (!sighting) return <ScreenContainer className="px-5"><Text style={{ color: colors.foreground, paddingTop: 24 }}>Registro não encontrado.</Text></ScreenContainer>;

  const save = async () => {
    if (!date.trim()) { Alert.alert("Data obrigatória", "Informe a data do avistamento antes de salvar."); return; }
    const parsedQuantity = quantity.trim() ? Number(quantity.replace(",", ".")) : undefined;
    if (parsedQuantity !== undefined && (!Number.isFinite(parsedQuantity) || parsedQuantity < 0)) { Alert.alert("Quantidade inválida", "Informe uma quantidade igual ou maior que zero."); return; }
    if (visibility === "shareable" && sighting.visibility === "private") {
      const confirmed = await new Promise<boolean>((resolve) => Alert.alert("Tornar compartilhável?", "Esse registro poderá ser incluído em compartilhamentos futuros. Confirme apenas se os dados estiverem adequados.", [{ text: "Cancelar", style: "cancel", onPress: () => resolve(false) }, { text: "Confirmar", onPress: () => resolve(true) }]));
      if (!confirmed) return;
    }
    setSaving(true);
    try {
      await updateSighting({ ...sighting, date: date.trim(), time: time.trim() || undefined, locationLabel: locationLabel.trim() || undefined, notes: notes.trim() || undefined, quantity: parsedQuantity, locationPrecision: precision, visibility, updatedAt: new Date().toISOString() });
      router.replace({ pathname: "/sightings/[id]", params: { id: sighting.id } } as any);
    } catch { Alert.alert("Falha ao salvar", "O registro não foi alterado. Tente novamente."); } finally { setSaving(false); }
  };

  return <ScreenContainer className="px-5"><ScrollView contentContainerStyle={{ paddingBottom: 30 }}><Pressable onPress={() => router.back()}><Text style={{ color: colors.primary, fontWeight: "700", fontSize: 16, paddingVertical: 14 }}>‹ Cancelar</Text></Pressable><Text style={{ color: colors.foreground, fontSize: 30, fontWeight: "800" }}>Editar avistamento</Text><Text style={{ color: colors.muted, marginTop: 4, marginBottom: 22 }}>O ID e a data de criação serão preservados.</Text><Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>Data *</Text><TextInput value={date} onChangeText={setDate} placeholder="AAAA-MM-DD" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground, marginBottom: 14 }} /><Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>Horário</Text><TextInput value={time} onChangeText={setTime} placeholder="HH:MM" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground, marginBottom: 14 }} /><Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>Local</Text><TextInput value={locationLabel} onChangeText={setLocationLabel} placeholder="Nome do local" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground, marginBottom: 14 }} /><Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>Precisão da localização</Text><View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>{precisionOptions.map((item) => <Pressable key={item} onPress={() => setPrecision(item)} style={{ backgroundColor: precision === item ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 10 }}><Text style={{ color: precision === item ? "#fff" : colors.foreground, fontWeight: "700" }}>{item === "exact" ? "Exata" : item === "approximate" ? "Aproximada" : item === "municipality" ? "Município" : "Sem local"}</Text></Pressable>)}</View><Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>Quantidade</Text><TextInput value={quantity} onChangeText={setQuantity} keyboardType="decimal-pad" placeholder="Opcional" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground, marginBottom: 14 }} /><Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>Observações</Text><TextInput value={notes} onChangeText={setNotes} multiline placeholder="Comportamento, ambiente e outras notas" placeholderTextColor={colors.muted} style={{ minHeight: 110, textAlignVertical: "top", backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground, marginBottom: 14 }} /><Text style={{ color: colors.foreground, fontWeight: "800", marginBottom: 7 }}>Visibilidade</Text><View style={{ flexDirection: "row", gap: 8, marginBottom: 20 }}>{(["private", "shareable"] as Visibility[]).map((item) => <Pressable key={item} onPress={() => setVisibility(item)} style={{ flex: 1, backgroundColor: visibility === item ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 12 }}><Text style={{ textAlign: "center", color: visibility === item ? "#fff" : colors.foreground, fontWeight: "700" }}>{item === "private" ? "Pessoal" : "Compartilhável"}</Text></Pressable>)}</View><Pressable onPress={save} disabled={saving} style={{ backgroundColor: saving ? colors.muted : colors.primary, borderRadius: 16, padding: 16 }}><Text style={{ color: "#fff", textAlign: "center", fontWeight: "800", fontSize: 16 }}>{saving ? "Salvando…" : "Salvar alterações"}</Text></Pressable></ScrollView></ScreenContainer>;
}

export { EditSightingScreen };

