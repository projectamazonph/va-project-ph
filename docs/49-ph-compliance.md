---
title: Philippines Compliance and Legal Operations
file: 49-ph-compliance.md
version: 1.0
reviewed: 2026-08-17
owner: Finance/Legal owner and Tech Lead (counsel review before GA)
status: active
supersedes: null
superseded-by: null
source: 43-production-gap-audit.md (production-readiness framework section)
---

# Philippines Compliance and Legal Operations

Version: 1.0 - Reviewed: 2026-08-17 - Owner: Finance/Legal owner + Tech Lead (counsel review before GA)

Complements compliance-legal gap file 26 (general privacy/a11y). This file is the PH-specific layer - the market we actually serve. Verify current rules with counsel; regulations change.

## Business Registration

| Item | Status owner | Notes |
|---|---|---|
| Entity form (OPC/Corp) | Finance | SEC registration if corporation; DTI Business Name if sole/OPC trade name |
| Barangay clearance + Mayor's permit | Finance | locality of principal office |
| BIR registration (TIN, COR, books/e-invoicing) | Finance | required BEFORE first peso collected |
| Bank/wallet accounts in entity name | Finance | GCash/Xendit settlement into entity account only |

## Taxes on Digital Services

| Obligation | Handling |
|---|---|
| VAT 12% | Prices displayed VAT-inclusive; receipt shows breakdown; quarterly filing |
| Income tax | Standard entity filings; scholarship slots are not revenue (document policy) |
| e-Invoicing/receipts | Provider receipts + our invoice records (see 46-billing-payments.md); BIR-compliant fields at launch |
| Withholding (agency/school POs) | Finance issues docs; track per invoice |
| Foreign students | Stripe handles collection; record export for counsel review |

## Data Privacy Act of 2012 (RA 10173) - the big one

| Requirement | Our implementation |
|---|---|
| DPO appointment | Named DPO registered with NPC; contact published in privacy notice |
| NPC registration (if required by processing scale/type) | File before GA; renewal tracked on compliance calendar |
| Privacy notice | Plain-words summary + full text (Tagalog version provided - market language reality) |
| Data subject rights | Access, correction, erasure, data portability, objection, damages info - self-serve where possible (Settings), else within 15 working days response SLA |
| Consent records | Timestamped consent events stored with version of notice accepted |
| Cross-border transfers | Processor register (compliance-legal gap file 26 section 1) with adequate protection basis documented per vendor |
| Breach notification | NPC within 72h of reasonable knowledge when required; affected users notified; runbook added to 09-ci-cd.md |
| Retention | Schedule in compliance-legal gap file 26 section 2; erasure job audited quarterly |
| Security measures | 03-security.md stands as organizational/technical/physical evidence for NPC audits |

## Consumer Protection (RA 7394 and related)

Truth in advertising: all outcome claims per 35-copy-bible.md section 6 (no absolutes); "results vary" disclaimer on testimonials.

Refunds: published policy (see 46-billing-payments.md) honored without obstruction; DTI-friendly dispute path documented in support (support-experience gap file 28).

Price display: total price before payment, VAT-inclusive, no surprise fees.

No unfair collection practices in dunning copy (notifications gap file 25 tone rules already ban shaming).

## Labor and Contractors (teachers/moderators)

| Topic | Rule |
|---|---|
| Teachers | Independent contractor agreements with clear deliverables OR employment per DOLE tests - classify deliberately with counsel; misclassification is the classic trap |
| Compensation records | Written rate cards (50-teacher-quality.md section 6), on-time payment SLA |
| Volunteers/mods | Role scope + code of conduct signed; no unpaid work replacing paid roles |

## Platform Content Disclaimers

We teach skills about third-party platforms (Amazon). Standing disclaimers (footer + curriculum intro): not affiliated with/endorsed by Amazon; platform policies change; students must follow current platform terms.

Simulator look-alikes distinct (testing-quality gap file 36 section 8.2); counsel review of naming pre-GA.

## Public Legal Artifacts (GA checklist)

- [ ] Terms of Service (EN + TL summary)
- [ ] Privacy Notice (EN + TL) + consent versioning live
- [ ] Accessibility Statement (target WCAG 2.2 AA, known issues link - compliance-legal gap file 26 section 3)
- [ ] Refund Policy page
- [ ] Cookie notice (minimal trackers)
- [ ] security.txt + disclosure policy (compliance-legal gap file 26 section 4)
- [ ] Scholarship terms (46-billing-payments.md section on scholarship)

## Compliance Calendar (adds to compliance-legal gap file 26 section 7)

| Cadence | PH-specific action |
|---|---|
| Monthly | BIR filing prep; invoice sequence audit |
| Quarterly | VAT filing; erasure job audit; contractor payment review |
| Annually | Permits renewals; NPC registration status; counsel review of this doc |
| On change | New processor/vendor to transfer assessment; pricing change to receipt/tax check |