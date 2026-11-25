/**
 * PantanalDex — Barra de abas flutuante: uma "pílula" acima da borda da tela, com indicador que
 * desliza até a aba ativa e o botão Registrar em destaque no centro (círculo amarelo elevado).
 *
 * @author Felipe de Souza Aquino
 */
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, View, type LayoutChangeEvent } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PressableScale, tapFeedback } from "@/components/motion";
import { Text } from "@/components/T";
import { useColors } from "@/hooks/use-colors";

const SPRING = { damping: 18, stiffness: 220, mass: 0.7 } as const;
export const TAB_BAR_SPACE = 92; // espaço que as telas reservam embaixo para a barra flutuante

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 10);
  const [width, setWidth] = useState(0);
  const count = state.routes.length;
  const slot = width / Math.max(count, 1);
  const x = useSharedValue(0);

  useEffect(() => { if (slot) x.value = withSpring(state.index * slot, SPRING); }, [state.index, slot, x]);
  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 14, paddingBottom: bottom }}>
      <View
        onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
        style={{ flexDirection: "row", height: 64, borderRadius: 26, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
          shadowColor: "#000", shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 14 }}
      >
        {slot > 0 && (
          <Animated.View pointerEvents="none" style={[{ position: "absolute", top: 8, bottom: 8, left: 6, width: slot - 12, borderRadius: 18, backgroundColor: colors.primary + "1F" }, indicator]} />
        )}
        {state.routes.map((route, index) => {
          const options = descriptors[route.key].options;
          const focused = state.index === index;
          const label = typeof options.title === "string" ? options.title : route.name;
          const color = focused ? colors.primary : colors.muted;
          const isRegister = route.name === "register";
          const onPress = () => {
            tapFeedback(isRegister ? "medium" : "light");
            if (isRegister) { router.push("/sightings/new" as never); return; }
            const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
          };
          if (isRegister) {
            return (
              <View key={route.key} style={{ flex: 1, alignItems: "center" }}>
                <PressableScale onPress={onPress} haptic={false} scaleTo={0.9} accessibilityRole="button" accessibilityLabel={label}
                  style={{ marginTop: -22, width: 62, height: 62, borderRadius: 31, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center",
                    borderWidth: 4, borderColor: colors.background, shadowColor: colors.primary, shadowOpacity: 0.5, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 10 }}>
                  <Text style={{ color: colors.background, fontSize: 32, fontWeight: "900", lineHeight: 34, marginTop: -2 }}>+</Text>
                </PressableScale>
                <Text style={{ color: colors.primary, fontSize: 10, fontWeight: "800", marginTop: 2 }} numberOfLines={1}>{label}</Text>
              </View>
            );
          }
          return (
            <Pressable key={route.key} onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: focused }} accessibilityLabel={label}
              style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 2 }}>
              {options.tabBarIcon?.({ focused, color, size: 22 })}
              <Text style={{ color, fontSize: 10, fontWeight: focused ? "800" : "600" }} numberOfLines={1}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
