import { useEffect, useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView, Switch, View } from "react-native";
import { Text, TextInput } from "@/components/T";
import { router } from "expo-router";

import { PublicMap, type PublicMapLabels } from "@/components/PublicMap";
import { StreetMap } from "@/components/StreetMap";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import { usePublications } from "@/contexts/PublicationsContext";
import { useColors } from "@/hooks/use-colors";
import { filterSpeciesCatalog } from "@/shared/catalog";
import type { StreetMapEvent, StreetMapState } from "@/shared/street-map";
import * as Location from "expo-location";
import { commonsThumb } from "@/shared/image-url";
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
    local: "Somente neste aparelho: seus registros públicos", connecting: "Conectando ao servidor…", online: "Online: registros públicos de todas as pessoas", offline: "Sem conexão: mostrando seus registros e os últimos dados recebidos", pending: (n: number) => `${n} ${n === 1 ? "envio pendente" : "envios pendentes"} (vai quando houver internet)`, synced: (time: string) => `Atualizado às ${time}`, refresh: "Atualizar", samples: "Mostrar registros de exemplo", samplesHint: "Exemplos de demonstração, até o servidor ser ligado. Aparecem marcados como exemplo.",
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
    local: "This device only: your public records", connecting: "Connecting to the server…", online: "Online: everyone's public records", offline: "Offline: showing your records and the last data received", pending: (n: number) => `${n} pending ${n === 1 ? "upload" : "uploads"} (sent when online)`, synced: (time: string) => `Updated at ${time}`, refresh: "Refresh", samples: "Show sample records", samplesHint: "Demo examples until the server is connected. They are labeled as samples.",
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
    local: "Solo en este dispositivo: tus registros públicos", connecting: "Conectando al servidor…", online: "En línea: registros públicos de todas las personas", offline: "Sin conexión: mostrando tus registros y los últimos datos recibidos", pending: (n: number) => `${n} ${n === 1 ? "envío pendiente" : "envíos pendientes"} (se envían con internet)`, synced: (time: string) => `Actualizado a las ${time}`, refresh: "Actualizar", samples: "Mostrar registros de ejemplo", samplesHint: "Ejemplos de demostración hasta conectar el servidor. Aparecen marcados como ejemplo.",
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

const EXTRA = {
  pt: { pending: "aguardando verificação", filters: "Filtros", hideFilters: "Ocultar filtros", streets: "Satélite", offlineMap: "Mapa offline", noTiles: "Sem internet para o satélite: mostrando o mapa offline.", fitAll: "Ver tudo", close: "Fechar", high: "alta incidência", records: (n: number) => `${n} ${n === 1 ? "registro" : "registros"}`, mapLabel: "Mapa público em imagem de satélite. Toque num círculo para ver os registros." },
  en: { pending: "awaiting review", filters: "Filters", hideFilters: "Hide filters", streets: "Satellite", offlineMap: "Offline map", noTiles: "No internet for the satellite map: showing the offline map.", fitAll: "Show all", close: "Close", high: "high incidence", records: (n: number) => `${n} ${n === 1 ? "record" : "records"}`, mapLabel: "Public satellite map. Tap a circle to see its records." },
  es: { pending: "esperando verificación", filters: "Filtros", hideFilters: "Ocultar filtros", streets: "Satélite", offlineMap: "Mapa sin conexión", noTiles: "Sin internet para el satélite: mostrando el mapa sin conexión.", fitAll: "Ver todo", close: "Cerrar", high: "alta incidencia", records: (n: number) => `${n} ${n === 1 ? "registro" : "registros"}`, mapLabel: "Mapa público satelital. Toca un círculo para ver sus registros." },
} as const;

export default function PublicMapScreen() {
  const colors = useColors();
  const { sightings, settings } = useApp();
  const { store, remoteRecords, feedStatus, pendingCount, lastSyncAt, refreshFeed, remoteStatus } = usePublications();
  const lang: Lang = settings.defaultLanguage === "English" ? "en" : settings.defaultLanguage === "Español" ? "es" : "pt";
  const t = TEXT[lang];
  const x = EXTRA[lang];

  const catalog = useMemo(() => filterSpeciesCatalog(), []);
  const names = useMemo(() => new Map(catalog.map((item) => [item.id, item.commonName])), [catalog]);
  // Exemplos ligados de início só quando não há servidor; com servidor, o mapa mostra os registros reais.
  const [showSamples, setShowSamples] = useState(feedStatus === "off");
  const [filter, setFilter] = useState<DateFilter>({ preset: "all" });
  const [customOpen, setCustomOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  // "streets" = mapa de ruas (internet); "offline" = mapa de contornos (sempre funciona).
  const [mapKind, setMapKind] = useState<"streets" | "offline">("streets");
  const [noTiles, setNoTiles] = useState(false);
  const [fitKey, setFitKey] = useState(1);

  // Onde a pessoa está: o mapa abre ali, sem precisar procurar.
  const [myLocation, setMyLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.granted) return;
        const current = (await Location.getLastKnownPositionAsync()) ?? (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
        if (!cancelled && current) { setMyLocation({ latitude: current.coords.latitude, longitude: current.coords.longitude }); setFitKey((k) => k + 1); }
      } catch { /* sem GPS: o mapa enquadra os registros */ }
    })();
    return () => { cancelled = true; };
  }, []);
  const coverBySpecies = useMemo(() => new Map(catalog.flatMap((item) => (item.images[0] ? [[item.id, commonsThumb(item.images[0].uri, 120)] as const] : []))), [catalog]);
  const now = useMemo(() => new Date(), []);
  const samples = useMemo(() => buildSampleRecords(catalog, now), [catalog, now]);
  const records = useMemo(() => {
    // Os meus registros: com servidor, reprovados não aparecem e os ainda não verificados ficam como pendentes.
    const mine = myPublicRecords(sightings, store, now).flatMap((item) => {
      const remote = remoteStatus(item.id);
      if (remote === "local") return [item];
      if (remote === "rejected") return [];
      return [{ ...item, status: remote === "approved" ? ("approved" as const) : ("pending" as const) }];
    });
    const all = [...mine, ...remoteRecords, ...(showSamples ? samples : [])].filter((item) => isRecordActive(item, now));
    return filterByDate(all, filter, now);
  }, [sightings, store, now, remoteRecords, showSamples, samples, filter, remoteStatus]);

  // A área selecionada é refeita a partir dos registros filtrados atuais, para não mostrar dados desatualizados.
  const selectedRecords = useMemo(() => records.filter((record) => selectedIds.includes(record.id)), [records, selectedIds]);
  const selectedHigh = selectedRecords.length >= HIGH_INCIDENCE_MIN;
  const areaCount = useMemo(() => new Set(records.map((item) => `${item.latitude}:${item.longitude}`)).size, [records]);

  const clearSelection = () => { setSelectedIds([]); setSelectedKey(null); };

  const mapState = useMemo<StreetMapState>(() => ({
    mode: "public",
    points: records.map((item) => ({ id: item.id, latitude: item.latitude, longitude: item.longitude, pending: item.status === "pending", kind: item.speciesId, image: coverBySpecies.get(item.speciesId) })),
    center: myLocation,
    pick: null,
    selectedIds,
    highIncidenceMin: HIGH_INCIDENCE_MIN,
    fitKey,
    labels: { high: x.high, records: x.records, pickHint: "" },
  }), [records, selectedIds, fitKey, x, coverBySpecies, myLocation]);

  const onMapEvent = useCallback((event: StreetMapEvent) => {
    if (event.type === "select") setSelectedIds(event.ids);
    else if (event.type === "tiles" && !event.ok) { setNoTiles(true); setMapKind("offline"); }
    else if (event.type === "tiles" && event.ok) setNoTiles(false);
  }, []);

  const presetActive = (preset: DatePreset) => "preset" in filter && filter.preset === preset;
  const chip = (label: string, active: boolean, onPress: () => void) => (
    <Pressable key={label} onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }}
      style={({ pressed }) => [{ paddingHorizontal: 14, paddingVertical: 8, minHeight: 44, justifyContent: "center", borderRadius: 999, borderWidth: 1, borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.surface, elevation: 2, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 3, shadowOffset: { width: 0, height: 1 } }, pressed && { opacity: 0.8 }]}>
      <Text style={{ color: active ? colors.background : colors.foreground, fontWeight: "700", fontSize: 13 }}>{label}</Text>
    </Pressable>
  );

  const applyCustom = (nextFrom: string, nextTo: string) => {
    setFrom(nextFrom);
    setTo(nextTo);
    setFilter({ from: nextFrom, to: nextTo });
    clearSelection();
  };

  const statusText = feedStatus === "off" ? t.local : feedStatus === "loading" ? t.connecting : feedStatus === "online" ? t.online : t.offline;
  const statusColor = feedStatus === "online" ? colors.success : feedStatus === "offline" ? colors.warning : colors.muted;

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      <View style={{ flex: 1 }}>
        {/* Barra do topo, compacta */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 6, gap: 8 }}>
          <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)" as any))} accessibilityRole="button" accessibilityLabel={t.back} hitSlop={8}>
            <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "700", paddingVertical: 12 }}>{t.back}</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 20, fontWeight: "800" }}>{t.title}</Text>
            <Text accessibilityLiveRegion="polite" numberOfLines={1} style={{ color: statusColor, fontSize: 12, fontWeight: "700" }}>
              {t.summary(records.length, areaCount)} · {pendingCount > 0 ? t.pending(pendingCount) : lastSyncAt && feedStatus === "online" ? t.synced(new Date(lastSyncAt).toLocaleTimeString().slice(0, 5)) : statusText}
            </Text>
          </View>
          {feedStatus !== "off" && (
            <Pressable onPress={() => void refreshFeed()} accessibilityRole="button" accessibilityLabel={t.refresh} style={({ pressed }) => [{ paddingHorizontal: 10, minHeight: 44, justifyContent: "center", borderRadius: 10, borderWidth: 1, borderColor: colors.primary }, pressed && { opacity: 0.7 }]}>
              <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 12 }}>{t.refresh}</Text>
            </Pressable>
          )}
        </View>

        {/* Mapa ocupando o resto da tela */}
        <View style={{ flex: 1, borderTopWidth: 1, borderColor: colors.border }}>
          {mapKind === "streets" ? (
            <StreetMap state={mapState} onEvent={onMapEvent} accessibilityLabel={x.mapLabel} />
          ) : (
            <ScrollView contentContainerStyle={{ padding: 12 }}>
              <PublicMap records={records} selectedKey={selectedKey} onSelectCluster={(cluster) => { setSelectedKey(cluster?.key ?? null); setSelectedIds(cluster ? cluster.records.map((item) => item.id) : []); }} labels={t.map} height={420} />
            </ScrollView>
          )}

          {/* Período e botões por cima do mapa */}
          <View pointerEvents="box-none" style={{ position: "absolute", top: 8, left: 8, right: 8 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 8 }}>
              {chip(filtersOpen ? x.hideFilters : x.filters, filtersOpen, () => setFiltersOpen((open) => !open))}
              {(["7d", "30d", "365d", "all"] as DatePreset[]).map((preset) => chip(t.presets[preset], presetActive(preset), () => { setFilter({ preset }); setCustomOpen(false); clearSelection(); setFitKey((k) => k + 1); }))}
            </ScrollView>
            {filtersOpen && (
              <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 8, gap: 8 }}>
                {chip(t.custom, customOpen || !("preset" in filter), () => setCustomOpen((open) => !open))}
                {customOpen && (
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <TextInput value={from} onChangeText={(value) => applyCustom(value, to)} placeholder={t.from} accessibilityLabel={t.from} placeholderTextColor={colors.muted} autoCapitalize="none" keyboardType="numbers-and-punctuation"
                      style={{ flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 10, color: colors.foreground, backgroundColor: colors.background }} />
                    <TextInput value={to} onChangeText={(value) => applyCustom(from, value)} placeholder={t.to} accessibilityLabel={t.to} placeholderTextColor={colors.muted} autoCapitalize="none" keyboardType="numbers-and-punctuation"
                      style={{ flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 10, color: colors.foreground, backgroundColor: colors.background }} />
                  </View>
                )}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ color: colors.foreground, flex: 1 }}>{t.samples}</Text>
                  <Switch value={showSamples} onValueChange={(value) => { setShowSamples(value); clearSelection(); setFitKey((k) => k + 1); }} accessibilityLabel={t.samples} trackColor={{ true: colors.primary, false: colors.border }} />
                </View>
                {showSamples && <Text style={{ color: colors.muted, fontSize: 12 }}>{t.samplesHint}</Text>}
                <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                  {chip(x.streets, mapKind === "streets", () => { setMapKind("streets"); setNoTiles(false); clearSelection(); })}
                  {chip(x.fitAll, false, () => setFitKey((k) => k + 1))}
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#195946" }} /><Text style={{ color: colors.muted, fontSize: 12 }}>{t.legendNormal}</Text></View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}><View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: "#C2410C" }} /><Text style={{ color: colors.muted, fontSize: 12 }}>{t.legendHigh}</Text></View>
                </View>
                <Pressable onPress={() => router.push("/public-records" as any)} accessibilityRole="button" style={({ pressed }) => [{ borderColor: colors.primary, borderWidth: 1, borderRadius: 12, padding: 10 }, pressed && { opacity: 0.8 }]}>
                  <Text style={{ color: colors.primary, textAlign: "center", fontWeight: "800" }}>{t.manage}</Text>
                </Pressable>
              </View>
            )}
            {noTiles && mapKind === "offline" && (
              <View style={{ backgroundColor: colors.surface, borderColor: colors.warning, borderWidth: 1, borderRadius: 12, padding: 10, marginTop: 8 }}>
                <Text style={{ color: colors.foreground, fontSize: 13 }}>{x.noTiles}</Text>
              </View>
            )}
          </View>

          {records.length === 0 && (
            <View pointerEvents="none" style={{ position: "absolute", left: 16, right: 16, bottom: 24, backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.muted, textAlign: "center" }}>{t.empty}</Text>
            </View>
          )}

          {/* Painel da área selecionada, por cima da parte de baixo do mapa */}
          {selectedRecords.length > 0 && (
            <View style={{ position: "absolute", left: 8, right: 8, bottom: 8, maxHeight: "45%", backgroundColor: colors.surface, borderColor: selectedHigh ? "#C2410C" : colors.primary, borderWidth: 2, borderRadius: 16, padding: 12, elevation: 6, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }} accessibilityLiveRegion="polite">
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 15, flex: 1 }}>{t.area}: {t.count(selectedRecords.length)} · {t.species(new Set(selectedRecords.map((item) => item.speciesId)).size)}{selectedHigh ? ` · ${x.high}` : ""}</Text>
                <Pressable onPress={clearSelection} accessibilityRole="button" accessibilityLabel={x.close} hitSlop={10}><Text style={{ color: colors.primary, fontWeight: "800", fontSize: 18 }}>✕</Text></Pressable>
              </View>
              <ScrollView style={{ marginTop: 4 }}>
                {selectedRecords.slice(0, 50).map((record) => (
                  <Pressable key={record.id} onPress={() => names.has(record.speciesId) && router.push({ pathname: "/species/[id]", params: { id: record.speciesId } } as any)} accessibilityRole={names.has(record.speciesId) ? "button" : undefined}
                    style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 44, borderTopWidth: 1, borderTopColor: colors.border }}>
                    <Text style={{ color: colors.foreground, flex: 1 }}>{names.get(record.speciesId) ?? t.unknown}</Text>
                    <Text style={{ color: colors.muted }}>{record.date}{record.sample ? ` · ${t.sample}` : record.owner === "me" ? ` · ${t.mine}` : ""}{record.status === "pending" ? ` · ${x.pending}` : ""}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}
