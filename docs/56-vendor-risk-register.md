---
title: Vendor Risk Register and Third-Party Management
file: 56-vendor-risk-register.md
version: 1.0
reviewed: 2026-08-17
owner: Finance/Legal owner + Security Lead
status: active
supersedes: null
superseded-by: null
source: docs/43-production-gap-audit.md (small-gaps section)
---

# Vendor Risk Register and Third-Party Management

Version: 1.0 - Reviewed: 2026-08-17 - Owner: Finance/Legal owner + Security Lead
Every third party that touches our data or critical path is listed, scored, and reviewed. No shadow vendors.

## Tier Definitions

| Tier | Meaning | Review cadence |
|---|---|---|
| Critical | Down = SEV-1, or holds PII/payment data | Quarterly |
| Important | Down = degraded product; limited data | Bi-annually |
| Routine | Replaceable within a day; no sensitive data | Annually |

## Risk Score

Score = Criticality (1-3) x Data sensitivity (1-3) x Lock-in (1-3). Scores at least 18 need an exit plan on file and an accountable owner; at least 24 needs dual mitigation (alternative identified + tested).

## Register (launch set - update on every change)

| Vendor | Function | Tier | Data handled | DPA/zero-retention | Score | Exit plan | Owner | Next review |
|---|---|---|---|---|---:|---|---|---|
| Vercel | App hosting | Critical | App traffic, session artifacts | DPA yes | 18 | Dockerfile path to Fly/Render (ADR 0001 alt) | DO | q+1 |
| Managed PG (Neon/Supabase) | Primary DB | Critical | All system data | DPA yes | 27 | pg_dump restore to alt provider; tested quarterly | DO | q+1 |
| Redis provider | Limits/jobs/cache | Important | No PII (by design) | DPA yes | 12 | Rebuild ephemeral; jobs re-run (idempotent) | DO | 2x/yr |
| Xendit | GCash/PH payments | Critical | Payment metadata (no card PAN to us) | Agreement yes | 18 | Stripe fallback for cards; manual activation runbook | FO | q+1 |
| Stripe | Card billing | Critical | Payment metadata | DPA yes | 18 | Xendit links for one-off; subscriptions pause policy | FO | q+1 |
| Email provider | Transactional/digest | Important | Email address, name | DPA yes | 12 | Alt provider adapter (doc 08 LSP) swap at most 1 day | DO | 2x/yr |
| LLM vendor | Coach fallback answers | Important | Question text (pseudonymous) | Zero-retention yes (doc 24 section 7) | 12 | Kill-switch -> rule engine (instant) | AI | q+1 |
| Sentry / observability | Errors, RUM | Important | Error payloads (PII-scrubbed) | DPA yes | 9 | Log-only fallback | DO | 2x/yr |
| Cloudflare | CDN/WAF/DNS | Critical | Request metadata | DPA yes | 18 | Origin direct with degraded cache | DO | q+1 |
| Object storage (R2/S3) | Certificates, exports | Important | Artifacts (pseudonymous) | Standard yes | 9 | Cross-region copy; regenerate certs | DO | 2x/yr |

## Onboarding a New Vendor (checklist)

- [ ] ADR-lite note: why existing stack can't cover it (anti-sprawl rule)
- [ ] Security review: data flows, retention, encryption, breach history
- [ ] DPA/zero-retention executed before any data moves
- [ ] Cost modeled in FinOps budget (doc 45 section 8)
- [ ] Exit plan written BEFORE adoption
- [ ] Secrets scoped per environment; least-privilege keys
- [ ] Register row added + review date set (this doc, same PR)

## Trigger-Based Reviews (outside cadence)

Vendor breach disclosure, material TOS/pricing change, new data category requested, two+ reliability incidents in a quarter -> review within 14 days, Security Lead + owner.

## Vendor Incident Protocol

1. Confirm scope: which of our components/data affected (map via register).
2. If user-facing: status page update per doc 54 within its SLAs.
3. Mitigate: switch to mitigation/exit path if the vendor ETA exceeds our SLO burn.
4. Record in audit log; post-incident note includes vendor response quality (feeds next review).