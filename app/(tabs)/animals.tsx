import { memo, useCallback, useMemo, useState } from "react";
import { FlatList, Platform, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { environments, groups, normalizeCatalogSearch, species, type Species } from "@/shared/pantanal";
import { useColors } from "@/hooks/use-colors";
import { SpeciesImage } from "@/components/species-image";

const CARD_HEIGHT = 112;
const CARD_SEPARATOR = 12;

const SpeciesRow = memo(function SpeciesRow({ item, onPress }: { item: Species; onPress: (id: string) => void }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={() => onPress(item.id)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir ficha de ${item.commonName}, ${item.scientificName}`}
      accessibilityHint="Abre a ficha detalhada da espécie"
      style={({ pressed }) => [
        { flexDirection: "row", height: CARD_HEIGHT, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: "hidden" },
        pressed && { opacity: 0.8 },
      ]}
    >
      <SpeciesImage image={item.images[0]} style={{ width: 112, height: CARD_HEIGHT, backgroundColor: colors.border }} label={`${item.commonName} sem fotografia disponível`} />
      <View style={{ flex: 1, padding: 14 }}>
        <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: "800" }}>{item.commonName}</Text>
        <Text style={{ color: colors.muted, fontStyle: "italic", marginTop: 4 }}>{item.scientificName}</Text>
        <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "700", marginTop: 12 }}>{item.group} · {item.environments[0]}</Text>
      </View>
    </Pressable>
  );
});

export default function AnimalsScreen() {
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [environment, setEnvironment] = useState("");
  const [sortMode, setSortMode] = useState<"name" | "group">("name");

  const filtered = useMemo(() => species
    .filter((item) => {
      const matchesQuery = !query || normalizeCatalogSearch(`${item.commonName} ${item.scientificName}`).includes(normalizeCatalogSearch(query));
      return matchesQuery && (!group || item.group === group) && (!environment || item.environments.includes(environment as never));
    })
    .sort((a, b) => sortMode === "name"
      ? a.commonName.localeCompare(b.commonName, "pt-BR")
      : a.group.localeCompare(b.group, "pt-BR") || a.commonName.localeCompare(b.commonName, "pt-BR")),
  [query, group, environment, sortMode]);

  const hasFilters = Boolean(query.trim() || group || environment);
  const clearFilters = useCallback(() => { setQuery(""); setGroup(""); setEnvironment(""); }, []);
  const openSpecies = useCallback((id: string) => { router.push({ pathname: "/species/[id]", params: { id } } as any); }, []);
  const chip = useCallback((label: string, active: boolean, onPress: () => void) => (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: active }} style={{ backgroundColor: active ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9 }}>
      <Text style={{ color: active ? "#fff" : colors.foreground, fontWeight: "700", fontSize: 12 }}>{label}</Text>
    </Pressable>
  ), [colors]);

  const header = (
    <View>
      <Text style={{ color: colors.foreground, fontSize: 30, fontWeight: "800", paddingTop: 18 }}>Animais</Text>
      <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 16 }}>Explore as espécies do Pantanal</Text>
      <TextInput value={query} onChangeText={setQuery} accessibilityLabel="Buscar animais" accessibilityHint="Digite um nome popular ou científico para filtrar o catálogo" placeholder="Nome popular ou científico" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 14, color: colors.foreground, marginBottom: 12 }} />
      <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "800", marginBottom: 6 }}>Filtrar por grupo</Text>
      <FlatList horizontal showsHorizontalScrollIndicator={false} data={["", ...groups]} keyExtractor={(item) => `g-${item}`} contentContainerStyle={{ gap: 8, paddingBottom: 10 }} renderItem={({ item }) => chip(item || "Todos os grupos", group === item, () => setGroup(item))} />
      <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "800", marginTop: 2, marginBottom: 6 }}>Filtrar por ambiente</Text>
      <FlatList horizontal showsHorizontalScrollIndicator={false} data={["", ...environments]} keyExtractor={(item) => `e-${item}`} contentContainerStyle={{ gap: 8, paddingBottom: 16 }} renderItem={({ item }) => chip(item || "Todos os ambientes", environment === item, () => setEnvironment(item))} />
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}><Text style={{ color: colors.muted, fontSize: 13 }}>{filtered.length} {filtered.length === 1 ? "espécie encontrada" : "espécies encontradas"}</Text>{hasFilters ? <Pressable onPress={clearFilters} accessibilityRole="button" accessibilityLabel="Limpar busca e filtros"><Text style={{ color: colors.primary, fontWeight: "800", fontSize: 13 }}>Limpar filtros</Text></Pressable> : null}</View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}><Text style={{ color: colors.muted, fontSize: 12 }}>Ordenar:</Text>{chip("Nome A–Z", sortMode === "name", () => setSortMode("name"))}{chip("Grupo", sortMode === "group", () => setSortMode("group"))}</View>
    </View>
  );

  return <ScreenContainer className="px-5">
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SpeciesRow item={item} onPress={openSpecies} />}
      ListHeaderComponent={header}
      ListEmptyComponent={<View style={{ alignItems: "center", paddingTop: 40, paddingHorizontal: 20 }}><Text style={{ color: colors.muted, textAlign: "center" }}>{hasFilters ? "Nenhuma espécie corresponde à busca e aos filtros atuais." : "O catálogo ainda não possui espécies disponíveis."}</Text>{hasFilters ? <Pressable onPress={clearFilters} style={{ marginTop: 14, borderColor: colors.primary, borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10 }}><Text style={{ color: colors.primary, fontWeight: "800" }}>Limpar e ver todas</Text></Pressable> : null}</View>}
      ItemSeparatorComponent={() => <View style={{ height: CARD_SEPARATOR }} />}
      contentContainerStyle={{ paddingBottom: 30 }}
      initialNumToRender={12}
      maxToRenderPerBatch={12}
      updateCellsBatchingPeriod={50}
      windowSize={7}
      removeClippedSubviews={Platform.OS !== "web"}
    />
  </ScreenContainer>;
}
