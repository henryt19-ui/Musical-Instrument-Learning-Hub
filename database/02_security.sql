-- Turn RLS on for every table (deny everything by default)
alter table public.profiles          enable row level security;
alter table public.instruments       enable row level security;
alter table public.roadmaps          enable row level security;
alter table public.roadmap_steps     enable row level security;
alter table public.resources         enable row level security;
alter table public.step_progress     enable row level security;
alter table public.favorite_roadmaps enable row level security;
alter table public.liked_resources   enable row level security;

-- Catalog: everyone can read, nobody can write from the app
create policy "Catalog is public" on public.instruments
  for select to anon, authenticated using (true);
create policy "Catalog is public" on public.roadmaps
  for select to anon, authenticated using (true);
create policy "Catalog is public" on public.roadmap_steps
  for select to anon, authenticated using (true);
create policy "Catalog is public" on public.resources
  for select to anon, authenticated using (true);

-- Profiles: only your own
create policy "Read own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Update own profile" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Progress: only your own
create policy "Read own progress" on public.step_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Add own progress" on public.step_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Remove own progress" on public.step_progress
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Favorites: only your own
create policy "Read own favorites" on public.favorite_roadmaps
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Add own favorites" on public.favorite_roadmaps
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Remove own favorites" on public.favorite_roadmaps
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Likes: only your own
create policy "Read own likes" on public.liked_resources
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Add own likes" on public.liked_resources
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Remove own likes" on public.liked_resources
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Table permissions. Grants say which doors exist; policies say who gets through.
grant select on public.instruments, public.roadmaps, public.roadmap_steps, public.resources
  to anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, delete
  on public.step_progress, public.favorite_roadmaps, public.liked_resources
  to authenticated;
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();