---
title: System Architecture
file: 44-architecture.md
version: 1.0
reviewed: 2026-08-17
owner: Tech Lead
status: active
supersedes: null
superseded-by: null
source: 43-production-gap-audit.md (production-readiness framework section)
---

# System Architecture

Version: 1.0 - Reviewed: 2026-08-17 - Owner: Tech Lead

Single source of truth for how the system fits together. Change it via ADR.

## System Context (C4 Level 1)

```
                 ┌───────────────────────────────────────────────┐
                 │        The VA Project Philippines             │
                 └───────────────────────────────────────────────┘
  Students (phone-first)──►┌─────────────┐◄──Teachers (phone/desktop)
  Admins ─────────────────►│  Web app    │◄── Coach content authors
                           │ (Next.js)   │
                           └──┬───┬───┬──┘
            Postgres ◄────────┘   │   └────────► Redis
                                  │
      ┌──────────────┬────────────┼─────────────┬──────────────┐
      ▼              ▼            ▼             ▼              ▼
  Email provider  LLM vendor   Payments     Error/log svc   Object storage
  (transactional) (coach)     (Xendit/Stripe)              (artifacts, certs)
                                                     (future) Amazon Ads API
```

### Actors and needs

| Actor | Primary device | Critical need |
|---|---|---|
| Student | Android phone, prepaid data | Fast, offline-tolerant, cheap on data |
| Teacher | Phone + shared laptop | Grading speed, cohort oversight |
| Admin | Desktop | Control + audit |
| Author | Desktop | Safe content publishing |

## Container View (C4 Level 2)

| Container | Tech | Responsibility | Scales by |
|---|---|---|---|
| Web app (SSR + client) | Next.js App Router | Pages, server actions, public site | Edge/app replicas |
| API routes | Next.js route handlers | Integrations, webhooks, coach streaming | same as web |
| Worker | Node + BullMQ | Digests, at-risk flags, webhook retries, purge jobs | queue shards |
| Postgres | Managed PG 16 + replica | System of record | read replica, partition later |
| Redis | Managed | Rate limits, sessions cache, jobs, flags | single-cluster if needed |
| Object storage | S3-compatible | Certificates, exports, uploads | n/a |
| CDN | Edge | Static, images, cached pages | n/a |

## Key Data Flows

### F1 - Lesson completion (hot path)

tap to server action to authz to progressService (idempotent insert on (userId,lessonId)) to xpService award (unique refId) to revalidateTag(progress:) to optimistic UI toast.

Failure modes: duplicate submit (safe by design); DB down to friendly retry, nothing lost (no client-only state).

### F2 - Simulator submission (hot path)

decisions JSON to zod to simService.grade (pure engine, seeded) to SimAttempt write to XP if first graded tier to debrief render (expert solution read-only).

### F3 - Coach question

question to rate limit to rule engine to hit? answer : (llmEnabled? LLM+filter : fallback) to store conversation (ruleHit flag) to stream to client.

### F4 - Payment (GCash/card)

checkout session (Xendit/Stripe) to user pays async to webhook (signature-verified) to entitlementService.activate (idempotent on invoice id) to email receipt to audit.

Never grant entitlements from client; only from verified webhook.

### F5 - Teacher grading

queue (submissions) to teacher view to rubric + comment to grade write (optimistic w/ undo) to student notification to audit.

## Non-Functional Requirements (binding)

| NFR | Target | Enforced in |
|---|---|---|
| Concurrent students at peak (cohort nights) | 5,000 | load tests, see testing-quality gap file 20 |
| Page weight first visit (mobile 360px) | at most 300KB critical path | 51-offline-performance.md |
| API p95 | 400ms | observability-slo gap file 21 |
| Availability | 99.9% per 30d | observability-slo gap file 21 |
| RPO / RTO | 5 min / 15 min | 45-infrastructure.md and 09-ci-cd.md |
| Data residency | PH-friendly processors; disclose transfers | 49-ph-compliance.md |

## Failure-Mode Table (design drivers)

| Failure | User-visible behavior | System behavior |
|---|---|---|
| Postgres down | "We're having trouble saving - your place is kept" | reads from replica where safe; writes queued/retry |
| Redis down | logins slower; writes 503 (fail closed) | alerts; limits degrade per 10-rate-limiting.md |
| LLM vendor down | Coach answers from rule engine only | kill-switch automatic on error budget |
| Email provider down | Delays on non-critical mail | queue with backoff; auth-critical retries hard |
| CDN outage | Slower assets | origin fallback |
| Web worker crash | Digests late | supervisor restart; jobs idempotent |

## Architecture Decisions Register (seed entries)

| ADR | Decision | Rationale |
|---|---|---|
| 0001 | Next.js App Router + server actions as default mutation path | One deployable, SSR for SEO landing, actions = less API surface |
| 0002 | Managed Postgres + Redis over self-host | Team size; NFRs beat control |
| 0003 | Simulation engine pure and seeded in app (no external services) | Determinism, cost, offline dev |
| 0004 | Xendit primary for GCash; Stripe for cards/international | PH payment reality (see 46-billing-payments.md) |
| 0005 | No native mobile app at launch; PWA-ready web | Persona device reality (see 32-personas-and-stories.md, 51-offline-performance.md) |

Add ADRs via the adr-template (planned doc 17). This table mirrors docs/adr/ index once that folder exists.