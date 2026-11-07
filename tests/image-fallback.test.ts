import { describe, expect, it } from "vitest";
import { buildImageFallbackPlan } from "../shared/image-fallback";

describe("catalog image retries", () => {
  it("keeps a stable request key when inline sources are recreated", () => {
    expect(buildImageFallbackPlan({ uri: "https://example.org/bird.jpg", headers: { A: "a", B: "b" } }).key).toBe(buildImageFallbackPlan({ headers: { B: "b", A: "a" }, uri: "https://example.org/bird.jpg" }).key);
  });
  it("tries each approved image once and ignores empty sources", () => {
    const first = { uri: "https://example.org/first.jpg" };
    const second = { uri: "https://example.org/second.jpg" };
    expect(buildImageFallbackPlan(first, [undefined, { uri: "" }, first, second, second]).candidates).toEqual([first, second]);
  });
  it("retains a distinct plan for changed media and supports bundled images", () => {
    expect(buildImageFallbackPlan({ uri: "file:///new.jpg" }).key).not.toBe(buildImageFallbackPlan({ uri: "file:///old.jpg" }).key);
    expect(buildImageFallbackPlan(7, [7, 8]).candidates).toEqual([7, 8]);
  });
});
