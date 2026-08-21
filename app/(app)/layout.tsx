import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";

/**
 * Auth chokepoint for every authenticated route group.
 *
 * Every route group placed under `app/(app)/**` inherits this gate: if the
 * visitor has no session, they are sent to `/login?next=<the path they tried>`.
 * The check is cheap because `getSession()` is `cache()`-wrapped and the same
 * session is reused by every server component in the request.
 *
 * `PREVIEW_MODE=true` (with `NODE_ENV !== "production"`) skips the redirect so
 * the dev experience and the Playwright e2e suite can render authenticated UI
 * without a real Supabase back-end. The dashboard page (and the new learn
 * pages) inherit this bypass automatically; do not re-check sessions in child
 * pages.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const previewMode =
    process.env.NODE_ENV !== "production" && process.env.PREVIEW_MODE === "true";
  if (previewMode) {
    return <>{children}</>;
  }

  const session = await getSession();
  if (!session) {
    // We don't know the path Next.js is about to render here; the `next`
    // param is the conventional carrier and child pages (e.g. dashboard) may
    // override it on subsequent navigation. `/dashboard` is the canonical
    // landing for an authenticated visitor so the loop terminates there.
    redirect("/login?next=%2Fdashboard");
  }
  return <>{children}</>;
}
