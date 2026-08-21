import { ButtonLink } from "@/components/ui/button";

type LessonStepNavProps = {
  moduleSlug: string;
  prevSlug: string | null;
  nextSlug: string | null;
};

/**
 * Server-rendered "previous / back-to-module / next" navigation for a lesson
 * page. Hidden buttons remain in the DOM (as disabled placeholders) so the
 * layout is stable across lessons.
 */
export function LessonStepNav({ moduleSlug, prevSlug, nextSlug }: LessonStepNavProps) {
  return (
    <nav className="mt-10 flex flex-col-reverse items-stretch gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
      <ButtonLink href={`/learn/${moduleSlug}`} size="md" variant="secondary">
        Back to module
      </ButtonLink>
      <div className="flex items-center gap-3">
        {prevSlug ? (
          <ButtonLink href={`/learn/${moduleSlug}/${prevSlug}`} size="md" variant="ghost">
            Previous lesson
          </ButtonLink>
        ) : (
          <span className="text-sm text-muted" aria-hidden>
            First lesson
          </span>
        )}
        {nextSlug ? (
          <ButtonLink href={`/learn/${moduleSlug}/${nextSlug}`} size="md" variant="primary">
            Next lesson
          </ButtonLink>
        ) : (
          <span className="text-sm text-muted" aria-hidden>
            Last lesson
          </span>
        )}
      </div>
    </nav>
  );
}
