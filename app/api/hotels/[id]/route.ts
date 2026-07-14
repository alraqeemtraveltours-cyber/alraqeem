import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { parseHotelBody } from "@/lib/hotelInput";
import { deleteHotel, updateHotel } from "@/lib/hotelsStore";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    const hotel = await updateHotel(id, parsed.input);
    revalidatePath("/admin/hotels");
    revalidatePath("/admin/calculator");
    return NextResponse.json({ hotel });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update hotel.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deleteHotel(id);
    revalidatePath("/admin/hotels");
    revalidatePath("/admin/calculator");
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete hotel.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
