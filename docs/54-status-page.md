---
title: Status Page and Service Communication
file: 54-status-page.md
version: 1.0
reviewed: 2026-08-17
owner: DevOps Lead
status: active
supersedes: null
superseded-by: null
source: docs/43-production-gap-audit.md (small-gaps section)
---

# Status Page and Service Communication

Version: 1.0 - Reviewed: 2026-08-17 - Owner: DevOps Lead
Host: status.thevaproject.ph. Trust infrastructure: when things break, students should hear it from us first, in plain words, fast.

## Components & States

| Component | What it covers |
|---|---|
| Website & App | Landing, dashboard, lessons |
| Sign-in | Auth, password reset |
| Practice & Simulators | All sims, grading |
| Coach | Rule engine + LLM path |
| Payments | Checkout, GCash/card, entitlements |
| Notifications | Email, in-app |
| Teacher Tools | Cohort, grading queue |

States: Operational, Degraded performance, Partial outage, Major outage, Maintenance.

## Update Rules

| Severity | First update | Follow-ups | Resolution note |
|---|---|---|---|
| SEV-1 | at most 15 min | every 30 min | at most 30 min after fix |
| SEV-2 | at most 30 min | every 2 h | same day |
| SEV-3 | optional batch | - | weekly summary |
| Maintenance | at least 48 h notice | start/end | on completion |

Auto vs human: external synthetic checks may auto-mark Degraded; escalation to outage states is always human-confirmed (avoid false alarms eroding trust).

## Templates

Incident created (EN):
"What's happening: Some students can't submit practice work. We're on it.
Who's affected: Practice & Simulators.
Your progress is safe - nothing is lost; submissions will sync or can be retried.
Next update in 30 minutes."

TL companion line (where posted in community channels):
"May problema sa pagsusumite ng practice. Ginagawa na namin. Ligtas ang progress niyo - mag-u-update kami sa loob ng 30 minuto."

Resolved:
"Fixed as of 14:32 PHT. Duration: 41 minutes. Cause: <one sentence>. No student work was lost. A full summary will be published within 48 hours."

Maintenance:
"Scheduled maintenance: <date>, 02:00-03:00 PHT (low-usage window). Expect brief sign-in interruptions. Lessons already open will keep working offline."

Rules: no stack traces, no vendor-shaming ("a payments provider issue" is fine), always answer "is my progress/data safe?" if relevant.

## Subscription & Distribution

Email subscribe on status page; RSS available.
Active incident banner on app topbar (links to status page) - dismissed per incident id.
Community channels (doc 48 section 6) get the TL companion line from the same incident record (single source).

## Post-Incident Summaries

Published within 48h for SEV-1/2 (from doc 16 post-mortem, sanitized): what happened (timeline), impact (who/what/how long), root cause (plain words), what we changed, how to reach support if still affected. Archived on status page for 12 months.

## Monthly Transparency

One-line monthly uptime per component published (dashboard screenshot or table) - builds the "they're honest" reputation the market rewards.