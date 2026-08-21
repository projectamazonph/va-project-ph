"use client";

import { forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & {
  label: string;
  /** Optional description rendered below the label for accessibility. */
  description?: string;
};

/**
 * Accessible checkbox with a built-in label.
 *
 * Wraps the input in a `<label>` so the click target is the whole row, and the
 * field is always associated with text (no orphaned checkboxes). The hidden
 * native input keeps keyboard / form-submission behaviour intact; the visible
 * square is purely decorative.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { className, label, description, id, ...props },
  ref,
) {
  const inputId = id ?? `cb-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <label
      htmlFor={inputId}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md border border-line bg-white p-4 shadow-card transition hover:border-blue-700 focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-offset-2",
        className,
      )}
    >
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-line text-blue-700 accent-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        {...props}
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-ink">{label}</span>
        {description ? <span className="text-xs text-muted">{description}</span> : null}
      </span>
    </label>
  );
});
