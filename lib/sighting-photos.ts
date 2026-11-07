import * as FileSystem from "expo-file-system/legacy";

import {
  isManagedSightingPhoto,
  persistSightingPhotoWithStorage,
  type SightingPhotoInput,
  type SightingPhotoStorage,
} from "@/shared/sighting-media";

export { MAX_SIGHTING_PHOTO_BYTES, SightingPhotoError } from "@/shared/sighting-media";
export type { SightingPhotoInput } from "@/shared/sighting-media";

const storage: SightingPhotoStorage = {
  documentDirectory: FileSystem.documentDirectory,
  getInfo: (uri) => FileSystem.getInfoAsync(uri),
  makeDirectory: (uri) => FileSystem.makeDirectoryAsync(uri, { intermediates: true }),
  copy: (from, to) => FileSystem.copyAsync({ from, to }),
};

/** Accepts a picker asset (or URI) and returns a verified app-documents URI. */
export function persistSightingPhoto(input: SightingPhotoInput | string): Promise<string> {
  return persistSightingPhotoWithStorage(input, storage);
}

export function isPhotoInPermanentStorage(uri: string): boolean {
  return isManagedSightingPhoto(uri, FileSystem.documentDirectory);
}
