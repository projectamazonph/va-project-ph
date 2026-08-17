---
title: Student Lesson and Web App UX Copy Deck
file: 59-student-ux-copy-deck.md
version: 1.0
reviewed: 2026-08-17
owner: Curriculum + Design Lead
status: active
source: reference/student-ux-copy-deck-source.pdf
---

# Student Lesson and Web App UX Copy Deck

Version: 1.0 - Reviewed: 2026-08-17 - Owner: Curriculum + Design Lead

This document records the student-facing lesson and product copy imported from the
attached copy deck. The complete source artifact is preserved as
[student-ux-copy-deck-source.pdf](./reference/student-ux-copy-deck-source.pdf).

The product-facing sections below are canonical guidance for implementation. Any
conversational framing in the source artifact is editorial history, not UI copy.

## 1. Student learning path

The course moves from Amazon basics to safe account work and a supervised capstone.
Lesson titles and goals must stay beginner-friendly, practical, and plain-word.

| Module | Core lesson | Time | Student outcome |
|---:|---|---:|---|
| 0 | Amazon Basics Before PPC | 5 min | Tell organic results apart from paid Sponsored results. |
| 1 | What is Amazon PPC? | 10 min | Explain Pay-Per-Click, bids, impressions, and clicks. |
| 2 | Money Math Every PPC Assistant Must Know | 15 min | Calculate ACOS and compare it with profit margin. |
| 3 | Campaign Structure | 10 min | Explain campaigns, ad groups, budgets, and targeting. |
| 4 | Keywords and Match Types | 15 min | Separate keywords from search terms and choose match types. |
| 5 | Listing Readiness | 10 min | Know when a weak listing should be fixed before ads run. |
| 6 | Campaign Setup for Beginners | 20 min | Build a safe automatic research campaign. |
| 7 | Bids and Budgets | 10 min | Set safe starting bids and make small changes. |
| 8 | Search Term Mining and Negative Keywords | 15 min | Find waste, add negatives, and harvest winners. |
| 9 | Weekly Optimization Routine | 10 min | Follow a patient, repeatable weekly optimization loop. |
| 10 | Reporting and Explaining Results | 15 min | Explain numbers in plain English with context. |
| 11 | Troubleshooting Common Problems | 15 min | Diagnose zero impressions, clicks, or sales safely. |
| 12 | Virtual Assistant PPC Workflow | 5-15 min | Protect the account with daily and weekly checks. |
| 13 | Client Communication | 10 min | Ask for approval and report problems with solutions. |
| 14 | Capstone Project | 2 hours | Manage a practice account and submit a client-ready bundle. |

### Required teaching points

- Impressions are free; a click is what creates ad cost.
- ACOS is ad spend divided by ad sales, multiplied by 100. Break-even ACOS is tied to margin.
- A campaign owns the daily budget; an ad group holds products and targeting.
- Broad, Phrase, and Exact match trade reach for control.
- A weak listing, lost Buy Box, or out-of-stock product can make advertising wasteful or unavailable.
- Starting bids should be conservative. Bid changes are normally limited to 10%-20% at a time.
- Search-term decisions use enough data. Do not pause or change a campaign because of one quiet day.
- Negative Phrase blocks a word or phrase anywhere in a search; Negative Exact blocks one exact phrase.
- Winning search terms move from research/automatic campaigns into controlled Manual Exact campaigns.
- Daily checks protect the account; meaningful optimization happens weekly using 7-14 days of data.
- Junior VAs ask for approval before increasing total budgets, launching campaigns, exceeding suggested bids, or changing listings.
- The capstone uses a practice account and fake money. It must not connect to live Amazon Ads.

## 2. Web app navigation copy

### Student navigation

- Dashboard
- My Lessons
- Practice Simulator
- Worksheets & Templates
- PPC Glossary
- Ask the AI Coach
- My Certificates
- Settings

### Header

- Greeting: `Welcome back, [Name]`
- Progress: `[N] Day Streak | [N] XP`
- Help: `Need help? Hover over any blue dotted word for a quick definition.`

## 3. Dashboard states

### New student

- Headline: `Welcome to Amazon PPC Training!`
- Body: `You are starting from zero, and that is perfectly fine. We will take this one step at a time. Your first step is to understand how Amazon's search results work.`
- Primary action: `Start Module 0: Amazon Basics`
- Secondary action: `Take the 2-minute placement quiz instead.`

### In progress

- Headline: `Pick up where you left off.`
- Progress example: `Module 4: Keywords and Match Types` / `Lesson 2: Broad vs. Exact Match` / `60% Complete`
- Action: `Continue Lesson`
- Weekly goal: `Complete 3 practice simulator cases this week. (1/3 completed)`

### Completed

- Headline: `You did it!`
- Body: `You have completed all modules and passed the Capstone Project. You are officially a Certified Junior PPC Assistant.`
- Primary action: `Download My Certificate`
- Secondary action: `Review Past Lessons`

## 4. Lesson player copy

- Toggle: `Watch Video` / `Read Text`
- Glossary example: `ACOS (Advertising Cost of Sales): The percentage of your ad sales that goes toward paying for the ads. Formula: Spend ÷ Sales.`
- Previous action: `Previous Lesson`
- Completion action: `Mark Complete & Continue`
- Worksheet action: `Download Worksheet`
- Quiz heading: `Check Your Understanding`
- Submit action: `Check My Answers`
- Success: `Correct! You've got it.`
- Retry: `Not quite. Review the Simple Explanation section above and try again.`

## 5. Practice simulator copy

### Safe-mode framing

- Title example: `Practice Case: Bamboo Cutting Board`
- Badge: `Safe Mode (No real money used)`
- Metrics example: `Spend: $22.00 | Sales: $70.00 | ACOS: 31.4% | Clicks: 20`
- Submit action: `Submit My Decisions`

### Feedback rules

- Good choices: explain which wasted terms were identified, award practice XP, and unlock a badge.
- Risky choices: explain why increasing budget while ACOS is above margin scales losses; ask the student to try again.
- Destructive choices: explain why pausing after only 20 clicks stops learning; send the student back to the relevant lesson.
- Never imply that simulator decisions change a live account.

## 6. Worksheets and submissions

- Upload prompt: `Drag your completed Search Term Cleanup Sheet here, or click to browse.`
- Formats: `PDF, XLSX, CSV, JPG`
- Maximum size: `10MB`
- Autosave: `Draft saved locally.`
- Pending review: `Submitted! Your teacher will review this within 24 hours.`
- Passed: `Approved! Great job spotting those negative keywords.`
- Needs work: `Needs Revision. Your teacher left 2 comments on your sheet. Please review and resubmit.`

## 7. AI Coach copy and safety boundary

- Placeholder: `Ask a question (e.g., 'Why is my CTR so low?')`
- Starter prompts: `Explain ACOS like I'm 5` / `How do I write a client email?` / `What's the difference in Broad vs Exact?`
- Pinned disclaimer: `The AI Coach is here to explain concepts and review practice data. It will never tell you to make risky changes to a live client account without manager approval.`
- Response modes: plain concept explanation, step-by-step math help, and a highlighted safety warning.
- Safety example: `Remember: Always check stock levels before increasing bids!`

The coach must use the rule engine first, keep explanations plain, avoid financial
advice, and fall back safely when the LLM is disabled or unavailable. See
`docs/08-backend.md` and `docs/24-ai-governance.md`.

## 8. Global messages

### Success

- `Lesson marked as complete!`
- `Worksheet uploaded successfully.`
- `You earned the 'Math Master' badge!`
- `Simulation passed with a perfect score.`

### Warning

- `You haven't saved your worksheet in 10 minutes. Click save!`
- `You are about to leave a graded quiz. Are you sure?`

### Error

- `Upload failed. File type not supported.`
- `Connection lost. Please check your internet and refresh.`

## 9. Teacher dashboard copy

- Queue heading: `Submissions Awaiting Review`
- Empty queue: `All caught up! No student submissions right now.`
- Actions: `Approve` / `Request Changes` / `Leave Note`
- Risk heading: `Attention Required`
- Risk body: `[Student Name] has failed the "Money Math" quiz 3 times and triggered 4 "Risky Action" warnings in the Simulator.`
- Intervention actions: `Send Intervention Message` / `Schedule 1-on-1`

## 10. Implementation rules

1. Use this deck with `docs/35-copy-bible.md` for voice, Taglish boundaries, and copy QA.
2. Keep lesson content in the curriculum/content pipeline; do not hard-code full lessons inside UI components.
3. Link or define glossary terms on first use. Never teach a money formula with a different definition.
4. Keep simulator copy explicit about fake money and safe practice.
5. Every loading, empty, success, warning, and error state needs plain, actionable copy.
6. Any new student-facing string must pass the copy QA gates in `docs/35-copy-bible.md`.
