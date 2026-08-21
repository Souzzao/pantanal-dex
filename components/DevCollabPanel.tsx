import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useColors } from "@/hooks/use-colors";

type CollabState = { account: string; front: string; status: "backlog" | "executing" | "review" | "done"; lastActivity: string };

const INITIAL_STATES: CollabState[] = [
  { account: "Conta 1", front: "Coordenação e Integração", status: "executing", lastActivity: "Criando painel de colaboração" },
  { account: "Conta 2", front: "Conteúdo e Catálogo", status: "backlog", lastActivity: "Lendo handoff" },
  { account: "Conta 3", front: "Avistamentos e Qualidade", status: "backlog", lastActivity: "Lendo handoff" },
];

export function DevCollabPanel() {
  const colors = useColors(); const [visible, setVisible] = useState(false);
  if (!visible) return <Pressable onPress={() => setVisible(true)} style={{ position: "absolute", bottom: 100, right: 20, backgroundColor: colors.primary, width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", elevation: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: .3, shadowRadius: 3 }}><Text style={{ color: "#fff", fontWeight: "800", fontSize: 18 }}>🛠️</Text></Pressable>;
  return <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 9999, padding: 20, justifyContent: "center" }}>
    <View style={{ backgroundColor: colors.surface, borderRadius: 20, maxHeight: "80%", overflow: "hidden", borderWidth: 1, borderColor: colors.border }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 18, borderBottomWidth: 1, borderBottomColor: colors.border }}><Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "800" }}>Painel de Colaboração</Text><Pressable onPress={() => setVisible(false)}><Text style={{ color: colors.primary, fontWeight: "800" }}>Fechar</Text></Pressable></View>
      <ScrollView contentContainerStyle={{ padding: 18 }}>
        <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 16 }}>Este painel é temporário e serve apenas para coordenar as três contas Manus durante o desenvolvimento.</Text>
        {INITIAL_STATES.map((item) => <View key={item.account} style={{ backgroundColor: colors.background, borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}><Text style={{ color: colors.foreground, fontWeight: "800" }}>{item.account}</Text><Text style={{ color: item.status === "executing" ? colors.primary : colors.muted, fontWeight: "700", fontSize: 11, textTransform: "uppercase" }}>{item.status}</Text></View>
          <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "700" }}>{item.front}</Text>
          <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>Atividade: {item.lastActivity}</Text>
        </View>)}
        <View style={{ marginTop: 10, padding: 12, backgroundColor: colors.primary + "10", borderRadius: 12 }}><Text style={{ color: colors.primary, fontWeight: "800", fontSize: 14 }}>Próximo Marco: Ciclo 1</Text><Text style={{ color: colors.foreground, fontSize: 12, marginTop: 4 }}>Expansão do catálogo (Conta 2) + Testes de avistamentos (Conta 3).</Text></View>
      </ScrollView>
    </View>
  </View>;
}
