import { Alert, Linking, Pressable, Text, View } from "react-native";
import { router } from "expo-router";

import NativeMapView from "@/components/NativeMapView";

import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import { filterSpeciesCatalog } from "@/shared/catalog";
import { useColors } from "@/hooks/use-colors";

const roundCoordinate = (value: number) => Math.round(value * 100) / 100;

export default function MapScreen() {
  const colors = useColors();
  const { sightings, ready, settings } = useApp();
  const english = settings.defaultLanguage === "English";
  const spanish = settings.defaultLanguage === "Español";
  const labels = english
    ? {
        back: "‹ Back",
        title: "Sightings map",
        subtitle: "Your georeferenced field notebook records",
        ready: "Notebook data available offline",
        restoring: "Restoring local data…",
        privacy:
          "Your records and coordinates stay on this device. The map layer may need internet; on web, cards remain available without it.",
        webTitle: "Web view",
        webDetail:
          "In the web preview, points appear as cards to preserve functionality without relying on a map API. On the device, the same screen uses native markers when the map module is available.",
        located: (count: number) =>
          `${count} record(s) with location · catalog and records available offline`,
        empty: "No sightings with coordinates yet.",
        emptyDetail:
          "Use device location when creating a record to see it here.",
        external: "Open in external map",
        externalError: "External map unavailable",
        externalErrorDetail:
          "Could not open the map. Your records remain saved on the device.",
      }
    : spanish
      ? {
          back: "‹ Volver",
          title: "Mapa de avistamientos",
          subtitle: "Tus registros georreferenciados del cuaderno de campo",
          ready: "Datos del cuaderno disponibles sin conexión",
          restoring: "Restaurando datos locales…",
          privacy:
            "Tus registros y coordenadas permanecen en el dispositivo. La capa cartográfica puede necesitar internet; en la web, las tarjetas siguen disponibles sin ella.",
          webTitle: "Vista web",
          webDetail:
            "En la vista web, los puntos aparecen en tarjetas para mantener el funcionamiento sin depender de una API cartográfica. En el dispositivo, la misma pantalla usa marcadores nativos cuando el módulo de mapas está disponible.",
          located: (count: number) =>
            `${count} registro(s) con ubicación · catálogo y registros disponibles sin conexión`,
          empty: "Aún no hay avistamientos con coordenadas.",
          emptyDetail:
            "Usa la ubicación del dispositivo al crear un registro para verlo aquí.",
          external: "Abrir en mapa externo",
          externalError: "Mapa externo no disponible",
          externalErrorDetail:
            "No fue posible abrir el mapa. Tus registros siguen guardados en el dispositivo.",
        }
      : {
          back: "‹ Voltar",
          title: "Mapa de avistamentos",
          subtitle: "Seus registros georreferenciados do caderno de campo",
          ready: "Dados do caderno disponíveis offline",
          restoring: "Restaurando dados locais…",
          privacy:
            "Seus registros e coordenadas ficam no aparelho. A camada cartográfica pode precisar de internet; no web, os cartões continuam disponíveis sem ela.",
          webTitle: "Visualização web",
          webDetail:
            "Na prévia web, os pontos aparecem em cartões para preservar o funcionamento sem depender de uma API cartográfica. No aparelho, a mesma tela usa marcadores nativos quando o módulo de mapas está disponível.",
          located: (count: number) =>
            `${count} registro(s) com localização · catálogo e registros disponíveis offline`,
          empty: "Nenhum avistamento com coordenadas ainda.",
          emptyDetail:
            "Use a localização do aparelho ao criar um registro para vê-lo aqui.",
          external: "Abrir no mapa externo",
          externalError: "Mapa externo indisponível",
          externalErrorDetail:
            "Não foi possível abrir o mapa. Seus registros permanecem salvos no aparelho.",
        };
  const catalogById = new Map(
    filterSpeciesCatalog().map((item) => [item.id, item.commonName]),
  );
  const located = sightings.filter(
    (item) => item.latitude !== undefined && item.longitude !== undefined,
  );

  const openExternalMap = async (latitude: number, longitude: number) => {
    try {
      await Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      );
    } catch {
      Alert.alert(labels.externalError, labels.externalErrorDetail);
    }
  };

  return (
    <ScreenContainer
      edges={["top", "left", "right", "bottom"]}
      className="px-5"
    >
      <Pressable
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={labels.back}
      >
        <Text
          style={{
            color: colors.primary,
            fontWeight: "700",
            paddingVertical: 14,
          }}
        >
          {labels.back}
        </Text>
      </Pressable>
      <Text
        style={{ color: colors.foreground, fontSize: 28, fontWeight: "800" }}
      >
        {labels.title}
      </Text>
      <Text style={{ color: colors.muted, marginTop: 5 }}>
        {labels.subtitle}
      </Text>
      <View
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 14,
          padding: 12,
          marginTop: 14,
        }}
        accessibilityRole="summary"
      >
        <Text style={{ color: colors.foreground, fontWeight: "800" }}>
          {ready ? labels.ready : labels.restoring}
        </Text>
        <Text style={{ color: colors.muted, marginTop: 4, lineHeight: 18 }}>
          {labels.privacy}
        </Text>
      </View>
      <NativeMapView />
      <View
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 18,
          padding: 18,
          marginTop: 18,
        }}
      >
        <Text
          style={{ color: colors.foreground, fontWeight: "800", fontSize: 17 }}
        >
          {labels.webTitle}
        </Text>
        <Text style={{ color: colors.muted, lineHeight: 21, marginTop: 8 }}>
          {labels.webDetail}
        </Text>
        <Text
          style={{ color: colors.primary, fontWeight: "800", marginTop: 14 }}
        >
          {labels.located(located.length)}
        </Text>
      </View>
      {located.length === 0 ? (
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            marginTop: 18,
          }}
        >
          <Text style={{ color: colors.foreground, fontWeight: "800" }}>
            {labels.empty}
          </Text>
          <Text style={{ color: colors.muted, marginTop: 6 }}>
            {labels.emptyDetail}
          </Text>
        </View>
      ) : (
        located.map((item) => {
          const animalName = catalogById.get(item.speciesId) ?? "Animal";
          const isPrivateExact =
            item.visibility === "private" && item.locationPrecision === "exact";
          const latitude = isPrivateExact
            ? item.latitude!
            : roundCoordinate(item.latitude!);
          const longitude = isPrivateExact
            ? item.longitude!
            : roundCoordinate(item.longitude!);
          return (
            <View
              key={item.id}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 14,
                padding: 14,
                marginTop: 12,
              }}
            >
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/sightings/[id]",
                    params: { id: item.id },
                  } as any)
                }
                accessibilityRole="button"
              >
                <Text
                  style={{
                    color: colors.foreground,
                    fontWeight: "800",
                    fontSize: 16,
                  }}
                >
                  {animalName}
                </Text>
                <Text style={{ color: colors.muted, marginTop: 4 }}>
                  {item.locationLabel || item.date}
                </Text>
                <Text
                  style={{ color: colors.primary, marginTop: 6, fontSize: 12 }}
                >
                  {latitude.toFixed(2)}, {longitude.toFixed(2)}
                  {isPrivateExact ? "" : " · posição aproximada"}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => void openExternalMap(latitude, longitude)}
                accessibilityRole="button"
                accessibilityLabel={labels.external}
                style={{
                  borderColor: colors.primary,
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 9,
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    color: colors.primary,
                    textAlign: "center",
                    fontWeight: "800",
                    fontSize: 12,
                  }}
                >
                  {labels.external}
                </Text>
              </Pressable>
            </View>
          );
        })
      )}
    </ScreenContainer>
  );
}
