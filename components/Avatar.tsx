/**
 * PantanalDex — Personagem da pessoa (o do pacote "Equipes e Personagens", demo/index.html):
 * um corpinho arredondado na cor escolhida, dois olhos e um acessório. Decorativo quando o nome já
 * está visível ao lado (é o caso da lista de membros e dos cartões de registro).
 *
 * @author Felipe de Souza Aquino
 */
import React from "react";
import { View } from "react-native";

import { ArtIcon } from "@/components/ArtIcon";
import { AVATAR_TONES, DEFAULT_AVATAR, type Avatar as AvatarData } from "@/shared/team-records";

const INK = "#15231E";

function Eye({ kind, size }: { kind: AvatarData["eyes"]; size: number }) {
  const w = size * 0.125;
  if (kind === "curvos") return <View style={{ width: w * 1.15, height: w * 0.75, borderTopLeftRadius: w, borderTopRightRadius: w, backgroundColor: INK }} />;
  if (kind === "sono") return <View style={{ width: w * 1.2, height: Math.max(2, w * 0.32), borderRadius: w, backgroundColor: INK, marginTop: w * 0.3 }} />;
  return <View style={{ width: w, height: w * 1.15, borderRadius: w, backgroundColor: INK }} />;
}

export function Avatar({ avatar, size = 56, unknown }: { avatar?: AvatarData | null; size?: number; /** Autoria indisponível: silhueta neutra. */ unknown?: boolean }) {
  const a = avatar ?? DEFAULT_AVATAR;
  const tone = unknown ? "#4A4234" : AVATAR_TONES[a.tone];
  const r = size * 0.39;
  return (
    <View style={{ width: size, height: size }} accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <View style={{ width: size, height: size, borderTopLeftRadius: r, borderTopRightRadius: r, borderBottomLeftRadius: r * 0.78, borderBottomRightRadius: r * 0.78, backgroundColor: tone, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
        {/* sombra interna inferior, como no desenho da demo */}
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: size * 0.09, backgroundColor: "rgba(0,0,0,0.13)" }} />
        {!unknown && (
          <View style={{ flexDirection: "row", gap: size * 0.14, alignItems: "flex-start", marginTop: -size * 0.04 }}>
            <Eye kind={a.eyes} size={size} />
            <Eye kind={a.eyes} size={size} />
          </View>
        )}
      </View>
      {!unknown && a.item === "chapeu" && (
        <View style={{ position: "absolute", top: -size * 0.12, left: size * 0.08, right: size * 0.08, alignItems: "center" }}>
          <View style={{ width: size * 0.5, height: size * 0.2, borderTopLeftRadius: size * 0.2, borderTopRightRadius: size * 0.2, backgroundColor: "#E8C26A" }} />
          <View style={{ width: size * 0.84, height: size * 0.08, borderRadius: size * 0.05, backgroundColor: "#D9AE4E" }} />
        </View>
      )}
      {!unknown && a.item === "broche" && (
        <View style={{ position: "absolute", top: size * 0.02, right: size * 0.04, width: size * 0.2, height: size * 0.2, backgroundColor: "#FFC400", transform: [{ rotate: "45deg" }], borderRadius: size * 0.03, borderWidth: 2, borderColor: "#FBF7EF" }} />
      )}
      {!unknown && a.item === "estrela" && <ArtIcon name="brilho" size={size * 0.36} style={{ position: "absolute", top: -size * 0.12, right: -size * 0.08 }} />}
      {!unknown && a.item === "folha" && <ArtIcon name="folhas" size={size * 0.38} style={{ position: "absolute", top: -size * 0.16, right: -size * 0.06 }} />}
    </View>
  );
}
