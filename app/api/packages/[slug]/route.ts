import { NextResponse } from "next/server";
import { deletePackage } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    await deletePackage(slug);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete package.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
