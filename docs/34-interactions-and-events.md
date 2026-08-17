---
title: Interactions, Events and Fluidity Spec
file: 34-interactions-and-events.md
version: 1.0
reviewed: 2026-08-17
owner: Design Lead + Frontend Lead
status: active
---

# Interactions, Events and Fluidity Spec

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Design Lead + Frontend Lead

Every user-facing behavior on the platform. If an interaction isn't listed here, it doesn't ship.

## Global Interaction Principles

- Feedback <= 100ms for taps; <= 300ms for transitions; skeletons immediately for network.
- Optimistic where safe: XP ticks, lesson-complete checkmarks, chat message posting. Never optimistic: money math, grades, auth.
- Interruptible: any long action shows cancel/stop (report generate, exports).
- Reversible: destructive UI actions get Undo toasts (5s) where possible; hard deletes always confirm.
- Stable layout: fixed heights for async regions; tabular-nums; images dimensioned; no CLS.
- Touch honesty: pressed states on every tappable (active:scale-[.98] or active:bg-*).

## Master Event Map

### Navigation and shell

| # | Trigger | Action | Feedback | Edge case |
|---|---|---|---|---|
| N1 | Tap bottom-nav item | Route change | Active indicator slides; page fadeUp | Re-tap active = scroll to top |
| N2 | Practice tab tap (mobile) | Sheet: Trainer/Builder/Report | Sheet spring-up; backdrop | Esc/back gesture closes |
| N3 | Cmd+K / Ctrl+K | Command palette | Overlay w/ fuzzy nav search | Arrow keys + Enter; Esc closes |
| N4 | g+key chords (desktop) | Jump to section | Same as N1 | Ignored while typing in inputs |
| N5 | Scroll > 600px on lesson | Floating "Back to top" FAB appears | Fade | Hidden near sticky action bar to avoid overlap |
| N6 | Route guard: role insufficient | Redirect + toast "That area is for teachers/admins" | Warn toast | Logged to audit |

### Lessons and progress

| # | Trigger | Action | Feedback | Edge case |
|---|---|---|---|---|
| P1 | Tap lesson row | Open reader | fadeUp; breadcrumb updates | Offline cached copy served (badge "offline view") |
| P2 | Tap glossary term | Bottom sheet | Sheet up + haptic (if supported) | Unknown term -> fallback def |
| P3 | Mark complete | Server action (idempotent) | Checkmark pop + "+20 XP" toast + bar animates; confetti ONLY on module completion | Double-tap safe (server dedupe) |
| P4 | Complete module | Module banner + badge check | Pop anim + toast "Module complete" | |
| P5 | Level up | XP service | Gold toast + pill pulse | Queue behind current toast |
| P6 | Next lesson button | Advance; scroll top | | Last lesson -> capstone CTA |

### Practice tools

| # | Trigger | Action | Feedback | Edge case |
|---|---|---|---|---|
| T1 | Segment select (trainer) | Local state | Selected fill animates 150ms | Changing after grade -> lock until reset |
| T2 | Grade button | Validate all rows -> server grade | Button loading 12s cap | Incomplete -> shake + focus first empty + plain message |
| T3 | Result render | Score pop + rows cascade (stagger 40ms) | ScrollIntoView smooth | |
| T4 | Retry | Reset rows, keep best score | Toast "Practice round" | |
| B1 | Add keyword/builder | Push row | Row slides in; composer clears | Duplicate term -> warn chip |
| B2 | Remove row | Immediate | Row collapses | Undo toast 5s |
| B3 | Step navigation | URL ?step=n | Stepper fill anim | Validation on leaving step w/ errors -> stay + mark |
| B4 | Score campaign | Server rules engine | Same as T2/T3 | |
| P7 | Report inputs change | Debounced 250ms -> recompute metrics | Tiles update (no spinner) | Invalid -> tile shows "-" |
| P8 | Generate report | Build preview | Preview types in 120ms chunks | Copy disabled until generated |
| P9 | Copy | Clipboard API + fallback execCommand | Toast "Copied" | Permission denied -> select-all fallback |
| Q1 | Quiz option tap | Lock options, grade | Correct/wrong colors + explanation panel | Keyboard: 1-4 keys select |
| Q2 | Quiz finish | Server grade + XP | Result ring animates | Refresh mid-quiz -> resume from question index |

### Coach

| # | Trigger | Action | Feedback | Edge case |
|---|---|---|---|---|
| C1 | Send message | Append user bubble (optimistic) + disable send | Typing dots | Network fail -> bubble gets retry badge |
| C2 | Bot reply arrives | Append + smooth scroll IF near bottom | | Scrolled up -> "down New" pill instead |
| C3 | Chip tap | Fills input + auto-sends | | |
| C4 | Flag a reply (teacher/admin) | Audit event + review queue | Toast | |
| C5 | LLM disabled/over-budget | Rule engine only | No user-visible degradation except maybe shorter answers | Kill-switch transparent |

### Teacher

| # | Trigger | Action | Feedback | Edge case |
|---|---|---|---|---|
| G1 | Grading queue row open | Split view / full screen | | Stale submission (updated) -> banner "Changed since you opened" |
| G2 | Save grade | Server action | Toast + row leaves queue | Optimistic row removal + Undo |
| G3 | Assign lesson | Sheet: lesson picker + due date | Toast + appears in student's tasks | Past date blocked inline |
| G4 | Add note | Append to history | | Autosave draft per student |
| G5 | At-risk alert tap | Student detail w/ highlight | Pulse on weak module | |

### Admin

| # | Trigger | Action | Feedback | Edge case |
|---|---|---|---|---|
| A1 | Role change | Double-confirm modal (type "CHANGE") | Audit entry visible immediately | |
| A2 | Publish content | Draft->publish + version bump | Version chip updates | Validation gates (readability/jargon) block with list |
| A3 | Impersonate | Ticket id required -> timed session | Red banner "Support session" | 30-min hard limit + auto-exit toast |
| A4 | Toggle kill switch | Confirm -> flag update | Health dashboard reflects 10k rows -> email link instead |

### Forms (global)

| # | Rule |
|---|---|
| F1 | Validate on blur first, then on change after first error |
| F2 | Errors: red border + message below + aria-invalid; focus first error on submit |
| F3 | Submit button: idle -> loading(spinner, disabled) -> success(check); never disappears |
| F4 | Unsaved form leave -> confirm sheet ("Discard changes?") |
| F5 | Number inputs: inputmode="decimal" on mobile; clamp on blur |
| F6 | All selects on mobile open native picker (better UX) - custom menus desktop only |

## Fluidity and Zero-Overflow Guardrails (engineering contract)

| Risk | Rule |
|---|---|
| Long words/terms (search terms!) | Every text container: min-w-0 + break-words; user content: overflow-wrap:anywhere |
| Horizontal scroll | html,body { overflow-x: clip } as safety net + Playwright asserts at 320/360/390/768/1280/1920 |
| Fixed-height rows with dynamic text | Define min-heights; use line-clamp + expand, not overflow |
| Sticky collisions | Central spacing tokens: topbar 56, bottom-nav 64+safe; content pb accounts for both |
| iOS keyboard pushes layout | Chat input uses 100dvh + interactive-widget=resizes-content meta |
| Safe areas | Bottom nav and sticky footers: padding-bottom: env(safe-area-inset-bottom) |
| Images | max-w-full h-auto; never wider than container |
| Tables | Desktop: wrapper overflow-x-auto w/ edge fade; mobile: card transform |
| Truncated affordance | Any truncate must be expandable (tap -> full) - information must remain reachable |
| Reduced motion | motion-reduce:* variants strip transforms/animations |

## State Machine Standards

Every async region implements exactly these states - no exceptions:
empty | loading(skeleton) | error(retry) | partial | success

Component contract:

```ts
type AsyncState =
  | { status: "empty" }
  | { status: "loading"; placeholder?: T }
  | { status: "error"; message: string; retry: () => void }
  | { status: "success"; data: T };
```

Lint rule: data-fetching components must switch exhaustively over status (TS exhaustiveness enforced).

## Notification and Toast Rules

| Event class | Channel | Example copy |
|---|---|---|
| Reward | Toast (sun) | "+20 XP - lesson complete. Padayon!" |
| Achievement | Toast (gold pop) | "Badge earned: Waste Hunter" |
| System info | Toast (neutral) | "Report copied." |
| Error | Toast (danger) + inline | "We couldn't save that. Your changes are still here." |
| Rate limit | Inline banner | "You're moving fast - take a breather and try again in a few seconds." |

Never more than 3 toasts; queue FIFO; identical toasts within 2s coalesce with count badge.

## Performance Interaction Budgets

| Interaction | Budget |
|---|---|
| Tap -> visual response | 100ms |
| Route change paint | 300ms |
| Server action round-trip p95 | 600ms |
| Chat reply (rule) | 700ms incl. typing delay |
| Search/filter client-side | 50ms debounce-free |