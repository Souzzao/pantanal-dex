/**
 * PantanalDex — Barra de abas inferior: Início, Animais, Registrar, Meus registros e Ajustes.
 *
 * @author Felipe de Souza Aquino
 */
import { router, Tabs } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { FloatingTabBar } from "@/components/FloatingTabBar";
import { useColors } from "@/hooks/use-colors";
import { useApp } from "@/contexts/AppContext";
import { tr } from "@/shared/i18n";

export default function TabLayout() {
  const colors = useColors();
  const { settings } = useApp();
  const labels = settings.defaultLanguage === "English" ? { home: "Home", animals: "Animals", register: "Log", sightings: "My sightings", settings: "Settings" } : settings.defaultLanguage === "Español" ? { home: "Inicio", animals: "Animales", register: "Registrar", sightings: "Mis registros", settings: "Ajustes" } : { home: "Início", animals: "Animais", register: "Registrar", sightings: "Meus registros", settings: "Ajustes" };
  // Barra flutuante própria (components/FloatingTabBar): pílula com indicador animado e Registrar no centro.
  return <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, sceneStyle: { backgroundColor: colors.background } }}>
    <Tabs.Screen name="index" options={{ title: tr(labels.home), tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={24} color={color} /> }} />
    <Tabs.Screen name="animals" options={{ title: tr(labels.animals), tabBarIcon: ({ color }) => <IconSymbol name="pawprint.fill" size={24} color={color} /> }} />
    {/* "Registrar avistamento" separado de "Meus avistamentos": a aba abre o formulário por cima. */}
    <Tabs.Screen name="register" options={{ title: tr(labels.register), tabBarIcon: ({ color }) => <IconSymbol name="plus.circle.fill" size={28} color={color} /> }}
      listeners={{ tabPress: (event) => { event.preventDefault(); router.push("/sightings/new" as never); } }} />
    <Tabs.Screen name="sightings" options={{ title: tr(labels.sightings), tabBarIcon: ({ color }) => <IconSymbol name="mappin.and.ellipse" size={24} color={color} /> }} />
    <Tabs.Screen name="settings" options={{ title: tr(labels.settings), tabBarIcon: ({ color }) => <IconSymbol name="gearshape.fill" size={24} color={color} /> }} />
  </Tabs>;
}
