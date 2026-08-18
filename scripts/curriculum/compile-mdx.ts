import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { createClient } from "@supabase/supabase-js";
import {
  LessonSchema,
  ModuleSchema,
  type LessonInput,
  type ModuleInput,
} from "@/lib/schemas/curriculum";

export type BuildUpsertInput = {
  module: ModuleInput;
  lessons: LessonInput[];
  moduleId: string;
};

export type BuildUpsertOutput = {
  modules: Array<Record<string, unknown>>;
  lessons: Array<Record<string, unknown>>;
};

export function buildUpsertPayload(input: BuildUpsertInput): BuildUpsertOutput {
  const moduleParsed = ModuleSchema.safeParse(input.module);
  if (!moduleParsed.success) {
    throw new Error(
      `Module validation failed: ${moduleParsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
    );
  }
  const validatedModule = moduleParsed.data;

  const lessons: Array<Record<string, unknown>> = [];
  for (const lesson of input.lessons) {
    const lessonParsed = LessonSchema.safeParse(lesson);
    if (!lessonParsed.success) {
      throw new Error(
        `Lesson validation failed (${lesson.slug ?? "unknown"}): ${lessonParsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`,
      );
    }
    const v = lessonParsed.data;
    lessons.push({
      module_id: input.moduleId,
      slug: v.slug,
      title: v.title,
      summary: v.summary,
      position: v.position,
      est_minutes: v.estMinutes,
      body: v.body,
    });
  }

  return {
    modules: [
      {
        slug: validatedModule.slug,
        title: validatedModule.title,
        goal: validatedModule.goal,
        position: validatedModule.position,
        est_minutes: validatedModule.estMinutes,
      },
    ],
    lessons,
  };
}

const CONTENT_ROOT = "content/curriculum/modules";

function readModule(dir: string): { module: ModuleInput; lessons: LessonInput[] } {
  const metaPath = join(CONTENT_ROOT, dir, "_meta.json");
  const meta = JSON.parse(readFileSync(metaPath, "utf-8")) as ModuleInput;
  const lessonsDir = join(CONTENT_ROOT, dir);
  const lessons: LessonInput[] = [];
  for (const entry of readdirSync(lessonsDir)) {
    if (!entry.startsWith("lesson-") || !entry.endsWith(".mdx")) continue;
    const raw = readFileSync(join(lessonsDir, entry), "utf-8");
    const parsed = matter(raw);
    const fm = parsed.data as Partial<LessonInput>;
    lessons.push({
      slug: String(fm.slug ?? ""),
      title: String(fm.title ?? ""),
      summary: String(fm.summary ?? ""),
      position: Number(fm.position ?? 0),
      estMinutes: Number(fm.estMinutes ?? 0),
      body: parsed.content,
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

  const modules: BuildUpsertInput[] = [];
  for (const entry of readdirSync(CONTENT_ROOT)) {
    if (!statSync(join(CONTENT_ROOT, entry)).isDirectory()) continue;
    const { module, lessons } = readModule(entry);
    if (!dryRun) {
      const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      const { data: upserted, error } = await admin
        .from("modules")
        .upsert(
          {
            slug: module.slug,
            title: module.title,
            goal: module.goal,
            position: module.position,
            est_minutes: module.estMinutes,
          },
          { onConflict: "slug" },
        )
        .select("id")
        .single();
      if (error || !upserted) {
        throw new Error(`Module upsert failed: ${error?.message ?? "no row returned"}`);
      }
      modules.push({ module, lessons, moduleId: upserted.id });
    } else {
      modules.push({ module, lessons, moduleId: "dry-run" });
    }
  }

  for (const m of modules) {
    const payload = buildUpsertPayload(m);
    console.warn(`[compiled] module=${m.module.slug} lessons=${payload.lessons.length} dryRun=${dryRun}`);
    if (!dryRun) {
      const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      const { error } = await admin
        .from("lessons")
        .upsert(payload.lessons, { onConflict: "module_id,slug" });
      if (error) {
        throw new Error(`Lesson upsert failed for ${m.module.slug}: ${error.message}`);
      }
    }
  }
}

// Run main() when executed directly (tsx) but not when imported by tests.
if (process.argv[1]?.endsWith("compile-mdx.ts")) {
  void main();
}
