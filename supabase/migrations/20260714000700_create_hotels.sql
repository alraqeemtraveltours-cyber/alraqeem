-- Dedicated hotels directory, managed from /admin/hotels.
-- The calculator keeps only price entries; hotel identity lives here.
create table if not exists public.hotels (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  location    text not null check (location in ('Makkah','Madina')),
  distance_from_haram integer check (distance_from_haram >= 0),
  haram_access text check (haram_access in ('walk','shuttle','both')),
  star_rating smallint check (star_rating between 1 and 5),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create unique index if not exists hotels_name_location_key
  on public.hotels (lower(name), location);

alter table public.hotels enable row level security;

drop policy if exists "Public can read hotels" on public.hotels;
create policy "Public can read hotels"
  on public.hotels
  for select
  using (true);

-- Seed from the Safr-e-Ibadat season 1448H sheet; distances are the sheet
-- value plus 100 m (upper bound where the sheet gave a range). Hotels not on
-- the sheet keep null distance/stars until real values are known.
insert into public.hotels (name, location, distance_from_haram, haram_access, star_rating, sort_order) values
  ('Ajwa Ziyafa',                                'Makkah', 3000, 'shuttle', 2,    1),
  ('Akabar Misial / Emar Khair Zehbi / Similar', 'Makkah', null, null,      null, 2),
  ('Badar Al Masa',                              'Makkah', 700,  null,      null, 3),
  ('Dyar Matar',                                 'Makkah', 1300, null,      null, 4),
  ('Jada Khalil',                                'Makkah', 1300, null,      null, 5),
  ('Jafria (Masar Al Aez 2)',                    'Makkah', 700,  null,      null, 6),
  ('Jawarat Bait (Arafat Zehbi)',                'Makkah', 700,  null,      null, 7),
  ('Lolo Touheed',                               'Makkah', 1000, null,      null, 8),
  ('Multaqa Al Ibadat & Tara Jawarat',           'Makkah', 900,  null,      null, 9),
  ('Qila Ajyad',                                 'Makkah', 1100, 'shuttle', 2,    10),
  ('Swiss Khalil / Blora Moazan',                'Makkah', 500,  null,      null, 11),
  ('Abdullah Fouzan (Dyar Hijaz)',               'Madina', 700,  null,      null, 12),
  ('Ansar Plus / Similar',                       'Madina', null, null,      null, 13),
  ('Ansar Plus',                                 'Madina', 600,  null,      null, 14),
  ('Dar Ajyal 1',                                'Madina', 850,  null,      null, 15),
  ('Kinan Madina',                               'Madina', 1000, null,      null, 16),
  ('Markazia / Similar',                         'Madina', 350,  null,      null, 17),
  ('Nozol Karam Golden',                         'Madina', 650,  null,      null, 18),
  ('Rou Taiba',                                  'Madina', 200,  null,      null, 19),
  ('Widyar Al Medina / Rou Khair',               'Madina', 450,  null,      null, 20)
on conflict ((lower(name)), location) do nothing;

-- Remove the placeholder hotel rows that were seeded into the calculator;
-- real price rows (published or priced) are untouched.
delete from public.calculator_items
  where category = 'hotel' and price = 0 and active = false;

-- Ajwa Ziyafa is 2-star on the current supplier sheet.
update public.calculator_items
  set star_rating = 2
  where category = 'hotel' and name ilike 'Ajwa Ziyafa';
