import { useMemo, useState } from "react";
import { Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";
import { router } from "expo-router";

import { PublicMap, type PublicMapLabels } from "@/components/PublicMap";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import { usePublications } from "@/contexts/PublicationsContext";
import { useColors } from "@/hooks/use-colors";
import { filterSpeciesCatalog } from "@/shared/catalog";
import {
  buildSampleRecords,
  filterByDate,
  HIGH_INCIDENCE_MIN,
  isRecordActive,
  myPublicRecords,
  type DateFilter,
  type DatePreset,
  type RecordCluster,
} from "@/shared/public-map";

type Lang = "pt" | "en" | "es";

const TEXT = {
  pt: {
    back: "‹ Voltar", title: "Mapa público",
    subtitle: "Registros públicos das pessoas, sempre com localização aproximada (~11 km). Áreas com muitos registros aparecem juntas como área de alta incidência.",
    local: "Somente neste aparelho: seus registros públicos" , samples: "Mostrar registros de exemplo", samplesHint: "Exemplos de demonstração, até o servidor ser ligado. Aparecem marcados como exemplo.",
    period: "Período", presets: { "7d": "7 dias", "30d": "30 dias", "365d": "12 meses", all: "Tudo" } as Record<DatePreset, string>, custom: "Escolher datas",
    from: "De (AAAA-MM-DD)", to: "Até (AAAA-MM-DD)",
    summary: (records: number, areas: number) => `${records} ${records === 1 ? "registro" : "registros"} em ${areas} ${areas === 1 ? "área" : "áreas"}`,
    legendNormal: "Registros na área", legendHigh: `Alta incidência (${HIGH_INCIDENCE_MIN}+ registros)`,
    empty: "Nenhum registro público neste período.", manage: "Gerenciar meus registros públicos",
    area: "Área selecionada", count: (n: number) => `${n} ${n === 1 ? "registro" : "registros"}`, species: (n: number) => `${n} ${n === 1 ? "espécie" : "espécies"}`, sample: "exemplo", mine: "seu", unknown: "Espécie não identificada",
    tapHint: "Toque num círculo para ver os registros daquela área.",
    map: {
      zoomIn: "Aproximar", zoomOut: "Afastar", west: "Mover para oeste", north: "Mover para norte", south: "Mover para sul", east: "Mover para leste", fit: "Enquadrar", world: "Mundo",
      cluster: (c: RecordCluster) => `${c.count} ${c.count === 1 ? "registro" : "registros"}, ${c.speciesCount} ${c.speciesCount === 1 ? "espécie" : "espécies"}${c.highIncidence ? ", área de alta incidência" : ""}. Ver detalhes`,
      credit: "Mapa offline · continentes: Natural Earth (domínio público) · contorno do Pantanal: IBGE 2025",
    } as PublicMapLabels,
  },
  en: {
    back: "‹ Back", title: "Public map",
    subtitle: "People's public records, always with an approximate location (~11 km). Areas with many records are grouped as high-incidence areas.",
    local: "This device only: your public records", samples: "Show sample records", samplesHint: "Demo examples until the server is connected. They are labeled as samples.",
    period: "Period", presets: { "7d": "7 days", "30d": "30 days", "365d": "12 months", all: "All" } as Record<DatePreset, string>, custom: "Pick dates",
    from: "From (YYYY-MM-DD)", to: "To (YYYY-MM-DD)",
    summary: (records: number, areas: number) => `${records} ${records === 1 ? "record" : "records"} in ${areas} ${areas === 1 ? "area" : "areas"}`,
    legendNormal: "Records in the area", legendHigh: `High incidence (${HIGH_INCIDENCE_MIN}+ records)`,
    empty: "No public records in this period.", manage: "Manage my public records",
    area: "Selected area", count: (n: number) => `${n} ${n === 1 ? "record" : "records"}`, species: (n: number) => `${n} species`, sample: "sample", mine: "yours", unknown: "Unidentified species",
    tapHint: "Tap a circle to see the records in that area.",
    map: {
      zoomIn: "Zoom in", zoomOut: "Zoom out", west: "Move west", north: "Move north", south: "Move south", east: "Move east", fit: "Fit", world: "World",
      cluster: (c: RecordCluster) => `${c.count} ${c.count === 1 ? "record" : "records"}, ${c.speciesCount} species${c.highIncidence ? ", high-incidence area" : ""}. Show details`,
      credit: "Offline map · land: Natural Earth (public domain) · Pantanal outline: IBGE 2025",
    } as PublicMapLabels,
  },
  es: {
    back: "‹ Volver", title: "Mapa público",
    subtitle: "Registros públicos de las personas, siempre con ubicación aproximada (~11 km). Las áreas con muchos registros se agrupan como áreas de alta incidencia.",
    local: "Solo en este dispositivo: tus registros públicos", samples: "Mostrar registros de ejemplo", samplesHint: "Ejemplos de demostración hasta conectar el servidor. Aparecen marcados como ejemplo.",
    period: "Período", presets: { "7d": "7 días", "30d": "30 días", "365d": "12 meses", all: "Todo" } as Record<DatePreset, string>, custom: "Elegir fechas",
    from: "Desde (AAAA-MM-DD)", to: "Hasta (AAAA-MM-DD)",
    summary: (records: number, areas: number) => `${records} ${records === 1 ? "registro" : "registros"} en ${areas} ${areas === 1 ? "área" : "áreas"}`,
    legendNormal: "Registros en el área", legendHigh: `Alta incidencia (${HIGH_INCIDENCE_MIN}+ registros)`,
    empty: "No hay registros públicos en este período.", manage: "Gestionar mis registros públicos",
    area: "Área seleccionada", count: (n: number) => `${n} ${n === 1 ? "registro" : "registros"}`, species: (n: number) => `${n} ${n === 1 ? "especie" : "especies"}`, sample: "ejemplo", mine: "tuyo", unknown: "Especie no identificada",
    tapHint: "Toca un círculo para ver los registros de esa área.",
    map: {
      zoomIn: "Acercar", zoomOut: "Alejar", west: "Mover al oeste", north: "Mover al norte", south: "Mover al sur", east: "Mover al este", fit: "Encuadrar", world: "Mundo",
      cluster: (c: RecordCluster) => `${c.count} ${c.count === 1 ? "registro" : "registros"}, ${c.speciesCount} ${c.speciesCount === 1 ? "especie" : "especies"}${c.highIncidence ? ", área de alta incidencia" : ""}. Ver detalles`,
      credit: "Mapa sin conexión · continentes: Natural Earth (dominio público) · contorno del Pantanal: IBGE 2025",
    } as PublicMapLabels,
  },
} as const;

export default function PublicMapScreen() {
  const colors = useColors();
  const { sightings, settings } = useApp();
  const { store } = usePublications();
  const lang: Lang = settings.defaultLanguage === "English" ? "en" : settings.defaultLanguage === "Español" ? "es" : "pt";
  const t = TEXT[lang];

  const catalog = useMemo(() => filterSpeciesCatalog(), []);
  const names = useMemo(() => new Map(catalog.map((item) => [item.id, item.commonName])), [catalog]);
  const [showSamples, setShowSamples] = useState(true);
  const [filter, setFilter] = useState<DateFilter>({ preset: "all" });
  const [customOpen, setCustomOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState<RecordCluster | null>(null);

  const now = useMemo(() => new Date(), []);
  const samples = useMemo(() => buildSampleRecords(catalog, now), [catalog, now]);
  const records = useMemo(() => {
    const all = [...myPublicRecords(sightings, store, now), ...(showSamples ? samples : [])].filter((item) => isRecordActive(item, now));
    return filterByDate(all, filter, now);
  }, [sightings, store, now, showSamples, samples, filter]);

  // A área selecionada é refeita a partir dos registros filtrados atuais, para não mostrar dados desatualizados.
  const selectedRecords = selected ? records.filter((record) => selected.records.some((item) => item.id === record.id)) : [];
  const areaCount = useMemo(() => new Set(records.map((item) => `${item.latitude}:${item.longitude}`)).size, [records]);

  const presetActive = (preset: DatePreset) => "preset" in filter && filter.preset === preset;
  const chip = (label: string, active: boolean, onPress: () => void) => (
    <Pressable key={label} onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }}
      style={({ pressed }) => [{ paddingHorizontal: 14, paddingVertical: 9, minHeight: 40, justifyContent: "center", borderRadius: 999, borderWidth: 1, borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.surface }, pressed && { opacity: 0.8 }]}>
      <Text style={{ color: active ? colors.background : colors.foreground, fontWeight: "700", fontSize: 13 }}>{label}</Text>
    </Pressable>
  );

  const applyCustom = (nextFrom: string, nextTo: string) => {
    setFrom(nextFrom);
    setTo(nextTo);
    setFilter({ from: nextFrom, to: nextTo });
    setSelected(null);
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)" as any))} accessibilityRole="button" accessibilityLabel={t.back}>
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "700", paddingVertical: 14 }}>{t.back}</Text>
        </Pressable>
        <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 28, fontWeight: "800" }}>{t.title}</Text>
        <Text style={{ color: colors.muted, fontSize: 15, marginTop: 4 }}>{t.subtitle}</Text>

        <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 14 }}>
          <Text style={{ color: colors.foreground, fontWeight: "700" }}>{t.local}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
            <Text style={{ color: colors.foreground, flex: 1 }}>{t.samples}</Text>
            <Switch value={showSamples} onValueChange={(value) => { setShowSamples(value); setSelected(null); }} accessibilityLabel={t.samples} trackColor={{ true: colors.primary, false: colors.border }} />
          </View>
          {showSamples && <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>{t.samplesHint}</Text>}
        </View>

        <Text style={{ color: colors.foreground, fontWeight: "800", marginTop: 16, marginBottom: 8 }}>{t.period}</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {(["7d", "30d", "365d", "all"] as DatePreset[]).map((preset) => chip(t.presets[preset], presetActive(preset), () => { setFilter({ preset }); setCustomOpen(false); setSelected(null); }))}
          {chip(t.custom, customOpen || !("preset" in filter), () => setCustomOpen((open) => !open))}
        </View>
        {customOpen && (
          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <TextInput value={from} onChangeText={(value) => applyCustom(value, to)} placeholder={t.from} accessibilityLabel={t.from} placeholderTextColor={colors.muted} autoCapitalize="none" keyboardType="numbers-and-punctuation"
              style={{ flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 10, color: colors.foreground, backgroundColor: colors.surface }} />
            <TextInput value={to} onChangeText={(value) => applyCustom(from, value)} placeholder={t.to} accessibilityLabel={t.to} placeholderTextColor={colors.muted} autoCapitalize="none" keyboardType="numbers-and-punctuation"
              style={{ flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 10, color: colors.foreground, backgroundColor: colors.surface }} />
          </View>
        )}

        <Text accessibilityLiveRegion="polite" style={{ color: colors.foreground, fontWeight: "800", marginTop: 16, marginBottom: 8 }}>{t.summary(records.length, areaCount)}</Text>
        <PublicMap records={records} selectedKey={selected?.key ?? null} onSelectCluster={setSelected} labels={t.map} />

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary }} /><Text style={{ color: colors.muted, fontSize: 12 }}>{t.legendNormal}</Text></View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#C2410C" }} /><Text style={{ color: colors.muted, fontSize: 12 }}>{t.legendHigh}</Text></View>
        </View>

        {records.length === 0 && <Text style={{ color: colors.muted, marginTop: 12 }}>{t.empty}</Text>}
        {records.length > 0 && !selected && <Text style={{ color: colors.muted, marginTop: 12 }}>{t.tapHint}</Text>}

        {selected && selectedRecords.length > 0 && (
          <View style={{ backgroundColor: colors.surface, borderColor: selected.highIncidence ? "#C2410C" : colors.primary, borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 14 }} accessibilityLiveRegion="polite">
            <Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 16 }}>{t.area}: {t.count(selectedRecords.length)} · {t.species(new Set(selectedRecords.map((item) => item.speciesId)).size)}</Text>
            {selectedRecords.slice(0, 30).map((record) => (
              <Pressable key={record.id} onPress={() => names.has(record.speciesId) && router.push({ pathname: "/species/[id]", params: { id: record.speciesId } } as any)} accessibilityRole={names.has(record.speciesId) ? "button" : undefined}
                style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border, marginTop: 6 }}>
                <Text style={{ color: colors.foreground, flex: 1 }}>{names.get(record.speciesId) ?? t.unknown}</Text>
                <Text style={{ color: colors.muted }}>{record.date}{record.sample ? ` · ${t.sample}` : record.owner === "me" ? ` · ${t.mine}` : ""}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Pressable onPress={() => router.push("/public-records" as any)} accessibilityRole="button" style={({ pressed }) => [{ borderColor: colors.primary, borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 18 }, pressed && { opacity: 0.8 }]}>
          <Text style={{ color: colors.primary, textAlign: "center", fontWeight: "800" }}>{t.manage}</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
