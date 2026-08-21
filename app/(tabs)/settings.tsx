import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { ScreenContainer } from "@/components/screen-container";
import { createExportCsv, createExportJson, useApp } from "@/contexts/AppContext";
import { languages, species } from "@/shared/pantanal";
import { useColors } from "@/hooks/use-colors";

export default function SettingsScreen() {
  const colors = useColors();
  const { sightings, settings, ready, setSettings } = useApp();
  const [exporting, setExporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => sightings.some((item) => item.id === id)).length ? current.filter((id) => sightings.some((item) => item.id === id)) : sightings.map((item) => item.id));
  }, [sightings]);

  const selectedSightings = useMemo(() => sightings.filter((item) => selectedIds.includes(item.id)), [sightings, selectedIds]);
  const allSelected = sightings.length > 0 && selectedSightings.length === sightings.length;

  const toggleSelection = (id: string) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const toggleAll = () => setSelectedIds(allSelected ? [] : sightings.map((item) => item.id));

  const exportData = async (format: "json" | "csv") => {
    if (selectedSightings.length === 0) {
      Alert.alert("Selecione registros", "Escolha pelo menos um avistamento antes de exportar.");
      return;
    }
    const hasExactPrivate = selectedSightings.some((item) => item.visibility === "private" && item.locationPrecision === "exact" && item.latitude !== undefined && item.longitude !== undefined);
    if (hasExactPrivate) {
      const confirmed = await new Promise<boolean>((resolve) => Alert.alert("Localização exata", "Alguns registros privados têm coordenadas exatas. Eles serão exportados sem mascaramento.", [{ text: "Cancelar", style: "cancel", onPress: () => resolve(false) }, { text: "Continuar", onPress: () => resolve(true) }]));
      if (!confirmed) return;
    }
    setExporting(true);
    try {
      const content = format === "json" ? createExportJson(selectedSightings) : createExportCsv(selectedSightings);
      const uri = `${FileSystem.cacheDirectory}pantanal-dex-avistamentos.${format}`;
      await FileSystem.writeAsStringAsync(uri, content);
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
      else Alert.alert("Arquivo pronto", uri);
    } catch {
      Alert.alert("Exportação não concluída", "Não foi possível criar ou compartilhar o arquivo. Seus registros locais foram preservados.");
    } finally {
      setExporting(false);
    }
  };

  const toggleLanguage = async (language: string) => {
    const exists = settings.quickLanguages.includes(language);
    const next = exists ? settings.quickLanguages.filter((item) => item !== language) : [...settings.quickLanguages, language];
    await setSettings({ ...settings, quickLanguages: next.length ? next : [language] });
  };

  const moveLanguage = async (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= settings.quickLanguages.length) return;
    const next = [...settings.quickLanguages];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    await setSettings({ ...settings, quickLanguages: next });
  };

  return <ScreenContainer className="px-5"><ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
    <Text style={{ color: colors.foreground, fontSize: 30, fontWeight: "800", paddingTop: 18 }}>Configurações</Text>
    <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 24 }}>Ajuste o PantanalDex ao seu campo</Text>
    <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 15, marginBottom: 24 }} accessibilityRole="summary">
      <Text style={{ color: colors.foreground, fontWeight: "800" }}>{ready ? "Caderno disponível offline" : "Restaurando caderno local…"}</Text>
      <Text style={{ color: colors.muted, marginTop: 5 }}>{ready ? `${sightings.length} registro(s) e preferências carregados neste aparelho.` : "Aguarde alguns instantes antes de editar ou exportar registros."}</Text>
    </View>
    <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>Idioma padrão</Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12, marginBottom: 24 }}>{languages.map((language) => <Pressable key={language} onPress={() => setSettings({ ...settings, defaultLanguage: language })} accessibilityRole="radio" accessibilityState={{ selected: settings.defaultLanguage === language }} style={{ backgroundColor: settings.defaultLanguage === language ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 }}><Text style={{ color: settings.defaultLanguage === language ? "#fff" : colors.foreground, fontWeight: "700" }}>{language}</Text></Pressable>)}</View>
    <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>Idiomas na barra rápida</Text>
    <Text style={{ color: colors.muted, marginTop: 5, marginBottom: 12 }}>Toque para ativar e use as setas para definir a ordem.</Text>
    {settings.quickLanguages.map((language, index) => <View key={language} style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 10, marginBottom: 8 }}><Text style={{ color: colors.foreground, fontWeight: "700", flex: 1 }}>{index + 1}. {language}</Text><Pressable accessibilityLabel={`Mover ${language} para cima`} accessibilityRole="button" disabled={index === 0} onPress={() => moveLanguage(index, -1)} style={{ padding: 8, opacity: index === 0 ? 0.35 : 1 }}><Text style={{ color: colors.primary, fontSize: 18, fontWeight: "800" }}>↑</Text></Pressable><Pressable accessibilityLabel={`Mover ${language} para baixo`} accessibilityRole="button" disabled={index === settings.quickLanguages.length - 1} onPress={() => moveLanguage(index, 1)} style={{ padding: 8, opacity: index === settings.quickLanguages.length - 1 ? 0.35 : 1 }}><Text style={{ color: colors.primary, fontSize: 18, fontWeight: "800" }}>↓</Text></Pressable><Pressable accessibilityLabel={`Alternar ${language}`} accessibilityRole="button" onPress={() => toggleLanguage(language)} style={{ padding: 8 }}><Text style={{ color: colors.error, fontWeight: "800", fontSize: 12 }}>Remover</Text></Pressable></View>)}
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>{languages.filter((language) => !settings.quickLanguages.includes(language)).map((language) => <Pressable key={language} onPress={() => toggleLanguage(language)} accessibilityRole="button" style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9 }}><Text style={{ color: colors.foreground, fontWeight: "700", fontSize: 12 }}>+ {language}</Text></Pressable>)}</View>
    <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800", marginTop: 22, marginBottom: 12 }}>Exportar meus dados</Text>
    <Text style={{ color: colors.muted, marginBottom: 12 }}>Selecione quais registros serão copiados. Registros compartilháveis saem com localização aproximada para proteger pontos sensíveis.</Text>
    <Pressable onPress={toggleAll} accessibilityRole="checkbox" accessibilityState={{ checked: allSelected }} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}><View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: colors.primary, backgroundColor: allSelected ? colors.primary : colors.surface, marginRight: 8, alignItems: "center", justifyContent: "center" }}>{allSelected && <Text style={{ color: "#fff", fontWeight: "800" }}>✓</Text>}</View><Text style={{ color: colors.foreground, fontWeight: "800" }}>{allSelected ? "Desmarcar todos" : "Selecionar todos"} · {selectedSightings.length}/{sightings.length}</Text></Pressable>
    {sightings.map((item) => <Pressable key={item.id} onPress={() => toggleSelection(item.id)} accessibilityRole="checkbox" accessibilityState={{ checked: selectedIds.includes(item.id) }} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}><View style={{ width: 18, height: 18, borderRadius: 5, borderWidth: 1, borderColor: colors.border, backgroundColor: selectedIds.includes(item.id) ? colors.primary : colors.surface, marginRight: 9, alignItems: "center", justifyContent: "center" }}>{selectedIds.includes(item.id) && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}</View><Text style={{ color: colors.foreground, flex: 1 }}>{item.date} · {species.find((entry) => entry.id === item.speciesId)?.commonName ?? "Espécie não catalogada"}</Text></Pressable>)}
    <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}><Pressable disabled={exporting || selectedSightings.length === 0} onPress={() => exportData("json")} accessibilityRole="button" style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 14, padding: 14, opacity: exporting || selectedSightings.length === 0 ? 0.6 : 1 }}><Text style={{ color: "#fff", textAlign: "center", fontWeight: "800" }}>{exporting ? "Preparando…" : "JSON"}</Text></Pressable><Pressable disabled={exporting || selectedSightings.length === 0} onPress={() => exportData("csv")} accessibilityRole="button" style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 14, padding: 14, opacity: exporting || selectedSightings.length === 0 ? 0.6 : 1 }}><Text style={{ color: "#fff", textAlign: "center", fontWeight: "800" }}>CSV</Text></Pressable></View>
    <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginTop: 26 }}><Text style={{ color: colors.foreground, fontWeight: "800" }}>PantanalDex 1.0</Text><Text style={{ color: colors.muted, marginTop: 5, lineHeight: 20 }}>Catálogo local e caderno de campo para conhecer e registrar os animais do Pantanal.</Text></View>
  </ScrollView></ScreenContainer>;
}
