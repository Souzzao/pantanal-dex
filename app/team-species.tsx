import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { TeamRecordCard } from "@/components/TeamRecordCard";
import { Text } from "@/components/T";
import { useTeams } from "@/contexts/TeamsContext";
import { useColors } from "@/hooks/use-colors";
import { findSpeciesById } from "@/shared/catalog";
import { recordsOfSpecies } from "@/shared/team-records";

export default function TeamSpeciesScreen() {
  const { teamId, speciesId } = useLocalSearchParams<{ teamId: string; speciesId: string }>();
  const teams = useTeams();
  const colors = useColors();
  const team = teams.teams.find((item) => item.id === teamId);
  const records = team ? recordsOfSpecies(teams.records[team.id]?.items ?? [], speciesId) : [];
  return <ScreenContainer className="px-5">
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      <Pressable accessibilityRole="button" onPress={() => router.canGoBack() ? router.back() : router.replace("/teams")} style={{ paddingVertical: 14 }}><Text style={{ color: colors.primary }}>‹ Voltar</Text></Pressable>
      <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 28, fontFamily: "Fraunces_700Bold" }}>{findSpeciesById(speciesId)?.commonName ?? "Espécie não identificada"}</Text>
      <Text style={{ color: colors.muted }}>{team ? `${team.name} · ${records.length} registro(s)` : "Equipe indisponível."}</Text>
      {team && records.length === 0 && <Text style={{ color: colors.muted }}>Nenhum registro disponível.</Text>}
      {records.map((record) => <TeamRecordCard key={record.id} record={record} onOpen={() => router.push({ pathname: "/team-record", params: { teamId, id: record.id } })} />)}
    </ScrollView>
  </ScreenContainer>;
}