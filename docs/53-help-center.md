---
title: Help Center - User-Facing Knowledge Base
file: 53-help-center.md
version: 1.0
reviewed: 2026-08-17
owner: Docs Owner + Support (doc 28)
status: active
supersedes: null
superseded-by: null
source: docs/43-production-gap-audit.md (small-gaps section)
---

# Help Center - User-Facing Knowledge Base

Version: 1.0 - Reviewed: 2026-08-17 - Owner: Docs Owner + Support (doc 28)
Host: learn.thevaproject.ph. The help center exists to deflect repeat tickets and teach self-service - in the same voice as the product (doc 35).

## Principles

- Plain words, Tagalog-friendly summaries for emotional topics (billing stress, account fear).
- Every article = one question answered. If two questions, split.
- Written from real ticket drivers (doc 28 section 5 loop): top 5 contact drivers each week must have an article within 7 days.
- In-app contextual links route here; the Coach routes here too ("full guide" link at end of rule answers).
- Freshness: articles are living docs - frontmatter, reviewed date, owner, linked code/feature (doc 15 rules).

## Information Architecture

learn.thevaproject.ph
- Getting started
  - Create your account & verify email
  - How the path works (modules -> practice -> coaching -> certificate)
  - Using the app on your phone (data-saver, offline, install)
  - "I have zero experience - is this for me?"
- Learning & practice
  - How XP, levels, and badges work
  - Using the simulators (one article per sim, linked from sim briefing)
  - Why my trainer score was low (reading the debrief)
  - Glossary: every term in one place (mirrors app glossary)
  - Offline mode: what saves and what waits
- Account & billing
  - Plans, prices, and what's free forever
  - Paying with GCash / cards / bank
  - Upgrading, downgrading, canceling (and what happens to your data)
  - Refunds: the 14-day rule
  - Failed payment & grace period explained
  - Scholarships: how to apply
- Certificates & jobs
  - Earning your certificate (capstone requirements)
  - Using your certificate & job kit in applications
  - Sharing your progress safely (avoiding scams)
- Teachers & cohorts
  - Joining a cohort / linking a teacher
  - Assignments and grading: what to expect
  - Requesting a re-review (appeals, doc 50 section 4)
- Troubleshooting
  - I can't log in / reset my password
  - Progress looks wrong after offline use
  - Videos/images won't load on slow data
  - "Something went wrong" - what to try first
  - Report a problem (what happens next)
- Policies (plain summaries of docs 26/49 artifacts)
  - Terms in plain words
  - Privacy in plain words
  - Accessibility statement
  - Community rules (doc 48 section 6)

## Article Template (mandatory)

```
---
title:
owner:
reviewed: YYYY-MM-DD
linked_feature:
locale: en, tl
---

# <title>

Short answer: <2-3 sentences, plain words>

## How to do it (steps if applicable)
1. ...
2. ...

## What to expect
- ...

Still stuck?
- Email support@thevaproject.ph (response in 24h)
- Open the in-app chat (response in 1h during business hours)
- For billing/account, attach screenshot of the error (we scrub it before processing)

Related:
- <article 1>
- <article 2>
```

Feedback widget on every article: "Did this answer your question? Yes / Not really" -> weekly report to Docs Owner; "Not really" >30% = rewrite ticket.

## In-App Integration

| Surface | Behavior |
|---|---|
| Error states (doc 34) | "Learn more" links to matching troubleshooting article |
| Sim briefing | "How this works" -> sim article |
| Billing pages | Prices/plan lines link to billing articles |
| Coach answers | Rule answers may append a help-center deep link |
| Search (Cmd+K) | Help articles indexed alongside app navigation |

## Localization

Every article ships EN; TL version required for: billing, refunds, account deletion, scam-safety (market reality).
Screenshots localized only when text appears in them.

## Metrics

| Metric | Target |
|---|---|
| Ticket deflection (viewed article -> no ticket in 24h) | at least 40% |
| Search zero-result rate | at most 8% (zero-results feed the gap queue) |
| "Helpful" rate | at least 80% |
| Time to publish for top driver | at most 7 days |

## Ops

New feature checklist (doc 47 section 7) includes "help article drafted" - no GA without it.
Quarterly prune: articles with <500 views/quarter AND >20% "Not really" rating get archived (not deleted - they keep URL for SEO).