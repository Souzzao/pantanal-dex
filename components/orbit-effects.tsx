/**
 * PantanalDex — Efeitos inspirados no kit Órbita UI / Magic UI (MIT), recriados em React Native com
 * Reanimated e SVG, na identidade do app: o "horizonte" vira um pôr do sol âmbar sobre o Pantanal.
 *
 *  - HorizonGlow: arco de horizonte com brilho (Órbita `.planet`), decorativo, ignora toques.
 *  - NumberTicker: número que conta até o valor (Magic UI Number Ticker).
 *  - BorderBeam: luz que percorre a borda de um card (Magic UI Border Beam).
 *  - Glint: faixa de brilho que atravessa o card de tempos em tempos (Órbita `.scan`).
 *  - PulseDot: indicador de status que pulsa (Órbita `.status`).
 *  - GrowBar: barra de progresso que se preenche ao aparecer.
 *  - Orbit: itens orbitando um centro (Magic UI Orbiting Circles).
 * Todos respeitam "reduzir movimento" do sistema: sem animação, o conteúdo continua igual.
 *
 * @author Felipe de Souza Aquino
 */
import React, { useEffect, useState } from "react";
import { View, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import Animated, {
  Easing, cancelAnimation, useAnimatedProps, useAnimatedReaction, useAnimatedStyle, useReducedMotion, useSharedValue,
  withDelay, withRepeat, withSequence, withTiming, runOnJS,
} from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, RadialGradient, Rect, Stop } from "react-native-svg";

import { Text } from "@/components/T";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

/** Arco de horizonte com brilho âmbar (pôr do sol sobre o Pantanal). Coloque atrás do conteúdo. */
export function HorizonGlow({ height = 260, color = "#FFC400", style }: { height?: number; color?: string; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  const breathe = useSharedValue(0.85);
  useEffect(() => {
    if (reduced) return;
    breathe.value = withRepeat(withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => cancelAnimation(breathe);
  }, [reduced, breathe]);
  const glow = useAnimatedStyle(() => ({ opacity: breathe.value }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: "absolute", left: -40, right: -40, top: 0, height }, glow, style]}>
      <Svg width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="none">
        <Defs>
          <RadialGradient id="sun" cx="78%" cy="100%" rx="70%" ry="95%">
            <Stop offset="0" stopColor={color} stopOpacity="0.55" />
            <Stop offset="0.35" stopColor="#FF7A1A" stopOpacity="0.22" />
            <Stop offset="1" stopColor="#0E0D0B" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="planet" cx="50%" cy="0%" rx="60%" ry="60%">
            <Stop offset="0" stopColor="#3A2A12" stopOpacity="1" />
            <Stop offset="1" stopColor="#0E0D0B" stopOpacity="1" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="400" height="260" fill="url(#sun)" />
        {/* o "planeta": um arco grande cuja borda superior pega a luz */}
        <Circle cx="290" cy="560" r="380" fill="url(#planet)" stroke={color} strokeOpacity="0.75" strokeWidth="1.5" />
      </Svg>
    </Animated.View>
  );
}

/** Número que conta do zero (ou de `from`) até o valor, com formatação brasileira. */
export function NumberTicker({ value, from = 0, duration = 1100, delay = 150, style }: { value: number; from?: number; duration?: number; delay?: number; style?: StyleProp<TextStyle> }) {
  const reduced = useReducedMotion();
  const progress = useSharedValue(reduced ? value : from);
  const [shown, setShown] = useState(reduced ? value : from);
  useEffect(() => {
    progress.value = reduced ? value : withDelay(delay, withTiming(value, { duration, easing: Easing.out(Easing.cubic) }));
  }, [value, reduced, duration, delay, progress]);
  useAnimatedReaction(() => Math.round(progress.value), (now, before) => { if (now !== before) runOnJS(setShown)(now); });
  return <Text style={style}>{shown.toLocaleString("pt-BR")}</Text>;
}

/**
 * Luz que percorre a borda do card. Envolva o conteúdo; o card precisa de tamanho definido pelo
 * conteúdo (a borda se ajusta sozinha).
 */
export function BorderBeam({ children, radius = 22, color = "#FFF3C4", duration = 5200, style }: { children: React.ReactNode; radius?: number; color?: string; duration?: number; style?: StyleProp<ViewStyle> }) {
  const reduced = useReducedMotion();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const offset = useSharedValue(0);
  const perimeter = size.w && size.h ? 2 * (size.w + size.h) - (8 - 2 * Math.PI) * radius : 0;
  useEffect(() => {
    if (reduced || !perimeter) return;
    offset.value = 0;
    offset.value = withRepeat(withTiming(-perimeter, { duration, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(offset);
  }, [reduced, perimeter, duration, offset]);
  const props = useAnimatedProps(() => ({ strokeDashoffset: offset.value }));
  return (
    <View style={style} onLayout={(e) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}>
      {children}
      {!reduced && perimeter > 0 && (
        <Svg pointerEvents="none" width={size.w} height={size.h} style={{ position: "absolute", left: 0, top: 0 }}>
          <AnimatedRect x={1} y={1} width={size.w - 2} height={size.h - 2} rx={radius} ry={radius} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round"
            strokeDasharray={[perimeter * 0.16, perimeter * 0.84]} animatedProps={props} strokeOpacity={0.95} />
        </Svg>
      )}
    </View>
  );
}

/** Faixa de brilho diagonal que atravessa o card (a cada `every` ms). Ponha dentro de um card com overflow hidden. */
export function Glint({ every = 6000, width = 360 }: { every?: number; width?: number }) {
  const reduced = useReducedMotion();
  const x = useSharedValue(-width);
  useEffect(() => {
    if (reduced) return;
    x.value = withRepeat(withSequence(withTiming(-width, { duration: 0 }), withDelay(every, withTiming(width * 1.4, { duration: 900, easing: Easing.inOut(Easing.quad) }))), -1, false);
    return () => cancelAnimation(x);
  }, [reduced, every, width, x]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }, { rotate: "18deg" }] }));
  if (reduced) return null;
  return <Animated.View pointerEvents="none" style={[{ position: "absolute", top: -60, bottom: -60, width: 70, backgroundColor: "rgba(255,243,196,0.16)" }, style]} />;
}

/** Bolinha de status que pulsa (ex.: "pronto para usar offline"). */
export function PulseDot({ color = "#4ADE80", size = 8 }: { color?: string; size?: number }) {
  const reduced = useReducedMotion();
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    pulse.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }), -1, false);
    return () => cancelAnimation(pulse);
  }, [reduced, pulse]);
  const ring = useAnimatedStyle(() => ({ opacity: 0.6 * (1 - pulse.value), transform: [{ scale: 1 + pulse.value * 1.8 }] }));
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[{ position: "absolute", width: size, height: size, borderRadius: size / 2, backgroundColor: color }, ring]} />
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />
    </View>
  );
}

/** Barra de progresso que se preenche ao aparecer. `percent` de 0 a 100. */
export function GrowBar({ percent, color = "#FFC400", track = "#2F2B25", height = 6, delay = 250 }: { percent: number; color?: string; track?: string; height?: number; delay?: number }) {
  const reduced = useReducedMotion();
  const target = Math.max(0, Math.min(100, percent));
  const value = useSharedValue(reduced ? target : 0);
  useEffect(() => { value.value = reduced ? target : withDelay(delay, withTiming(target, { duration: 900, easing: Easing.out(Easing.cubic) })); }, [target, reduced, delay, value]);
  const fill = useAnimatedStyle(() => ({ width: `${value.value}%` }));
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: track, overflow: "hidden" }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(target) }}>
      <Animated.View style={[{ height, borderRadius: height / 2, backgroundColor: color }, fill]} />
    </View>
  );
}

/** Itens orbitando um centro (estado vazio de Equipes, por exemplo). */
export function Orbit({ center, items, radius = 70, duration = 14000 }: { center: React.ReactNode; items: React.ReactNode[]; radius?: number; duration?: number }) {
  const reduced = useReducedMotion();
  const angle = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    angle.value = withRepeat(withTiming(360, { duration, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(angle);
  }, [reduced, duration, angle]);
  const spin = useAnimatedStyle(() => ({ transform: [{ rotate: `${angle.value}deg` }] }));
  const counter = useAnimatedStyle(() => ({ transform: [{ rotate: `${-angle.value}deg` }] }));
  const box = radius * 2 + 48;
  return (
    <View style={{ width: box, height: box, alignItems: "center", justifyContent: "center" }}>
      <View pointerEvents="none" style={{ position: "absolute", width: radius * 2, height: radius * 2, borderRadius: radius, borderWidth: 1, borderColor: "rgba(255,196,0,0.25)", borderStyle: "dashed" }} />
      <Animated.View style={[{ position: "absolute", width: box, height: box }, spin]}>
        {items.map((item, index) => {
          const a = (index / items.length) * 2 * Math.PI;
          return (
            <Animated.View key={index} style={[{ position: "absolute", left: box / 2 + Math.cos(a) * radius - 20, top: box / 2 + Math.sin(a) * radius - 20, width: 40, height: 40, alignItems: "center", justifyContent: "center" }, counter]}>
              {item}
            </Animated.View>
          );
        })}
      </Animated.View>
      {center}
    </View>
  );
}

/** Degradê de baixo para cima sobre fotos (texto legível sem faixa marcada). */
export function BottomFade({ height = 140, color = "#0E0D0B", strength = 0.85 }: { height?: number; color?: string; strength?: number }) {
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height }}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0" />
            <Stop offset="0.55" stopColor={color} stopOpacity={strength * 0.55} />
            <Stop offset="1" stopColor={color} stopOpacity={strength} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#fade)" />
      </Svg>
    </View>
  );
}
