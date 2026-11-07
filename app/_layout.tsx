import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { ActivityIndicator, Platform, View } from "react-native";
import { useColors } from "@/hooks/use-colors";
import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginScreen } from "@/components/LoginScreen";
import { DevCollabPanel } from "@/components/DevCollabPanel";
import { DiscoveryToast } from "@/components/DiscoveryToast";
import { PublicationsProvider } from "@/contexts/PublicationsContext";
import {
  SafeAreaFrameContext,
  SafeAreaInsetsContext,
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";

import { trpc, createTRPCClient } from "@/lib/trpc";
import {
  initManusRuntime,
  subscribeSafeAreaInsets,
} from "@/lib/_core/manus-runtime";

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;

  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);

  // Initialize Manus runtime for cookie injection from parent container
  useEffect(() => {
    initManusRuntime();
  }, []);

  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => {
    setInsets(metrics.insets);
    setFrame(metrics.frame);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const unsubscribe = subscribeSafeAreaInsets(handleSafeAreaUpdate);
    return () => unsubscribe();
  }, [handleSafeAreaUpdate]);

  // Create clients once and reuse them
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Disable automatic refetching on window focus for mobile
            refetchOnWindowFocus: false,
            // Retry failed requests once
            retry: 1,
          },
        },
      }),
  );
  const [trpcClient] = useState(() => createTRPCClient());

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
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {/* Default to hiding native headers so raw route segments don't appear (e.g. "(tabs)", "products/[id]"). */}
          {/* If a screen needs the native header, explicitly enable it and set a human title via Stack.Screen options. */}
          {/* in order for ios apps tab switching to work properly, use presentation: "fullScreenModal" for login page, whenever you decide to use presentation: "modal*/}
          <AuthGate>
            <PublicationsProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="oauth/callback" />
            </Stack>
            <DiscoveryToast />
            </PublicationsProvider>
          </AuthGate>
          <StatusBar style="auto" />
          {__DEV__ && Platform.OS !== "web" && typeof window !== "undefined" && <DevCollabPanel />}
        </QueryClientProvider>
      </trpc.Provider>
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
  return <AppProvider key={namespace ?? "local"} storageNamespace={namespace}>{children}</AppProvider>;
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
