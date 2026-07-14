import type { HaramAccessType } from "@/lib/calculatorItems";

export const hotelCities = ["Makkah", "Madina"] as const;
export type HotelCity = (typeof hotelCities)[number];

export type Hotel = {
  id: string;
  name: string;
  location: HotelCity;
  distanceFromHaram: number | null;
  haramAccess: HaramAccessType | null;
  starRating: number | null;
  sortOrder: number;
};
