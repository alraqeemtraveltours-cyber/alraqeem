"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  haramAccessLabels,
  haramAccessTypes,
  type HaramAccessType,
} from "@/lib/calculatorItems";
import type { Hotel } from "@/lib/hotels";

const blank = {
  name: "",
  location: "Makkah",
  distanceFromHaram: "",
  haramAccess: "" as "" | HaramAccessType,
  starRating: "",
};

export default function HotelsManager({
  initial,
  configured,
}: {
  initial: Hotel[];
  configured: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState<"all" | "Makkah" | "Madina">("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return initial.filter((hotel) => {
      const matchesCity = cityFilter === "all" || hotel.location === cityFilter;
      const matchesQuery = !needle || hotel.name.toLowerCase().includes(needle);
      return matchesCity && matchesQuery;
    });
  }, [initial, query, cityFilter]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function reset() {
    setEditingId(null);
    setForm(blank);
    setError("");
    setFormOpen(false);
  }

  function openNew() {
    setEditingId(null);
    setForm(blank);
    setError("");
    setFormOpen(true);
  }

  function edit(hotel: Hotel) {
    setEditingId(hotel.id);
    setForm({
      name: hotel.name,
      location: hotel.location,
      distanceFromHaram:
        hotel.distanceFromHaram == null ? "" : String(hotel.distanceFromHaram),
      haramAccess: hotel.haramAccess ?? "",
      starRating: hotel.starRating == null ? "" : String(hotel.starRating),
    });
    setError("");
    setFormOpen(true);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Enter the hotel name.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const editing = editingId
        ? initial.find((hotel) => hotel.id === editingId)
        : undefined;
      const response = await fetch(
        editingId ? `/api/hotels/${editingId}` : "/api/hotels",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            location: form.location,
            distanceFromHaram: form.distanceFromHaram,
            haramAccess: form.haramAccess,
            starRating: form.starRating,
            sortOrder: editing ? editing.sortOrder : 0,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save hotel.");
      reset();
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to save hotel.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(hotel: Hotel) {
    if (deletingId) return;
    if (!confirm(`Delete “${hotel.name}”?`)) return;
    setDeletingId(hotel.id);
    try {
      const response = await fetch(`/api/hotels/${hotel.id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        alert(data.error || "Failed to delete hotel.");
        return;
      }
      if (editingId === hotel.id) reset();
      router.refresh();
    } catch {
      alert("Network error while deleting. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  const makkahCount = initial.filter((hotel) => hotel.location === "Makkah").length;
  const madinaCount = initial.length - makkahCount;

  return (
    <div className="min-w-0">
      {formOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !busy) reset();
          }}
        >
          <form
            onSubmit={save}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hotel-form-title"
            className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-black/5 bg-white shadow-2xl sm:rounded-3xl"
          >
            <div className={`px-6 py-5 ${editingId ? "bg-brand-orange" : "bg-brand-blue-deep"}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h1M14 7h1M9 11h1M14 11h1M10 21v-3h4v3" /></svg>
                  </span>
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest ${editingId ? "text-brand-blue-deep/70" : "text-brand-orange"}`}>
                      {editingId ? "Editing hotel" : "New hotel"}
                    </p>
                    <h2 id="hotel-form-title" className={`text-xl ${editingId ? "text-brand-blue-deep" : "text-white"}`}>
                      {editingId ? "Update hotel details" : "Add a hotel"}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  disabled={busy}
                  aria-label="Close form"
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition disabled:opacity-50 ${editingId ? "text-brand-blue-deep hover:bg-black/10" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </div>
            </div>

            <div className="space-y-5 p-6">
              {!configured && (
                <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
                  Connect Supabase and run the hotels migration before adding hotels.
                </p>
              )}
              <div>
                <label htmlFor="hotel-name">Hotel name <span className="text-red-600" aria-hidden="true">*</span></label>
                <input id="hotel-name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Rou Taiba" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hotel-city">Location <span className="text-red-600" aria-hidden="true">*</span></label>
                  <select id="hotel-city" value={form.location} onChange={(e) => update("location", e.target.value)}>
                    <option value="Makkah">Makkah</option>
                    <option value="Madina">Madina</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="hotel-distance">Distance from Haram (m)</label>
                  <input id="hotel-distance" type="number" min="0" step="1" inputMode="numeric" value={form.distanceFromHaram} onChange={(e) => update("distanceFromHaram", e.target.value)} placeholder="e.g. 350" />
                </div>
                <div>
                  <label htmlFor="hotel-stars">Star rating</label>
                  <select id="hotel-stars" value={form.starRating} onChange={(e) => update("starRating", e.target.value)}>
                    <option value="">Not set</option>
                    {[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} Star</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="hotel-access">Haram access</label>
                  <select id="hotel-access" value={form.haramAccess} onChange={(e) => update("haramAccess", e.target.value as "" | HaramAccessType)}>
                    <option value="">Not set</option>
                    {haramAccessTypes.map((access) => <option key={access} value={access}>{haramAccessLabels[access]}</option>)}
                  </select>
                </div>
              </div>

              <p className="rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-3 text-xs leading-relaxed text-slate-600">
                Room types, prices, and meal plans are managed in Calculator Prices — pick this hotel there and its details fill in automatically.
              </p>

              {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
              <div className="flex items-center justify-between gap-3 border-t border-black/5 pt-5">
                <button type="button" onClick={reset} disabled={busy} className="btn-outline">Cancel</button>
                <button type="submit" disabled={!configured || busy} className="btn-orange disabled:opacity-50">
                  {busy ? "Saving…" : editingId ? "Save Changes" : "Add Hotel"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="min-w-0">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl">Hotels</h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filtered.length} of {initial.length} hotels
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:w-72">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search hotels…" className="!pl-10" aria-label="Search hotels" />
              </div>
              <button type="button" onClick={openNew} className="btn-orange shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                Add Hotel
              </button>
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button type="button" onClick={() => setCityFilter("all")} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${cityFilter === "all" ? "bg-brand-blue-deep text-white" : "bg-paper text-slate-600 hover:bg-brand-blue-deep/10"}`}>
              All <span className="ml-1 opacity-60">{initial.length}</span>
            </button>
            <button type="button" onClick={() => setCityFilter("Makkah")} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${cityFilter === "Makkah" ? "bg-brand-blue-deep text-white" : "bg-paper text-slate-600 hover:bg-brand-blue-deep/10"}`}>
              Makkah <span className="ml-1 opacity-60">{makkahCount}</span>
            </button>
            <button type="button" onClick={() => setCityFilter("Madina")} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${cityFilter === "Madina" ? "bg-brand-blue-deep text-white" : "bg-paper text-slate-600 hover:bg-brand-blue-deep/10"}`}>
              Madina <span className="ml-1 opacity-60">{madinaCount}</span>
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((hotel) => (
            <article key={hotel.id} className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="absolute inset-y-0 left-0 w-1 bg-brand-orange" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-blue-deep/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-blue-deep">
                  {hotel.location}
                </span>
                {hotel.starRating != null && (
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                    {"★".repeat(hotel.starRating)}
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-lg text-brand-blue-deep">{hotel.name}</h3>
              <p className="mt-1 text-xs text-slate-500">
                {[
                  hotel.distanceFromHaram == null
                    ? ""
                    : `${hotel.distanceFromHaram} m from Haram`,
                  hotel.haramAccess ? haramAccessLabels[hotel.haramAccess] : "",
                ]
                  .filter(Boolean)
                  .join(" · ") || "Distance not set"}
              </p>
              <div className="mt-5 flex items-center justify-end gap-2 border-t border-black/5 pt-4">
                <button type="button" onClick={() => edit(hotel)} aria-label={`Edit ${hotel.name}`} title="Edit" className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue-deep/10 text-sm text-brand-blue-deep transition hover:bg-brand-blue-deep hover:text-white">
                  <FontAwesomeIcon icon={faPen} className="h-3.5 w-3.5" />
                </button>
                <button type="button" onClick={() => remove(hotel)} disabled={!configured || deletingId === hotel.id} aria-label={`Delete ${hotel.name}`} title="Delete" className="flex h-9 w-9 items-center justify-center rounded-lg text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-40">
                  <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-paper text-slate-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h1M14 7h1M9 11h1M14 11h1M10 21v-3h4v3" /></svg>
            </div>
            <h3 className="mt-4 text-lg">No hotels yet</h3>
            <p className="mt-1 text-sm text-slate-500">
              {initial.length === 0
                ? "Run the hotels migration in Supabase, then add your first hotel."
                : "Try another search or city."}
            </p>
            {initial.length > 0 && (
              <button type="button" onClick={() => { setQuery(""); setCityFilter("all"); }} className="btn-outline mt-5 !py-2 text-sm">Clear Filters</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
