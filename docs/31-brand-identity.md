---
title: Brand Identity and Visual Tokens - The VA Project Philippines
file: 31-brand-identity.md
version: 1.0
reviewed: 2026-08-18
owner: Design Lead
status: active
source: extracted from 02-design.md and 35-copy-bible.md
---

# 31 - Brand Identity and Visual Tokens

This is the brand-level source for the visual and verbal identity of The VA Project Philippines. Component behavior and implementation guardrails remain in [02-design.md](./02-design.md); product copy remains in [35-copy-bible.md](./35-copy-bible.md).

## Brand core

| Item | Decision |
|---|---|
| Full name | The VA Project Philippines |
| Short mark | VA Project PH; VAPP is internal only |
| Promise | Zero experience in. Skilled, hired-ready VA out. |
| Audience | Filipino aspiring VAs: students, BPO agents, returning parents, OFW returnees, and fresh graduates |
| Feeling | Warm, professional, capable, and encouraging — like an expert ate |
| Enemy | Expensive, jargon-heavy training that assumes prior knowledge |

## Brand pillars

- **Plain and proud:** beginners get clear words and zero shame.
- **Built for Filipino reality:** mobile-first, data-light, and friendly to local payment habits.
- **Practice over promises:** demonstrate skill through safe practice and feedback.
- **One clear path:** progress is visible and the next action is obvious.

## Visual tokens

| Token | Value | Use |
|---|---|---|
| `ink` | `#0A1F3C` | primary text, headings, dark surfaces |
| `blue-700` | `#1A4FBF` | primary actions, links, active states |
| `blue-800` | `#153F98` | hover and pressed states |
| `blue-50` | `#EAF1FE` | selected and soft information surfaces |
| `sun-400` | `#F5B301` | XP, badges, progress, accents |
| `sun-50` | `#FFF6DE` | highlight panels |
| `paper` | `#F7F8FB` | app background |
| `card` | `#FFFFFF` | cards and content surfaces |
| `success` | `#15803D` | positive states with an icon or label |
| `danger` | `#C81E3C` | errors and destructive actions |
| `warn` | `#B45309` | caution states with an icon or label |
| `muted` | `#5B6B84` | secondary text |
| `line` | `#E3E8F0` | borders and dividers |

Blue is the primary action color. Yellow is a reward accent, never a large primary surface. Meaning must never rely on color alone, and text contrast must meet WCAG AA targets.

## Type and shape

- Display headings use Sora; body and interface text use Inter with a readable fallback.
- Use a 4px spacing base and the 8/12/16px radius family from [02-design.md](./02-design.md).
- Cards use a visible border and restrained shadow; layouts are mobile-first and data-light.
- Interactive targets are at least 44px; focus-visible states are always visible.
- Respect reduced-motion preferences and avoid animation that delays a learner's next action.

## Voice boundary

Use clear English for lessons, metrics, money, reports, client-facing templates, and legal content. Use Filipino warmth or Taglish only where it adds comfort or emotion; never use slang to explain a financial or career decision. See [35-copy-bible.md](./35-copy-bible.md) for approved copy and [59-student-ux-copy-deck.md](./59-student-ux-copy-deck.md) for student-facing states.

## Asset provenance

Log generated or licensed assets in `public/brand/PROVENANCE.md`. Do not hotlink production imagery or create an untraceable logo variant. A visual change that alters recognition, contrast, or the promise requires Design Lead review.
