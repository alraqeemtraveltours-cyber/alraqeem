import { haramAccessTypes, type HaramAccessType } from "@/lib/calculatorItems";
import { hotelCities, type Hotel, type HotelCity } from "@/lib/hotels";

export type HotelInput = Omit<Hotel, "id">;
type ParseResult = { input: HotelInput } | { error: string };

export function parseHotelBody(body: Record<string, unknown>): ParseResult {
  const name = String(body.name ?? "").trim();
  const location = String(body.location ?? "") as HotelCity;

  const rawDistance = body.distanceFromHaram;
  const distanceFromHaram =
    rawDistance === "" || rawDistance === null || rawDistance === undefined
      ? null
      : Number(rawDistance);

  const rawAccess = String(body.haramAccess ?? "").toLowerCase();
  const haramAccess = rawAccess === "" ? null : (rawAccess as HaramAccessType);

  const rawStarRating = body.starRating;
  const starRating =
    rawStarRating === "" || rawStarRating === null || rawStarRating === undefined
      ? null
      : Number(rawStarRating);

  const sortOrder = Number(body.sortOrder ?? 0);

  if (!name) return { error: "Hotel name is required." };
  if (!hotelCities.includes(location)) {
    return { error: "Choose Makkah or Madina." };
  }
  if (
    distanceFromHaram !== null &&
    (!Number.isInteger(distanceFromHaram) || distanceFromHaram < 0)
  ) {
    return { error: "Distance from Haram must be zero or a positive number in metres." };
  }
  if (haramAccess !== null && !haramAccessTypes.includes(haramAccess)) {
    return { error: "Choose Walk, Shuttle, or Both for Haram access." };
  }
  if (
    starRating !== null &&
    (!Number.isInteger(starRating) || starRating < 1 || starRating > 5)
  ) {
    return { error: "Star rating must be between 1 and 5." };
  }

  return {
    input: {
      name,
      location,
      distanceFromHaram,
      haramAccess,
      starRating,
      sortOrder: Number.isFinite(sortOrder) ? Math.round(sortOrder) : 0,
    },
  };
}
