alter table public.calculator_items
  add column if not exists distance_from_haram integer;

alter table public.calculator_items
  alter column distance_from_haram type integer
  using nullif(
    regexp_replace(distance_from_haram::text, '[^0-9]', '', 'g'),
    ''
  )::integer;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'calculator_items_distance_nonnegative_check'
      and conrelid = 'public.calculator_items'::regclass
  ) then
    alter table public.calculator_items
      add constraint calculator_items_distance_nonnegative_check
      check (distance_from_haram >= 0);
  end if;
end $$;
