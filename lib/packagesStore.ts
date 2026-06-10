import "server-only";
import {
  getReadClient,
  getAdminClient,
  isSupabaseConfigured,
  PACKAGES_TABLE,
} from "@/lib/supabase";
import {
  seedPackages,
  type TravelPackage,
  type Category,
} from "@/lib/packages";

// Shape of a row in the Supabase `packages` table.
type Row = {
  slug: string;
  title: string;
  category: Category;
  duration: string;
  price: number | null;
  featured: boolean | null;
  highlights: string[] | null;
  description: string;
  image: string | null;
  sort_order: number | null;
};

function rowToPackage(r: Row): TravelPackage {
  return {
    slug: r.slug,
    title: r.title,
    category: r.category,
    duration: r.duration,
    price: r.price,
    featured: r.featured ?? false,
    highlights: r.highlights ?? [],
    description: r.description,
    image: r.image ?? undefined,
  };
}

/** All packages. Falls back to seed data when Supabase isn't configured. */
export async function getPackages(): Promise<TravelPackage[]> {
  const supabase = getReadClient();
  if (!supabase) return seedPackages;

  const { data, error } = await supabase
    .from(PACKAGES_TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("title", { ascending: true });

  if (error || !data) {
    console.error("[packages] read failed, using seed:", error?.message);
    return seedPackages;
  }
  return (data as Row[]).map(rowToPackage);
}

export async function getPackage(
  slug: string
): Promise<TravelPackage | undefined> {
  const all = await getPackages();
  return all.find((p) => p.slug === slug);
}

export async function getFeatured(limit = 4): Promise<TravelPackage[]> {
  const all = await getPackages();
  return all.filter((p) => p.featured).slice(0, limit);
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export type PackageInput = Omit<TravelPackage, "slug"> & { slug?: string };

/** Insert a new package. Requires the service-role client. */
export async function addPackage(input: PackageInput): Promise<TravelPackage> {
  const supabase = getAdminClient();
  if (!supabase) {
    throw new Error("Supabase admin is not configured. See supabase/schema.sql and .env.local.example.");
  }
  const slug = input.slug?.trim() || slugify(input.title);
  const row = {
    slug,
    title: input.title,
    category: input.category,
    duration: input.duration,
    price: input.price,
    featured: input.featured ?? false,
    highlights: input.highlights ?? [],
    description: input.description,
    image: input.image ?? null,
  };
  const { data, error } = await supabase
    .from(PACKAGES_TABLE)
    .insert(row)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowToPackage(data as Row);
}

/** Delete a package by slug. Requires the service-role client. */
export async function deletePackage(slug: string): Promise<void> {
  const supabase = getAdminClient();
  if (!supabase) {
    throw new Error("Supabase admin is not configured.");
  }
  const { error } = await supabase
    .from(PACKAGES_TABLE)
    .delete()
    .eq("slug", slug);
  if (error) throw new Error(error.message);
}

export { isSupabaseConfigured };
