import { router, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { HapticTab } from "@/components/haptic-tab";
import { useColors } from "@/hooks/use-colors";
import { useApp } from "@/contexts/AppContext";
import { useI18n } from "@/contexts/LanguageContext";

export default function TabLayout() {
  const { t } = useI18n();
  const colors = useColors();
  const { settings } = useApp();
  const labels = settings.defaultLanguage === "English" ? { home: "Home", animals: "Animals", register: "Log", sightings: "My sightings", settings: "Settings" } : settings.defaultLanguage === "Español" ? { home: "Inicio", animals: "Animales", register: "Registrar", sightings: "Mis registros", settings: "Ajustes" } : { home: "Início", animals: "Animais", register: "Registrar", sightings: "Meus registros", settings: "Ajustes" };
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarLabelStyle: { fontSize: 11 }, tabBarStyle: { height: 58 + bottom, paddingBottom: bottom, paddingTop: 6, backgroundColor: colors.background, borderTopColor: colors.border }, ...(Platform.OS === "web" ? {} : { tabBarButton: HapticTab }) }}>
    <Tabs.Screen name="index" options={{ title: t(labels.home), tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={24} color={color} /> }} />
    <Tabs.Screen name="animals" options={{ title: t(labels.animals), tabBarIcon: ({ color }) => <IconSymbol name="pawprint.fill" size={24} color={color} /> }} />
    {/* "Registrar avistamento" separado de "Meus avistamentos": a aba abre o formulário por cima. */}
    <Tabs.Screen name="register" options={{ title: t(labels.register), tabBarIcon: ({ color }) => <IconSymbol name="plus.circle.fill" size={28} color={color} /> }}
      listeners={{ tabPress: (event) => { event.preventDefault(); router.push("/sightings/new" as never); } }} />
    <Tabs.Screen name="sightings" options={{ title: t(labels.sightings), tabBarIcon: ({ color }) => <IconSymbol name="mappin.and.ellipse" size={24} color={color} /> }} />
    <Tabs.Screen name="settings" options={{ title: t(labels.settings), tabBarIcon: ({ color }) => <IconSymbol name="gearshape.fill" size={24} color={color} /> }} />
  </Tabs>;
}
