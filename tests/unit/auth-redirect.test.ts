import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/app/auth/confirm/route";

describe("safeNextPath", () => {
  it("keeps same-origin relative paths", () => {
    expect(safeNextPath("/dashboard?from=email")).toBe("/dashboard?from=email");
  });

  it("rejects external, protocol-relative, and backslash paths", () => {
    expect(safeNextPath("https://evil.example")).toBe("/dashboard");
    expect(safeNextPath("//evil.example")).toBe("/dashboard");
    expect(safeNextPath("/\\evil.example")).toBe("/dashboard");
  });
});
