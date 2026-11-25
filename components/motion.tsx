/**
 * PantanalDex — Movimento: toque com mola (o card "afunda" e volta), entrada em cascata das listas e
 * título com a fonte de destaque. Animações curtas (< 300 ms), físicas e com vibração leve.
 *
 * @author Felipe de Souza Aquino
 */
import * as Haptics from "expo-haptics";
import React from "react";
import { Platform, Pressable, type PressableProps, type StyleProp, type TextProps, type ViewStyle } from "react-native";
import Animated, { FadeInDown, useAnimatedStyle, useReducedMotion, useSharedValue, withSpring } from "react-native-reanimated";

import { Text } from "@/components/T";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const SPRING = { damping: 16, stiffness: 260, mass: 0.6 } as const;

export function tapFeedback(kind: "light" | "medium" | "success" = "light") {
  if (Platform.OS === "web") return;
  if (kind === "success") void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  else void Haptics.impactAsync(kind === "medium" ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
}

type PressableScaleProps = Omit<PressableProps, "style"> & { style?: StyleProp<ViewStyle>; scaleTo?: number; haptic?: boolean };

/** Botão/card que encolhe levemente ao tocar e volta com mola. */
export function PressableScale({ style, scaleTo = 0.96, haptic = true, onPressIn, onPressOut, children, ...rest }: PressableScaleProps) {
  const scale = useSharedValue(1);
  const reduced = useReducedMotion();
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(event) => { if (!reduced) scale.value = withSpring(scaleTo, SPRING); if (haptic) tapFeedback(); onPressIn?.(event); }}
      onPressOut={(event) => { scale.value = withSpring(1, SPRING); onPressOut?.(event); }}
      style={[style, animated]}
    >
      {children as React.ReactNode}
    </AnimatedPressable>
  );
}

/** Entrada em cascata: cada item aparece subindo um pouco, com atraso pela posição (só os primeiros). */
export function Reveal({ index = 0, children, style }: { index?: number; children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  if (reduced || index > 14) return <Animated.View style={style}>{children}</Animated.View>;
  return <Animated.View entering={FadeInDown.delay(index * 45).duration(320).springify().damping(18)} style={style}>{children}</Animated.View>;
}

/** Títulos com a fonte de destaque (Fraunces), estilo guia de campo editorial. */
export function DisplayText({ style, ...rest }: TextProps) {
  return <Text {...rest} style={[{ fontFamily: "Fraunces_700Bold", letterSpacing: -0.5 }, style]} />;
}
