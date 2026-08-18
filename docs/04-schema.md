---
title: PPC Coach - Schemas & Contracts (Zod)
file: 04-schema.md
version: 1.0
reviewed: 2026-08-17
owner: Backend Lead
status: active
source: split from ppc-coach-index.md (saved 2026-08-17)
---
# Schemas & Contracts (Zod)

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Backend Lead
Rule: one source of truth. Components, server actions, and API routes all import from lib/schemas/. No inline ad-hoc validation.

## File Map

```
lib/schemas/
  auth.ts        // login, register, password reset
  user.ts        // profile, roles
  lesson.ts      // module/lesson content & progress
  trainer.ts     // search-term trainer decisions
  builder.ts     // campaign builder submissions
  report.ts      // report builder inputs
  quiz.ts        // quiz submissions
  cohort.ts      // teacher grading payloads
  admin.ts       // admin mutations
  api.ts         // shared envelopes (success/error/pagination)
```

## Core Schemas (TypeScript + Zod)

```typescript
import { z } from "zod";

// Enums
export const Role = z.enum(["student", "teacher", "admin"]);
export const MatchType = z.enum(["Broad", "Phrase", "Exact"]);
export const TrainerAction = z.enum(["exact", "negative", "lower", "watch"]);
export const LessonBlockType = z.enum(["p", "list", "table", "tip", "example"]);

// Auth
export const LoginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(10).max(128),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = LoginSchema.extend({
  name: z.string().min(2).max(80),
  inviteCode: z.string().length(8).optional(),
});

// Progress & XP
export const XpEventSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().int().min(0).max(200),
  reason: z.enum(["lesson", "quiz", "trainer", "builder", "report", "coach"]),
  refId: z.string().max(120),
});

export const LevelSchema = z.object({
  xp: z.number().int().min(0),
  name: z.string(),
  nextThreshold: z.number().int().nullable(),
});

// Trainer
export const TrainerDecisionSchema = z.object({
  rowId: z.string(),
  action: TrainerAction,
});
export const TrainerSubmissionSchema = z.object({
  caseId: z.string(),
  decisions: z.array(TrainerDecisionSchema).min(1).max(20),
});
export const TrainerResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  correct: z.number().int(),
  rows: z.array(z.object({
    rowId: z.string(),
    correct: z.boolean(),
    expected: TrainerAction,
    rationale: z.string(),
  })),
});

// Campaign Builder
export const BuilderKeywordSchema = z.object({
  text: z.string().min(2).max(80).regex(/^[a-z0-9 '&\-]+$/i),
  matchType: MatchType,
  bid: z.number().min(0.05).max(50),
});
export const BuilderSubmissionSchema = z.object({
  productIdx: z.number().int().min(0).max(9),
  campaignName: z.string().min(8).max(120),
  dailyBudget: z.number().min(1).max(1000),
  keywords: z.array(BuilderKeywordSchema).min(1).max(30),
  negatives: z.array(z.string().min(2).max(40)).max(30),
});

// Report Builder
export const ReportInputSchema = z.object({
  spend: z.number().min(0).max(1000000),
  sales: z.number().min(0).max(10000000),
  clicks: z.number().int().min(0),
  impressions: z.number().int().min(0),
  orders: z.number().int().min(0),
  marginPct: z.number().min(0).max(95),
  wins: z.string().max(500),
  issues: z.string().max(500),
  nextSteps: z.string().max(500),
});
export const ReportMetricsSchema = z.object({
  acosPct: z.number().nullable(),
  roas: z.number(),
  cpc: z.number(),
  ctrPct: z.number(),
  cvrPct: z.number(),
  breakEvenPct: z.number(),
  verdict: z.enum(["profitable", "losing", "no_sales"]),
});

// Quiz
export const QuizAnswerSchema = z.object({
  questionId: z.string(),
  selectedIdx: z.number().int().min(0).max(9),
});
export const QuizSubmissionSchema = z.object({
  quizId: z.string(),
  answers: z.array(QuizAnswerSchema).min(1),
  durationSec: z.number().int().min(0).max(3600),
});

// API envelope
export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.record(z.string()).optional(),
});
export const ApiEnvelope = <T>(data: T) =>
  z.object({ ok: z.literal(true), data });
export const ApiErrorEnvelope = z.object({ ok: z.literal(false), error: ApiErrorSchema });

// Pagination
export const PageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().max(80).optional(),
});
```

## Money Math (immutable, exported from lib/metrics.ts - unit-tested, single implementation)

```typescript
acosPct  = sales > 0 ? (spend / sales) * 100 : null
roas     = spend > 0 ? sales / spend : 0
cpc      = clicks > 0 ? spend / clicks : 0
ctrPct   = impressions > 0 ? (clicks / impressions) * 100 : 0
cvrPct   = clicks > 0 ? (orders / clicks) * 100 : 0
breakEvenPct = marginPct
```

Any change requires ADR + Tech Lead + Design Lead sign-off (copy depends on these).

## Rules

Schemas export both validator and inferred type (z.infer).
Server actions/API call .parse() (throws) or .safeParse() (returns envelope) - never trust request bodies.
DB writes go through mappers: schema -> repository input. No raw request object reaches Supabase.
Versioning: breaking schema change = new version (v2/), old version kept until migration plan completes.
Tests: every schema has round-trip tests (valid passes, invalid rejects with expected code).

---
