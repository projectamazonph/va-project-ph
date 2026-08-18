---
title: Simulator Analytics - Search-Term Lab and SQP Studio
file: 38-sim-analytics.md
version: 1.0
reviewed: 2026-08-18
owner: Backend Lead + Curriculum Lead
status: active
source: extracted from 22-content-curriculum-ops.md, 23-analytics-metrics.md, 36-simulators-platform.md, and 60-ux-ui-copy-foundation.md
---

# 38 - Simulator Analytics

This specification covers the Search-Term Report Lab (S1) and Search Query Performance Studio (S10). Both teach evidence reading before action.

## Search-Term Report Lab

The learner reviews synthetic search-term rows and decides whether to harvest, monitor, investigate, or add a negative. The case supplies the objective, data window, current match type, clicks, spend, orders, sales, and relevance context.

Full-credit behavior:

- uses the relevant metric instead of one isolated number;
- respects sample size and distinguishes “bad” from “not enough evidence”;
- selects an appropriate routing action and destination match type;
- explains evidence, action, and next check in one or two plain sentences.

Do not teach a universal zero-order rule. A negative decision needs evidence about spend, intent, relevance, or a case-specific constraint.

## SQP Studio

SQP-style practice compares search-query visibility and conversion signals across a product context. The learner identifies an opportunity or risk, states what the data can and cannot prove, and recommends a follow-up check.

The studio must label synthetic or illustrative data and avoid claiming that an internal practice view is the official Amazon metric for every account. The result focuses on questioning, comparison, and evidence quality rather than a fake ranking.

## Shared rubric

| Dimension | Full-credit behavior |
|---|---|
| Accuracy | Reads supplied metrics and time windows correctly |
| Evidence quality | States sample or data limitations |
| Decision quality | Chooses a proportionate next action |
| PPC judgment | Connects traffic, relevance, and conversion without overclaiming |
| Communication | Explains the decision in client-safe plain English |

## Analytics events

Track `analytics_case_started`, `analytics_row_decided`, `analytics_uncertainty_selected`, `analytics_submitted`, and `analytics_feedback_viewed`. Events are pseudonymous and follow [23-analytics-metrics.md](./23-analytics-metrics.md). Save the answer and rubric version with the attempt, not in an analytics event payload.
