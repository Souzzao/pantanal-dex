export type NativeLanguage = "Português" | "English" | "Español";
export type NativeFeature = "camera" | "location";
export type PermissionState = "denied" | "services-disabled" | "error";

type PermissionCopy = { title: string; detail: string };

const copy: Record<NativeLanguage, Record<NativeFeature, Record<PermissionState, PermissionCopy>>> = {
  Português: {
    camera: {
      denied: { title: "Câmera não autorizada", detail: "Autorize o acesso à câmera para registrar uma fotografia." },
      "services-disabled": { title: "Câmera indisponível", detail: "A câmera não está disponível neste aparelho. Escolha uma fotografia pela galeria." },
      error: { title: "Não foi possível abrir a câmera", detail: "Escolha uma fotografia pela galeria para completar o registro." },
    },
    location: {
      denied: { title: "Localização não autorizada", detail: "Escolha o local do avistamento manualmente no mapa." },
      "services-disabled": { title: "Localização desativada", detail: "Ative o serviço de localização para registrar coordenadas." },
      error: { title: "Não foi possível obter a localização", detail: "Verifique o sinal do aparelho ou escolha o ponto manualmente no mapa." },
    },
  },
  English: {
    camera: {
      denied: { title: "Camera not authorized", detail: "Allow camera access to record a photograph." },
      "services-disabled": { title: "Camera unavailable", detail: "The camera is unavailable. Choose a photograph from the gallery." },
      error: { title: "Could not open camera", detail: "Choose a photograph from the gallery to complete the record." },
    },
    location: {
      denied: { title: "Location not authorized", detail: "Choose the sighting location manually on the map." },
      "services-disabled": { title: "Location services disabled", detail: "Enable location services to record coordinates." },
      error: { title: "Could not get location", detail: "Check the device signal or choose the point manually on the map." },
    },
  },
  Español: {
    camera: {
      denied: { title: "Cámara no autorizada", detail: "Autoriza el acceso a la cámara para registrar una fotografía." },
      "services-disabled": { title: "Cámara no disponible", detail: "La cámara no está disponible. Elige una fotografía de la galería." },
      error: { title: "No se pudo abrir la cámara", detail: "Elige una fotografía de la galería para completar el registro." },
    },
    location: {
      denied: { title: "Ubicación no autorizada", detail: "Elige el lugar del avistamiento manualmente en el mapa." },
      "services-disabled": { title: "Ubicación desactivada", detail: "Activa el servicio de ubicación para registrar coordenadas." },
      error: { title: "No se pudo obtener la ubicación", detail: "Comprueba la señal o elige el punto manualmente en el mapa." },
    },
  },
};

export function getNativePermissionCopy(language: NativeLanguage, feature: NativeFeature, state: PermissionState): PermissionCopy {
  return copy[language]?.[feature]?.[state] ?? copy.Português[feature][state];
}
