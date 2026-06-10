import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deletePackage, updatePackage } from "@/lib/packagesStore";
import { parsePackageBody } from "@/lib/packageInput";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
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
    const pkg = await updatePackage(slug, parsed.input);
    revalidatePath("/");
    revalidatePath("/packages");
    revalidatePath(`/packages/${slug}`);
    return NextResponse.json({ package: pkg });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update package.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    await deletePackage(slug);
    revalidatePath("/");
    revalidatePath("/packages");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete package.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
