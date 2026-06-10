import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when the public read credentials are present. */
export const isSupabaseConfigured = Boolean(url && anonKey);

/** Read-only client (anon key) — used by public pages. */
export function getReadClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/**
 * Privileged client (service role) — used by admin write APIs only.
 * Never import this into a client component.
 */
export function getAdminClient(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

export const PACKAGES_TABLE = "packages";
