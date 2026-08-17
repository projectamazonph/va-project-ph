"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-16">
      <section className="max-w-md rounded-lg border border-line bg-card p-8 text-center shadow-card">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-danger">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-bold">Your place is safe.</h1>
        <p className="mt-3 text-sm leading-6 text-muted">Try that again. If it keeps happening, tell the team what you clicked.</p>
        <Button className="mt-6" onClick={reset}>Try again</Button>
      </section>
    </main>
  );
}
