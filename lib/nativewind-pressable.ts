/**
 * PantanalDex — Habilita className do NativeWind no Pressable.
 *
 * @author Felipe de Souza Aquino
 */
// NativeWind + Pressable: className can swallow onPress. Disable className mapping globally.
import { Pressable } from "react-native";
import { remapProps } from "nativewind";

remapProps(Pressable, { className: false });
