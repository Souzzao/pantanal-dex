import { router } from "expo-router";
import { Platform, View } from "react-native";
import { Alert, Pressable, Text } from "@/components/Localized";

import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/use-colors";
import { canAudit, isDev } from "@/shared/auth";

const TEXT = {
  pt: { title: "Sua conta", roles: { user: "Usuário", auditor: "Auditor", dev: "Dev" }, offline: "Sem internet: usando a conta guardada no aparelho", audit: "Auditoria de avistamentos", dev: "Área dev", signOut: "Sair da conta", confirm: "Sair desta conta neste aparelho? Seus avistamentos continuam guardados e voltam quando você entrar de novo.", cancel: "Cancelar", local: "Modo local (servidor não configurado): sem login." },
  en: { title: "Your account", roles: { user: "User", auditor: "Reviewer", dev: "Dev" }, offline: "Offline: using the account saved on this device", audit: "Sightings review", dev: "Dev area", signOut: "Sign out", confirm: "Sign out on this device? Your sightings stay saved and come back when you sign in again.", cancel: "Cancel", local: "Local mode (no server configured): no sign-in." },
  es: { title: "Tu cuenta", roles: { user: "Usuario", auditor: "Auditor", dev: "Dev" }, offline: "Sin internet: usando la cuenta guardada en el dispositivo", audit: "Auditoría de avistamientos", dev: "Área dev", signOut: "Cerrar sesión", confirm: "¿Cerrar sesión en este dispositivo? Tus avistamientos siguen guardados y vuelven al entrar de nuevo.", cancel: "Cancelar", local: "Modo local (servidor no configurado): sin inicio de sesión." },
} as const;

/** Conta, papel e atalhos para auditoria/área dev. Aparece nas Configurações. */
export function AccountCard() {
  const colors = useColors();
  const { settings } = useApp();
  const { status, account, offline, signOut } = useAuth();
  const t = TEXT[settings.defaultLanguage === "English" ? "en" : settings.defaultLanguage === "Español" ? "es" : "pt"];

  if (status === "local") {
    return <Text style={{ color: colors.muted, fontSize: 12, marginTop: 12 }}>{t.local}</Text>;
  }
  if (!account) return null;

  const confirmSignOut = () => {
    if (Platform.OS === "web") {
      // Alert com botões não funciona na web.
      if (typeof window !== "undefined" && window.confirm(t.confirm)) void signOut();
      return;
    }
    Alert.alert(t.signOut, t.confirm, [{ text: t.cancel, style: "cancel" }, { text: t.signOut, style: "destructive", onPress: () => void signOut() }]);
  };

  const link = (label: string, path: string, primary = false) => (
    <Pressable onPress={() => router.push(path as never)} accessibilityRole="button"
      style={({ pressed }) => [{ backgroundColor: primary ? colors.primary : colors.surface, borderColor: colors.primary, borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 8 }, pressed && { opacity: 0.8 }]}>
      <Text style={{ color: primary ? colors.background : colors.primary, fontWeight: "800", textAlign: "center" }}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 14 }}>
      <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700" }}>{t.title}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
        <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: "800", flexShrink: 1 }}>{account.displayName}</Text>
        <View style={{ backgroundColor: account.role === "user" ? colors.border : colors.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
          <Text style={{ color: account.role === "user" ? colors.foreground : colors.background, fontSize: 12, fontWeight: "800" }}>{t.roles[account.role]}</Text>
        </View>
      </View>
      <Text style={{ color: colors.muted, marginTop: 2 }}>{account.email}</Text>
      {offline && <Text style={{ color: colors.warning, fontSize: 12, fontWeight: "700", marginTop: 6 }}>{t.offline}</Text>}
      {canAudit(account) && link(t.audit, "/audit", true)}
      {isDev(account) && link(t.dev, "/dev-area")}
      <Pressable onPress={confirmSignOut} accessibilityRole="button" style={{ paddingVertical: 12, marginTop: 4 }}>
        <Text style={{ color: colors.error, fontWeight: "800", textAlign: "center" }}>{t.signOut}</Text>
      </Pressable>
    </View>
  );
}
