/**
 * PantanalDex — Equipes: grupos de campo e de estudo com até 100 pessoas. Criar ou entrar pelo código,
 * progresso e conquistas da equipe, ranking, zonas estudadas (~11 km) e gerenciamento dos membros.
 * Funciona offline com o que ficou guardado; sair da equipe exige digitar o nome dela.
 *
 * @author Felipe de Souza Aquino
 */
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Share, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { Text, TextInput } from "@/components/T";
import { useAuth } from "@/contexts/AuthContext";
import { useTeams } from "@/contexts/TeamsContext";
import { useColors } from "@/hooks/use-colors";
import { Orbit } from "@/components/orbit-effects";
import { findSpeciesById } from "@/shared/catalog";
import {
  computeTeamProgress, formatTeamCode, isValidTeamCode, normalizeTeamCode, TEAM_MAX_MEMBERS, teamAchievements, validateTeamName,
  type TeamInfo, type TeamMember,
} from "@/shared/teams";

const ROLE_LABEL = { owner: "Dono", admin: "Admin", member: "Membro" } as const;
const PRIVACY_NOTE = "A equipe vê seu nome, as espécies que você registrou, quantos avistamentos fez e as zonas de ~11 km onde viu cada uma. Nunca o local exato, notas ou fotos.";

export default function TeamsScreen() {
  const colors = useColors();
  const { account } = useAuth();
  const teams = useTeams();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"none" | "create" | "join">("none");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [leaving, setLeaving] = useState<TeamInfo | null>(null);
  const [confirmName, setConfirmName] = useState("");

  const selected = teams.teams.find((team) => team.id === selectedId) ?? teams.teams[0] ?? null;
  useEffect(() => { if (selected && !teams.overview[selected.id]) void teams.loadOverview(selected.id); }, [selected?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const members: TeamMember[] = selected ? teams.overview[selected.id]?.members ?? [] : [];
  const progress = useMemo(() => computeTeamProgress(members), [members]);
  const achievements = useMemo(() => teamAchievements(progress), [progress]);
  const me = members.find((member) => member.userId === account?.id);
  const canManage = selected?.myRole === "owner" || selected?.myRole === "admin";

  const run = async (task: () => Promise<void>) => { setBusy(true); try { await task(); } finally { setBusy(false); } };

  const submit = () => run(async () => {
    if (mode === "create") {
      const invalid = validateTeamName(input);
      if (invalid) { Alert.alert("Nome da equipe", invalid); return; }
      const result = await teams.create(input);
      if (!result.ok) { Alert.alert("Equipe", result.message); return; }
      Alert.alert("Equipe criada", `Código para os outros entrarem: ${formatTeamCode(result.code ?? "")}\n\n${PRIVACY_NOTE}`);
    } else {
      const code = normalizeTeamCode(input);
      if (!isValidTeamCode(code)) { Alert.alert("Código", "O código tem 8 letras e números (sem I, O, 0 e 1)."); return; }
      const result = await teams.join(code);
      if (!result.ok) { Alert.alert("Equipe", result.message); return; }
      Alert.alert("Pronto", `${result.message ?? ""}\n\n${PRIVACY_NOTE}`);
    }
    setInput("");
    setMode("none");
  });

  const shareCode = (team: TeamInfo) => void Share.share({
    message: `Entre na equipe "${team.name}" no PantanalDex: abra Equipes → Entrar com código e digite ${formatTeamCode(team.code)}`,
  }).catch(() => undefined);

  const manage = (member: TeamMember) => {
    if (!selected || member.userId === account?.id) return;
    const options: { text: string; style?: "destructive" | "cancel"; onPress?: () => void }[] = [];
    const act = (action: "remove" | "admin" | "member" | "owner", done: string) => () => void run(async () => {
      const result = await teams.manage(selected.id, member.userId, action);
      Alert.alert("Equipe", result.ok ? done : result.message);
    });
    if (selected.myRole === "owner" && member.role === "member") options.push({ text: "Tornar admin", onPress: act("admin", `${member.displayName} agora é admin.`) });
    if (selected.myRole === "owner" && member.role === "admin") options.push({ text: "Voltar a membro", onPress: act("member", `${member.displayName} voltou a ser membro.`) });
    if (selected.myRole === "owner") options.push({ text: "Passar a equipe (virar dono)", onPress: act("owner", `${member.displayName} agora é dono da equipe.`) });
    if (member.role !== "owner" && (selected.myRole === "owner" || member.role === "member")) options.push({ text: "Remover da equipe", style: "destructive", onPress: act("remove", `${member.displayName} saiu da equipe.`) });
    if (!options.length) return;
    Alert.alert(member.displayName, ROLE_LABEL[member.role], [...options, { text: "Cancelar", style: "cancel" }]);
  };

  const doLeave = () => run(async () => {
    if (!leaving) return;
    const result = await teams.leave(leaving.id);
    if (!result.ok) { Alert.alert("Equipe", result.message); return; }
    setLeaving(null);
    setConfirmName("");
    setSelectedId(null);
  });

  const card = (children: React.ReactNode, extra: object = {}) => (
    <View style={[{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 12 }, extra]}>{children}</View>
  );
  const button = (label: string, onPress: () => void, primary = false, disabled = false) => (
    <Pressable onPress={onPress} disabled={disabled || busy} accessibilityRole="button" accessibilityState={{ disabled: disabled || busy }}
      style={({ pressed }) => [{ flex: 1, minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: colors.primary, backgroundColor: primary ? colors.primary : colors.surface, alignItems: "center", justifyContent: "center", paddingHorizontal: 10 }, (pressed || disabled) && { opacity: 0.7 }]}>
      <Text style={{ color: primary ? colors.background : colors.primary, fontWeight: "800", textAlign: "center" }}>{label}</Text>
    </Pressable>
  );
  const stat = (value: number | string, label: string) => (
    <View style={{ flex: 1, alignItems: "center" }}><Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "900" }}>{value}</Text><Text style={{ color: colors.muted, fontSize: 12, textAlign: "center" }}>{label}</Text></View>
  );
  const speciesName = (id: string) => findSpeciesById(id)?.commonName ?? id;

  return (
    <ScreenContainer className="px-5">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)" as never))} accessibilityRole="button">
          <Text style={{ color: colors.primary, fontWeight: "700", paddingVertical: 12 }}>‹ Voltar</Text>
        </Pressable>
        <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 28, fontFamily: "Fraunces_700Bold", letterSpacing: -0.5 }}>Equipes</Text>
        <Text style={{ color: colors.muted, marginTop: 4, lineHeight: 20 }}>Grupos de campo e de estudo com até {TEAM_MAX_MEMBERS} pessoas: progresso em conjunto, conquistas e as zonas onde cada espécie foi vista.</Text>

        {!teams.available ? card(<Text style={{ color: colors.foreground }}>Entre na sua conta (com o servidor configurado) para usar equipes.</Text>) : <>
          {teams.offline && <Text style={{ color: colors.warning, marginTop: 10, fontWeight: "700" }}>Sem internet: mostrando o que está guardado no aparelho. Você continua nas suas equipes.</Text>}
          {teams.loading && !teams.teams.length && <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />}

          {teams.teams.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 12 }}>
              {teams.teams.map((team) => {
                const active = team.id === selected?.id;
                return (
                  <Pressable key={team.id} onPress={() => setSelectedId(team.id)} accessibilityRole="tab" accessibilityState={{ selected: active }}
                    style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: colors.primary, backgroundColor: active ? colors.primary : colors.surface }}>
                    <Text style={{ color: active ? colors.background : colors.primary, fontWeight: "800" }}>👥 {team.name} · {team.members}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {teams.teams.length === 0 && !teams.loading && mode === "none" && (
            <View style={{ alignItems: "center", marginTop: 8 }}>
              <Orbit radius={78} items={["🦜", "🐊", "🐆", "🦦", "🐟", "🦩"].map((e) => <Text key={e} style={{ fontSize: 24 }}>{e}</Text>)}
                center={<View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}><Text style={{ fontSize: 28 }}>👥</Text></View>} />
              <Text style={{ color: colors.muted, textAlign: "center", marginTop: 4, lineHeight: 20 }}>Junte sua turma de campo: cada avistamento de cada pessoa soma no progresso da equipe.</Text>
            </View>
          )}

          {mode === "none" ? (
            <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
              {button("Entrar com código", () => { setMode("join"); setInput(""); }, true, teams.teams.length >= 5)}
              {button("Criar equipe", () => { setMode("create"); setInput(""); }, false, teams.teams.length >= 5)}
            </View>
          ) : card(<>
            <Text style={{ color: colors.foreground, fontWeight: "800" }}>{mode === "create" ? "Nome da nova equipe" : "Código da equipe"}</Text>
            <TextInput value={input} onChangeText={setInput} autoFocus placeholder={mode === "create" ? "Ex.: Expedição Poconé 2026" : "ABCD-EF23"}
              autoCapitalize={mode === "join" ? "characters" : "sentences"} maxLength={mode === "join" ? 9 : 40} accessibilityLabel={mode === "create" ? "Nome da equipe" : "Código da equipe"}
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginTop: 8, color: colors.foreground, fontSize: 18, letterSpacing: mode === "join" ? 2 : 0 }} />
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 8, lineHeight: 18 }}>{PRIVACY_NOTE}</Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              {button("Cancelar", () => setMode("none"))}
              {button(mode === "create" ? "Criar" : "Entrar", () => void submit(), true)}
            </View>
          </>)}

          {teams.teams.length >= 5 && <Text style={{ color: colors.muted, fontSize: 12, marginTop: 6 }}>Limite de 5 equipes por pessoa.</Text>}

          {selected && <>
            {card(<>
              <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: "900" }}>{selected.name}</Text>
              <Text style={{ color: colors.muted, marginTop: 2 }}>Você é {ROLE_LABEL[selected.myRole].toLowerCase()} · {selected.members}/{TEAM_MAX_MEMBERS} pessoas</Text>
              <Pressable onPress={() => shareCode(selected)} accessibilityRole="button" accessibilityLabel={`Compartilhar código ${formatTeamCode(selected.code)}`}
                style={{ marginTop: 12, borderRadius: 12, borderWidth: 1, borderStyle: "dashed", borderColor: colors.primary, padding: 12, alignItems: "center" }}>
                <Text style={{ color: colors.muted, fontSize: 12 }}>Código para entrar (toque para compartilhar)</Text>
                <Text style={{ color: colors.primary, fontSize: 28, fontWeight: "900", letterSpacing: 4 }}>{formatTeamCode(selected.code)}</Text>
              </Pressable>
              {selected.myRole === "owner" && <Pressable onPress={() => Alert.alert("Novo código", "O código atual para de funcionar. Quem já está na equipe continua.", [{ text: "Cancelar", style: "cancel" }, { text: "Gerar", onPress: () => void run(async () => { const r = await teams.newCode(selected.id); Alert.alert("Código", r.ok ? `Novo código: ${formatTeamCode(r.code ?? "")}` : r.message); }) }])} accessibilityRole="button">
                <Text style={{ color: colors.primary, fontSize: 13, fontWeight: "700", marginTop: 8, textAlign: "center" }}>Gerar novo código</Text>
              </Pressable>}
            </>)}

            {card(<>
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>PROGRESSO DA EQUIPE</Text>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                {stat(progress.speciesIds.length, "espécies")}
                {stat(progress.sightings, "avistamentos")}
                {stat(progress.zones.length, "zonas")}
                {stat(`${progress.activeMembers}/${progress.members}`, "em campo")}
              </View>
              {me && <Text style={{ color: colors.muted, fontSize: 12, marginTop: 10 }}>Sua parte: {me.speciesIds.length} espécies e {me.sightingsCount} avistamentos{teams.lastSyncedAt ? ` · enviado ${new Date(teams.lastSyncedAt).toLocaleString("pt-BR")}` : ""}.</Text>}
            </>)}

            {card(<>
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>CONQUISTAS DA EQUIPE</Text>
              {achievements.map((item) => (
                <View key={item.id} style={{ marginTop: 10 }} accessible accessibilityLabel={`${item.title}: ${item.current} de ${item.target}${item.unlocked ? ", conquistada" : ""}`}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={{ color: item.unlocked ? colors.primary : colors.foreground, fontWeight: "800" }}>{item.unlocked ? "🏆 " : ""}{item.title}</Text>
                    <Text style={{ color: colors.muted, fontSize: 12 }}>{item.current}/{item.target}</Text>
                  </View>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>{item.description}</Text>
                  <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, marginTop: 4, overflow: "hidden" }}>
                    <View style={{ width: `${Math.round((item.current / item.target) * 100)}%`, height: 6, backgroundColor: item.unlocked ? colors.primary : colors.warning }} />
                  </View>
                </View>
              ))}
            </>)}

            {progress.zones.length > 0 && card(<>
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>ZONAS ESTUDADAS (~11 KM)</Text>
              {progress.zones.slice(0, 12).map((zone) => (
                <View key={`${zone.cellLat}|${zone.cellLon}`} style={{ marginTop: 10 }}>
                  <Text style={{ color: colors.foreground, fontWeight: "800" }}>📍 {Math.abs(zone.cellLat).toFixed(1)}°S {Math.abs(zone.cellLon).toFixed(1)}°O — {zone.species} espécies, {zone.sightings} avistamentos</Text>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>Mais vistas: {zone.topSpecies.map(speciesName).join(", ")}</Text>
                </View>
              ))}
              {progress.zones.length > 12 && <Text style={{ color: colors.muted, fontSize: 12, marginTop: 8 }}>+ {progress.zones.length - 12} zonas</Text>}
            </>)}

            {card(<>
              <Text style={{ color: colors.muted, fontSize: 12, fontWeight: "800" }}>MEMBROS ({members.length})</Text>
              {progress.ranking.map((row, index) => {
                const member = members.find((m) => m.userId === row.userId)!;
                return (
                  <Pressable key={row.userId} onPress={() => canManage && manage(member)} disabled={!canManage || row.userId === account?.id} accessibilityRole={canManage ? "button" : "text"}
                    style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, borderTopWidth: index ? 1 : 0, borderColor: colors.border }}>
                    <Text style={{ width: 28, color: colors.muted, fontWeight: "800" }}>{index + 1}º</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.foreground, fontWeight: "700" }}>{row.displayName}{row.userId === account?.id ? " (você)" : ""}</Text>
                      <Text style={{ color: colors.muted, fontSize: 12 }}>{ROLE_LABEL[member.role]} · {row.species} espécies · {row.sightings} avistamentos</Text>
                    </View>
                    {canManage && row.userId !== account?.id && <Text style={{ color: colors.primary }}>⋯</Text>}
                  </Pressable>
                );
              })}
            </>)}

            <Pressable onPress={() => { setLeaving(selected); setConfirmName(""); }} accessibilityRole="button" style={{ paddingVertical: 18 }}>
              <Text style={{ color: colors.error, textAlign: "center", fontWeight: "700" }}>Sair da equipe</Text>
            </Pressable>
          </>}
        </>}
      </ScrollView>

      <Modal visible={!!leaving} transparent animationType="fade" onRequestClose={() => setLeaving(null)}>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 24 }}>
          <View style={{ backgroundColor: colors.background, borderRadius: 18, padding: 18 }}>
            <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: "900" }}>Sair de “{leaving?.name}”?</Text>
            <Text style={{ color: colors.muted, marginTop: 8, lineHeight: 20 }}>
              {leaving?.myRole === "owner" && (leaving?.members ?? 0) > 1 ? "Você é dono: passe a equipe para outra pessoa (em Membros) antes de sair." : "Para confirmar, digite o nome da equipe. Seus avistamentos continuam no seu aparelho."}
              {leaving?.myRole === "owner" && (leaving?.members ?? 0) <= 1 ? " Como você está sozinho, a equipe será apagada." : ""}
            </Text>
            <TextInput value={confirmName} onChangeText={setConfirmName} placeholder={leaving?.name} accessibilityLabel="Nome da equipe para confirmar"
              style={{ borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginTop: 12, color: colors.foreground }} />
            <View style={{ flexDirection: "row", gap: 8, marginTop: 14 }}>
              {button("Ficar", () => setLeaving(null), true)}
              {button("Sair", () => void doLeave(), false, confirmName.trim().toLowerCase() !== (leaving?.name ?? "").trim().toLowerCase())}
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
