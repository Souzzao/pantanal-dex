import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/contexts/AppContext";
import { species } from "@/shared/pantanal";
import { useColors } from "@/hooks/use-colors";

export default function MapScreen() {
  const colors = useColors();
  const located = useApp().sightings.filter((item) => item.latitude !== undefined && item.longitude !== undefined);
  return <ScreenContainer className="px-5"><Pressable onPress={() => router.back()}><Text style={{ color: colors.primary, fontWeight: "700", paddingVertical: 14 }}>‹ Voltar</Text></Pressable><Text style={{ color: colors.foreground, fontSize: 28, fontWeight: "800" }}>Mapa de avistamentos</Text><Text style={{ color: colors.muted, marginTop: 5 }}>Visualização dos registros com coordenadas</Text><View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 18, marginTop: 18 }}><Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 17 }}>Mapa nativo no dispositivo</Text><Text style={{ color: colors.muted, lineHeight: 21, marginTop: 8 }}>A prévia web mantém os registros acessíveis em lista. A camada cartográfica será ativada na compilação nativa sem bloquear o uso offline.</Text><Text style={{ color: colors.primary, fontWeight: "800", marginTop: 14 }}>{located.length} registro(s) com localização</Text></View>{located.length === 0 ? <Text style={{ color: colors.muted, marginTop: 24 }}>Nenhum avistamento com coordenadas ainda.</Text> : located.map((item) => { const animal = species.find((entry) => entry.id === item.speciesId); return <Pressable key={item.id} onPress={() => router.push({ pathname: "/sightings/[id]", params: { id: item.id } } as any)} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 12 }}><Text style={{ color: colors.foreground, fontWeight: "800" }}>{animal?.commonName}</Text><Text style={{ color: colors.muted, marginTop: 4 }}>{item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}</Text></Pressable>; })}</ScreenContainer>;
}
