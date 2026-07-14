import "server-only";
import { getReadClient, getAdminClient } from "@/lib/supabase";
import { defaultSettings, type SiteSettings } from "@/lib/settings";

const TABLE = "site_settings";
const ROW_ID = 1; // single-row settings table

type Row = Partial<SiteSettings> & { id?: number };

/** Site settings merged over defaults. Falls back to defaults if no DB. */
export async function getSettings(): Promise<SiteSettings> {
  const supabase = getReadClient();
  if (!supabase) return defaultSettings;

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error || !data) return defaultSettings;

  const row = data as Row;
  // Merge: any value the admin has saved (including an intentional blank)
  // overrides the default. Only a null/undefined column — one the admin has
  // never set — falls back to the default, so cleared fields stay cleared.
  const merged = { ...defaultSettings };
  (Object.keys(defaultSettings) as (keyof SiteSettings)[]).forEach((k) => {
    const v = row[k];
    if (v !== null && v !== undefined) {
      merged[k] = String(v);
    }
  });
  return merged;
}

export async function updateSettings(
  input: SiteSettings
): Promise<SiteSettings> {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { error } = await supabase
    .from(TABLE)
    .upsert({ id: ROW_ID, ...input });
  if (error) throw new Error(error.message);
  return getSettings();
}
