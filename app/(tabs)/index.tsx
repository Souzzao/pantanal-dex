import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { species } from "@/shared/pantanal";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const colors = useColors(); const [query, setQuery] = useState("");
  const highlights = useMemo(() => species.filter((item) => !query || `${item.commonName} ${item.scientificName}`.toLowerCase().includes(query.toLowerCase())).slice(0, 4), [query]);
  return <ScreenContainer className="px-5" containerClassName="bg-background">
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ paddingTop: 18, paddingBottom: 20 }}><Text style={{ color: colors.primary, fontSize: 15, fontWeight: "700", letterSpacing: 1.5 }}>GUIA DE CAMPO</Text><Text style={{ color: colors.foreground, fontSize: 36, fontWeight: "800", marginTop: 4 }}>Pantanal<Text style={{ color: colors.primary }}>Dex</Text></Text><Text style={{ color: colors.muted, fontSize: 16, marginTop: 6 }}>Conheça e registre os animais do Pantanal</Text></View>
      <TextInput value={query} onChangeText={setQuery} placeholder="Buscar animal pelo nome" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, color: colors.foreground, fontSize: 15 }} />
      <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}><Pressable onPress={() => router.push("/(tabs)/animals" as any)} style={({ pressed }) => [{ flex: 1, backgroundColor: colors.primary, padding: 16, borderRadius: 16 }, pressed && { opacity: .8 }]}><Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>Explorar animais</Text></Pressable><Pressable onPress={() => router.push("/(tabs)/sightings" as any)} style={({ pressed }) => [{ flex: 1, backgroundColor: colors.primary, padding: 16, borderRadius: 16 }, pressed && { opacity: .8 }]}><Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>Meus avistamentos</Text></Pressable></View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 28, marginBottom: 12 }}><Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "800" }}>Em destaque</Text><Pressable onPress={() => router.push("/(tabs)/animals" as any)}><Text style={{ color: colors.primary, fontWeight: "700" }}>Ver todos</Text></Pressable></View>
      {highlights.map((item) => <Pressable key={item.id} onPress={() => router.push({ pathname: "/species/[id]", params: { id: item.id } } as any)} style={({ pressed }) => [{ backgroundColor: colors.surface, borderRadius: 18, marginBottom: 12, overflow: "hidden", borderWidth: 1, borderColor: colors.border }, pressed && { opacity: .8 }]}><Image source={{ uri: item.images[0].uri }} style={{ width: "100%", height: 150, backgroundColor: colors.border }} /><View style={{ padding: 14 }}><Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>{item.commonName}</Text><Text style={{ color: colors.muted, fontStyle: "italic", marginTop: 3 }}>{item.scientificName}</Text><Text style={{ color: colors.primary, marginTop: 8, fontWeight: "700" }}>{item.group} · {item.environments[0]}</Text></View></Pressable>)}
    </ScrollView>
  </ScreenContainer>;
}
