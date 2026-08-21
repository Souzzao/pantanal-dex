import { describe, expect, it } from "vitest";

import { getNativePermissionCopy } from "../shared/native-permissions";

describe("native permission copy", () => {
  it("explains denied camera access in English", () => {
    expect(getNativePermissionCopy("English", "camera", "denied")).toEqual({
      title: "Camera not authorized",
      detail: "Allow camera access to record a photograph.",
    });
  });

  it("keeps location service errors actionable in Portuguese and Spanish", () => {
    expect(getNativePermissionCopy("Português", "location", "services-disabled").detail).toContain("Ative");
    expect(getNativePermissionCopy("Español", "location", "services-disabled").detail).toContain("Activa");
  });

  it("falls back safely for unsupported language values", () => {
    expect(getNativePermissionCopy("Português", "camera", "error").title).toBe("Não foi possível abrir a câmera");
  });
});
