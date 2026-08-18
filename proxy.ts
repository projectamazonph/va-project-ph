import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const previewMode = process.env.NODE_ENV !== "production" && process.env.PREVIEW_MODE === "true";
  if (previewMode || !isSupabaseConfigured()) {
    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/auth/:path*"],
};
