---
title: Wireframes and Page Element Maps - Mobile-First
file: 33-wireframes-mobile-first.md
version: 1.0
reviewed: 2026-08-17
owner: Design Lead
status: active
---

# Wireframes and Page Element Maps - Mobile-First

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Design Lead

Convention: ASCII wires drawn at 360px mobile base. Element IDs (e.g., D-4) map to behavior in 34-interactions-and-events.md. Desktop deltas are annotated; full desktop wires only where layout truly differs.

## App Shell (shared by all authenticated pages)

Mobile shell (360px):

```
+--------------------------------------+
| [H-1] Topbar: logo + level pill + XP | 56px
+--------------------------------------+
|                                      |
|         Page content                 |
|         (scrollable,                 |
|          pb for bottom-nav)          |
|                                      |
+--------------------------------------+
| [H-2] Bottom nav: Home | Practice |  64px + safe-area
|  Coach | Me                          |
+--------------------------------------+
```

Rules:
- Topbar always visible on long lessons? NO - always visible (predictability beats cleverness).
- Reading position: sessionStorage restore per lesson.

## Practice Hub and Tools

### Trainer (/practice/trainer)

```
+----------------------------------+
| [T-1] Context strip: product     |
|  margin - break-even ACOS        |
| [T-2] Rows as CARDS (mobile):    |
|  term (bold, break-words)        |
|  metrics row: 14 clicks          |
|  $13.50 - $75 - ACOS 18% (color) |
|  [T-3] Action segmented control: |
|  Exact | Neg | Lower | Watch     |
| [T-4] Sticky footer: [Grade my   |
|  decisions] + answered count x/10 |
| [T-5] Result: score pop + per-row|
|  feedback cards (+/- + why)      |
+----------------------------------+
```

>= lg: classic data table + inline selects (table has sticky header inside scroll region). Segmented control = 4 equal buttons in a rounded container; selected = blue fill; tap area full cell.

### Builder (/practice/builder) - mobile is a 3-step stepper, desktop is 2-col (form left, live estimate + score right):

Step indicator: 1 Basics - 2 Keywords and Negatives - 3 Review
- [B-1] Basics: product select, name, budget
- [B-2] Keyword composer: text + match + bid + [Add]; list rows with X; negatives chips with X
- [B-3] Review: summary + grading rules + [Score my campaign]
- [B-4] Result: score tile + checklist rows (+/- + note)

Rules: stepper state survives refresh (URL ?step=2); Add buttons validate inline; list empty-states have helper text.

### Report (/practice/report) - mobile: inputs accordion -> preview card; desktop: split 2-col sticky preview.

IDs: [P-1] 6 number inputs (label above, prefix PHP/$ toggle), [P-2] live metric tiles 3x2, [P-3] wins/issues/next textareas, [P-4] Generate + Copy, [P-5] preview pane (pre-wrap, break-words).

### Quiz (/practice/quiz) - single question card flow:

- [Q-1] progress bar + "Question 3 of 10"
- [Q-2] question
- [Q-3] option buttons full-width (min-h-12)
- [Q-4] feedback panel + Next
- [Q-5] result screen: score ring + retry/back

After answer: correct=green border, chosen-wrong=red, others 50% opacity.

## Coach (/coach)

```
+----------------------------------+
| [C-1] Header: avatar - Coach Bot |
|  + online                       |
| [C-2] Message list (scroll       |
|  region, flex-1, own overflow):  |
|  bot bubbles left (card),        |
|  user bubbles right (blue)       |
| [C-3] Suggestion chips row       |
|  (horizontal scroll, snap)       |
| [C-4] Input bar: field + send    |
|  (sticky above bottom nav)       |
| [C-5] Typing dots bubble         |
+----------------------------------+
```

Rules: chat region is the ONLY scroller on the page (h-[100dvh] minus shell); auto-scroll on new msg unless user scrolled up ("down New message" pill appears instead); 100dvh not 100vh (mobile browsers). Desktop: centered max-w-3xl column, chips wrap.

## Me (/me, /me/settings)

- [D profile] avatar, name, level card, certificate shelf
- [settings] grouped list rows: Account, Notifications (toggles), Data saver, Privacy (export/delete), Log out (danger outline)

Rules: list rows with chevron; destructive zone visually separated (border-danger); toggles >=44px and labeled (never icon-only).

## Teacher pages (/teacher/*) - role-gated

### Cohort dashboard

```
+----------------------------------+
| [TC-1] Stat trio: avg progress   |
|  at-risk count - top performer   |
| [TC-2] Search field              |
| [TC-3] Student rows: avatar      |
|  initials - name - level pill    |
|  progress bar - XP - status chip |
|  (STAR/ON TRACK/AT RISK)         |
|  row tap -> detail               |
+----------------------------------+
```

Desktop adds columns (weak area, last active) - mobile hides into expandable row (chevron rotates, aria-expanded).

### Student detail /teacher/students/:id

Tabs (segmented, sticky under topbar): Overview - Activity - Submissions - Notes.
- [TD-1] header card (name, level, contact action)
- [TD-2] module bars
- [TD-3] attempts list (quiz/trainer/builder scores, dates)
- [TD-4] assign lesson button -> sheet with due date
- [TD-5] notes composer + history

### Grading queue /teacher/grading

Rows: student - artifact type - submitted time - [Open]. Desktop: split view - queue left, artifact + rubric + comment box right. Mobile: queue -> full-screen review with sticky [Save grade].

## Admin / Backend pages (/admin/*)

Shared admin shell: desktop sidebar sections (Overview, Users, Content, Cohorts, Audit, Flags, Health); mobile: same as teacher shell with admin section in bottom-sheet nav. Data tables pattern everywhere:

[A-0] Table card:
  - header row: title + count chip - search - filters
  - toolbar: bulk actions (appear when rows selected)
  - body: rows with checkbox - cells - row menu (...)
  - footer: pagination (prev/next + "Page 2 of 9" + rows select)
  - empty state: art + plain sentence + action

Mobile transforms every admin table into filterable card lists (same data, same actions in row menu). Never horizontal-scroll tables in admin mobile.

| Page | Key elements |
|---|---|
| Overview | KPI tiles (DAU, lessons/day, signups, coach questions), charts (lazy), recent incidents |
| Users | table per A-0; drawer on row: profile, progress, role select (double-confirm), suspend/reactivate, impersonate (ticket id required) |
| Content | module tree -> lesson editor: block-based (p/list/table/tip/example), live student-preview toggle, version history list, publish bar (draft->preview->publish) |
| Audit | append-only list, filters (actor/action/date), CSV export button with confirm |
| Flags | flag rows: name, default, env override, kill-switch toggle (danger styling) |
| Health | build SHA, migrations, queue depth, error rate, dependency audit status |

## Universal Patterns (build once, reuse everywhere)

| Pattern | Spec |
|---|---|
| Page header | title (font-display, clamp) + optional subtitle + right actions; wraps to stack |