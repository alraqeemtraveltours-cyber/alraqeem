import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteInquiry } from "@/lib/inquiriesStore";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deleteInquiry(id);
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete inquiry.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
