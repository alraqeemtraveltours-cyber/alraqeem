import "server-only";
import { getAdminClient, getReadClient } from "@/lib/supabase";
import type { CalculatorItemInput } from "@/lib/calculatorItemInput";
import type {
  CalculatorCategory,
  DateRate,
  HaramAccessType,
  CalculatorItem,
  CalculatorUnit,
  RoomType,
} from "@/lib/calculatorItems";

const TABLE = "calculator_items";

type Row = {
  id: string;
  name: string;
  category: CalculatorCategory;
  room_type: RoomType | null;
  location: string | null;
  distance_from_haram: number | null;
  haram_access: HaramAccessType | null;
  star_rating: number | null;
  meal_plan: string | null;
  price: number;
  date_rates: DateRate[] | null;
  unit: CalculatorUnit;
  description: string | null;
  active: boolean;
  sort_order: number;
};

function rowToItem(row: Row): CalculatorItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    roomType: row.room_type,
    location: row.location ?? "",
    distanceFromHaram: row.distance_from_haram ?? null,
    haramAccess: row.haram_access ?? null,
    starRating: row.star_rating ?? null,
    mealPlan: row.meal_plan ?? "",
    price: row.price,
    dateRates: row.date_rates ?? [],
    unit: row.unit,
    description: row.description ?? "",
    active: row.active,
    sortOrder: row.sort_order,
  };
}

function toRow(input: CalculatorItemInput) {
  return {
    name: input.name,
    category: input.category,
    room_type: input.roomType,
    location: input.location || null,
    distance_from_haram: input.distanceFromHaram,
    haram_access: input.haramAccess,
    star_rating: input.starRating,
    meal_plan: input.mealPlan || null,
    price: input.price,
    date_rates: input.dateRates,
    unit: input.unit,
    description: input.description || null,
    active: input.active,
    sort_order: input.sortOrder,
  };
}

export async function getCalculatorItems(activeOnly = false) {
  // Public reads only active prices; admin reads use the service client so
  // hidden items remain visible and editable in the dashboard.
  const supabase = activeOnly
    ? getReadClient()
    : getAdminClient() ?? getReadClient();
  if (!supabase) return [] as CalculatorItem[];
  let query = supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (activeOnly) query = query.eq("active", true);
  const { data, error } = await query;
  if (error || !data) {
    console.error("[calculator] read failed:", error?.message);
    return [];
  }
  return (data as Row[]).map(rowToItem);
}

export async function addCalculatorItem(input: CalculatorItemInput) {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { data, error } = await supabase
    .from(TABLE)
    .insert(toRow(input))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToItem(data as Row);
}

export async function updateCalculatorItem(
  id: string,
  input: CalculatorItemInput
) {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToItem(data as Row);
}

export async function deleteCalculatorItem(id: string) {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
