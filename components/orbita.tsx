/**
 * PantanalDex — Componentes do sistema visual "Órbita pantaneira" (kit Órbita UI + Magic UI, MIT),
 * recriados em React Native com Reanimated e SVG.
 *
 *  - GradientFill     · fundos assinatura do Órbita (radial + linear), um por grupo de animais
 *  - Panel            · cartão do Órbita (degradê de 145° + contorno), opcionalmente com "brilho" (glint)
 *  - Starfield        · céu estrelado (Órbita `.sky`)
 *  - Meteors          · estrelas cadentes (Magic UI Meteors)
 *  - AuroraText       · título com degradê que se move (Magic UI Aurora Text)
 *  - MagicCard        · destaque de luz que acompanha o dedo (Magic UI Magic Card)
 *  - StatusPill       · indicador de status com ponto luminoso (Órbita `.status`)
 *  - MetricCard       · leitura grande + legenda + progresso (Órbita `.metric` + `progress`)
 *  - BeamFlow         · etapas ligadas por um feixe que corre (Magic UI Animated Beam)
 * Tudo decorativo ignora toques e para com "reduzir movimento"; o conteúdo continua legível sem efeito.
 *
 * @author Felipe de Souza Aquino
 */
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View, type GestureResponderEvent, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, {
  Easing, cancelAnimation, useAnimatedProps, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, LinearGradient, RadialGradient, Rect, Stop, Text as SvgText, Line } from "react-native-svg";

import { GrowBar, PulseDot } from "@/components/orbit-effects";
import { tapFeedback } from "@/components/motion";
import { Text } from "@/components/T";
import { panel, radius as R, type Gradient } from "@/constants/design";

let gid = 0;
const useId = (prefix: string) => useMemo(() => `${prefix}${++gid}`, [prefix]);

/** Fundo assinatura: brilho radial no canto + degradê diagonal (como `--aurora` do Órbita). */
export function GradientFill({ g, glowAt = { x: "74%", y: "15%" }, style }: { g: Gradient; glowAt?: { x: string; y: string }; style?: StyleProp<ViewStyle> }) {
  const id = useId("gf");
  return (
    <View pointerEvents="none" style={[{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }, style]}>
      <Svg width="100%" height="100%" preserveAspectRatio="none">
        <Defs>
          <LinearGradient id={`${id}l`} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0.12" stopColor={g.from} />
            <Stop offset="0.62" stopColor={g.via} />
            <Stop offset="1" stopColor={g.to} />
          </LinearGradient>
          <RadialGradient id={`${id}r`} cx={glowAt.x} cy={glowAt.y} rx="55%" ry="65%">
            <Stop offset="0" stopColor={g.glow} stopOpacity="0.85" />
            <Stop offset="1" stopColor={g.glow} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id}l)`} />
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id}r)`} />
      </Svg>
    </View>
  );
}

/** Cartão do Órbita: degradê de 145° do painel e contorno fino. */
export function Panel({ children, style, strong = false }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; strong?: boolean }) {
  const id = useId("pn");
  return (
    <View style={[{ borderRadius: R.md, borderWidth: 1, borderColor: strong ? panel.outlineStrong : panel.outline, overflow: "hidden", padding: 16 }, style]}>
      <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
        <Svg width="100%" height="100%" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id={id} x1="0" y1="0" x2="0.8" y2="1">
              <Stop offset="0" stopColor={panel.from} />
              <Stop offset="0.72" stopColor={panel.to} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
        </Svg>
      </View>
      {children}
    </View>
  );
}

/** Céu estrelado (pontos fixos, posições estáveis) com leve cintilar. */
export function Starfield({ count = 46, height = 260, seed = 7 }: { count?: number; height?: number; seed?: number }) {
  const reduced = useReducedMotion();
  const stars = useMemo(() => {
    let s = seed;
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: count }, () => ({ x: rnd() * 100, y: rnd() * 100, r: rnd() < 0.15 ? 1.4 : 0.8, o: 0.35 + rnd() * 0.55 }));
  }, [count, seed]);
  const twinkle = useSharedValue(1);
  useEffect(() => {
    if (reduced) return;
    twinkle.value = withRepeat(withTiming(0.55, { duration: 2600, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => cancelAnimation(twinkle);
  }, [reduced, twinkle]);
  const half = useAnimatedStyle(() => ({ opacity: twinkle.value }));
  const draw = (list: typeof stars) => (
    <Svg width="100%" height="100%">
      {list.map((star, i) => <Circle key={i} cx={`${star.x}%`} cy={`${star.y}%`} r={star.r} fill="#FBF7EF" opacity={star.o} />)}
    </Svg>
  );
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, height }}>
      <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>{draw(stars.filter((_, i) => i % 2 === 0))}</View>
      <Animated.View style={[{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }, half]}>{draw(stars.filter((_, i) => i % 2 === 1))}</Animated.View>
    </View>
  );
}

function Meteor({ delay, top, left, length }: { delay: number; top: number; left: number; length: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delay, withRepeat(withSequence(withTiming(1, { duration: 1300, easing: Easing.in(Easing.quad) }), withTiming(0, { duration: 0 }), withDelay(4200, withTiming(0, { duration: 0 }))), -1, false));
    return () => cancelAnimation(t);
  }, [delay, t]);
  const style = useAnimatedStyle(() => ({
    opacity: t.value === 0 ? 0 : 1 - t.value * 0.9,
    transform: [{ translateX: -t.value * 220 }, { translateY: t.value * 120 }, { rotate: "-28deg" }],
  }));
  return <Animated.View style={[{ position: "absolute", top, left, width: length, height: 1.4, borderRadius: 1, backgroundColor: "#FFF3C4" }, style]} />;
}

/** Estrelas cadentes atravessando o céu de tempos em tempos. */
export function Meteors({ count = 4, height = 220 }: { count?: number; height?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <View pointerEvents="none" style={{ position: "absolute", left: 0, right: 0, top: 0, height, overflow: "hidden" }}>
      {Array.from({ length: count }, (_, i) => <Meteor key={i} delay={i * 1500 + 600} top={8 + i * 22} left={200 + (i % 2) * 120} length={60 + (i % 3) * 18} />)}
    </View>
  );
}

const AnimatedStop = Animated.createAnimatedComponent(Stop);

/**
 * Título com degradê que "passeia" (Aurora Text). Desenhado em SVG para funcionar igual no Android,
 * iOS e web. `width`/`height` definem a caixa do texto.
 */
export function AuroraText({ text, width, height, fontSize, colors = ["#FFC400", "#FF8A3D", "#FFE38A", "#FFC400"], fontFamily = "Fraunces_700Bold", accessibilityLabel }: { text: string; width: number; height: number; fontSize: number; colors?: string[]; fontFamily?: string; accessibilityLabel?: string }) {
  const reduced = useReducedMotion();
  const id = useId("au");
  const shift = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    shift.value = withRepeat(withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.sin) }), -1, true);
    return () => cancelAnimation(shift);
  }, [reduced, shift]);
  const stop1 = useAnimatedProps(() => ({ offset: 0.15 * shift.value }));
  const stop2 = useAnimatedProps(() => ({ offset: 0.35 + 0.3 * shift.value }));
  return (
    <View accessible accessibilityRole="header" accessibilityLabel={accessibilityLabel ?? text} style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0.4">
            <AnimatedStop animatedProps={stop1} stopColor={colors[0]} />
            <AnimatedStop animatedProps={stop2} stopColor={colors[1]} />
            <Stop offset="0.8" stopColor={colors[2]} />
            <Stop offset="1" stopColor={colors[3]} />
          </LinearGradient>
        </Defs>
        <SvgText x="0" y={fontSize * 0.86} fontSize={fontSize} fontFamily={fontFamily} fontWeight="700" letterSpacing={-0.5} fill={`url(#${id})`}>{text}</SvgText>
      </Svg>
    </View>
  );
}

/**
 * Cartão com destaque de luz que segue o dedo (no toque) + leve elevação (Órbita `.lift`) e brilho de
 * contorno (Órbita `.glint`). A ação funciona igual sem o efeito.
 */
export function MagicCard({ children, style, glow = "#FFC400", onPress, ...rest }: Omit<PressableProps, "style" | "children"> & { children: React.ReactNode; style?: StyleProp<ViewStyle>; glow?: string }) {
  const reduced = useReducedMotion();
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null);
  const lift = useSharedValue(0);
  const light = useSharedValue(0);
  const animated = useAnimatedStyle(() => ({ transform: [{ translateY: lift.value }, { scale: 1 + lift.value * 0.004 }] }));
  const lightStyle = useAnimatedStyle(() => ({ opacity: light.value }));
  const id = useId("mc");
  const down = (e: GestureResponderEvent) => {
    tapFeedback();
    setSpot({ x: e.nativeEvent.locationX, y: e.nativeEvent.locationY });
    if (!reduced) { lift.value = withSpring(-3, { damping: 15, stiffness: 260 }); light.value = withTiming(1, { duration: 140 }); }
  };
  const up = () => { lift.value = withSpring(0, { damping: 15, stiffness: 260 }); light.value = withTiming(0, { duration: 380 }); };
  // O tamanho/posição no layout fica no Pressable; aparência (fundo, borda, padding) no cartão.
  const flat = (StyleSheet.flatten(style) ?? {}) as ViewStyle;
  const { flex, width, height, minHeight, alignSelf, margin, marginTop, marginBottom, marginLeft, marginRight, marginHorizontal, marginVertical, ...look } = flat;
  const layout: ViewStyle = { flex, width, height, minHeight, alignSelf, margin, marginTop, marginBottom, marginLeft, marginRight, marginHorizontal, marginVertical };
  return (
    <Pressable {...rest} onPress={onPress} onPressIn={down} onPressOut={up} style={layout}>
      <Animated.View style={[{ overflow: "hidden", flexGrow: 1 }, look, height !== undefined ? { height: "100%" } : null, animated]}>
        {children}
        {spot && (
          <Animated.View pointerEvents="none" style={[{ position: "absolute", left: spot.x - 130, top: spot.y - 130, width: 260, height: 260 }, lightStyle]}>
            <Svg width={260} height={260}>
              <Defs>
                <RadialGradient id={id} cx="50%" cy="50%" r="50%">
                  <Stop offset="0" stopColor={glow} stopOpacity="0.32" />
                  <Stop offset="1" stopColor={glow} stopOpacity="0" />
                </RadialGradient>
              </Defs>
              <Circle cx={130} cy={130} r={130} fill={`url(#${id})`} />
            </Svg>
          </Animated.View>
        )}
      </Animated.View>
    </Pressable>
  );
}

/** Indicador de status (ponto luminoso que pulsa + texto). */
export function StatusPill({ label, color = "#4ADE80" }: { label: string; color?: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: R.pill, backgroundColor: color + "1A", borderWidth: 1, borderColor: color + "40" }}>
      <PulseDot color={color} size={7} />
      <Text style={{ color, fontSize: 12, fontWeight: "800" }}>{label}</Text>
    </View>
  );
}

/** Leitura grande do Órbita: valor + unidade + legenda e, se quiser, barra de progresso. */
export function MetricCard({ label, value, unit, percent, accent = "#FFC400", style }: { label: string; value: React.ReactNode; unit?: string; percent?: number; accent?: string; style?: StyleProp<ViewStyle> }) {
  return (
    <Panel style={[{ flex: 1, padding: 14 }, style]}>
      <Text style={{ color: "#B8B0A2", fontSize: 12, fontWeight: "700" }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4, marginTop: 4 }}>
        {typeof value === "string" || typeof value === "number" ? <Text style={{ color: "#FBF7EF", fontSize: 28, fontFamily: "Fraunces_700Bold", fontVariant: ["tabular-nums"] }}>{value}</Text> : value}
        {unit ? <Text style={{ color: "#B8B0A2", fontSize: 13 }}>{unit}</Text> : null}
      </View>
      {percent !== undefined && <View style={{ marginTop: 8 }}><GrowBar percent={percent} color={accent} track="#2F2B25" height={5} /></View>}
    </Panel>
  );
}

const AnimatedLine = Animated.createAnimatedComponent(Line);

/** Etapas ligadas por um feixe de luz que corre de uma para a outra (Animated Beam). */
export function BeamFlow({ steps, color = "#FFC400" }: { steps: { icon: string; label: string }[]; color?: string }) {
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const offset = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    offset.value = withRepeat(withTiming(-200, { duration: 2400, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(offset);
  }, [reduced, offset]);
  const beam = useAnimatedProps(() => ({ strokeDashoffset: offset.value }));
  const slot = width / Math.max(steps.length, 1);
  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ height: 92 }} accessible accessibilityLabel={steps.map((s) => s.label).join(", depois ")}>
      {width > 0 && (
        <Svg pointerEvents="none" width={width} height={92} style={{ position: "absolute" }}>
          <Line x1={slot / 2} y1={28} x2={width - slot / 2} y2={28} stroke="#3A342A" strokeWidth={2} />
          {!reduced && <AnimatedLine x1={slot / 2} y1={28} x2={width - slot / 2} y2={28} stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeDasharray={[34, 166]} animatedProps={beam} />}
        </Svg>
      )}
      <View style={{ flexDirection: "row" }}>
        {steps.map((step) => (
          <View key={step.label} style={{ flex: 1, alignItems: "center" }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#1A1815", borderWidth: 1.5, borderColor: color, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 24 }}>{step.icon}</Text>
            </View>
            <Text style={{ color: "#FBF7EF", fontSize: 11, fontWeight: "800", marginTop: 6, textAlign: "center" }} numberOfLines={2}>{step.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
