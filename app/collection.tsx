/**
 * PantanalDex — Minha coleção (UC10): XP, nível, progresso por grupo, conquistas e insígnias de Explorador do Pantanal.
 *
 * @author Felipe de Souza Aquino
 */
import { useEffect, useMemo, useState } from "react";
import { FlatList, Image, Modal, Pressable, ScrollView, View, useWindowDimensions } from "react-native";
import { Text } from "@/components/T";
import { GradientFill, MagicCard } from "@/components/orbita";
import { GrowBar, NumberTicker } from "@/components/orbit-effects";
import { gradientFor, gradients, groupIcon } from "@/constants/design";
import { router } from "expo-router";

import { RemoteImage } from "@/components/RemoteImage";
import { ArtIcon, type ArtName } from "@/components/ArtIcon";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";
import { filterSpeciesCatalog, findSpeciesById } from "@/shared/catalog";
import { buildPhotoGallery, type GalleryPhoto } from "@/shared/photo-gallery";
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
import { getLanguageCode } from "@/shared/i18n";
import { EXPLORER_TIERS, explorerProgress, loadVisits, TOURIST_SPOTS, type SpotVisits } from "@/shared/tourist-spots";

const EXPLORER = {
  pt: { title: "Explorador do Pantanal", cities: (v: number, t: number) => `Todas as cidades pantaneiras: ${v}/${t}`, citiesHint: "Visite os 16 municípios do Pantanal para ganhar a insígnia Pantaneiro.", spots: "Lugares", towns: "Cidades", hint: "Visite os pontos turísticos no mapa público e faça check-in para ganhar as insígnias.", tiers: { bronze: "Bronze", prata: "Prata", ouro: "Ouro" }, need: (n: number) => `${n} lugares`, open: "Abrir o mapa" },
  en: { title: "Pantanal Explorer", cities: (v: number, t: number) => `All Pantanal towns: ${v}/${t}`, citiesHint: "Visit the 16 Pantanal municipalities to earn the Pantaneiro badge.", spots: "Places", towns: "Towns", hint: "Visit the landmarks on the public map and check in to earn badges.", tiers: { bronze: "Bronze", prata: "Silver", ouro: "Gold" }, need: (n: number) => `${n} places`, open: "Open the map" },
  es: { title: "Explorador del Pantanal", cities: (v: number, t: number) => `Todas las ciudades pantaneras: ${v}/${t}`, citiesHint: "Visita los 16 municipios del Pantanal para ganar la insignia Pantanero.", spots: "Lugares", towns: "Ciudades", hint: "Visita los puntos turísticos del mapa público y haz check-in para ganar insignias.", tiers: { bronze: "Bronce", prata: "Plata", ouro: "Oro" }, need: (n: number) => `${n} lugares`, open: "Abrir el mapa" },
  de: { title: "Pantanal-Entdecker", cities: (v: number, t: number) => `Alle Pantanal-Städte: ${v}/${t}`, citiesHint: "Besuche die 16 Pantanal-Gemeinden für das Abzeichen Pantaneiro.", spots: "Orte", towns: "Städte", hint: "Besuche die Sehenswürdigkeiten auf der öffentlichen Karte und checke ein, um Abzeichen zu erhalten.", tiers: { bronze: "Bronze", prata: "Silber", ouro: "Gold" }, need: (n: number) => `${n} Orte`, open: "Karte öffnen" },
} as const;

type Lang = "pt" | "en" | "es";

const TEXT = {
  pt: {
    tabSpecies: "Espécies", tabPhotos: "Minhas fotos", photosSubtitle: "As fotos que você vinculou aos seus registros, da mais recente para a mais antiga.", photosEmpty: "Nenhuma foto ainda", photosEmptyHint: "Tire a primeira foto de um avistamento: ela aparece aqui assim que o registro for salvo.", openRecord: "Abrir registro", closePhoto: "Fechar foto", photoOf: "Foto de",
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
    tabSpecies: "Species", tabPhotos: "My photos", photosSubtitle: "Photos you linked to your sightings, newest first.", photosEmpty: "No photos yet", photosEmptyHint: "Take your first sighting photo: it shows up here as soon as the record is saved.", openRecord: "Open record", closePhoto: "Close photo", photoOf: "Photo of",
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
    tabSpecies: "Especies", tabPhotos: "Mis fotos", photosSubtitle: "Las fotos que vinculaste a tus registros, de la más reciente a la más antigua.", photosEmpty: "Aún no hay fotos", photosEmptyHint: "Toma tu primera foto de un avistamiento: aparece aquí en cuanto guardes el registro.", openRecord: "Abrir registro", closePhoto: "Cerrar foto", photoOf: "Foto de",
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

const BADGES: Record<BadgeId, { icon: ArtName; pt: [string, string]; en: [string, string]; es: [string, string] }> = {
  "first-sighting": { icon: "caderno", pt: ["Primeiro registro", "Registre seu primeiro avistamento"], en: ["First entry", "Log your first sighting"], es: ["Primer registro", "Registra tu primer avistamiento"] },
  "five-species": { icon: "lupa", pt: ["Explorador", "Descubra 5 espécies"], en: ["Explorer", "Discover 5 species"], es: ["Explorador", "Descubre 5 especies"] },
  "twenty-five-species": { icon: "bussola", pt: ["Naturalista", "Descubra 25 espécies"], en: ["Naturalist", "Discover 25 species"], es: ["Naturalista", "Descubre 25 especies"] },
  "all-groups": { icon: "folhas", pt: ["Biodiversidade", "Uma espécie de cada grupo"], en: ["Biodiversity", "One species from every group"], es: ["Biodiversidad", "Una especie de cada grupo"] },
  "pantanal-icons": { icon: "pegada", pt: ["Cinco do Pantanal", "Onça, tuiuiú, arara-azul, capivara e jacaré"], en: ["Pantanal Five", "Jaguar, jabiru, hyacinth macaw, capybara, caiman"], es: ["Cinco del Pantanal", "Jaguar, tuyuyú, guacamayo, carpincho y yacaré"] },
  birdwatcher: { icon: "pena", pt: ["Observador de aves", "Descubra 10 aves"], en: ["Birdwatcher", "Discover 10 birds"], es: ["Observador de aves", "Descubre 10 aves"] },
  "ten-field-days": { icon: "calendario", pt: ["Dez dias de campo", "Registre em 10 dias diferentes"], en: ["Ten field days", "Log on 10 different days"], es: ["Diez días de campo", "Registra en 10 días distintos"] },
  "full-group": { icon: "trofeu", pt: ["Grupo completo", "Descubra todas as espécies de um grupo"], en: ["Full group", "Discover every species in a group"], es: ["Grupo completo", "Descubre todas las especies de un grupo"] },
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
  const colors = useColors();
  const { sightings, settings } = useApp();
  const lang: Lang = settings.defaultLanguage === "English" ? "en" : settings.defaultLanguage === "Español" ? "es" : "pt";
  const t = TEXT[lang];
  const { width } = useWindowDimensions();
  const columns = width >= 700 ? 5 : width >= 480 ? 4 : 3;
  const gap = 10;
  const cardWidth = (Math.min(width, 900) - 40 - gap * (columns - 1)) / columns;

  const [filter, setFilter] = useState<CollectionFilter>("all");
  const [view, setView] = useState<"especies" | "fotos">("especies");
  const [viewer, setViewer] = useState<GalleryPhoto | null>(null);
  const gallery = useMemo(() => buildPhotoGallery(sightings), [sightings]);
  const photoColumns = width >= 700 ? 4 : 3;
  const photoSize = (Math.min(width, 900) - 40 - 6 * (photoColumns - 1)) / photoColumns;
  const [group, setGroup] = useState<SpeciesGroup | "all">("all");

  const catalog = useMemo(() => filterSpeciesCatalog(), []);
  const summary = useMemo(() => computeCollection(catalog, sightings), [catalog, sightings]);
  const [visits, setVisits] = useState<SpotVisits>({});
  useEffect(() => { void loadVisits().then(setVisits); }, []);
  const explorer = explorerProgress(visits);
  const spotLang = getLanguageCode();
  const ex = EXPLORER[spotLang] ?? EXPLORER.pt;
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
      <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 30, fontFamily: "Fraunces_700Bold", letterSpacing: -0.5 }}>{t.title}</Text>
      <Text style={{ color: colors.muted, fontSize: 15, marginTop: 4 }}>{view === "fotos" ? t.photosSubtitle : t.subtitle}</Text>
      <View accessibilityRole="tablist" style={{ flexDirection: "row", marginTop: 16, padding: 4, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}>
        {([["especies", t.tabSpecies, "folhas"], ["fotos", `${t.tabPhotos} · ${gallery.length}`, "fotos"]] as const).map(([key, label, art]) => {
          const active = view === key;
          return (
            <Pressable key={key} onPress={() => setView(key)} accessibilityRole="tab" accessibilityState={{ selected: active }} accessibilityLabel={label} testID={`collection-tab-${key}`}
              style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 42, borderRadius: 12, backgroundColor: active ? colors.primary : "transparent" }}>
              <ArtIcon name={art} size={18} />
              <Text style={{ color: active ? colors.background : colors.foreground, fontWeight: "800" }}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
      {view === "especies" && (<>

      <View accessible accessibilityLabel={`${summary.discoveredSpecies} / ${summary.totalSpecies} ${t.discovered}, ${summary.percent}%. ${t.level} ${summary.level}.`}
        style={{ borderColor: colors.border, borderWidth: 1, borderRadius: 24, padding: 18, marginTop: 18, overflow: "hidden" }}>
        <GradientFill g={gradients.ocaso} glowAt={{ x: "85%", y: "0%" }} />
        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
          <View>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}><NumberTicker value={summary.percent} style={{ color: "#FFF3D6", fontSize: 48, fontFamily: "Fraunces_700Bold" }} /><Text style={{ color: "#FFF3D6", fontSize: 26, fontFamily: "Fraunces_700Bold" }}>%</Text></View>
            <Text style={{ color: colors.muted, fontWeight: "700" }}>{summary.discoveredSpecies} / {summary.totalSpecies} {t.discovered}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700", letterSpacing: 1 }}>{t.level.toUpperCase()}</Text>
            <Text style={{ color: "#FFF3D6", fontSize: 38, fontFamily: "Fraunces_700Bold" }}>{summary.level}</Text>
          </View>
        </View>
        <View style={{ marginTop: 12 }}><GrowBar label={t.discovered} percent={summary.percent} color={colors.primary} track="rgba(0,0,0,0.35)" height={10} /></View>
        <View style={{ marginTop: 10 }}><GrowBar label={t.xp} percent={(summary.levelXp / XP_PER_LEVEL) * 100} color="#FFF3D6" track="rgba(0,0,0,0.35)" height={5} delay={500} /></View>
        <Text style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>{summary.xp} {t.xp} · {t.toNext(XP_PER_LEVEL - summary.levelXp)}</Text>
        <View style={{ flexDirection: "row", marginTop: 16, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14 }}>
          {stat(summary.totalSightings, t.sightings)}
          {stat(summary.fieldDays, t.days)}
          {stat(summary.badges.filter((badge) => badge.unlocked).length + "/" + summary.badges.length, t.badges)}
        </View>
        {summary.unmatchedSightings > 0 && <Text style={{ color: colors.muted, fontSize: 12, marginTop: 10 }}>{t.unmatched(summary.unmatchedSightings)}</Text>}
      </View>

      <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 20, fontWeight: "800", marginTop: 24, marginBottom: 10 }}>{t.byGroup}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
      {summary.groups.map((item) => {
        const g = gradientFor(item.group);
        const selected = group === item.group;
        return (
          <MagicCard key={item.group} glow={g.glow} onPress={() => setGroup(selected ? "all" : item.group)} accessibilityRole="button" accessibilityState={{ selected }}
            accessibilityLabel={`${GROUP_LABELS[item.group][lang]}: ${item.discovered} / ${item.total}, ${item.percent}%`}
            style={{ width: "48%", minHeight: 108, borderRadius: 20, padding: 12, borderWidth: selected ? 2 : 0, borderColor: colors.primary, justifyContent: "space-between" }}>
            <GradientFill g={g} />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <ArtIcon name={groupIcon[item.group]} size={30} />
              <Text style={{ color: g.ink, fontWeight: "900" }}>{item.percent}%</Text>
            </View>
            <View>
              <Text style={{ color: g.ink, fontWeight: "900" }}>{GROUP_LABELS[item.group][lang]}</Text>
              <Text style={{ color: g.ink, opacity: 0.8, fontSize: 12, marginBottom: 6 }}>{item.discovered}/{item.total}</Text>
              <GrowBar label={GROUP_LABELS[item.group][lang]} percent={item.percent} color={g.ink} track="rgba(0,0,0,0.3)" height={4} />
            </View>
          </MagicCard>
        );
      })}
      </View>

      <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 20, fontWeight: "800", marginTop: 14, marginBottom: 10 }}>{t.badges}</Text>
      <ScrollView horizontal tabIndex={0} accessibilityLabel={t.badges} showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }} contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}>
        {summary.badges.map((badge) => {
          const [title, description] = BADGES[badge.id][lang];
          return (
            <View key={badge.id} accessible accessibilityLabel={`${title}. ${description}. ${badge.current}/${badge.target}`}
              style={{ width: 150, padding: 12, borderRadius: 16, borderWidth: 1, borderColor: badge.unlocked ? colors.primary : colors.border, backgroundColor: colors.surface, opacity: badge.unlocked ? 1 : 0.7 }}>
              <ArtIcon name={BADGES[badge.id].icon} size={34} dim={!badge.unlocked} />
              <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 6 }}>{title}</Text>
              <Text style={{ color: colors.muted, fontSize: 12, marginTop: 3, minHeight: 32 }}>{description}</Text>
              <View style={{ marginTop: 8 }}><ProgressBar percent={badge.target ? (badge.current / badge.target) * 100 : 0} color={badge.unlocked ? colors.success : colors.warning} track={colors.border} height={5} /></View>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 4 }}>{badge.current}/{badge.target}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 22, marginBottom: 6 }}>
        <ArtIcon name={explorer.tier ? "medalha" : "bussola"} size={28} />
        <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 20, fontWeight: "800", flex: 1 }}>{ex.title} · {explorer.visited}/{explorer.total}</Text>
      </View>
      <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 10 }}>{ex.hint}</Text>
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
        {EXPLORER_TIERS.map((tier) => {
          const done = explorer.visited >= tier.need;
          return (
            <View key={tier.id} accessible accessibilityLabel={`${ex.tiers[tier.id]}: ${ex.need(tier.need)}`} style={{ flex: 1, alignItems: "center", padding: 10, borderRadius: 14, borderWidth: 1, borderColor: done ? colors.primary : colors.border, backgroundColor: colors.surface }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: done ? tier.tone : colors.border, alignItems: "center", justifyContent: "center", marginBottom: 4 }}><ArtIcon name={tier.icon} size={28} dim={!done} /></View>
              <Text style={{ color: colors.foreground, fontWeight: "800" }}>{ex.tiers[tier.id]}</Text>
              <Text style={{ color: colors.muted, fontSize: 11 }}>{ex.need(tier.need)}</Text>
            </View>
          );
        })}
      </View>
      <View accessible style={{ flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: explorer.allCities ? colors.primary : colors.border, backgroundColor: colors.surface, marginBottom: 12 }}>
        <ArtIcon name="cidade" size={34} dim={!explorer.allCities} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.foreground, fontWeight: "800" }}>{ex.cities(explorer.cities, explorer.citiesTotal)}</Text>
          <Text style={{ color: colors.muted, fontSize: 12 }}>{ex.citiesHint}</Text>
        </View>
      </View>
      {[[ex.spots, TOURIST_SPOTS.filter((s) => !s.city)], [ex.towns, TOURIST_SPOTS.filter((s) => s.city)]].map(([label, list]) => (
      <View key={label as string}>
      <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "800", letterSpacing: 1, marginBottom: 8 }}>{(label as string).toUpperCase()}</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {(list as typeof TOURIST_SPOTS).map((spot) => {
          const done = !!visits[spot.id];
          const name = spot.name[spotLang] ?? spot.name.pt;
          return (
            <View key={spot.id} accessible accessibilityLabel={name + (done ? ", visitado" : ", ainda não visitado")} style={{ width: 72, alignItems: "center" }}>
              <View style={{ width: 44, height: 44, borderRadius: 10, transform: [{ rotate: "45deg" }], borderWidth: 3, borderColor: done ? "#FFFFFF" : colors.primary, backgroundColor: done ? colors.primary : colors.background, alignItems: "center", justifyContent: "center", opacity: done ? 1 : 0.55 }}>
                <View style={{ transform: [{ rotate: "-45deg" }] }}><ArtIcon name={spot.icon} size={24} /></View>
              </View>
              <Text numberOfLines={2} style={{ color: done ? colors.foreground : colors.muted, fontSize: 10, textAlign: "center", marginTop: 6 }}>{name}</Text>
            </View>
          );
        })}
      </View>
      </View>
      ))}
      <Pressable onPress={() => router.push("/public-map" as any)} accessibilityRole="button" style={({ pressed }) => [{ marginTop: 10, borderColor: colors.primary, borderWidth: 1, borderRadius: 12, padding: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }, pressed && { opacity: 0.8 }]}>
        <ArtIcon name="mapa" size={22} />
        <Text style={{ color: colors.primary, textAlign: "center", fontWeight: "800" }}>{ex.open}</Text>
      </Pressable>

      <View style={{ flexDirection: "row", gap: 8, marginTop: 22 }}>
        {chip(t.all, filter === "all", () => setFilter("all"), "all")}
        {chip(t.found, filter === "discovered", () => setFilter("discovered"), "discovered")}
        {chip(t.missing, filter === "missing", () => setFilter("missing"), "missing")}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, marginTop: 10 }} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingBottom: 14 }}>
        {chip(t.allGroups, group === "all", () => setGroup("all"), "group-all")}
        {groups.map((item) => chip(GROUP_LABELS[item][lang], group === item, () => setGroup(item), `group-${item}`))}
      </ScrollView>
      </>)}
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
      {view === "fotos" ? (
        <FlatList
          key={`photos-${photoColumns}`}
          data={gallery}
          keyExtractor={(item) => item.key}
          numColumns={photoColumns}
          ListHeaderComponent={<View style={{ marginBottom: 14 }}>{header}</View>}
          columnWrapperStyle={{ gap: 6 }}
          contentContainerStyle={{ gap: 6, paddingBottom: 40 }}
          initialNumToRender={15}
          windowSize={7}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const name = findSpeciesById(item.speciesId)?.commonName ?? item.speciesId;
            return (
              <Pressable onPress={() => setViewer(item)} accessibilityRole="imagebutton" accessibilityLabel={`${t.photoOf} ${name}, ${item.date}${item.total > 1 ? `, ${item.index + 1}/${item.total}` : ""}`} testID="gallery-item"
                style={({ pressed }) => [{ width: photoSize, height: photoSize, borderRadius: 12, overflow: "hidden", backgroundColor: colors.surface }, pressed && { opacity: 0.85 }]}>
                <RemoteImage source={{ uri: item.uri }} label={name} style={{ width: "100%", height: "100%" }} />
                {item.total > 1 && item.index === 0 && (
                  <View style={{ position: "absolute", right: 6, top: 6, flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(14,13,11,0.75)", borderRadius: 9, paddingHorizontal: 6, paddingVertical: 2 }}>
                    <ArtIcon name="fotos" size={12} /><Text style={{ color: "#FBF7EF", fontSize: 11, fontWeight: "800" }}>{item.total}</Text>
                  </View>
                )}
              </Pressable>
            );
          }}
          ListEmptyComponent={<View style={{ alignItems: "center", paddingVertical: 30, gap: 10 }} testID="gallery-empty">
            <ArtIcon name="camera" size={56} />
            <Text style={{ color: colors.foreground, fontSize: 18, fontFamily: "Fraunces_700Bold" }}>{t.photosEmpty}</Text>
            <Text style={{ color: colors.muted, textAlign: "center" }}>{t.photosEmptyHint}</Text>
            <Pressable onPress={() => router.push("/sightings/new" as any)} accessibilityRole="button" style={({ pressed }) => [{ backgroundColor: colors.primary, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 14, marginTop: 6 }, pressed && { opacity: 0.8 }]}>
              <Text style={{ color: colors.background, fontWeight: "800" }}>{t.register}</Text>
            </Pressable>
          </View>}
        />
      ) : (
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
      )}
      <Modal visible={!!viewer} transparent animationType="fade" onRequestClose={() => setViewer(null)}>
        {viewer && (
          <View style={{ flex: 1, backgroundColor: "rgba(8,7,6,0.96)", justifyContent: "center", padding: 18 }} accessibilityViewIsModal testID="gallery-viewer">
            <Image source={{ uri: viewer.uri }} resizeMode="contain" style={{ width: "100%", height: "62%" }} accessibilityLabel={`${t.photoOf} ${findSpeciesById(viewer.speciesId)?.commonName ?? viewer.speciesId}`} />
            <Text style={{ color: "#FBF7EF", fontSize: 22, fontFamily: "Fraunces_700Bold", marginTop: 16 }}>{findSpeciesById(viewer.speciesId)?.commonName ?? viewer.speciesId}</Text>
            <Text style={{ color: "#B8B0A2", marginTop: 2 }}>{viewer.date}{viewer.time ? ` · ${viewer.time}` : ""}{viewer.total > 1 ? ` · ${viewer.index + 1}/${viewer.total}` : ""}</Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}>
              <Pressable onPress={() => setViewer(null)} accessibilityRole="button" accessibilityLabel={t.closePhoto} testID="gallery-viewer-close"
                style={{ flex: 1, height: 48, borderRadius: 14, borderWidth: 1, borderColor: "#4A4234", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#FBF7EF", fontWeight: "800" }}>{t.closePhoto}</Text>
              </Pressable>
              <Pressable onPress={() => { const id = viewer.sightingId; setViewer(null); router.push({ pathname: "/sightings/[id]", params: { id } } as any); }} accessibilityRole="button" accessibilityLabel={t.openRecord} testID="gallery-open-record"
                style={{ flex: 1, height: 48, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: colors.background, fontWeight: "900" }}>{t.openRecord}</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>
    </ScreenContainer>
  );
}
