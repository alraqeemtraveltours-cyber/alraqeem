-- =====================================================================
-- Al Raqeem Travel & Tours — packages table
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
-- It creates the table, locks down writes, allows public reads, and seeds
-- the starter packages.
-- =====================================================================

create table if not exists public.packages (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  category    text not null check (category in ('Umrah & Hajj', 'International')),
  duration    text not null,
  price       integer,                 -- null = "Contact for price"
  featured    boolean not null default false,
  highlights  text[] not null default '{}',
  description text not null,
  image       text,                    -- optional image URL override
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Row Level Security: anyone may READ, but only the service-role key
-- (used by the server-side admin API) may write.
alter table public.packages enable row level security;

drop policy if exists "Public can read packages" on public.packages;
create policy "Public can read packages"
  on public.packages
  for select
  using (true);
-- No insert/update/delete policies => writes are only possible with the
-- service-role key, which bypasses RLS. Keep that key server-side only.

-- ---------------------------------------------------------------------
-- Seed data (safe to re-run; existing slugs are skipped).
-- ---------------------------------------------------------------------
insert into public.packages
  (slug, title, category, duration, price, featured, highlights, description, sort_order)
values
  ('economy-umrah-15-days', 'Economy Umrah Package', 'Umrah & Hajj', '15 Days', 365000, true,
   ARRAY[
     'Return airfare from Peshawar or Islamabad',
     'Hotels within walking distance of Haram',
     'Saudi e-visa processing included',
     'Makkah and Madinah Ziyarat tours',
     'Ground transport between cities'
   ],
   'Our most popular package for first-time pilgrims. Comfortable hotels at honest prices, with our team handling visa, flights and transport so you can focus on your worship.', 10),

  ('premium-umrah-21-days', 'Premium Umrah Package', 'Umrah & Hajj', '21 Days', 695000, true,
   ARRAY[
     '5-star hotels facing Haram in Makkah and Madinah',
     'Direct flights with checked baggage',
     'Private transport with personal guide',
     'Daily breakfast and dinner buffet',
     'VIP fast-track visa processing'
   ],
   'For those who want complete comfort. Stay in 5-star properties steps from the Haram, travel in private vehicles, and let a dedicated guide handle every detail of your journey.', 20),

  ('ramadan-umrah-special', 'Ramadan Umrah Special', 'Umrah & Hajj', '10 to 30 Days', null, false,
   ARRAY[
     'Last Ashra packages available',
     'Hotels booked months in advance',
     'Itikaf arrangements on request',
     'Flexible durations for Ramadan'
   ],
   'Spend the most blessed nights of the year in Makkah and Madinah. Ramadan demand is extremely high, so seats and rooms are limited. Contact us early to lock your dates.', 30),

  ('hajj-package', 'Hajj Package', 'Umrah & Hajj', 'Complete Hajj Program', null, false,
   ARRAY[
     'Government-approved Hajj arrangements',
     'Mina and Arafat camp services',
     'Trained group leaders and scholars',
     'Pre-departure Hajj training sessions'
   ],
   'A complete, guided Hajj program with experienced group leaders who have performed Hajj many times. Quotas are limited every year, so early registration is essential.', 40),

  ('dubai-5-days', 'Dubai City Tour', 'International', '5 Days, 4 Nights', 285000, true,
   ARRAY[
     'Return airfare and UAE visit visa',
     '4-star hotel with breakfast',
     'Desert safari with BBQ dinner',
     'Burj Khalifa and Dubai Mall visit',
     'Marina dhow cruise included'
   ],
   'The complete Dubai experience for couples and families. Visa, flights, hotel and the must-do attractions packed into five comfortable days.', 50),

  ('turkey-7-days', 'Turkey Tour: Istanbul & Cappadocia', 'International', '7 Days, 6 Nights', 425000, true,
   ARRAY[
     'Return airfare and Turkey e-visa support',
     'Istanbul old city guided tours',
     'Cappadocia with optional balloon ride',
     'Bosphorus cruise included',
     'Halal meals throughout'
   ],
   'Walk through Ottoman history in Istanbul, then watch hot air balloons rise over Cappadocia. One of our most loved packages for honeymoons and families alike.', 60),

  ('baku-5-days', 'Baku, Azerbaijan', 'International', '5 Days, 4 Nights', 245000, false,
   ARRAY[
     'Return airfare and e-visa included',
     'City center hotel with breakfast',
     'Old City and Flame Towers tour',
     'Gabala day trip with cable car'
   ],
   'Europe''s vibe at Asia''s distance. Baku offers walkable streets, mountain day trips and easy visas, making it perfect for a short international getaway.', 70),

  ('malaysia-thailand-8-days', 'Malaysia & Thailand Combo', 'International', '8 Days, 7 Nights', null, false,
   ARRAY[
     'Kuala Lumpur and Bangkok in one trip',
     'Genting Highlands day tour',
     'Phuket beach extension available',
     'Visa processing for both countries'
   ],
   'Two countries, one booking. City lights in Kuala Lumpur and beaches in Thailand. Prices vary by season, so contact us for a quote on your dates.', 80)
on conflict (slug) do nothing;
