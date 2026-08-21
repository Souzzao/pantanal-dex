import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { HapticTab } from "@/components/haptic-tab";
import { useColors } from "@/hooks/use-colors";
import { useApp } from "@/contexts/AppContext";

export default function TabLayout() {
  const colors = useColors();
  const { settings } = useApp();
  const labels = settings.defaultLanguage === "English" ? { home: "Home", animals: "Animals", sightings: "Sightings", settings: "Settings" } : settings.defaultLanguage === "Español" ? { home: "Inicio", animals: "Animales", sightings: "Avistamientos", settings: "Configuración" } : { home: "Início", animals: "Animais", sightings: "Avistamentos", settings: "Configurações" };
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarStyle: { height: 58 + bottom, paddingBottom: bottom, paddingTop: 6, backgroundColor: colors.background, borderTopColor: colors.border }, tabBarButton: HapticTab }}>
    <Tabs.Screen name="index" options={{ title: labels.home, tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={24} color={color} /> }} />
    <Tabs.Screen name="animals" options={{ title: labels.animals, tabBarIcon: ({ color }) => <IconSymbol name="pawprint.fill" size={24} color={color} /> }} />
    <Tabs.Screen name="sightings" options={{ title: labels.sightings, tabBarIcon: ({ color }) => <IconSymbol name="mappin.and.ellipse" size={24} color={color} /> }} />
    <Tabs.Screen name="settings" options={{ title: labels.settings, tabBarIcon: ({ color }) => <IconSymbol name="gearshape.fill" size={24} color={color} /> }} />
  </Tabs>;
}
