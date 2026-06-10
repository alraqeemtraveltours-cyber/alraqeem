import { NextResponse } from "next/server";
import { listMedia, uploadMedia, deleteMedia } from "@/lib/mediaStore";

export const dynamic = "force-dynamic";

export async function GET() {
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
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be under 8 MB." },
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
