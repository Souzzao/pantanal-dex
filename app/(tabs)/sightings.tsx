import { useMemo, useState } from "react";
import { FlatList, Image, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { environments, groups, species } from "@/shared/pantanal";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";

export default function SightingsScreen() {
  const colors = useColors();
  const { sightings } = useApp();
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [environmentFilter, setEnvironmentFilter] = useState<string>("");
  const [periodFilter, setPeriodFilter] = useState<"" | "30" | "365">("");
  const [onlyLocated, setOnlyLocated] = useState(false);

  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    const cutoff = periodFilter ? new Date(Date.now() - Number(periodFilter) * 24 * 60 * 60 * 1000) : undefined;
    return sightings.filter((sighting) => {
      const animal = species.find((item) => item.id === sighting.speciesId);
      const searchable = [animal?.commonName, animal?.scientificName, sighting.locationLabel, sighting.notes].filter(Boolean).join(" ").toLocaleLowerCase("pt-BR");
      return (!normalized || searchable.includes(normalized)) &&
        (!groupFilter || animal?.group === groupFilter) &&
        (!environmentFilter || animal?.environments.includes(environmentFilter as any)) &&
        (!cutoff || new Date(`${sighting.date}T${sighting.time || "00:00"}`) >= cutoff) &&
        (!onlyLocated || sighting.latitude !== undefined && sighting.longitude !== undefined);
    });
  }, [environmentFilter, groupFilter, onlyLocated, periodFilter, query, sightings]);

  const clearFilters = () => {
    setQuery("");
    setGroupFilter("");
    setEnvironmentFilter("");
    setPeriodFilter("");
    setOnlyLocated(false);
  };

  const renderChip = (label: string, active: boolean, onPress: () => void) => (
    <Pressable onPress={onPress} style={{ backgroundColor: active ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 }}>
      <Text style={{ color: active ? "#fff" : colors.foreground, fontWeight: "700", fontSize: 12 }}>{label}</Text>
    </Pressable>
  );

  return (
    <ScreenContainer className="px-5">
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 18, marginBottom: 5 }}>
        <View><Text style={{ color: colors.foreground, fontSize: 30, fontWeight: "800" }}>Avistamentos</Text><Text style={{ color: colors.muted, marginTop: 4 }}>Seu caderno de campo</Text></View>
        <Pressable onPress={() => router.push("/sightings/new" as any)} style={({ pressed }) => [{ backgroundColor: colors.primary, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 10 }, pressed && { opacity: 0.82 }]}><Text style={{ color: "#fff", fontWeight: "800" }}>+ Novo</Text></Pressable>
      </View>
      <TextInput value={query} onChangeText={setQuery} placeholder="Buscar espécie, local ou observação" placeholderTextColor={colors.muted} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 13, padding: 13, color: colors.foreground, marginTop: 14 }} />
      <Pressable onPress={() => router.push("/map" as any)} style={({ pressed }) => [{ borderColor: colors.primary, borderWidth: 1, borderRadius: 13, padding: 12, marginTop: 10 }, pressed && { opacity: 0.78 }]}><Text style={{ color: colors.primary, textAlign: "center", fontWeight: "800" }}>Ver no mapa</Text></Pressable>
      <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 16, marginBottom: 8 }}>Grupo</Text>
      <FlatList horizontal data={["", ...groups]} keyExtractor={(item) => item || "all-groups"} showsHorizontalScrollIndicator={false} renderItem={({ item }) => renderChip(item || "Todos", groupFilter === item, () => setGroupFilter(item))} />
      <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 14, marginBottom: 8 }}>Ambiente</Text>
      <FlatList horizontal data={["", ...environments]} keyExtractor={(item) => item || "all-environments"} showsHorizontalScrollIndicator={false} renderItem={({ item }) => renderChip(item || "Todos", environmentFilter === item, () => setEnvironmentFilter(item))} />
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 14, marginBottom: 14 }}>
        {renderChip("Últimos 30 dias", periodFilter === "30", () => setPeriodFilter(periodFilter === "30" ? "" : "30"))}
        {renderChip("Último ano", periodFilter === "365", () => setPeriodFilter(periodFilter === "365" ? "" : "365"))}
        {renderChip("Com localização", onlyLocated, () => setOnlyLocated(!onlyLocated))}
        {(query || groupFilter || environmentFilter || periodFilter || onlyLocated) && <Pressable onPress={clearFilters}><Text style={{ color: colors.error, fontSize: 12, fontWeight: "800" }}>Limpar</Text></Pressable>}
      </View>
      <Text style={{ color: colors.muted, fontSize: 12, marginBottom: 10 }}>{visible.length} registro(s) encontrado(s)</Text>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30, flexGrow: 1 }}
        ListEmptyComponent={<View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 80 }}><Text style={{ color: colors.foreground, fontSize: 19, fontWeight: "800" }}>{sightings.length ? "Nenhum registro encontrado" : "Seu caderno ainda está vazio"}</Text><Text style={{ color: colors.muted, textAlign: "center", marginTop: 8, maxWidth: 280 }}>{sightings.length ? "Tente remover um filtro ou pesquisar por outro termo." : "Abra uma ficha de animal e registre seu primeiro encontro com a fauna pantaneira."}</Text>{sightings.length === 0 && <Pressable onPress={() => router.push("/(tabs)/animals" as any)} style={{ marginTop: 18, backgroundColor: colors.primary, borderRadius: 15, padding: 14 }}><Text style={{ color: "#fff", fontWeight: "800" }}>Explorar animais</Text></Pressable>}</View>}
        renderItem={({ item }) => {
          const animal = species.find((entry) => entry.id === item.speciesId);
          return <Pressable onPress={() => router.push({ pathname: "/sightings/[id]", params: { id: item.id } } as any)} style={({ pressed }) => [{ flexDirection: "row", backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12, overflow: "hidden" }, pressed && { opacity: 0.78 }]}>{item.photoUri ? <Image source={{ uri: item.photoUri }} style={{ width: 104, height: 104 }} /> : <Image source={{ uri: animal?.images[0].uri }} style={{ width: 104, height: 104 }} />}<View style={{ flex: 1, padding: 13 }}><Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 17 }}>{animal?.commonName ?? "Animal"}</Text><Text style={{ color: colors.muted, marginTop: 5 }}>{item.date}{item.time ? ` · ${item.time}` : ""}</Text><Text style={{ color: colors.primary, marginTop: 10, fontSize: 12, fontWeight: "700" }}>{item.locationLabel || "Local não informado"}</Text></View></Pressable>;
        }}
      />
    </ScreenContainer>
  );
}
