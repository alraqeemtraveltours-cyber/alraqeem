import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSettings, updateSettings } from "@/lib/settingsStore";
import { defaultSettings, type SiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const input = {} as SiteSettings;
  (Object.keys(defaultSettings) as (keyof SiteSettings)[]).forEach((k) => {
    input[k] = String(body[k] ?? "").trim();
  });
  if (!input.name) {
    return NextResponse.json({ error: "Site name is required." }, { status: 400 });
  }

  try {
    const settings = await updateSettings(input);
    revalidatePath("/", "layout");
    return NextResponse.json({ settings });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save settings.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
