import { useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { environments, groups, species } from "@/shared/pantanal";
import { useColors } from "@/hooks/use-colors";
import { SpeciesImage } from "@/components/species-image";

export default function AnimalsScreen() {
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("");
  const [environment, setEnvironment] = useState("");
  const filtered = useMemo(() => species.filter((item) => {
    const matchesQuery = !query || `${item.commonName} ${item.scientificName}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (!group || item.group === group) && (!environment || item.environments.includes(environment as any));
  }), [query, group, environment]);
  const chip = (label: string, active: boolean, onPress: () => void) => <Pressable onPress={onPress} style={{ backgroundColor: active ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9 }}><Text style={{ color: active ? "#fff" : colors.foreground, fontWeight: "700", fontSize: 12 }}>{label}</Text></Pressable>;
  return <ScreenContainer className="px-5">
    <Text style={{ color: colors.foreground, fontSize: 30, fontWeight: "800", paddingTop: 18 }}>Animais</Text>
    <Text style={{ color: colors.muted, marginTop: 4, marginBottom: 16 }}>Explore as espécies do Pantanal</Text>
    <TextInput value={query} onChangeText={setQuery} placeholder="Nome popular ou científico" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 14, color: colors.foreground, marginBottom: 12 }} />
    <FlatList horizontal showsHorizontalScrollIndicator={false} data={["", ...groups]} keyExtractor={(item) => `g-${item}`} contentContainerStyle={{ gap: 8, paddingBottom: 10 }} renderItem={({ item }) => chip(item || "Todos os grupos", group === item, () => setGroup(item))} />
    <FlatList horizontal showsHorizontalScrollIndicator={false} data={["", ...environments]} keyExtractor={(item) => `e-${item}`} contentContainerStyle={{ gap: 8, paddingBottom: 16 }} renderItem={({ item }) => chip(item || "Todos os ambientes", environment === item, () => setEnvironment(item))} />
    <FlatList data={filtered} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 30 }} ListEmptyComponent={<Text style={{ color: colors.muted, textAlign: "center", paddingTop: 40 }}>Nenhum animal encontrado com esses filtros.</Text>} renderItem={({ item }) => <Pressable onPress={() => router.push({ pathname: "/species/[id]", params: { id: item.id } } as any)} style={({ pressed }) => [{ flexDirection: "row", backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12, overflow: "hidden" }, pressed && { opacity: 0.8 }]}><SpeciesImage image={item.images[0]} style={{ width: 112, height: 112, backgroundColor: colors.border }} label={`${item.commonName} sem fotografia disponível`} /><View style={{ flex: 1, padding: 14 }}><Text style={{ color: colors.foreground, fontSize: 17, fontWeight: "800" }}>{item.commonName}</Text><Text style={{ color: colors.muted, fontStyle: "italic", marginTop: 4 }}>{item.scientificName}</Text><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "700", marginTop: 12 }}>{item.group} · {item.environments[0]}</Text></View></Pressable>} />
  </ScreenContainer>;
}
