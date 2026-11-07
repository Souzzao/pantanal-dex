import { describe, expect, it } from "vitest";

import {
  isManagedSightingPhoto,
  MAX_SIGHTING_PHOTO_BYTES,
  persistSightingPhotoWithStorage,
  SightingPhotoError,
  type SightingPhotoFileInfo,
  type SightingPhotoStorage,
} from "../shared/sighting-media";

const documents = "file:///app/documents/";
const directory = `${documents}pantanal-dex/photos/`;
const source = "file:///app/cache/picker/original.jpg";

function memoryStorage(initial: Record<string, SightingPhotoFileInfo> = {}) {
  const files = new Map<string, SightingPhotoFileInfo>(Object.entries(initial));
  const copies: { from: string; to: string }[] = [];
  const folders: string[] = [];
  const storage: SightingPhotoStorage = {
    documentDirectory: documents,
    getInfo: async (uri) => files.get(uri) ?? { exists: false },
    makeDirectory: async (uri) => {
      folders.push(uri);
      files.set(uri, { exists: true, isDirectory: true });
    },
    copy: async (from, to) => {
      copies.push({ from, to });
      files.set(to, { ...files.get(from)! });
    },
  };
  return { storage, files, copies, folders };
}

describe("durable sighting photos", () => {
  it("copies picker media into app documents and leaves the source untouched", async () => {
    const fixture = memoryStorage({ [source]: { exists: true, size: 1234 } });
    const uri = await persistSightingPhotoWithStorage({ uri: source, mimeType: "image/jpeg" }, fixture.storage, () => "one");
    expect(uri).toBe(`${directory}photo-one.jpg`);
    expect(fixture.folders).toEqual([directory]);
    expect(fixture.copies).toEqual([{ from: source, to: uri }]);
    expect(fixture.files.get(source)).toEqual({ exists: true, size: 1234 });
    expect(fixture.files.get(uri)?.size).toBe(1234);
  });

  it("reuses a verified photo already in permanent storage without another copy", async () => {
    const uri = `${directory}photo-previous.webp`;
    const fixture = memoryStorage({ [uri]: { exists: true, size: 250 } });
    expect(await persistSightingPhotoWithStorage(uri, fixture.storage)).toBe(uri);
    expect(fixture.copies).toEqual([]);
    expect(fixture.folders).toEqual([]);
  });

  it("does not mistake neighboring or traversing paths for managed photos", () => {
    expect(isManagedSightingPhoto(`${directory}photo-one.jpg`, documents)).toBe(true);
    expect(isManagedSightingPhoto(`${directory}../other.jpg`, documents)).toBe(false);
    expect(isManagedSightingPhoto(`${directory}%2e%2e%2fother.jpg`, documents)).toBe(false);
    expect(isManagedSightingPhoto(`${directory}nested/photo.jpg`, documents)).toBe(false);
    expect(isManagedSightingPhoto(`${documents}pantanal-dex/photos-other/photo.jpg`, documents)).toBe(false);
    expect(isManagedSightingPhoto(`${directory}photo-one.jpg`, null)).toBe(false);
    expect(isManagedSightingPhoto(`${directory}photo-one.jpg`, "https://example.com/")).toBe(false);
  });

  it("rejects a missing file, a directory and an unverifiable size", async () => {
    for (const info of [{ exists: false }, { exists: true, isDirectory: true, size: 20 }, { exists: true }]) {
      const fixture = memoryStorage({ [source]: info });
      await expect(persistSightingPhotoWithStorage(source, fixture.storage)).rejects.toBeInstanceOf(SightingPhotoError);
      expect(fixture.copies).toEqual([]);
    }
  });

  it("checks the real source size instead of trusting smaller picker metadata", async () => {
    const fixture = memoryStorage({ [source]: { exists: true, size: MAX_SIGHTING_PHOTO_BYTES + 1 } });
    await expect(persistSightingPhotoWithStorage({ uri: source, fileSize: 1 }, fixture.storage)).rejects.toMatchObject({ code: "too-large" });
    expect(fixture.copies).toEqual([]);
  });

  it("accepts a photo at the size limit and preserves a PNG file extension", async () => {
    const fixture = memoryStorage({ [source]: { exists: true, size: MAX_SIGHTING_PHOTO_BYTES } });
    const uri = await persistSightingPhotoWithStorage({ uri: source, mimeType: "image/png" }, fixture.storage, () => "limit");
    expect(uri).toBe(`${directory}photo-limit.png`);
  });

  it("accepts local Android content URIs and checks the copied bytes", async () => {
    const contentUri = "content://media/external/images/123";
    const fixture = memoryStorage({ [contentUri]: { exists: true, size: 450 } });
    const uri = await persistSightingPhotoWithStorage({ uri: contentUri, fileName: "animal.webp" }, fixture.storage, () => "content");
    expect(uri).toBe(`${directory}photo-content.webp`);
    expect(fixture.files.get(uri)?.size).toBe(450);
  });

  it("skips existing destination names without overwriting another photo", async () => {
    const existing = `${directory}photo-collision.jpg`;
    const fixture = memoryStorage({ [source]: { exists: true, size: 1234 }, [existing]: { exists: true, size: 999 } });
    let call = 0;
    const uri = await persistSightingPhotoWithStorage(source, fixture.storage, () => call++ === 0 ? "collision" : "new");
    expect(uri).toBe(`${directory}photo-new.jpg`);
    expect(fixture.files.get(existing)?.size).toBe(999);
  });

  it("keeps the original and any partially copied file if a storage operation fails", async () => {
    const fixture = memoryStorage({ [source]: { exists: true, size: 1234 } });
    fixture.storage.copy = async (_from, to) => {
      fixture.files.set(to, { exists: true, size: 10 });
      throw new Error("Disk full");
    };
    await expect(persistSightingPhotoWithStorage(source, fixture.storage, () => "partial")).rejects.toMatchObject({ code: "storage-failed" });
    expect(fixture.files.get(source)?.size).toBe(1234);
    expect(fixture.files.get(`${directory}photo-partial.jpg`)?.size).toBe(10);
  });

  it("rejects an incomplete copy without replacing the caller's original URI", async () => {
    const fixture = memoryStorage({ [source]: { exists: true, size: 1234 } });
    fixture.storage.copy = async (_from, to) => { fixture.files.set(to, { exists: true, size: 10 }); };
    await expect(persistSightingPhotoWithStorage(source, fixture.storage, () => "incomplete")).rejects.toMatchObject({ code: "copy-incomplete" });
    expect(fixture.files.has(source)).toBe(true);
  });

  it("reports unavailable documents storage and rejects remote image URLs", async () => {
    const fixture = memoryStorage({ [source]: { exists: true, size: 1234 } });
    fixture.storage.documentDirectory = null;
    await expect(persistSightingPhotoWithStorage(source, fixture.storage)).rejects.toMatchObject({ code: "storage-unavailable" });
    await expect(persistSightingPhotoWithStorage("https://example.com/image.jpg", fixture.storage)).rejects.toMatchObject({ code: "invalid-uri" });
    expect(fixture.copies).toEqual([]);
  });
});
