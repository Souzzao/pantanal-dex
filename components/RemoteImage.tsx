import { Image as ExpoImage } from "expo-image";
import { ActivityIndicator, StyleSheet, Text, View, type ImageProps, type ImageStyle, type StyleProp } from "react-native";
import { useEffect, useState } from "react";

import { useColors } from "@/hooks/use-colors";

type RemoteImageProps = { source: ImageProps["source"]; label: string; style?: StyleProp<ImageStyle>; accessibilityLabel?: string };

export function RemoteImage({ label, style, accessibilityLabel, source }: RemoteImageProps) {
  const colors = useColors();
  const hasSource = Boolean(source);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(hasSource ? "loading" : "error");
  const initial = label.trim().charAt(0).toLocaleUpperCase("pt-BR") || "P";

  useEffect(() => {
    setStatus(hasSource ? "loading" : "error");
  }, [hasSource, source]);

  return (
    <View style={[style, { backgroundColor: colors.surface, overflow: "hidden" }]}>
      {hasSource && status !== "error" && <ExpoImage source={source} accessibilityLabel={accessibilityLabel ?? label} cachePolicy="disk" contentFit="cover" transition={200} onLoad={() => setStatus("ready")} onError={() => setStatus("error")} style={[StyleSheet.absoluteFillObject, { opacity: status === "ready" ? 1 : 0 }]} />}
      {status === "loading" && <View style={styles.overlay}><ActivityIndicator color={colors.primary} accessibilityLabel="Carregando imagem" /></View>}
      {status === "error" && <View style={[styles.overlay, { backgroundColor: colors.surface }]}><View style={[styles.specimen, { borderColor: colors.border }]}><Text style={{ color: colors.primary, fontSize: 28, fontWeight: "800" }}>{initial}</Text></View><Text style={{ color: colors.foreground, textAlign: "center", fontSize: 12, fontWeight: "800", marginTop: 8 }}>{label}</Text><Text style={{ color: colors.muted, textAlign: "center", fontSize: 10, marginTop: 3 }}>Imagem indisponível</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({ overlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", padding: 12 }, specimen: { width: 48, height: 48, borderWidth: 1, borderRadius: 24, alignItems: "center", justifyContent: "center" } });
