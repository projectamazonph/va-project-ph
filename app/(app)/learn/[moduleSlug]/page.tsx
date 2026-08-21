import { notFound } from "next/navigation";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { getSession } from "@/server/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createCurriculumRepository } from "@/server/repositories/curriculum-repository";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { ProgressPill } from "@/components/learn/progress-pill";
import type { LessonProgressStatus } from "@/lib/schemas/curriculum";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ moduleSlug: string }>;
};

const COURSE_ID_FALLBACK = "00000000-0000-0000-0000-000000000000";

/**
 * Module overview: list every lesson in a module with its current progress
 * for the signed-in student. The auth gate runs in `app/(app)/layout.tsx`,
 * so by the time we reach this page we either have a session or we are in
 * `PREVIEW_MODE` (dev / e2e only).
 *
 * Module + lesson reads are wrapped with `unstable_cache` (60 s) keyed on
 * `(slug, courseId)` and `(moduleId)` respectively, so back-to-back
 * navigation is cheap. Progress reads are NOT cached: the
 * `markLessonStatusAction` calls `updateTag('progress:<studentId>')` so the
 * action's cache invalidation is per-student, and the overview reflects
 * writes immediately on the next render.
 */
export default async function ModulePage({ params }: PageProps) {
  const { moduleSlug } = await params;
  const session = await getSession();
  const studentId = session?.sub ?? COURSE_ID_FALLBACK;

  // PREVIEW_MODE without configured Supabase still needs a working render.
  if (!isSupabaseConfigured()) {
    return <EmptyModuleState moduleSlug={moduleSlug} />;
  }

  const moduleRow = await fetchModuleBySlug(moduleSlug, COURSE_ID_FALLBACK);
  if (!moduleRow) notFound();

  const lessons = await fetchLessonsForModule(moduleRow.id);
  if (lessons.length === 0) notFound();

  const supabase = await createClient();
  const repo = createCurriculumRepository(supabase as unknown as Parameters<typeof createCurriculumRepository>[0]);
  const progressMap = await repo.getStudentProgress(studentId, moduleRow.id);
  const completeCount = lessons.filter((l) => progressMap.get(l.id) === "complete").length;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Module</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{moduleRow.title}</h1>
        <p className="mt-3 text-base text-muted">
          {lessons.length} {lessons.length === 1 ? "lesson" : "lessons"} · {completeCount} complete
        </p>

        <div className="mt-6">
          <ProgressBar total={lessons.length} complete={completeCount} />
        </div>

        <ol className="mt-8 flex flex-col gap-3">
          {lessons.map((lesson) => {
            const status = (progressMap.get(lesson.id) ?? "not_started") as LessonProgressStatus;
            return (
              <li key={lesson.id}>
                <Card className="p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                        Lesson {lesson.position}
                      </p>
                      <h2 className="mt-1 text-lg font-bold tracking-tight">
                        <Link
                          href={`/learn/${moduleSlug}/${lesson.slug}`}
                          className="hover:underline focus-visible:underline focus-visible:outline-none"
                        >
                          {lesson.title}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm text-muted">{lesson.summary}</p>
                    </div>
                    <ProgressPill status={status} className="self-start sm:self-center" />
                  </div>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}

function EmptyModuleState({ moduleSlug }: { moduleSlug: string }) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Module</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">No curriculum loaded</h1>
        <p className="mt-3 text-base text-muted">
          The learning content for <code>{moduleSlug}</code> is not yet available. Run{" "}
          <code className="rounded bg-blue-50 px-1.5 py-0.5">pnpm curriculum:compile</code> to load it.
        </p>
      </div>
    </main>
  );
}

// --- cached fetches (Supabase client created inside the cache fn so the
//     key only contains stable string identifiers) ---------------------------

async function fetchModuleBySlug(slug: string, courseId: string) {
  const cached = unstable_cache(
    async () => {
      const supabase = await createClient();
      const repo = createCurriculumRepository(supabase as unknown as Parameters<typeof createCurriculumRepository>[0]);
      try {
        return await repo.getModuleBySlug(slug, courseId);
      } catch {
        return null;
      }
    },
    ["curriculum:module", slug, courseId],
    { tags: [`curriculum:module:${slug}`], revalidate: 60 },
  );
  return cached();
}

async function fetchLessonsForModule(moduleId: string) {
  const cached = unstable_cache(
    async () => {
      const supabase = await createClient();
      const repo = createCurriculumRepository(supabase as unknown as Parameters<typeof createCurriculumRepository>[0]);
      return repo.listLessonsForModule(moduleId);
    },
    ["curriculum:lessons", moduleId],
    { tags: [`curriculum:lessons:${moduleId}`], revalidate: 60 },
  );
  return cached();
}
