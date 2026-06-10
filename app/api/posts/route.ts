import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getPosts, addPost } from "@/lib/postsStore";
import { parsePostBody } from "@/lib/postInput";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await getPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = parsePostBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  try {
    const post = await addPost(parsed.input);
    revalidatePath("/");
    revalidatePath("/blog");
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add post.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
