/**
 * PantanalDex — Componente de ícone do sistema "Traço pantaneiro" (desenho em shared/icon-paths.ts).
 *
 * Duas cores: o traço principal (`color`) e o acento (`accent`, amarelo da marca por padrão).
 * Em fundo amarelo use `mono` para o acento seguir a cor do traço.
 *
 * @author Felipe de Souza Aquino
 */
import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useColors } from "@/hooks/use-colors";
import { ICONS, type IconName } from "@/shared/icon-paths";

export type { IconName } from "@/shared/icon-paths";

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  accent?: string;
  mono?: boolean;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  /** Texto para leitores de tela; sem ele o ícone é decorativo. */
  label?: string;
};

export function Icon({ name, size = 22, color, accent, mono, strokeWidth = 1.75, style, label }: Props) {
  const colors = useColors();
  const stroke = color ?? colors.foreground;
  const tone = mono ? stroke : accent ?? colors.primary;
  const icon = ICONS[name];
  return (
    <View style={[{ width: size, height: size }, style]} accessible={!!label} accessibilityLabel={label} accessibilityRole={label ? "image" : undefined}
      importantForAccessibility={label ? "yes" : "no-hide-descendants"} accessibilityElementsHidden={!label} pointerEvents="none">
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {icon.d.map((d) => <Path key={d} d={d} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />)}
        {"a" in icon && icon.a.map((d) => <Path key={`a${d}`} d={d} stroke={tone} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />)}
      </Svg>
    </View>
  );
}

/** Ícone dentro de um círculo/quadrado suave: o "selo" usado em cartões, conquistas e etapas. */
export function IconBadge({ name, size = 44, color, accent, background, border, radius, mono, label }: Props & { background?: string; border?: string; radius?: number }) {
  const colors = useColors();
  return (
    <View style={{ width: size, height: size, borderRadius: radius ?? size * 0.36, backgroundColor: background ?? colors.surface, borderWidth: border ? 1.5 : 0, borderColor: border, alignItems: "center", justifyContent: "center" }}>
      <Icon name={name} size={Math.round(size * 0.52)} color={color} accent={accent} mono={mono} label={label} />
    </View>
  );
}
