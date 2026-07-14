export const calculatorCategories = [
  "hotel",
  "flight",
  "visa",
  "transport",
  "ziyarat",
  "other",
] as const;

export type CalculatorCategory = (typeof calculatorCategories)[number];

export const calculatorUnits = [
  "per_person",
  "per_person_night",
  "per_room_night",
  "per_vehicle",
  "per_trip",
  "flat",
] as const;

export type CalculatorUnit = (typeof calculatorUnits)[number];

export const roomTypes = ["sharing", "quad", "triple", "double"] as const;
export type RoomType = (typeof roomTypes)[number];

/**
 * Canonicalise a hotel city so spelling variants all map to one value.
 * "Madinah", "Medina", "Medinah" → "Madina"; everything else → "Makkah".
 */
export function normalizeCity(location: string): "Makkah" | "Madina" {
  const value = location.trim().toLowerCase();
  if (value.startsWith("mad") || value.startsWith("med")) return "Madina";
  return "Makkah";
}

export type DateRate = {
  startDate: string;
  endDate: string;
  price: number;
};

export const haramAccessTypes = ["walk", "shuttle", "both"] as const;
export type HaramAccessType = (typeof haramAccessTypes)[number];
export const haramAccessLabels: Record<HaramAccessType, string> = {
  walk: "Walk",
  shuttle: "Shuttle",
  both: "Both",
};

export const roomTypeLabels: Record<RoomType, string> = {
  sharing: "Sharing",
  quad: "Quad",
  triple: "Triple",
  double: "Double",
};

export type CalculatorItem = {
  id: string;
  name: string;
  category: CalculatorCategory;
  roomType: RoomType | null;
  location: string;
  distanceFromHaram: number | null;
  haramAccess: HaramAccessType | null;
  starRating: number | null;
  mealPlan: string;
  price: number;
  dateRates: DateRate[];
  unit: CalculatorUnit;
  description: string;
  active: boolean;
  sortOrder: number;
};

export const categoryLabels: Record<CalculatorCategory, string> = {
  hotel: "Hotels",
  flight: "Flights",
  visa: "Visas",
  transport: "Transport",
  ziyarat: "Ziyarat & tours",
  other: "Other charges",
};

export const unitLabels: Record<CalculatorUnit, string> = {
  per_person: "Per person",
  per_person_night: "Per person / night",
  per_room_night: "Per room / night",
  per_vehicle: "Per vehicle",
  per_trip: "Per trip",
  flat: "Flat charge",
};

export function formatCalculatorPrice(price: number) {
  return `SAR ${price.toLocaleString("en-PK", { maximumFractionDigits: 2 })}`;
}

export function formatPkrPrice(price: number) {
  return `PKR ${Math.round(price).toLocaleString("en-PK")}`;
}
