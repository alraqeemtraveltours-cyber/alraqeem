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
  price_type  text not null default 'from'
              check (price_type in ('from', 'flat')), -- "From PKR X" vs flat "PKR X"
  featured    boolean not null default false,
  highlights  text[] not null default '{}',
  description text not null,
  image       text,                    -- optional image URL override
  expiry_date date,                     -- optional offer expiry (null = none)
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- If the table already existed, make sure the newer columns are present.
alter table public.packages add column if not exists expiry_date date;
alter table public.packages add column if not exists price_type text not null default 'from';

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
  ('economy-umrah-15-days', 'Economy Umrah Package', 'Umrah & Hajj', '15 Days', 220000, true,
   ARRAY[
     'Return airfare from Peshawar or Islamabad',
     'Hotels within walking distance of Haram',
     'Saudi e-visa processing included',
     'Makkah and Madinah Ziyarat tours',
     'Ground transport between cities'
   ],
   'Our most popular package for first-time pilgrims. Comfortable hotels at honest prices, with our team handling visa, flights and transport so you can focus on your worship.', 10),

  ('premium-umrah-21-days', 'Premium Umrah Package', 'Umrah & Hajj', '21 Days', 300000, true,
   ARRAY[
     '5-star hotels facing Haram in Makkah and Madinah',
     'Direct flights with checked baggage',
     'Private transport with personal guide',
     'Daily breakfast and dinner buffet',
     'VIP fast-track visa processing'
   ],
   'For those who want complete comfort. Stay in 5-star properties steps from the Haram, travel in private vehicles, and let a dedicated guide handle every detail of your journey.', 20),

  ('economy-umrah-21-days', 'Economy Umrah Package 21 Days', 'Umrah & Hajj', '21 Days', null, false,
   ARRAY[
     'Return airfare from Peshawar or Islamabad',
     'Economy hotels within walking or shuttle distance',
     'Saudi Umrah e-visa processing included',
     'Shared ground transport between cities',
     'Guided Ziyarat in Makkah and Madinah'
   ],
   'A longer economy journey for pilgrims who want more time for worship in Makkah and Madinah while keeping the overall cost practical. Visa, flights, hotels, transport, and guided Ziyarat are arranged together.', 22),

  ('premium-umrah-15-days', 'Premium Umrah Package 15 Days', 'Umrah & Hajj', '15 Days', null, false,
   ARRAY[
     'Five star hotels near the Haram',
     'Return airfare with checked baggage',
     'Private ground transport',
     'Double or triple room sharing',
     'Saudi Umrah e-visa and guided Ziyarat'
   ],
   'A focused premium journey for pilgrims who want five star comfort near the Harams in a shorter stay. Our desk arranges the visa, flights, hotels, private transport, and guided Ziyarat end to end.', 24),

  ('five-star-umrah-30-days', 'Five Star Umrah Package 30 Days', 'Umrah & Hajj', '30 Days', null, false,
   ARRAY[
     'Extended stay across Makkah and Madinah',
     'Five star hotels near both Harams',
     'Double or triple room sharing',
     'Private airport and intercity transfers',
     'Saudi Umrah e-visa and guided Ziyarat'
   ],
   'An extended five star Umrah for pilgrims seeking a slower pace, more days of worship, and comfortable hotels near both Harams. Flights, visa, private transfers, and guided Ziyarat are included in one arrangement.', 26),

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
     'Government Hajj scheme registration through MORA',
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


-- =====================================================================
-- Media storage (for the /admin/media image library)
-- =====================================================================

-- Public bucket to hold uploaded images.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Anyone may READ media files (they are referenced publicly on the site).
drop policy if exists "Public can read media" on storage.objects;
create policy "Public can read media"
  on storage.objects
  for select
  using (bucket_id = 'media');

-- Uploads and deletes happen server-side with the service-role key,
-- which bypasses RLS — so no public write policy is created.


-- =====================================================================
-- CATEGORIES (dynamic, for packages and tickets)
-- =====================================================================
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       text not null check (type in ('package','ticket')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (name, type)
);
alter table public.categories enable row level security;
drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories" on public.categories for select using (true);

insert into public.categories (name, type, sort_order) values
  ('Umrah & Hajj', 'package', 10),
  ('International', 'package', 20),
  ('Umrah & Hajj Flights', 'ticket', 10),
  ('International Flights', 'ticket', 20)
on conflict (name, type) do nothing;

-- =====================================================================
-- TICKETS (air ticket / flight deals)
-- =====================================================================
create table if not exists public.tickets (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  airline     text not null,
  sector      text not null,
  category    text not null,
  trip_type   text not null default 'Return' check (trip_type in ('One-way','Return')),
  fare        integer,
  baggage     text,
  description text,
  image       text,
  featured    boolean not null default false,
  expiry_date date,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);
alter table public.tickets enable row level security;
drop policy if exists "Public can read tickets" on public.tickets;
create policy "Public can read tickets" on public.tickets for select using (true);

insert into public.tickets (slug, airline, sector, category, trip_type, fare, baggage, description, featured, sort_order) values
  ('isb-jed-umrah-return','Saudia','Islamabad (ISB) → Jeddah (JED)','Umrah & Hajj Flights','Return',165000,'40 kg','<p>Direct return fares to Jeddah for Umrah travellers from Islamabad. Limited seats at this rate.</p>',true,10),
  ('pew-jed-umrah-return','Airblue','Peshawar (PEW) → Jeddah (JED)','Umrah & Hajj Flights','Return',158000,'30 kg','<p>Convenient return fares from Peshawar to Jeddah, ideal for Umrah groups from KP.</p>',true,20),
  ('isb-dxb-return','Emirates','Islamabad (ISB) → Dubai (DXB)','International Flights','Return',135000,'30 kg','<p>Return tickets to Dubai with checked baggage. Great for tourism and visit-visa travellers.</p>',true,30),
  ('lhe-ist-return','Turkish Airlines','Lahore (LHE) → Istanbul (IST)','International Flights','Return',215000,'30 kg','<p>Return fares to Istanbul on Turkish Airlines.</p>',false,40)
on conflict (slug) do nothing;

-- =====================================================================
-- POSTS (blog)
-- =====================================================================
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  content      text not null,
  image        text,
  date         date not null default current_date,
  read_minutes integer not null default 5,
  created_at   timestamptz not null default now()
);
alter table public.posts enable row level security;
drop policy if exists "Public can read posts" on public.posts;
create policy "Public can read posts" on public.posts for select using (true);

-- =====================================================================
-- SITE SETTINGS (single row, id = 1)
-- =====================================================================
create table if not exists public.site_settings (
  id        integer primary key default 1,
  name      text,
  tagline   text,
  phone     text,
  landline  text,
  whatsapp  text,
  email     text,
  address   text,
  hours     text,
  facebook  text,
  instagram text,
  youtube   text,
  tiktok    text,
  constraint single_row check (id = 1)
);
-- For databases created before the landline column existed.
alter table public.site_settings add column if not exists landline text;
alter table public.site_settings enable row level security;
drop policy if exists "Public can read settings" on public.site_settings;
create policy "Public can read settings" on public.site_settings for select using (true);

insert into public.site_settings (id, name, tagline, phone, whatsapp, email, address, hours)
values (1, 'Al Raqeem Travel & Tours', 'Your trusted partner for Umrah, Hajj and worldwide travel',
        '03125446922', '923125446922', 'info@alraqeem.com.pk',
        'Main Bazaar Road, Charsadda, Khyber Pakhtunkhwa, Pakistan',
        'Monday to Saturday, 9:00 AM to 8:00 PM')
on conflict (id) do nothing;

-- =====================================================================
-- INQUIRIES (contact form submissions)
-- =====================================================================
create table if not exists public.inquiries (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  city       text,
  email      text,
  service    text not null,
  message    text,
  created_at timestamptz not null default now()
);
alter table public.inquiries enable row level security;
