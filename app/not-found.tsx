import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-16">
      <section className="max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">404</p>
        <h1 className="mt-3 text-3xl font-bold">That page took a wrong turn.</h1>
        <p className="mt-3 text-muted">Let&apos;s get you back to the learning path.</p>
        <ButtonLink className="mt-6" href="/">Go home</ButtonLink>
      </section>
    </main>
  );
}
