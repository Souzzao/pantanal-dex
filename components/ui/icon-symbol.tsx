// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { Platform, Text } from "react-native";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = "house.fill" | "paperplane.fill" | "chevron.left.forwardslash.chevron.right" | "chevron.right" | "pawprint.fill" | "mappin.and.ellipse" | "gearshape.fill";

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "pawprint.fill": "pets",
  "mappin.and.ellipse": "location-on",
  "gearshape.fill": "settings",
} as IconMapping;

const WEB_GLYPHS: Record<IconSymbolName, string> = {
  "house.fill": "⌂",
  "paperplane.fill": "➤",
  "chevron.left.forwardslash.chevron.right": "‹›",
  "chevron.right": "›",
  "pawprint.fill": "♣",
  "mappin.and.ellipse": "⌖",
  "gearshape.fill": "⚙",
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  if (Platform.OS === "web") {
    return <Text accessibilityRole="image" style={[style, { color: color as string, fontSize: size, lineHeight: size }]}>{WEB_GLYPHS[name]}</Text>;
  }
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
