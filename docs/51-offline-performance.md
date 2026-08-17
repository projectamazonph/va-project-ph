---
title: Offline and Data-Light Engineering (PH Connectivity Spec)
file: 51-offline-performance.md
version: 1.0
reviewed: 2026-08-17
owner: Frontend Lead
status: active
supersedes: null
superseded-by: null
source: 43-production-gap-audit.md (production-readiness framework section)
---

# Offline and Data-Light Engineering (PH Connectivity Spec)

Version: 1.0 - Reviewed: 2026-08-17 - Owner: Frontend Lead

Personas (see 32-personas-and-stories.md) made this a product pillar; this is the engineering contract. Reference test device: 3-4GB RAM Android, Chrome, throttled slow-4G (1.6Mbps/150ms).

## Budgets (CI-enforced)

| Budget | Limit |
|---|---|
| Critical path (HTML+CSS+min JS) first visit | at most 300KB gz |
| Full app JS installed | at most 1.2MB gz (code-split; simulators lazy) |
| LCP (reference device, slow-4G) | at most 2.5s |
| TTI | at most 4s |
| CLS | at most 0.05 |
| Any single lesson page total transfer | at most 150KB |
| Images | AVIF/WebP; hero at most 80KB; below-fold lazy; explicit dimensions |
| Video | None autoplaying, ever; click-to-load with size disclosed |
| Fonts | 2 families, 4 weights max, display=swap, preloaded |

## Offline Capability (PWA-path, web first)

| Feature | Behavior |
|---|---|
| Lesson content | Cached on first open (module-level bundles); "Available offline" badge |
| Drafts and answers | IndexedDB autosave (every change, debounce 500ms) |
| Offline actions | Queue mutations (complete lesson, submit attempt) to sync on reconnect, idempotent server-side |
| Conflicts | Server wins for grades/XP; user content merges (last-write for notes, append for attempts) |
| Offline banner | Persistent slim bar: "You're offline - progress saves and will sync." (35-copy-bible.md) |
| Manifest/icons | Installable PWA; no forced install prompts before first value moment (lesson completed) |

Service worker policy: precache app shell + active module; runtime-cache glossary/sim cases; version-purged; kill-switch flag disables SW if misbehaving.

## Data-Saver Mode (user toggle, default ON for new PH signups)

No non-critical images below fold (tap-to-reveal placeholders).

Charts rendered as simple bars (no Chart.js download).

Prefetch off; navigation on-demand.

Estimated data per session shown in Me to Privacy/Data ("This week: ~2.1MB used").

## Resilience Patterns

| Situation | Pattern |
|---|---|
| Flaky uploads/POSTs | Retry with exponential backoff x3, then "Saved locally - we'll sync" |
| Brownout mid-quiz | Resume from question index (34-interactions-and-events.md Q2) |
| Slow coach replies | Rule-engine instant answer + optional "detailed answer loading" |
| Stale cache after release | SW update toast: "New version ready - refresh when convenient" (never force mid-lesson) |

## Low-End Device Rules

Virtualize lists > 100 rows (trainer T3, bulk clinic, admin tables).

No layout animations on deviceMemory at most 4 except opacity.

Debounce heavy recomputes (report metrics) 250ms.

Avoid 100vh; use 100dvh + fallbacks.

## Measurement

| Tool | Use |
|---|---|
| Lighthouse CI on reference profile | PR gate (scores above) |
| RUM (web-vitals to observability-slo gap file 21) | Real-device p75 dashboard by network type |
| Synthetic | Lesson load + trainer submit on throttled profile, hourly |
| Data accounting | Per-route transfer report in CI weekly; regressions >10% block merge |

## Testing

Offline suite (Playwright): airplane-mode flows - open lesson, answer quiz, reconnect, verify sync + single XP award.

Storage-quota edge: IndexedDB full to graceful degrade (no crash, warn once).

SW update matrix: new version mid-session never loses a draft.