---
title: Changelog Policy - In-App Release Communication
file: 55-changelog-policy.md
version: 1.0
reviewed: 2026-08-17
owner: Docs Owner + Product Owner
status: active
supersedes: null
superseded-by: null
source: docs/43-production-gap-audit.md (small-gaps section)
---

# Changelog Policy - In-App Release Communication

Version: 1.0 - Reviewed: 2026-08-17 - Owner: Docs Owner + Product Owner
Users should feel the product improving, without reading release notes like an engineer.

## Cadence & Sources

One changelog entry per production release (tags per doc 14 section 7).
Generated from merged PRs (conventional commits), then rewritten by a human into user-facing plain words - raw commit lists never ship to users.

## Format

```
# <Release version> - <Theme line, plain words>

## New

- <What you can do now that you couldn't before>

## Improved

- <What works better now and how you notice>

## Fixed

- <What was broken and what to do if you saw it>

## Coming soon

- <2 items max, only when committed>
```

Rules:
- Every bullet answers "what can I do differently now?" - no internals ("refactored X" is banned).
- Max 6 bullets per release; overflow -> help-center article + one bullet linking it.
- Behavior changes (even small) must link a help article (doc 53) in the same entry.
- Deprecations: announced at least 1 release ahead with date (doc 05 section 5).
- Copy bible voice; warmth allowed in the theme line only.

## Distribution

| Surface | Behavior |
|---|---|
| In-app "What's new" | Modal on first open after release; dismissible; never blocks tasks |
| /changelog page | Full archive, newest first, anchor links per release |
| Teacher digest | Behavior changes affecting grading highlighted (doc 25) |
| Optional monthly email | Digest of releases; respects notification prefs |

## Screenshots & Artifacts

One screenshot or 5-second loop per "New" item (compressed per doc 51 budgets).
Sim/feature changes show before->after when the change is visual.

## Ownership & Gates

Release checklist (doc 09 section 4) includes: changelog drafted, rewritten to plain words, screenshots added, help links verified.
Approver: Product Owner. Publisher: Docs Owner.
Internal-only changes (infra, deps) -> no user entry; kept in engineering log for audit.