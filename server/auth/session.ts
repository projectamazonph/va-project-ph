import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { type Role, type SessionPayload } from "@/server/auth/session-token";

export async function getSession(): Promise<SessionPayload | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    const claims = data?.claims;

    if (error || !claims || typeof claims.sub !== "string") {
      return null;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", claims.sub)
      .maybeSingle();

    const role = profile?.role;
    const validRole: Role = role === "teacher" || role === "admin" ? role : "student";
    const now = Math.floor(Date.now() / 1000);

    return {
      sub: claims.sub,
      role: validRole,
      iat: typeof claims.iat === "number" ? claims.iat : now,
      exp: typeof claims.exp === "number" ? claims.exp : now + 60 * 60,
    };
  } catch {
    return null;
  }
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
