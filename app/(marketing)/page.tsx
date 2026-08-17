import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const learningPath = [
  { icon: "🧭", title: "Learn the basics", description: "Start with clear lessons made for absolute beginners." },
  { icon: "🛠️", title: "Practice for real", description: "Use guided simulators to build useful Amazon PPC habits." },
  { icon: "🎯", title: "Show your skill", description: "Build a portfolio you can bring to clients and teams." },
] as const;

export default function MarketingHomePage() {
  return (
    <main>
      <header className="border-b border-line bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
          <Link className="font-display text-base font-bold tracking-tight text-ink" href="/">
            VA Project <span className="text-blue-700">PH</span>
          </Link>
          <nav aria-label="Main navigation" className="flex items-center gap-2">
            <Link
              className="hidden min-h-11 items-center rounded-md px-3 text-sm font-semibold text-muted transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 sm:flex"
              href="#path"
            >
              How it works
            </Link>
            <ButtonLink href="/dashboard" size="sm">Open learning hub</ButtonLink>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:px-6 md:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-sun-50 px-3 py-1.5 text-sm font-semibold text-ink">
            <span aria-hidden="true">🇵🇭</span> Built for Filipino beginners
          </p>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Zero experience in. Skilled, hired-ready VA out.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
            Learn Amazon PPC through plain-word lessons, realistic practice, and one clear path from
            first click to confident work.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/dashboard" size="lg">Start learning</ButtonLink>
            <ButtonLink href="#path" size="lg" variant="secondary">See the path</ButtonLink>
          </div>
          <p className="mt-4 text-sm text-muted">Mobile-first · Data-light · Practice over promises</p>
        </div>

        <Card className="relative overflow-hidden bg-ink p-6 text-white sm:p-8" shadow="pop">
          <div aria-hidden="true" className="absolute -right-16 -top-16 size-48 rounded-full bg-blue-700/40" />
          <div aria-hidden="true" className="absolute -bottom-20 -left-10 size-48 rounded-full bg-sun-400/20" />
          <div className="relative">
            <p className="text-sm font-semibold text-sun-400">Your first win</p>
            <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
              Know what to do next, every step of the way.
            </h2>
            <div className="mt-8 space-y-4">
              {["Lesson 01 · What is Amazon PPC?", "Practice · Read a search term report", "Next · Make your first bid decision"].map(
                (item, index) => (
                  <div key={item} className="flex items-center gap-3 rounded-md border border-white/15 bg-white/10 p-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-sun-400 text-sm font-bold text-ink">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-white/90">{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </Card>
      </section>

      <section className="border-y border-line bg-card" id="path">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">One clear path</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Learn it. Practice it. Use it.</h2>
            <p className="mt-4 leading-7 text-muted">No jargon wall. No guessing what to study next. Just small wins that stack.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:gap-6">
            {learningPath.map((item, index) => (
              <Card className="p-5" key={item.title}>
                <div className="grid size-11 place-items-center rounded-md bg-blue-50 text-xl" aria-hidden="true">
                  {item.icon}
                </div>
                <p className="mt-6 text-sm font-bold text-blue-700">0{index + 1}</p>
                <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between md:px-6 lg:px-8">
        <p>Made for the next Filipino Amazon PPC professional.</p>
        <Link className="font-semibold text-blue-700 hover:text-blue-800" href="/security.txt">
          Security
        </Link>
      </footer>
    </main>
  );
}
