alter table public.calculator_items
  add column if not exists haram_access text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'calculator_items_haram_access_check'
      and conrelid = 'public.calculator_items'::regclass
  ) then
    alter table public.calculator_items
      add constraint calculator_items_haram_access_check
      check (haram_access in ('walk', 'shuttle', 'both'));
  end if;
end $$;
