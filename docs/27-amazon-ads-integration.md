---
title: Amazon Advertising Integration - Design Spec (Future Phase)
file: 27-amazon-ads-integration.md
version: 0.1 DRAFT
reviewed: 2026-08-17
owner: Backend Lead
status: draft - design only, no implementation until M8+ and explicit ADR go decision
---

# 27 - Amazon Advertising Integration - Design Spec (Future Phase)

Version: 0.1 DRAFT · Reviewed: 2026-08-17 · Owner: Backend Lead

**Status:** DESIGN ONLY. Do not implement until M8+ and explicit go decision (ADR required). Real budgets are involved; this doc exists so that day is not improvised.

## Scope and Non-Goals

- **Scope (phase 1):** read-only sync of Sponsored Products data for coaching review - campaigns, keywords, search terms, spend/sales.
- **Non-goals:** automated bid changes, budget changes, campaign creation, anything that spends money without a human in the platform UI with explicit confirmation.

## Threat Level

This is the highest-risk integration in the product. Controls from 03-security.md apply at maximum stringency: encrypted tokens, least scopes, no token logging, kill switch.

## OAuth and Token Design

| Item | Design |
|---|---|
| Flow | Login with Amazon (OAuth 2.0 authorization code + PKCE) |
| Scopes | Minimum read-only (advertising::campaigns, reporting) - write scopes NOT requested in phase 1 |
| Tokens | Refresh + access encrypted with KMS envelope encryption; stored per-user in `amazon_ads_credentials` |
| Refresh | Background job before expiry; failures -> in-app reconnect prompt, sync paused |
| Revocation | User disconnect -> tokens deleted + Amazon-side revoke call + audit entry |
| Marketplace/region | Store profileId + region per connection; never mix marketplaces in one report |

## Data Sync

```
nightly job per connected account:
  1. fetch report (T-2 days; Amazon reporting lag respected)
  2. map to read-only tables: synced_campaigns, synced_search_terms, synced_metrics
  3. student/teacher sees ONLY accounts they are linked to (authz service)
  4. raw payloads discarded after mapping (store nothing beyond mapped rows)
```

No write-back in phase 1. Insights are suggestions shown in UI; execution stays in Amazon console (teaching stance: the student learns to act, we don''t automate).

Rate limits: respect Amazon API throttling; per-account queue; exponential backoff; sync health surfaced in admin.

## Amazon API Terms Compliance Checklist

- [ ] Display requirements followed (attribution labels where required)
- [ ] No storage beyond what terms permit; retention <= 30 days for raw-derived metrics unless ADR
- [ ] No use of data for competing advertising product
- [ ] App review materials prepared (privacy policy, demo video, data use statement)
- [ ] Sandbox-first development; production credentials only after app approval

## UX Rules (coaching stance)

- Live data appears in a clearly labeled "Live account" area, separate from simulators.
- Every suggestion requires student to state rationale before it is marked done (judgment training).
- Teacher approval required before any recommendation is marked "applied in console" for accounts under teacher supervision.
- Kill switch: `amazonAds.syncEnabled` - off halts all jobs instantly.

## Schema Additions (when implemented)

```
amazon_ads_credentials(id, userId, refreshTokenEnc, regionId, profileId, status, connectedAt, revokedAt)
synced_campaigns(id, credentialId, extCampaignId, name, state, budget, ...)
synced_metrics(id, credentialId, date, impressions, clicks, spend, sales, ...)  unique(credentialId,date,entityId)
```

## Test Plan (pre-requisites to start coding)

- Approved Amazon developer account + sandbox access
- ADR accepted for phase 1 scope
- Token encryption/decryption round-trip tests with KMS fake
- Sync job tests with recorded fixtures (no live calls in CI)
- Authz matrix tests: student A cannot see student B''s synced data (property-based)
