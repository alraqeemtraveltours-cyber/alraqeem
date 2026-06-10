"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Post } from "@/lib/posts";
import RichTextEditor from "@/components/admin/RichTextEditor";

type MediaItem = { name: string; path: string; url: string };

export default function PostForm({
  mode,
  initial,
  configured,
}: {
  mode: "create" | "edit";
  initial?: Post;
  configured: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    date: initial?.date ?? "",
    readMinutes: initial?.readMinutes ? String(initial.readMinutes) : "",
    image: initial?.image ?? "",
    content: initial?.content ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (showPicker && media.length === 0) {
      fetch("/api/media")
        .then((r) => r.json())
        .then((d) => setMedia(d.media ?? []))
        .catch(() => {});
    }
  }, [showPicker, media.length]);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = mode === "create" ? "/api/posts" : `/api/posts/${initial!.slug}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {!configured && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Supabase isn&apos;t connected, so saving is disabled.
        </div>
      )}

      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="excerpt">Excerpt (short summary)</label>
        <textarea
          id="excerpt"
          rows={2}
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          placeholder="Leave blank to auto-generate from the content."
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="readMinutes">Read time (minutes)</label>
          <input
            id="readMinutes"
            type="number"
            value={form.readMinutes}
            onChange={(e) => update("readMinutes", e.target.value)}
            placeholder="Auto if blank"
          />
        </div>
      </div>

      <div>
        <label htmlFor="image">Cover image URL (optional)</label>
        <div className="flex gap-2">
          <input
            id="image"
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="Paste a URL or pick from Media"
          />
          <button
            type="button"
            onClick={() => setShowPicker((s) => !s)}
            className="btn-outline shrink-0 !px-4 !py-2 text-sm"
          >
            Media
          </button>
        </div>
        {showPicker && (
          <div className="mt-3 grid max-h-56 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-black/10 bg-white p-3 sm:grid-cols-6">
            {media.length === 0 && (
              <p className="col-span-full text-sm text-slate-500">
                No images yet. Upload some on the Media page.
              </p>
            )}
            {media.map((m) => (
              <button
                key={m.path}
                type="button"
                onClick={() => {
                  update("image", m.url);
                  setShowPicker(false);
                }}
                className="overflow-hidden rounded-lg ring-1 ring-black/10 transition hover:ring-2 hover:ring-brand-orange"
              >
                <img src={m.url} alt={m.name} className="h-20 w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label>Content</label>
        <RichTextEditor
          value={form.content}
          onChange={(html) => update("content", html)}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!configured || saving}
          className="btn-orange disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : mode === "create" ? "Publish Post" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
