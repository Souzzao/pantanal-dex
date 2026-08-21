import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { environments, groups, species } from "@/shared/pantanal";
import { useColors } from "@/hooks/use-colors";
import { RemoteImage } from "@/components/RemoteImage";

export default function AnimalsScreen() {
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [environment, setEnvironment] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "group">("name");
  const filtered = useMemo(() => species.filter((item) => {
    const matchesQuery = !query || `${item.commonName} ${item.scientificName}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (!group || item.group === group) && (!environment || item.environments.includes(environment as any));
  }).sort((a, b) => sortBy === "name" ? a.commonName.localeCompare(b.commonName, "pt-BR") : a.group.localeCompare(b.group, "pt-BR") || a.commonName.localeCompare(b.commonName, "pt-BR")), [query, group, environment, sortBy]);
  const chip = (label: string, active: boolean, onPress: () => void) => <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected: active }} accessibilityLabel={label} style={{ backgroundColor: active ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9 }}><Text style={{ color: active ? "#fff" : colors.foreground, fontWeight: "700", fontSize: 12 }}>{label}</Text></Pressable>;
  return <ScreenContainer className="px-5">
    <Text style={{ color: colors.foreground, fontSize: 30, fontWeight: "800", paddingTop: 18 }}>Animais</Text>
    <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 16 }}>Explore as espécies do Pantanal</Text>
    <TextInput accessibilityLabel="Buscar animais por nome popular ou científico" value={query} onChangeText={setQuery} placeholder="Nome popular ou científico" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 14, color: colors.foreground, marginBottom: 12 }} />
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>{["", ...groups].map((item) => <View key={`g-${item}`}>{chip(item || "Todos os grupos", group === item, () => setGroup(item))}</View>)}</View>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>{["", ...environments].map((item) => <View key={`e-${item}`}>{chip(item || "Todos os ambientes", environment === item, () => setEnvironment(item))}</View>)}</View>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>{["name", "group"].map((item) => <View key={item}>{chip(item === "name" ? "Ordenar por nome" : "Ordenar por grupo", sortBy === item, () => setSortBy(item as "name" | "group"))}</View>)}</View>
    <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 12 }}>{filtered.length} espécie(s) encontrada(s)</Text>
    <FlatList data={filtered} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 30 }} ListEmptyComponent={<Text style={{ color: colors.muted, textAlign: "center", paddingTop: 40 }}>Nenhum animal encontrado com esses filtros.</Text>} renderItem={({ item }) => <Pressable onPress={() => router.push({ pathname: "/species/[id]", params: { id: item.id } } as any)} style={({ pressed }) => [{ flexDirection: "row", backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12, overflow: "hidden" }, pressed && { opacity: 0.8 }]}><RemoteImage source={{ uri: item.images[0].uri }} label={item.commonName} style={{ width: 112, height: 112, backgroundColor: colors.border }} /><View style={{ flex: 1, padding: 14 }}><Text style={{ color: colors.foreground, fontSize: 17, fontWeight: "800" }}>{item.commonName}</Text><Text style={{ color: colors.muted, fontStyle: "italic", marginTop: 4 }}>{item.scientificName}</Text><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "700", marginTop: 12 }}>{item.group} · {item.environments[0]}</Text></View></Pressable>} />
  </ScreenContainer>;
}
