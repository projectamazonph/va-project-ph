import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { getSession } from "@/server/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createCurriculumRepository } from "@/server/repositories/curriculum-repository";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { renderLessonBody } from "@/lib/curriculum/render-markdown";
import { Card } from "@/components/ui/card";
import { LessonHeader } from "@/components/learn/lesson-header";
import { LessonStepNav } from "@/components/learn/lesson-step-nav";
import { ProgressPill } from "@/components/learn/progress-pill";
import { MarkReadForm } from "./mark-read-form";
import type { LessonProgressStatus } from "@/lib/schemas/curriculum";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
};

const COURSE_ID_FALLBACK = "00000000-0000-0000-0000-000000000000";

/**
 * Lesson detail: the markdown body of one lesson, plus a tick-to-mark-read
 * form and a previous/next step nav. Progress writes are handled by the
 * client form via the `markLessonStatusAction` server action.
 */
export default async function LessonPage({ params }: PageProps) {
  const { moduleSlug, lessonSlug } = await params;
  const session = await getSession();
  const studentId = session?.sub ?? COURSE_ID_FALLBACK;

  if (!isSupabaseConfigured()) {
    return <EmptyLessonState moduleSlug={moduleSlug} lessonSlug={lessonSlug} />;
  }

  const moduleRow = await fetchModuleBySlug(moduleSlug, COURSE_ID_FALLBACK);
  if (!moduleRow) notFound();

  const lessons = await fetchLessonsForModule(moduleRow.id);
  if (lessons.length === 0) notFound();

  const lesson = lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) notFound();

  const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const supabase = await createClient();
  const repo = createCurriculumRepository(supabase as unknown as Parameters<typeof createCurriculumRepository>[0]);
  const progressMap = await repo.getStudentProgress(studentId, moduleRow.id);
  const status = (progressMap.get(lesson.id) ?? "not_started") as LessonProgressStatus;

  const html = await fetchCompiledLesson(moduleRow.id, lesson.slug);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 lg:px-8">
        <LessonHeader
          eyebrow={`Module: ${moduleRow.title}`}
          title={lesson.title}
          estimatedMinutes={lesson.estimated_minutes}
          position={lesson.position}
          totalLessons={lessons.length}
        />

        <div className="mt-6 flex items-center gap-2">
          <ProgressPill status={status} />
        </div>

        <Card className="mt-8 p-6">
          <article
            className="prose prose-ink max-w-none [&_h1]:text-2xl [&_h2]:mt-6 [&_h2]:text-xl [&_p]:my-3 [&_ul]:my-3 [&_ol]:my-3 [&_li]:my-1"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Card>

        <div className="mt-8">
          <MarkReadForm
            lessonId={lesson.id}
            moduleId={moduleRow.id}
            currentStatus={status}
            isAuthenticated={Boolean(session)}
          />
        </div>

        <LessonStepNav
          moduleSlug={moduleSlug}
          prevSlug={prevLesson?.slug ?? null}
          nextSlug={nextLesson?.slug ?? null}
        />
      </div>
    </main>
  );
}

function EmptyLessonState({ moduleSlug, lessonSlug }: { moduleSlug: string; lessonSlug: string }) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">Lesson</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">No content available</h1>
        <p className="mt-3 text-base text-muted">
          The lesson <code>{lessonSlug}</code> in module <code>{moduleSlug}</code> is not yet loaded.
        </p>
      </div>
    </main>
  );
}

// --- cached fetches ---------------------------------------------------------

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

async function fetchCompiledLesson(moduleId: string, lessonSlug: string): Promise<string> {
  const cached = unstable_cache(
    async () => {
      const supabase = await createClient();
      const repo = createCurriculumRepository(supabase as unknown as Parameters<typeof createCurriculumRepository>[0]);
      const lesson = await repo.getLessonBySlug(moduleId, lessonSlug);
      if (!lesson) notFound();
      return renderLessonBody(lesson.content);
    },
    ["curriculum:lesson-compiled", moduleId, lessonSlug],
    { tags: [`curriculum:lesson:${moduleId}:${lessonSlug}`], revalidate: 60 * 10 },
  );
  return cached();
}
