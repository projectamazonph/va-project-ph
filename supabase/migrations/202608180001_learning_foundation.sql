-- Learning foundation: Supabase Auth-backed profiles, course content, progress, and submissions.
-- Rollback: only for an unshared development project. Production changes are additive-only.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('student', 'teacher', 'admin')),
  display_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position integer not null check (position >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (course_id, position)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  summary text not null default '',
  content jsonb not null default '[]'::jsonb,
  estimated_minutes integer not null default 10 check (estimated_minutes between 1 and 240),
  position integer not null check (position >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (module_id, slug),
  unique (module_id, position)
);

create table if not exists public.teacher_student_links (
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (teacher_id, student_id),
  check (teacher_id <> student_id)
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'paused', 'completed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (student_id, course_id)
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'complete')),
  current_step integer not null default 0 check (current_step >= 0),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (student_id, lesson_id)
);

create table if not exists public.worksheets (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  instructions text not null default '',
  schema jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (lesson_id)
);

create table if not exists public.worksheet_submissions (
  id uuid primary key default gen_random_uuid(),
  worksheet_id uuid not null references public.worksheets(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'changes_requested', 'approved')),
  response jsonb not null default '{}'::jsonb,
  teacher_feedback text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (worksheet_id, student_id)
);

create index if not exists lesson_progress_student_idx on public.lesson_progress (student_id);
create index if not exists submissions_student_idx on public.worksheet_submissions (student_id);
create index if not exists submissions_status_idx on public.worksheet_submissions (status);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists courses_set_updated_at on public.courses;
create trigger courses_set_updated_at
before update on public.courses
for each row execute procedure public.set_updated_at();

drop trigger if exists modules_set_updated_at on public.modules;
create trigger modules_set_updated_at
before update on public.modules
for each row execute procedure public.set_updated_at();

drop trigger if exists lessons_set_updated_at on public.lessons;
create trigger lessons_set_updated_at
before update on public.lessons
for each row execute procedure public.set_updated_at();

drop trigger if exists enrollments_set_updated_at on public.enrollments;
create trigger enrollments_set_updated_at
before update on public.enrollments
for each row execute procedure public.set_updated_at();

drop trigger if exists lesson_progress_set_updated_at on public.lesson_progress;
create trigger lesson_progress_set_updated_at
before update on public.lesson_progress
for each row execute procedure public.set_updated_at();

drop trigger if exists worksheets_set_updated_at on public.worksheets;
create trigger worksheets_set_updated_at
before update on public.worksheets
for each row execute procedure public.set_updated_at();

drop trigger if exists worksheet_submissions_set_updated_at on public.worksheet_submissions;
create trigger worksheet_submissions_set_updated_at
before update on public.worksheet_submissions
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_teacher_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('teacher', 'admin'), false);
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_role() = 'admin';
$$;

alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.teacher_student_links enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.worksheets enable row level security;
alter table public.worksheet_submissions enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
for select to authenticated
using (id = auth.uid() or public.is_teacher_or_admin());

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Role changes are administrative. Students may update their display name only.
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;

drop policy if exists courses_select on public.courses;
create policy courses_select on public.courses
for select to authenticated
using (is_published or public.is_teacher_or_admin());

drop policy if exists modules_select on public.modules;
create policy modules_select on public.modules
for select to authenticated
using (
  public.is_teacher_or_admin()
  or exists (select 1 from public.courses c where c.id = course_id and c.is_published)
);

drop policy if exists lessons_select on public.lessons;
create policy lessons_select on public.lessons
for select to authenticated
using (
  public.is_teacher_or_admin()
  or (is_published and exists (
    select 1
    from public.modules m
    join public.courses c on c.id = m.course_id
    where m.id = module_id and c.is_published
  ))
);

drop policy if exists teacher_student_links_select on public.teacher_student_links;
create policy teacher_student_links_select on public.teacher_student_links
for select to authenticated
using (teacher_id = auth.uid() or student_id = auth.uid() or public.is_admin());

drop policy if exists teacher_student_links_admin_write on public.teacher_student_links;
create policy teacher_student_links_admin_write on public.teacher_student_links
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists enrollments_select on public.enrollments;
create policy enrollments_select on public.enrollments
for select to authenticated
using (
  student_id = auth.uid()
  or public.is_admin()
  or exists (
    select 1 from public.teacher_student_links link
    where link.teacher_id = auth.uid() and link.student_id = enrollments.student_id
  )
);

drop policy if exists enrollments_admin_write on public.enrollments;
create policy enrollments_admin_write on public.enrollments
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists lesson_progress_select on public.lesson_progress;
create policy lesson_progress_select on public.lesson_progress
for select to authenticated
using (
  student_id = auth.uid()
  or public.is_admin()
  or exists (
    select 1 from public.teacher_student_links link
    where link.teacher_id = auth.uid() and link.student_id = lesson_progress.student_id
  )
);

drop policy if exists lesson_progress_write_self on public.lesson_progress;
create policy lesson_progress_write_self on public.lesson_progress
for all to authenticated
using (student_id = auth.uid())
with check (student_id = auth.uid());

drop policy if exists worksheets_select on public.worksheets;
create policy worksheets_select on public.worksheets
for select to authenticated
using (
  public.is_teacher_or_admin()
  or exists (
    select 1
    from public.lessons l
    join public.modules m on m.id = l.module_id
    join public.courses c on c.id = m.course_id
    where l.id = lesson_id and l.is_published and c.is_published
  )
);

drop policy if exists submissions_select on public.worksheet_submissions;
create policy submissions_select on public.worksheet_submissions
for select to authenticated
using (
  student_id = auth.uid()
  or public.is_admin()
  or exists (
    select 1 from public.teacher_student_links link
    where link.teacher_id = auth.uid() and link.student_id = worksheet_submissions.student_id
  )
);

drop policy if exists submissions_review on public.worksheet_submissions;
drop policy if exists submissions_insert_self on public.worksheet_submissions;
create policy submissions_insert_self on public.worksheet_submissions
for insert to authenticated
with check (student_id = auth.uid());

drop policy if exists submissions_update_self on public.worksheet_submissions;
create policy submissions_update_self on public.worksheet_submissions
for update to authenticated
using (student_id = auth.uid() and status in ('draft', 'changes_requested'))
with check (student_id = auth.uid() and status in ('draft', 'submitted', 'changes_requested'));

-- Students can write their response and submission state, but never review fields.
revoke insert, update, delete on public.worksheet_submissions from authenticated;
grant insert (worksheet_id, student_id, status, response, submitted_at, updated_at)
on public.worksheet_submissions to authenticated;
grant update (status, response, submitted_at, updated_at)
on public.worksheet_submissions to authenticated;

-- Review writes are a constrained server-side operation. The function performs
-- its own teacher/student-link check before changing reviewer-owned columns.
create or replace function public.review_worksheet_submission(
  p_submission_id uuid,
  p_status text,
  p_teacher_feedback text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  submission_student_id uuid;
begin
  if not public.is_teacher_or_admin() then
    raise exception 'Only teachers and admins may review submissions';
  end if;

  if p_status not in ('changes_requested', 'approved') then
    raise exception 'Invalid review status';
  end if;

  select student_id into submission_student_id
  from public.worksheet_submissions
  where id = p_submission_id;

  if submission_student_id is null then
    raise exception 'Submission not found';
  end if;

  if not (
    public.is_admin()
    or exists (
      select 1 from public.teacher_student_links link
      where link.teacher_id = auth.uid() and link.student_id = submission_student_id
    )
  ) then
    raise exception 'Teacher is not linked to this student';
  end if;

  update public.worksheet_submissions
  set status = p_status,
      teacher_feedback = p_teacher_feedback,
      reviewed_by = auth.uid(),
      reviewed_at = timezone('utc', now())
  where id = p_submission_id;
end;
$$;

revoke execute on function public.review_worksheet_submission(uuid, text, text) from public;
grant execute on function public.review_worksheet_submission(uuid, text, text) to authenticated;
