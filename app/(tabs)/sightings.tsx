import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { RemoteImage } from "@/components/RemoteImage";
import { ScreenContainer } from "@/components/screen-container";
import { environments, groups } from "@/shared/pantanal";
import { filterSpeciesCatalog } from "@/shared/catalog";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";

export default function SightingsScreen() {
  const colors = useColors();
  const { sightings, ready } = useApp();
  const { speciesId } = useLocalSearchParams<{ speciesId?: string }>();
  const [query, setQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState(speciesId ?? "");
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [environmentFilter, setEnvironmentFilter] = useState<string>("");
  const [periodFilter, setPeriodFilter] = useState<"" | "30" | "365">("");
  const [onlyLocated, setOnlyLocated] = useState(false);

  const catalogById = useMemo(() => new Map(filterSpeciesCatalog().map((item) => [item.id, item])), []);
  const summary = useMemo(() => ({ photos: sightings.filter((item) => Boolean(item.photoUri)).length, located: sightings.filter((item) => item.latitude !== undefined && item.longitude !== undefined).length }), [sightings]);

  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    const cutoff = periodFilter ? new Date(Date.now() - Number(periodFilter) * 24 * 60 * 60 * 1000) : undefined;
    return sightings.filter((sighting) => {
      const animal = catalogById.get(sighting.speciesId);
      const searchable = [animal?.commonName, animal?.scientificName, sighting.locationLabel, sighting.notes].filter(Boolean).join(" ").toLocaleLowerCase("pt-BR");
      return (!normalized || searchable.includes(normalized)) &&
        (!speciesFilter || sighting.speciesId === speciesFilter) &&
        (!groupFilter || animal?.group === groupFilter) &&
        (!environmentFilter || animal?.environments.includes(environmentFilter as any)) &&
        (!cutoff || new Date(`${sighting.date}T${sighting.time || "00:00"}`) >= cutoff) &&
        (!onlyLocated || sighting.latitude !== undefined && sighting.longitude !== undefined);
    }).sort((a, b) => `${b.date}T${b.time || "00:00"}`.localeCompare(`${a.date}T${a.time || "00:00"}`));
  }, [catalogById, environmentFilter, groupFilter, onlyLocated, periodFilter, query, sightings, speciesFilter]);

  const clearFilters = () => {
    setQuery("");
    setSpeciesFilter("");
    setGroupFilter("");
    setEnvironmentFilter("");
    setPeriodFilter("");
    setOnlyLocated(false);
  };

  const renderChip = (label: string, active: boolean, onPress: () => void) => (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ selected: active }} accessibilityLabel={label} style={{ backgroundColor: active ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 }}>
      <Text style={{ color: active ? "#fff" : colors.foreground, fontWeight: "700", fontSize: 12 }}>{label}</Text>
    </Pressable>
  );

  return (
    <ScreenContainer className="px-5">
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 18, marginBottom: 5 }}>
        <View><Text style={{ color: colors.foreground, fontSize: 30, fontWeight: "800" }}>Avistamentos</Text><Text style={{ color: colors.muted, marginTop: 4 }}>Seu caderno de campo</Text></View>
        <Pressable onPress={() => router.push("/sightings/new" as any)} accessibilityRole="button" accessibilityLabel="Novo avistamento" style={({ pressed }) => [{ backgroundColor: colors.primary, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 10 }, pressed && { opacity: 0.82 }]}><Text style={{ color: "#fff", fontWeight: "800" }}>+ Novo</Text></Pressable>
      </View>
      <View style={{ flexDirection: "row", gap: 8, marginTop: 14, marginBottom: 2 }} accessibilityRole="summary"><View style={{ flex: 1, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 10 }}><Text style={{ color: colors.primary, fontSize: 20, fontWeight: "800" }}>{sightings.length}</Text><Text style={{ color: colors.muted, fontSize: 11 }}>registros</Text></View><View style={{ flex: 1, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 10 }}><Text style={{ color: colors.primary, fontSize: 20, fontWeight: "800" }}>{summary.photos}</Text><Text style={{ color: colors.muted, fontSize: 11 }}>com foto</Text></View><View style={{ flex: 1, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 10 }}><Text style={{ color: colors.primary, fontSize: 20, fontWeight: "800" }}>{summary.located}</Text><Text style={{ color: colors.muted, fontSize: 11 }}>no mapa</Text></View></View>
      <TextInput accessibilityLabel="Buscar espécie, local ou observação" value={query} onChangeText={setQuery} placeholder="Buscar espécie, local ou observação" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground, marginTop: 14 }} />
      <Pressable onPress={() => router.push("/map" as any)} accessibilityRole="button" accessibilityLabel="Ver avistamentos no mapa" style={({ pressed }) => [{ borderColor: colors.primary, borderWidth: 1, borderRadius: 13, padding: 12, marginTop: 10 }, pressed && { opacity: 0.78 }]}><Text style={{ color: colors.primary, textAlign: "center", fontWeight: "800" }}>Ver no mapa</Text></Pressable>
      {speciesFilter && <Pressable onPress={() => setSpeciesFilter("")} accessibilityRole="button" style={{ alignSelf: "flex-start", backgroundColor: colors.primary, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8, marginTop: 14 }}><Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>Espécie: {catalogById.get(speciesFilter)?.commonName ?? "selecionada"} ×</Text></Pressable>}
      <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 16, marginBottom: 8 }}>Grupo</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 2 }}>{["", ...groups].map((item) => <View key={item || "all-groups"}>{renderChip(item || "Todos", groupFilter === item, () => setGroupFilter(item))}</View>)}</ScrollView>
      <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 14, marginBottom: 8 }}>Ambiente</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 2 }}>{["", ...environments].map((item) => <View key={item || "all-environments"}>{renderChip(item || "Todos", environmentFilter === item, () => setEnvironmentFilter(item))}</View>)}</ScrollView>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 14, marginBottom: 14 }}>
        {renderChip("Últimos 30 dias", periodFilter === "30", () => setPeriodFilter(periodFilter === "30" ? "" : "30"))}
        {renderChip("Último ano", periodFilter === "365", () => setPeriodFilter(periodFilter === "365" ? "" : "365"))}
        {renderChip("Com localização", onlyLocated, () => setOnlyLocated(!onlyLocated))}
        {(query || speciesFilter || groupFilter || environmentFilter || periodFilter || onlyLocated) && <Pressable onPress={clearFilters}><Text style={{ color: colors.error, fontSize: 12, fontWeight: "800" }}>Limpar</Text></Pressable>}
      </View>
      {!ready ? <View style={{ alignItems: "center", paddingVertical: 36 }}><ActivityIndicator color={colors.primary} /><Text style={{ color: colors.muted, marginTop: 10 }}>Carregando seu caderno…</Text></View> : <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 10 }}>{visible.length} registro(s) encontrado(s)</Text>}
      <FlatList
        data={ready ? visible : []}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30, flexGrow: 1 }}
        ListEmptyComponent={ready ? <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 80 }}><Text style={{ color: colors.foreground, fontSize: 19, fontWeight: "800" }}>{sightings.length ? "Nenhum registro encontrado" : "Seu caderno ainda está vazio"}</Text><Text style={{ color: colors.muted, textAlign: "center", marginTop: 8, maxWidth: 280 }}>{sightings.length ? "Tente remover um filtro ou pesquisar por outro termo." : "Abra uma ficha de animal e registre seu primeiro encontro com a fauna pantaneira."}</Text>{sightings.length === 0 && <Pressable onPress={() => router.push("/(tabs)/animals" as any)} accessibilityRole="button" accessibilityLabel="Explorar animais" style={{ marginTop: 18, backgroundColor: colors.primary, borderRadius: 15, padding: 14 }}><Text style={{ color: "#fff", fontWeight: "800" }}>Explorar animais</Text></Pressable>}</View> : null}
        renderItem={({ item }) => {
          const animal = catalogById.get(item.speciesId);
          return <Pressable onPress={() => router.push({ pathname: "/sightings/[id]", params: { id: item.id } } as any)} style={({ pressed }) => [{ flexDirection: "row", backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12, overflow: "hidden" }, pressed && { opacity: 0.78 }]}><RemoteImage source={{ uri: item.photoUri || animal?.images[0].uri }} label={animal?.commonName ?? "Animal"} style={{ width: 104, height: 104 }} /><View style={{ flex: 1, padding: 13 }}><Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 17 }}>{animal?.commonName ?? "Animal"}</Text><Text style={{ color: colors.muted, marginTop: 5 }}>{item.date}{item.time ? ` · ${item.time}` : ""}</Text><Text style={{ color: colors.primary, marginTop: 10, fontSize: 12, fontWeight: "700" }}>{item.locationLabel || "Local não informado"}</Text></View></Pressable>;
        }}
      />
    </ScreenContainer>
  );
}
