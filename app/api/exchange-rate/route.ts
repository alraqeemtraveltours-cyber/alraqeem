import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getSarExchangeRate,
  updateSarExchangeRate,
} from "@/lib/exchangeRateStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ exchangeRate: await getSarExchangeRate() });
}

export async function PUT(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const rate = Number(body.rate);
  if (!Number.isFinite(rate) || rate <= 0) {
    return NextResponse.json(
      { error: "Enter a valid SAR to PKR rate greater than zero." },
      { status: 400 }
    );
  }
  try {
    const exchangeRate = await updateSarExchangeRate(rate);
    revalidatePath("/admin");
    revalidatePath("/package-calculator");
    return NextResponse.json({ exchangeRate });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update rate.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
