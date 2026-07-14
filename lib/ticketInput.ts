import { tripTypes, type TripType, type Ticket } from "@/lib/tickets";

export type TicketInput = Omit<Ticket, "slug"> & { slug?: string };

type ParseResult = { input: TicketInput } | { error: string };

export function parseTicketBody(body: Record<string, unknown>): ParseResult {
  const airline = String(body.airline ?? "").trim();
  const sector = String(body.sector ?? "").trim();
  const category = String(body.category ?? "").trim();
  const description = String(body.description ?? "").trim();
  const baggage = String(body.baggage ?? "").trim();
  const tripType = String(body.tripType ?? "Return") as TripType;

  if (!airline || !sector) {
    return { error: "Airline and sector are required." };
  }
  if (!category) {
    return { error: "Category is required." };
  }
  if (!tripTypes.includes(tripType)) {
    return { error: "Trip type must be One-way or Return." };
  }

  const rawFare = body.fare;
  const fare =
    rawFare === null || rawFare === "" || rawFare === undefined
      ? null
      : Number(rawFare);
  if (fare !== null && (Number.isNaN(fare) || fare < 0)) {
    return { error: "Fare must be zero or a positive number." };
  }

  const image = body.image ? String(body.image).trim() : undefined;
  const featured = Boolean(body.featured);
  const expiryRaw = body.expiryDate ? String(body.expiryDate).trim() : "";
  const expiryDate = /^\d{4}-\d{2}-\d{2}$/.test(expiryRaw) ? expiryRaw : null;

  return {
    input: {
      airline,
      sector,
      category,
      tripType,
      fare,
      baggage,
      description,
      image,
      featured,
      expiryDate,
    },
  };
}
