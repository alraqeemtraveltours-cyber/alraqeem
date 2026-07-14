import "server-only";
import { getReadClient, getAdminClient } from "@/lib/supabase";
import { seedPosts, type Post } from "@/lib/posts";
import type { PostInput } from "@/lib/postInput";

const TABLE = "posts";

type Row = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  date: string;
  read_minutes: number | null;
};

function rowTo(r: Row): Post {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    content: r.content,
    image: r.image ?? undefined,
    date: r.date,
    readMinutes: r.read_minutes ?? 5,
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 70);
}

export async function getPosts(): Promise<Post[]> {
  const supabase = getReadClient();
  if (!supabase) return seedPosts;
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("date", { ascending: false });
  if (error || !data) return seedPosts;
  const dbPosts = (data as Row[]).map(rowTo);
  // Keep the starter guide posts available alongside any admin posts (unless an
  // admin post overrides the same slug), because internal links point at those
  // seed slugs — otherwise those links 404 the moment the first post is added.
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const merged = [...dbPosts, ...seedPosts.filter((p) => !dbSlugs.has(p.slug))];
  return merged.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((p) => p.slug === slug);
}

/**
 * Real DB posts only — no seed fallback. Used by the admin dashboard so it
 * never lists starter posts that don't exist as rows (and therefore can't be
 * edited or deleted). Public pages use getPosts(), which keeps the seeds.
 */
export async function getDbPosts(): Promise<Post[]> {
  const supabase = getReadClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("date", { ascending: false });
  if (error || !data) return [];
  return (data as Row[]).map(rowTo);
}

export async function getDbPost(slug: string): Promise<Post | undefined> {
  return (await getDbPosts()).find((p) => p.slug === slug);
}

function toRow(input: PostInput) {
  return {
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    image: input.image ?? null,
    date: input.date,
    read_minutes: input.readMinutes,
  };
}

export async function addPost(input: PostInput): Promise<Post> {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const slug = input.slug?.trim() || slugify(input.title);
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ slug, ...toRow(input) })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowTo(data as Row);
}

export async function updatePost(slug: string, input: PostInput): Promise<Post> {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { data, error } = await supabase
    .from(TABLE)
    .update(toRow(input))
    .eq("slug", slug)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return rowTo(data as Row);
}

export async function deletePost(slug: string): Promise<void> {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { error } = await supabase.from(TABLE).delete().eq("slug", slug);
  if (error) throw new Error(error.message);
}
