export const MAX_SIGHTING_PHOTO_BYTES = 10 * 1024 * 1024;
export const SIGHTING_PHOTO_DIRECTORY = "pantanal-dex/photos/";

export type SightingPhotoInput = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  fileSize?: number;
};

export type SightingPhotoFileInfo = {
  exists: boolean;
  isDirectory?: boolean;
  size?: number;
};

/** Small adapter keeps the file lifecycle testable without loading Expo in Node. */
export type SightingPhotoStorage = {
  documentDirectory: string | null;
  getInfo(uri: string): Promise<SightingPhotoFileInfo>;
  makeDirectory(uri: string): Promise<void>;
  copy(from: string, to: string): Promise<void>;
};

export type SightingPhotoErrorCode =
  | "invalid-uri"
  | "storage-unavailable"
  | "unreadable-photo"
  | "missing-photo"
  | "invalid-size"
  | "too-large"
  | "storage-failed"
  | "copy-incomplete";

export class SightingPhotoError extends Error {
  constructor(public readonly code: SightingPhotoErrorCode, message: string) {
    super(message);
    this.name = "SightingPhotoError";
  }
}

let photoSequence = 0;
const createPhotoId = () => `${Date.now().toString(36)}-${photoSequence++}-${Math.random().toString(36).slice(2, 12)}`;

function photoDirectory(documentDirectory: string | null): string {
  if (!documentDirectory || !documentDirectory.startsWith("file://")) {
    throw new SightingPhotoError("storage-unavailable", "O armazenamento permanente de fotos não está disponível neste ambiente. Use o aplicativo Android ou iOS.");
  }
  return `${documentDirectory.replace(/\/+$/, "")}/${SIGHTING_PHOTO_DIRECTORY}`;
}

export function isManagedSightingPhoto(uri: string, documentDirectory: string | null): boolean {
  if (!documentDirectory?.startsWith("file://")) return false;
  const directory = photoDirectory(documentDirectory);
  if (!uri.startsWith(directory)) return false;
  return /^[a-zA-Z0-9._-]+$/.test(uri.slice(directory.length));
}

function photoExtension(photo: SightingPhotoInput): string {
  const byMime: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
    "image/gif": "gif",
  };
  const mimeExtension = byMime[photo.mimeType?.toLowerCase() ?? ""];
  if (mimeExtension) return mimeExtension;
  const fileName = photo.fileName || photo.uri.split(/[?#]/, 1)[0];
  const extension = /\.(jpe?g|png|webp|heic|heif|gif)$/i.exec(fileName)?.[1]?.toLowerCase();
  return extension === "jpeg" ? "jpg" : extension ?? "jpg";
}

function checkedPhotoSize(info: SightingPhotoFileInfo, fallback?: number): number {
  if (!info.exists || info.isDirectory) {
    throw new SightingPhotoError("missing-photo", "A fotografia não foi encontrada. Selecione a imagem novamente na galeria ou na câmera.");
  }
  const size = info.size ?? fallback;
  if (typeof size !== "number" || !Number.isFinite(size) || size <= 0) {
    throw new SightingPhotoError("invalid-size", "Não foi possível verificar o tamanho da fotografia. Selecione a imagem novamente.");
  }
  if (size > MAX_SIGHTING_PHOTO_BYTES) {
    throw new SightingPhotoError("too-large", "A fotografia deve ter no máximo 10 MB. Escolha uma imagem menor.");
  }
  return size;
}

/**
 * Copies picker media to app documents, verifies the copy, and returns a durable URI.
 * This operation never deletes or moves either the original or a prior photo.
 * It preserves image bytes and does not remove EXIF metadata or convert formats.
 */
export async function persistSightingPhotoWithStorage(
  input: SightingPhotoInput | string,
  storage: SightingPhotoStorage,
  nextId: () => string = createPhotoId,
): Promise<string> {
  const photo = typeof input === "string" ? { uri: input } : input;
  if (!photo || typeof photo.uri !== "string" || !/^(file|content):\/\//i.test(photo.uri) || photo.uri !== photo.uri.trim()) {
    throw new SightingPhotoError("invalid-uri", "Selecione uma fotografia local pela galeria ou pela câmera.");
  }
  const directory = photoDirectory(storage.documentDirectory);
  let sourceInfo: SightingPhotoFileInfo;
  try {
    sourceInfo = await storage.getInfo(photo.uri);
  } catch {
    throw new SightingPhotoError("unreadable-photo", "Não foi possível ler a fotografia. Selecione a imagem novamente e tente salvar.");
  }
  const sourceSize = checkedPhotoSize(sourceInfo, photo.fileSize);
  if (isManagedSightingPhoto(photo.uri, storage.documentDirectory)) return photo.uri;

  try {
    const directoryInfo = await storage.getInfo(directory);
    if (directoryInfo.exists && !directoryInfo.isDirectory) {
      throw new Error("Photo directory is occupied by a file");
    }
    if (!directoryInfo.exists) await storage.makeDirectory(directory);

    let targetUri: string | undefined;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const id = nextId();
      if (!/^[a-zA-Z0-9_-]+$/.test(id)) throw new Error("Invalid photo identifier");
      const candidate = `${directory}photo-${id}.${photoExtension(photo)}`;
      if (!(await storage.getInfo(candidate)).exists) {
        targetUri = candidate;
        break;
      }
    }
    if (!targetUri) throw new Error("Unable to allocate a unique photo filename");

    await storage.copy(photo.uri, targetUri);
    const copiedSize = checkedPhotoSize(await storage.getInfo(targetUri));
    if (copiedSize !== sourceSize) {
      throw new SightingPhotoError("copy-incomplete", "A cópia da fotografia ficou incompleta. A imagem original foi preservada; selecione-a novamente.");
    }
    return targetUri;
  } catch (error) {
    if (error instanceof SightingPhotoError) throw error;
    throw new SightingPhotoError("storage-failed", "Não foi possível guardar a fotografia no aparelho. A imagem original foi preservada. Verifique o espaço disponível e tente novamente.");
  }
}
