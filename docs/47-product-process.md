---
title: Product Process - Requirements, Prioritization, Experiments
file: 47-product-process.md
version: 1.0
reviewed: 2026-08-17
owner: Product Owner
status: active
supersedes: null
superseded-by: null
source: 43-production-gap-audit.md (production-readiness framework section)
---

# Product Process - Requirements, Prioritization, Experiments

Version: 1.0 - Reviewed: 2026-08-17 - Owner: Product Owner

How work becomes product at VA Project Philippines: idea to evidence to spec to build to beta to GA to review. Lightweight, but nothing ships without it.

## Work Pipeline

Inbox - Triage (weekly) - Discovery (optional) - PRD-lite - Design - Build (TDD) - Beta - GA - Post-launch review (day 14 and day 45).

Every item carries: persona link (see 32-personas-and-stories.md), metric hypothesis, doc impact list.

## PRD-lite Template (max 1 page)

```
Feature:
Persona and story: (from 32-personas-and-stories.md)
Problem evidence: tickets / analytics / interviews (links)
Outcome hypothesis: "If we ship X, <metric> moves by Y because Z."
Success metric + guardrail metric:
Scope: in / explicitly out
UX: wireframe link (33-wireframes-mobile-first.md pattern) . Copy: bible references (35-copy-bible.md)
Edge cases and traps:
Data/privacy impact: (compliance-legal gap file 26 check)
Risks and rollback:
Docs touched:
Approval: Product Owner + Design Lead (+ Tech Lead if infra/schema; + Security per 03-security.md section 10).
```

## Prioritization (RICE-P: persona-weighted)

Score = (Reach x Impact x Confidence / Effort) x PersonaPromiseMultiplier.

Impact scale: 3 = job-outcome, 2 = learning outcome, 1 = convenience.

PersonaPromiseMultiplier: 1.2 if it fulfills a promise in 32-personas-and-stories.md design implications for a priority persona; else 1.0.

Quarterly theme limits: at most 2 big bets + maintenance + reliability (error budget policy, observability-slo gap file 21).

## Experimentation Standard

| Rule | Standard |
|---|---|
| When to A/B | Change touches conversion, retention, or money; or genuine disagreement with evidence |
| Guardrails (never let degrade) | activation rate, lesson completion, SEV count, unsubscribe rate |
| Minimum run | Power calc recorded before start; at least 1 full weekly cycle; no peeking stops |
| Decision | Pre-registered primary metric; tie - keep control; learning logged either way |
| Tooling | Feature flags (repo-artifacts gap file 29 section 7) + event taxonomy (analytics gap file 23); analysis notebook archived |
| Ethics | No dark patterns, no fake scarcity, no shaming variants (brand promise) |

Experiment log: docs/experiments/EX-NNN.md (hypothesis, dates, result, decision) - living docs rules apply.

## Feature Gates and Kill Criteria

Everything risky ships behind a flag with an owner + removal date (repo-artifacts gap file 29 section 7).

Kill criteria written in PRD-lite before build: e.g., "If adoption <2pp, remove."

Post-launch review outputs: keep/improve/kill + doc updates.

## Cadence and Rituals

| Rhythm | Ritual |
|---|---|
| Weekly | Triage (30m): inbox, support drivers, experiment checks |
| Bi-weekly | Roadmap review vs milestones (see open-questions gap file 18 when written) |
| Monthly | Metrics review vs analytics gap file 23 KPIs; doc day |
| Quarterly | Theme planning; persona validation interviews (32-personas-and-stories.md); pricing review (46-billing-payments.md) |

## Definition of Shipped

Code green + docs updated + analytics events firing (verified in staging) + support canned replies ready (support-experience gap file 28) + help center article drafted (future 53-help-center.md) + rollback known + beta feedback channel tagged.