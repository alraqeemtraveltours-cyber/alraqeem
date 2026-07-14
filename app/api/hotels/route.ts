import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { parseHotelBody } from "@/lib/hotelInput";
import { addHotel, getHotels } from "@/lib/hotelsStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ hotels: await getHotels() });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = parseHotelBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  try {
    const hotel = await addHotel(parsed.input);
    revalidatePath("/admin/hotels");
    revalidatePath("/admin/calculator");
    return NextResponse.json({ hotel }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add hotel.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
