alter table public.calculator_items
  add column if not exists distance_from_haram integer,
  add column if not exists star_rating smallint,
  add column if not exists meal_plan text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'calculator_items_star_rating_check'
      and conrelid = 'public.calculator_items'::regclass
  ) then
    alter table public.calculator_items
      add constraint calculator_items_star_rating_check
      check (star_rating between 1 and 5);
  end if;
end $$;
