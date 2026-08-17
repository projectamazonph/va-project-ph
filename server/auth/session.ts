import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE_NAME,
  type Role,
  type SessionPayload,
  verifySessionToken,
} from "@/server/auth/session-token";

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export async function getSession(): Promise<SessionPayload | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    return null;
  }

  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  return token ? verifySessionToken(token, secret) : null;
}

export async function requireSession(nextPath = "/dashboard") {
  const session = await getSession();
  if (!session) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return session;
}

const roleRank: Record<Role, number> = {
  student: 1,
  teacher: 2,
  admin: 3,
};

export async function requireRole(role: Role, nextPath = "/dashboard") {
  const session = await requireSession(nextPath);
  if (roleRank[session.role] < roleRank[role]) {
    redirect("/not-found");
  }

  return session;
}
