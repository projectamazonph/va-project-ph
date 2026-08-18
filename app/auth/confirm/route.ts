import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/dashboard";
  }

  return value;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const nextPath = safeNextPath(url.searchParams.get("next"));

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL("/login?error=invalid_link", url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });

  if (error) {
    return NextResponse.redirect(new URL("/login?error=expired_link", url.origin));
  }

  return NextResponse.redirect(new URL(nextPath, url.origin));
}
