---
title: Git Guardrails - Branches, Commits and Pull Requests
file: 14-git-guardrails.md
version: 1.0
reviewed: 2026-08-18
owner: DevOps Lead
status: active
source: extracted from AGENTS.md, 09-ci-cd.md, and 29-repo-artifacts.md
---

# 14 - Git Guardrails

Git history is part of the operating system for this project. It must explain what changed, why it changed, and how the change was verified.

## Branch policy

| Work | Branch pattern | Merge target |
|---|---|---|
| Feature | `feat/<short-name>` | `main` via pull request |
| Bug fix | `fix/<short-name>` | `main` via pull request |
| Documentation | `docs/<short-name>` | `main` via pull request |
| Emergency production fix | `hotfix/<short-name>` | `main` via expedited pull request |

Never commit directly to `main`, rewrite shared history, or force-push a protected branch. Keep one concern per branch and keep the branch short-lived.

## Commit format

Use Conventional Commits:

```text
<type>(<scope>): <imperative summary>
```

Allowed types are `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, and `chore`. Keep the subject short, present-tense, and specific. Use the body for the decision or trade-off, not a transcript of commands.

Examples:

```text
docs(simulators): add search-term trainer contract
fix(auth): reject expired session before loading dashboard
test(metrics): cover zero-sales ACOS behavior
```

## Pull request contract

Every PR must state:

- what changed and why;
- the user story, issue, or decision it satisfies;
- tests and checks run, including any known limitation;
- files or modules owned by another lead that were touched;
- risk, migration impact, and rollback plan;
- documentation impact, including why no docs changed when that is the conclusion.

Use the repository PR template from [29-repo-artifacts.md](./29-repo-artifacts.md). Reviewers should compare the diff to the acceptance criteria, not only to the commit message.

## Merge gates

The PR must be green on typecheck, lint, secrets scan, docs link checks, affected tests, and the required build checks in [09-ci-cd.md](./09-ci-cd.md). A red check may be overridden only by the named owner with a written reason and follow-up issue.

Squash merge to `main` unless preserving a multi-commit investigation is materially useful. Do not merge a failing migration, a disabled security check, or a change that silently alters a public contract.

## Release and hotfix rules

- Tag releases as `vYYYY.MM.DD-n`.
- Release from `main` only; deploy during the window in [09-ci-cd.md](./09-ci-cd.md).
- A hotfix still needs a regression test, one reviewer, and a post-incident follow-up within 48 hours.
- Database changes are additive-first so the previous application version can still run during rollback.
- Secrets, credentials, and real Amazon Advertising data never enter Git history. If exposed, rotate first and investigate second.
