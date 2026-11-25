/**
 * PantanalDex — HUD de captura "câmera primeiro" (pacote Auditoria UX, GUIA-CAMERA-PRIMEIRO.md).
 *
 * Estados: abrindo → visor inicial (só Fechar + obturador) → visor com fotos (Tirar mais, miniatura
 * com contagem, Importar da galeria, Continuar) → revisão dentro do HUD. Sem câmera (recusa ou
 * aparelho sem câmera) o HUD mostra o motivo e já oferece Importar da galeria, para o registro não travar.
 *
 * O lote (rascunho) é do componente pai: trocar de câmera, abrir a galeria, cancelar a galeria ou ir
 * aos detalhes e voltar nunca apaga as fotos. Fechar com fotos pede confirmação de descarte.
 *
 * @author Felipe de Souza Aquino
 */
import { CameraView, useCameraPermissions, type CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, ActivityIndicator, Image, Platform, Pressable, ScrollView, StatusBar, View, useWindowDimensions } from "react-native";
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/Icon";
import { PressableScale, tapFeedback } from "@/components/motion";
import { Text } from "@/components/T";
import { MAX_PHOTOS_PER_SIGHTING } from "@/shared/photo-gallery";
import { MAX_SIGHTING_PHOTO_BYTES, type SightingPhotoInput } from "@/shared/sighting-media";

export type DraftPhoto = { id: string; uri: string; source: "capture" | "import" | "saved"; input?: SightingPhotoInput };

type Props = {
  photos: DraftPhoto[];
  onChange: (next: DraftPhoto[]) => void;
  onContinue: () => void;
  onClose: () => void;
  /** Abre direto na revisão (vindo dos detalhes ao tocar numa foto). */
  startInReview?: boolean;
};

const YELLOW = "#FFC400";
const INK = "#0E0D0B";
const CREAM = "#FBF7EF";
let sequence = 0;
const draftId = () => `foto-${Date.now().toString(36)}-${(sequence++).toString(36)}`;

/** Botão redondo translúcido usado sobre o visor (contraste em fundo claro e escuro). */
function GlassButton({ icon, label, onPress, testID, active }: { icon: React.ComponentProps<typeof Icon>["name"]; label: string; onPress: () => void; testID?: string; active?: boolean }) {
  return (
    <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={label} testID={testID} scaleTo={0.9}
      style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: active ? YELLOW : "rgba(14,13,11,0.62)", borderWidth: 1, borderColor: "rgba(251,247,239,0.18)", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={22} color={active ? INK : CREAM} mono={active} />
    </PressableScale>
  );
}

export function CaptureHud({ photos, onChange, onContinue, onClose, startInReview }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [permission, requestPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const reviewScroll = useRef<ScrollView>(null);
  const operation = useRef(false);
  const mounted = useRef(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState(false);
  const [ready, setReady] = useState(false);
  const [cameraError, setCameraError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string>();
  const [review, setReview] = useState(!!startInReview && photos.length > 0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [confirmClose, setConfirmClose] = useState(false);
  const asked = useRef(false);
  const count = photos.length;
  const full = count >= MAX_PHOTOS_PER_SIGHTING;

  // Permissão pedida no contexto (ao abrir o HUD), uma vez; com acesso válido o visor aparece sozinho.
  useEffect(() => {
    if (!permission || permission.granted || asked.current || !permission.canAskAgain) return;
    asked.current = true;
    void requestPermission().catch(() => setCameraError("Não foi possível pedir acesso à câmera."));
  }, [permission, requestPermission]);

  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(undefined), 3200); return () => clearTimeout(t); }, [notice]);

  const flashOverlay = useSharedValue(0);
  const thumbPop = useSharedValue(1);
  const flashStyle = useAnimatedStyle(() => ({ opacity: flashOverlay.value }));
  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ scale: thumbPop.value }] }));

  const announce = (n: number) => AccessibilityInfo.announceForAccessibility(n === 1 ? "1 foto no registro" : `${n} fotos no registro`);

  const add = (items: DraftPhoto[]) => {
    if (!mounted.current || !items.length) return;
    const next = [...photos, ...items].slice(0, MAX_PHOTOS_PER_SIGHTING);
    onChange(next);
    announce(next.length);
    if (!reducedMotion) thumbPop.value = withSequence(withSpring(1.18, { damping: 8, stiffness: 320 }), withSpring(1));
  };

  const capture = async () => {
    if (operation.current || full || !camera.current) return;
    operation.current = true;
    setBusy(true);
    tapFeedback("medium");
    if (!reducedMotion) flashOverlay.value = withSequence(withTiming(0.85, { duration: 60 }), withTiming(0, { duration: 260 }));
    try {
      const shot = await camera.current.takePictureAsync({ quality: 0.8, exif: false });
      if (shot?.uri) add([{ id: draftId(), uri: shot.uri, source: "capture", input: { uri: shot.uri, mimeType: "image/jpeg" } }]);
    } catch {
      setNotice("Não foi possível tirar a foto. Tente de novo ou importe da galeria.");
    } finally {
      operation.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const importFromGallery = async () => {
    if (operation.current) return;
    if (full) { setNotice(`Limite de ${MAX_PHOTOS_PER_SIGHTING} fotos por registro.`); return; }
    operation.current = true;
    setBusy(true);
    tapFeedback("light");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], allowsMultipleSelection: true, selectionLimit: MAX_PHOTOS_PER_SIGHTING - count,
        quality: 0.8, base64: Platform.OS === "web", exif: false,
      });
      if (result.canceled) return; // cancelar volta ao mesmo HUD com o lote intacto
      const valid: DraftPhoto[] = [];
      let refused = 0;
      for (const asset of result.assets) {
        if (!asset.uri || (asset.fileSize && asset.fileSize > MAX_SIGHTING_PHOTO_BYTES)) { refused += 1; continue; }
        const uri = Platform.OS === "web" && asset.base64 ? `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}` : asset.uri;
        valid.push({ id: draftId(), uri, source: "import", input: { ...asset, uri } });
      }
      add(valid);
      if (refused) setNotice(refused === 1 ? "1 imagem acima de 10 MB ficou de fora. As outras foram adicionadas." : `${refused} imagens acima de 10 MB ficaram de fora. As outras foram adicionadas.`);
    } catch {
      setNotice("Não foi possível abrir a galeria. Tente novamente.");
    } finally {
      operation.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  const remove = (id: string) => {
    const next = photos.filter((p) => p.id !== id);
    onChange(next);
    announce(next.length);
    if (!next.length) setReview(false);
    else setReviewIndex((i) => Math.min(i, next.length - 1));
  };

  const close = () => (count ? setConfirmClose(true) : onClose());

  const granted = permission?.granted === true;
  const blocked = permission && !permission.granted && (!permission.canAskAgain || asked.current) && permission.status === "denied";
  const opening = !permission || (!granted && !blocked);
  const unavailable = blocked || !!cameraError;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }} testID="capture-hud">
      <StatusBar barStyle="light-content" />
      {granted && !cameraError && (
        <CameraView ref={camera} style={{ position: "absolute", top: 0, left: 0, width, height }} facing={facing} enableTorch={false} flash={flash ? "on" : "off"}
          onCameraReady={() => setReady(true)} onMountError={(e) => setCameraError(e.message || "A câmera não abriu neste aparelho.")} accessibilityLabel="Visor da câmera" testID="camera-preview" />
      )}
      <Animated.View pointerEvents="none" style={[{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#fff" }, flashStyle]} />

      {/* Topo: Fechar sempre à esquerda; flash e troca de câmera só quando existem. */}
      <View style={{ position: "absolute", top: insets.top + 10, left: 16, right: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <GlassButton icon="close" label={count ? "Fechar câmera (pede para confirmar o descarte)" : "Fechar câmera"} onPress={close} testID="camera-close" />
        {granted && !cameraError && (
          <View style={{ flexDirection: "row", gap: 10 }}>
            {Platform.OS !== "web" && <GlassButton icon={flash ? "flash" : "flash-off"} label={flash ? "Desligar flash" : "Ligar flash"} onPress={() => setFlash((v) => !v)} active={flash} />}
            <GlassButton icon="flip" label="Trocar câmera" onPress={() => { setReady(false); setFacing((f) => (f === "back" ? "front" : "back")); }} />
          </View>
        )}
      </View>

      {opening && !unavailable && (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }} accessibilityLiveRegion="polite">
          <ActivityIndicator color={YELLOW} />
          <Text style={{ color: CREAM, marginTop: 12, fontWeight: "700" }}>Abrindo câmera…</Text>
        </View>
      )}
      {granted && !cameraError && !ready && (
        <View pointerEvents="none" style={{ position: "absolute", top: height / 2 - 20, left: 0, right: 0, alignItems: "center" }}>
          <Text style={{ color: "rgba(251,247,239,0.8)", fontWeight: "700" }}>Preparando o visor…</Text>
        </View>
      )}
      {unavailable && (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }} accessibilityLiveRegion="polite">
          <Icon name="camera" size={44} color={CREAM} />
          <Text style={{ color: CREAM, fontSize: 20, fontFamily: "Fraunces_700Bold", marginTop: 14, textAlign: "center" }}>Câmera indisponível</Text>
          <Text style={{ color: "#B8B0A2", marginTop: 6, textAlign: "center" }}>
            {cameraError ?? "O acesso à câmera foi recusado. Você pode liberar nas configurações do aparelho ou começar importando fotos da galeria."}
          </Text>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}>
            {(permission?.canAskAgain || cameraError) && (
              <PressableScale onPress={() => { setCameraError(undefined); void requestPermission().catch(() => setCameraError("Não foi possível pedir acesso à câmera.")); }} accessibilityRole="button" accessibilityLabel="Tentar abrir a câmera de novo"
                style={{ paddingHorizontal: 16, paddingVertical: 12, borderRadius: 999, borderWidth: 1, borderColor: "rgba(251,247,239,0.3)" }}>
                <Text style={{ color: CREAM, fontWeight: "800" }}>Tentar de novo</Text>
              </PressableScale>
            )}
          </View>
        </View>
      )}

      {!!notice && (
        <View pointerEvents="none" style={{ position: "absolute", top: insets.top + 70, left: 20, right: 20, alignItems: "center" }} accessibilityLiveRegion="polite">
          <Text style={{ color: CREAM, backgroundColor: "rgba(14,13,11,0.85)", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, overflow: "hidden", textAlign: "center" }}>{notice}</Text>
        </View>
      )}

      {/* Base: obturador ao centro; com fotos aparecem miniatura (revisar), Importar e Continuar. */}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, paddingBottom: insets.bottom + 18, paddingTop: 18, backgroundColor: "rgba(14,13,11,0.35)" }}>
        <Text testID="camera-photo-count" accessibilityLiveRegion="polite" style={{ color: CREAM, textAlign: "center", fontWeight: "800", marginBottom: 12, opacity: count ? 1 : 0 }}>
          {count === 1 ? "1 foto" : `${count} fotos`}{full ? " · limite atingido" : ""}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 22 }}>
          <View style={{ width: 92, alignItems: "flex-start" }}>
            {count > 0 ? (
              <Animated.View style={thumbStyle}>
                <Pressable onPress={() => { setReviewIndex(count - 1); setReview(true); }} accessibilityRole="button" accessibilityLabel={`Revisar ${count === 1 ? "1 foto" : `${count} fotos`}`} testID="camera-review"
                  style={{ width: 58, height: 58, borderRadius: 16, borderWidth: 2, borderColor: CREAM, overflow: "hidden" }}>
                  <Image source={{ uri: photos[count - 1].uri }} style={{ width: "100%", height: "100%" }} accessibilityIgnoresInvertColors />
                  <View style={{ position: "absolute", right: 3, bottom: 3, minWidth: 22, height: 22, borderRadius: 11, backgroundColor: YELLOW, alignItems: "center", justifyContent: "center", paddingHorizontal: 5 }}>
                    <Text style={{ color: INK, fontWeight: "900", fontSize: 12 }}>{count}</Text>
                  </View>
                </Pressable>
              </Animated.View>
            ) : unavailable ? null : <View style={{ width: 58 }} />}
          </View>

          {granted && !cameraError ? (
            <PressableScale onPress={() => void capture()} disabled={busy || full || !ready} haptic={false} scaleTo={0.9} accessibilityRole="button"
              accessibilityLabel={count ? "Tirar mais uma foto" : "Tirar foto"} accessibilityState={{ disabled: busy || full || !ready }} testID="camera-shutter"
              style={{ width: 82, height: 82, borderRadius: 41, borderWidth: 5, borderColor: CREAM, alignItems: "center", justifyContent: "center", opacity: full || !ready ? 0.5 : 1 }}>
              <View style={{ width: 62, height: 62, borderRadius: 31, backgroundColor: count ? YELLOW : CREAM, alignItems: "center", justifyContent: "center" }}>
                {count > 0 && <Icon name="plus" size={26} color={INK} mono strokeWidth={2.4} />}
              </View>
            </PressableScale>
          ) : (
            <View style={{ width: 82 }} />
          )}

          <View style={{ width: 92, alignItems: "flex-end" }}>
            {count > 0 && (
              <PressableScale onPress={onContinue} disabled={busy} accessibilityRole="button" accessibilityLabel="Continuar para os detalhes do registro" testID="camera-continue"
                style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: YELLOW, borderRadius: 999, paddingLeft: 14, paddingRight: 10, height: 46 }}>
                <Text style={{ color: INK, fontWeight: "900" }}>Continuar</Text>
                <Icon name="chevron-right" size={18} color={INK} mono strokeWidth={2.4} />
              </PressableScale>
            )}
          </View>
        </View>
        {(count > 0 || unavailable) && (
          <View style={{ alignItems: "center", marginTop: 14 }}>
            <PressableScale onPress={() => void importFromGallery()} disabled={busy} accessibilityRole="button" accessibilityLabel="Importar fotos da galeria" testID="camera-import"
              style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, height: 44, borderRadius: 999, backgroundColor: unavailable ? YELLOW : "rgba(14,13,11,0.62)", borderWidth: 1, borderColor: "rgba(251,247,239,0.2)" }}>
              <Icon name="image" size={20} color={unavailable ? INK : CREAM} mono={unavailable} />
              <Text style={{ color: unavailable ? INK : CREAM, fontWeight: "800" }}>Importar da galeria</Text>
            </PressableScale>
          </View>
        )}
      </View>

      {/* Revisão dentro do HUD: ampliar e remover; fechar volta ao visor. */}
      {review && count > 0 && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(8,7,6,0.97)" }} accessibilityViewIsModal testID="camera-review-layer">
          <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <GlassButton icon="arrow-left" label="Fechar revisão e voltar à câmera" onPress={() => setReview(false)} testID="camera-review-close" />
            <Text style={{ color: CREAM, fontWeight: "800" }}>{reviewIndex + 1} de {count}</Text>
            <GlassButton icon="trash" label={`Remover a foto ${reviewIndex + 1}`} onPress={() => remove(photos[reviewIndex].id)} testID="camera-review-remove" />
          </View>
          <ScrollView ref={reviewScroll} horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentOffset={{ x: reviewIndex * width, y: 0 }}
            onMomentumScrollEnd={(e) => setReviewIndex(Math.round(e.nativeEvent.contentOffset.x / width))} style={{ flex: 1 }}>
            {photos.map((p, i) => (
              <View key={p.id} style={{ width, alignItems: "center", justifyContent: "center", padding: 16 }}>
                <Image source={{ uri: p.uri }} resizeMode="contain" style={{ width: width - 32, height: height * 0.62 }} accessibilityLabel={`Foto ${i + 1} de ${count}${p.source === "import" ? ", importada" : ""}`} />
              </View>
            ))}
          </ScrollView>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 8, paddingVertical: 12 }}>
            {photos.map((p, i) => (
              <Pressable key={p.id} onPress={() => { setReviewIndex(i); reviewScroll.current?.scrollTo({ x: i * width, animated: !reducedMotion }); }} accessibilityRole="button" accessibilityLabel={`Ver foto ${i + 1}`}
                style={{ width: 46, height: 46, borderRadius: 12, overflow: "hidden", borderWidth: 2, borderColor: i === reviewIndex ? YELLOW : "transparent" }}>
                <Image source={{ uri: p.uri }} style={{ width: "100%", height: "100%" }} />
              </Pressable>
            ))}
          </View>
          <View style={{ paddingBottom: insets.bottom + 16, alignItems: "center" }}>
            <PressableScale onPress={() => setReview(false)} accessibilityRole="button" accessibilityLabel="Voltar para a câmera"
              style={{ paddingHorizontal: 20, height: 46, borderRadius: 999, borderWidth: 1, borderColor: "rgba(251,247,239,0.3)", justifyContent: "center" }}>
              <Text style={{ color: CREAM, fontWeight: "800" }}>Voltar para a câmera</Text>
            </PressableScale>
          </View>
        </View>
      )}

      {/* Confirmação de descarte (dentro do HUD, funciona também na web). */}
      {confirmClose && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }} accessibilityViewIsModal testID="camera-discard">
          <View style={{ backgroundColor: "#1A1815", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, paddingBottom: insets.bottom + 22, borderWidth: 1, borderColor: "#2F2B25" }}>
            <Text style={{ color: CREAM, fontSize: 20, fontFamily: "Fraunces_700Bold" }}>Descartar {count === 1 ? "a foto" : `as ${count} fotos`}?</Text>
            <Text style={{ color: "#B8B0A2", marginTop: 6 }}>O registro ainda não foi salvo. Se sair agora, as fotos deste lote serão descartadas.</Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}>
              <PressableScale onPress={() => setConfirmClose(false)} accessibilityRole="button" accessibilityLabel="Continuar fotografando" testID="camera-discard-cancel"
                style={{ flex: 1, height: 48, borderRadius: 14, borderWidth: 1, borderColor: "#4A4234", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: CREAM, fontWeight: "800" }}>Continuar aqui</Text>
              </PressableScale>
              <PressableScale onPress={() => { setConfirmClose(false); onClose(); }} accessibilityRole="button" accessibilityLabel="Descartar fotos e sair" testID="camera-discard-confirm"
                style={{ flex: 1, height: 48, borderRadius: 14, backgroundColor: "#E5484D", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#fff", fontWeight: "900" }}>Descartar</Text>
              </PressableScale>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
