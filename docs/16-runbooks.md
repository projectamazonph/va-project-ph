---
title: Runbooks - Incidents, Releases and Recovery
file: 16-runbooks.md
version: 1.0
reviewed: 2026-08-18
owner: DevOps Lead
status: active
source: extracted from 09-ci-cd.md, 21-observability-slo.md, 30-open-questions.md, and 45-infrastructure.md
---

# 16 - Runbooks

Runbooks are short, executable instructions for safe operation under pressure. They are not architecture essays. Every runbook names the trigger, owner, safe first action, verification, rollback, and communication path.

## Incident severity

| Severity | Example | Response |
|---|---|---|
| SEV-1 | auth outage, cross-student data exposure, payment-wide failure | page on-call immediately; incident lead opens a timeline; status update within 30 minutes |
| SEV-2 | major learner path broken, grading queue blocked, repeated payment errors | assign owner within 30 minutes; mitigation or update within 2 hours |
| SEV-3 | isolated defect, degraded non-core feature, copy issue | ticket and weekly triage; no emergency change unless impact grows |

Security and privacy incidents follow [03-security.md](./03-security.md) and [26-compliance-legal.md](./26-compliance-legal.md) even when the technical severity looks low.

## Universal incident procedure

1. Confirm the signal with logs, metrics, and one controlled reproduction.
2. Assign an incident lead and record UTC timestamps, impact, hypotheses, and actions.
3. Contain first: disable the risky feature, stop a job, or limit traffic before attempting repair.
4. Preserve evidence; do not delete logs or mutate production data to make a dashboard look healthy.
5. Communicate a plain-words status update with what is affected and the next update time.
6. Verify recovery through the golden path and relevant SLO signals.
7. Close with a post-mortem, root cause, missed detection, and durable follow-up.

## Core runbook entries

### Failed deployment

- Stop promotion and inspect the failed check or deployment logs.
- If the previous version is compatible, redeploy the previous tag.
- Do not roll back a database migration by deleting production data; migrations are additive-first.
- Run the post-deploy smoke path, then keep dashboards watched for 30 minutes.
- Record the failure and prevention work in the release notes or an ADR.

### Database or migration incident

- Stop application writes if data integrity is at risk.
- Capture the migration name, database state, and last known good backup.
- Restore into an isolated environment before restoring production.
- Verify user access, lesson progress, simulator attempts, and payment records before reopening writes.
- Follow the backup and continuity guidance in [45-infrastructure.md](./45-infrastructure.md).

### Content or grading incident

Wrong money math, unsafe PPC advice, or a broken grading rule is a SEV-2 by default. Unpublish the affected version, preserve affected attempts, notify the owner and teacher cohort, verify the correction against [22-content-curriculum-ops.md](./22-content-curriculum-ops.md), and publish a correction note.

### Security incident

Contain access, rotate exposed credentials, preserve audit evidence, and route notification through the security and legal owners. Never investigate by copying production PII into a ticket or local fixture.

## Runbook template

```markdown
# Runbook: <incident or operation>
Trigger:
Owner:
Severity:
Last reviewed:

## First five minutes
## Diagnosis
## Containment
## Recovery
## Verification
## Rollback / failure path
## Communication
## Follow-up and evidence
```

DR tabletop exercises, on-call handoffs, and incident post-mortems use the templates in [58-templates.md](./58-templates.md). Open launch gaps remain tracked in [30-open-questions.md](./30-open-questions.md).
