import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { TeamRecordCard } from "@/components/TeamRecordCard";
import { Text, TextInput } from "@/components/T";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/contexts/TeamsContext";
import { useColors } from "@/hooks/use-colors";
import { findSpeciesById } from "@/shared/catalog";

export default function TeamRecordScreen() {
  const { teamId, id } = useLocalSearchParams<{ teamId: string; id: string }>();
  const teams = useTeams();
  const { account } = useAuth();
  const colors = useColors();
  const [draft, setDraft] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const team = teams.teams.find((item) => item.id === teamId);
  const record = team && teams.records[team.id]?.items.find((item) => item.id === id);
  const own = !!record && !!account && record.authorId === account.id;
  const goBack = () => router.canGoBack() ? router.back() : router.replace("/teams");
  const action = (label: string, onPress: () => void, danger = false) =>
    <Pressable accessibilityRole="button" disabled={busy} onPress={onPress} style={{ minHeight: 44, paddingVertical: 10 }}>
      <Text style={{ color: danger ? colors.error : colors.primary, fontWeight: "800" }}>{label}</Text>
    </Pressable>;
  const save = async () => {
    if (!record || draft === null) return;
    setBusy(true);
    try {
      const result = await teams.editRecord(teamId, record.id, draft);
      if (result.ok) setDraft(null);
      else Alert.alert("Registro da equipe", result.message);
    } finally { setBusy(false); }
  };
  const remove = () => {
    if (!record) return;
    Alert.alert("Excluir registro da equipe?", "O registro será removido da coleção da equipe.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: async () => {
        setBusy(true);
        try {
          const result = await teams.removeRecord(teamId, record.id);
          if (result.ok) goBack();
          else Alert.alert("Registro da equipe", result.message);
        } finally { setBusy(false); }
      } },
    ]);
  };
  return <ScreenContainer className="px-5">
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      {action("‹ Voltar", goBack)}
      {record ? <>
        <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 28, fontFamily: "Fraunces_700Bold" }}>{findSpeciesById(record.speciesId)?.commonName ?? "Espécie não identificada"}</Text>
        <TeamRecordCard record={record} />
        {own && (draft === null ? action("Editar descrição", () => setDraft(record.description)) : <>
          <TextInput accessibilityLabel="Descrição do registro" value={draft} onChangeText={setDraft} editable={!busy} multiline maxLength={500}
            style={{ color: colors.foreground, minHeight: 80, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 12 }} />
          {action("Salvar descrição", () => void save())}
          {action("Cancelar edição", () => setDraft(null))}
        </>)}
        {(own || team?.myRole === "admin" || team?.myRole === "owner") && action("Excluir da equipe", remove, true)}
      </> : <Text style={{ color: colors.muted }}>Registro indisponível.</Text>}
    </ScrollView>
  </ScreenContainer>;
}