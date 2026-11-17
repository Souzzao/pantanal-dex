import { Image as ExpoImage } from "expo-image";
import { ActivityIndicator, StyleSheet, View, type ImageProps, type ImageStyle, type StyleProp } from "react-native";
import { Text } from "@/components/T";
import { useRef, useState } from "react";

import { useColors } from "@/hooks/use-colors";
import { filterSpeciesCatalog } from "@/shared/catalog";
import { buildImageFallbackPlan } from "@/shared/image-fallback";
import { displayImageUri } from "@/shared/image-url";
import { speciesCovers } from "@/shared/species-covers";

type RemoteImageProps = { source: ImageProps["source"]; fallbackSources?: ImageProps["source"][]; label: string; style?: StyleProp<ImageStyle>; accessibilityLabel?: string };

const alternativesByUri = new Map<string, { uri: string }[]>();
const bundledCoversByUri = new Map<string, number>();
for (const animal of filterSpeciesCatalog()) {
  const images = animal.images.map(image => ({ uri: displayImageUri(image.uri) }));
  for (const image of animal.images) { alternativesByUri.set(image.uri, images); alternativesByUri.set(displayImageUri(image.uri), images); }
  const coverUri = animal.images[0]?.uri;
  const bundled = speciesCovers[animal.id];
  if (coverUri && typeof bundled === "number") {
    bundledCoversByUri.set(coverUri, bundled);
    bundledCoversByUri.set(displayImageUri(coverUri), bundled);
  }
}

export function RemoteImage(props: RemoteImageProps) {
  const uri = props.source && !Array.isArray(props.source) && typeof props.source === "object" ? props.source.uri : undefined;
  const bundled = uri ? bundledCoversByUri.get(uri) ?? bundledCoversByUri.get(displayImageUri(uri)) : undefined;
  const light = bundled ?? (uri ? { ...(props.source as { uri: string }), uri: displayImageUri(uri) } : props.source);
  const next = buildImageFallbackPlan(light, [...(props.fallbackSources ?? []), ...(uri ? alternativesByUri.get(uri) ?? [] : [])]);
  const plan = useRef(next);
  if (plan.current.key !== next.key) plan.current = next;
  return <ImageAttempts key={plan.current.key} {...props} candidates={plan.current.candidates} />;
}

function ImageAttempts({ label, style, accessibilityLabel, candidates }: RemoteImageProps & { candidates: unknown[] }) {
  const colors = useColors();
  const [attempt, setAttempt] = useState(0);
  const activeAttempt = useRef(0);
  const hasSource = candidates.length > 0;
  const [status, setStatus] = useState<"loading" | "ready" | "error">(hasSource ? "loading" : "error");
  const initial = label.trim().charAt(0).toLocaleUpperCase("pt-BR") || "P";

  return (
    <View style={[style, { backgroundColor: colors.surface, overflow: "hidden" }]}>
      {hasSource && status !== "error" && <ExpoImage key={attempt} source={candidates[attempt] as ImageProps["source"]} accessibilityLabel={accessibilityLabel ?? label} cachePolicy="disk" contentFit="cover" transition={200} onLoad={() => { if (activeAttempt.current === attempt) setStatus("ready"); }} onError={() => {
        if (activeAttempt.current !== attempt) return;
        if (attempt + 1 < candidates.length) { activeAttempt.current = attempt + 1; setAttempt(attempt + 1); setStatus("loading"); }
        else setStatus("error");
      }} style={[StyleSheet.absoluteFillObject, { opacity: status === "ready" ? 1 : 0 }]} />}
      {status === "loading" && <View style={styles.overlay}><ActivityIndicator color={colors.primary} accessibilityLabel="Carregando imagem" /></View>}
      {status === "error" && <View style={[styles.overlay, { backgroundColor: colors.surface }]}><View style={[styles.specimen, { borderColor: colors.border }]}><Text style={{ color: colors.primary, fontSize: 28, fontWeight: "800" }}>{initial}</Text></View><Text style={{ color: colors.foreground, textAlign: "center", fontSize: 12, fontWeight: "800", marginTop: 8 }}>{label}</Text><Text style={{ color: colors.muted, textAlign: "center", fontSize: 10, marginTop: 3 }}>Imagem indisponível</Text></View>}
    </View>
  );
}

const styles = StyleSheet.create({ overlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", padding: 12 }, specimen: { width: 48, height: 48, borderWidth: 1, borderRadius: 24, alignItems: "center", justifyContent: "center" } });
