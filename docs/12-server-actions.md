---
title: PPC Coach - Server Actions Conventions (Next.js)
file: 12-server-actions.md
version: 1.0
reviewed: 2026-08-17
owner: Frontend Lead
status: active
source: split from ppc-coach-index.md (saved 2026-08-17)
---
# Server Actions Conventions (Next.js)

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Frontend Lead
Server actions are the default mutation path for browser UI. API routes (05-api.md) serve integrations.

## Rules

Every action lives in server/actions/*.actions.ts, "use server" at file top.
Never trust arguments: session re-checked inside (via auth()), Zod .parse() all input, RBAC enforced.
Return a discriminated result - never throw raw errors to client:

```typescript
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string; fieldErrors?: Record<string, string[]> } };
```

Idempotency: XP/progress awards guarded by unique (userId, refId) - safe to double-submit.
After mutation: revalidateTag(...) for affected caches; return fresh counts if cheap.
No business logic in the action body - call services. Actions are ~15 lines: auth -> parse -> service -> revalidate -> result.
One action = one user intent (completeLesson, submitTrainer, saveGrade). No god-actions.

## Canonical Example

```typescript
// server/actions/trainer.actions.ts
"use server";
import { auth } from "@/server/auth";
import { TrainerSubmissionSchema } from "@/lib/schemas/trainer";
import { trainerService } from "@/server/services/trainer.service";
import { revalidateTag } from "next/cache";
import type { ActionResult } from "@/server/actions/types";

export async function submitTrainer(raw: unknown): Promise<ActionResult<TrainerResult>> {
  const session = await auth();
  if (!session) return { ok: false, error: { code: "UNAUTHENTICATED", message: "Please sign in first." } };

  const parsed = TrainerSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: { code: "VALIDATION_FAILED",
      message: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> } };
  }

  try {
    const result = await trainerService.grade(session.user.id, parsed.data);
    revalidateTag(`progress:${session.user.id}`);
    return { ok: true, data: result };
  } catch (err) {
    if (err instanceof AppError) return { ok: false, error: { code: err.code, message: err.safeMessage } };
    logger.error({ err }, "trainer.submit failed");
    return { ok: false, error: { code: "INTERNAL", message: "Something went wrong on our side. Please try again." } };
  }
}
```

## Client Usage Pattern

```tsx
const [state, formAction, pending] = useActionState(submitTrainer, initial);
// show pending on button; render state.error.fieldErrors inline; toast on state.ok
```

Disable submit while pending; keep inputs editable on error.
Optimistic XP only where idempotent and low-risk (progress ticks); never optimistic money numbers.

## Security Checklist (CI-verified via template lint)

- [ ] auth() called before any logic
- [ ] Zod parse of raw: unknown (typed params forbidden)
- [ ] No secrets/env reads beyond service layer
- [ ] No Supabase client imports in action file; use the service/repository boundary
- [ ] Error messages plain-words, no stack leakage

## Testing Requirements

Each action: unauthenticated 401 path, invalid input path, forbidden role path, success path (service mocked), idempotency test where applicable.
Contract: action result shape matches ActionResult (type-level test).

## When NOT to use server actions

Cross-origin / webhook intake -> route handlers.
Streaming responses (coach typing) -> route handler.
Anything needing custom headers -> route handler.

---
