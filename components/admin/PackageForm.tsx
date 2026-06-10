"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { categories, type TravelPackage } from "@/lib/packages";

type MediaItem = { name: string; path: string; url: string };

export default function PackageForm({
  mode,
  initial,
  configured,
}: {
  mode: "create" | "edit";
  initial?: TravelPackage;
  configured: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    category: initial?.category ?? categories[0],
    duration: initial?.duration ?? "",
    price: initial?.price != null ? String(initial.price) : "",
    image: initial?.image ?? "",
    expiryDate: initial?.expiryDate ?? "",
    description: initial?.description ?? "",
    highlights: (initial?.highlights ?? []).join("\n"),
    featured: initial?.featured ?? false,
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
      const url =
        mode === "create"
          ? "/api/packages"
          : `/api/packages/${initial!.slug}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
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
            onChange={(e) => update("category", e.target.value as typeof form.category)}
          >
            {categories.map((c) => (
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
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="highlights">Highlights (one per line)</label>
        <textarea
          id="highlights"
          rows={5}
          value={form.highlights}
          onChange={(e) => update("highlights", e.target.value)}
        />
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
