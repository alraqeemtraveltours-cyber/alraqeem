import {
  calculatorCategories,
  calculatorUnits,
  haramAccessTypes,
  roomTypes,
  type CalculatorCategory,
  type CalculatorItem,
  type CalculatorUnit,
  type DateRate,
  type HaramAccessType,
  type RoomType,
} from "@/lib/calculatorItems";

export type CalculatorItemInput = Omit<CalculatorItem, "id">;
type ParseResult = { input: CalculatorItemInput } | { error: string };

export function parseCalculatorItemBody(
  body: Record<string, unknown>
): ParseResult {
  const name = String(body.name ?? "").trim();
  const category = String(body.category ?? "") as CalculatorCategory;
  const location = String(body.location ?? "").trim();
  const rawDistance = body.distanceFromHaram;
  const distanceFromHaram =
    rawDistance === "" || rawDistance === null || rawDistance === undefined
      ? null
      : Number(rawDistance);
  const requestedHaramAccess = String(
    body.haramAccess ?? ""
  ).toLowerCase() as HaramAccessType;
  const mealPlan = String(body.mealPlan ?? "").trim();
  const rawStarRating = body.starRating;
  const starRating =
    rawStarRating === "" || rawStarRating === null || rawStarRating === undefined
      ? null
      : Number(rawStarRating);
  const requestedRoomType = String(body.roomType ?? "").toLowerCase() as RoomType;
  const unit = String(body.unit ?? "") as CalculatorUnit;
  const description = String(body.description ?? "").trim();
  const price = Number(body.price);
  const sortOrder = Number(body.sortOrder ?? 0);

  if (!name) return { error: "Name is required." };
  if (!calculatorCategories.includes(category)) {
    return { error: "Choose a valid item category." };
  }
  if (!calculatorUnits.includes(unit)) {
    return { error: "Choose a valid charging basis." };
  }
  if (
    category === "visa" &&
    (unit === "per_person_night" || unit === "per_room_night")
  ) {
    return { error: "Visa prices cannot use a per-night charging basis." };
  }
  if (category === "hotel" && !roomTypes.includes(requestedRoomType)) {
    return { error: "Choose Sharing, Quad, Triple, or Double room type." };
  }
  if (category === "hotel" && !haramAccessTypes.includes(requestedHaramAccess)) {
    return { error: "Choose Walk, Shuttle, or Both for Haram access." };
  }
  if (category === "hotel" && distanceFromHaram === null) {
    return { error: "Distance from Haram is required for hotels." };
  }
  if (
    distanceFromHaram !== null &&
    (!Number.isInteger(distanceFromHaram) || distanceFromHaram < 0)
  ) {
    return { error: "Distance from Haram must be zero or a positive number in metres." };
  }
  if (
    starRating !== null &&
    (!Number.isInteger(starRating) || starRating < 1 || starRating > 5)
  ) {
    return { error: "Hotel star rating must be between 1 and 5." };
  }
  if (category === "hotel" && starRating === null) {
    return { error: "Star rating is required for hotels." };
  }
  if (category === "hotel" && !mealPlan) {
    return { error: "Meal plan is required for hotels." };
  }
  if (!Number.isFinite(price) || price < 0) {
    return { error: "Price must be zero or a positive number." };
  }

  // Date-based rates only apply to hotels and per-night units. For any other
  // item, ignore whatever dateRates the client sent (a stale, half-filled row
  // from a previous category choice must not fail the save).
  const keepsDateRates =
    category === "hotel" ||
    unit === "per_room_night" ||
    unit === "per_person_night";

  const dateRates: DateRate[] = [];
  if (keepsDateRates && Array.isArray(body.dateRates)) {
    for (const raw of body.dateRates) {
      if (!raw || typeof raw !== "object") continue;
      const rate = raw as Record<string, unknown>;
      const startDate = String(rate.startDate ?? "");
      const endDate = String(rate.endDate ?? "");
      const rawRatePrice = rate.price;
      const ratePrice = Number(rawRatePrice);
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(endDate) ||
        endDate < startDate ||
        rawRatePrice === "" ||
        rawRatePrice === null ||
        rawRatePrice === undefined ||
        !Number.isFinite(ratePrice) ||
        ratePrice < 0
      ) {
        return { error: "Every date rate needs valid From, To, and Price values." };
      }
      dateRates.push({ startDate, endDate, price: Math.round(ratePrice) });
    }
  }
  dateRates.sort((a, b) => a.startDate.localeCompare(b.startDate));
  for (let index = 1; index < dateRates.length; index += 1) {
    if (dateRates[index].startDate <= dateRates[index - 1].endDate) {
      return { error: "Date-based price periods cannot overlap." };
    }
  }

  return {
    input: {
      name,
      category,
      roomType: category === "hotel" ? requestedRoomType : null,
      location: category === "visa" ? "" : location,
      distanceFromHaram: category === "hotel" ? distanceFromHaram : null,
      haramAccess: category === "hotel" ? requestedHaramAccess : null,
      starRating: category === "hotel" ? starRating : null,
      mealPlan: category === "hotel" ? mealPlan : "",
      price: Math.round(price),
      dateRates:
        category === "hotel" ||
        unit === "per_room_night" ||
        unit === "per_person_night"
          ? dateRates
          : [],
      unit,
      description,
      active: body.active !== false,
      sortOrder: Number.isFinite(sortOrder) ? Math.round(sortOrder) : 0,
    },
  };
}
