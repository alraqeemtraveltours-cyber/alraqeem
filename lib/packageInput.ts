import { categories, type Category, type TravelPackage } from "@/lib/packages";

export type PackageInput = Omit<TravelPackage, "slug"> & { slug?: string };

type ParseResult = { input: PackageInput } | { error: string };

/** Validate and normalize an incoming package payload (POST/PUT). */
export function parsePackageBody(body: Record<string, unknown>): ParseResult {
  const title = String(body.title ?? "").trim();
  const category = String(body.category ?? "") as Category;
  const duration = String(body.duration ?? "").trim();
  const description = String(body.description ?? "").trim();

  if (!title || !duration || !description) {
    return { error: "Title, duration and description are required." };
  }
  if (!categories.includes(category)) {
    return { error: `Category must be one of: ${categories.join(", ")}` };
  }

  const rawPrice = body.price;
  const price =
    rawPrice === null || rawPrice === "" || rawPrice === undefined
      ? null
      : Number(rawPrice);
  if (price !== null && Number.isNaN(price)) {
    return { error: "Price must be a number." };
  }

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

  const expiryRaw = body.expiryDate ? String(body.expiryDate).trim() : "";
  const expiryDate = /^\d{4}-\d{2}-\d{2}$/.test(expiryRaw) ? expiryRaw : null;

  return {
    input: {
      title,
      category,
      duration,
      price,
      description,
      highlights,
      image,
      featured,
      expiryDate,
    },
  };
}
