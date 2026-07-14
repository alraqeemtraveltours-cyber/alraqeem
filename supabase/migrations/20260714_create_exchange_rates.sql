create table if not exists public.exchange_rates (
  currency    text primary key,
  rate_to_pkr numeric(12,4) not null check (rate_to_pkr > 0),
  updated_at  timestamptz not null default now()
);

alter table public.exchange_rates enable row level security;

drop policy if exists "Public can read exchange rates"
  on public.exchange_rates;
create policy "Public can read exchange rates"
  on public.exchange_rates
  for select
  using (true);

insert into public.exchange_rates (currency, rate_to_pkr)
values ('SAR', 75)
on conflict (currency) do nothing;
