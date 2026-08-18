---
title: Engineering Standards - SOLID, TDD and Definition of Done
file: 13-engineering-standards.md
version: 1.0
reviewed: 2026-08-18
owner: Tech Lead
status: active
source: extracted from AGENTS.md, 07-frontend.md, 08-backend.md, and 20-testing-quality.md
---

# 13 - Engineering Standards

These standards apply to application code, tests, scripts, and technical documentation. They turn the agent guardrails in [AGENTS.md](../AGENTS.md) into a reviewable delivery contract.

## Design rules

- Keep domain rules framework-free and deterministic.
- Depend on ports at boundaries; infrastructure implements ports and is wired in one composition root.
- Prefer small functions and modules with one reason to change.
- Use dependency inversion for databases, payments, email, queues, rate limits, and external APIs.
- Do not add a new abstraction until it removes a real coupling or makes a required behavior testable.
- Use the existing stack contract: Next.js App Router, strict TypeScript, Zod, Prisma/PostgreSQL, Redis, Vitest, and Playwright.

## Boundary rules

| Boundary | Required behavior |
|---|---|
| Route handler / server action | Authenticate, authorize, validate input, call a use case, map the result |
| Use case | Coordinate application work; do not import UI or infrastructure details |
| Domain | Hold business rules and value objects; no network, database, or framework imports |
| Repository / gateway | Implement a port; translate provider errors into stable application errors |
| UI component | Render state and collect input; never become the source of business formulas |
| Metrics and money | Use the canonical functions in `lib/metrics.ts`; never duplicate ACOS, ROAS, CPC, or break-even math |

## TDD protocol

For each observable behavior:

1. State the user or system behavior in one sentence.
2. Add a failing test at the narrowest stable boundary.
3. Implement the smallest change that makes that test pass.
4. Refactor only while the focused test remains green.
5. Run the affected suite, then the repository quality gate.

Tests must cover the happy path, validation failure, authorization failure, dependency failure, and idempotency or retry behavior where applicable. A test that only checks that a function does not throw is not sufficient evidence.

## Type and input safety

- TypeScript strict mode is mandatory; do not use `any` to bypass design work.
- Parse untrusted input with Zod at every transport boundary, including server actions and webhooks.
- Treat database records and provider payloads as untrusted until mapped into a domain shape.
- Use explicit result or error types for expected failures. Do not use exceptions as normal control flow.
- Never expose tokens, provider payloads, internal stack traces, or another student’s data in a response.

## Definition of done

A change is done only when:

- the behavior is covered by an appropriate test;
- typecheck, lint, and the affected tests pass;
- accessibility and mobile behavior were checked for user-facing changes;
- user-facing copy follows [35-copy-bible.md](./35-copy-bible.md);
- affected documentation and frontmatter are updated;
- the diff contains no secrets, generated noise, or unrelated cleanup;
- rollback or feature-flag behavior is clear for risky changes.

See [20-testing-quality.md](./20-testing-quality.md) for suite ownership and [09-ci-cd.md](./09-ci-cd.md) for merge and release gates.
