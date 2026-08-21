import { Alert, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { RemoteImage } from "@/components/RemoteImage";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import { species } from "@/shared/pantanal";
import { useColors } from "@/hooks/use-colors";

export default function SpeciesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const { settings, setSettings, sightings } = useApp();
  const animal = species.find((item) => item.id === id);
  const selectedLanguage = settings.defaultLanguage;
  const personalSightings = animal ? sightings.filter((item) => item.speciesId === animal.id).length : 0;
  const openSource = async (url: string) => {
    if (!/^https?:\/\/\S+$/i.test(url)) {
      Alert.alert("Fonte indisponível", "Este endereço não pode ser aberto com segurança.");
      return;
    }
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Não foi possível abrir a fonte", "Verifique a conexão e tente novamente.");
    }
  };
  const block = (title: string, content: string) => <View style={{ marginTop: 20 }}><Text accessibilityRole="header" style={{ color: colors.primary, fontWeight: "800", fontSize: 15, textTransform: "uppercase", letterSpacing: 0.7 }}>{title}</Text><Text style={{ color: colors.foreground, fontSize: 15, lineHeight: 23, marginTop: 6 }}>{content}</Text></View>;

  if (!animal) {
    return <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5"><Pressable onPress={() => router.replace("/(tabs)/animals" as any)} accessibilityRole="button"><Text style={{ color: colors.primary, fontSize: 16, fontWeight: "700", paddingVertical: 14 }}>‹ Animais</Text></Pressable><Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "800", marginTop: 24 }}>Espécie não encontrada.</Text><Text style={{ color: colors.muted, marginTop: 6 }}>Volte ao catálogo para escolher outra ficha.</Text></ScreenContainer>;
  }

  return <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5"><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
    <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Voltar para animais"><Text style={{ color: colors.primary, fontSize: 16, fontWeight: "700", paddingVertical: 14 }}>‹ Voltar</Text></Pressable>
    <Text accessibilityRole="header" style={{ color: colors.foreground, fontWeight: "800", marginBottom: 8 }}>Idioma da ficha</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>{settings.quickLanguages.map((language) => <Pressable key={language} onPress={() => setSettings({ ...settings, defaultLanguage: language })} accessibilityRole="radio" accessibilityState={{ selected: selectedLanguage === language }} style={{ backgroundColor: selectedLanguage === language ? colors.primary : colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 }}><Text style={{ color: selectedLanguage === language ? "#fff" : colors.foreground, fontWeight: "700", fontSize: 12 }}>{language}</Text></Pressable>)}</ScrollView>
    {selectedLanguage !== "Português" && <Text style={{ color: colors.warning, fontSize: 12, lineHeight: 18, marginTop: 8 }}>Esta ficha ainda está disponível em Português. Você pode adicionar novos idiomas em Configurações.</Text>}
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginTop: 14 }} contentContainerStyle={{ gap: 8 }}>{animal.images.map((image, index) => <RemoteImage key={image.uri} source={{ uri: image.uri }} label={animal.commonName} accessibilityLabel={`Imagem ${index + 1} de ${animal.images.length} de ${animal.commonName}`} style={{ width: 340, height: 230, backgroundColor: colors.border }} />)}</ScrollView>
    <Text style={{ color: colors.muted, fontSize: 12, marginTop: 8 }}>{animal.images.length} imagens · deslize para explorar</Text>
    <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 30, fontWeight: "800", marginTop: 18 }}>{animal.commonName}</Text><Text style={{ color: colors.muted, fontStyle: "italic", fontSize: 16, marginTop: 3 }}>{animal.scientificName}</Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>{[animal.group, ...animal.environments].map((label, index) => <Text key={`${label}-${index}`} style={{ backgroundColor: index === 0 ? colors.primary : colors.surface, color: index === 0 ? "#fff" : colors.foreground, borderColor: colors.border, borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6, fontWeight: index === 0 ? "700" : "500", fontSize: 12 }}>{label}</Text>)}</View>
    {block("Sobre", animal.description)}{block("Características", animal.physicalCharacteristics)}{block("Habitat", animal.habitat)}{block("Comportamento", animal.behavior)}{block("Alimentação", animal.diet)}{block("Importância ecológica", animal.ecologicalImportance)}{block("Distribuição", animal.distribution)}{block("Conservação", animal.conservationStatus ?? "Informação não disponível")}{block("Curiosidades", animal.curiosities.join("\n\n"))}
    <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 22 }} accessibilityRole="summary"><Text style={{ color: colors.foreground, fontWeight: "800" }}>{personalSightings} avistamento(s) seu(s)</Text><Text style={{ color: colors.muted, marginTop: 4 }}>{personalSightings ? "Continue observando e compare seus registros no caderno." : "Ainda não há registros seus para esta espécie."}</Text>{personalSightings > 0 && <Pressable onPress={() => router.push({ pathname: "/(tabs)/sightings", params: { speciesId: animal.id } } as any)} accessibilityRole="button" style={{ marginTop: 10 }}><Text style={{ color: colors.primary, fontWeight: "800" }}>Abrir caderno</Text></Pressable>}</View>
    <Pressable onPress={() => router.push({ pathname: "/sightings/new", params: { speciesId: animal.id } } as any)} accessibilityRole="button" style={({ pressed }) => [{ backgroundColor: colors.primary, borderRadius: 16, padding: 16, marginTop: 24 }, pressed && { opacity: 0.82, transform: [{ scale: 0.98 }] }]}><Text style={{ color: "#fff", textAlign: "center", fontWeight: "800", fontSize: 16 }}>Registrar avistamento</Text></Pressable>
    <Text accessibilityRole="header" style={{ color: colors.muted, fontWeight: "700", marginTop: 24 }}>Imagens e fontes</Text>{animal.images.map((image) => <Pressable key={`${image.uri}-credit`} onPress={() => openSource(image.sourceUrl)} accessibilityRole="link"><Text style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>{image.credit} · {image.license}</Text></Pressable>)}{animal.sources.map((source) => <Pressable key={source.url} onPress={() => openSource(source.url)} accessibilityRole="link"><Text style={{ color: colors.primary, marginTop: 8 }}>{source.title}</Text></Pressable>)}
  </ScrollView></ScreenContainer>;
}
