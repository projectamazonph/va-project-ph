import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";
import {
  LessonMetaSchema,
  ModuleMetaSchema,
  type LessonMeta,
  type ModuleMeta,
} from "@/lib/schemas/curriculum";

export const COURSE_TITLE = "Amazon PPC Foundations";

export type BuildUpsertInput = {
  module: ModuleMeta;
  lessons: LessonMeta[];
  moduleId: string;
  courseId: string;
};

export type BuildUpsertOutput = {
  modules: Array<Record<string, unknown>>;
  lessons: Array<Record<string, unknown>>;
};

type ZodIssueLike = { path: PropertyKey[]; message: string };

export function buildUpsertPayload(input: BuildUpsertInput): BuildUpsertOutput {
  const moduleParsed = ModuleMetaSchema.safeParse(input.module);
  if (!moduleParsed.success) {
    throw new Error(
      `Module validation failed: ${moduleParsed.error.issues.map((i: ZodIssueLike) => `${(i.path as Array<string | number>).join(".")}: ${i.message}`).join("; ")}`,
    );
  }
  const lessons: Array<Record<string, unknown>> = [];
  for (const lesson of input.lessons) {
    const lessonParsed = LessonMetaSchema.safeParse(lesson);
    if (!lessonParsed.success) {
      throw new Error(
        `Lesson validation failed (${lesson.slug ?? "unknown"}): ${lessonParsed.error.issues.map((i: ZodIssueLike) => `${(i.path as Array<string | number>).join(".")}: ${i.message}`).join("; ")}`,
      );
    }
    const v = lessonParsed.data;
    lessons.push({
      module_id: input.moduleId,
      slug: v.slug,
      title: v.title,
      summary: v.summary,
      position: v.position,
      estimated_minutes: v.estimatedMinutes,
      is_published: true,
      content: v.content,
    });
  }
  return {
    modules: [
      {
        course_id: input.courseId,
        title: moduleParsed.data.title,
        position: moduleParsed.data.position,
      },
    ],
    lessons,
  };
}

const CONTENT_ROOT = "content/curriculum/modules";

function readModule(dir: string): { module: ModuleMeta; lessons: LessonMeta[] } {
  const metaPath = join(CONTENT_ROOT, dir, "_meta.json");
  const meta = JSON.parse(readFileSync(metaPath, "utf-8")) as ModuleMeta;
  const lessonsDir = join(CONTENT_ROOT, dir);
  const lessons: LessonMeta[] = [];
  for (const entry of readdirSync(lessonsDir)) {
    if (!entry.startsWith("lesson-") || !entry.endsWith(".mdx")) continue;
    const raw = readFileSync(join(lessonsDir, entry), "utf-8");
    const parsed = matter(raw);
    const fm = parsed.data as Partial<LessonMeta> & { estMinutes?: number };
    lessons.push({
      slug: String(fm.slug ?? ""),
      title: String(fm.title ?? ""),
      summary: String(fm.summary ?? ""),
      position: Number(fm.position ?? 0),
      estimatedMinutes: Number(fm.estimatedMinutes ?? fm.estMinutes ?? 0),
      content: { format: "mdx", raw: parsed.content },
    });
  }
  lessons.sort((a, b) => a.position - b.position);
  return { module: meta, lessons };
}

export async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const supabaseUrl = process.env.SUPABASE_URL ?? "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!dryRun && (!supabaseUrl || !serviceKey)) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required (or pass --dry-run).");
  }

  const admin = !dryRun
    ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
    : null;

  for (const entry of readdirSync(CONTENT_ROOT)) {
    if (!statSync(join(CONTENT_ROOT, entry)).isDirectory()) continue;
    const { module, lessons } = readModule(entry);

    let courseId = "dry-run";
    let moduleId = "dry-run";

    if (admin) {
      const { data: course, error: courseErr } = await admin
        .from("courses")
        .upsert(
          { slug: module.courseSlug, title: COURSE_TITLE, description: "PPC coaching program for Filipino VAs", is_published: true },
          { onConflict: "slug" },
        )
        .select("id")
        .single();
      if (courseErr || !course) {
        throw new Error(`Course upsert failed: ${courseErr?.message ?? "no row returned"}`);
      }
      courseId = course.id;

      const { data: upserted, error: moduleErr } = await admin
        .from("modules")
        .upsert(
          { course_id: courseId, title: module.title, position: module.position },
          { onConflict: "course_id,position" },
        )
        .select("id")
        .single();
      if (moduleErr || !upserted) {
        throw new Error(`Module upsert failed: ${moduleErr?.message ?? "no row returned"}`);
      }
      moduleId = upserted.id;
    }

    const payload = buildUpsertPayload({ module, lessons, moduleId, courseId });
    console.warn(`[compiled] course=${module.courseSlug} module=${module.title} lessons=${payload.lessons.length} dryRun=${dryRun}`);

    if (admin) {
      const { error: lessonErr } = await admin
        .from("lessons")
        .upsert(payload.lessons, { onConflict: "module_id,slug" });
      if (lessonErr) {
        throw new Error(`Lesson upsert failed for ${module.title}: ${lessonErr.message}`);
      }
    }
  }
}

if (process.argv[1]?.endsWith("compile-mdx.ts")) {
  void main();
}
