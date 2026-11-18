/**
 * PantanalDex — Seletor de cadernos (Todos, Principal, Teste, criados e importados) com a quantidade
 * de registros de cada um e atalho para o gerenciamento.
 *
 * @author Felipe de Souza Aquino
 */
import { router } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { Text } from "@/components/T";
import { useApp } from "@/contexts/AppContext";
import { useColors } from "@/hooks/use-colors";
import { countByNotebook, type NotebookKind } from "@/shared/notebooks";

export const NOTEBOOK_ICON: Record<NotebookKind, string> = { main: "📔", test: "🧪", custom: "📒", imported: "📥" };

export function NotebookBar({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const colors = useColors();
  const { notebooks, sightings, activeNotebookId } = useApp();
  const counts = useMemo(() => countByNotebook(sightings), [sightings]);
  const chip = (id: string, label: string, count: number, active: boolean) => (
    <Pressable
      key={id}
      onPress={() => onSelect(id)}
      accessibilityRole="radio"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${label}, ${count} registros`}
      style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: active ? colors.primary : colors.surface, borderColor: active ? colors.primary : colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 }}
    >
      <Text style={{ color: active ? colors.background : colors.foreground, fontWeight: "800", fontSize: 12 }}>{label}</Text>
      <View style={{ backgroundColor: active ? colors.background : colors.border, borderRadius: 9, paddingHorizontal: 6, minWidth: 18, alignItems: "center" }}>
        <Text style={{ color: active ? colors.primary : colors.foreground, fontWeight: "800", fontSize: 11 }}>{count}</Text>
      </View>
    </Pressable>
  );
  return (
    <View style={{ marginTop: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "700" }}>CADERNOS</Text>
        <Pressable onPress={() => router.push("/notebooks" as never)} accessibilityRole="button" accessibilityLabel="Gerenciar cadernos" style={{ paddingVertical: 4, paddingHorizontal: 6 }}>
          <Text style={{ color: colors.primary, fontWeight: "800", fontSize: 12 }}>Gerenciar ›</Text>
        </Pressable>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {chip("all", "Todos", sightings.length, selected === "all")}
        {notebooks.map((item) => chip(item.id, `${NOTEBOOK_ICON[item.kind]} ${item.name}${item.id === activeNotebookId ? " •" : ""}`, counts[item.id] ?? 0, selected === item.id))}
      </ScrollView>
    </View>
  );
}
