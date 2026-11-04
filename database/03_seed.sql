insert into public.instruments (slug, name, icon) values
  ('guitar', 'Guitar', '/icons/guitar.svg'),
  ('piano',  'Piano',  '/icons/piano.svg'),
  ('drums',  'Drums',  '/icons/drums.svg');

insert into public.roadmaps (instrument_id, title, description, level)
select id, 'Guitar for absolute beginners',
       'From holding the guitar to your first song.', 'beginner'
from public.instruments where slug = 'guitar';

insert into public.roadmap_steps (roadmap_id, position, title, description)
select r.id, s.position, s.title, s.description
from public.roadmaps r
cross join (values
  (1, 'Parts of the guitar and tuning', 'Name the parts and tune all 6 strings.'),
  (2, 'Your first chords: E minor and G', 'Finger placement and clean strumming.'),
  (3, 'Switching chords in time', 'Change between chords with a metronome.')
) as s(position, title, description)
where r.title = 'Guitar for absolute beginners';

insert into public.resources (step_id, title, url, kind)
select st.id, x.title, x.url, x.kind
from public.roadmap_steps st
join (values
  (1, 'How to tune a guitar (video)', 'https://example.com/tune', 'video'),
  (2, 'E minor and G chord charts',   'https://example.com/chords', 'tabs'),
  (3, 'Why practice with a metronome', 'https://example.com/metronome', 'article')
) as x(position, title, url, kind) on x.position = st.position;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();