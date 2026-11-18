/**
 * PantanalDex — Gerenciamento de cadernos: escolher o caderno ativo, criar, renomear, apagar, juntar,
 * importar (JSON, CSV ou GeoJSON) e exportar, com o histórico dos cadernos exportados.
 *
 * @author Felipe de Souza Aquino
 */
import { isImportSizeOk } from "@/shared/safe-url";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Switch, View } from "react-native";

import { NOTEBOOK_ICON } from "@/components/NotebookBar";
import { ScreenContainer } from "@/components/screen-container";
import { Text, TextInput } from "@/components/T";
import { useApp, type NotebookImportMode } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";
import { filterSpeciesCatalog } from "@/shared/catalog";
import { exportNotebookFile, notebookFileName, parseNotebookFile } from "@/shared/notebook-files";
import { countByNotebook, MAIN_NOTEBOOK_ID, sightingsIn, TEST_NOTEBOOK_ID, type Notebook, type NotebookFileFormat } from "@/shared/notebooks";

const KIND_LABEL = { main: "Caderno principal", test: "Exemplos para testar", custom: "Criado por você", imported: "Importado" } as const;
const FORMATS: NotebookFileFormat[] = ["json", "csv", "geojson"];

export default function NotebooksScreen() {
  const colors = useColors();
  const app = useApp();
  const { notebooks, sightings, activeNotebookId, notebookExports, ready } = app;
  const counts = useMemo(() => countByNotebook(sightings), [sightings]);
  const catalog = useMemo(() => filterSpeciesCatalog(), []);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);
  const [mergeSources, setMergeSources] = useState<string[]>([]);
  const [mergeTarget, setMergeTarget] = useState<string>(MAIN_NOTEBOOK_ID);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [busy, setBusy] = useState(false);

  const own = notebooks.filter((item) => item.kind !== "imported");
  const imported = notebooks.filter((item) => item.kind === "imported");
  const toMove = mergeSources.filter((id) => id !== mergeTarget).reduce((sum, id) => sum + (counts[id] ?? 0), 0);

  const run = async (task: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    try { await task(); } catch (error) { Alert.alert("Não deu certo", error instanceof Error ? error.message : "Tente de novo."); } finally { setBusy(false); }
  };

  const exportNotebooks = (ids: string[], format: NotebookFileFormat) => run(async () => {
    const chosen = ids.flatMap((id) => sightingsIn(sightings, id));
    if (!chosen.length) { Alert.alert("Caderno vazio", "Não há registros para exportar."); return; }
    const exact = chosen.some((item) => item.visibility === "private" && item.locationPrecision === "exact" && item.latitude !== undefined);
    if (exact) {
      const ok = await new Promise<boolean>((resolve) => Alert.alert("Localização exata", "Alguns registros privados têm coordenadas exatas e sairão sem mascaramento.", [{ text: "Cancelar", style: "cancel", onPress: () => resolve(false) }, { text: "Continuar", onPress: () => resolve(true) }]));
      if (!ok) return;
    }
    const names = ids.map((id) => notebooks.find((item) => item.id === id)?.name ?? id);
    const uri = `${FileSystem.cacheDirectory}${notebookFileName(names, format)}`;
    await FileSystem.writeAsStringAsync(uri, exportNotebookFile(format, chosen, notebooks, catalog));
    await app.recordNotebookExport(ids, format, chosen.length);
    if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(uri);
    else Alert.alert("Arquivo pronto", uri);
  });

  const importFile = () => run(async () => {
    const pick = await DocumentPicker.getDocumentAsync({ type: ["application/json", "application/geo+json", "text/csv", "text/plain", "*/*"], copyToCacheDirectory: true });
    if (pick.canceled) return;
    const asset = pick.assets[0];
    if (!isImportSizeOk(asset.size)) { Alert.alert("Arquivo grande demais", "O limite é 5 MB. Exporte cadernos menores e importe um por vez."); return; }
    const parsed = parseNotebookFile(await FileSystem.readAsStringAsync(asset.uri));
    if (!parsed.sightings.length) { Alert.alert("Nada para importar", "O arquivo não tem registros válidos."); return; }
    const options: { text: string; mode: NotebookImportMode }[] = [{ text: "Criar caderno novo", mode: "new" }];
    if (parsed.notebookNames.length) options.push({ text: `Separar em ${parsed.notebookNames.length} caderno(s) do arquivo`, mode: "split" });
    options.push({ text: "Juntar no caderno ativo", mode: "active" });
    const mode = await new Promise<NotebookImportMode | null>((resolve) => Alert.alert(
      `Importar ${parsed.format.toUpperCase()}`,
      `${parsed.sightings.length} registro(s) válido(s)${parsed.skipped ? `, ${parsed.skipped} ignorado(s)` : ""}. Onde colocar?`,
      [...options.map((option) => ({ text: option.text, onPress: () => resolve(option.mode) })), { text: "Cancelar", style: "cancel" as const, onPress: () => resolve(null) }],
    ));
    if (!mode) return;
    const result = await app.importNotebookFile(parsed, mode, asset.name);
    Alert.alert("Importação concluída", `${result.added} adicionado(s), ${result.updated} atualizado(s).${result.notebookNames.length ? `\nCaderno(s): ${result.notebookNames.join(", ")}` : ""}`);
  });

  const askDelete = (notebook: Notebook) => {
    const n = counts[notebook.id] ?? 0;
    const buttons: { text: string; style?: "cancel" | "destructive"; onPress?: () => void }[] = [{ text: "Cancelar", style: "cancel" }];
    if (n) buttons.push({ text: "Mover registros para o Principal", onPress: () => void run(async () => { await app.deleteNotebook(notebook.id, "move"); }) });
    buttons.push({ text: n ? `Apagar com ${n} registro(s)` : "Apagar caderno", style: "destructive", onPress: () => void run(async () => { await app.deleteNotebook(notebook.id, "delete"); }) });
    Alert.alert(`Apagar "${notebook.name}"?`, n ? "Escolha o que fazer com os registros. Apagar registros não tem volta." : "O caderno está vazio.", buttons);
  };

  const button = (label: string, onPress: () => void, variant: "solid" | "outline" | "danger" = "outline", disabled = false) => (
    <Pressable key={label} onPress={onPress} disabled={disabled || busy} accessibilityRole="button" accessibilityLabel={label}
      style={({ pressed }) => ({ borderRadius: 12, paddingHorizontal: 12, minHeight: 40, justifyContent: "center", borderWidth: 1, borderColor: variant === "danger" ? colors.error : colors.primary, backgroundColor: variant === "solid" ? colors.primary : "transparent", opacity: disabled ? 0.45 : pressed ? 0.8 : 1 })}>
      <Text style={{ color: variant === "solid" ? colors.background : variant === "danger" ? colors.error : colors.primary, fontWeight: "800", fontSize: 13 }}>{label}</Text>
    </Pressable>
  );

  const section = (title: string, hint?: string) => (
    <View style={{ marginTop: 26, marginBottom: 10 }}>
      <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 19, fontWeight: "800" }}>{title}</Text>
      {hint ? <Text style={{ color: colors.muted, marginTop: 4 }}>{hint}</Text> : null}
    </View>
  );

  const card = (notebook: Notebook) => {
    const isRenaming = renaming?.id === notebook.id;
    const active = notebook.id === activeNotebookId;
    return (
      <View key={notebook.id} style={{ backgroundColor: colors.surface, borderColor: active ? colors.primary : colors.border, borderWidth: active ? 2 : 1, borderRadius: 16, padding: 14, marginBottom: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 26 }}>{NOTEBOOK_ICON[notebook.kind]}</Text>
          <View style={{ flex: 1 }}>
            {isRenaming ? (
              <TextInput value={renaming.name} onChangeText={(name) => setRenaming({ id: notebook.id, name })} autoFocus maxLength={40}
                style={{ color: colors.foreground, borderColor: colors.primary, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, fontWeight: "800" }} />
            ) : (
              <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: "800" }}>{notebook.name}</Text>
            )}
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>
              {KIND_LABEL[notebook.kind]} · {counts[notebook.id] ?? 0} registro(s){notebook.source ? ` · ${notebook.source.format.toUpperCase()}${notebook.source.fileName ? ` (${notebook.source.fileName})` : ""}` : ""}
            </Text>
          </View>
          {active ? <View style={{ backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}><Text style={{ color: colors.background, fontWeight: "800", fontSize: 11 }}>ATIVO</Text></View> : null}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {isRenaming ? [
            button("Salvar nome", () => void run(async () => { await app.renameNotebook(notebook.id, renaming.name); setRenaming(null); }), "solid"),
            button("Cancelar", () => setRenaming(null)),
          ] : [
            !active && button("Usar para novos registros", () => void run(() => app.setActiveNotebook(notebook.id)), "solid"),
            notebook.id === TEST_NOTEBOOK_ID && button("Recarregar exemplos", () => void run(async () => { const n = await app.resetTestNotebook(); Alert.alert("Caderno Teste", `${n} exemplos prontos para testar.`); })),
            notebook.kind !== "main" && button("Renomear", () => setRenaming({ id: notebook.id, name: notebook.name })),
            notebook.kind !== "main" && button("Apagar", () => askDelete(notebook), "danger"),
          ]}
        </View>
        {!isRenaming && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700" }}>Exportar:</Text>
            {FORMATS.map((format) => button(format.toUpperCase(), () => exportNotebooks([notebook.id], format), "outline", !(counts[notebook.id] ?? 0)))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer className="px-5">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/sightings" as never))} accessibilityRole="button">
          <Text style={{ color: colors.primary, fontWeight: "700", paddingVertical: 10 }}>‹ Voltar</Text>
        </Pressable>
        <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 30, fontWeight: "800" }}>Cadernos</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>Separe seus avistamentos por viagem, projeto ou turma. Tudo funciona offline e viaja em JSON, CSV ou GeoJSON.</Text>
        {!ready ? <ActivityIndicator style={{ marginTop: 30 }} color={colors.primary} /> : null}
        {busy ? <ActivityIndicator style={{ marginTop: 12 }} color={colors.primary} /> : null}

        {section("Meus cadernos", "O caderno ativo recebe os novos avistamentos.")}
        {own.map(card)}
        <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
          <TextInput value={newName} onChangeText={setNewName} placeholder="Nome do novo caderno (ex.: Viagem a Poconé)" placeholderTextColor={colors.muted} maxLength={40}
            style={{ flex: 1, color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, minHeight: 44 }} />
          {button("Criar", () => void run(async () => { const made = await app.createNotebook(newName); setNewName(""); Alert.alert("Caderno criado", `"${made.name}" está pronto. Toque em "Usar para novos registros" para ativá-lo.`); }), "solid", !newName.trim())}
        </View>

        {section("Cadernos importados", "Arquivos do PantanalDex que você trouxe de outro aparelho ou pessoa.")}
        {imported.length ? imported.map(card) : <Text style={{ color: colors.muted }}>Nenhum caderno importado ainda.</Text>}
        <View style={{ marginTop: 10 }}>{button("📂 Importar arquivo (JSON, CSV ou GeoJSON)", importFile, "solid")}</View>

        {section("Juntar cadernos", "Marque os cadernos de origem e escolha o destino. Os registros são movidos para o destino.")}
        <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 14 }}>
          <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700", marginBottom: 6 }}>DE (origem)</Text>
          {notebooks.map((item) => {
            const checked = mergeSources.includes(item.id);
            const disabled = item.id === mergeTarget;
            return (
              <Pressable key={item.id} disabled={disabled} onPress={() => setMergeSources((list) => (checked ? list.filter((id) => id !== item.id) : [...list, item.id]))}
                accessibilityRole="checkbox" accessibilityState={{ checked, disabled }} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 7, opacity: disabled ? 0.4 : 1 }}>
                <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.primary, backgroundColor: checked && !disabled ? colors.primary : "transparent", marginRight: 10, alignItems: "center", justifyContent: "center" }}>
                  {checked && !disabled ? <Text style={{ color: colors.background, fontWeight: "900", fontSize: 13 }}>✓</Text> : null}
                </View>
                <Text style={{ color: colors.foreground, flex: 1 }}>{NOTEBOOK_ICON[item.kind]} {item.name}</Text>
                <Text style={{ color: colors.muted }}>{counts[item.id] ?? 0}</Text>
              </Pressable>
            );
          })}
          <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700", marginTop: 12, marginBottom: 6 }}>PARA (destino)</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {notebooks.map((item) => (
              <Pressable key={item.id} onPress={() => setMergeTarget(item.id)} accessibilityRole="radio" accessibilityState={{ selected: mergeTarget === item.id }}
                style={{ borderRadius: 999, borderWidth: 1, borderColor: colors.primary, backgroundColor: mergeTarget === item.id ? colors.primary : "transparent", paddingHorizontal: 12, paddingVertical: 7 }}>
                <Text style={{ color: mergeTarget === item.id ? colors.background : colors.primary, fontWeight: "800", fontSize: 12 }}>{item.name}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
            <Text style={{ color: colors.foreground, flex: 1 }}>Remover registros repetidos (mesmo animal, data, hora e local)</Text>
            <Switch value={removeDuplicates} onValueChange={setRemoveDuplicates} trackColor={{ true: colors.primary, false: colors.border }} />
          </View>
          <View style={{ marginTop: 12 }}>
            {button(toMove ? `Juntar ${toMove} registro(s) em "${notebooks.find((n) => n.id === mergeTarget)?.name ?? ""}"` : "Escolha cadernos de origem com registros", () => void run(async () => {
              const result = await app.mergeNotebooks(mergeSources, mergeTarget, removeDuplicates);
              setMergeSources([]);
              Alert.alert("Cadernos juntados", `${result.moved} registro(s) movido(s)${result.duplicatesRemoved ? ` e ${result.duplicatesRemoved} repetido(s) removido(s)` : ""}. Os cadernos de origem continuam existindo (vazios); apague-os se quiser.`);
            }), "solid", !toMove)}
          </View>
        </View>

        {section("Cadernos exportados", "Histórico das exportações deste aparelho. Toque para gerar o arquivo de novo com os dados atuais.")}
        {notebookExports.length ? notebookExports.map((item) => {
          const stillThere = item.notebookIds.filter((id) => notebooks.some((n) => n.id === id));
          return (
            <View key={item.id} style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 8 }}>
              <View style={{ backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}><Text style={{ color: colors.background, fontWeight: "900", fontSize: 11 }}>{item.format.toUpperCase()}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontWeight: "800" }}>{item.notebookNames.join(" + ")}</Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>{new Date(item.exportedAt).toLocaleString("pt-BR")} · {item.count} registro(s)</Text>
              </View>
              {button("Exportar de novo", () => exportNotebooks(stillThere, item.format), "outline", !stillThere.length)}
            </View>
          );
        }) : <Text style={{ color: colors.muted }}>Nenhuma exportação ainda. Use os botões JSON, CSV ou GeoJSON de um caderno.</Text>}
        {notebooks.length > 1 && <View style={{ marginTop: 10, flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700", alignSelf: "center" }}>Todos os cadernos:</Text>
          {FORMATS.map((format) => button(format.toUpperCase(), () => exportNotebooks(notebooks.map((n) => n.id), format), "outline", !sightings.length))}
        </View>}
      </ScrollView>
    </ScreenContainer>
  );
}
