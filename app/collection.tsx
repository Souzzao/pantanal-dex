import { useI18n } from "@/contexts/LanguageContext";
import { useMemo, useState } from "react";
import { FlatList, ScrollView, View, useWindowDimensions } from "react-native";
import { Pressable, Text } from "@/components/Localized";
import { router } from "expo-router";

import { RemoteImage } from "@/components/RemoteImage";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";
import { localizedSpeciesCatalog } from "@/shared/catalog";
import {
  computeCollection,
  filterCollectionEntries,
  formatCollectionNumber,
  XP_PER_LEVEL,
  type BadgeId,
  type CollectionEntry,
  type CollectionFilter,
} from "@/shared/collection";
import { groups, type SpeciesGroup } from "@/shared/pantanal";

type Lang = "pt" | "en" | "es";

const TEXT = {
  pt: {
    back: "‹ Voltar", title: "Minha coleção", subtitle: "Cada espécie registrada no seu caderno entra na coleção.",
    discovered: "descobertas", sightings: "registros", days: "dias de campo", level: "Nível", xp: "XP",
    toNext: (n: number) => `${n} XP para o próximo nível`, byGroup: "Progresso por grupo", badges: "Conquistas",
    all: "Todas", found: "Descobertas", missing: "Faltando", allGroups: "Todos os grupos",
    unknown: "Ainda não avistada", seen: (n: number) => (n === 1 ? "1 registro" : `${n} registros`),
    empty: "Nenhuma espécie neste filtro.", register: "Registrar avistamento",
    unmatched: (n: number) => (n === 1 ? "1 registro marcado como \"Não sei\" ainda não entra na coleção. Edite o registro e escolha a espécie para incluí-lo." : `${n} registros marcados como "Não sei" ainda não entram na coleção. Edite os registros e escolha a espécie para incluí-los.`),
    open: (name: string) => `Abrir ficha de ${name}`, openUnknown: (num: string) => `Espécie ${num}, ainda não avistada. Abrir ficha`,
  },
  en: {
    back: "‹ Back", title: "My collection", subtitle: "Every species logged in your notebook joins the collection.",
    discovered: "discovered", sightings: "sightings", days: "field days", level: "Level", xp: "XP",
    toNext: (n: number) => `${n} XP to next level`, byGroup: "Progress by group", badges: "Achievements",
    all: "All", found: "Discovered", missing: "Missing", allGroups: "All groups",
    unknown: "Not seen yet", seen: (n: number) => (n === 1 ? "1 sighting" : `${n} sightings`),
    empty: "No species match this filter.", register: "Log a sighting",
    unmatched: (n: number) => (n === 1 ? "1 sighting marked \"I don't know\" is not in the collection yet. Edit it and pick the species to add it." : `${n} sightings marked "I don't know" are not in the collection yet. Edit them and pick the species to add them.`),
    open: (name: string) => `Open ${name} card`, openUnknown: (num: string) => `Species ${num}, not seen yet. Open card`,
  },
  es: {
    back: "‹ Volver", title: "Mi colección", subtitle: "Cada especie registrada en tu cuaderno entra en la colección.",
    discovered: "descubiertas", sightings: "registros", days: "días de campo", level: "Nivel", xp: "XP",
    toNext: (n: number) => `${n} XP para el próximo nivel`, byGroup: "Progreso por grupo", badges: "Logros",
    all: "Todas", found: "Descubiertas", missing: "Faltan", allGroups: "Todos los grupos",
    unknown: "Aún no avistada", seen: (n: number) => (n === 1 ? "1 registro" : `${n} registros`),
    empty: "Ninguna especie en este filtro.", register: "Registrar avistamiento",
    unmatched: (n: number) => (n === 1 ? "1 registro marcado como \"No sé\" aún no entra en la colección. Edítalo y elige la especie para incluirlo." : `${n} registros marcados como "No sé" aún no entran en la colección. Edítalos y elige la especie para incluirlos.`),
    open: (name: string) => `Abrir ficha de ${name}`, openUnknown: (num: string) => `Especie ${num}, aún no avistada. Abrir ficha`,
  },
} as const;

const BADGES: Record<BadgeId, { icon: string; pt: [string, string]; en: [string, string]; es: [string, string] }> = {
  "first-sighting": { icon: "📓", pt: ["Primeiro registro", "Registre seu primeiro avistamento"], en: ["First entry", "Log your first sighting"], es: ["Primer registro", "Registra tu primer avistamiento"] },
  "five-species": { icon: "🔎", pt: ["Explorador", "Descubra 5 espécies"], en: ["Explorer", "Discover 5 species"], es: ["Explorador", "Descubre 5 especies"] },
  "twenty-five-species": { icon: "🧭", pt: ["Naturalista", "Descubra 25 espécies"], en: ["Naturalist", "Discover 25 species"], es: ["Naturalista", "Descubre 25 especies"] },
  "all-groups": { icon: "🌿", pt: ["Biodiversidade", "Uma espécie de cada grupo"], en: ["Biodiversity", "One species from every group"], es: ["Biodiversidad", "Una especie de cada grupo"] },
  "pantanal-icons": { icon: "🐆", pt: ["Cinco do Pantanal", "Onça, tuiuiú, arara-azul, capivara e jacaré"], en: ["Pantanal Five", "Jaguar, jabiru, hyacinth macaw, capybara, caiman"], es: ["Cinco del Pantanal", "Jaguar, tuyuyú, guacamayo, carpincho y yacaré"] },
  birdwatcher: { icon: "🪶", pt: ["Observador de aves", "Descubra 10 aves"], en: ["Birdwatcher", "Discover 10 birds"], es: ["Observador de aves", "Descubre 10 aves"] },
  "ten-field-days": { icon: "📅", pt: ["Dez dias de campo", "Registre em 10 dias diferentes"], en: ["Ten field days", "Log on 10 different days"], es: ["Diez días de campo", "Registra en 10 días distintos"] },
  "full-group": { icon: "🏆", pt: ["Grupo completo", "Descubra todas as espécies de um grupo"], en: ["Full group", "Discover every species in a group"], es: ["Grupo completo", "Descubre todas las especies de un grupo"] },
};

const GROUP_LABELS: Record<SpeciesGroup, Record<Lang, string>> = {
  Mamíferos: { pt: "Mamíferos", en: "Mammals", es: "Mamíferos" },
  Aves: { pt: "Aves", en: "Birds", es: "Aves" },
  Répteis: { pt: "Répteis", en: "Reptiles", es: "Reptiles" },
  Anfíbios: { pt: "Anfíbios", en: "Amphibians", es: "Anfibios" },
  Peixes: { pt: "Peixes", en: "Fish", es: "Peces" },
  Invertebrados: { pt: "Invertebrados", en: "Invertebrates", es: "Invertebrados" },
};

function ProgressBar({ percent, color, track, height = 8 }: { percent: number; color: string; track: string; height?: number }) {
  const value = Math.max(0, Math.min(100, percent));
  return <View style={{ height, borderRadius: height / 2, backgroundColor: track, overflow: "hidden" }}><View style={{ width: `${value}%`, height: "100%", backgroundColor: color, borderRadius: height / 2 }} /></View>;
}

export default function CollectionScreen() {
  const { locale } = useI18n();
  const colors = useColors();
  const { sightings, settings } = useApp();
  const lang: Lang = settings.defaultLanguage === "English" ? "en" : settings.defaultLanguage === "Español" ? "es" : "pt";
  const t = TEXT[lang];
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 5 : width >= 480 ? 4 : 3;
  const gap = 10;
  const cardWidth = (Math.min(width, 900) - 40 - gap * (columns - 1)) / columns;

  const [filter, setFilter] = useState<CollectionFilter>("all");
  const [group, setGroup] = useState<SpeciesGroup | "all">("all");

  const catalog = useMemo(() => localizedSpeciesCatalog(locale, ), [locale]);
  const summary = useMemo(() => computeCollection(catalog, sightings), [catalog, sightings]);
  const visible = useMemo(() => filterCollectionEntries(summary.entries, { filter, group }), [summary, filter, group]);

  const chip = (label: string, active: boolean, onPress: () => void, key: string) => (
    <Pressable key={key} onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }} accessibilityLabel={label}
      style={({ pressed }) => [{ paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, borderWidth: 1, borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.surface, minHeight: 40, justifyContent: "center" }, pressed && { opacity: 0.8 }]}>
      <Text style={{ color: active ? colors.background : colors.foreground, fontWeight: "700", fontSize: 13 }}>{label}</Text>
    </Pressable>
  );

  const stat = (value: string | number, label: string) => (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "800" }}>{value}</Text>
      <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2, textAlign: "center" }}>{label}</Text>
    </View>
  );

  const header = (
    <View>
      <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)" as any))} accessibilityRole="button" accessibilityLabel={t.back}>
        <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "700", paddingVertical: 14 }}>{t.back}</Text>
      </Pressable>
      <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 30, fontWeight: "800" }}>{t.title}</Text>
      <Text style={{ color: colors.muted, fontSize: 15, marginTop: 4 }}>{t.subtitle}</Text>

      <View accessible accessibilityLabel={`${summary.discoveredSpecies} / ${summary.totalSpecies} ${t.discovered}, ${summary.percent}%. ${t.level} ${summary.level}.`}
        style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 16, marginTop: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
          <View>
            <Text style={{ color: colors.primary, fontSize: 40, fontWeight: "900" }}>{summary.percent}%</Text>
            <Text style={{ color: colors.muted, fontWeight: "700" }}>{summary.discoveredSpecies} / {summary.totalSpecies} {t.discovered}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700", letterSpacing: 1 }}>{t.level.toUpperCase()}</Text>
            <Text style={{ color: colors.foreground, fontSize: 34, fontWeight: "900" }}>{summary.level}</Text>
          </View>
        </View>
        <View style={{ marginTop: 12 }}><ProgressBar percent={summary.percent} color={colors.primary} track={colors.border} height={10} /></View>
        <View style={{ marginTop: 12 }}><ProgressBar percent={(summary.levelXp / XP_PER_LEVEL) * 100} color={colors.warning} track={colors.border} height={6} /></View>
        <Text style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>{summary.xp} {t.xp} · {t.toNext(XP_PER_LEVEL - summary.levelXp)}</Text>
        <View style={{ flexDirection: "row", marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14 }}>
          {stat(summary.totalSightings, t.sightings)}
          {stat(summary.fieldDays, t.days)}
          {stat(summary.badges.filter((badge) => badge.unlocked).length + "/" + summary.badges.length, t.badges)}
        </View>
        {summary.unmatchedSightings > 0 && <Text style={{ color: colors.muted, fontSize: 12, marginTop: 10 }}>{t.unmatched(summary.unmatchedSightings)}</Text>}
      </View>

      <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 20, fontWeight: "800", marginTop: 24, marginBottom: 10 }}>{t.byGroup}</Text>
      {summary.groups.map((item) => (
        <Pressable key={item.group} onPress={() => setGroup(group === item.group ? "all" : item.group)} accessibilityRole="button" accessibilityState={{ selected: group === item.group }}
          accessibilityLabel={`${GROUP_LABELS[item.group][lang]}: ${item.discovered} / ${item.total}, ${item.percent}%`} style={({ pressed }) => [{ marginBottom: 12 }, pressed && { opacity: 0.8 }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 5 }}>
            <Text style={{ color: group === item.group ? colors.primary : colors.foreground, fontWeight: "700" }}>{GROUP_LABELS[item.group][lang]}</Text>
            <Text style={{ color: colors.muted, fontWeight: "700" }}>{item.discovered}/{item.total} · {item.percent}%</Text>
          </View>
          <ProgressBar percent={item.percent} color={item.discovered === item.total ? colors.success : colors.primary} track={colors.border} />
        </Pressable>
      ))}

      <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 20, fontWeight: "800", marginTop: 14, marginBottom: 10 }}>{t.badges}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}>
        {summary.badges.map((badge) => {
          const [title, description] = BADGES[badge.id][lang];
          return (
            <View key={badge.id} accessible accessibilityLabel={`${title}. ${description}. ${badge.current}/${badge.target}`}
              style={{ width: 150, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: badge.unlocked ? colors.primary : colors.border, backgroundColor: colors.surface, opacity: badge.unlocked ? 1 : 0.7 }}>
              <Text style={{ fontSize: 26, opacity: badge.unlocked ? 1 : 0.35 }}>{BADGES[badge.id].icon}</Text>
              <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 6 }}>{title}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 3, minHeight: 32 }}>{description}</Text>
              <View style={{ marginTop: 8 }}><ProgressBar percent={badge.target ? (badge.current / badge.target) * 100 : 0} color={badge.unlocked ? colors.success : colors.warning} track={colors.border} height={5} /></View>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>{badge.current}/{badge.target}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 22 }}>
        {chip(t.all, filter === "all", () => setFilter("all"), "all")}
        {chip(t.found, filter === "discovered", () => setFilter("discovered"), "discovered")}
        {chip(t.missing, filter === "missing", () => setFilter("missing"), "missing")}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginTop: 10 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingBottom: 14 }}>
        {chip(t.allGroups, group === "all", () => setGroup("all"), "group-all")}
        {groups.map((item) => chip(GROUP_LABELS[item][lang], group === item, () => setGroup(item), `group-${item}`))}
      </ScrollView>
    </View>
  );

  const renderItem = ({ item }: { item: CollectionEntry }) => {
    const number = formatCollectionNumber(item.number);
    const name = item.species.commonName;
    return (
      <Pressable onPress={() => router.push({ pathname: "/species/[id]", params: { id: item.species.id } } as any)} accessibilityRole="button"
        accessibilityLabel={item.discovered ? `${number} ${t.open(name)}. ${t.seen(item.sightingCount)}` : t.openUnknown(number)}
        style={({ pressed }) => [{ width: cardWidth, borderRadius: 14, borderWidth: 1, borderColor: item.discovered ? colors.primary : colors.border, backgroundColor: colors.surface, overflow: "hidden" }, pressed && { opacity: 0.8 }]}>
        {item.discovered
          ? <RemoteImage source={item.species.images[0] ? { uri: item.species.images[0].uri } : undefined} label={name} style={{ width: "100%", height: cardWidth }} />
          : <View style={{ width: "100%", height: cardWidth, alignItems: "center", justifyContent: "center", backgroundColor: colors.border }}><Text style={{ color: colors.muted, fontSize: 34, fontWeight: "900" }}>?</Text></View>}
        <View style={{ padding: 8 }}>
          <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "800" }}>{number}</Text>
          <Text numberOfLines={2} style={{ color: item.discovered ? colors.foreground : colors.muted, fontSize: 13, fontWeight: "800", marginTop: 2, minHeight: 34 }}>{item.discovered ? name : t.unknown}</Text>
          <Text numberOfLines={1} style={{ color: item.discovered ? colors.primary : colors.muted, fontSize: 11, marginTop: 2 }}>{item.discovered ? t.seen(item.sightingCount) : GROUP_LABELS[item.species.group][lang]}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5">
      <FlatList
        key={`cols-${columns}`}
        data={visible}
        keyExtractor={(item) => item.species.id}
        numColumns={columns}
        renderItem={renderItem}
        ListHeaderComponent={header}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ gap, paddingBottom: 40 }}
        initialNumToRender={18}
        windowSize={7}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<View style={{ alignItems: "center", paddingVertical: 30 }}>
          <Text style={{ color: colors.muted, marginBottom: 12 }}>{t.empty}</Text>
          <Pressable onPress={() => router.push("/sightings/new" as any)} accessibilityRole="button" style={({ pressed }) => [{ backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14 }, pressed && { opacity: 0.8 }]}>
            <Text style={{ color: colors.background, fontWeight: "700" }}>{t.register}</Text>
          </Pressable>
        </View>}
      />
    </ScreenContainer>
  );
}
