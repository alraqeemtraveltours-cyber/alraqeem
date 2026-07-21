import "server-only";
import { getAdminClient, getReadClient } from "@/lib/supabase";
import {
  defaultTransportConfig,
  type TransportConfig,
} from "@/lib/transportConfig";

const TABLE = "transport_config";
const ROW_ID = 1; // single-row config table, same pattern as site_settings

type Row = {
  id: number;
  config: Partial<TransportConfig> | null;
  updated_at: string;
};

/**
 * Merge a stored config over the seed defaults. Arrays the admin has saved
 * replace the seed lists wholesale; fee fields merge key by key so a config
 * saved before a new fee existed still picks up that fee's default.
 */
function mergeConfig(stored: Partial<TransportConfig>): TransportConfig {
  return {
    visaTiers: Array.isArray(stored.visaTiers) && stored.visaTiers.length > 0
      ? stored.visaTiers
      : defaultTransportConfig.visaTiers,
    vehicles: Array.isArray(stored.vehicles) && stored.vehicles.length > 0
      ? stored.vehicles
      : defaultTransportConfig.vehicles,
    sectors: Array.isArray(stored.sectors) && stored.sectors.length > 0
      ? stored.sectors
      : defaultTransportConfig.sectors,
    fees: { ...defaultTransportConfig.fees, ...(stored.fees ?? {}) },
  };
}

/** Transport & visa config. Falls back to the seed sheet when no DB row. */
export async function getTransportConfig(): Promise<TransportConfig> {
  const supabase = getReadClient();
  if (!supabase) return defaultTransportConfig;

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (error || !data) {
    // PGRST205 = table not yet in PostgREST's schema cache (migration just
    // ran). The seed config is safe to serve during that window.
    const tableNotReady =
      error?.code === "PGRST205" ||
      /Could not find the table ['"]public\.transport_config/.test(
        error?.message ?? ""
      );
    if (error && !tableNotReady) {
      console.error("[transport-config] read failed:", error.message);
    }
    return defaultTransportConfig;
  }

  const row = data as Row;
  if (!row.config || typeof row.config !== "object") {
    return defaultTransportConfig;
  }
  return mergeConfig(row.config);
}

export async function updateTransportConfig(
  config: TransportConfig
): Promise<TransportConfig> {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { error } = await supabase.from(TABLE).upsert({
    id: ROW_ID,
    config,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
  return getTransportConfig();
}
