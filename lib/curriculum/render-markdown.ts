import { marked } from "marked";
import type { LessonContent } from "@/lib/schemas/curriculum";

/**
 * Render the MDX body of one lesson to HTML.
 *
 * M0 lessons are plain markdown — no JSX components, no interactive widgets.
 * The `marked` library is a zero-dep markdown parser that handles the
 * constructs present in the M0 content (headings, paragraphs, lists, tables,
 * inline emphasis, code spans) with no configuration.
 *
 * This is intentionally NOT a full MDX runtime. The plan is to introduce
 * `next-mdx-remote` (or similar) at M2 when worksheets need interactive
 * components. See ADR-62 (curriculum content model) for the decision record.
 *
 * @param content The `lessons.content` JSONB value from the database.
 * @returns A safe HTML string. The body is trusted internal content.
 */
export function renderLessonBody(content: LessonContent): string {
  return marked.parse(content.raw, { async: false }) as string;
}
