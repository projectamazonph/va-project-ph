---
title: Gap Analysis - What Is Missing From the Current Doc Suite
file: 19-gap-analysis.md
version: 1.0
reviewed: 2026-08-17
owner: Tech Lead
status: active
---

# 19 - Gap Analysis

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Tech Lead

## Verdict

Docs 00-18 cover build, safety, and process well. They do NOT yet cover: people onboarding, runtime observability, curriculum operations, learning analytics, AI governance, legal/compliance, notifications, support, and the future Amazon Ads integration. Below is the prioritized gap map; the new documents follow as files 19-30.

## Priority P0 - Required before first real students

| Gap | Why it matters | New doc |
|---|---|---|
| Onboarding (dev + teacher + student) | Nobody can join the system smoothly without it | 19b-onboarding.md |
| Testing & QA strategy (beyond TDD rules) | TDD tells how to write tests, not how to organize data, environments, UAT | 20-testing-quality.md |
| Observability + SLOs/error budget | Runbooks exist but no targets, dashboards, alert thresholds | 21-observability-slo.md |
| Curriculum/content operations | The product IS the curriculum; edits need authoring + review + versioning | 22-content-curriculum-ops.md |
| Notifications (email/in-app) | Digests, assignments, password flows all send messages; needs rules + compliance | 25-notifications.md |
| Repo artifacts actually committed | CODEOWNERS, PR/issue templates, env registry are referenced but not specified | 29-repo-artifacts.md |

## Priority P1 - Required before paid/B2B or LLM in production

| Gap | Why it matters | New doc |
|---|---|---|
| Analytics & learning metrics | Cannot prove the course works or find struggling students without an event taxonomy | 23-analytics-metrics.md |
| AI/LLM governance | Coach uses an LLM: evals, prompt versions, safety, cost, human review are mandatory | 24-ai-governance.md |
| Compliance, privacy & legal | Retention schedule, DPA, WCAG statement, content licensing, disclosure policy | 26-compliance-legal.md |
| Support & customer experience | Teachers will hit problems; tiers, SLAs, canned replies prevent chaos | 28-support-cx.md |
| Accessibility as policy (not just checklist) | Legal + moral; needs target level, audit cadence, assistive-tech matrix | folded into 26-compliance-legal.md §3 |

## Priority P2 - Growth phase

| Gap | Why it matters | New doc |
|---|---|---|
| Amazon Ads live integration spec | The roadmap mentions real-account mode; OAuth/token/TOS design must be ready before anyone touches real budgets | 27-amazon-ads-integration.md |
| i18n/localization plan | Copy is already centralized (lib/copy); needs process before second language | 22-content-curriculum-ops.md §7 |
| Multi-tenant / agency teams | Agencies will want multiple teachers + client isolation | ADR when demanded |
| Mobile/PWA & offline practice | Field VAs on phones; defer until usage data justifies | ADR when demanded |
| Billing/subscription operations | Plan tiers, dunning, refunds, invoicing | 28-support-cx.md §6 stub until M8 |
| Disaster recovery formalization (RTO/RPO sign-off) | Backups exist; exec sign-off + annual tabletop missing | 16-runbooks.md §7 addition |

## Also missing (process-level, folded into 29/30)

- CONTRIBUTING.md + Code of Conduct (especially if contractors/agents contribute).
- Responsible security disclosure policy (public-facing promise + PGP/endpoint).
- Status page & incident communication templates.
- Dependency approval registry (explicit allow-list, not just "review required").
- Definition of "curriculum sign-off" - who can change money formulas and glossary (named roles, not just "Design Lead").
- Cost/FinOps budget - infra + LLM monthly ceiling with alerts at 80%.
- Beta program protocol - closed teacher cohort, feedback loop, exit criteria to GA.
- Open questions register - decisions parked deliberately (30-open-questions.md).
