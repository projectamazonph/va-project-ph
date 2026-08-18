---
title: PPC Coach - Design System and UX
file: design.md
version: 1.0
reviewed: 2026-08-17
owner: Design Lead
status: archived
supersedes: null
superseded-by: docs/02-design.md (VA Project PH blue/sun palette)
source: recovered from conversation transcript (user paste of PPC Coach index)
---

Design System & UX

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Design Lead
Product tone: patient teacher. Plain words. No jargon without definition. Celebrate small wins.

Brand

| Element | Value |
|---|---|
| Name | PPC Coach |
| Tagline | Amazon PPC Teaching Companion |
| Voice | Simple, warm, direct. 6th-grade reading level. No shaming for mistakes. |
| Logo | /public/brand/logo.png (flat, orange/navy) |

Color Tokens

| Token | Hex | Use |
|---|---|---|
| brand-500 | #FF9900 | Primary actions, XP, progress |
| brand-600 | #E68A00 | Hover |
| brand-50 | #FFF7E6 | Soft highlight backgrounds |
| navy-900 | #0F172A | Sidebar, headings |
| navy-700 | #334155 | Body text dark |
| surface | #F4F5FA | App background |
| card | #FFFFFF | Cards |
| success | #10B981 | Positive states |
| warning | #F59E0B | Caution |
| danger | #EF4444 | Errors, destructive |
| muted | #64748B | Secondary text |

Rules: contrast ≥ 4.5:1 for text; never rely on color alone (always add icon/label); dark surfaces use white/70+ text.

Typography

| Role | Font | Size/Weight |
|---|---|---|
| Display/H1-H2 | Space Grotesk | 700 |
| Body/UI | Inter | 400/600 |
| Small labels | Inter | 700, 11–12px, uppercase tracking-wide |

Fonts via fontsource CDN. Fallback: system sans. Line-height ≥ 1.5 for body.

Spacing, Radius, Elevation

Scale: 4px base (4/8/12/16/24/32/48).
Radius: inputs 12px, cards 16px, pills 999px.
Shadows: card = 0 1px 2px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.07).

Core Components Inventory

| Component | States required |
|---|---|
| Button | default / hover / active / disabled / loading(spinner) |
| Input + Label | default / focus ring / error (message below) |
| Card | base / hover-lift (statcard) / bordered-top accent |
| Table | header navy, zebra rows, horizontal scroll on mobile |
| Toast | xp (navy) / level (green) / info (white) / warn (red); auto-dismiss 3.4s |
| Progress bar | animated width transition (.bar) |
| Badge | earned (brand tint) / locked (gray 50% opacity) |
| Modal/Confirm | focus-trapped, Esc closes |
| Empty state | icon + one plain sentence + next action button |

UX Principles

One decision per screen — trainer rows, quiz questions, builder steps.
Immediate feedback — every action toasts or animates within 300ms.
Safe practice before live — simulators never touch real money; say so on screen.
Progress is visible everywhere — XP bar in sidebar, module bars, level pill.
Errors teach — wrong answers show the right reasoning, not just "incorrect".
Plain-words tooltips — every metric (ACOS, CPC…) is hover-explainable.

Key Flows

Student lesson flow
Dashboard → Module card → Lesson list → Reader → Mark complete (+20 XP toast) → Next lesson

Trainer flow
Table of search terms → choose action per row → Grade → score card + per-row explanations → retry

Teacher flow
Cohort view → filter/search → spot at-risk → open student detail → assign lesson/remediation

Responsive Rules

Breakpoints: sm 640 / lg 1024 / xl 1280.
Sidebar: fixed ≥lg; slide-in drawer with overlay
