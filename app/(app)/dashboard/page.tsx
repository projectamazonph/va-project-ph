import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireSession } from "@/server/auth/session";

export const metadata = { title: "Learning hub" };

export default async function DashboardPage() {
  const previewMode = process.env.NODE_ENV !== "production" && process.env.PREVIEW_MODE === "true";
  if (!previewMode) {
    await requireSession("/dashboard");
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-line bg-ink text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <Link className="font-display font-bold tracking-tight" href="/">
            VA Project <span className="text-sun-400">PH</span>
          </Link>
          <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80">Preview</span>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Learning hub</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Good to see you.</h1>
        <p className="mt-3 max-w-xl leading-7 text-muted">Your learning path will live here. The first lesson is ready for the scaffold.</p>
        <Card className="mt-8 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">Module 0</p>
            <h2 className="mt-1 text-xl font-bold">Amazon PPC foundations</h2>
            <p className="mt-2 text-sm text-muted">A short, plain-word introduction to how ads help shoppers find products.</p>
          </div>
          <ButtonLink href="/">Back to home</ButtonLink>
        </Card>
      </div>
    </main>
  );
}
