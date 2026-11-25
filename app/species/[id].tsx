/**
 * PantanalDex — Ficha da espécie (UC04): fotos, descrição, dieta, status IUCN, curiosidades e fontes.
 *
 * @author Felipe de Souza Aquino
 */
import { useState } from "react";
import { Alert, Linking, Pressable, ScrollView, useWindowDimensions, View } from "react-native";
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DisplayText, PressableScale } from "@/components/motion";
import { BottomFade } from "@/components/orbit-effects";
import { Text } from "@/components/T";
import { router, useLocalSearchParams } from "expo-router";

import { isSafeExternalUrl } from "@/shared/safe-url";
import { RemoteImage } from "@/components/RemoteImage";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import { filterSpeciesCatalog } from "@/shared/catalog";
import { useColors } from "@/hooks/use-colors";
import { computeCollection, formatCollectionNumber } from "@/shared/collection";
import { hasSpeciesTranslation } from "@/shared/i18n";

export default function SpeciesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const HERO = 360;
  const [page, setPage] = useState(0);
  // Foto do topo com profundidade: sobe mais devagar que o texto e cresce ao puxar para baixo.
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => { scrollY.value = event.contentOffset.y; });
  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-HERO, 0, HERO], [-HERO / 2, 0, HERO * 0.45]) },
      { scale: interpolate(scrollY.value, [-HERO, 0, HERO], [1.8, 1, 1]) },
    ],
  }));
  const { settings, setSettings, sightings } = useApp();
  const animal = filterSpeciesCatalog().find((item) => item.id === id);
  const selectedLanguage = settings.defaultLanguage;
  const collectionEntry = animal ? computeCollection(filterSpeciesCatalog(), sightings).entries.find((entry) => entry.species.id === animal.id) : undefined;
  const personalSightings = animal ? sightings.filter((item) => item.speciesId === animal.id).length : 0;
  const openSource = async (url: string) => {
    if (!isSafeExternalUrl(url)) {
      Alert.alert("Fonte indisponível", "Este endereço não pode ser aberto com segurança.");
      return;
    }
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Não foi possível abrir a fonte", "Verifique a conexão e tente novamente.");
    }
  };
  const block = (title: string, content: string | undefined | null) => !content?.trim() ? null : <View style={{ marginTop: 20 }}><Text accessibilityRole="header" style={{ color: colors.primary, fontWeight: "800", fontSize: 15, textTransform: "uppercase", letterSpacing: 0.7 }}>{title}</Text><Text style={{ color: colors.foreground, fontSize: 15, lineHeight: 23, marginTop: 6 }}>{content}</Text></View>;

  if (!animal) {
    return <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5"><Pressable onPress={() => router.replace("/(tabs)/animals" as any)} accessibilityRole="button"><Text style={{ color: colors.primary, fontSize: 16, fontWeight: "700", paddingVertical: 14 }}>‹ Animais</Text></Pressable><Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "800", marginTop: 24 }}>Espécie não encontrada.</Text><Text style={{ color: colors.muted, marginTop: 6 }}>Volte ao catálogo para escolher outra ficha.</Text></ScreenContainer>;
  }

  return <ScreenContainer edges={["left", "right", "bottom"]} className="px-5"><Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
    {animal.images.length > 0 && <View style={{ marginHorizontal: -20, height: HERO, overflow: "hidden", backgroundColor: colors.surface }}>
      <Animated.View style={[{ flex: 1 }, heroStyle]}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(event) => setPage(Math.round(event.nativeEvent.contentOffset.x / width))}>
          {animal.images.map((image, index) => <RemoteImage key={image.uri} source={{ uri: image.uri }} label={animal.commonName} accessibilityLabel={`Imagem ${index + 1} de ${animal.images.length} de ${animal.commonName}`} style={{ width, height: HERO }} />)}
        </ScrollView>
      </Animated.View>
      <BottomFade height={140} strength={0.9} />
      {animal.images.length > 1 && <View pointerEvents="none" style={{ position: "absolute", bottom: 14, alignSelf: "center", flexDirection: "row", gap: 6 }}>{animal.images.map((image, index) => <View key={image.uri} style={{ width: index === page ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: index === page ? colors.primary : "rgba(251,247,239,0.6)" }} />)}</View>}
    </View>}
    <PressableScale onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)/animals" as any))} accessibilityRole="button" accessibilityLabel="Voltar para animais"
      style={{ position: animal.images.length > 0 ? "absolute" : "relative", top: animal.images.length > 0 ? insets.top + 8 : 0, left: animal.images.length > 0 ? 0 : 0, marginTop: animal.images.length > 0 ? 0 : insets.top + 8, width: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(14,13,11,0.7)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(251,247,239,0.2)" }}>
      <Text style={{ color: "#FBF7EF", fontSize: 22, fontWeight: "800", marginTop: -2 }}>‹</Text>
    </PressableScale>
    {animal.images.length === 0
      ? <View accessibilityLabel={`Sem foto de ${animal.commonName}`} style={{ marginTop: 14, height: 160, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", padding: 16 }}><Text style={{ fontSize: 40 }}>📷</Text><Text style={{ color: colors.muted, fontSize: 13, textAlign: "center", marginTop: 6 }}>Ainda não temos uma foto de uso livre desta espécie.</Text></View>
      : null}
    {collectionEntry && <Pressable onPress={() => router.push("/collection" as any)} accessibilityRole="button" accessibilityLabel={`Espécie ${formatCollectionNumber(collectionEntry.number)} da coleção, ${collectionEntry.discovered ? "descoberta" : "ainda não avistada"}. Abrir minha coleção`} style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 18 }}><Text style={{ color: colors.muted, fontWeight: "800" }}>{formatCollectionNumber(collectionEntry.number)}</Text><Text style={{ color: collectionEntry.discovered ? colors.background : colors.muted, backgroundColor: collectionEntry.discovered ? colors.primary : colors.surface, borderColor: collectionEntry.discovered ? colors.primary : colors.border, borderWidth: 1, borderRadius: 12, overflow: "hidden", paddingHorizontal: 10, paddingVertical: 4, fontSize: 12, fontWeight: "800" }}>{collectionEntry.discovered ? `Descoberta${collectionEntry.firstSeenDate ? ` em ${collectionEntry.firstSeenDate.split("-").reverse().join("/")}` : ""}` : "Ainda não avistada"}</Text></Pressable>}
    <DisplayText accessibilityRole="header" style={{ color: colors.foreground, fontSize: 34, lineHeight: 38, marginTop: collectionEntry ? 8 : 18 }}>{animal.commonName}</DisplayText><Text style={{ color: colors.muted, fontStyle: "italic", fontSize: 16, marginTop: 3 }}>{animal.scientificName}</Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>{[animal.group, ...animal.environments].map((label, index) => <Text key={`${label}-${index}`} style={{ backgroundColor: index === 0 ? colors.primary : colors.surface, color: index === 0 ? colors.background : colors.foreground, borderColor: colors.border, borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6, fontWeight: index === 0 ? "700" : "500", fontSize: 12 }}>{label}</Text>)}</View>
    <Text accessibilityRole="header" style={{ color: colors.foreground, fontWeight: "800", marginBottom: 8, marginTop: 18 }}>Idioma da ficha</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>{settings.quickLanguages.map((language) => <Pressable key={language} onPress={() => setSettings({ ...settings, defaultLanguage: language })} accessibilityRole="radio" accessibilityState={{ selected: selectedLanguage === language }} style={{ backgroundColor: selectedLanguage === language ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 }}><Text style={{ color: selectedLanguage === language ? colors.background : colors.foreground, fontWeight: "700", fontSize: 12 }}>{language}</Text></Pressable>)}</ScrollView>
    {!hasSpeciesTranslation(animal.id) && <Text style={{ color: colors.warning, fontSize: 12, lineHeight: 18, marginTop: 8 }}>Esta ficha ainda está disponível só em português.</Text>}
    {block("Sobre", animal.description)}{block("Características", animal.physicalCharacteristics)}{block("Habitat", animal.habitat)}{block("Comportamento", animal.behavior)}{block("Alimentação", animal.diet)}{block("Importância ecológica", animal.ecologicalImportance)}{block("Distribuição", animal.distribution)}{block("Conservação", animal.conservationStatus ?? "Informação não disponível")}{block("Curiosidades", animal.curiosities.join("\n\n"))}
    <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 22 }} accessibilityRole="summary"><Text style={{ color: colors.foreground, fontWeight: "800" }}>{personalSightings} avistamento(s) seu(s)</Text><Text style={{ color: colors.muted, marginTop: 4 }}>{personalSightings ? "Continue observando e compare seus registros no caderno." : "Ainda não há registros seus para esta espécie."}</Text>{personalSightings > 0 && <Pressable onPress={() => router.push({ pathname: "/(tabs)/sightings", params: { speciesId: animal.id } } as any)} accessibilityRole="button" style={{ marginTop: 10 }}><Text style={{ color: colors.primary, fontWeight: "800" }}>Abrir caderno</Text></Pressable>}</View>
    <Pressable onPress={() => router.push({ pathname: "/sightings/new", params: { speciesId: animal.id } } as any)} accessibilityRole="button" style={({ pressed }) => [{ backgroundColor: colors.primary, borderRadius: 16, padding: 16, marginTop: 24 }, pressed && { opacity: 0.82, transform: [{ scale: 0.98 }] }]}><Text style={{ color: colors.background, textAlign: "center", fontWeight: "800", fontSize: 16 }}>Registrar avistamento</Text></Pressable>
    <Text accessibilityRole="header" style={{ color: colors.muted, fontWeight: "700", marginTop: 24 }}>Imagens e fontes</Text>{animal.images.map((image) => <Pressable key={`${image.uri}-credit`} onPress={() => openSource(image.sourceUrl)} accessibilityRole="link"><Text style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>{image.credit} · {image.license}</Text></Pressable>)}{animal.sources.map((source) => <Pressable key={source.url} onPress={() => openSource(source.url)} accessibilityRole="link"><Text style={{ color: colors.primary, marginTop: 8 }}>{source.title}</Text></Pressable>)}{animal.sources.some((source) => source.title.startsWith("Wikipédia")) && <Text style={{ color: colors.muted, fontSize: 12, marginTop: 8 }}>Descrição com trechos da Wikipédia, adaptados — texto sob licença CC BY-SA 4.0 (creativecommons.org/licenses/by-sa/4.0).</Text>}
  </Animated.ScrollView></ScreenContainer>;
}
