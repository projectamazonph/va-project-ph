---
title: Notifications - Email and In-App
file: 25-notifications.md
version: 1.0
reviewed: 2026-08-17
owner: Product Owner
status: active
---

# 25 - Notifications: Email and In-App

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Product Owner

Rule of thumb: fewer, kinder, more useful. Students are learning; never nag, never shame.

## Channels and Triggers

| Trigger | Channel | Cadence guard |
|---|---|---|
| Welcome + baseline check | email | once |
| Email verification / password reset | email | rate-limited (10-rate-limiting.md) |
| Inactivity nudge (day 3, day 7) | in-app first, email second | max 2 total; stops on any activity |
| Assignment given by teacher | in-app + email | immediate |
| Assignment due in 48h | in-app | once |
| Graded work ready | in-app + email | immediate |
| Weekly teacher digest | email | weekly, Mon 08:00 local |
| At-risk student alert | teacher in-app | once per week per student |
| Curriculum correction (SEV) | in-app banner | until acknowledged |
| Security (new device, password changed) | email | immediate, always |

## Consent and Compliance

- Transactional (auth, security, assignments) cannot be opted out.
- Nudges/digests: opt-out per category in Settings; honored within 1 send cycle.
- Every email: plain-text version, working unsubscribe, sender identity, postal contact (CAN-SPAM/GDPR basics).
- Quiet hours: student nudges only 08:00-20:00 recipient local time.
- Max sends per student: 4/week across all non-transactional categories.

## Voice and Templates

- Subject lines <= 45 chars, verbs first: "Your weekly cohort summary", "New assignment: Search Term Trainer".
- Body: max 3 sentences + one button. No jargon. No red-letter urgency theater.
- Templates live in `server/email/templates/` - reviewed as copy (curriculum pipeline §2).
- In-app toasts follow 02-design.md toast spec.

## Delivery and Ops

- Provider behind EmailAdapter interface (08-backend.md LSP rule); transactional and marketing separated at provider level.
- Bounces/complaints processed via webhook -> suppression list (hard bounce = suppress forever).
- Monitoring: delivery rate, bounce rate, complaint rate in 21-observability-slo.md dashboards; complaint rate > 0.3% halts all non-transactional sends automatically.

## Testing

- Template snapshot tests + render-with-data tests (empty, max-length, unicode).
- Preview mode in admin (11-admin.md) to send any template to self.
- Integration tests use fake adapter; provider credentials never in CI.
