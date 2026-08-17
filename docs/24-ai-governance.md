---
title: AI and LLM Governance (Coach Bot)
file: 24-ai-governance.md
version: 1.0
reviewed: 2026-08-17
owner: AI Owner + Security Lead
status: active
---

# 24 - AI and LLM Governance (Coach Bot)

Version: 1.0 · Reviewed: 2026-08-17 · Owner: AI Owner + Security Lead

Scope: the Coach answer pipeline and any future LLM-assisted features. Rule engine first, LLM second, always supervised.

## Architecture of a Coach Answer

```
student question
 -> normalize -> rule engine match? -> YES: deterministic answer (logged ruleHit=true)
                                  -> NO:  LLM with locked system prompt -> safety filter -> answer
 every conversation stored; teachers/admins can flag any message
```

## Hard Guardrails

- The coach TEACHES. It never manages real money, never gives investment/financial advice, never promises outcomes.
- It must not invent metrics or formulas. System prompt pins formulas to lib/metrics; any formula in LLM output is validated against the registry - mismatch -> fall back to "let''s check the lesson" + flag for review.
- No PII beyond userId in prompts. Student names never enter prompts.
- Kill switch: `coach.llmEnabled=false` degrades to rule engine instantly.
- Content filter on both input and output (block prompt-injection patterns, off-domain requests, abusive content -> canned polite refusal).
- LLM answers carry subtle label "AI-generated" in UI; rule answers do not.

## System Prompt Management

- Prompt lives in `server/coach/prompt.ts`, versioned constant `PROMPT_V`.
- Changes require: PR review by AI Owner + Design Lead, eval harness pass (§4), changelog line.
- Prompt diff is part of audit metadata on conversations after a version bump.

## Evaluation Harness (required before any prompt/model change)

| Suite | Composition | Pass bar |
|---|---|---|
| Golden set | 60 canonical questions with expected key points | >= 95% key-point coverage |
| Formula integrity | 30 questions probing ACOS/ROAS/break-even | 100% correct |
| Refusal set | 20 out-of-domain/harmful/injection prompts | 100% safe refusal |
| Plain-words check | readability scorer on outputs | <= grade 8 |
| Regression | previous release''s flagged conversations | all resolved or explicitly accepted |

Harness runs in CI for prompt/model changes (LLM calls mocked or capped-budget live run on staging only).

## Human Oversight

- Teachers can flag any coach message -> admin review queue (SLA 48h).
- Weekly sample audit: 20 random LLM conversations reviewed by AI Owner.
- Flag rate > 2% of conversations -> automatic review of prompt + recent changes.
- Students are told in onboarding: coach explains, humans decide.

## Cost and Capacity Controls

| Control | Value |
|---|---|
| Per-user limit | see 10-rate-limiting.md coach rows |
| Daily token budget | configured per environment; alert at 80%, kill-switch at 100% |
| Model selection | cheapest model passing eval bar; upgrades need ADR |
| Caching | identical normalized question -> cached answer 24h (label cacheHit) |
| Monthly FinOps line item | reported in 21-observability-slo.md cost dashboard |

## Vendor and Data Rules

- Provider must offer zero-retention / no-training-on-our-data terms (DPA signed).
- No prompt/response data leaves to vendors beyond the inference call.
- Vendor change = new eval run + Security review.
