"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice, type TravelPackage } from "@/lib/packages";

const CATEGORIES = ["Umrah & Hajj", "International"] as const;

const empty = {
  title: "",
  category: "Umrah & Hajj",
  duration: "",
  price: "",
  image: "",
  description: "",
  highlights: "",
  featured: false,
};

export default function AdminClient({
  configured,
  initialPackages,
}: {
  configured: boolean;
  initialPackages: TravelPackage[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({ ...empty });
  const [status, setStatus] = useState<{
    type: "idle" | "saving" | "error" | "success";
    message?: string;
  }>({ type: "idle" });
  const [busySlug, setBusySlug] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "saving" });
    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add package.");
      setStatus({ type: "success", message: `Added "${data.package.title}".` });
      setForm({ ...empty });
      router.refresh();
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusySlug(slug);
    try {
      const res = await fetch(`/api/packages/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    } finally {
      setBusySlug(null);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Form */}
      <div>
        <h2 className="text-2xl">Add a package</h2>
        <div className="gold-rule mt-4" />

        {!configured && (
          <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
            <strong>Supabase isn't connected yet.</strong> You can preview the
            form, but saving is disabled until you add your Supabase keys to{" "}
            <code>.env.local</code> and run <code>supabase/schema.sql</code>.
            See the setup notes below.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Premium Umrah Package"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="price">Price (PKR)</label>
              <input
                id="price"
                type="number"
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="Leave empty for 'Contact for price'"
              />
            </div>
            <div>
              <label htmlFor="image">Image URL (optional)</label>
              <input
                id="image"
                value={form.image}
                onChange={(e) => update("image", e.target.value)}
                placeholder="https://…"
              />
            </div>
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
              placeholder={"Return airfare included\nHotels near Haram\nVisa processing"}
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

          {status.type === "error" && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {status.message}
            </p>
          )}
          {status.type === "success" && (
            <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={!configured || status.type === "saving"}
            className="btn-orange w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status.type === "saving" ? "Saving…" : "Add Package"}
          </button>
        </form>
      </div>

      {/* List */}
      <div>
        <h2 className="text-2xl">
          Current packages{" "}
          <span className="text-base font-normal text-slate-500">
            ({initialPackages.length})
          </span>
        </h2>
        <div className="gold-rule mt-4" />
        <ul className="mt-6 space-y-3">
          {initialPackages.map((p) => (
            <li
              key={p.slug}
              className="flex items-center justify-between gap-4 rounded-xl border border-black/5 bg-white p-4 shadow-card"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-brand-blue-deep">
                  {p.title}
                  {p.featured && (
                    <span className="ml-2 rounded-full bg-brand-orange/20 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-orange-dark">
                      Featured
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  {p.category} · {p.duration} · {formatPrice(p.price)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(p.slug, p.title)}
                disabled={!configured || busySlug === p.slug}
                className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-40"
              >
                {busySlug === p.slug ? "…" : "Delete"}
              </button>
            </li>
          ))}
        </ul>
        {!configured && (
          <p className="mt-4 text-xs text-slate-500">
            Showing seed data. Once Supabase is connected, this list reflects
            your database and delete will work.
          </p>
        )}
      </div>
    </div>
  );
}
