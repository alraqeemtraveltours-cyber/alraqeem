"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  calculatorCategories,
  calculatorUnits,
  categoryLabels,
  formatCalculatorPrice,
  roomTypeLabels,
  roomTypes,
  unitLabels,
  type CalculatorCategory,
  type CalculatorItem,
  type RoomType,
  type CalculatorUnit,
} from "@/lib/calculatorItems";

const blank = {
  name: "",
  category: "hotel" as CalculatorCategory,
  roomType: "sharing" as RoomType,
  location: "Makkah",
  price: "",
  unit: "per_room_night" as CalculatorUnit,
  description: "",
  active: true,
  sortOrder: "0",
};

export default function CalculatorItemsManager({
  initial,
  configured,
}: {
  initial: CalculatorItem[];
  configured: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | CalculatorCategory>("all");

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  function changeCategory(category: CalculatorCategory) {
    setForm((current) => ({
      ...current,
      category,
      location:
        category === "visa"
          ? ""
          : category === "hotel" && !["Makkah", "Madina"].includes(current.location)
            ? "Makkah"
            : current.location,
      unit:
        category === "visa" &&
        (current.unit === "per_person_night" || current.unit === "per_room_night")
          ? "per_person"
          : current.unit,
    }));
    setError("");
  }

  function edit(item: CalculatorItem) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      roomType: item.roomType ?? "sharing",
      location:
        item.category === "hotel"
          ? item.location === "Madina" || item.location === "Madinah"
            ? "Madina"
            : "Makkah"
          : item.location,
      price: String(item.price),
      unit: item.unit,
      description: item.description,
      active: item.active,
      sortOrder: String(item.sortOrder),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reset() {
    setEditingId(null);
    setForm(blank);
    setError("");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        editingId ? `/api/calculator-items/${editingId}` : "/api/calculator-items",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save item.");
      reset();
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to save item.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: CalculatorItem) {
    if (!confirm(`Delete “${item.name}”?`)) return;
    const response = await fetch(`/api/calculator-items/${item.id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.error || "Failed to delete item.");
      return;
    }
    if (editingId === item.id) reset();
    router.refresh();
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return initial.filter((item) => {
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesQuery =
        !needle ||
        item.name.toLowerCase().includes(needle) ||
        item.location.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [initial, query, categoryFilter]);

  return (
    <div className="grid items-start gap-8 xl:grid-cols-[390px_minmax(0,1fr)]">
      <form
        onSubmit={save}
        className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-card xl:sticky xl:top-8"
      >
        <div className={`px-6 py-5 ${editingId ? "bg-brand-orange" : "bg-brand-blue-deep"}`}>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
            </span>
            <div>
              <p className={`text-xs font-bold uppercase tracking-widest ${editingId ? "text-brand-blue-deep/70" : "text-brand-orange"}`}>
                {editingId ? "Editing item" : "New calculator item"}
              </p>
              <h2 className={`text-xl ${editingId ? "text-brand-blue-deep" : "text-white"}`}>
                {editingId ? "Update price details" : "Add a new price"}
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6">
          {!configured && (
            <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              Connect Supabase and run the calculator migration before adding prices.
            </p>
          )}
          <div>
            <label htmlFor="calc-name">Item name</label>
            <input id="calc-name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Makkah 4-star hotel" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="calc-category">Category</label>
              <select id="calc-category" value={form.category} onChange={(e) => changeCategory(e.target.value as CalculatorCategory)}>
                {calculatorCategories.map((category) => <option key={category} value={category}>{categoryLabels[category]}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="calc-location">Location</label>
              {form.category === "visa" ? (
                <div className="flex min-h-[46px] items-center rounded-xl border border-dashed border-slate-300 bg-paper px-3 text-xs text-slate-500">
                  Not required for visas
                </div>
              ) : form.category === "hotel" ? (
                <select
                  id="calc-location"
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                >
                  <option value="Makkah">Makkah</option>
                  <option value="Madina">Madina</option>
                </select>
              ) : (
                <input id="calc-location" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Islamabad → Jeddah" />
              )}
            </div>
          </div>
          {form.category === "hotel" && (
            <div>
              <label htmlFor="calc-room-type">Room type</label>
              <select
                id="calc-room-type"
                value={form.roomType}
                onChange={(e) => update("roomType", e.target.value as RoomType)}
              >
                {roomTypes.map((roomType) => (
                  <option key={roomType} value={roomType}>
                    {roomTypeLabels[roomType]}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="rounded-2xl bg-paper p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Pricing rule</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="calc-price">Price (PKR)</label>
                <input id="calc-price" type="number" min="0" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="0" required />
              </div>
              <div>
                <label htmlFor="calc-unit">Charge by</label>
                <select id="calc-unit" value={form.unit} onChange={(e) => update("unit", e.target.value as CalculatorUnit)}>
                  {calculatorUnits
                    .filter(
                      (unit) =>
                        form.category !== "visa" ||
                        (unit !== "per_person_night" && unit !== "per_room_night")
                    )
                    .map((unit) => <option key={unit} value={unit}>{unitLabels[unit]}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="calc-description">Customer description</label>
            <textarea id="calc-description" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Room type, inclusions, restrictions…" />
          </div>
          <div className="grid grid-cols-[110px_1fr] gap-4">
            <div>
              <label htmlFor="calc-order">Order</label>
              <input id="calc-order" type="number" value={form.sortOrder} onChange={(e) => update("sortOrder", e.target.value)} />
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-3 self-end rounded-xl border border-black/5 bg-white px-4 py-3 shadow-sm">
              <span>
                <span className="block text-sm font-semibold text-brand-blue-deep">Published</span>
                <span className="block text-[11px] text-slate-500">Visible to customers</span>
              </span>
              <input type="checkbox" checked={form.active} onChange={(e) => update("active", e.target.checked)} className="h-5 w-5" />
            </label>
          </div>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <button type="submit" disabled={!configured || busy} className="btn-orange disabled:opacity-50">
              {busy ? "Saving…" : editingId ? "Save Changes" : "Add Price"}
            </button>
            {editingId ? (
              <button type="button" onClick={reset} className="btn-outline">Cancel Edit</button>
            ) : (
              <button type="button" onClick={() => setForm(blank)} className="btn-outline">Clear</button>
            )}
          </div>
        </div>
      </form>

      <div className="min-w-0">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl">Price inventory</h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filtered.length} of {initial.length} items
              </p>
            </div>
            <div className="relative min-w-0 lg:w-72">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search prices…" className="!pl-10" aria-label="Search calculator prices" />
            </div>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button type="button" onClick={() => setCategoryFilter("all")} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${categoryFilter === "all" ? "bg-brand-blue-deep text-white" : "bg-paper text-slate-600 hover:bg-brand-blue-deep/10"}`}>
              All <span className="ml-1 opacity-60">{initial.length}</span>
            </button>
            {calculatorCategories.map((category) => {
              const count = initial.filter((item) => item.category === category).length;
              if (count === 0) return null;
              return (
                <button key={category} type="button" onClick={() => setCategoryFilter(category)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${categoryFilter === category ? "bg-brand-blue-deep text-white" : "bg-paper text-slate-600 hover:bg-brand-blue-deep/10"}`}>
                  {categoryLabels[category]} <span className="ml-1 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-4 2xl:grid-cols-2">
          {filtered.map((item) => (
            <article key={item.id} className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift ${item.active ? "border-black/5" : "border-dashed border-slate-300 opacity-75"}`}>
              <div className={`absolute inset-y-0 left-0 w-1 ${item.active ? "bg-brand-orange" : "bg-slate-300"}`} />
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-blue-deep/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-blue-deep">
                      {categoryLabels[item.category]}
                    </span>
                    <span className={`h-2 w-2 rounded-full ${item.active ? "bg-emerald-500" : "bg-slate-400"}`} title={item.active ? "Published" : "Hidden"} />
                  </div>
                  <h3 className="mt-3 truncate text-lg text-brand-blue-deep">{item.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.location || "No location"}
                    {item.roomType ? ` · ${roomTypeLabels[item.roomType]} room` : ""}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-xl text-brand-orange-dark">{formatCalculatorPrice(item.price)}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{unitLabels[item.unit]}</p>
                </div>
              </div>
              {item.description && <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">{item.description}</p>}
              <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
                <span className="text-[11px] font-medium text-slate-400">Sort order: {item.sortOrder}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => edit(item)} className="rounded-lg bg-brand-blue-deep/10 px-3 py-2 text-xs font-semibold text-brand-blue-deep transition hover:bg-brand-blue-deep hover:text-white">Edit</button>
                  <button type="button" onClick={() => remove(item)} disabled={!configured} className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-40">Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-paper text-slate-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 className="mt-4 text-lg">No matching prices</h3>
            <p className="mt-1 text-sm text-slate-500">Try another search or category.</p>
            <button type="button" onClick={() => { setQuery(""); setCategoryFilter("all"); }} className="btn-outline mt-5 !py-2 text-sm">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
