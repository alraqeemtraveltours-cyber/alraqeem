-- Track whether each inquiry notification was handed to the admin mail server.
-- Existing inquiries are marked "unknown" because they predate delivery tracking.
alter table public.inquiries
  add column if not exists admin_email_status text not null default 'unknown',
  add column if not exists admin_email_sent_at timestamptz,
  add column if not exists admin_email_error text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'inquiries_admin_email_status_check'
      and conrelid = 'public.inquiries'::regclass
  ) then
    alter table public.inquiries
      add constraint inquiries_admin_email_status_check
      check (admin_email_status in ('unknown', 'pending', 'sent', 'failed', 'not_configured'));
  end if;
end $$;
