---
title: Analytics, Event Taxonomy and Learning Metrics
file: 23-analytics-metrics.md
version: 1.0
reviewed: 2026-08-17
owner: Product Owner
status: draft - source truncated mid-KPI table ("drop" cut); remainder of Product KPIs section pending
---

# 23 - Analytics, Event Taxonomy and Learning Metrics

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Product Owner

Privacy-first: pseudonymous ids only, no third-party ad trackers, opt-out honored, events defined here and nowhere else.

## Principles

- Server-side events are authoritative (client events for UX signals only).
- Every event defined in lib/analytics/events.ts with Zod schema; free-form events banned.
- No PII in event payloads; userId hashed; cohort id allowed for teachers.
- Analytics must never slow a user action (fire-and-forget queue).

## Event Taxonomy (initial)

| Event | Trigger | Key properties |
|---|---|---|
| session_start | auth | role, locale |
| lesson_opened | reader mount | moduleId, lessonId |
| lesson_completed | server award | moduleId, lessonId, minutesActual |
| quiz_submitted | server grade | quizId, scorePct, durationSec, firstAttempt |
| question_missed | server grade | questionId (for item analysis) |
| trainer_submitted | server grade | caseId, scorePct, firstAttempt |
| builder_submitted | server grade | score, failures[] |
| report_generated | server | metrics.acosPct bucket |
| coach_asked | server | ruleHit: bool, topicTag |
| coach_flagged | teacher/admin | conversationId |
| badge_earned | XP service | badgeId |
| level_up | XP service | levelName |
| student_at_risk_flagged | nightly job | reason |
| teacher_action | grading/assign | actionType |

## Product KPIs (dashboard for admins)

| KPI | Definition | Target (GA) |
|---|---|---|
| Activation | signup -> first lesson completed within 24h | >= 70% |
| Module completion funnel | % reaching each module | drop _(target values and remaining KPIs pending - source truncated)_ |
