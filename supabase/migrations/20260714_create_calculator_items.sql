create table if not exists public.calculator_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  category    text not null check (category in ('hotel','flight','visa','transport','ziyarat','other')),
  room_type   text check (room_type in ('sharing','quad','triple','double')),
  location    text,
  price       integer not null check (price >= 0),
  unit        text not null check (unit in ('per_person','per_person_night','per_room_night','per_vehicle','per_trip','flat')),
  description text,
  active      boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.calculator_items enable row level security;

drop policy if exists "Public can read active calculator items"
  on public.calculator_items;
create policy "Public can read active calculator items"
  on public.calculator_items
  for select
  using (active = true);
