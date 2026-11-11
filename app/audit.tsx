import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, Modal, PanResponder, Pressable, ScrollView, View } from "react-native";
import { Text, TextInput } from "@/components/T";

import { ScreenContainer } from "@/components/screen-container";
import { StreetMap } from "@/components/StreetMap";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/use-colors";
import { supabase } from "@/lib/supabase";
import { canAudit } from "@/shared/auth";
import { normalizeAuditRow, REJECT_REASONS, type AuditItem, type LogItem, normalizeLogRow } from "@/shared/audit";
import { filterSpeciesCatalog } from "@/shared/catalog";
import type { StreetMapState } from "@/shared/street-map";

const TEXT = {
  pt: {
    back: "‹ Voltar", title: "Auditoria", queue: (n: number) => `${n} ${n === 1 ? "registro" : "registros"} na pilha`, history: "Histórico", stack: "Pilha",
    empty: "Nada para verificar agora. 🎉", emptyHint: "Novos registros públicos aparecem aqui como pendentes.", offline: "Sem internet: a auditoria precisa de conexão.", denied: "Esta área é só para auditores.", retry: "Tentar de novo",
    by: (name: string) => `Enviado por ${name}`, noPhoto: "Sem foto", reference: "Foto do catálogo", sent: "Foto enviada", species: "Espécie", change: "Trocar espécie", notes: "Observação", none: "—", unknownSpecies: "Espécie não identificada",
    approve: "Aprovar", reject: "Reprovar", swipe: "Arraste para a direita para aprovar ou para a esquerda para reprovar.",
    rejectTitle: "Por que reprovar?", rejectPlaceholder: "Explique em poucas palavras (a pessoa vai ler)", confirmReject: "Reprovar", cancel: "Cancelar",
    corrected: (name: string) => `Espécie corrigida para ${name}`, search: "Buscar espécie", saveError: "Não foi possível salvar a decisão. Confira a internet e tente de novo.",
    decision: { approved: "Aprovado", rejected: "Reprovado" }, changed: (from: string, to: string) => `espécie: ${from} → ${to}`,
  },
  en: {
    back: "‹ Back", title: "Review", queue: (n: number) => `${n} ${n === 1 ? "record" : "records"} in the stack`, history: "History", stack: "Stack",
    empty: "Nothing to review right now. 🎉", emptyHint: "New public records show up here as pending.", offline: "Offline: reviewing needs a connection.", denied: "This area is for reviewers only.", retry: "Try again",
    by: (name: string) => `Sent by ${name}`, noPhoto: "No photo", reference: "Catalog photo", sent: "Submitted photo", species: "Species", change: "Change species", notes: "Notes", none: "—", unknownSpecies: "Unidentified species",
    approve: "Approve", reject: "Reject", swipe: "Swipe right to approve or left to reject.",
    rejectTitle: "Why reject?", rejectPlaceholder: "Explain briefly (the person will read it)", confirmReject: "Reject", cancel: "Cancel",
    corrected: (name: string) => `Species corrected to ${name}`, search: "Search species", saveError: "Could not save the decision. Check the connection and try again.",
    decision: { approved: "Approved", rejected: "Rejected" }, changed: (from: string, to: string) => `species: ${from} → ${to}`,
  },
  es: {
    back: "‹ Volver", title: "Auditoría", queue: (n: number) => `${n} ${n === 1 ? "registro" : "registros"} en la pila`, history: "Historial", stack: "Pila",
    empty: "Nada para revisar ahora. 🎉", emptyHint: "Los nuevos registros públicos aparecen aquí como pendientes.", offline: "Sin internet: la auditoría necesita conexión.", denied: "Esta área es solo para auditores.", retry: "Intentar de nuevo",
    by: (name: string) => `Enviado por ${name}`, noPhoto: "Sin foto", reference: "Foto del catálogo", sent: "Foto enviada", species: "Especie", change: "Cambiar especie", notes: "Observación", none: "—", unknownSpecies: "Especie no identificada",
    approve: "Aprobar", reject: "Rechazar", swipe: "Desliza a la derecha para aprobar o a la izquierda para rechazar.",
    rejectTitle: "¿Por qué rechazar?", rejectPlaceholder: "Explica en pocas palabras (la persona lo leerá)", confirmReject: "Rechazar", cancel: "Cancelar",
    corrected: (name: string) => `Especie corregida a ${name}`, search: "Buscar especie", saveError: "No se pudo guardar la decisión. Revisa la conexión e inténtalo de nuevo.",
    decision: { approved: "Aprobado", rejected: "Rechazado" }, changed: (from: string, to: string) => `especie: ${from} → ${to}`,
  },
} as const;

const SWIPE_THRESHOLD = 110;

export default function AuditScreen() {
  const colors = useColors();
  const { settings } = useApp();
  const { account } = useAuth();
  const lang = settings.defaultLanguage === "English" ? "en" : settings.defaultLanguage === "Español" ? "es" : "pt";
  const t = TEXT[lang];
  const catalog = useMemo(() => filterSpeciesCatalog(), []);
  const byId = useMemo(() => new Map(catalog.map((item) => [item.id, item])), [catalog]);

  const [tab, setTab] = useState<"stack" | "history">("stack");
  const [items, setItems] = useState<AuditItem[]>([]);
  const [log, setLog] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [speciesOverride, setSpeciesOverride] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  const current = items[0] ?? null;
  const speciesId = speciesOverride ?? current?.speciesId ?? "";
  const species = byId.get(speciesId);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setFailed(false);
    try {
      const [queue, history] = await Promise.all([supabase.rpc("audit_queue", { p_limit: 50 }), supabase.rpc("review_log", { p_limit: 50 })]);
      if (queue.error) throw queue.error;
      setItems(((queue.data as unknown[]) ?? []).map(normalizeAuditRow).filter((item): item is AuditItem => item !== null));
      setLog(((history.data as unknown[]) ?? []).map(normalizeLogRow).filter((item): item is LogItem => item !== null));
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  // Foto enviada: link temporário (10 min) do Storage privado.
  useEffect(() => {
    setPhotoUrl(null);
    setSpeciesOverride(null);
    setError(null);
    if (!supabase || !current?.photoPath) return;
    let alive = true;
    void supabase.storage.from("sighting-photos").createSignedUrl(current.photoPath, 600).then(({ data }) => {
      if (alive) setPhotoUrl(data?.signedUrl ?? null);
    });
    return () => { alive = false; };
  }, [current?.id, current?.photoPath]);

  const position = useRef(new Animated.ValueXY()).current;
  const resetCard = () => Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();

  const decide = useCallback(async (decision: "approved" | "rejected", note?: string) => {
    if (!supabase || !current || busy) return;
    setBusy(true);
    setError(null);
    const { error: rpcError } = await supabase.rpc("review_sighting", {
      p_id: current.id, p_decision: decision, p_note: note ?? null,
      p_species_id: speciesOverride && speciesOverride !== current.speciesId ? speciesOverride : null,
    });
    setBusy(false);
    if (rpcError) {
      setError(t.saveError);
      resetCard();
      return;
    }
    const direction = decision === "approved" ? 1 : -1;
    Animated.timing(position, { toValue: { x: direction * 500, y: 0 }, duration: 200, useNativeDriver: false }).start(() => {
      position.setValue({ x: 0, y: 0 });
      setItems((list) => list.slice(1));
      setLog((list) => [{ createdAt: new Date().toISOString(), sightingId: current.id, decision, oldSpeciesId: current.speciesId, newSpeciesId: speciesOverride && speciesOverride !== current.speciesId ? speciesOverride : null, note: note ?? null, auditorName: account?.displayName ?? "" }, ...list]);
    });
    setRejectOpen(false);
    setReason("");
  }, [current, busy, speciesOverride, account, position, t]); // eslint-disable-line react-hooks/exhaustive-deps

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dx) > 12 && Math.abs(gesture.dx) > Math.abs(gesture.dy),
    onPanResponderMove: Animated.event([null, { dx: position.x }], { useNativeDriver: false }),
    onPanResponderRelease: (_event, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) void decide("approved");
      else if (gesture.dx < -SWIPE_THRESHOLD) { resetCard(); setRejectOpen(true); }
      else resetCard();
    },
  }), [decide]); // eslint-disable-line react-hooks/exhaustive-deps

  const rotate = position.x.interpolate({ inputRange: [-300, 0, 300], outputRange: ["-12deg", "0deg", "12deg"] });
  const approveHint = position.x.interpolate({ inputRange: [0, SWIPE_THRESHOLD], outputRange: [0, 1], extrapolate: "clamp" });
  const rejectHint = position.x.interpolate({ inputRange: [-SWIPE_THRESHOLD, 0], outputRange: [1, 0], extrapolate: "clamp" });

  const mapState = useMemo<StreetMapState | null>(() => current ? ({
    mode: "points", points: [{ id: current.id, latitude: current.exactLat, longitude: current.exactLon, label: species?.commonName ?? "" }],
    pick: null, selectedIds: [], highIncidenceMin: 5, fitKey: 1, labels: { high: "", records: (n) => String(n), pickHint: "" },
  }) : null, [current, species]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (q ? catalog.filter((item) => item.commonName.toLowerCase().includes(q) || item.scientificName.toLowerCase().includes(q)) : catalog).slice(0, 60);
  }, [catalog, query]);

  const nameOf = (id: string | null) => (id ? byId.get(id)?.commonName ?? id : "");

  if (!canAudit(account)) {
    return <ScreenContainer className="px-5"><Text style={{ color: colors.foreground, marginTop: 40, textAlign: "center" }}>{t.denied}</Text></ScreenContainer>;
  }

  const header = (
    <View style={{ paddingHorizontal: 16 }}>
      <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)" as never))} accessibilityRole="button"><Text style={{ color: colors.primary, fontWeight: "700", paddingVertical: 10 }}>{t.back}</Text></Pressable>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 26, fontWeight: "800" }}>{t.title}</Text>
        <View style={{ flexDirection: "row", gap: 6 }}>
          {(["stack", "history"] as const).map((key) => (
            <Pressable key={key} onPress={() => setTab(key)} accessibilityRole="button" accessibilityState={{ selected: tab === key }}
              style={{ paddingHorizontal: 12, minHeight: 44, justifyContent: "center", borderRadius: 999, borderWidth: 1, borderColor: colors.primary, backgroundColor: tab === key ? colors.primary : colors.surface }}>
              <Text style={{ color: tab === key ? colors.background : colors.primary, fontWeight: "800", fontSize: 13 }}>{key === "stack" ? t.stack : t.history}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      {tab === "stack" && !loading && !failed && <Text style={{ color: colors.muted, marginTop: 2 }}>{t.queue(items.length)}</Text>}
    </View>
  );

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]}>
      {header}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : failed ? (
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: colors.foreground, textAlign: "center" }}>{t.offline}</Text>
          <Pressable onPress={() => void load()} accessibilityRole="button" style={{ marginTop: 12, padding: 12 }}><Text style={{ color: colors.primary, fontWeight: "800" }}>{t.retry}</Text></Pressable>
        </View>
      ) : tab === "history" ? (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {log.map((item, index) => (
            <View key={`${item.sightingId}-${index}`} style={{ borderBottomWidth: 1, borderColor: colors.border, paddingVertical: 10 }}>
              <Text style={{ color: item.decision === "approved" ? colors.success : colors.error, fontWeight: "800" }}>{t.decision[item.decision]} · {nameOf(item.newSpeciesId ?? item.oldSpeciesId)}</Text>
              <Text style={{ color: colors.muted, fontSize: 12 }}>{new Date(item.createdAt).toLocaleString()} · {item.auditorName}{item.newSpeciesId ? ` · ${t.changed(nameOf(item.oldSpeciesId), nameOf(item.newSpeciesId))}` : ""}</Text>
              {item.note && <Text style={{ color: colors.foreground, marginTop: 2 }}>{item.note}</Text>}
            </View>
          ))}
        </ScrollView>
      ) : !current ? (
        <View style={{ padding: 24, alignItems: "center" }}>
          <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800", textAlign: "center" }}>{t.empty}</Text>
          <Text style={{ color: colors.muted, textAlign: "center", marginTop: 6 }}>{t.emptyHint}</Text>
          <Pressable onPress={() => void load()} accessibilityRole="button" style={{ marginTop: 12, padding: 12 }}><Text style={{ color: colors.primary, fontWeight: "800" }}>{t.retry}</Text></Pressable>
        </View>
      ) : (
        <View style={{ flex: 1, padding: 12 }}>
          {/* Cartas de baixo, para dar a ideia de pilha */}
          {items.slice(1, 3).map((item, index) => (
            <View key={item.id} pointerEvents="none" style={{ position: "absolute", left: 12 + (index + 1) * 6, right: 12 + (index + 1) * 6, top: 12 + (index + 1) * 8, bottom: 96, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, opacity: 0.7 - index * 0.25 }} />
          ))}
          <Animated.View {...panResponder.panHandlers} style={{ flex: 1, marginBottom: 12, transform: [{ translateX: position.x }, { rotate }], backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, overflow: "hidden", elevation: 4, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }}>
            <Animated.View pointerEvents="none" style={{ position: "absolute", zIndex: 2, top: 16, left: 16, opacity: approveHint, borderWidth: 3, borderColor: colors.success, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, transform: [{ rotate: "-12deg" }] }}><Text style={{ color: colors.success, fontWeight: "900", fontSize: 20 }}>{t.approve.toUpperCase()}</Text></Animated.View>
            <Animated.View pointerEvents="none" style={{ position: "absolute", zIndex: 2, top: 16, right: 16, opacity: rejectHint, borderWidth: 3, borderColor: colors.error, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, transform: [{ rotate: "12deg" }] }}><Text style={{ color: colors.error, fontWeight: "900", fontSize: 20 }}>{t.reject.toUpperCase()}</Text></Animated.View>
            <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
              <View style={{ flexDirection: "row", height: 190 }}>
                <View style={{ flex: 1, backgroundColor: colors.border, alignItems: "center", justifyContent: "center" }}>
                  {photoUrl ? <Image source={{ uri: photoUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" accessibilityLabel={t.sent} /> : <Text style={{ color: colors.muted }}>{current.photoPath ? "…" : t.noPhoto}</Text>}
                  <Text style={{ position: "absolute", left: 6, bottom: 6, color: "#fff", backgroundColor: "rgba(0,0,0,.55)", paddingHorizontal: 6, borderRadius: 6, fontSize: 11, fontWeight: "700" }}>{t.sent}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: colors.border }}>
                  {species?.images[0]?.uri ? <Image source={{ uri: species.images[0].uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" accessibilityLabel={t.reference} /> : null}
                  <Text style={{ position: "absolute", left: 6, bottom: 6, color: "#fff", backgroundColor: "rgba(0,0,0,.55)", paddingHorizontal: 6, borderRadius: 6, fontSize: 11, fontWeight: "700" }}>{t.reference}</Text>
                </View>
              </View>
              <View style={{ padding: 14 }}>
                <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700" }}>{t.species}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: "800" }}>{species?.commonName ?? t.unknownSpecies}</Text>
                    {species && <Text style={{ color: colors.muted, fontStyle: "italic" }}>{species.scientificName}</Text>}
                  </View>
                  <Pressable onPress={() => setPickerOpen(true)} accessibilityRole="button" style={{ borderColor: colors.primary, borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, minHeight: 44, justifyContent: "center" }}>
                    <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 13 }}>{t.change}</Text>
                  </Pressable>
                </View>
                {speciesOverride && speciesOverride !== current.speciesId && <Text style={{ color: colors.warning, fontWeight: "700", marginTop: 4 }}>{t.corrected(species?.commonName ?? speciesOverride)}</Text>}
                <Text style={{ color: colors.foreground, marginTop: 10 }}>{current.observedOn}{current.observedTime ? ` · ${current.observedTime}` : ""} · {t.by(current.ownerName || "—")}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700", marginTop: 10 }}>{t.notes}</Text>
                <Text style={{ color: colors.foreground }}>{current.notes || t.none}</Text>
                <Text style={{ color: colors.muted, fontSize: 12, marginTop: 10 }}>{current.exactLat.toFixed(5)}, {current.exactLon.toFixed(5)}</Text>
                {mapState && <View style={{ height: 170, borderRadius: 12, overflow: "hidden", marginTop: 6 }}><StreetMap state={mapState} onEvent={() => undefined} /></View>}
              </View>
            </ScrollView>
          </Animated.View>
          {error && <Text style={{ color: colors.error, textAlign: "center", marginBottom: 6 }}>{error}</Text>}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable onPress={() => setRejectOpen(true)} disabled={busy} accessibilityRole="button" style={({ pressed }) => [{ flex: 1, borderColor: colors.error, borderWidth: 2, borderRadius: 16, paddingVertical: 14, alignItems: "center" }, pressed && { opacity: 0.8 }]}>
              <Text style={{ color: colors.error, fontWeight: "900", fontSize: 16 }}>✕ {t.reject}</Text>
            </Pressable>
            <Pressable onPress={() => void decide("approved")} disabled={busy} accessibilityRole="button" style={({ pressed }) => [{ flex: 1, backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 14, alignItems: "center" }, (pressed || busy) && { opacity: 0.8 }]}>
              {busy ? <ActivityIndicator color={colors.background} /> : <Text style={{ color: colors.background, fontWeight: "900", fontSize: 16 }}>✓ {t.approve}</Text>}
            </Pressable>
          </View>
          <Text style={{ color: colors.muted, fontSize: 11, textAlign: "center", marginTop: 6 }}>{t.swipe}</Text>
        </View>
      )}

      {/* Motivo da reprovação */}
      <Modal visible={rejectOpen} transparent animationType="fade" onRequestClose={() => setRejectOpen(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,.45)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, gap: 8 }}>
            <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>{t.rejectTitle}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {REJECT_REASONS[lang].map((option) => (
                <Pressable key={option} onPress={() => setReason(option)} accessibilityRole="button" style={{ borderColor: reason === option ? colors.error : colors.border, borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, minHeight: 44, justifyContent: "center" }}>
                  <Text style={{ color: colors.foreground, fontSize: 13 }}>{option}</Text>
                </Pressable>
              ))}
            </View>
            <TextInput value={reason} onChangeText={setReason} placeholder={t.rejectPlaceholder} placeholderTextColor={colors.muted} maxLength={300} multiline
              style={{ color: colors.foreground, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12, minHeight: 70 }} />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable onPress={() => setRejectOpen(false)} accessibilityRole="button" style={{ flex: 1, padding: 14, alignItems: "center" }}><Text style={{ color: colors.primary, fontWeight: "800" }}>{t.cancel}</Text></Pressable>
              <Pressable onPress={() => void decide("rejected", reason.trim())} disabled={!reason.trim() || busy} accessibilityRole="button"
                style={{ flex: 1, backgroundColor: colors.error, opacity: reason.trim() ? 1 : 0.5, borderRadius: 14, padding: 14, alignItems: "center" }}>
                <Text style={{ color: colors.background, fontWeight: "800" }}>{t.confirmReject}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Trocar espécie */}
      <Modal visible={pickerOpen} animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <ScreenContainer className="px-4">
          <Pressable onPress={() => setPickerOpen(false)} accessibilityRole="button"><Text style={{ color: colors.primary, fontWeight: "700", paddingVertical: 12 }}>{t.back}</Text></Pressable>
          <TextInput value={query} onChangeText={setQuery} placeholder={t.search} placeholderTextColor={colors.muted} autoFocus
            style={{ color: colors.foreground, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 8 }} />
          <ScrollView keyboardShouldPersistTaps="handled">
            {filtered.map((item) => (
              <Pressable key={item.id} onPress={() => { setSpeciesOverride(item.id); setPickerOpen(false); setQuery(""); }} accessibilityRole="button"
                style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.border, flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ color: colors.foreground, fontWeight: item.id === speciesId ? "800" : "500" }}>{item.commonName}</Text>
                <Text style={{ color: colors.muted, fontStyle: "italic", fontSize: 12 }}>{item.scientificName}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </ScreenContainer>
      </Modal>
    </ScreenContainer>
  );
}
