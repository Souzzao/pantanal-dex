import { useEffect, useMemo, useRef, useState } from "react";
import { AccessibilityInfo, Animated, Platform, Pressable, View } from "react-native";
import { Text } from "@/components/T";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";
import { filterSpeciesCatalog } from "@/shared/catalog";
import { computeCollection, findNewDiscoveries, formatCollectionNumber } from "@/shared/collection";
import type { Sighting } from "@/shared/pantanal";

const VISIBLE_MS = 4500;

type Notice = { key: number; title: string; detail: string; levelUp?: string };

const TEXT = {
  pt: {
    one: "Nova espécie descoberta!",
    many: (n: number) => `${n} novas espécies descobertas!`,
    level: (n: number) => `Você subiu para o nível ${n}`,
    hint: "Toque para ver sua coleção",
  },
  en: {
    one: "New species discovered!",
    many: (n: number) => `${n} new species discovered!`,
    level: (n: number) => `You reached level ${n}`,
    hint: "Tap to open your collection",
  },
  es: {
    one: "¡Nueva especie descubierta!",
    many: (n: number) => `¡${n} nuevas especies descubiertas!`,
    level: (n: number) => `Subiste al nivel ${n}`,
    hint: "Toca para ver tu colección",
  },
} as const;

/**
 * Aviso no estilo Pokédex exibido quando o caderno passa a conter uma espécie inédita.
 * Observa apenas o estado do caderno (useApp), sem depender do formulário de registro.
 */
export function DiscoveryToast() {
  const { sightings, ready, settings } = useApp();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const catalog = useMemo(() => filterSpeciesCatalog(), []);
  const previous = useRef<Sighting[] | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const t = settings.defaultLanguage === "English" ? TEXT.en : settings.defaultLanguage === "Español" ? TEXT.es : TEXT.pt;

  useEffect(() => {
    if (!ready) return;
    const before = previous.current;
    previous.current = sightings;
    // A primeira leitura do armazenamento restaura o caderno; não é uma descoberta.
    if (before === null || before === sightings) return;
    const found = findNewDiscoveries(catalog, before, sightings);
    if (!found.length) return;

    const levelBefore = computeCollection(catalog, before).level;
    const levelAfter = computeCollection(catalog, sightings).level;
    const names = found.slice(0, 3).map((entry) => `${formatCollectionNumber(entry.number)} · ${entry.species.commonName}`);
    const detail = found.length > 3 ? `${names.join("\n")}\n+${found.length - 3}` : names.join("\n");
    const next: Notice = {
      key: Date.now(),
      title: found.length === 1 ? t.one : t.many(found.length),
      detail,
      levelUp: levelAfter > levelBefore ? t.level(levelAfter) : undefined,
    };
    setNotice(next);
    AccessibilityInfo.announceForAccessibility?.(`${next.title} ${detail.replace(/\n/g, ", ")}${next.levelUp ? `. ${next.levelUp}` : ""}`);
    if (Platform.OS !== "web") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  }, [ready, sightings, catalog, t]);

  useEffect(() => {
    if (!notice) return;
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: Platform.OS !== "web" }).start();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: Platform.OS !== "web" }).start(() => setNotice(null));
    }, VISIBLE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [notice, opacity]);

  if (!notice) return null;

  const close = () => {
    if (timer.current) clearTimeout(timer.current);
    setNotice(null);
  };

  return (
    <View pointerEvents="box-none" style={{ position: "absolute", top: insets.top + 8, left: 16, right: 16, alignItems: "center" }}>
      <Animated.View style={{ opacity, transform: [{ translateY: opacity.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }], width: "100%", maxWidth: 480 }}>
        <Pressable
          onPress={() => {
            close();
            router.push("/collection" as any);
          }}
          accessibilityRole="button"
          accessibilityLiveRegion="polite"
          accessibilityLabel={`${notice.title} ${notice.detail.replace(/\n/g, ", ")}. ${notice.levelUp ? `${notice.levelUp}. ` : ""}${t.hint}`}
          style={({ pressed }) => [{
            backgroundColor: colors.primary,
            borderRadius: 18,
            paddingVertical: 14,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          }, pressed && { opacity: 0.9 }]}
        >
          <Text style={{ fontSize: 30 }}>✨</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.background, fontWeight: "900", fontSize: 16 }}>{notice.title}</Text>
            <Text style={{ color: colors.background, fontWeight: "700", marginTop: 3 }}>{notice.detail}</Text>
            {notice.levelUp ? <Text style={{ color: colors.background, fontWeight: "900", marginTop: 4 }}>⬆ {notice.levelUp}</Text> : null}
            <Text style={{ color: colors.background, fontSize: 12, marginTop: 4 }}>{t.hint}</Text>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}
