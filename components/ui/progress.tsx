import { cn } from "@/lib/utils";

type ProgressBarProps = {
  /** Total lesson count. Must be > 0; component renders nothing on 0. */
  total: number;
  /** Lesson count with `status === "complete"`. Clamped to [0, total]. */
  complete: number;
  /** Accessible label. Defaults to a built-in string. */
  label?: string;
  className?: string;
};

/**
 * Read-only progress meter for the module overview. Server-renderable.
 *
 * Visual rule: width = `complete / total` percent, rounded to one decimal to
 * avoid layout shift on small denominators. The bar is a `role="progressbar"`
 * with `aria-valuenow/min/max` so screen readers report percent completion.
 */
export function ProgressBar({ total, complete, label, className }: ProgressBarProps) {
  if (total <= 0) return null;
  const clamped = Math.max(0, Math.min(complete, total));
  const pct = (clamped / total) * 100;
  const rounded = Math.round(pct * 10) / 10;
  return (
    <div
      className={cn("flex w-full flex-col gap-1.5", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rounded}
      aria-label={label ?? `${clamped} of ${total} lessons complete`}
    >
      <div className="h-2 w-full overflow-hidden rounded-full bg-blue-50">
        <div
          className="h-full rounded-full bg-blue-700 transition-[width] duration-200"
          style={{ width: `${rounded}%` }}
        />
      </div>
    </div>
  );
}
