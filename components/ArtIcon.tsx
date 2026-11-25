/**
 * PantanalDex — Figuras do app (substituem os emojis). Desenhos gerados no ChatGPT num estilo único
 * (creme + amarelo), recortados com fundo transparente em assets/icons. Nomes em shared/art-names.ts.
 *
 * @author Felipe de Souza Aquino
 */
import React from "react";
import { Image, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from "react-native";

import type { ArtName } from "@/shared/art-names";

export type { ArtName } from "@/shared/art-names";

export const ART_SOURCES: Record<ArtName, ImageSourcePropType> = {
  "onca": require("@/assets/icons/onca.png"),
  "tuiuiu": require("@/assets/icons/tuiuiu.png"),
  "jacare": require("@/assets/icons/jacare.png"),
  "sapo": require("@/assets/icons/sapo.png"),
  "peixe": require("@/assets/icons/peixe.png"),
  "borboleta": require("@/assets/icons/borboleta.png"),
  "caderno": require("@/assets/icons/caderno.png"),
  "lupa": require("@/assets/icons/lupa.png"),
  "bussola": require("@/assets/icons/bussola.png"),
  "folhas": require("@/assets/icons/folhas.png"),
  "pegada": require("@/assets/icons/pegada.png"),
  "pena": require("@/assets/icons/pena.png"),
  "calendario": require("@/assets/icons/calendario.png"),
  "trofeu": require("@/assets/icons/trofeu.png"),
  "equipe": require("@/assets/icons/equipe.png"),
  "mapa": require("@/assets/icons/mapa.png"),
  "cidade": require("@/assets/icons/cidade.png"),
  "ponte": require("@/assets/icons/ponte.png"),
  "arvore": require("@/assets/icons/arvore.png"),
  "rio": require("@/assets/icons/rio.png"),
  "anzol": require("@/assets/icons/anzol.png"),
  "igreja": require("@/assets/icons/igreja.png"),
  "forte": require("@/assets/icons/forte.png"),
  "ancora": require("@/assets/icons/ancora.png"),
  "montanha": require("@/assets/icons/montanha.png"),
  "ilha": require("@/assets/icons/ilha.png"),
  "canoa": require("@/assets/icons/canoa.png"),
  "portal": require("@/assets/icons/portal.png"),
  "capim": require("@/assets/icons/capim.png"),
  "cavalo": require("@/assets/icons/cavalo.png"),
  "medalha": require("@/assets/icons/medalha.png"),
  "brilho": require("@/assets/icons/brilho.png"),
  "camera": require("@/assets/icons/camera.png"),
  "fotos": require("@/assets/icons/fotos.png"),
  "frasco": require("@/assets/icons/frasco.png"),
  "caderno-lapis": require("@/assets/icons/caderno-lapis.png"),
  "importar": require("@/assets/icons/importar.png"),
  "escudo": require("@/assets/icons/escudo.png"),
  "ampulheta": require("@/assets/icons/ampulheta.png"),
  "aprovado": require("@/assets/icons/aprovado.png"),
  "alfinete": require("@/assets/icons/alfinete.png"),
  "pasta": require("@/assets/icons/pasta.png"),
  "binoculo": require("@/assets/icons/binoculo.png"),
  "arara": require("@/assets/icons/arara.png"),
  "ariranha": require("@/assets/icons/ariranha.png"),
  "offline": require("@/assets/icons/offline.png"),
  "globo": require("@/assets/icons/globo.png"),
  "zona": require("@/assets/icons/zona.png"),
};

type Props = {
  name: ArtName;
  size?: number;
  /** Apagada (conquista ainda bloqueada, lugar não visitado). */
  dim?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Texto para leitores de tela; sem ele a figura é decorativa. */
  label?: string;
};

export function ArtIcon({ name, size = 24, dim, style, label }: Props) {
  return (
    <View style={[{ width: size, height: size, opacity: dim ? 0.32 : 1 }, style]} accessible={!!label} accessibilityLabel={label}
      accessibilityRole={label ? "image" : undefined} importantForAccessibility={label ? "yes" : "no-hide-descendants"} accessibilityElementsHidden={!label} pointerEvents="none">
      <Image source={ART_SOURCES[name]} style={{ width: size, height: size }} resizeMode="contain" fadeDuration={0} />
    </View>
  );
}
