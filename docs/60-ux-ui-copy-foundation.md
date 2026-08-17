---
title: Amazon PPC for Virtual Assistants - UX/UI Copy Foundation
file: 60-ux-ui-copy-foundation.md
version: 1.0
reviewed: 2026-08-17
owner: Product + Design Lead
status: active
source: User-provided UX/UI foundation
---

# Amazon PPC for Virtual Assistants - UX/UI Copy Foundation

This document defines the first-pass UX structure and product copy foundation for the app. It treats the product as a beginner-first, safety-focused training experience. The goal is for every screen to feel calm, clear, and actionable.

This is not a rewrite of course content. It establishes MVP scope, information architecture, core student and teacher flows, initial wireframe copy for the Student Dashboard and Lesson Player, accessibility requirements, and the remaining student screen inventory.

## Working assumptions

These assumptions keep the MVP focused and safe:

1. **No live Amazon account connection in the MVP.** All practice uses sample data.
2. **Students cannot make real campaign changes.** The product teaches safe decision-making and requires teacher approval for live-account concepts.
3. **Teacher grading is human-reviewed in the MVP.** The product supports feedback, approval, and revision requests.
4. **The AI Coach is educational, not operational.** It explains concepts and links to lessons; it does not approve live-account changes.
5. **Certification begins as progress tracking.** Full certificate verification, badges, and public credentials can come later.

If any assumption changes, the scope should be revisited before detailed wireframes or implementation.

## 1. Recommended MVP scope

### MVP goal

The MVP should prove that:

1. A beginner can learn Amazon PPC fundamentals without feeling overwhelmed.
2. A student can practice safely with sample data before touching live accounts.
3. A teacher can review student work and give clear feedback.

The MVP should not become a full Amazon Ads management tool.

### MVP scope table

| Area | Include in MVP | Reason | Defer to later |
|---|---|---|---|
| Student onboarding | Sign up, welcome, skill check, learning path, first lesson | Sets beginner expectations | Personalized adaptive paths |
| Student dashboard | Next step, progress, feedback alerts, practice shortcuts, AI Coach access | Gives a calm starting point | Advanced analytics |
| Lesson Player | Video/text toggle, lesson goal, key terms, check questions, next step | Core learning experience | Interactive branching lessons |
| Course progress | Module progress, lesson states, level indicator | Helps students see movement | Skill heatmaps |
| Worksheets | Draft, submit, teacher feedback, revision | Needed for teacher review | Peer review, auto-grading |
| Search Term Trainer | Practice table, winner/waster labels, negative keywords, move to exact | Core PPC judgment skill | Live report import |
| Campaign Sandbox | Campaign plan, budget, targeting, keywords, negatives, bids, naming help | Safe campaign planning | Live campaign builder sync |
| Simulator | One guided decision case with safe/risky feedback | Teaches judgment safely | Multi-step dynamic simulator |
| Glossary | Simple definitions, examples, lesson links | Supports plain-language learning | Community glossary contributions |
| AI Coach | Lesson-linked Q&A, safety warnings, related lesson links | Supports beginners | Live-account recommendations |
| Report Builder | Simple practice report with wins, problems, next steps | Builds reporting confidence | Client delivery workflow |
| Teacher dashboard | Student list, grading queue, needs attention, basic progress | Required for review | Advanced cohort analytics |
| Teacher grading | Submission review, comments, approve/request changes | Core feedback loop | Rubric builder, audio feedback |
| Cohort management | Basic cohort creation and lesson assignment | Useful for agencies/classes | Advanced scheduling |
| Admin | Users, roles, content publishing, basic support, audit log | Needed to operate | Billing automation, integrations |
| Certification | Level ladder and completion states | Motivation and clarity | Verified certificates |

### MVP non-goals

The MVP should avoid:

- Live Amazon Ads API integration.
- Automatic campaign optimization.
- Student access to real client accounts.
- Client-facing reporting portals.
- Complex gamification.
- Public leaderboards.
- “Advanced” tactics or shortcut messaging.
- Anything that encourages fast changes without review.

### MVP design rules

| Rule | UX translation |
|---|---|
| Start with zero knowledge | Use plain labels and short explanations. |
| Avoid jargon | Add glossary tooltips for PPC terms. |
| Break tasks into tiny steps | Use step-by-step flows and checklists. |
| Practice safely | Label all practice data clearly. |
| Teach judgment | Explain why an action is safe or risky. |
| Warn when data is too small | Show “Needs more data” states. |
| Prevent risky actions | Block or warn before major changes. |
| Require approval | Use teacher review for important work. |
| Encourage documentation | Provide templates and reflection prompts. |

## 2. Information architecture

### Global roles

| Role | Primary access |
|---|---|
| Student | Lessons, practice tools, worksheets, AI Coach, glossary, progress, messages |
| Teacher / Coach | Student progress, grading, assignments, cohorts, messages, content review |
| Admin | Users, content, billing, support, audit logs, integrations |
| Client | Future only. No MVP access unless explicitly needed. |

### Student area sitemap

| Section | Screen | Purpose |
|---|---|---|
| Authentication | Sign Up | Create account or accept invite |
| Authentication | Log In | Access the app |
| Authentication | Forgot Password | Recover access |
| Onboarding | Welcome | Explain the course and safety model |
| Onboarding | Skill Assessment | Understand starting level |
| Onboarding | Safety Orientation | Teach practice-first rules |
| Onboarding | Learning Path | Show recommended starting point |
| Dashboard | Student Dashboard | Show next step, progress, feedback, and practice |
| Learning | My Lessons | List modules and lessons |
| Learning | Course Progress | Show completed and upcoming work |
| Learning | Lesson Player | Teach one lesson in small steps |
| Worksheets | Worksheet List | View assigned and completed worksheets |
| Worksheets | Worksheet Detail | Fill, save, submit, and revise |
| Worksheets | Worksheet Feedback | Read teacher comments and next steps |
| Practice | Practice Home | Access safe practice tools |
| Practice | Search Term Trainer | Practice identifying winners and wasted spend |
| Practice | Campaign Builder Sandbox | Plan a campaign without live risk |
| Practice | Practice Simulator | Make one decision and receive feedback |
| Reporting | Report Builder | Build a simple practice report |
| Reporting | Report Preview | See a client-friendly version |
| Support | Glossary | Browse plain-English PPC terms |
| Support | AI Coach | Ask beginner questions safely |
| Support | Messages | Receive teacher and system messages |
| Support | Notifications | See alerts and updates |
| Progress | Levels / Certificates | View level ladder and completion |
| Settings | Student Settings | Manage profile and preferences |
| Help | Help Center | Access support and FAQs |

#### Student route structure

```text
/student
  /dashboard
  /lessons
  /course-progress
  /lesson/[lesson-id]
  /worksheets
  /worksheet/[worksheet-id]
  /worksheet/[worksheet-id]/feedback
  /practice
  /practice/search-term-trainer
  /practice/search-term-trainer/[case-id]
  /practice/campaign-sandbox
  /practice/campaign-sandbox/[plan-id]
  /practice/simulator
  /practice/simulator/[case-id]
  /report-builder
  /report-builder/[report-id]
  /glossary
  /ai-coach
  /levels
  /messages
  /notifications
  /settings
  /help
```

### Teacher area sitemap

| Section | Screen | Purpose |
|---|---|---|
| Dashboard | Teacher Dashboard | See grading, student risk, and progress |
| Students | Student List | View all assigned students |
| Students | Student Detail | Review one student’s progress and work |
| Students | Student Progress | See lesson, worksheet, and practice results |
| Grading | Grading Queue | Review submissions awaiting feedback |
| Grading | Worksheet Review | Grade worksheet responses |
| Grading | Simulator Review | Review simulator decisions |
| Grading | Sandbox Review | Review campaign plans |
| Assignments | Assignment Builder | Assign lessons, worksheets, or practice |
| Assignments | Assignment Review | Track assigned work |
| Cohorts | Cohort List | Manage groups of students |
| Cohorts | Cohort Detail | Add students and assign work |
| Reports | Progress Reports | View completion and weak areas |
| Content | Lesson Management | Preview or assign lesson content |
| Content | Practice Case Management | Manage practice cases |
| Communication | Messages | Message students |
| Settings | Teacher Settings | Manage preferences |

#### Teacher route structure

```text
/teacher
  /dashboard
  /students
  /student/[student-id]
  /student/[student-id]/progress
  /student/[student-id]/submissions
  /student/[student-id]/messages
  /grading
  /grading/[submission-id]
  /assignments
  /assignments/create
  /assignments/[assignment-id]
  /cohorts
  /cohort/[cohort-id]
  /reports
  /content
  /content/lessons
  /content/practice-cases
  /messages
  /settings
```

### Admin area sitemap

| Section | Screen | Purpose |
|---|---|---|
| Dashboard | Admin Dashboard | High-level usage and support overview |
| Users | User Management | Create, edit, suspend, or assign users |
| Users | Role Management | Assign student, teacher, admin permissions |
| Courses | Course Management | Manage course structure and availability |
| Content | Lesson Content | Edit lesson copy, media, and publish states |
| Content | Glossary Management | Add or edit terms |
| Content | Practice Data | Manage sample cases |
| Billing | Subscription Management | Manage plans and access |
| Support | Support Tickets | Handle user issues |
| Audit | Audit Logs | Track important changes |
| Integrations | Integrations | Manage future tools |
| Settings | Admin Settings | Configure organization-level settings |

#### Admin route structure

```text
/admin
  /dashboard
  /users
  /user/[user-id]
  /roles
  /courses
  /course/[course-id]
  /content/lessons
  /content/glossary
  /content/practice-data
  /billing
  /support
  /audit-logs
  /integrations
  /settings
```

## 3. Core user flows

### Student flow 1: New student onboarding

**Goal:** Help a new student feel safe, understand the course, and start the first lesson quickly.

1. The student receives an invite or signs up.
2. The student creates a password and confirms the account.
3. The student lands on the Welcome screen.
4. The Welcome screen explains:
   - The course starts from zero.
   - All practice uses sample data.
   - No live account changes are required.
5. The student completes a beginner skill assessment. It is not pass/fail; it helps choose a starting point.
6. The student sees the Safety Orientation: practice first, ask before live changes, and do not judge performance from small data.
7. The student sees the Learning Path with Level 0 recommended and the first lesson unlocked.
8. The student clicks **Start your first lesson** and enters the Lesson Player.

| State | UI response |
|---|---|
| First visit | Show onboarding checklist. |
| Skill assessment incomplete | Save progress and remind the student. |
| No lessons assigned | Show “Your teacher will assign your first lesson soon.” |
| Onboarding complete | Show the Student Dashboard with the next step. |

### Student flow 2: Lesson completion

**Goal:** Help a student complete one lesson in small, clear steps.

1. Open a lesson from the Dashboard or My Lessons.
2. Show the lesson title, estimated time, lesson goal, and step progress.
3. Let the student choose Watch or Read.
4. Guide the student through the goal, simple explanation, example, key terms, check questions, deliverable, and next step.
5. Let the student review key terms with tooltips.
6. If answers are incorrect, show a calm correction and allow review and retry.
7. If answers are correct, show success feedback.
8. Complete the deliverable when one is required.
9. Mark the lesson complete or continue automatically.
10. Update the Dashboard with the next recommended step.

| State | Meaning | UI label |
|---|---|---|
| Not started | Available but not opened | “Not started” |
| In progress | Opened but not finished | “In progress” |
| Check pending | Check questions not passed | “Complete the check” |
| Complete | All required steps finished | “Complete” |
| Locked | Previous lesson not complete | “Locked” |

### Student flow 3: Worksheet / artifact

**Goal:** Let a student complete a structured deliverable and receive teacher feedback.

1. Open a worksheet from a lesson or the Worksheet List.
2. Show its purpose, instructions, estimated time, and safety note.
3. Fill in table fields, reflection questions, and notes.
4. Save a draft.
5. Review validation warnings.
6. Submit for review.
7. The teacher receives the submission and chooses **Approve**, **Request changes**, or **Assign follow-up lesson**.
8. Notify the student.
9. If changes are requested, the student reads comments, revises, and resubmits.
10. If approved, show success and the next step.

| Status | Meaning | Student view |
|---|---|---|
| Draft | Not submitted | “Draft saved” |
| Submitted | Waiting for teacher | “Waiting for review” |
| In Review | Teacher opened submission | “Being reviewed” |
| Changes Requested | Student must revise | “Please revise” |
| Approved | Work accepted | “Approved” |

### Student flow 4: Search Term Practice

**Goal:** Teach students to identify useful search terms and wasted spend using sample data.

1. Open a Search Term Trainer case.
2. Show product details, campaign goal, and the practice-data warning.
3. Review the search-term table.
4. For each term, choose **Winner**, **Waster**, or **Needs more data**.
5. Select **Add negative keyword**, **Move to exact match**, or **Keep learning**.
6. Warn if the data is too small.
7. Submit decisions.
8. Show what was safe, risky, or unsupported by enough data.
9. Allow a retry and show a score summary with a linked lesson if needed.

| Label | Meaning |
|---|---|
| Winner | The term shows useful performance. |
| Waster | The term shows clear wasted spend. |
| Needs more data | The data is too small to judge. |
| Add negative | Prevent the term from spending again. |
| Move to exact | Use the term in a controlled way. |
| Keep learning | Do not change yet. |

### Student flow 5: Campaign Builder Sandbox

**Goal:** Let students plan a campaign safely before touching live settings.

1. Choose a practice objective.
2. Select a campaign type.
3. Set a daily budget.
4. Choose targeting.
5. Add keywords and negative keywords.
6. Set bids.
7. Use the naming-convention helper.
8. Validate missing budget, missing keywords, high bids, missing negatives, and unclear names.
9. Save a draft or submit for grading.
10. Let the teacher review and provide feedback.

| Status | Meaning |
|---|---|
| Draft | Plan saved but not submitted. |
| Ready for review | Student submitted the plan. |
| Changes requested | Teacher asked for revision. |
| Approved | Teacher approved the plan. |

### Student flow 6: Simulator decision

**Goal:** Teach judgment through one safe decision at a time.

1. Open a simulator case and read the overview.
2. Review product details, campaign metrics, search-term data, and confidence level.
3. Choose one action.
4. Check the action against safety rules.
5. Show whether the action is **Safe**, **Risky**, **Needs approval**, or **Needs more data**.
6. If risky, explain why and allow a retry.
7. If safe, show confirmation and the reason.
8. Record a score or progress marker.

| Feedback type | Meaning | Example copy |
|---|---|---|
| Safe | Follows beginner safety rules | “This is a safe next step.” |
| Risky | May waste spend or change too much | “This change is risky. Review the data first.” |
| Needs approval | Should not happen without teacher/client approval | “Ask for approval before making this change.” |
| Needs more data | Not enough evidence yet | “There is not enough data to judge this yet.” |

### Student flow 7: AI Coach

**Goal:** Give beginners a safe place to ask plain-language questions.

1. Open the AI Coach and show starter prompts.
2. Answer in plain English.
3. If the question involves a risky action, show a safety warning and recommend teacher approval.
4. Link to relevant lessons and glossary terms.
5. If uncertain, say so and suggest asking the teacher.
6. Let the student send a question to the teacher when needed.

The AI Coach should explain concepts simply, avoid live-account decisions, warn when data is too small, recommend approval for major changes, link to lessons and glossary terms, and never promise outcomes.

### Student flow 8: Report Builder

**Goal:** Help students create a simple, client-friendly report using practice data.

1. Choose a practice report case.
2. Enter or review metrics.
3. Add wins, problems, and next steps.
4. Preview the client-friendly version.
5. Submit for teacher review or export.
6. Let the teacher give feedback on clarity and safety.

| Section | Purpose |
|---|---|
| Summary | Explain what happened in simple language. |
| Wins | Show what worked. |
| Problems | Show what needs attention. |
| Next Steps | Recommend safe actions. |
| Approval Note | Remind the student to seek approval before live changes. |

### Teacher flow 1: Teacher Dashboard triage

**Goal:** Help a teacher quickly see who needs help and what needs grading.

The Dashboard shows the grading queue count, students needing help, recent submissions, weak skill areas, and cohort progress. Teachers can filter by cohort or status, open a student or submission, and grade work, send a message, or assign a lesson or practice case.

| Module | Purpose |
|---|---|
| Needs Attention | Students who are stuck, inactive, or struggling. |
| Grading Queue | Submissions waiting for review. |
| Student Progress | Completion by student or cohort. |
| Skill Weaknesses | Areas with repeated mistakes. |
| Messages | Teacher-student communication. |

### Teacher flow 2: Grading

1. Open the Grading Queue.
2. Filter by worksheet, Search Term Trainer, Campaign Sandbox, Simulator, or Report Builder.
3. Open a submission.
4. Review the student, assignment type, date, rubric/checklist, work, and previous feedback.
5. Add comments.
6. Choose **Approve**, **Request changes**, or **Assign follow-up lesson**.
7. Send feedback and notify the student.

| Outcome | Meaning | Student next step |
|---|---|---|
| Approve | Work meets expectations. | Continue to the next lesson. |
| Request changes | Work needs revision. | Revise and resubmit. |
| Assign follow-up | Student needs more learning. | Review the assigned lesson or practice. |

### Teacher flow 3: Student intervention

1. Open a student flagged as needing help.
2. Review lesson progress, check-question results, worksheet feedback, practice mistakes, and last activity date.
3. Identify the weak skill.
4. Send a message, assign a review lesson, assign an extra practice case, or schedule a call/note.
5. Confirm the action and notify the student.

### Teacher flow 4: Cohort management

1. Create a cohort and add students.
2. Assign a learning path, due dates, or specific lessons/practice cases.
3. Monitor completion.
4. Review cohort performance.
5. Adjust assignments when needed.

## 4. First screen wireframe copy

These are the two first-priority screens: the Student Dashboard and Lesson Player. The copy uses a calm, beginner-first voice.

### Screen 1: Student Dashboard

#### Purpose

The Dashboard should answer three questions immediately:

1. What should I do next?
2. Am I making progress?
3. Does anything need my attention?

It should not overwhelm the student with every feature at once.

#### Layout recommendation

Global navigation:

- Dashboard
- My Lessons
- Practice
- Worksheets
- Glossary
- AI Coach
- Levels
- Messages
- Settings

Top bar:

- Course name: Amazon PPC for Virtual Assistants
- Help
- Notifications
- Profile

#### Next Step Card

Returning student state:

```text
H1: Welcome back, [First name]

Subhead: Pick up where you left off. Your progress is saved automatically.

Card label: Your next step

Lesson title: [Lesson title]

Helper text: About [X] minutes. You can stop and come back anytime.

Primary button: Continue lesson

Secondary button: View My Lessons
```

First-time student state:

```text
H1: Welcome to Amazon PPC for Virtual Assistants

Subhead: You will start from zero. You will learn in small, safe steps.

Checklist heading: Start here

Step 1: Learn the safety rules
Button: Review safety

Step 2: Take the beginner skill check
Button: Start skill check

Step 3: Begin Lesson 1
Button: Start Lesson 1
```

Worksheet next step:

```text
Card label: Your next step

Worksheet title: [Worksheet title]

Helper text: This worksheet helps you practice what you just learned.

Primary button: Open worksheet
```

Teacher-feedback next step:

```text
Card label: Your next step

Feedback title: Review your teacher’s feedback

Helper text: Your teacher left notes on [Worksheet name].

Primary button: Review feedback
```

#### Progress Card

```text
Card heading: Your progress

Course progress label: Course progress
Progress value: [percent]%

Helper text: Small steps count. You move forward by completing one task at a time.

Rows:
Lessons completed: [n] of [total]
Practice cases completed: [n]
Worksheets approved: [n]
Current level: Level [n] — [Level name]

Link: See level ladder
```

#### Needs Your Attention

With items:

```text
Card heading: Needs your attention

Item 1:
Your teacher left feedback on [Worksheet name].
Button: Review feedback

Item 2:
Your submission was returned. Please revise and resubmit.
Button: Revise

Item 3:
You have a new message from [Teacher name].
Button: Open message
```

Empty state:

```text
Card heading: Needs your attention

Empty text: You are all caught up.

Helper text: We will show feedback and reminders here.
```

#### Practice Safely

```text
Card heading: Practice safely

Subhead: All practice uses sample data. No live campaigns are changed.
```

Practice cards:

```text
Title: Search Term Trainer

Description: Learn to spot useful search terms and wasted spend.

Button: Practice search terms
```

```text
Title: Campaign Builder Sandbox

Description: Plan a campaign before touching live settings.

Button: Build a practice campaign
```

```text
Title: Decision Simulator

Description: Practice one decision at a time.

Button: Try a decision case
```

#### AI Coach Card

```text
Card heading: Ask the AI Coach

Subhead: Get plain-English answers. The AI Coach teaches and does not approve live changes.

Starter prompts:
What is a search term?
When is data too small?
What is a negative keyword?

Primary button: Ask a question

Safety note: If you are working on a live account, ask your teacher before making changes.
```

#### Messages Card

With messages:

```text
Card heading: Messages

Message preview: [Teacher name] sent you a message.
Time: [Time]

Button: Open messages
```

Empty state:

```text
Card heading: Messages

Empty text: No new messages.
```

#### Safety reminder banner

```text
Banner label: Safety reminder

Message: Make one small change at a time.
```

Alternative messages:

```text
Do not judge performance from one day of data.
```

```text
Ask for approval before increasing a budget.
```

```text
Practice first. Do not change live campaigns until you are approved.
```

#### Dashboard states and toasts

```text
Loading your progress...
```

```text
We could not load your dashboard.

Your saved work is safe. Please try again.

Button: Try again
```

```text
We are still having trouble loading this page.

Please contact support if this continues.

Button: Get help
```

```text
No lessons are assigned yet.

Your teacher will assign your first lesson soon.
```

Success toasts:

```text
Progress saved.
Lesson marked complete.
Practice draft saved.
Submitted for review.
```

#### Dashboard component notes

| Component | Purpose | Key states |
|---|---|---|
| Next Step Card | Guide the student to one action | Lesson, worksheet, feedback, empty |
| Progress Card | Show movement | Loading, complete, partial |
| Attention List | Show feedback and messages | Empty, active, error |
| Practice Cards | Introduce safe practice | Locked, available, completed |
| AI Coach Card | Provide help | Loading, ready, safety warning |
| Toast | Confirm saved actions | Success, warning, error |

### Screen 2: Lesson Player

#### Purpose

The Lesson Player makes one lesson feel manageable. It guides the student through:

1. Goal
2. Learning content
3. Example
4. Key terms
5. Check questions
6. Deliverable
7. Next step

The student should always know where they are and what comes next.

#### Layout recommendation

Top area:

- Breadcrumb
- Lesson title
- Estimated time
- Lesson status
- Progress indicator
- Save and exit button

Main content area:

- Lesson goal
- Watch / Read toggle
- Lesson explanation
- Example
- Key terms
- Check questions
- Deliverable
- Next step

Right or collapsible panel:

- Lesson checklist
- Glossary shortcuts
- AI Coach help
- Related worksheet

#### Header and progress copy

```text
Breadcrumb: Course > Module [number] > Lesson [number]

H1: [Lesson title]

Meta: About [X] minutes

Status badge:
Not started
In progress
Complete

Save indicator: Your progress saves automatically.

Button: Save and exit
```

```text
Lesson steps: [n] of [total] complete

Goal
Learn
Example
Key terms
Check
Next step
```

#### Lesson goal

```text
Card heading: Lesson goal

Body: By the end of this lesson, you will be able to [simple outcome].

Helper text: You only need to understand the basics right now.
```

#### Learn

```text
Label: Choose how you learn

Options:
Watch
Read

Helper text: You can switch anytime.
```

Video controls:

```text
Video label: Lesson video

Controls:
Play
Pause
Captions
Playback speed
Show transcript
```

Video error:

```text
The video did not load.

You can read the lesson instead.

Button: Read lesson
```

Read state:

```text
Section heading: What this means

Body: [Plain-English lesson copy]

Helper text: Take your time. You can reread this section.
```

#### Example

```text
Section heading: Simple example

Body: Here is a simple example.

Practice note: This example uses practice data. No live account is affected.
```

#### Key terms

```text
Section heading: Key terms

Helper text: Click a term to see a plain-English definition.
```

Search term:

```text
Term: Search term

Definition: A search term is what a shopper types into Amazon.

Example: “blue water bottle” can be a search term.

Link: Related lesson: [Lesson title]

Button: Close
```

Click:

```text
Term: Click

Definition: A click means a shopper selected your ad.

Example: If your ad receives 10 clicks, 10 shoppers clicked it.
```

Spend:

```text
Term: Spend

Definition: Spend is the amount of money used by an ad.

Example: If a campaign spends $5, it used $5 of the ad budget.
```

Negative keyword:

```text
Term: Negative keyword

Definition: A negative keyword tells Amazon not to show an ad for that search.

Example: If “free” is a negative keyword, the ad should not show for “free water bottle.”
```

#### Check questions

```text
Section heading: Check your understanding

Helper text: Answer each question. You can try again if you miss one.

Question: [Question text]

Answers:
Answer A
Answer B
Answer C

Primary button: Check answers
```

Success:

```text
Nice work. You answered all questions.

Button: Continue
```

Incorrect:

```text
Some answers need another look.

Review the lesson and try again.

Button: Try again
```

Individual incorrect answer:

```text
Not quite. Review [topic] and try again.
```

Hint and retry guardrail:

```text
Link: Show hint

Hint text: Hint: [simple hint]
```

```text
Let’s review the example again.

Button: Review example
```

#### Deliverable

Worksheet required:

```text
Section heading: Show what you learned

Body: Complete the short worksheet. It helps you practice safely.

Primary button: Open worksheet

Secondary button: Save and return later
```

No worksheet:

```text
No worksheet for this lesson.

You can continue to the next step.
```

#### Next step and completion

```text
Section heading: Next step

Body: You are ready for [next lesson title].

Primary button: Continue to next lesson

Secondary button: Back to My Lessons
```

Locked next step:

```text
Complete the check questions to continue.
```

Completion modal:

```text
Modal heading: Lesson complete

Body: You finished [Lesson title]. Nice work.

Next step: [Next lesson or worksheet]

Primary button: Continue

Secondary button: Back to dashboard
```

#### Lesson Player states

```text
Status: Not started

Primary button: Start lesson
```

```text
Status: In progress

Helper text: You are on step [n] of [total].
```

```text
Status: Complete

Helper text: You finished this lesson.
```

```text
Status: Locked

Message: Finish [previous lesson title] before opening this lesson.

Button: Go to previous lesson
```

```text
We could not load this lesson.

Your progress is safe. Please try again.

Button: Try again
```

```text
We could not save your answers.

Please try again.

Button: Try again
```

```text
Progress saved.
```

Exit confirmation:

```text
Modal heading: Save and exit?

Body: Your progress is saved. You can return anytime.

Primary button: Save and exit

Secondary button: Stay in lesson
```

#### Lesson Player component notes

| Component | Purpose | Key states |
|---|---|---|
| Lesson header | Identify lesson and status | Locked, in progress, complete |
| Step progress | Show position in lesson | Loading, active, complete |
| Watch/Read toggle | Support learning preference | Video, read, error |
| Glossary tooltip | Explain terms | Closed, open, expanded |
| Check question | Confirm understanding | Empty, incorrect, correct |
| Feedback banner | Guide retry behavior | Success, warning, error |
| Completion modal | Confirm next step | Success, next action |
| Autosave indicator | Reduce anxiety | Saving, saved, error |

## 5. Accessibility requirements

Apply these requirements from the beginning:

| Area | Requirement |
|---|---|
| Contrast | Text must meet WCAG AA contrast. |
| Tables | Practice tables need clear headers and row labels. |
| Keyboard access | All buttons, tooltips, and forms must be keyboard accessible. |
| Tooltips | Tooltips must not hide critical safety information. |
| Video | Captions and a transcript are required. |
| Forms | Labels must remain visible, not placeholder-only. |
| Errors | Errors must use text, not color alone. |
| Buttons | Buttons must use clear verbs. |
| Focus states | Visible focus rings are required for all interactive elements. |
| Plain language | Use short sentences and common words. |

## 6. Student screen inventory and UX specification

This section defines the remaining core Student features. Each screen should remain calm, structured, and focused on safety and small steps.

### 6.1 Worksheet / Artifact Builder

**Purpose:** A structured workspace where students complete assignments, reflect on what they learned, and submit work for teacher review.

**Layout:** Top bar with title, estimated time, and status; left instructions column; right editable workspace; sticky action bar.

```text
H1: [Worksheet Title]
Status: Draft
Time: About 15 minutes

H2: The Goal
Body: [1-2 sentences explaining why this worksheet matters.]

H3: Instructions
1. Read the practice data carefully.
2. Fill in the table below.
3. Answer the reflection question.

Safety reminder: This uses practice data. No live accounts will be changed.

H2: Your Work
Table Header: Fill in the missing details.
[Editable Table Component]

H3: Reflection
Label: Why did you make these choices?
Helper text: Write 2 or 3 simple sentences.
[Text Area]

Secondary Button: Save Draft
Primary Button: Submit for Review
```

| State | UI response |
|---|---|
| Draft saved | Toast: “Draft saved. You can come back later.” |
| Missing fields | Inline error: “Please fill in all required rows before submitting.” |
| Submitted | Lock editing. Banner: “Waiting for your teacher to review this.” |
| Changes requested | Banner: “Your teacher left feedback. Please review and update your answers.” |
| Approved | Banner: “Approved. Nice work.” Button: “Go to next lesson.” |

Component requirements: an accessible editable data table with add/remove rows and inline validation; an autosave indicator such as “Saved just now”; and a sticky action bar that keeps Save and Submit visible on long worksheets.

### 6.2 Search Term Trainer

**Purpose:** Teach students to read search-term reports and identify useful keywords and wasted spend using safe practice data.

**Layout:** Case overview at the top, data-warning banner, search-term table, row decisions, and a submit bar.

```text
H1: Search Term Practice
Product: [Product Name]
Goal: Find wasted spend and protect the budget.

Banner: Practice Data Warning
Body: This data is for practice only. Do not judge performance from just one day of data.

Table Header: Review these search terms.
Columns:
- Search Term
- Clicks
- Spend
- Sales
- Your Decision (Dropdown/Radio)

Helper text: Choose one action for each row.
```

Decision options:

```text
Winner (Move to exact match)
Wasted Spend (Add as negative)
Needs more data (Keep learning)
```

| State | UI response |
|---|---|
| Small data warning | If a row has fewer than 5 clicks: “Too few clicks to judge safely. Choose ‘Needs more data’.” |
| Submit clicked | Loading state: “Checking your decisions...” |
| Success | “Nice work. You found the wasted spend.” Show score and summary. |
| Risky choice | “Careful. You marked a winner as wasted spend. Review the sales column and try again.” |

Component requirements: data-table tooltips for ACoS and ROAS, soft highlighting for high-spend/no-sales rows, and a sticky decision summary such as “4 of 10 decisions made.”

### 6.3 Campaign Builder Sandbox

**Purpose:** Allow students to plan campaign structure, budgets, and keywords without touching a live Amazon account.

**Layout:** Four-step progress stepper; contextual form; right-side campaign structure and naming preview.

```text
Step 1 of 4: Campaign Plan
H1: Name your campaign
Helper text: Use a clear name so you can find it later.

Card: Naming Helper
Formula: [Product] - [Campaign Type] - [Targeting] - [Date]
Example: WaterBottle - SP - Auto - 2026
Button: Use this name

H2: Set your budget
Label: Daily Budget ($)
Helper text: Start small. You can always ask to increase it later.
Input: [ $ 10.00 ]

H2: Choose targeting
Option A: Automatic (Let Amazon find terms)
Option B: Manual (You choose the terms)
```

| State | UI response |
|---|---|
| Validation error | “Please enter a daily budget before continuing.” |
| High bid warning | “Your bid is very high for a beginner. Are you sure?” |
| Missing negatives | “You haven't added any negative keywords. It is safe to add a few obvious ones.” |
| Submit for grading | “Campaign plan saved. Your teacher will review it.” |

Component requirements: a multi-step wizard; a live Campaign > Ad Group > Keywords structure preview; and real-time checks for missing fields or dangerous values such as a $1,000 daily budget.

### 6.4 Practice Simulator

**Purpose:** Present one scenario and one safe decision at a time, teaching judgment over button-clicking.

**Layout:** Left case panel with product and metrics; right decision panel with three or four radio-card choices; submit action below.

```text
H1: Decision Simulator
Case: High Spend, No Sales
Product: Ergonomic Office Chair

Current Metrics:
- Spend: $45.00
- Clicks: 30
- Sales: $0.00

The Problem: This auto campaign is spending money but getting no sales. What should you do first?

H2: Choose one action

Option A: Turn off the campaign completely.
Option B: Lower the default bid to $0.20.
Option C: Download the search term report to see what people are clicking.
Option D: Increase the budget to get more data.
```

| State | UI response |
|---|---|
| Safe choice, such as C | “Safe choice. Always look at the search terms before turning things off.” |
| Risky choice, such as A | “Risky choice. Turning it off stops the bleeding, but you lose the data. Next time, check the search terms first.” |
| Needs approval, such as D | “Needs approval. Never increase a budget without asking your teacher or client.” |
| Retry | Button: “Try a different decision” or “Next Case”. |

Component requirements: large clickable radio cards, a feedback modal that separates result from lesson, and a confidence meter that shows whether the sample size is large enough to trust.

### 6.5 AI Coach Chat

**Purpose:** Provide safe, educational chat that explains concepts simply, warns about risky live-account actions, and links to lessons. It does not execute commands.

**Layout:** Chat thread, input with starter prompt chips, and a context panel showing the current lesson.

```text
H1: Ask the AI Coach
Body: I can explain Amazon PPC in plain English. I cannot make changes to live accounts.

Starter Prompts:
- What is a negative keyword?
- Why is my ACoS so high?
- How do I read a search term report?
```

Safety warning response:

```text
User: “Should I increase the budget to $100?”
AI Coach: “Safety Warning: Increasing a budget is a major change. I cannot approve this. Please review the ‘Budget Management’ lesson and ask your teacher for approval before changing a live account.”
```

Standard response:

```text
AI Coach: “A search term is the exact phrase a shopper types into Amazon. A keyword is the word you tell Amazon to target. They are different! Read more in Lesson 4.”
Button: Open Lesson 4
```

| State | UI response |
|---|---|
| Typing | “AI Coach is thinking...” |
| Live-account question | Trigger the safety disclaimer and suggest messaging the teacher. |
| Escalation | Button: “Send this question to my teacher.” |

Component requirements: distinct user and AI chat bubbles, rich lesson-link cards, and a context toggle such as “Base your answer on Lesson 3.”

### 6.6 Report Builder

**Purpose:** Help students translate raw metrics into a simple, client-friendly summary and communicate wins, problems, and safe next steps.

**Layout:** Inputs on the left and a real-time client-report preview on the right.

```text
H1: Build a Practice Report
Helper text: Write simply. Imagine you are explaining this to a client who knows nothing about PPC.

Section: The Numbers
- Total Spend: [ Input ]
- Total Sales: [ Input ]

Section: The Story
- Wins (What worked well?): [ Text Area ]
- Problems (What needs fixing?): [ Text Area ]
- Next Steps (What will we do next?): [ Text Area ]

Card: Client Report Preview
Header: Monthly Performance Summary
Body: [Auto-populates the student's text]

Banner: Safety Reminder
Body: Always get teacher approval before sending reports to real clients.
```

| State | UI response |
|---|---|
| Empty preview | “Fill in the boxes on the left to see your report.” |
| Jargon warning | If the student types ACoS, ROAS, or CPA: “Try to use plain words like ‘Cost per Sale’ instead of ACoS for the client.” |
| Submitted | “Report submitted for teacher review.” |

Component requirements: split-screen input/preview and a jargon highlighter that gently underlines acronyms and suggests plain-English alternatives.

### 6.7 Glossary

**Purpose:** Provide a single source of truth for plain-English definitions.

**Layout:** Prominent search, categories for Basics/Metrics/Campaign Types/Targeting, and a side drawer or modal for term details.

```text
H1: PPC Glossary
Subhead: Plain-English definitions for Amazon PPC.
Search Input: Search for a word...

Term: ACoS (Advertising Cost of Sales)

Simple Definition: The percentage of your sales that was spent on ads. Lower is usually better.

The Math: Ad Spend divided by Ad Sales.

Example: If you spend $10 on ads and make $100 in sales, your ACoS is 10%.

Related Lessons:
- Lesson 5: Reading your first report
- Lesson 12: How to lower ACoS
```

Component requirements: global search accessible by a keyboard shortcut such as Cmd+K/Ctrl+K, and a side drawer that lets the student return immediately to the worksheet.

### 6.8 Levels and Certificates

**Purpose:** Show a competency ladder from Level 0 to Level 5 and emphasize steady progress rather than gamified hype.

**Layout:** Vertical ladder, current-level card, and a checklist of next-level requirements.

```text
H1: Your Progress
Current Level: Level 1 - PPC Observer
Body: You understand the basic terms and can read a simple report.

Level 0: Beginner (Complete)
Level 1: PPC Observer (Current)
Level 2: Safe Assistant (Locked)
  - Requirement: Pass the Search Term Trainer
  - Requirement: Submit 2 approved worksheets
Level 3: Campaign Planner (Locked)
Level 4: Junior PPC Manager (Locked)
Level 5: Certified VA (Locked)

Card: Certificate Preview
Body: When you reach Level 5, you will earn the “Safe Junior PPC Assistant” certificate.
Image: [Greyed out preview of the certificate]
```

| State | UI response |
|---|---|
| Level up | Modal: “You reached Level 2! You are now a Safe Assistant.” |
| Locked | Greyed-out text with a clear checklist of what is missing. |

Component requirements: a vertical progress timeline and an interactive checklist showing exactly which assignments block the next level.

## 7. Global student components

The design system needs these shared components:

1. **Data Tables:** Sorting, inline editing, row highlighting, and mobile-responsive stacking.
2. **Tooltips / Popovers:** Keyboard accessible and never obscuring critical data.
3. **Status Badges:** Standardized states for Draft (grey), Submitted (blue), Approved (green), Changes Requested (orange), and Locked (grey/striped).
4. **Feedback Modals:** Distinct visual styles for Safe/Success (green/check) and Risky/Warning (yellow/alert).
5. **Sticky Action Bars:** Save and Submit remain one click away on long forms and worksheets.
6. **Empty States:** Friendly illustrations and clear next instructions; never a blank screen.

## Suggested next deliverable

The next logical deliverable is a full **Screen Inventory and Component Specification**, including:

1. Every screen and modal for Student, Teacher, and Admin.
2. Component library requirements.
3. Detailed simulator interaction model.
4. Teacher grading layout and comment system.
5. Full accessibility requirements.

The next focused options are:

- **Option A:** Full screen inventory for the Student area first.
- **Option B:** Full simulator UX and decision feedback logic.
- **Option C:** Full teacher grading UX and review layout.
