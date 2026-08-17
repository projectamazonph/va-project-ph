---
title: Documentation Index
file: index.md
version: 3.0
reviewed: 2026-08-17
owner: Docs Owner
status: active
product: VA Project Philippines (PPC Coach + Filipino VA training, one unified product)
supersedes: docs/index.md v2 (production-readiness framework section added)
---

# The VA Project Philippines - Documentation Index (v3)

Last verified: 2026-08-17 - Owner: Docs Owner - Rule: every doc carries frontmatter; re-verify every 30 days (15-living-documentation.md).
Fix applied: former 19-onboarding.md is renamed 19b-onboarding.md to resolve the duplicate-19 numbering; all references updated.

## A - Agent, Process & Standards

| File | Purpose | Owner |
|---|---|---|
| [01-agent.md](./01-agent.md) | AI agent guardrails & instructions | Tech Lead |
| [13-engineering-standards.md](./13-engineering-standards.md) | SOLID + strict TDD protocol | Tech Lead |
| [14-git-guardrails.md](./14-git-guardrails.md) | Branching, commits, PR rules | Tech Lead |
| [15-living-documentation.md](./15-living-documentation.md) | Anti-stale documentation system | Docs Owner |
| [17-adr-template.md](./17-adr-template.md) | Architecture Decision Records | Tech Lead |
| [47-product-process.md](./47-product-process.md) | PRD-lite, prioritization, experiments | Product Owner |
| [52-raci.md](./52-raci.md) | Ownership & decision routing | Product Owner |
| [58-templates.md](./58-templates.md) | All referenced templates in one place | Docs Owner |

## B - Design, Brand & Content

| File | Purpose | Owner |
|---|---|---|
| [02-design.md](./02-design.md) | Original UI/UX system (tokens superseded by 31) | Design Lead |
| [31-brand-identity.md](./31-brand-identity.md) | VAPP brand, theme tokens, visual guardrails | Design Lead |
| [32-personas-and-stories.md](./32-personas-and-stories.md) | Filipino personas, journeys, metrics | Product Owner |
| [33-wireframes-mobile-first.md](./33-wireframes-mobile-first.md) | Every page's wire + element maps | Design Lead |
| [34-interactions-and-events.md](./34-interactions-and-events.md) | Full interaction/event spec, fluidity rules | Design + Frontend Lead |
| [35-copy-bible.md](./35-copy-bible.md) | All copy incl. landing hero | Design Lead |
| [59-student-ux-copy-deck.md](./59-student-ux-copy-deck.md) | Student lesson and web-app UX copy deck | Curriculum + Design Lead |
| [60-ux-ui-copy-foundation.md](./60-ux-ui-copy-foundation.md) | MVP UX/UI foundation, information architecture, flows, and student screen copy | Product + Design Lead |
| [22-content-curriculum-ops.md](./22-content-curriculum-ops.md) | Curriculum pipeline & i18n | Design Lead |

## C - Engineering & Architecture

| File | Purpose | Owner |
|---|---|---|
| [44-architecture.md](./44-architecture.md) | System context, containers, flows, NFRs, ADR seed | Tech Lead |
| [04-schema.md](./04-schema.md) | Zod schemas & contracts | Backend Lead |
| [05-api.md](./05-api.md) | API spec | Backend Lead |
| [06-db.md](./06-db.md) | Database design & ops | Backend Lead |
| [07-frontend.md](./07-frontend.md) | Frontend architecture | Frontend Lead |
| [08-backend.md](./08-backend.md) | Backend layers & services | Backend Lead |
| [12-server-actions.md](./12-server-actions.md) | Server action rules | Frontend Lead |
| [51-offline-performance.md](./51-offline-performance.md) | Offline/data-light PH engineering | Frontend Lead |
| [45-infrastructure.md](./45-infrastructure.md) | Hosting, IaC, environments, FinOps, DR | DevOps Lead |
| [09-ci-cd.md](./09-ci-cd.md) | Pipeline & releases | DevOps Lead |
| [10-rate-limiting.md](./10-rate-limiting.md) | Throttling & abuse | Backend Lead |
| [29-repo-artifacts.md](./29-repo-artifacts.md) | CODEOWNERS, templates, registries | DevOps Lead |

## D - Security, Legal & Compliance

| File | Purpose | Owner |
|---|---|---|
| [03-security.md](./03-security.md) | Security policy | Security Lead |
| [26-compliance-legal.md](./26-compliance-legal.md) | General privacy, a11y, disclosure | Tech Lead |
| [49-ph-compliance.md](./49-ph-compliance.md) | RA 10173/NPC, BIR, DTI, Consumer Act | Finance/Legal owner |
| [56-vendor-risk-register.md](./56-vendor-risk-register.md) | Third-party management | Finance + Security |
| [24-ai-governance.md](./24-ai-governance.md) | Coach LLM governance | AI Owner |

## E - Quality, Ops & Support

| File | Purpose | Owner |
|---|---|---|
| [20-testing-quality.md](./20-testing-quality.md) | Test strategy, UAT, beta | Tech Lead |
| [21-observability-slo.md](./21-observability-slo.md) | SLOs, dashboards, alerts | DevOps Lead |
| [16-runbooks.md](./16-runbooks.md) | Incidents & operations | DevOps Lead |
| [54-status-page.md](./54-status-page.md) | Service status communication | DevOps Lead |
| [55-changelog-policy.md](./55-changelog-policy.md) | Release communication | Docs Owner |
| [53-help-center.md](./53-help-center.md) | User-facing knowledge base | Docs Owner |
| [28-support-cx.md](./28-support-cx.md) | Support tiers & billing CX | Product Owner |
| [50-teacher-quality.md](./50-teacher-quality.md) | Teacher calibration & grading QA | Design Lead |
| [11-admin.md](./11-admin.md) | Admin portal | Tech Lead |

## F - Product, Growth & Business

| File | Purpose | Owner |
|---|---|---|
| [18-project-plan.md](./18-project-plan.md) | Build milestones | Tech Lead |
| [23-analytics-metrics.md](./23-analytics-metrics.md) | Event taxonomy & KPIs | Product Owner |
| [25-notifications.md](./25-notifications.md) | Email & in-app rules | Product Owner |
| [46-billing-payments.md](./46-billing-payments.md) | Payments, entitlements, PH receipts | Tech Lead + Finance |
| [48-growth-marketing.md](./48-growth-marketing.md) | PH market growth & community ops | Growth lead |
| [57-partnerships.md](./57-partnerships.md) | BPO/campus/LGU/creator/hiring programs | Growth lead |
| [30-open-questions.md](./30-open-questions.md) | Parked decisions & GA checklist | Product Owner |

## G - Simulators

| File | Purpose | Owner |
|---|---|---|
| [36-simulators-platform.md](./36-simulators-platform.md) | Shared engine, scoring, shell | Product + Tech Lead |
| [37-sim-console-wizard.md](./37-sim-console-wizard.md) | S4 Wizard (SP/SB/SD) + S5 Console Nav | Design + Backend Lead |
| [38-sim-analytics.md](./38-sim-analytics.md) | S1 STR Lab + S10 SQP Studio | Backend Lead |
| [39-sim-research.md](./39-sim-research.md) | S6 Keyword Research Studio | Curriculum + Design |
| [40-sim-operations.md](./40-sim-operations.md) | S2 Bid - S3 Budget/Pacing - S7 Bulk | Backend Lead |
| [41-sim-field-skills.md](./41-sim-field-skills.md) | S8 Architect - S9 Audit - S11 Onboarding - S12-S14 | Product Owner |
| [42-simulator-roadmap.md](./42-simulator-roadmap.md) | Build order & dependencies | Tech Lead |

## H - Audits & History

| File | Purpose | Owner |
|---|---|---|
| [19-gap-analysis.md](./19-gap-analysis.md) | Gap map v1 | Tech Lead |
| [19b-onboarding.md](./19b-onboarding.md) | Dev/teacher/student onboarding | Tech Lead |
| [27-amazon-ads-integration.md](./27-amazon-ads-integration.md) | Future live-data spec (DRAFT) | Backend Lead |
| [43-production-gap-audit.md](./43-production-gap-audit.md) | Production readiness audit + go-live gates | Tech Lead |

## Coverage Status (v3)

Complete through production gates: build, design, security, PH legal, payments, ops, quality, growth, teaching quality, simulators.
Intentionally parked (see 30-open-questions.md): native mobile app, multi-tenant agency workspaces, SOC 2, live Amazon Ads write-access.
Scheduled but not yet authored (assign when triggered): penetration test happens from 58 section 3 template; help-center article bodies authored per 53 section 2 IA as features land.

Next actions: run check-docs after the 19b rename; schedule doc-day verification of sections A-H owners.

## Working Files (not in numbered scheme)

These are source content / artifacts, not formal docs:

| File | Purpose | Owner |
|---|---|---|
| [curriculum-syllabus.md](./curriculum-syllabus.md) | Curriculum source content (3,006 lines) | Curriculum Lead |
| [syllabus-to-tracks-reconciliation.md](./syllabus-to-tracks-reconciliation.md) | Maps curriculum modules 0-14 and web app coaching aids A-J to implementation tracks | Tech Lead + Curriculum Lead |
