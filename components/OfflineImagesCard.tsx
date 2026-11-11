import { useMemo, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/T";
import { Image as ExpoImage } from "expo-image";

import { useColors } from "@/hooks/use-colors";
import { filterSpeciesCatalog } from "@/shared/catalog";
import { catalogImageUrls, prefetchInBatches, type OfflineImageScope, type OfflinePrefetchResult } from "@/shared/offline-images";

/**
 * Baixa as fotos do catálogo para o mesmo cache em disco usado pelo RemoteImage (cachePolicy "disk"),
 * para que fichas, coleção e lista de animais mostrem as imagens sem internet.
 */
export function OfflineImagesCard() {
  const colors = useColors();
  const catalog = useMemo(() => filterSpeciesCatalog(), []);
  const urls = useMemo(() => ({ covers: catalogImageUrls(catalog, "covers"), all: catalogImageUrls(catalog, "all") }), [catalog]);
  const [running, setRunning] = useState<OfflineImageScope | null>(null);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState<(OfflinePrefetchResult & { scope: OfflineImageScope }) | null>(null);
  const cancelled = useRef(false);

  const start = async (scope: OfflineImageScope) => {
    if (running) return;
    cancelled.current = false;
    setResult(null);
    setRunning(scope);
    const outcome = await prefetchInBatches(urls[scope], (batch) => ExpoImage.prefetch(batch, "disk"), {
      onProgress: (done, total) => setProgress({ done, total }),
      isCancelled: () => cancelled.current,
    });
    setResult({ ...outcome, scope });
    setRunning(null);
  };

  const percent = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  const failed = result ? result.requested - result.completed : 0;

  return (
    <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 22 }}>
      <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 17, fontWeight: "800" }}>Fotos para uso offline</Text>
      <Text style={{ color: colors.muted, marginTop: 4 }}>
        Baixe as fotos do catálogo antes de ir a campo para vê-las sem internet. Use Wi-Fi: as capas ocupam alguns MB; as galerias completas, algumas dezenas.
      </Text>

      {running ? (
        <View style={{ marginTop: 12 }} accessible accessibilityLiveRegion="polite" accessibilityLabel={`Baixando fotos: ${progress.done} de ${progress.total}`}>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: "hidden" }}>
            <View style={{ width: `${percent}%`, height: "100%", backgroundColor: colors.primary }} />
          </View>
          <Text style={{ color: colors.muted, marginTop: 6 }}>Baixando {progress.done} de {progress.total} fotos…</Text>
          <Pressable onPress={() => { cancelled.current = true; }} accessibilityRole="button" accessibilityLabel="Cancelar download das fotos" style={{ marginTop: 8, alignSelf: "flex-start", paddingVertical: 8 }}>
            <Text style={{ color: colors.error, fontWeight: "800" }}>Cancelar</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ marginTop: 12, gap: 8 }}>
          <Pressable onPress={() => start("covers")} accessibilityRole="button" accessibilityLabel={`Baixar as ${urls.covers.length} fotos principais do catálogo`}
            style={({ pressed }) => [{ backgroundColor: colors.primary, borderRadius: 14, padding: 14 }, pressed && { opacity: 0.85 }]}>
            <Text style={{ color: colors.background, textAlign: "center", fontWeight: "800" }}>Baixar fotos principais ({urls.covers.length})</Text>
          </Pressable>
          <Pressable onPress={() => start("all")} accessibilityRole="button" accessibilityLabel={`Baixar todas as ${urls.all.length} fotos das galerias`}
            style={({ pressed }) => [{ borderColor: colors.primary, borderWidth: 1, borderRadius: 14, padding: 12 }, pressed && { opacity: 0.85 }]}>
            <Text style={{ color: colors.primary, textAlign: "center", fontWeight: "800" }}>Baixar galerias completas ({urls.all.length})</Text>
          </Pressable>
        </View>
      )}

      {result && (
        <Text accessibilityLiveRegion="polite" style={{ color: failed ? colors.warning : colors.success, marginTop: 10, fontWeight: "700" }}>
          {result.cancelled
            ? `Download interrompido: ${result.completed} de ${result.requested} fotos salvas.`
            : failed
              ? `${result.completed} de ${result.requested} fotos salvas. Algumas não responderam; tente de novo com uma conexão melhor.`
              : `Pronto: ${result.completed} fotos salvas no aparelho.`}
        </Text>
      )}
    </View>
  );
}
