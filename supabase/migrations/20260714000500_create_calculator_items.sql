create table if not exists public.calculator_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null check (category in ('hotel','flight','visa','transport','ziyarat','other')),
  room_type   text check (room_type in ('sharing','quad','triple','double')),
  location    text,
  distance_from_haram integer check (distance_from_haram >= 0),
  haram_access text check (haram_access in ('walk','shuttle','both')),
  star_rating smallint check (star_rating between 1 and 5),
  meal_plan   text,
  price       integer not null check (price >= 0),
  date_rates  jsonb not null default '[]'::jsonb
              check (jsonb_typeof(date_rates) = 'array'),
  unit        text not null check (unit in ('per_person','per_person_night','per_room_night','per_vehicle','per_trip','flat')),
  description text,
  active      boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint calculator_items_hotel_details_required check (
    category <> 'hotel'
    or (
      room_type is not null
      and distance_from_haram is not null
      and haram_access is not null
      and star_rating is not null
      and nullif(btrim(meal_plan), '') is not null
    )
  )
);

alter table public.calculator_items enable row level security;

drop policy if exists "Public can read active calculator items"
  on public.calculator_items;
create policy "Public can read active calculator items"
  on public.calculator_items
  for select
  using (active = true);
