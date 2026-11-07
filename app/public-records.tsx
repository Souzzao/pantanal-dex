import { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import { usePublications } from "@/contexts/PublicationsContext";
import { useColors } from "@/hooks/use-colors";
import { filterSpeciesCatalog } from "@/shared/catalog";
import type { Sighting } from "@/shared/pantanal";
import { PUBLIC_DURATIONS, publicationStatus, type PublicationStatus, type PublicDurationId } from "@/shared/public-map";

type Lang = "pt" | "en" | "es";

const TEXT = {
  pt: {
    back: "‹ Voltar", title: "Meus registros públicos", openMap: "Abrir mapa público",
    subtitle: "Registros marcados como Compartilhável aparecem no mapa público pelo tempo que você escolher, sempre com localização aproximada (~11 km).",
    empty: "Você ainda não tem registros compartilháveis com localização. Ao registrar um avistamento, escolha \"Compartilhável\" para ele aparecer no mapa público.",
    privateNote: (n: number) => (n === 1 ? "1 registro pessoal não aparece no mapa público." : `${n} registros pessoais não aparecem no mapa público.`),
    unknown: "Espécie não identificada",
    status: { active: "Público", expired: "Prazo encerrado", ended: "Encerrado por você", "not-published": "Não publicado", "no-location": "Sem localização", private: "Pessoal" } as Record<PublicationStatus, string>,
    until: (date: string) => `até ${date}`, forever: "sem prazo",
    choose: "Ficar público por:", publish: "Publicar", renew: "Renovar", end: "Encerrar agora",
    endTitle: "Encerrar publicação", endBody: "O registro sai do mapa público agora. Ele continua no seu caderno e pode ser publicado de novo.", cancel: "Cancelar", confirm: "Encerrar",
    saveError: "Não foi possível salvar. Tente novamente.",
    durations: { "1d": "1 dia", "7d": "7 dias", "30d": "30 dias", "90d": "90 dias", "365d": "1 ano", forever: "Sem prazo" } as Record<PublicDurationId, string>,
    noLocationHint: "Edite o registro e adicione a localização para publicá-lo.",
  },
  en: {
    back: "‹ Back", title: "My public records", openMap: "Open public map",
    subtitle: "Records marked as Shareable appear on the public map for as long as you choose, always with an approximate location (~11 km).",
    empty: "You have no shareable records with a location yet. When logging a sighting, choose \"Shareable\" to show it on the public map.",
    privateNote: (n: number) => (n === 1 ? "1 personal record is not shown on the public map." : `${n} personal records are not shown on the public map.`),
    unknown: "Unidentified species",
    status: { active: "Public", expired: "Expired", ended: "Ended by you", "not-published": "Not published", "no-location": "No location", private: "Personal" } as Record<PublicationStatus, string>,
    until: (date: string) => `until ${date}`, forever: "no end date",
    choose: "Keep public for:", publish: "Publish", renew: "Renew", end: "End now",
    endTitle: "End publication", endBody: "The record leaves the public map now. It stays in your notebook and can be published again.", cancel: "Cancel", confirm: "End",
    saveError: "Could not save. Please try again.",
    durations: { "1d": "1 day", "7d": "7 days", "30d": "30 days", "90d": "90 days", "365d": "1 year", forever: "No end" } as Record<PublicDurationId, string>,
    noLocationHint: "Edit the record and add a location to publish it.",
  },
  es: {
    back: "‹ Volver", title: "Mis registros públicos", openMap: "Abrir mapa público",
    subtitle: "Los registros marcados como Compartible aparecen en el mapa público durante el tiempo que elijas, siempre con ubicación aproximada (~11 km).",
    empty: "Aún no tienes registros compartibles con ubicación. Al registrar un avistamiento, elige \"Compartible\" para que aparezca en el mapa público.",
    privateNote: (n: number) => (n === 1 ? "1 registro personal no aparece en el mapa público." : `${n} registros personales no aparecen en el mapa público.`),
    unknown: "Especie no identificada",
    status: { active: "Público", expired: "Plazo terminado", ended: "Terminado por ti", "not-published": "No publicado", "no-location": "Sin ubicación", private: "Personal" } as Record<PublicationStatus, string>,
    until: (date: string) => `hasta ${date}`, forever: "sin plazo",
    choose: "Público durante:", publish: "Publicar", renew: "Renovar", end: "Terminar ahora",
    endTitle: "Terminar publicación", endBody: "El registro sale del mapa público ahora. Sigue en tu cuaderno y puede publicarse de nuevo.", cancel: "Cancelar", confirm: "Terminar",
    saveError: "No se pudo guardar. Inténtalo de nuevo.",
    durations: { "1d": "1 día", "7d": "7 días", "30d": "30 días", "90d": "90 días", "365d": "1 año", forever: "Sin plazo" } as Record<PublicDurationId, string>,
    noLocationHint: "Edita el registro y agrega la ubicación para publicarlo.",
  },
} as const;

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

export default function PublicRecordsScreen() {
  const colors = useColors();
  const { sightings, settings } = useApp();
  const { store, publish, end } = usePublications();
  const lang: Lang = settings.defaultLanguage === "English" ? "en" : settings.defaultLanguage === "Español" ? "es" : "pt";
  const t = TEXT[lang];
  const names = useMemo(() => new Map(filterSpeciesCatalog().map((item) => [item.id, item.commonName])), []);
  const [busy, setBusy] = useState<string | null>(null);
  const now = new Date();

  const shareable = useMemo(() => sightings.filter((item) => item.visibility === "shareable"), [sightings]);
  const privateCount = sightings.length - shareable.length;

  const run = async (id: string, action: () => Promise<void>) => {
    setBusy(id);
    try {
      await action();
    } catch {
      Alert.alert(t.title, t.saveError);
    } finally {
      setBusy(null);
    }
  };

  const confirmEnd = (id: string) =>
    Alert.alert(t.endTitle, t.endBody, [
      { text: t.cancel, style: "cancel" },
      { text: t.confirm, style: "destructive", onPress: () => void run(id, () => end(id)) },
    ]);

  const statusColor = (status: PublicationStatus) =>
    status === "active" ? colors.success : status === "not-published" || status === "no-location" ? colors.muted : colors.warning;

  const renderItem = ({ item }: { item: Sighting }) => {
    const publication = store.items[item.id];
    const status = publicationStatus(item, publication, now);
    const name = names.get(item.speciesId) ?? t.unknown;
    const detail = status === "active" && publication ? (publication.expiresAt ? t.until(formatDate(publication.expiresAt)) : t.forever) : "";
    return (
      <View style={{ backgroundColor: colors.surface, borderColor: status === "active" ? colors.primary : colors.border, borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 12 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 16 }}>{name}</Text>
            <Text style={{ color: colors.muted, marginTop: 2 }}>{item.date}{item.locationLabel ? ` · ${item.locationLabel}` : ""}</Text>
          </View>
          <Text accessibilityLabel={`${t.status[status]} ${detail}`} style={{ color: statusColor(status), fontWeight: "800", fontSize: 12, textAlign: "right" }}>
            {t.status[status]}{detail ? `\n${detail}` : ""}
          </Text>
        </View>

        {status === "no-location" ? (
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 8 }}>{t.noLocationHint}</Text>
        ) : (
          <>
            <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700", marginTop: 12 }}>{t.choose}</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {PUBLIC_DURATIONS.map((duration) => (
                <Pressable key={duration.id} disabled={busy === item.id} onPress={() => void run(item.id, () => publish(item.id, duration.id))}
                  accessibilityRole="button"
                  accessibilityLabel={`${status === "active" ? t.renew : t.publish} ${name}: ${t.durations[duration.id]}`}
                  style={({ pressed }) => [{ borderColor: colors.primary, borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, minHeight: 36, justifyContent: "center", opacity: busy === item.id ? 0.5 : 1 }, pressed && { backgroundColor: colors.border }]}>
                  <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 12 }}>{t.durations[duration.id]}</Text>
                </Pressable>
              ))}
            </View>
            {status === "active" && (
              <Pressable onPress={() => confirmEnd(item.id)} disabled={busy === item.id} accessibilityRole="button" accessibilityLabel={`${t.end}: ${name}`} style={{ marginTop: 10, alignSelf: "flex-start", paddingVertical: 8 }}>
                <Text style={{ color: colors.error, fontWeight: "800" }}>{t.end}</Text>
              </Pressable>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <ScreenContainer edges={["top", "left", "right", "bottom"]} className="px-5">
      <FlatList
        data={shareable}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 14 }}>
            <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)" as any))} accessibilityRole="button" accessibilityLabel={t.back}>
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "700", paddingVertical: 14 }}>{t.back}</Text>
            </Pressable>
            <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 28, fontWeight: "800" }}>{t.title}</Text>
            <Text style={{ color: colors.muted, fontSize: 15, marginTop: 4 }}>{t.subtitle}</Text>
            <Pressable onPress={() => router.push("/public-map" as any)} accessibilityRole="button" style={({ pressed }) => [{ backgroundColor: colors.primary, borderRadius: 14, padding: 14, marginTop: 14 }, pressed && { opacity: 0.85 }]}>
              <Text style={{ color: colors.background, textAlign: "center", fontWeight: "800" }}>{t.openMap}</Text>
            </Pressable>
            {privateCount > 0 && <Text style={{ color: colors.muted, fontSize: 12, marginTop: 10 }}>{t.privateNote(privateCount)}</Text>}
          </View>
        }
        ListEmptyComponent={<Text style={{ color: colors.muted, textAlign: "center", marginTop: 20, lineHeight: 20 }}>{t.empty}</Text>}
      />
    </ScreenContainer>
  );
}
