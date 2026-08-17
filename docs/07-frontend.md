---
title: PPC Coach - Frontend Architecture
file: 07-frontend.md
version: 1.0
reviewed: 2026-08-17
owner: Frontend Lead
status: active
source: split from ppc-coach-index.md (saved 2026-08-17)
---
# Frontend Architecture

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Frontend Lead
Next.js App Router · TypeScript strict · Tailwind (tokens from 02-design.md)

## Folder Structure

```
app/
  (marketing)/          // public pages
  (app)/
    dashboard/page.tsx
    lessons/...
    trainer/...
    builder/...
    report/...
    quiz/...
    coach/...
    teacher/...           // role-gated layout
    admin/...             // role-gated layout (11-admin.md)
  api/v1/...              // route handlers (05-api.md)
components/
  ui/                   // Button, Input, Card, Toast, Modal - design system only
  features/
    lessons/ trainer/ builder/ report/ quiz/ coach/ cohort/
  layout/               // Sidebar, Topbar, NavButton
lib/
  schemas/ metrics/ hooks/ utils/
server/
  repositories/ services/ actions/
```

## Component Rules

Server Components by default. Client components only when state/effect/browser API required ("use client" justified in PR).
UI components are dumb: props in, events out. Business logic lives in hooks/server actions.
One feature folder per domain; no cross-feature imports except through components/ui and lib/.
No any. Props typed explicitly. Discriminated unions for state (idle | loading | error | success).
Lists keyed by stable ids, never index.
Forms: react-hook-form + zod resolver (schema from 04-schema.md).

## State Management

| Concern | Tool |
|---|---|
| Server data | Server Components + cache tags; revalidateTag after mutations |
| Local UI state | useState/useReducer |
| Optimistic updates | useOptimistic for XP/progress ticks |
| Cross-component | URL params or lifted state - no global store unless ADR-approved |

## Data Flow (mutation path)

```
Form (client) -> zod client hint -> Server Action (12-server-actions.md)
-> service -> repository -> Prisma -> revalidateTag -> UI update + toast
```

Server is always authoritative; client validation is UX only.

## Styling Rules

Tailwind classes from design tokens; no arbitrary hex outside 02-design.md values.
No inline styles except dynamic (chart colors, widths from data).
Component variants via cva (class-variance-authority), not prop spaghetti.
Dark surfaces: sidebar/navy only; content stays light (product decision: classroom readability).

## Performance Budgets (enforced in CI)

| Metric | Budget |
|---|---|
| LCP | <= 2.5s on staging (throttled 4G) |
| TBT | <= 200ms |
| CLS | <= 0.1 |
| JS bundle (initial) | <= 180KB gzipped per route |

---
