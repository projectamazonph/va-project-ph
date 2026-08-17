---
title: Production Readiness Audit and Go-Live Gates
file: 43-production-gap-audit.md
version: 1.0
reviewed: 2026-08-17
owner: Tech Lead
status: active
supersedes: null
superseded-by: null
source: authored for VA Project Philippines
---

# Production Readiness Audit and Go-Live Gates

Version: 1.0 - Reviewed: 2026-08-17 - Owner: Tech Lead

Scope: everything needed to run The VA Project Philippines as a real, revenue-earning, legally compliant, Filipino-market platform - not just build it. Docs 00-42 cover build/quality/design/simulators well. This audit maps the remaining gaps and introduces the production-readiness framework that closes the P0 set.

## Coverage Matrix

| Domain | Status | Where | Gap |
|---|---|---|---|
| Architecture (system-level view) | shipped | - | [44-architecture.md](./44-architecture.md) (C4 L1/L2, data flows, NFRs, ADR seed) |
| Infrastructure and IaC | shipped | 09-ci-cd.md covers pipeline only | [45-infrastructure.md](./45-infrastructure.md) (env matrix, secrets, DR, FinOps) |
| Billing, payments, entitlements | shipped | support-experience gap file (28) section 6 | [46-billing-payments.md](./46-billing-payments.md) (Xendit/Stripe, webhooks, VAT, refunds) |
| Product process (PRD, prioritization, experiments) | shipped | 30-open-questions.md is milestones only | [47-product-process.md](./47-product-process.md) (PRD-lite, RICE-P, experiments) |
| Growth and marketing (PH market) | shipped | - | [48-growth-marketing.md](./48-growth-marketing.md) (channel map, launch, content engine, SEO) |
| Philippines legal/compliance | shipped | compliance-legal gap file (26) is GDPR-leaning | [49-ph-compliance.md](./49-ph-compliance.md) (RA 10173, BIR/DTI, Consumer Act) |
| Teacher quality system | shipped | teacher-onboarding gap file (19b) gates only | [50-teacher-quality.md](./50-teacher-quality.md) (ladder, calibration, QA, metrics) |
| Offline / data-light engineering | shipped | personas + copy bible assume it | [51-offline-performance.md](./51-offline-performance.md) (PWA budgets, slow-4G targets, low-end device rules) |
| Ownership and decision routing (RACI) | shipped | owners listed per doc | [52-raci.md](./52-raci.md) (matrix, decision routing, standing meetings) |
| Vendor risk register | shipped | compliance-legal gap file (26) section 1 | [56-vendor-risk-register.md](./56-vendor-risk-register.md) (scored register, onboarding checklist, incident protocol) |
| Help center / user-facing docs | shipped | - | [53-help-center.md](./53-help-center.md) (article bodies authored as features land per section 2 IA) |
| Status page and maintenance comms | shipped | 16 has incidents | [54-status-page.md](./54-status-page.md) (incident TL templates, monthly transparency) |
| Changelog policy | shipped | - | [55-changelog-policy.md](./55-changelog-policy.md) (format, distribution, ownership) |
| Community moderation handbook | missing | - | Folded into 48-growth-marketing.md section 6 |
| SEO / marketing site engineering | missing | - | Folded into 48-growth-marketing.md section 7 |
| Capacity planning | implied | observability-slo gap file (21) | Folded into 45-infrastructure.md section 8 |
| Mobile native app strategy | parked | open-questions gap file (30) | PWA path in 51-offline-performance.md first |
| Multi-tenant agency workspaces | parked | open-questions gap file (30) | ADR when demand lands |
| Accessibility statement (public artifact) | internal only | compliance-legal gap file (26) section 3 | Public page added at GA (checklist in 49-ph-compliance.md) |

## Index hygiene fix

Two files in docs/ shared the number 19 (19-gap-analysis.md and 19-onboarding.md). Resolution applied: kept 19-gap-analysis.md; renamed onboarding to 19b-onboarding.md; updated the cross-reference inside 19-gap-analysis.md.

## Priority of the new set

| Priority | Docs | Why blocking |
|---|---|---|
| P0 - cannot launch without | architecture, infrastructure, billing-payments, ph-compliance, offline-performance | You cannot run, get paid, stay legal, or serve the market you designed for |
| P0 - cannot scale without | product-process, teacher-quality, raci | Product decisions, grading quality, and ownership stall the machine |
| P1 - cannot grow without | growth-marketing | Distribution is a build item in the PH market, not an afterthought |

## Production Go-Live Gates (master checklist)

Launch happens when ALL are checked. Owners come from 52-raci.md.

### Engineering

- [ ] Architecture reviewed and ADRs accepted (see 44-architecture.md)
- [ ] IaC green across preview/staging/prod; backups restored twice successfully (see 45-infrastructure.md)
- [ ] All SLO dashboards live with 14 clean days (see observability-slo gap file 21)
- [ ] Pen test closed; secrets rotation proven once (see 03-security.md)
- [ ] Offline/data-light budgets met on reference device (see 51-offline-performance.md)
- [ ] Billing sandbox-to-prod rehearsal completed, refunds tested (see 46-billing-payments.md)

### Product and Quality

- [ ] Beta exit criteria met (see testing-quality gap file 20 section 5)
- [ ] Teacher calibration at least 2 sessions, inter-rater variance within target (see 50-teacher-quality.md)
- [ ] Curriculum published versions at least 1.0, content incident drill done (see content-curriculum-ops gap file 22)
- [ ] Golden-path suite green on prod smoke account (see testing-quality gap file 20 section 3)

### Legal and Business

- [ ] NPC registration filed; DPO appointed (see 49-ph-compliance.md)
- [ ] BIR registration and e-invoicing flow verified with real peso transaction (see 49-ph-compliance.md)
- [ ] Terms/Privacy/Accessibility statement published (see compliance-legal gap file 26, 49-ph-compliance.md)
- [ ] DTI/SEC registration current; bank and payment rails in company name (see 49-ph-compliance.md)
- [ ] Pricing and scholarship program approved; GCash checkout live (see 46-billing-payments.md)

### Operations

- [ ] On-call rotation staffed 2 weeks; page test fired and resolved (see 09-ci-cd.md and observability-slo gap file 21)
- [ ] Support canned library exercised end-to-end (see support-experience gap file 28)
- [ ] DR tabletop completed, RTO/RPO signed by owner (see 45-infrastructure.md and observability-slo gap file 21)

## Closed small gaps (closed in this docs PR)

| Closed doc | Authored as |
|---|---|
| 53-help-center.md | [53-help-center.md](./53-help-center.md) - IA, article template, in-app integration, metrics |
| 54-status-page.md | [54-status-page.md](./54-status-page.md) - components, update rules, TL templates, monthly transparency |
| 55-changelog-policy.md | [55-changelog-policy.md](./55-changelog-policy.md) - format, distribution, ownership |
| 56-vendor-risk-register.md | [56-vendor-risk-register.md](./56-vendor-risk-register.md) - tiers, score, register, onboarding, incident protocol |
| 57-partnerships.md | [57-partnerships.md](./57-partnerships.md) - partner types, mechanics, safeguards, pipeline, metrics |

| 58-templates.md | [58-templates.md](./58-templates.md) - closure of dangling template references across docs 16/47/50/52/56/57 |