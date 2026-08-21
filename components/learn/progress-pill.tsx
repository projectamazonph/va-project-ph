import { Badge, type badgeVariants } from "@/components/ui/badge";
import type { LessonProgressStatus } from "@/lib/schemas/curriculum";

type Tone = NonNullable<Parameters<typeof badgeVariants>[0]>["tone"];

const STATUS_COPY: Record<LessonProgressStatus, { label: string; tone: Tone }> = {
  not_started: { label: "Not started", tone: "muted" },
  in_progress: { label: "In progress", tone: "warn" },
  complete: { label: "Complete", tone: "success" },
};

/**
 * Small pill that shows a lesson's read-status. Used in the module overview
 * and the lesson detail header. Server-renderable.
 */
export function ProgressPill({ status, className }: { status: LessonProgressStatus; className?: string }) {
  const { label, tone } = STATUS_COPY[status];
  return (
    <Badge tone={tone} className={className}>
      {label}
    </Badge>
  );
}
