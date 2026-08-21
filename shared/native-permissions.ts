export type NativeLanguage = "Português" | "English" | "Español";
export type NativeFeature = "camera" | "location";
export type PermissionState = "denied" | "services-disabled" | "error";

type PermissionCopy = { title: string; detail: string };

const copy: Record<NativeLanguage, Record<NativeFeature, Record<PermissionState, PermissionCopy>>> = {
  Português: {
    camera: {
      denied: { title: "Câmera não autorizada", detail: "Autorize o acesso à câmera para registrar uma fotografia." },
      "services-disabled": { title: "Câmera indisponível", detail: "A câmera não está disponível neste aparelho. Você ainda pode salvar sem fotografia." },
      error: { title: "Não foi possível abrir a câmera", detail: "Você ainda pode salvar o avistamento sem fotografia." },
    },
    location: {
      denied: { title: "Localização não autorizada", detail: "Você pode salvar o registro sem coordenadas." },
      "services-disabled": { title: "Localização desativada", detail: "Ative o serviço de localização para registrar coordenadas." },
      error: { title: "Não foi possível obter a localização", detail: "Verifique o sinal do aparelho ou salve sem coordenadas." },
    },
  },
  English: {
    camera: {
      denied: { title: "Camera not authorized", detail: "Allow camera access to record a photograph." },
      "services-disabled": { title: "Camera unavailable", detail: "The camera is unavailable on this device. You can save without a photograph." },
      error: { title: "Could not open camera", detail: "You can still save the sighting without a photograph." },
    },
    location: {
      denied: { title: "Location not authorized", detail: "You can save the record without coordinates." },
      "services-disabled": { title: "Location services disabled", detail: "Enable location services to record coordinates." },
      error: { title: "Could not get location", detail: "Check the device signal or save without coordinates." },
    },
  },
  Español: {
    camera: {
      denied: { title: "Cámara no autorizada", detail: "Autoriza el acceso a la cámara para registrar una fotografía." },
      "services-disabled": { title: "Cámara no disponible", detail: "La cámara no está disponible. Puedes guardar sin fotografía." },
      error: { title: "No se pudo abrir la cámara", detail: "Aún puedes guardar el avistamiento sin fotografía." },
    },
    location: {
      denied: { title: "Ubicación no autorizada", detail: "Puedes guardar el registro sin coordenadas." },
      "services-disabled": { title: "Ubicación desactivada", detail: "Activa el servicio de ubicación para registrar coordenadas." },
      error: { title: "No se pudo obtener la ubicación", detail: "Comprueba la señal o guarda sin coordenadas." },
    },
  },
};

export function getNativePermissionCopy(language: NativeLanguage, feature: NativeFeature, state: PermissionState): PermissionCopy {
  return copy[language]?.[feature]?.[state] ?? copy.Português[feature][state];
}
