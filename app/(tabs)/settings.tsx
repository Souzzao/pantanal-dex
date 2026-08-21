import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

import { ScreenContainer } from "@/components/screen-container";
import { createExportCsv, createExportJson, useApp } from "@/contexts/AppContext";
import { languages } from "@/shared/pantanal";
import { useColors } from "@/hooks/use-colors";

export default function SettingsScreen() {
  const colors = useColors();
  const { sightings, settings, setSettings } = useApp();
  const [exporting, setExporting] = useState(false);

  const exportData = async (format: "json" | "csv") => {
    setExporting(true);
    try {
      const content = format === "json" ? createExportJson(sightings) : createExportCsv(sightings);
      const uri = `${FileSystem.cacheDirectory}pantanal-dex-avistamentos.${format}`;
      await FileSystem.writeAsStringAsync(uri, content);
      if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
      else Alert.alert("Arquivo pronto", uri);
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
    <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>Idioma padrão</Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12, marginBottom: 24 }}>{languages.map((language) => <Pressable key={language} onPress={() => setSettings({ ...settings, defaultLanguage: language })} style={{ backgroundColor: settings.defaultLanguage === language ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 }}><Text style={{ color: settings.defaultLanguage === language ? "#fff" : colors.foreground, fontWeight: "700" }}>{language}</Text></Pressable>)}</View>
    <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>Idiomas na barra rápida</Text>
    <Text style={{ color: colors.muted, marginTop: 5, marginBottom: 12 }}>Toque para ativar e use as setas para definir a ordem.</Text>
    {settings.quickLanguages.map((language, index) => <View key={language} style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 10, marginBottom: 8 }}><Text style={{ color: colors.foreground, fontWeight: "700", flex: 1 }}>{index + 1}. {language}</Text><Pressable accessibilityLabel={`Mover ${language} para cima`} disabled={index === 0} onPress={() => moveLanguage(index, -1)} style={{ padding: 8, opacity: index === 0 ? 0.35 : 1 }}><Text style={{ color: colors.primary, fontSize: 18, fontWeight: "800" }}>↑</Text></Pressable><Pressable accessibilityLabel={`Mover ${language} para baixo`} disabled={index === settings.quickLanguages.length - 1} onPress={() => moveLanguage(index, 1)} style={{ padding: 8, opacity: index === settings.quickLanguages.length - 1 ? 0.35 : 1 }}><Text style={{ color: colors.primary, fontSize: 18, fontWeight: "800" }}>↓</Text></Pressable><Pressable accessibilityLabel={`Alternar ${language}`} onPress={() => toggleLanguage(language)} style={{ padding: 8 }}><Text style={{ color: colors.error, fontWeight: "800", fontSize: 12 }}>Remover</Text></Pressable></View>)}
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>{languages.filter((language) => !settings.quickLanguages.includes(language)).map((language) => <Pressable key={language} onPress={() => toggleLanguage(language)} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9 }}><Text style={{ color: colors.foreground, fontWeight: "700", fontSize: 12 }}>+ {language}</Text></Pressable>)}</View>
    <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800", marginTop: 22, marginBottom: 12 }}>Exportar meus dados</Text>
    <Text style={{ color: colors.muted, marginBottom: 12 }}>Seus {sightings.length} registros serão copiados sem apagar o conteúdo local.</Text>
    <View style={{ flexDirection: "row", gap: 10 }}><Pressable disabled={exporting} onPress={() => exportData("json")} style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 14, padding: 14, opacity: exporting ? 0.6 : 1 }}><Text style={{ color: "#fff", textAlign: "center", fontWeight: "800" }}>JSON</Text></Pressable><Pressable disabled={exporting} onPress={() => exportData("csv")} style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 14, padding: 14, opacity: exporting ? 0.6 : 1 }}><Text style={{ color: "#fff", textAlign: "center", fontWeight: "800" }}>CSV</Text></Pressable></View>
    <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginTop: 26 }}><Text style={{ color: colors.foreground, fontWeight: "800" }}>PantanalDex 1.0</Text><Text style={{ color: colors.muted, marginTop: 5, lineHeight: 20 }}>Catálogo local e caderno de campo para conhecer e registrar os animais do Pantanal.</Text></View>
  </ScrollView></ScreenContainer>;
}
