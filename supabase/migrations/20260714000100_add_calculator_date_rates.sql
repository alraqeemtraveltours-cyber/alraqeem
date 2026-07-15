alter table public.calculator_items
  add column if not exists date_rates jsonb not null default '[]'::jsonb;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'calculator_items_date_rates_array_check'
      and conrelid = 'public.calculator_items'::regclass
  ) then
    alter table public.calculator_items
      add constraint calculator_items_date_rates_array_check
      check (jsonb_typeof(date_rates) = 'array');
  end if;
end $$;
