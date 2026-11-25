/**
 * PantanalDex — Aba Animais: catálogo com busca, painel de filtros (grupo, ambiente, ameaça IUCN, ordenação) e lista paginada.
 *
 * @author Felipe de Souza Aquino
 */
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "@/components/T";
import { router, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { environments, groups } from "@/shared/pantanal";
import { catalogCoverage, filterSpeciesCatalog, sortSpeciesCatalog } from "@/shared/catalog";
import { useColors } from "@/hooks/use-colors";
import { DisplayText, PressableScale, Reveal } from "@/components/motion";
import { RemoteImage } from "@/components/RemoteImage";
import { gradientFor, groupIcon } from "@/constants/design";

const THREAT: Record<string, string[]> = { ameacadas: ["VU", "EN", "CR"], quase: ["NT"], pouco: ["LC"], semdados: ["DD", ""] };
const THREAT_LABEL: Record<string, string> = { "": "Qualquer status", ameacadas: "Ameaçadas", quase: "Quase ameaçadas", pouco: "Pouco preocupante", semdados: "Sem avaliação" };
const RANK: Record<string, number> = { CR: 0, EN: 1, VU: 2, NT: 3, LC: 4, DD: 5 };
type Sort = "name" | "group" | "threat";

export default function AnimalsScreen() {
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  // Vindo de "Explore por grupo" no início: já abre filtrado.
  const params = useLocalSearchParams<{ group?: string }>();
  useEffect(() => { if (params.group && (groups as string[]).includes(params.group)) setGroup(params.group); }, [params.group]);
  const [environment, setEnvironment] = useState("");
  const [threat, setThreat] = useState("");
  const [onlyNamed, setOnlyNamed] = useState(false);
  const [sortBy, setSortBy] = useState<Sort>("name");
  const [showFilters, setShowFilters] = useState(false);
  const filtered = useMemo(() => {
    let list = filterSpeciesCatalog({ query, group: group as any, environment: environment as any });
    if (threat) list = list.filter((item) => THREAT[threat].includes(item.iucn ?? ""));
    if (onlyNamed) list = list.filter((item) => item.commonName !== item.scientificName);
    if (sortBy === "threat") return [...list].sort((a, b) => (RANK[a.iucn ?? ""] ?? 9) - (RANK[b.iucn ?? ""] ?? 9) || a.commonName.localeCompare(b.commonName, "pt-BR"));
    return sortSpeciesCatalog(list, sortBy);
  }, [query, group, environment, threat, onlyNamed, sortBy]);
  const activeCount = [group, environment, threat].filter(Boolean).length + (onlyNamed ? 1 : 0);
  const clearAll = () => { setQuery(""); setGroup(""); setEnvironment(""); setThreat(""); setOnlyNamed(false); };
  const chip = (label: string, active: boolean, onPress: () => void) => <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected: active }} accessibilityLabel={label} style={{ backgroundColor: active ? colors.primary : colors.surface, borderColor: active ? colors.primary : colors.border, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9 }}><Text style={{ color: active ? colors.background : colors.foreground, fontWeight: "700", fontSize: 12 }}>{label}</Text></Pressable>;
  const row = (title: string, items: [string, string][], value: string, set: (v: string) => void) => (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 6 }}>{title.toUpperCase()}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>{items.map(([key, label]) => <View key={key || "all"}>{chip(label, value === key, () => set(key))}</View>)}</ScrollView>
    </View>
  );
  return <ScreenContainer className="px-5">
    <DisplayText style={{ color: colors.foreground, fontSize: 32, paddingTop: 18 }}>Animais</DisplayText>
    <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 12 }}>{catalogCoverage.species} espécies do Pantanal · {groups.length} grupos · {environments.length} ambientes</Text>
    <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
      <TextInput accessibilityLabel="Buscar animais por nome popular ou científico" value={query} onChangeText={setQuery} placeholder="Nome popular ou científico" placeholderTextColor={colors.muted} style={{ flex: 1, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 14, color: colors.foreground }} />
      <Pressable onPress={() => setShowFilters((v) => !v)} accessibilityRole="button" accessibilityLabel="Filtros" style={{ justifyContent: "center", paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.primary, backgroundColor: showFilters ? colors.primary : colors.surface }}>
        <Text style={{ color: showFilters ? colors.background : colors.primary, fontWeight: "800" }}>Filtros{activeCount ? ` (${activeCount})` : ""}</Text>
      </Pressable>
    </View>
    {showFilters && <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 10 }}>
      {row("Grupo", [["", "Todos"], ...groups.map((g) => [g, g] as [string, string])], group, setGroup)}
      {row("Ambiente", [["", "Todos"], ...environments.map((e) => [e, e] as [string, string])], environment, setEnvironment)}
      {row("Ameaça (IUCN)", Object.entries(THREAT_LABEL), threat, setThreat)}
      {row("Ordenar", [["name", "Nome A–Z"], ["group", "Grupo"], ["threat", "Mais ameaçadas primeiro"]], sortBy, (v) => setSortBy(v as Sort))}
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {chip("Só com nome popular", onlyNamed, () => setOnlyNamed((v) => !v))}
        {activeCount > 0 && chip("Limpar filtros", false, clearAll)}
      </View>
    </View>}
    <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 12 }}>{filtered.length} espécie(s) encontrada(s)</Text>
    <FlatList data={filtered} keyExtractor={(item) => item.id} initialNumToRender={12} windowSize={9} contentContainerStyle={{ paddingBottom: 120 }} ListEmptyComponent={<View style={{ alignItems: "center", paddingTop: 40 }}><Text style={{ color: colors.foreground, textAlign: "center", fontWeight: "800" }}>Nenhum animal encontrado</Text><Text style={{ color: colors.muted, textAlign: "center", marginTop: 6 }}>Tente outro termo ou remova os filtros ativos.</Text>{!!(query || activeCount) && <Pressable onPress={clearAll} accessibilityRole="button" style={{ marginTop: 16, backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12 }}><Text style={{ color: colors.background, fontWeight: "800" }}>Limpar filtros</Text></Pressable>}</View>} renderItem={({ item, index }) => <Reveal index={index}><PressableScale scaleTo={0.97} onPress={() => router.push({ pathname: "/species/[id]", params: { id: item.id } } as any)} accessibilityRole="button" accessibilityLabel={`Abrir ficha de ${item.commonName}`} style={{ flexDirection: "row", backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 10, overflow: "hidden" }}><RemoteImage source={item.images[0]?.uri ? { uri: item.images[0].uri } : undefined} label={item.commonName} style={{ width: 104, height: 104, backgroundColor: colors.border, borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }} /><View style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 12, justifyContent: "center" }}><DisplayText style={{ color: colors.foreground, fontSize: 18 }} numberOfLines={1}>{item.commonName}</DisplayText><Text style={{ color: colors.muted, fontStyle: "italic", marginTop: 2 }} numberOfLines={1}>{item.scientificName}</Text><View style={{ flexDirection: "row", gap: 6, marginTop: 10 }}><Text style={{ color: gradientFor(item.group).glow, fontSize: 11, fontWeight: "800", backgroundColor: gradientFor(item.group).glow + "1F", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3, overflow: "hidden" }}>{groupIcon[item.group]} {item.group}</Text><Text style={{ color: colors.muted, fontSize: 11, fontWeight: "700", paddingVertical: 3 }} numberOfLines={1}>{item.environments[0]}</Text></View></View><Text style={{ color: colors.muted, fontSize: 20, alignSelf: "center", paddingRight: 12 }}>›</Text></PressableScale></Reveal>} />
  </ScreenContainer>;
}
