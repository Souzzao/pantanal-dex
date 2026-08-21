import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";

import { ScreenContainer } from "@/components/screen-container";
import { createExportCsv, createExportJson, useApp } from "@/contexts/AppContext";
import { parseExportJson } from "@/shared/exports";
import { languages, validateSpeciesCatalog } from "@/shared/pantanal";
import { catalogCoverage, catalogReview, filterSpeciesCatalog } from "@/shared/catalog";
import { useColors } from "@/hooks/use-colors";

export default function SettingsScreen() {
  const colors = useColors();
  const { sightings, settings, ready, storage, setSettings, importSightings, clearSightings } = useApp();
  const english = settings.defaultLanguage === "English";
  const spanish = settings.defaultLanguage === "Español";
  const labels = english ? { title: "Settings", subtitle: "Adapt PantanalDex to your field work", ready: "Notebook available offline", restoring: "Restoring local notebook…", loaded: "records and preferences loaded on this device", wait: "Wait a moment before editing or exporting records.", storageIssue: "Some local data needs attention. The recovered records remain available; export a backup before clearing storage. If saving fails, keep this screen open and retry after freeing device storage.", reviewTitle: "Catalog under editorial review", reviewDetail: (species: number, batches: number) => `${species} species in ${batches} batch(es) await license and source audit.` } : spanish ? { title: "Configuración", subtitle: "Adapta PantanalDex a tu trabajo de campo", ready: "Cuaderno disponible sin conexión", restoring: "Restaurando cuaderno local…", loaded: "registro(s) y preferencias cargados en este dispositivo", wait: "Espera antes de editar o exportar registros.", storageIssue: "Algunos datos locales requieren atención. Los registros recuperados siguen disponibles; exporta una copia antes de borrar el almacenamiento. Si falla el guardado, mantén esta pantalla abierta y vuelve a intentarlo después de liberar espacio.", reviewTitle: "Catálogo en revisión editorial", reviewDetail: (species: number, batches: number) => `${species} especie(s) en ${batches} lote(s) esperan auditoría de licencia y fuente.` } : { title: "Configurações", subtitle: "Ajuste o PantanalDex ao seu campo", ready: "Caderno disponível offline", restoring: "Restaurando caderno local…", loaded: "registro(s) e preferências carregados neste aparelho.", wait: "Aguarde alguns instantes antes de editar ou exportar registros.", storageIssue: "Alguns dados locais precisam de atenção. Os registros recuperados continuam disponíveis; exporte um backup antes de limpar o armazenamento. Se a gravação falhar, mantenha esta tela aberta e tente novamente após liberar espaço no aparelho.", reviewTitle: "Catálogo em revisão editorial", reviewDetail: (species: number, batches: number) => `${species} espécie(s) em ${batches} lote(s) aguardam auditoria de licença e fonte.` };
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const catalogIssues = useMemo(() => validateSpeciesCatalog(), []);
  const catalogById = useMemo(() => new Map(filterSpeciesCatalog().map((item) => [item.id, item.commonName])), []);

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
    if (!ready) {
      Alert.alert("Caderno carregando", labels.wait);
      return;
    }
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

  const importData = async () => {
    if (!ready) {
      Alert.alert("Caderno carregando", labels.wait);
      return;
    }
    setImporting(true);
    try {
      const pickResult = await DocumentPicker.getDocumentAsync({ type: "application/json", copyToCacheDirectory: true });
      if (pickResult.canceled) return;
      const asset = pickResult.assets[0];
      const content = await FileSystem.readAsStringAsync(asset.uri);
      const imported = parseExportJson(content);
      if (!imported.length) {
        Alert.alert("Arquivo inválido", "Escolha um JSON exportado pelo PantanalDex com registros válidos.");
        return;
      }
      const confirmed = await new Promise<boolean>((resolve) => Alert.alert("Importar registros", `${imported.length} registro(s) válido(s) serão combinados com o caderno atual. Registros mais novos substituem versões antigas com o mesmo ID.`, [{ text: "Cancelar", style: "cancel", onPress: () => resolve(false) }, { text: "Importar", onPress: () => resolve(true) }]));
      if (!confirmed) return;
      const mergeResult = await importSightings(imported);
      Alert.alert("Importação concluída", `${mergeResult.added} adicionado(s), ${mergeResult.updated} atualizado(s) e ${mergeResult.skipped} ignorado(s).`);
    } catch {
      Alert.alert("Importação não concluída", "Não foi possível ler o arquivo. Os registros locais foram preservados.");
    } finally {
      setImporting(false);
    }
  };

  const clearLocalSightings = () => Alert.alert("Apagar caderno?", "Todos os avistamentos locais serão removidos deste aparelho. Exportar um backup antes é recomendado.", [{ text: "Cancelar", style: "cancel" }, { text: "Apagar tudo", style: "destructive", onPress: async () => { try { await clearSightings(); setSelectedIds([]); Alert.alert("Caderno limpo", "Os avistamentos foram removidos deste aparelho."); } catch { Alert.alert("Não foi possível apagar", "Os registros locais foram preservados. Tente novamente."); } } }]);

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
    <Text style={{ color: colors.foreground, fontSize: 30, fontWeight: "800", paddingTop: 18 }}>{labels.title}</Text>
    <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 24 }}>{labels.subtitle}</Text>
    <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 15, marginBottom: 24 }} accessibilityRole="summary">
      <Text style={{ color: colors.foreground, fontWeight: "800" }}>{ready ? labels.ready : labels.restoring}</Text>
      <Text style={{ color: colors.muted, marginTop: 5 }}>{ready ? `${sightings.length} ${labels.loaded}` : labels.wait}</Text>
    </View>
    {ready && (storage.readError || storage.writeError || storage.sightings === "corrupted" || storage.sightings === "unsupported-version" || storage.settings === "corrupted" || storage.settings === "unsupported-version") && <View style={{ backgroundColor: colors.surface, borderColor: colors.warning, borderWidth: 1, borderRadius: 14, padding: 13, marginBottom: 22 }} accessibilityRole="alert" accessibilityLiveRegion="polite"><Text style={{ color: colors.foreground, fontWeight: "800" }}>{english ? "Local storage warning" : spanish ? "Aviso del almacenamiento local" : "Atenção ao armazenamento local"}</Text><Text style={{ color: colors.muted, marginTop: 5 }}>{labels.storageIssue}</Text></View>}
    <View style={{ backgroundColor: colors.surface, borderColor: catalogIssues.length || catalogReview.pendingBatches ? colors.warning : colors.border, borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 22 }} accessibilityRole="summary"><Text style={{ color: colors.foreground, fontWeight: "800" }}>{catalogIssues.length ? "Revisão do catálogo necessária" : catalogReview.pendingBatches ? labels.reviewTitle : "Catálogo local íntegro"}</Text><Text style={{ color: colors.muted, marginTop: 4 }}>{catalogIssues.length ? `${catalogIssues.length} pendência(s) editorial(is) detectada(s).` : catalogReview.pendingBatches ? labels.reviewDetail(catalogReview.pendingSpecies, catalogReview.pendingBatches) : `${catalogCoverage.species} espécies com imagens, créditos e fontes estruturadas.`}</Text></View>
    <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>Idioma padrão</Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12, marginBottom: 24 }}>{languages.map((language) => <Pressable key={language} onPress={() => setSettings({ ...settings, defaultLanguage: language })} accessibilityRole="radio" accessibilityState={{ selected: settings.defaultLanguage === language }} style={{ backgroundColor: settings.defaultLanguage === language ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 }}><Text style={{ color: settings.defaultLanguage === language ? "#fff" : colors.foreground, fontWeight: "700" }}>{language}</Text></Pressable>)}</View>
    <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>Idiomas na barra rápida</Text>
    <Text style={{ color: colors.muted, marginTop: 5, marginBottom: 12 }}>Toque para ativar e use as setas para definir a ordem.</Text>
    {settings.quickLanguages.map((language, index) => <View key={language} style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 10, marginBottom: 8 }}><Text style={{ color: colors.foreground, fontWeight: "700", flex: 1 }}>{index + 1}. {language}</Text><Pressable accessibilityLabel={`Mover ${language} para cima`} accessibilityRole="button" disabled={index === 0} onPress={() => moveLanguage(index, -1)} style={{ padding: 8, opacity: index === 0 ? 0.35 : 1 }}><Text style={{ color: colors.primary, fontSize: 18, fontWeight: "800" }}>↑</Text></Pressable><Pressable accessibilityLabel={`Mover ${language} para baixo`} accessibilityRole="button" disabled={index === settings.quickLanguages.length - 1} onPress={() => moveLanguage(index, 1)} style={{ padding: 8, opacity: index === settings.quickLanguages.length - 1 ? 0.35 : 1 }}><Text style={{ color: colors.primary, fontSize: 18, fontWeight: "800" }}>↓</Text></Pressable><Pressable accessibilityLabel={`Alternar ${language}`} accessibilityRole="button" onPress={() => toggleLanguage(language)} style={{ padding: 8 }}><Text style={{ color: colors.error, fontWeight: "800", fontSize: 12 }}>Remover</Text></Pressable></View>)}
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>{languages.filter((language) => !settings.quickLanguages.includes(language)).map((language) => <Pressable key={language} onPress={() => toggleLanguage(language)} accessibilityRole="button" style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 9 }}><Text style={{ color: colors.foreground, fontWeight: "700", fontSize: 12 }}>+ {language}</Text></Pressable>)}</View>
    <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800", marginTop: 22, marginBottom: 12 }}>Exportar meus dados</Text>
    <Text style={{ color: colors.muted, marginBottom: 12 }}>Selecione quais registros serão copiados. Registros compartilháveis saem com localização aproximada para proteger pontos sensíveis.</Text>
    <Pressable onPress={toggleAll} accessibilityRole="checkbox" accessibilityState={{ checked: allSelected }} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}><View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: colors.primary, backgroundColor: allSelected ? colors.primary : colors.surface, marginRight: 8, alignItems: "center", justifyContent: "center" }}>{allSelected && <Text style={{ color: "#fff", fontWeight: "800" }}>✓</Text>}</View><Text style={{ color: colors.foreground, fontWeight: "800" }}>{allSelected ? "Desmarcar todos" : "Selecionar todos"} · {selectedSightings.length}/{sightings.length}</Text></Pressable>
    {sightings.map((item) => <Pressable key={item.id} onPress={() => toggleSelection(item.id)} accessibilityRole="checkbox" accessibilityState={{ checked: selectedIds.includes(item.id) }} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}><View style={{ width: 18, height: 18, borderRadius: 5, borderWidth: 1, borderColor: colors.border, backgroundColor: selectedIds.includes(item.id) ? colors.primary : colors.surface, marginRight: 9, alignItems: "center", justifyContent: "center" }}>{selectedIds.includes(item.id) && <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>}</View><Text style={{ color: colors.foreground, flex: 1 }}>{item.date} · {catalogById.get(item.speciesId) ?? "Espécie não catalogada"}</Text></Pressable>)}
    <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}><Pressable disabled={!ready || exporting || importing || selectedSightings.length === 0} onPress={() => exportData("json")} accessibilityRole="button" accessibilityLabel="Exportar registros em JSON" accessibilityState={{ disabled: !ready || exporting || importing || selectedSightings.length === 0, busy: exporting }} style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 14, padding: 14, opacity: exporting || selectedSightings.length === 0 ? 0.6 : 1 }}><Text style={{ color: "#fff", textAlign: "center", fontWeight: "800" }}>{exporting ? "Preparando…" : "JSON"}</Text></Pressable><Pressable disabled={!ready || exporting || importing || selectedSightings.length === 0} onPress={() => exportData("csv")} accessibilityRole="button" accessibilityLabel="Exportar registros em CSV" accessibilityState={{ disabled: !ready || exporting || importing || selectedSightings.length === 0, busy: exporting }} style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 14, padding: 14, opacity: exporting || importing || selectedSightings.length === 0 ? 0.6 : 1 }}><Text style={{ color: "#fff", textAlign: "center", fontWeight: "800" }}>CSV</Text></Pressable></View>
    <Pressable onPress={importData} disabled={!ready || importing || exporting} accessibilityRole="button" accessibilityLabel="Importar JSON do PantanalDex" accessibilityState={{ disabled: !ready || importing || exporting, busy: importing }} style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 12, opacity: importing || exporting ? 0.6 : 1 }}><Text style={{ color: colors.primary, textAlign: "center", fontWeight: "800" }}>{importing ? "Lendo arquivo…" : "Importar JSON do PantanalDex"}</Text></Pressable>
    <Pressable onPress={clearLocalSightings} disabled={!ready || importing || exporting || sightings.length === 0} accessibilityRole="button" accessibilityLabel="Apagar caderno local" accessibilityState={{ disabled: !ready || importing || exporting || sightings.length === 0 }} style={{ borderColor: colors.error, borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 12, opacity: importing || exporting || sightings.length === 0 ? 0.5 : 1 }}><Text style={{ color: colors.error, textAlign: "center", fontWeight: "800" }}>Apagar caderno local</Text></Pressable>
    <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginTop: 26 }}><Text style={{ color: colors.foreground, fontWeight: "800" }}>PantanalDex 1.0</Text><Text style={{ color: colors.muted, marginTop: 5, lineHeight: 20 }}>Catálogo local e caderno de campo para conhecer e registrar os animais do Pantanal.</Text></View>
  </ScrollView></ScreenContainer>;
}
