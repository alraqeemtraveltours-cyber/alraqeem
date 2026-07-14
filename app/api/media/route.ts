import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listMedia, uploadMedia, deleteMedia } from "@/lib/mediaStore";
import { verifySessionToken } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// The media list is only consumed by the admin image pickers, so require a
// valid admin session (mutations are already gated by middleware).
export async function GET() {
  const token = (await cookies()).get("admin_session")?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const media = await listMedia();
  return NextResponse.json({ media });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed." },
        { status: 400 }
      );
    }
    // Vercel caps request bodies at ~4.5 MB, so keep the limit under that.
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be under 4 MB." },
        { status: 400 }
      );
    }
    const bytes = await file.arrayBuffer();
    const item = await uploadMedia(file.name, bytes, file.type);
    return NextResponse.json({ media: item }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to upload image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { path } = await request.json();
    if (!path) {
      return NextResponse.json({ error: "Missing path." }, { status: 400 });
    }
    await deleteMedia(String(path));
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete image.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
