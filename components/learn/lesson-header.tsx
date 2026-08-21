import { cn } from "@/lib/utils";

type LessonHeaderProps = {
  eyebrow: string;
  title: string;
  estimatedMinutes: number;
  position: number;
  totalLessons: number;
  className?: string;
};

/**
 * Standard lesson hero: a small uppercase eyebrow, the lesson title, and a
 * meta row showing the lesson number and a plain-word reading-time hint.
 *
 * Server-renderable; no client state.
 */
export function LessonHeader({
  eyebrow,
  title,
  estimatedMinutes,
  position,
  totalLessons,
  className,
}: LessonHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-3 border-b border-line pb-6", className)}>
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-700">{eyebrow}</p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="text-sm text-muted">
        Lesson {position} of {totalLessons} · about {estimatedMinutes} min to read
      </p>
    </header>
  );
}
