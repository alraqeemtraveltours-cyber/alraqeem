import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPackages, addPackage } from "@/lib/packagesStore";
import { parsePackageBody } from "@/lib/packageInput";

export const dynamic = "force-dynamic";

export async function GET() {
  const packages = await getPackages();
  return NextResponse.json({ packages });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parsePackageBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const pkg = await addPackage(parsed.input);
    revalidatePath("/");
    revalidatePath("/packages");
    return NextResponse.json({ package: pkg }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to add package.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
