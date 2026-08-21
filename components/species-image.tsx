import { useState } from "react";
import { Image, Text, View, type ImageStyle, type StyleProp } from "react-native";
import type { Species } from "@/shared/pantanal";

type SpeciesImageProps = {
  image: Species["images"][number];
  style: StyleProp<ImageStyle>;
  label?: string;
};

export function SpeciesImage({ image, style, label = "Imagem indisponível" }: SpeciesImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <View style={[style, { backgroundColor: "#D9E2D9", alignItems: "center", justifyContent: "center", padding: 12 }]} accessibilityRole="image" accessibilityLabel={`${label}. Crédito preservado na ficha da espécie.`}>
        <Text style={{ color: "#1F5D46", fontSize: 12, fontWeight: "800", textAlign: "center" }}>Imagem não carregada</Text>
        <Text style={{ color: "#4A392B", fontSize: 10, marginTop: 4, textAlign: "center" }}>{image.author}</Text>
      </View>
    );
  }

  return <Image source={{ uri: image.uri }} style={style} onError={() => setFailed(true)} accessibilityRole="image" accessibilityLabel={`Fotografia por ${image.credit}`} />;
}
