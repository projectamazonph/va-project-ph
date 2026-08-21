"use client";

import { useActionState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { markLessonStatusAction, type MarkLessonFormState } from "@/server/actions/lesson-progress";
import type { LessonProgressStatus } from "@/lib/schemas/curriculum";

type MarkReadFormProps = {
  lessonId: string;
  moduleId: string;
  currentStatus: LessonProgressStatus;
  isAuthenticated: boolean;
};

const INITIAL: MarkLessonFormState | null = null;

/**
 * The only client component in the lesson slice. Toggling the checkbox
 * submits a hidden form to `markLessonStatusAction`; the action returns
 * the new `MarkLessonFormState` and `useActionState` re-renders accordingly.
 *
 * The action calls `updateTag(progressTag(studentId))`, so the next render
 * of the module page re-fetches the progress map.
 */
export function MarkReadForm({ lessonId, moduleId, currentStatus, isAuthenticated }: MarkReadFormProps) {
  const [state, formAction, isPending] = useActionState(markLessonStatusAction, INITIAL);

  const lastStatus = state && state.ok ? state.status : currentStatus;
  const isChecked = lastStatus === "complete";
  const errorMessage =
    state && !state.ok
      ? state.error.message
      : !isAuthenticated
        ? "Sign in to track your progress."
        : null;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="moduleId" value={moduleId} />
      <input type="hidden" name="status" value={isChecked ? "in_progress" : "complete"} />

      <Checkbox
        label="Mark as read"
        description="When you've finished this lesson, tick the box. You can untick it any time."
        checked={isChecked}
        disabled={isPending}
        // The native input fires onChange; we submit the form on change.
        onChange={() => {
          // The form has no submit button — submitting on change is the
          // intended UX. We dispatch via a fresh submit event so that
          // server actions get a real FormData payload.
          const form = document.activeElement?.closest("form");
          if (form instanceof HTMLFormElement) {
            form.requestSubmit();
          }
        }}
      />
      {errorMessage ? (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}
    </form>
  );
}
