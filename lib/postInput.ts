import type { Post } from "@/lib/posts";

export type PostInput = Omit<Post, "slug"> & { slug?: string };

type ParseResult = { input: PostInput } | { error: string };

export function parsePostBody(body: Record<string, unknown>): ParseResult {
  const title = String(body.title ?? "").trim();
  const excerpt = String(body.excerpt ?? "").trim();
  const content = String(body.content ?? "").trim();
  const image = body.image ? String(body.image).trim() : undefined;

  if (!title) return { error: "Title is required." };
  if (!content) return { error: "Content is required." };

  const dateRaw = body.date ? String(body.date).trim() : "";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(dateRaw)
    ? dateRaw
    : new Date().toISOString().slice(0, 10);

  const rawReadMinutes = Number(body.readMinutes);
  const readMinutes =
    Number.isFinite(rawReadMinutes) && rawReadMinutes > 0
      ? Math.round(rawReadMinutes)
      : estimateReadMinutes(content);

  return {
    input: {
      title,
      excerpt: excerpt || stripHtml(content).slice(0, 160),
      content,
      image,
      date,
      readMinutes,
    },
  };
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function estimateReadMinutes(html: string) {
  const words = stripHtml(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
