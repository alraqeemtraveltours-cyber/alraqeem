alter table public.calculator_items
  add column if not exists room_type text;

update public.calculator_items
set room_type = 'sharing'
where category = 'hotel' and room_type is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'calculator_items_room_type_check'
      and conrelid = 'public.calculator_items'::regclass
  ) then
    alter table public.calculator_items
      add constraint calculator_items_room_type_check
      check (room_type in ('sharing', 'quad', 'triple', 'double'));
  end if;
end $$;

-- Visa prices do not use a location or any per-night charging basis.
update public.calculator_items
set location = null,
    unit = case
      when unit in ('per_person_night', 'per_room_night') then 'per_person'
      else unit
    end
where category = 'visa';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'calculator_items_visa_rules_check'
      and conrelid = 'public.calculator_items'::regclass
  ) then
    alter table public.calculator_items
      add constraint calculator_items_visa_rules_check
      check (
        category <> 'visa'
        or (
          coalesce(location, '') = ''
          and unit not in ('per_person_night', 'per_room_night')
        )
      );
  end if;
end $$;
