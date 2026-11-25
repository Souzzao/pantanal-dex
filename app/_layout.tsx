/**
 * PantanalDex — Layout raiz: provedores de conta, preferências, publicações e tema; portão de login e escopo de idioma.
 *
 * @author Felipe de Souza Aquino
 */
import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { ActivityIndicator, Platform, View } from "react-native";
import { useColors } from "@/hooks/use-colors";
import "@/lib/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginScreen } from "@/components/LoginScreen";
import { TeamsProvider } from "@/contexts/TeamsContext";
import { DiscoveryToast } from "@/components/DiscoveryToast";
import { PublicationsProvider } from "@/contexts/PublicationsContext";
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Rect } from "react-native-safe-area-context";

import { installAlertTranslation } from "@/lib/translate-alerts";
import { useFonts, Fraunces_700Bold, Fraunces_600SemiBold_Italic } from "@expo-google-fonts/fraunces";

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const unstable_settings = {
  anchor: "(tabs)",
};

installAlertTranslation();

export default function RootLayout() {
  // Fonte de destaque dos títulos (Fraunces, licença OFL). Até carregar, os títulos usam a fonte do sistema.
  useFonts({ Fraunces_700Bold, Fraunces_600SemiBold_Italic });
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;

  const [insets] = useState<EdgeInsets>(initialInsets);
  const [frame] = useState<Rect>(initialFrame);

  // Ensure minimum 8px padding for top and bottom on mobile
  const providerInitialMetrics = useMemo(() => {
    const metrics = initialWindowMetrics ?? {
      insets: initialInsets,
      frame: initialFrame,
    };
    return {
      ...metrics,
      insets: {
        ...metrics.insets,
        top: Math.max(metrics.insets.top, 16),
        bottom: Math.max(metrics.insets.bottom, 12),
      },
    };
  }, [initialInsets, initialFrame]);

  const content = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Cabeçalhos nativos ficam ocultos: cada tela desenha o próprio título. */}
          <AuthGate>
            <PublicationsProvider>
            <LanguageScope>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
            </Stack>
            </LanguageScope>
            <DiscoveryToast />
            </PublicationsProvider>
          </AuthGate>
          <StatusBar style="light" />
    </GestureHandlerRootView>
  );

  const shouldOverrideSafeArea = Platform.OS === "web";

  if (shouldOverrideSafeArea) {
    return (
      <AuthProvider>
      <AccountScopedApp>
        <ThemeProvider>
          <SafeAreaProvider initialMetrics={providerInitialMetrics}>
            <SafeAreaFrameContext.Provider value={frame}>
              <SafeAreaInsetsContext.Provider value={insets}>
                {content}
              </SafeAreaInsetsContext.Provider>
            </SafeAreaFrameContext.Provider>
          </SafeAreaProvider>
        </ThemeProvider>
      </AccountScopedApp>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
    <AccountScopedApp>
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={providerInitialMetrics}>
          {content}
        </SafeAreaProvider>
      </ThemeProvider>
    </AccountScopedApp>
    </AuthProvider>
  );
}

/** Cada conta tem o próprio caderno: trocar de conta recarrega os dados daquela conta. */
function AccountScopedApp({ children }: { children: React.ReactNode }) {
  const { account } = useAuth();
  const namespace = account?.id;
  return <AppProvider key={namespace ?? "local"} storageNamespace={namespace}><TeamsProvider>{children}</TeamsProvider></AppProvider>;
}

/** Trocar o idioma remonta as telas, para que todos os textos e fichas saiam no idioma novo. */
function LanguageScope({ children }: { children: React.ReactNode }) {
  const { settings } = useApp();
  return <React.Fragment key={settings.defaultLanguage}>{children}</React.Fragment>;
}

/** Login obrigatório: sem conta aberta, mostra a tela de entrar. */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { status, account } = useAuth();
  const colors = useColors();
  if (status === "loading") {
    return <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}><ActivityIndicator color={colors.primary} size="large" /></View>;
  }
  if (status === "signedOut") return <LoginScreen />;
  // A chave remonta as telas e os dados ao trocar de conta.
  return <React.Fragment key={account?.id ?? "local"}>{children}</React.Fragment>;
}
