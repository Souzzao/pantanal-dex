import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Pressable, Text, TextInput } from "@/components/Localized";

import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/use-colors";
import { supabase } from "@/lib/supabase";
import { isDev, isRole, type Role } from "@/shared/auth";

type DevUser = { id: string; email: string; displayName: string; role: Role; createdAt: string; publications: number };
type Stats = { users: number; auditors: number; pending: number; approved: number; rejected: number; reviewsToday: number };

const TEXT = {
  pt: {
    back: "‹ Voltar", title: "Área dev", subtitle: "Contas, papéis e números do PantanalDex.", denied: "Esta área é só para dev.", offline: "Sem internet: a área dev precisa de conexão.", retry: "Tentar de novo",
    stats: { users: "Contas", auditors: "Auditores e devs", pending: "Na pilha", approved: "Aprovados", rejected: "Reprovados", reviewsToday: "Decisões em 24 h" },
    people: "Contas", search: "Buscar por nome ou e-mail", roles: { user: "Usuário", auditor: "Auditor", dev: "Dev" }, publications: (n: number) => `${n} ${n === 1 ? "publicação" : "publicações"}`, you: "você",
    audit: "Abrir auditoria", roleError: "Não foi possível mudar o papel.",
  },
  en: {
    back: "‹ Back", title: "Dev area", subtitle: "PantanalDex accounts, roles and numbers.", denied: "This area is for devs only.", offline: "Offline: the dev area needs a connection.", retry: "Try again",
    stats: { users: "Accounts", auditors: "Reviewers and devs", pending: "In the stack", approved: "Approved", rejected: "Rejected", reviewsToday: "Decisions in 24 h" },
    people: "Accounts", search: "Search by name or email", roles: { user: "User", auditor: "Reviewer", dev: "Dev" }, publications: (n: number) => `${n} ${n === 1 ? "publication" : "publications"}`, you: "you",
    audit: "Open review", roleError: "Could not change the role.",
  },
  es: {
    back: "‹ Volver", title: "Área dev", subtitle: "Cuentas, roles y números de PantanalDex.", denied: "Esta área es solo para dev.", offline: "Sin internet: el área dev necesita conexión.", retry: "Intentar de nuevo",
    stats: { users: "Cuentas", auditors: "Auditores y devs", pending: "En la pila", approved: "Aprobados", rejected: "Rechazados", reviewsToday: "Decisiones en 24 h" },
    people: "Cuentas", search: "Buscar por nombre o correo", roles: { user: "Usuario", auditor: "Auditor", dev: "Dev" }, publications: (n: number) => `${n} ${n === 1 ? "publicación" : "publicaciones"}`, you: "tú",
    audit: "Abrir auditoría", roleError: "No se pudo cambiar el rol.",
  },
} as const;

export default function DevAreaScreen() {
  const colors = useColors();
  const { settings } = useApp();
  const { account, refreshAccount } = useAuth();
  const t = TEXT[settings.defaultLanguage === "English" ? "en" : settings.defaultLanguage === "Español" ? "es" : "pt"];
  const [users, setUsers] = useState<DevUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setFailed(false);
    try {
      const [list, numbers] = await Promise.all([supabase.rpc("dev_list_users"), supabase.rpc("dev_stats")]);
      if (list.error) throw list.error;
      if (numbers.error) throw numbers.error;
      setUsers(((list.data as Record<string, unknown>[]) ?? []).filter((row) => typeof row.id === "string" && isRole(row.role)).map((row) => ({
        id: row.id as string, email: String(row.email ?? ""), displayName: String(row.display_name ?? ""), role: row.role as Role, createdAt: String(row.created_at ?? ""), publications: Number(row.publications ?? 0),
      })));
      const s = ((numbers.data as Record<string, unknown>[]) ?? [])[0] ?? {};
      setStats({ users: Number(s.users ?? 0), auditors: Number(s.auditors ?? 0), pending: Number(s.pending ?? 0), approved: Number(s.approved ?? 0), rejected: Number(s.rejected ?? 0), reviewsToday: Number(s.reviews_today ?? 0) });
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const setRole = async (user: DevUser, role: Role) => {
    if (!supabase || role === user.role) return;
    setSaving(user.id);
    setError(null);
    const { error: rpcError } = await supabase.rpc("dev_set_role", { p_user: user.id, p_role: role });
    setSaving(null);
    if (rpcError) {
      setError(`${t.roleError} ${rpcError.message}`);
      return;
    }
    setUsers((list) => list.map((item) => (item.id === user.id ? { ...item, role } : item)));
    if (user.id === account?.id) void refreshAccount();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? users.filter((item) => item.displayName.toLowerCase().includes(q) || item.email.toLowerCase().includes(q)) : users;
  }, [users, query]);

  if (!isDev(account)) {
    return <ScreenContainer className="px-5"><Text style={{ color: colors.foreground, marginTop: 40, textAlign: "center" }}>{t.denied}</Text></ScreenContainer>;
  }

  return (
    <ScreenContainer className="px-5">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)" as never))} accessibilityRole="button"><Text style={{ color: colors.primary, fontWeight: "700", paddingVertical: 12 }}>{t.back}</Text></Pressable>
        <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 28, fontWeight: "800" }}>{t.title}</Text>
        <Text style={{ color: colors.muted, marginTop: 4 }}>{t.subtitle}</Text>

        {loading ? <ActivityIndicator style={{ marginTop: 30 }} color={colors.primary} /> : failed ? (
          <View style={{ marginTop: 24, alignItems: "center" }}>
            <Text style={{ color: colors.foreground }}>{t.offline}</Text>
            <Pressable onPress={() => void load()} accessibilityRole="button" style={{ padding: 12 }}><Text style={{ color: colors.primary, fontWeight: "800" }}>{t.retry}</Text></Pressable>
          </View>
        ) : (
          <>
            {stats && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                {(Object.keys(t.stats) as (keyof Stats)[]).map((key) => (
                  <View key={key} style={{ width: "31%", flexGrow: 1, backgroundColor: colors.surface, borderColor: key === "pending" && stats.pending > 0 ? colors.warning : colors.border, borderWidth: 1, borderRadius: 14, padding: 10 }}>
                    <Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "900" }}>{stats[key]}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>{t.stats[key]}</Text>
                  </View>
                ))}
              </View>
            )}
            <Pressable onPress={() => router.push("/audit" as never)} accessibilityRole="button" style={{ backgroundColor: colors.primary, borderRadius: 12, padding: 12, marginTop: 12 }}>
              <Text style={{ color: colors.background, fontWeight: "800", textAlign: "center" }}>{t.audit}</Text>
            </Pressable>

            <Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 18, marginTop: 20 }}>{t.people}</Text>
            <TextInput value={query} onChangeText={setQuery} placeholder={t.search} placeholderTextColor={colors.muted} autoCapitalize="none"
              style={{ color: colors.foreground, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 8 }} />
            {error && <Text style={{ color: colors.error, marginTop: 8 }}>{error}</Text>}
            {filtered.map((user) => (
              <View key={user.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 12, marginTop: 8 }}>
                <Text style={{ color: colors.foreground, fontWeight: "800" }}>{user.displayName}{user.id === account?.id ? ` (${t.you})` : ""}</Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>{user.email} · {t.publications(user.publications)}</Text>
                <View style={{ flexDirection: "row", gap: 6, marginTop: 8 }}>
                  {(["user", "auditor", "dev"] as Role[]).map((role) => (
                    <Pressable key={role} onPress={() => void setRole(user, role)} disabled={saving === user.id} accessibilityRole="button" accessibilityState={{ selected: user.role === role }}
                      style={{ flex: 1, minHeight: 44, justifyContent: "center", borderRadius: 10, borderWidth: 1, borderColor: colors.primary, backgroundColor: user.role === role ? colors.primary : colors.background, opacity: saving === user.id ? 0.6 : 1 }}>
                      <Text style={{ color: user.role === role ? colors.background : colors.primary, fontWeight: "800", textAlign: "center", fontSize: 13 }}>{t.roles[role]}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
