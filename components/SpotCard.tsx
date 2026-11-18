/**
 * PantanalDex — Cartão de ponto turístico com texto em 4 idiomas e check-in por GPS (UC09).
 *
 * @author Felipe de Souza Aquino
 */
import { useState } from "react";
import { ActivityIndicator, Linking, Pressable, View } from "react-native";
import * as Location from "expo-location";
import { Text } from "@/components/T";
import { useColors } from "@/hooks/use-colors";
import { getLanguageCode } from "@/shared/i18n";
import { checkIn, explorerProgress, saveVisit, type SpotVisits, type TouristSpot } from "@/shared/tourist-spots";

const T = {
  pt: { checkIn: "Fazer check-in", visited: (d: string) => `Insígnia conquistada em ${d}`, far: (km: string) => `Você está a ${km} daqui. Chegue mais perto para ganhar a insígnia.`, accuracy: "O GPS está impreciso agora. Vá para um lugar aberto e tente de novo.", noGps: "Precisamos da sua localização para o check-in.", got: "Insígnia conquistada!", progress: (v: number, t: number) => `Explorador do Pantanal: ${v}/${t} lugares`, source: "Fonte", close: "Fechar" },
  en: { checkIn: "Check in", visited: (d: string) => `Badge earned on ${d}`, far: (km: string) => `You are ${km} away. Get closer to earn the badge.`, accuracy: "GPS is inaccurate right now. Move to an open spot and try again.", noGps: "We need your location to check in.", got: "Badge earned!", progress: (v: number, t: number) => `Pantanal Explorer: ${v}/${t} places`, source: "Source", close: "Close" },
  es: { checkIn: "Hacer check-in", visited: (d: string) => `Insignia ganada el ${d}`, far: (km: string) => `Estás a ${km} de aquí. Acércate para ganar la insignia.`, accuracy: "El GPS está impreciso ahora. Ve a un lugar abierto e inténtalo de nuevo.", noGps: "Necesitamos tu ubicación para el check-in.", got: "¡Insignia ganada!", progress: (v: number, t: number) => `Explorador del Pantanal: ${v}/${t} lugares`, source: "Fuente", close: "Cerrar" },
  de: { checkIn: "Einchecken", visited: (d: string) => `Abzeichen erhalten am ${d}`, far: (km: string) => `Du bist ${km} entfernt. Komm näher, um das Abzeichen zu erhalten.`, accuracy: "Das GPS ist gerade ungenau. Geh an einen offenen Ort und versuche es erneut.", noGps: "Wir brauchen deinen Standort zum Einchecken.", got: "Abzeichen erhalten!", progress: (v: number, t: number) => `Pantanal-Entdecker: ${v}/${t} Orte`, source: "Quelle", close: "Schließen" },
} as const;

const fmtDistance = (m: number) => (m >= 1000 ? `${(m / 1000).toFixed(m >= 10000 ? 0 : 1)} km` : `${Math.round(m)} m`);

export function SpotCard({ spot, visits, onVisits, onClose }: { spot: TouristSpot; visits: SpotVisits; onVisits: (v: SpotVisits) => void; onClose: () => void }) {
  const colors = useColors();
  const lang = getLanguageCode();
  const t = T[lang] ?? T.pt;
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const visitedAt = visits[spot.id];
  const progress = explorerProgress(visits);

  const doCheckIn = async () => {
    setBusy(true); setMessage(null);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) { setMessage(t.noGps); return; }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const result = checkIn(spot, { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy });
      if (result.ok) { onVisits(await saveVisit(spot.id)); setMessage(t.got); }
      else setMessage(result.reason === "accuracy" ? t.accuracy : t.far(fmtDistance(result.distance)));
    } catch { setMessage(t.noGps); } finally { setBusy(false); }
  };

  return (
    <View accessibilityLiveRegion="polite" style={{ position: "absolute", left: 8, right: 8, bottom: 8, backgroundColor: colors.surface, borderColor: colors.primary, borderWidth: 2, borderRadius: 16, padding: 14, gap: 8, elevation: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text style={{ fontSize: 30 }}>{spot.icon}</Text>
        <Text accessibilityRole="header" style={{ color: colors.foreground, fontWeight: "800", fontSize: 17, flex: 1 }}>{spot.name[lang] ?? spot.name.pt}</Text>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={t.close} hitSlop={10}><Text style={{ color: colors.primary, fontWeight: "800", fontSize: 18 }}>✕</Text></Pressable>
      </View>
      <Text style={{ color: colors.foreground, fontSize: 14, lineHeight: 20 }}>{spot.about[lang] ?? spot.about.pt}</Text>
      {visitedAt ? (
        <Text style={{ color: colors.primary, fontWeight: "800" }}>🏅 {t.visited(new Date(visitedAt).toLocaleDateString())}</Text>
      ) : (
        <Pressable onPress={doCheckIn} disabled={busy} accessibilityRole="button" style={({ pressed }) => [{ backgroundColor: colors.primary, borderRadius: 12, minHeight: 48, alignItems: "center", justifyContent: "center" }, pressed && { opacity: 0.85 }]}>
          {busy ? <ActivityIndicator color={colors.background} /> : <Text style={{ color: colors.background, fontWeight: "900", fontSize: 16 }}>📍 {t.checkIn}</Text>}
        </Pressable>
      )}
      {message && <Text style={{ color: message === t.got ? colors.success : colors.muted, fontSize: 13 }}>{message}</Text>}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: colors.muted, fontSize: 12 }}>{progress.tier ? progress.tier.icon + " " : ""}{t.progress(progress.visited, progress.total)}</Text>
        <Pressable onPress={() => void Linking.openURL(spot.source)} accessibilityRole="link" hitSlop={8}><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "700" }}>{t.source}</Text></Pressable>
      </View>
    </View>
  );
}
