import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { MAX_SIGHTING_PHOTO_BYTES } from "@/shared/sighting-media";

/** Encode only the decoded image pixels before sending a photo off-device. */
export async function readShareablePhoto(uri: string): Promise<ArrayBuffer> {
  const context = ImageManipulator.manipulate(uri);
  let image: Awaited<ReturnType<typeof context.renderAsync>> | undefined;
  let jpeg: string | undefined;
  try {
    image = await context.renderAsync();
    jpeg = (await image.saveAsync({ compress: 0.82, format: SaveFormat.JPEG })).uri;
    const response = await fetch(jpeg);
    if (!response.ok) throw new Error("não foi possível ler a foto");
    const bytes = await response.arrayBuffer();
    const signature = new Uint8Array(bytes, 0, Math.min(bytes.byteLength, 3));
    if (signature[0] !== 255 || signature[1] !== 216 || signature[2] !== 255 || bytes.byteLength > MAX_SIGHTING_PHOTO_BYTES) {
      throw new Error("foto inválida ou acima de 10 MB");
    }
    return bytes;
  } finally {
    image?.release();
    context.release();
    if (jpeg && Platform.OS === "web" && jpeg.startsWith("blob:")) URL.revokeObjectURL(jpeg);
    if (jpeg && Platform.OS !== "web") await FileSystem.deleteAsync(jpeg, { idempotent: true }).catch(() => undefined);
  }
}