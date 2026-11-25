/**
 * PantanalDex — Tela inicial em estilo de guia de campo editorial: espécie do dia em destaque,
 * busca, atalhos em grade de tamanhos diferentes (bento) e carrossel de espécies.
 *
 * @author Felipe de Souza Aquino
 */
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Image, ScrollView, View } from "react-native";

import { DisplayText, PressableScale, Reveal } from "@/components/motion";
import { RemoteImage } from "@/components/RemoteImage";
import { ScreenContainer } from "@/components/screen-container";
import { Text, TextInput } from "@/components/T";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";
import { catalogCoverage, filterSpeciesCatalog } from "@/shared/catalog";
import { computeCollection } from "@/shared/collection";
import { hasBundledCover } from "@/shared/species-covers";

const LABELS = {
  pt: { tagline: "GUIA DE CAMPO DO PANTANAL", today: "ESPÉCIE DO DIA", search: "Buscar animal pelo nome", explore: "Explorar animais", species: "espécies", sightings: "Meus avistamentos", records: "registros", collection: "Coleção", discovered: "descobertas", level: "Nível", teams: "Equipes", teamsDetail: "grupos de campo", map: "Mapa público", mapDetail: "áreas de ~11 km", featured: "Para conhecer", all: "Ver todos", offline: "Tudo funciona sem internet", results: "resultados" },
  en: { tagline: "PANTANAL FIELD GUIDE", today: "SPECIES OF THE DAY", search: "Search animal by name", explore: "Explore animals", species: "species", sightings: "My sightings", records: "records", collection: "Collection", discovered: "discovered", level: "Level", teams: "Teams", teamsDetail: "field groups", map: "Public map", mapDetail: "~11 km areas", featured: "Discover", all: "See all", offline: "Everything works offline", results: "results" },
  es: { tagline: "GUÍA DE CAMPO DEL PANTANAL", today: "ESPECIE DEL DÍA", search: "Buscar animal por nombre", explore: "Explorar animales", species: "especies", sightings: "Mis avistamientos", records: "registros", collection: "Colección", discovered: "descubiertas", level: "Nivel", teams: "Equipos", teamsDetail: "grupos de campo", map: "Mapa público", mapDetail: "áreas de ~11 km", featured: "Para conocer", all: "Ver todos", offline: "Todo funciona sin internet", results: "resultados" },
} as const;

/** Mesma espécie o dia inteiro, outra amanhã (só espécies com foto embutida: aparece até offline). */
function speciesOfTheDay() {
  const pool = filterSpeciesCatalog().filter((item) => item.images.length > 0 && hasBundledCover(item.id));
  const now = new Date();
  const day = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000);
  return pool[(day * 37) % Math.max(pool.length, 1)];
}

export default function HomeScreen() {
  const colors = useColors();
  const { settings, sightings } = useApp();
  const t = LABELS[settings.defaultLanguage === "English" ? "en" : settings.defaultLanguage === "Español" ? "es" : "pt"];
  const [query, setQuery] = useState("");
  const collection = useMemo(() => computeCollection(filterSpeciesCatalog(), sightings), [sightings]);
  const today = useMemo(speciesOfTheDay, []);
  const featured = useMemo(() => {
    const all = filterSpeciesCatalog({ query }).filter((item) => item.images.length > 0);
    return query ? all.slice(0, 12) : all.filter((item) => hasBundledCover(item.id) && item.id !== today?.id).slice(0, 12);
  }, [query, today]);
  const real = sightings.filter((item) => item.notebookId !== "teste").length;
  const open = (id: string) => router.push({ pathname: "/species/[id]", params: { id } } as never);

  const tile = { borderRadius: 22, padding: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, overflow: "hidden" as const };

  return (
    <ScreenContainer className="px-5" containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
        <Reveal index={0}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 14 }}>
            <Image source={require("@/assets/images/app-mark.png")} accessibilityIgnoresInvertColors style={{ width: 44, height: 44, borderRadius: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "800", letterSpacing: 2 }}>{t.tagline}</Text>
              <DisplayText style={{ color: colors.foreground, fontSize: 30, lineHeight: 34 }}>PantanalDex</DisplayText>
            </View>
          </View>
        </Reveal>

        {today && (
          <Reveal index={1}>
            <PressableScale onPress={() => open(today.id)} scaleTo={0.98} accessibilityRole="button" accessibilityLabel={`${t.today}: ${today.commonName}`}
              style={{ marginTop: 18, borderRadius: 28, overflow: "hidden", height: 250, backgroundColor: colors.surface }}>
              <RemoteImage source={{ uri: today.images[0]?.uri }} label={today.commonName} style={{ position: "absolute", width: "100%", height: "100%" }} />
              {/* degradê de baixo para cima, para o texto ler bem sobre qualquer foto */}
              <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 150, backgroundColor: "rgba(14,13,11,0.35)" }} />
              <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 95, backgroundColor: "rgba(14,13,11,0.55)" }} />
              <View style={{ position: "absolute", top: 14, left: 14, backgroundColor: colors.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ color: colors.background, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 }}>{t.today}</Text>
              </View>
              <View style={{ position: "absolute", left: 18, right: 18, bottom: 16 }}>
                <DisplayText style={{ color: "#FBF7EF", fontSize: 30, lineHeight: 34 }} numberOfLines={1}>{today.commonName}</DisplayText>
                <Text style={{ color: "#E9E1D2", fontStyle: "italic", marginTop: 2 }}>{today.scientificName} · {today.group}</Text>
              </View>
            </PressableScale>
          </Reveal>
        )}

        <Reveal index={2}>
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16, backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14 }}>
            <Text style={{ fontSize: 16, marginRight: 8 }}>🔎</Text>
            <TextInput accessibilityLabel={t.search} value={query} onChangeText={setQuery} placeholder={t.search} placeholderTextColor={colors.muted}
              style={{ flex: 1, paddingVertical: 14, color: colors.foreground, fontSize: 15 }} />
          </View>
        </Reveal>

        {!query && (
          <Reveal index={3}>
            {/* Bento: um bloco alto à esquerda e dois empilhados à direita */}
            <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
              <PressableScale onPress={() => router.push("/(tabs)/animals" as never)} accessibilityRole="button" accessibilityLabel={t.explore}
                style={[tile, { flex: 1.1, minHeight: 196, backgroundColor: colors.primary, borderColor: colors.primary, justifyContent: "space-between" }]}>
                <Text style={{ fontSize: 30 }}>🐾</Text>
                <View>
                  <DisplayText style={{ color: colors.background, fontSize: 40, lineHeight: 44 }}>{catalogCoverage.species.toLocaleString("pt-BR")}</DisplayText>
                  <Text style={{ color: colors.background, fontWeight: "700", opacity: 0.8 }}>{t.species}</Text>
                  <Text style={{ color: colors.background, fontWeight: "900", fontSize: 16, marginTop: 8 }}>{t.explore} →</Text>
                </View>
              </PressableScale>
              <View style={{ flex: 1, gap: 10 }}>
                <PressableScale onPress={() => router.push("/(tabs)/sightings" as never)} accessibilityRole="button" accessibilityLabel={`${t.sightings}: ${real}`} style={[tile, { flex: 1 }]}>
                  <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700" }}>{t.sightings}</Text>
                  <DisplayText style={{ color: colors.foreground, fontSize: 30, marginTop: 4 }}>{real}</DisplayText>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>{t.records}</Text>
                </PressableScale>
                <PressableScale onPress={() => router.push("/collection" as never)} accessibilityRole="button" accessibilityLabel={`${t.collection}: ${collection.discoveredSpecies} ${t.discovered}`} style={[tile, { flex: 1 }]}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700" }}>{t.collection}</Text>
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "900" }}>{t.level} {collection.level}</Text>
                  </View>
                  <DisplayText style={{ color: colors.foreground, fontSize: 30, marginTop: 4 }}>{collection.discoveredSpecies}</DisplayText>
                  <View style={{ height: 5, borderRadius: 3, backgroundColor: colors.border, marginTop: 6, overflow: "hidden" }}>
                    <View style={{ width: `${Math.max(collection.percent, 2)}%`, height: 5, backgroundColor: colors.primary }} />
                  </View>
                </PressableScale>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <PressableScale onPress={() => router.push("/teams" as never)} accessibilityRole="button" accessibilityLabel={t.teams} style={[tile, { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }]}>
                <Text style={{ fontSize: 24 }}>👥</Text>
                <View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontWeight: "800" }}>{t.teams}</Text><Text style={{ color: colors.muted, fontSize: 12 }}>{t.teamsDetail}</Text></View>
              </PressableScale>
              <PressableScale onPress={() => router.push("/public-map" as never)} accessibilityRole="button" accessibilityLabel={t.map} style={[tile, { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }]}>
                <Text style={{ fontSize: 24 }}>🗺️</Text>
                <View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontWeight: "800" }}>{t.map}</Text><Text style={{ color: colors.muted, fontSize: 12 }}>{t.mapDetail}</Text></View>
              </PressableScale>
            </View>
          </Reveal>
        )}

        <Reveal index={4}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 26, marginBottom: 12 }}>
            <DisplayText style={{ color: colors.foreground, fontSize: 22 }}>{query ? `${featured.length} ${t.results}` : t.featured}</DisplayText>
            <PressableScale onPress={() => router.push("/(tabs)/animals" as never)} accessibilityRole="button" accessibilityLabel={t.all} haptic={false}>
              <Text style={{ color: colors.primary, fontWeight: "800" }}>{t.all} →</Text>
            </PressableScale>
          </View>
          <FlatList horizontal data={featured} keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false} snapToInterval={152} decelerationRate="fast"
            contentContainerStyle={{ gap: 12, paddingRight: 20 }}
            renderItem={({ item, index }) => (
              <Reveal index={index}>
                <PressableScale onPress={() => open(item.id)} accessibilityRole="button" accessibilityLabel={`Abrir ficha de ${item.commonName}`}
                  style={{ width: 140, height: 196, borderRadius: 20, overflow: "hidden", backgroundColor: colors.surface }}>
                  <RemoteImage source={{ uri: item.images[0]?.uri }} label={item.commonName} style={{ position: "absolute", width: "100%", height: "100%" }} />
                  <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 72, backgroundColor: "rgba(14,13,11,0.7)" }} />
                  <View style={{ position: "absolute", left: 10, right: 10, bottom: 10 }}>
                    <Text style={{ color: "#FBF7EF", fontWeight: "800" }} numberOfLines={2}>{item.commonName}</Text>
                    <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700", marginTop: 2 }}>{item.group}</Text>
                  </View>
                </PressableScale>
              </Reveal>
            )} />
        </Reveal>

        <Text style={{ color: colors.muted, fontSize: 12, textAlign: "center", marginTop: 22 }}>📶 {t.offline}</Text>
      </ScrollView>
    </ScreenContainer>
  );
}
