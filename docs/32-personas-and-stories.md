---
title: Personas and Stories - Filipino Aspiring VAs
file: 32-personas-and-stories.md
version: 1.0
reviewed: 2026-08-17
owner: Product Owner
status: active
---

# Personas and Stories - Filipino Aspiring VAs

Version: 1.0 · Reviewed: 2026-08-17 · Owner: Product Owner

Research basis: PH VA community patterns (BPO attrition, WFH demand, mobile-dominant internet, prepaid data culture). Validate with beta interviews; update quarterly.

## Shared Context (designs for ALL personas)

| Reality | Design implication |
|---|---|
| Mobile-first nation; many own only a phone | Bottom-nav app, thumb-zone CTAs, 360px base |
| Prepaid data (Globe/Smart/DITO), cost-conscious | Lightweight pages, no autoplay video, data-saver toggle |
| Intermittent connectivity + brownouts | Offline lesson cache, autosave, retry gracefully |
| Shared family devices/laptops | Fast account switching, auto-logout, no sensitive data on screen unattended |
| GCash is the default payment | GCash/QR checkout before cards |
| Facebook + group chats = community | Shareable progress cards, referral links |
| English is professional language; Tagalog is emotional language | English UI; Taglish only in encouragement moments |

## Persona 1 - Jessa, 27: "The Night-Shift Escape Plan"

Profile: BPO call-center agent, Cebu City. Earns ₱22k/month. Graveyard shift, sleeps until 2pm. Lives with parents + 2 siblings.

Devices and connectivity: Android phone (6.1", 4GB RAM), prepaid 5G data; family Wi-Fi at night.

Story: Jessa has spent four years absorbing irate customers at 3am. Her body is tired, her English is excellent, and she knows she can do more - on her own schedule. Between calls she scrolls VA success stories and thinks, "Kung kaya nila, kaya ko rin." She tried one ₱4,000 "VA masterclass" before and got 40 hours of rambling videos and zero practice. She needs structure she can trust on a phone, during a 30-minute break, without wasting data.

Goals: WFH job with foreign client in 3-6 months; fix her sleep; help pay sibling's tuition.
Fears: Scam courses; being "found out" as inexperienced; wasting money she saved from overtime.
JTBD: "When I have 30 minutes between calls, help me make visible progress toward leaving the night shift - without wasting my data or my savings."

Design implications: short lessons (≤10 min), resumable mid-lesson, dark-friendly reading at 3am, mobile XP that feels like a game streak, certificate she can screenshot for job applications.

## Persona 2 - Mark, 22: "The Fresh Grad With Nothing on Paper"

Profile: BS Business Admin graduate, Malolos, Bulacan. No full-time job yet. Applies daily; gets screened out for "no experience."

Devices and connectivity: Borrowed family laptop (old Windows), his phone with budget promo data.

Story: Mark's resume is one page with an internship and campus orgs. Every VA posting asks for experience he can't get without a first job. He's sharp and a little proud - he won't take anything that feels like "pang-mga beginner lang" baby content, even though he IS a beginner. He needs to convert learning into proof: portfolio pieces, certificates, and language he can put on a resume.

Goals: A credential + portfolio that substitutes for experience; first paying client within 4 months.
Fears: Being seen as a student forever; content that's too shallow to mention in an interview.
JTBD: "Give me proof I can do this work - artifacts I can show a client - before anyone will hire me."

Design implications: capstone outputs framed as "portfolio pieces," downloadable client-report samples, "How to describe this skill on your resume" boxes, professional-tone copy (never childish).

## Persona 3 - Angel, 34: "The Mom Rebuilding Her Career"

Profile: Former office admin (5 yrs), now stay-at-home mom of two, Imus, Cavite. Left work 6 years ago.

Devices and connectivity: Mid-range Android phone; her husband's laptop on weekends.

Story: Angel ran an office before her first child was born. Now her day is chopped into 20-minute fragments between school runs, lunch prep, and naps. She's terrified her skills are "expired." She doesn't need the basics explained slowly - she needs them mapped to skills she already has, and she needs absolute flexibility: stop anytime, resume next week, no streak-shame.

Goals: Part-time VA income (₱10-15k) within school hours; confidence that she's still employable.
Fears: Technology that moved on without her; courses that assume 3 free hours a day.
JTBD: "Fit into my broken-up day, respect what I already know, and never make me feel behind."

Design implications: "Resume mapping" onboarding (skip-ahead quiz), zero shame on returning after weeks away ("Welcome back, Angel - picking up exactly where you left off"), all state persisted, large readable type, no time-pressure mechanics.

## Persona 4 - Raffy, 38: "The OFW Returnee Building His Own Thing"

Profile: Returned from 8 years in Dubai (retail supervision). Has savings (~₱300k) and a laptop. Taguig. Wants a location-independent income stream, possibly an agency later.

Devices and connectivity: Good laptop, fiber internet. Comfortable with tech but not marketing jargon.

Story: Raffy has seen enough of trading his time for dirhams. He researched "PPC management" as a high-value VA niche and knows the numbers matter (ROI, ACOS) but the vocabulary is a wall. He learns fast when things are structured like a business: objectives, checklists, SOPs. He will pay for quality and speed, and he wants to know the ceiling - can this become a team, an agency?

Goals: Manage 2-3 SME clients in 6 months; systematize with SOPs; maybe hire VAs himself someday.
Fears: Dabbling without a system; being sold fluff.
JTBD: "Give me the professional operating system - SOPs, templates, reporting - so I can sell this skill like a business, not a side hustle."

Design implications: SOP/template library front-and-center, advanced track content, client-facing report tools, business framing in copy, premium tier with 1:1 coaching.

## Persona 5 - Kyla, 20: "The Student Side-Hustler"

Profile: 3rd-year college student, Davao City. Takes online classes; wants income without dropping out.

Devices and connectivity: Budget Android (3GB RAM), campus Wi-Fi + small data promo.

Story: Kyla sees classmates earning from online work and wants in - but her phone is slow, her data is ₱50/day, and her free time is irregular. She needs the lightest possible experience that still feels premium, and she will recruit her entire friend group if the product earns her trust.

Goals: First paid gig before graduation; skills that stack with her degree.
Fears: Anything heavy/expensive; being locked into payments she can't sustain.
JTBD: "Work on my slow phone with tiny data, and let me start for free."

Design implications: aggressive performance budget, free tier is genuinely complete for fundamentals, shareable progress cards, student pricing via GCash.

## Journey Map (shared path, persona variance noted)

| Stage | Moment | Jessa | Mark | Angel | Raffy | Kyla |
|---|---|---|---|---|---|---|
| Awareness | FB post from a hired VA / friend share | yes | yes | yes | yes | yes-yes |
| Consideration | Landing page; checks price + proof | proof | portfolio | flexibility | system | free |
| Signup | Google/email + placement quiz | - | skip-ahead pride | resume mapping | straight in | minimal |
| First session | Module 0 + first XP | 25-min break | 1 hour burst | 3x15 min | 2 hours | 15 min |
| Habit | Streaks/reminders | break-time nudges | weekly goals | gentle return | SOP routine | friend challenges |
| Practice | Trainer/Builder/Report | phone | laptop | phone | laptop | phone |
| Coaching | Teacher feedback + cohort | async messages | portfolio review | encouragement | advanced track | group energy |
| Certification | Capstone + certificate | screenshot to FB | resume artifact | confidence | client-ready | flex to friends |
| Hired | Job kit + alumni community | yes primary | yes primary | part-time fit | sells services | first gig |

## Story-Driven Success Metrics

| Persona promise | Metric | Target |
|---|---|---|
| Jessa: progress in 30-min breaks | median session 10-35 min with lesson completed | >= 60% of sessions |
| Mark: artifacts over emptiness | capstone artifacts downloaded/shared | >= 70% of certified students |
| Angel: no shame returns | 30-day-returners continuing rate | >= 65% |
| Raffy: professional depth | Pro/advanced tier conversion | >= 8% of certified |
| Kyla: light and free | LCP on budget Android/3G | <= 2.5s; free->paid >= 4% |