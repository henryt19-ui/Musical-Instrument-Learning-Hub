-- 1. One profile per user, linked to Supabase's built-in users table
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

-- 2. Instruments (Guitar, Piano, Drums)
create table public.instruments (
  id bigint generated always as identity primary key,
  slug text not null unique,          -- short name used in URLs, e.g. 'guitar'
  name text not null,
  icon text                           -- e.g. '/icons/guitar.svg'
);

-- 3. Roadmaps: a learning path for one instrument
create table public.roadmaps (
  id bigint generated always as identity primary key,
  instrument_id bigint not null references public.instruments (id) on delete cascade,
  title text not null,
  description text,
  level text not null default 'beginner'
    check (level in ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz not null default now()
);

-- 4. Steps inside a roadmap, in order (1, 2, 3...)
create table public.roadmap_steps (
  id bigint generated always as identity primary key,
  roadmap_id bigint not null references public.roadmaps (id) on delete cascade,
  position int not null,
  title text not null,
  description text,
  unique (roadmap_id, position)       -- no two steps share a number
);

-- 5. Links attached to a step
create table public.resources (
  id bigint generated always as identity primary key,
  step_id bigint not null references public.roadmap_steps (id) on delete cascade,
  title text not null,
  url text not null,
  kind text not null check (kind in ('video', 'article', 'tabs', 'sheet_music', 'practice')),
  description text,
  source text,
  duration_minutes int check (duration_minutes is null or duration_minutes >= 0)
);

-- 6. Which steps each user has finished
create table public.step_progress (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  step_id bigint not null references public.roadmap_steps (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, step_id)      -- a step can only be finished once per user
);

-- 7. Roadmaps a user starred
create table public.favorite_roadmaps (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  roadmap_id bigint not null references public.roadmaps (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, roadmap_id)
);

-- 8. Resources a user liked
create table public.liked_resources (
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  resource_id bigint not null references public.resources (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, resource_id)
);

-- Indexes make lookups by these columns fast
create index on public.roadmaps (instrument_id);
create index on public.resources (step_id);
create index on public.step_progress (step_id);
create index on public.favorite_roadmaps (roadmap_id);
create index on public.liked_resources (resource_id);