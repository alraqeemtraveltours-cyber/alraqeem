import { NextResponse } from "next/server";
import { getPackages, addPackage } from "@/lib/packagesStore";
import type { Category } from "@/lib/packages";

export const dynamic = "force-dynamic";

export async function GET() {
  const packages = await getPackages();
  return NextResponse.json({ packages });
}

const CATEGORIES: Category[] = ["Umrah & Hajj", "International"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const title = String(body.title ?? "").trim();
  const category = String(body.category ?? "") as Category;
  const duration = String(body.duration ?? "").trim();
  const description = String(body.description ?? "").trim();

  if (!title || !duration || !description) {
    return NextResponse.json(
      { error: "Title, duration and description are required." },
      { status: 400 }
    );
  }
  if (!CATEGORIES.includes(category)) {
    return NextResponse.json(
      { error: `Category must be one of: ${CATEGORIES.join(", ")}` },
      { status: 400 }
    );
  }

  // price: empty / null -> "Contact for price"
  const rawPrice = body.price;
  const price =
    rawPrice === null || rawPrice === "" || rawPrice === undefined
      ? null
      : Number(rawPrice);
  if (price !== null && Number.isNaN(price)) {
    return NextResponse.json({ error: "Price must be a number." }, { status: 400 });
  }

  // highlights: accept array or newline-separated string
  let highlights: string[] = [];
  if (Array.isArray(body.highlights)) {
    highlights = body.highlights.map((h) => String(h).trim()).filter(Boolean);
  } else if (typeof body.highlights === "string") {
    highlights = body.highlights
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean);
  }

  const image = body.image ? String(body.image).trim() : undefined;
  const featured = Boolean(body.featured);

  try {
    const pkg = await addPackage({
      title,
      category,
      duration,
      price,
      description,
      highlights,
      image,
      featured,
    });
    return NextResponse.json({ package: pkg }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add package.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
