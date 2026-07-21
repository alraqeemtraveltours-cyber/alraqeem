-- Single-row JSONB config for the transport & visa pricing engine:
-- sharing visa tiers, private flat visas, vehicle fleet, directional
-- sector price grid, and the extra fees. The application seeds defaults
-- in code (lib/transportConfig.ts) and only writes a row on first save.

create table if not exists public.transport_config (
  id         integer primary key,
  config     jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.transport_config enable row level security;

drop policy if exists "Public can read transport config"
  on public.transport_config;
create policy "Public can read transport config"
  on public.transport_config
  for select
  using (true);
