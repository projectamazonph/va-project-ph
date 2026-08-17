---
title: PPC Coach - Admin Portal & Operations
file: 11-admin.md
version: 1.0
reviewed: 2026-08-17
owner: Tech Lead
status: active
source: split from ppc-coach-index.md (saved 2026-08-17)
---
# Admin Portal & Operations

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Tech Lead
Path: /admin · Role: admin + enforced MFA · Every action audit-logged

## Design Principle

Admin power is dangerous by definition. Defaults are safe: read-only views, confirmations on mutation, no bulk destructive actions without dual approval.

## Modules

| Module | Capabilities |
|---|---|
| Users | search, filter by role/status; view progress; suspend/reactivate; change role (double confirm) |
| Content | edit lessons/modules/glossary (draft -> preview -> publish); versioned; rollback |
| Cohorts | create cohort, assign teacher<->students, reassign on teacher departure |
| Quiz & Cases | edit quiz bank and trainer cases; publish gates on curriculum review |
| Audit | immutable log viewer, filter by actor/action/date, CSV export |
| Feature Flags | toggles (e.g., coach.llmEnabled, registration open/closed) |
| Health | build SHA, env, migrations status, queue depth, error rate snapshot |
| Support | impersonation (time-boxed 30 min, banner shown, audit-logged), password reset link |

## Permission Matrix

| Action | admin | owner-only flag |
|---|---|---|
| Read any user data | yes | |
| Suspend/reactivate | yes | |
| Change role to admin | yes | dual approval |
| Edit published curriculum | yes | Design Lead sign-off in PR |
| Delete user (GDPR) | yes | dual approval + 30-day queue |
| Feature flags | yes | |
| Export all data | yes | dual approval |

## Audit Requirements (non-negotiable)

Every admin mutation writes audit_logs: {actorId, action, targetType, targetId, before, after, ipHash, at}.
Append-only at DB permission level.
Audit retention: 2 years.
Weekly digest of admin actions to all admins (transparency).

## Impersonation Rules

Requires ticket id entered into dialog.
Banner across impersonated session: "Support session - logged".
Max 30 minutes; writes during impersonation flagged separately in audit.
Never impersonate to bypass paywalls/limits for personal use - termination-level offense.

## Admin UI Standards

Same design system; destructive buttons danger + type-to-confirm.
No admin action executes without server-side re-validation of role + ownership.
Admin routes excluded from public sitemap; robots: noindex.
Session idle timeout 15 min for admin context (independent of normal session).

## Operational Runbook Links

Incident steps, backup restore, flag rollback -> 16-runbooks.md.

---
