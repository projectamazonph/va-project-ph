import { describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken, type SessionPayload } from "@/server/auth/session-token";

const secret = "a-development-secret-that-is-at-least-32-chars";
const now = Math.floor(Date.now() / 1000);
const payload: SessionPayload = {
  sub: "8a7f4d1c-5c7a-4b3a-9f4d-9d2a1c4e8b7f",
  role: "student",
  iat: now - 30,
  exp: now + 300,
};

describe("session tokens", () => {
  it("round-trips a signed session payload", async () => {
    const token = await createSessionToken(payload, secret);

    await expect(verifySessionToken(token, secret)).resolves.toEqual(payload);
  });

  it("rejects a token with a changed signature or secret", async () => {
    const token = await createSessionToken(payload, secret);
    const [body, signature] = token.split(".");

    await expect(verifySessionToken(`${body}.invalid-${signature}`, secret)).resolves.toBeNull();
    await expect(verifySessionToken(token, `${secret}-wrong`)).resolves.toBeNull();
  });

  it("rejects expired sessions and malformed claims", async () => {
    const expired = await createSessionToken(
      { ...payload, exp: Math.floor(Date.now() / 1000) - 1 },
      secret,
    );
    const malformed = await createSessionToken(
      { ...payload, role: "student", sub: "" },
      secret,
    );

    await expect(verifySessionToken(expired, secret)).resolves.toBeNull();
    await expect(verifySessionToken(malformed, secret)).resolves.toBeNull();
  });
});
