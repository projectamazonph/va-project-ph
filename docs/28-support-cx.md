---
title: Support and Customer Experience
file: 28-support-cx.md
version: 1.0
reviewed: 2026-08-17
owner: Product Owner
status: active
---

# 28 - Support and Customer Experience

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Product Owner

## Tiers

| Tier | Who | Handles | SLA (first response) |
|---|---|---|---|
| T0 | In-app coach + help center | "What is ACOS?" type questions | instant |
| T1 | Support inbox | account, progress, billing basics | 1 business day |
| T2 | Product team rotation | bugs, data issues, teacher tooling | 2 business days |
| T3 | Tech Lead / DevOps | SEV incidents, security | per 16-runbooks.md |

## Channels

- In-app "Flag a problem" (auto-attaches route + userId, never PII dumps).
- support@ email -> ticketing.
- Teacher Slack/channel (beta program only).
- No phone support pre-GA.

## Canned Response Library (plain words, editable placeholders)

| Situation | Template core |
|---|---|
| Student can''t log in | Reset link + check caps/email; security note |
| XP "missing" | Explain first-attempt-only awards; verify in admin; correct if our bug (always apologize + fix) |
| Teacher can''t see student | Cohort link check; admin re-link steps |
| Billing question | Route to Stripe self-serve; escalate refunds > policy to owner |
| Data deletion request | Self-serve path + 30-day grace explanation |
| Bug acknowledged | What we know, what we''re doing, when we''ll update (<=48h) |

## Bug Intake Quality Bar

Every ticket entering T2 must have: repro steps or session context, expected vs actual, affected role, severity guess. T1 owns enrichment; do not forward garbage upstream.

## Feedback Loop

- Weekly: top 5 contact drivers reported to product; each gets a disposition (fix / explain better in product / won''t fix + why).
- Recurring confusion -> product copy change (22-content-curriculum-ops.md) over more support docs.

## Billing Support (stub until M8)

- Plans: Student (free/seat), Teacher cohort pack, Agency (multi-teacher) - pricing ADR pending.
- Refund policy: 14-day, no questions, self-serve; abuse tracked.
- Dunning: Stripe smart retries + email at failure, day 3, day 7; grace access 7 days before downgrade.
- Invoices auto-generated; agency plans get PO support.
