import "server-only";
import { getAdminClient, getReadClient } from "@/lib/supabase";
import type { HotelInput } from "@/lib/hotelInput";
import type { Hotel, HotelCity } from "@/lib/hotels";
import type { HaramAccessType } from "@/lib/calculatorItems";

const TABLE = "hotels";

type Row = {
  id: string;
  name: string;
  location: HotelCity;
  distance_from_haram: number | null;
  haram_access: HaramAccessType | null;
  star_rating: number | null;
  sort_order: number;
};

function rowToHotel(row: Row): Hotel {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    distanceFromHaram: row.distance_from_haram,
    haramAccess: row.haram_access,
    starRating: row.star_rating,
    sortOrder: row.sort_order,
  };
}

function toRow(input: HotelInput) {
  return {
    name: input.name,
    location: input.location,
    distance_from_haram: input.distanceFromHaram,
    haram_access: input.haramAccess,
    star_rating: input.starRating,
    sort_order: input.sortOrder,
  };
}

export async function getHotels(): Promise<Hotel[]> {
  const supabase = getReadClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error || !data) {
    console.error("[hotels] read failed:", error?.message);
    return [];
  }
  return (data as Row[]).map(rowToHotel);
}

export async function addHotel(input: HotelInput): Promise<Hotel> {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { data, error } = await supabase
    .from(TABLE)
    .insert(toRow(input))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToHotel(data as Row);
}

export async function updateHotel(id: string, input: HotelInput): Promise<Hotel> {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToHotel(data as Row);
}

export async function deleteHotel(id: string): Promise<void> {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
