import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { Avatar } from "@/components/Avatar";
import { RemoteImage } from "@/components/RemoteImage";
import { Text } from "@/components/T";
import { useTeams } from "@/contexts/TeamsContext";
import { useColors } from "@/hooks/use-colors";
import { authorLabel, recordLabel, type TeamRecord } from "@/shared/team-records";

export function TeamRecordCard({ record, onOpen }: { record: TeamRecord; onOpen?: () => void }) {
  const colors = useColors();
  const { photoUrls } = useTeams();
  const [urls, setUrls] = useState<Record<string, string>>({});
  const key = JSON.stringify(onOpen ? record.photoPaths.slice(0, 1) : record.photoPaths);
  useEffect(() => {
    let active = true;
    const paths: string[] = JSON.parse(key);
    void photoUrls(paths).then((next) => { if (active) setUrls(next); });
    return () => { active = false; };
  }, [key, photoUrls]);
  const paths: string[] = JSON.parse(key);

  return <View style={{ borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 14, gap: 12, marginVertical: 8, backgroundColor: colors.surface }}>
    <Text accessibilityRole="header" style={{ color: colors.foreground, fontSize: 20, fontWeight: "800" }}>{recordLabel(record)}</Text>
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <Avatar avatar={record.authorAvatar} unknown={!record.authorId} size={40} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.foreground, fontWeight: "800" }}>{authorLabel(record)}</Text>
        <Text style={{ color: colors.muted }}>{record.observedOn}</Text>
      </View>
    </View>
    {paths.map((path, index) => <RemoteImage key={path} label={`Foto ${index + 1} de ${recordLabel(record)}`} source={urls[path] ? { uri: urls[path] } : undefined}
      style={{ width: "100%", height: 180, borderRadius: 12 }} />)}
    <Text style={{ color: colors.foreground }}>{record.description || "Sem descrição."}</Text>
    {record.zone && <Text style={{ color: colors.muted }}>Zona aproximada (~11 km): {record.zone.lat.toFixed(1)}, {record.zone.lon.toFixed(1)}</Text>}
    {onOpen && <Pressable onPress={onOpen} accessibilityRole="button" style={{ minHeight: 44, justifyContent: "center" }}>
      <Text style={{ color: colors.primary, fontWeight: "800" }}>Abrir {recordLabel(record).toLowerCase()}</Text>
    </Pressable>}
  </View>;
}