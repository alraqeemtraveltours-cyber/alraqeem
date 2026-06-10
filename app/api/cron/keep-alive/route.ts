import { NextResponse } from "next/server";
import { getReadClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Pinged daily by Vercel Cron (see vercel.json) to keep the Supabase
 * free-tier project from pausing after a week of inactivity.
 */
export async function GET(request: Request) {
  // If CRON_SECRET is set, require it (Vercel sends it as a Bearer token).
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = getReadClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, pinged: false, reason: "Supabase not configured" });
  }

  const { error } = await supabase.from("packages").select("slug").limit(1);
  return NextResponse.json({
    ok: !error,
    pinged: true,
    at: new Date().toISOString(),
    error: error?.message ?? null,
  });
}
