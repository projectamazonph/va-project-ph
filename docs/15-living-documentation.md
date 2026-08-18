---
title: Living Documentation - Freshness, Ownership and Source of Truth
file: 15-living-documentation.md
version: 1.0
reviewed: 2026-08-18
owner: Docs Owner
status: active
source: extracted from AGENTS.md, 22-content-curriculum-ops.md, 29-repo-artifacts.md, and 30-open-questions.md
---

# 15 - Living Documentation

Documentation is a product surface. A stale runbook can be as harmful as a broken route, so every document has an owner, a review date, and a defined relationship to the code or decision it describes.

## Frontmatter contract

Every formal document under `docs/` must begin with:

```yaml
---
title: Human-readable title
file: exact-filename.md
version: 1.0
reviewed: YYYY-MM-DD
owner: Named role
status: active | draft | archived | superseded
---
```

Use `source`, `supersedes`, and `superseded-by` when provenance or replacement matters. The `file` value must match the actual filename.

## Source-of-truth order

When documents disagree, resolve the conflict in this order:

1. current code, schema, and executable tests for shipped behavior;
2. an accepted ADR for an intentional architectural decision;
3. the active numbered document for policy or operating guidance;
4. product and UX documents for intended future behavior;
5. audits, handoffs, and archived documents as historical evidence only.

If the conflict cannot be resolved from evidence, record it in [30-open-questions.md](./30-open-questions.md) and do not silently choose a new behavior.

## Maintenance rules

- Review active documents at least every 30 days and after a material implementation change.
- Update the document in the same PR as the behavior it describes, or link a follow-up issue with an owner and due date.
- Historical audits remain intact; add a current-status note instead of rewriting history.
- A renamed document needs a link-preserving redirect note or updated references in the same change.
- Delete neither a decision record nor an incident record merely because the implementation changed.

## Verification

Run:

```bash
pnpm docs:check
```

The current checker validates local Markdown links. Frontmatter freshness, index completeness, and code-reference checks are policy requirements and should be added to the checker before being described as automated gates. Until then, reviewers verify them manually using this document.

## Change checklist

- [ ] Title, filename, owner, status, version, and review date are correct.
- [ ] Links resolve and point to the canonical document.
- [ ] Claims about shipped behavior were checked against code or tests.
- [ ] The index and any source-of-truth documents were updated.
- [ ] Historical material is marked as historical rather than presented as current.
- [ ] A reviewer who owns the affected system or policy approved the change.
