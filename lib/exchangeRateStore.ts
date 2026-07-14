import "server-only";
import { getAdminClient, getReadClient } from "@/lib/supabase";

const TABLE = "exchange_rates";
const CURRENCY = "SAR";
const FALLBACK_RATE = 75;

type Row = {
  currency: string;
  rate_to_pkr: number | string;
  updated_at: string;
};

export type SarExchangeRate = {
  rate: number;
  updatedAt: string | null;
};

export async function getSarExchangeRate(): Promise<SarExchangeRate> {
  const supabase = getReadClient();
  if (!supabase) return { rate: FALLBACK_RATE, updatedAt: null };
  const { data, error } = await supabase
    .from(TABLE)
    .select("currency,rate_to_pkr,updated_at")
    .eq("currency", CURRENCY)
    .maybeSingle();
  if (error || !data) {
    if (error) console.error("[exchange-rate] read failed:", error.message);
    return { rate: FALLBACK_RATE, updatedAt: null };
  }
  const row = data as Row;
  return {
    rate: Number(row.rate_to_pkr) || FALLBACK_RATE,
    updatedAt: row.updated_at ?? null,
  };
}

export async function updateSarExchangeRate(rate: number) {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const updatedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(
      { currency: CURRENCY, rate_to_pkr: rate, updated_at: updatedAt },
      { onConflict: "currency" }
    )
    .select("currency,rate_to_pkr,updated_at")
    .single();
  if (error) throw new Error(error.message);
  const row = data as Row;
  return { rate: Number(row.rate_to_pkr), updatedAt: row.updated_at };
}
