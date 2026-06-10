"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type TravelPackage } from "@/lib/packages";
import RichTextEditor from "@/components/admin/RichTextEditor";

type MediaItem = { name: string; path: string; url: string };

export default function PackageForm({
  mode,
  initial,
  configured,
  categoryOptions,
}: {
  mode: "create" | "edit";
  initial?: TravelPackage;
  configured: boolean;
  categoryOptions: string[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    category: initial?.category ?? categoryOptions[0] ?? "",
    duration: initial?.duration ?? "",
    price: initial?.price != null ? String(initial.price) : "",
    image: initial?.image ?? "",
    expiryDate: initial?.expiryDate ?? "",
    description: initial?.description ?? "",
    featured: initial?.featured ?? false,
  });
  const [highlights, setHighlights] = useState<string[]>(
    initial?.highlights?.length ? initial.highlights : [""]
  );
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

  function setHighlight(i: number, v: string) {
    setHighlights((h) => h.map((x, idx) => (idx === i ? v : x)));
  }
  function addHighlight() {
    setHighlights((h) => [...h, ""]);
  }
  function removeHighlight(i: number) {
    setHighlights((h) => (h.length === 1 ? [""] : h.filter((_, idx) => idx !== i)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url =
        mode === "create"
          ? "/api/packages"
          : `/api/packages/${initial!.slug}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          highlights: highlights.map((h) => h.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      router.push("/admin/packages");
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
          Supabase isn&apos;t connected, so saving is disabled. Add your keys and
          run <code>supabase/schema.sql</code> first.
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="duration">Duration</label>
          <input
            id="duration"
            value={form.duration}
            onChange={(e) => update("duration", e.target.value)}
            placeholder="e.g. 15 Days"
            required
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="price">Price (PKR)</label>
          <input
            id="price"
            type="number"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="Empty = 'Contact for price'"
          />
        </div>
        <div>
          <label htmlFor="expiryDate">Offer expiry date</label>
          <input
            id="expiryDate"
            type="date"
            value={form.expiryDate ?? ""}
            onChange={(e) => update("expiryDate", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="image">Image URL</label>
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
        {form.image && (
          <img
            src={form.image}
            alt=""
            className="mt-3 h-28 w-44 rounded-lg object-cover ring-1 ring-black/10"
          />
        )}
        {showPicker && (
          <div className="mt-3 grid max-h-56 grid-cols-3 gap-2 overflow-y-auto rounded-xl border border-black/10 bg-white p-3 sm:grid-cols-4">
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
        <label>Description</label>
        <RichTextEditor
          value={form.description}
          onChange={(html) => update("description", html)}
        />
      </div>

      <div>
        <label>Highlights</label>
        <div className="space-y-2">
          {highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={h}
                onChange={(e) => setHighlight(i, e.target.value)}
                placeholder={`Highlight ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeHighlight(i)}
                aria-label="Remove highlight"
                className="shrink-0 rounded-xl border border-slate-300 px-3 text-slate-500 transition hover:border-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addHighlight}
          className="mt-2 text-sm font-semibold text-brand-blue hover:underline"
        >
          + Add highlight
        </button>
      </div>

      <label className="flex items-center gap-2 !text-sm">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) => update("featured", e.target.checked)}
          className="!w-auto"
        />
        Feature on homepage
      </label>

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!configured || saving}
          className="btn-orange disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : mode === "create" ? "Add Package" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/packages")}
          className="btn-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
