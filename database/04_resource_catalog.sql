-- Extend resources for the Resources page. Safe to run against existing databases.
alter table public.resources
  add column if not exists description text,
  add column if not exists source text,
  add column if not exists duration_minutes int;

alter table public.resources
  drop constraint if exists resources_kind_check;

alter table public.resources
  add constraint resources_kind_check
  check (kind in ('video', 'article', 'tabs', 'sheet_music', 'practice'));

alter table public.resources
  drop constraint if exists resources_duration_minutes_check;

alter table public.resources
  add constraint resources_duration_minutes_check
  check (duration_minutes is null or duration_minutes >= 0);
