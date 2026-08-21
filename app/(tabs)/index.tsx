import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { filterSpeciesCatalog, catalogCoverage } from "@/shared/catalog";
import { useColors } from "@/hooks/use-colors";
import { useApp } from "@/contexts/AppContext";
import { RemoteImage } from "@/components/RemoteImage";

export default function HomeScreen() {
  const colors = useColors();
  const { settings } = useApp();
  const english = settings.defaultLanguage === "English";
  const spanish = settings.defaultLanguage === "Español";
  const labels = english
    ? { tagline: "FIELD GUIDE", subtitle: "Discover and record Pantanal wildlife", offline: "Catalog available offline", offlineDetail: "Search species and read field cards without connection.", search: "Search animal by name", explore: "Explore animals", sightings: "My sightings", featured: "Featured", all: "See all" }
    : spanish
      ? { tagline: "GUÍA DE CAMPO", subtitle: "Conoce y registra los animales del Pantanal", offline: "Catálogo disponible sin conexión", offlineDetail: "Busca especies y consulta fichas sin conexión.", search: "Buscar animal por nombre", explore: "Explorar animales", sightings: "Mis avistamientos", featured: "Destacados", all: "Ver todos" }
      : { tagline: "GUIA DE CAMPO", subtitle: "Conheça e registre os animais do Pantanal", offline: "Catálogo disponível offline", offlineDetail: "Pesquise espécies e consulte as fichas mesmo sem conexão.", search: "Buscar animal pelo nome", explore: "Explorar animais", sightings: "Meus avistamentos", featured: "Em destaque", all: "Ver todos" };
  const [query, setQuery] = useState("");
  const highlights = useMemo(() => filterSpeciesCatalog({ query }).slice(0, 4), [query]);

  return <ScreenContainer className="px-5" containerClassName="bg-background">
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
      <View style={{ paddingTop: 18, paddingBottom: 20 }}><Text style={{ color: colors.primary, fontSize: 15, fontWeight: "700", letterSpacing: 1.5 }}>{labels.tagline}</Text><Text style={{ color: colors.foreground, fontSize: 36, fontWeight: "800", marginTop: 4 }}>Pantanal<Text style={{ color: colors.primary }}>Dex</Text></Text><Text style={{ color: colors.muted, fontSize: 16, marginTop: 6 }}>{labels.subtitle}</Text></View>
      <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 12 }} accessibilityRole="summary"><Text style={{ color: colors.foreground, fontWeight: "800" }}>{labels.offline}</Text><Text style={{ color: colors.muted, marginTop: 3 }}>{labels.offlineDetail}</Text><Text style={{ color: colors.primary, marginTop: 6, fontWeight: "700" }}>{catalogCoverage.species} espécies locais</Text></View>
      <TextInput accessibilityLabel={labels.search} value={query} onChangeText={setQuery} placeholder={labels.search} placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, color: colors.foreground, fontSize: 15 }} />
      <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}><Pressable onPress={() => router.push("/(tabs)/animals" as any)} accessibilityRole="button" accessibilityLabel={labels.explore} style={({ pressed }) => [{ flex: 1, backgroundColor: colors.primary, padding: 16, borderRadius: 16 }, pressed && { opacity: .8 }]}><Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>{labels.explore}</Text></Pressable><Pressable onPress={() => router.push("/(tabs)/sightings" as any)} accessibilityRole="button" accessibilityLabel={labels.sightings} style={({ pressed }) => [{ flex: 1, backgroundColor: colors.primary, padding: 16, borderRadius: 16 }, pressed && { opacity: .8 }]}><Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>{labels.sightings}</Text></Pressable></View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 28, marginBottom: 12 }}><Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "800" }}>{labels.featured}</Text><Pressable onPress={() => router.push("/(tabs)/animals" as any)} accessibilityRole="button" accessibilityLabel={labels.all}><Text style={{ color: colors.primary, fontWeight: "700" }}>{labels.all}</Text></Pressable></View>
      {highlights.map((item) => <Pressable key={item.id} onPress={() => router.push({ pathname: "/species/[id]", params: { id: item.id } } as any)} accessibilityRole="button" accessibilityLabel={`Abrir ficha de ${item.commonName}`} style={({ pressed }) => [{ backgroundColor: colors.surface, borderRadius: 18, marginBottom: 12, overflow: "hidden", borderWidth: 1, borderColor: colors.border }, pressed && { opacity: .8 }]}><RemoteImage source={{ uri: item.images[0].uri }} label={item.commonName} style={{ width: "100%", height: 150, backgroundColor: colors.border }} /><View style={{ padding: 14 }}><Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>{item.commonName}</Text><Text style={{ color: colors.muted, fontStyle: "italic", marginTop: 3 }}>{item.scientificName}</Text><Text style={{ color: colors.primary, marginTop: 8, fontWeight: "700" }}>{item.group} · {item.environments[0]}</Text></View></Pressable>)}
    </ScrollView>
  </ScreenContainer>;
}
