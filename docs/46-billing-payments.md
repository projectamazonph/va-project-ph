---
title: Billing, Payments and Entitlements
file: 46-billing-payments.md
version: 1.0
reviewed: 2026-08-17
owner: Tech Lead and Finance owner
status: active
supersedes: null
superseded-by: null
source: 43-production-gap-audit.md (production-readiness framework section)
---

# Billing, Payments and Entitlements

Version: 1.0 - Reviewed: 2026-08-17 - Owner: Tech Lead + Finance owner

Money in must be boring, auditable, and Filipino-friendly. GCash first, cards second, receipts always.

## Plans and Entitlements (single source)

| Plan | Price | Entitlements |
|---|---|---|
| Starter | PHP 0 forever | Fundamentals (Modules 0-7), all simulator Tier 1, coach rule engine, community |
| Pro | PHP 499/mo or PHP 4,499/yr | Full curriculum incl. advanced track, all sim tiers, certificate + job kit, priority coach, progress exports |
| Cohorts | PHP 1,999 per 4-week cohort | Pro + live cohort seat, weekly teacher reviews, alumni network |
| Scholar | PHP 0 / subsidized | Pro features; funded slots (see section below) |

Enforcement: entitlement checks server-side in one service (`entitlementService.can(userId, capability)`); UI hides gates gracefully with plain-words upgrade cards (see 35-copy-bible.md).

## Payment Rails

| Rail | Provider | Use |
|---|---|---|
| GCash / GrabPay / PH banks | Xendit (primary) | PH customers; QR + wallet checkout |
| Cards, intl | Stripe | Intl students, recurring card billing |
| Manual/PO | offline + admin activation | Agencies/schools (audit-logged, dual approval) |

Rules: no card/wallet data ever touches our servers (hosted checkout / payment links). Recurring: Stripe subscriptions for cards; Xendit recurring where supported, else monthly payment links with 7-day grace. Currency: PHP display; Stripe handles FX for foreign cards.

## Webhook and Entitlement Flow

```
checkout - provider - POST /api/v1/webhooks/
  1. verify signature (reject otherwise, audit)
  2. idempotency: eventId processed once
  3. map event to entitlement op:
     payment_succeeded   - activate(plan, periodEnd)
     subscription_failed - grace(7d) - downgrade
     refunded            - revoke + flag support
  4. write invoice record + email receipt (BIR-compliant fields, see Tax section)
  5. audit entry
```

Entitlements derive ONLY from verified events; client never asserts paid state.

## Lifecycle Rules

| Event | Behavior |
|---|---|
| Trial/expiry | 3 reminders (d-7, d-3, d-1) per notifications gap file 25; access ends at 00:00 PHT |
| Payment failure | Retry schedule (day 0/3/7); grace access 7 days; then to Starter (never delete data) |
| Upgrade/downgrade | Immediate proration up; downgrade at period end |
| Refunds | at most 14 days self-serve per support-experience gap file 28 section 6; beyond to support with audit reason |
| Chargeback | Freeze plan pending review; plain-words email; evidence pack exported |
| Cancellation | Self-serve, one click, exit survey (3 choices max); data retained per compliance-legal gap file 26 |

## Tax, Receipts and Compliance (PH - details in 49-ph-compliance.md)

12% VAT handling on prices (VAT-inclusive display; show breakdown on receipt).

Official/e-receipt fields per BIR rules at time of launch (Finance owner verifies before first live peso).

All invoices stored immutable (object storage) with sequential numbering service.

Withholding support for agency/school POs (Finance workflow).

## Fraud and Abuse Controls

| Threat | Control |
|---|---|
| Free-tier abuse (multi-account) | Device/email heuristics; XP export tied to verified account; rate limits |
| Stolen cards | Provider 3DS/SCA; velocity checks; chargeback alerts |
| Shared paid accounts | Concurrent session limits (2 devices); session list in Settings; gentle warning copy |
| Coupon abuse | Single-use codes, server-validated, budget caps per campaign |

## Schema Additions

```
model Plan          { id String @id; slug String @unique; name String; pricePhp Int; interval String; capabilities Json }
model Subscription  { id String @id; userId String; planId String; provider String; providerSubId String
                      status String; currentPeriodEnd DateTime; graceUntil DateTime?
                      @@unique([provider, providerSubId]) }
model Invoice       { id String @id; userId String; subId String?; amountPhp Int; vatPhp Int
                      providerEventId String @unique; receiptUrl String?; createdAt DateTime @default(now()) }
model PaymentEvent  { id String @id; provider String; eventId String @unique; type String; payload Json; processedAt DateTime? }
```

## Scholarship and Financial Inclusion Program (outline)

Slots funded by: 5% of Pro revenue + partner sponsorships (future partnerships.md).

Application: short form (situation + goal); reviewed monthly by committee (RACI: Product Owner + Finance).

Mechanics: Scholar plan code, 3-month terms, renewal requires progress (at least 50% curriculum or cohort attendance) - supportive, not punitive.

Reporting: slot count, completion rates, outcomes to quarterly transparency post (community trust engine).

## Tests (beyond testing-quality gap file 36 pattern)

Webhook signature rejection test; idempotent double-delivery test.

Entitlement matrix test: every plan x every capability.

Dunning timeline test with virtual clock.

Sandbox end-to-end: GCash success, failure-to-grace-to-downgrade, refund-to-revoke.

Money display test: VAT-inclusive math exact (integer centavos; no float money).