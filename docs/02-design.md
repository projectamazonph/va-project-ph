---
title: The VA Project Philippines - Brand, Theme and Visual Guardrails
file: 02-design.md
version: 1.0
reviewed: 2026-08-17
owner: Design Lead
status: active
supersedes: PPC Coach orange/navy palette (archived to docs/archive/design.md)
superseded-by: docs/31-brand-identity.md for brand identity and token ownership
---

The VA Project Philippines — Brand, Theme & Visual Guardrails

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Design Lead
The brand identity and token source of truth is [31-brand-identity.md](./31-brand-identity.md). This file retains component-level visual implementation guardrails and detailed usage rules.

Brand Core

| Item | Value |
|---|---|
| Full name | The VA Project Philippines |
| Short marks | VA Project PH · VAPP (internal) |
| Promise | "Zero experience in. Skilled, hired-ready VA out." |
| Audience | Filipinos aspiring to become virtual assistants — students, BPO agents, moms returning to work, OFW returnees, fresh grads |
| Feeling | Warm but professional. Like a supportive older sister (ate) who happens to be an expert. |
| Enemy | Expensive, jargon-heavy courses that assume you already know everything. |

Brand pillars (every design decision filters through these)
Plain and proud — simple words, zero shame for beginners.
Built for the Filipino reality — mobile-first, data-light, GCash-friendly, Taglish warmth.
Practice over promises — simulators, not slogans.
One clear path — progress is always visible; nobody ever wonders "what now?"

Color System (Philippine-inspired, WCAG-checked)

Inspiration: flag blue (trust), sun yellow (optimism), sampaguita white (clarity). Tuned for screens.

| Token | Hex | Use | Text on it |
|---|---|---|---|
| ink | #0A1F3C | Sidebar, headings, primary text on light | white |
| blue-700 | #1A4FBF | Primary actions, links, active states | white |
| blue-800 | #153F98 | Hover/pressed | white |
| blue-50 | #EAF1FE | Selected rows, soft highlights | blue-800 |
| sun-400 | #F5B301 | XP, badges, accents, progress fills | ink |
| sun-50 | #FFF6DE | Highlight panels | ink |
| paper | #F7F8FB | App background | — |
| card | #FFFFFF | Cards | ink |
| success | #15803D | Positive states | white |
| danger | #C81E3C | Errors, destructive (flag-red, softened) | white |
| warn | #B45309 | Caution text | white |
| muted | #5B6B84 | Secondary text | — |
| line | #E3E8F0 | Borders & dividers (single border color everywhere) | — |

Rules:
One primary (blue-700). Yellow is reward/accent only — never a large surface on its own.
Text contrast ≥ 4.5:1; large text ≥ 3:1. CI runs contrast checks on token pairs.
Never convey meaning by color alone (icon + label always).

Typography

| Role | Font | Source | Scale |
|---|---|---|---|
| Display / H1–H2 | Sora | fontsource CDN | clamp sizes (§5) |
| Body / UI | Inter | fontsource CDN | 14–16px body, 1.5–1.7 line-height |
| Numbers in metrics | Inter tabular (font-variant-numeric: tabular-nums) | — | prevents layout shift |

Font loading: display=swap; text must render with fallback sans before swap (no invisible text on slow PH connections).

Shape, Depth, Borders

| Token | Value | Rule |
|---|---|---|
| Radius sm / md / lg / pill | 8 / 12 / 16 / 9999px | inputs 12, cards 16, buttons 12, pills 9999 |
| Card boundary | border border-line + shadow-card | EVERY card uses both — no exceptions (fixes "missing borders" forever) |
| Inner dividers | divide-y divide-line | hairlines inside lists/tables |
| shadow-card | 0 1px 2px rgba(10,31,60,.05), 0 8px 24px rgba(10,31,60,.06) | |
| shadow-pop | 0 12px 32px rgba(10,31,60,.16) | modals, sheets only |

Spacing & Layout Skeleton

Scale: 4px base → 2/4/8/12/16/20/24/32/48/64.
Page padding: px-4 mobile → md:px-6 lg:px-8; content max-w-6xl mx-auto.
Section rhythm on marketing pages: py-12 md:py-20.
Reading width for lesson text: max-w-[65ch].
Headings use fluid clamp: H1 clamp(1.75rem, 4vw + 1rem, 3rem).
Grid gaps: gap-4 mobile → lg:gap-6.

Iconography & Artifacts

Icons: 24px stroke-1.8 rounded-cap line set (heroicons style), single library only.
Empty-state illustrations: flat, blue/sun palette, Filipino context (jeepney, sari-sari store, phone-in-hand) — generated assets in /public/art/ with provenance (29-repo-artifacts.md).
Module icons: consistent emoji-in-tinted-square pattern (w-11 h-11 rounded-xl bg-blue-50 grid place-items-center text-xl).
Logo: primary horizontal lockup (sun-ray mark + wordmark), monochrome versions for dark/light. Clear space = height of sun mark. Never stretch, recolor, or add effects.

Motion Identity

| Pattern | Spec |
|---|---|
| Page/view enter | fadeUp 300ms ease-out |
| Card hover | translateY(-2px) + shadow-pop-lite, 200ms |
| Button press | scale(0.98), 100ms |
| Progress bars | width 700ms cubic-bezier(.22,1,.36,1) |
| XP toast | slide from bottom on mobile / right on desktop |
| Skeletons | shimmer 1.4s infinite, same shape as final content |
| Respect | prefers-reduced-motion: reduce → all animation off except opacity |

Visual Guardrails (CI + review checklist)

No horizontal page scroll at 320–2560px (Playwright assertion at 360/390/768/1280/1920).
Every card has border + shadow (lint rule scans for card class without border token).
All interactive elements ≥ 44×44px touch target.
Truncation classes required on any user/content-derived text inside fixed containers (min-w-0 + truncate/line-clamp-2).
Images have width/height (no CLS) and loading="lazy" below fold.
Sticky elements respect env(safe-area-inset-*).
No inline hex outside this file (lint: tailwind tokens only).
Focus-visible ring on everything: focus-visible:ring-2 ring-blue-700 ring-offset-2.
