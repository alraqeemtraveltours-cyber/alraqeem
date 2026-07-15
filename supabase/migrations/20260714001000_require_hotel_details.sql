-- Make this migration safe to run even if the earlier hotel-detail migrations
-- were skipped or executed out of order.
alter table public.calculator_items
  add column if not exists room_type text,
  add column if not exists distance_from_haram integer,
  add column if not exists haram_access text,
  add column if not exists star_rating smallint,
  add column if not exists meal_plan text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'calculator_items_haram_access_check'
      and conrelid = 'public.calculator_items'::regclass
  ) then
    alter table public.calculator_items
      add constraint calculator_items_haram_access_check
      check (haram_access in ('walk', 'shuttle', 'both'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'calculator_items_star_rating_check'
      and conrelid = 'public.calculator_items'::regclass
  ) then
    alter table public.calculator_items
      add constraint calculator_items_star_rating_check
      check (star_rating between 1 and 5);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'calculator_items_hotel_details_required'
      and conrelid = 'public.calculator_items'::regclass
  ) then
    alter table public.calculator_items
      add constraint calculator_items_hotel_details_required
      check (
        category <> 'hotel'
        or (
          room_type is not null
          and distance_from_haram is not null
          and haram_access is not null
          and star_rating is not null
          and nullif(btrim(meal_plan), '') is not null
        )
      ) not valid;
  end if;
end $$;
