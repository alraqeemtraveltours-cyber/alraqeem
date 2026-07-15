-- Categories are now managed dynamically in the `categories` table and the
-- /admin/categories UI, so the packages.category column must accept any name.
-- The original schema hardcoded check (category in ('Umrah & Hajj','International')),
-- which made every package created under a new category fail with a CHECK
-- violation. Drop that constraint (name is Postgres's default for the inline check).
alter table public.packages
  drop constraint if exists packages_category_check;
