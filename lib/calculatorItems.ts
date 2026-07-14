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
  price: number;
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
  return `PKR ${price.toLocaleString("en-PK")}`;
}
