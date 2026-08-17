export const SESSION_COOKIE_NAME = "va_session";

export const roles = ["student", "teacher", "admin"] as const;
export type Role = (typeof roles)[number];

export type SessionPayload = {
  sub: string;
  role: Role;
  iat: number;
  exp: number;
};

export const MAX_SESSION_AGE_SECONDS = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function encodeBase64Url(value: Uint8Array) {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value: string) {
  return new Uint8Array(Buffer.from(value, "base64url"));
}

async function signingKey(secret: string, usage: KeyUsage[]) {
  if (secret.length < 32) {
    throw new Error("AUTH_SECRET must be at least 32 characters");
  }

  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage,
  );
}

export async function createSessionToken(payload: SessionPayload, secret: string) {
  const body = encodeBase64Url(encoder.encode(JSON.stringify(payload)));
  const key = await signingKey(secret, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));

  return `${body}.${encodeBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token: string, secret: string): Promise<SessionPayload | null> {
  try {
    const [body, encodedSignature] = token.split(".");
    if (!body || !encodedSignature || token.split(".").length !== 2) {
      return null;
    }

    const key = await signingKey(secret, ["verify"]);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(encodedSignature),
      encoder.encode(body),
    );
    if (!valid) {
      return null;
    }

    const payload = JSON.parse(decoder.decode(decodeBase64Url(body))) as Partial<SessionPayload>;
    const now = Math.floor(Date.now() / 1000);
    if (
      typeof payload.sub !== "string" ||
      payload.sub.trim().length === 0 ||
      !roles.includes(payload.role as Role) ||
      typeof payload.iat !== "number" ||
      !Number.isInteger(payload.iat) ||
      typeof payload.exp !== "number" ||
      !Number.isInteger(payload.exp) ||
      payload.iat > now + 30 ||
      payload.exp <= now ||
      payload.exp <= payload.iat ||
      payload.exp - payload.iat > MAX_SESSION_AGE_SECONDS
    ) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}
