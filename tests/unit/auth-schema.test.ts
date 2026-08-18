import { describe, expect, it } from "vitest";
import { EmailSchema } from "@/lib/schemas/auth";

describe("EmailSchema", () => {
  it("accepts a valid sign-in email", () => {
    expect(EmailSchema.parse({ email: "student@example.com" })).toEqual({
      email: "student@example.com",
    });
  });

  it("rejects malformed or oversized email values", () => {
    expect(() => EmailSchema.parse({ email: "not-an-email" })).toThrow();
    expect(() => EmailSchema.parse({ email: `${"a".repeat(250)}@x.com` })).toThrow();
  });
});
