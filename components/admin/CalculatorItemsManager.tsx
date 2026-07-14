"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import SearchSelect from "@/components/admin/SearchSelect";
import {
  calculatorCategories,
  calculatorUnits,
  categoryLabels,
  formatCalculatorPrice,
  haramAccessLabels,
  haramAccessTypes,
  roomTypeLabels,
  roomTypes,
  unitLabels,
  type CalculatorCategory,
  type CalculatorItem,
  type HaramAccessType,
  type RoomType,
  type CalculatorUnit,
} from "@/lib/calculatorItems";
import type { Hotel } from "@/lib/hotels";

const blank = {
  name: "",
  category: "hotel" as CalculatorCategory,
  roomType: "sharing" as RoomType,
  location: "Makkah",
  distanceFromHaram: "",
  haramAccess: "walk" as HaramAccessType,
  starRating: "",
  mealPlan: "Room only",
  price: "",
  dateRates: [] as { startDate: string; endDate: string; price: string }[],
  unit: "per_room_night" as CalculatorUnit,
  description: "",
  active: true,
  sortOrder: "0",
};

export default function CalculatorItemsManager({
  initial,
  hotels = [],
  configured,
}: {
  initial: CalculatorItem[];
  hotels?: Hotel[];
  configured: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | CalculatorCategory>("all");

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  // Hotels from the /admin/hotels directory, keyed by lowercase name, for auto-fill.
  const knownHotels = useMemo(() => {
    const map = new Map<string, Hotel>();
    for (const hotel of hotels) {
      map.set(hotel.name.trim().toLowerCase(), hotel);
    }
    return map;
  }, [hotels]);

  function changeHotelName(name: string) {
    const known = knownHotels.get(name.trim().toLowerCase());
    setForm((current) => ({
      ...current,
      name,
      ...(known
        ? {
            location: known.location,
            distanceFromHaram:
              known.distanceFromHaram == null
                ? current.distanceFromHaram
                : String(known.distanceFromHaram),
            haramAccess: known.haramAccess ?? current.haramAccess,
            starRating:
              known.starRating == null
                ? current.starRating
                : String(known.starRating),
          }
        : {}),
    }));
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
      distanceFromHaram:
        item.distanceFromHaram == null ? "" : String(item.distanceFromHaram),
      haramAccess: item.haramAccess ?? "walk",
      starRating: item.starRating == null ? "" : String(item.starRating),
      mealPlan: item.mealPlan || "Room only",
      price: String(item.price),
      dateRates: item.dateRates.map((rate) => ({
        startDate: rate.startDate,
        endDate: rate.endDate,
        price: String(rate.price),
      })),
      unit: item.unit,
      description: item.description,
      active: item.active,
      sortOrder: String(item.sortOrder),
    });
    setStep(1);
    setFormOpen(true);
  }

  function reset() {
    setEditingId(null);
    setForm(blank);
    setError("");
    setStep(1);
    setFormOpen(false);
  }

  function openNew() {
    setEditingId(null);
    setForm(blank);
    setError("");
    setStep(1);
    setFormOpen(true);
  }

  function addDateRate() {
    setForm((current) => ({
      ...current,
      dateRates: [
        ...current.dateRates,
        { startDate: "", endDate: "", price: "" },
      ],
    }));
  }

  function updateDateRate(
    index: number,
    key: "startDate" | "endDate" | "price",
    value: string
  ) {
    setForm((current) => ({
      ...current,
      dateRates: current.dateRates.map((rate, rateIndex) =>
        rateIndex === index ? { ...rate, [key]: value } : rate
      ),
    }));
    setError("");
  }

  function removeDateRate(index: number) {
    setForm((current) => ({
      ...current,
      dateRates: current.dateRates.filter((_, rateIndex) => rateIndex !== index),
    }));
  }

  function nextStep() {
    setError("");
    if (step === 1 && !form.name.trim()) {
      setError("Enter an item name before continuing.");
      return;
    }
    if (
      step === 1 &&
      form.category === "hotel" &&
      (form.distanceFromHaram === "" ||
        form.starRating === "" ||
        !form.roomType ||
        !form.haramAccess ||
        !form.mealPlan)
    ) {
      setError("Complete every field in Hotel Details before continuing.");
      return;
    }
    if (step === 2) {
      if (form.price === "" || Number(form.price) < 0) {
        setError("Enter a valid regular price before continuing.");
        return;
      }
      const invalidPeriod = form.dateRates.some(
        (rate) =>
          !rate.startDate ||
          !rate.endDate ||
          rate.endDate < rate.startDate ||
          rate.price === "" ||
          Number(rate.price) < 0
      );
      if (invalidPeriod) {
        setError("Complete every date-price period with valid dates and price.");
        return;
      }
      const sortedPeriods = [...form.dateRates].sort((a, b) =>
        a.startDate.localeCompare(b.startDate)
      );
      const overlaps = sortedPeriods.some(
        (rate, index) =>
          index > 0 && rate.startDate <= sortedPeriods[index - 1].endDate
      );
      if (overlaps) {
        setError("Date-price periods cannot overlap.");
        return;
      }
    }
    setStep((current) => Math.min(3, current + 1));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (step < 3) {
      nextStep();
      return;
    }
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
        aria-labelledby="calculator-form-title"
        className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-black/5 bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className={`px-6 py-5 ${editingId ? "bg-brand-orange" : "bg-brand-blue-deep"}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              </span>
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest ${editingId ? "text-brand-blue-deep/70" : "text-brand-orange"}`}>
                  {editingId ? "Editing item" : "New calculator item"}
                </p>
                <h2 id="calculator-form-title" className={`text-xl ${editingId ? "text-brand-blue-deep" : "text-white"}`}>
                  {editingId ? "Update price details" : "Add a new price"}
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

        <div className="border-b border-black/5 bg-white px-6 py-4">
          <div className="flex items-center">
            {[
              { number: 1, label: "Item details" },
              { number: 2, label: "Pricing" },
              { number: 3, label: "Publish" },
            ].map((item, index) => (
              <div key={item.number} className={`flex items-center ${index < 2 ? "flex-1" : ""}`}>
                <button
                  type="button"
                  onClick={() => item.number < step && setStep(item.number)}
                  disabled={item.number > step}
                  className="flex shrink-0 items-center gap-2 disabled:cursor-default"
                >
                  <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${step >= item.number ? "bg-brand-blue-deep text-white" : "bg-slate-100 text-slate-400"}`}>
                    {step > item.number ? "✓" : item.number}
                  </span>
                  <span className={`hidden text-xs font-semibold sm:block ${step >= item.number ? "text-brand-blue-deep" : "text-slate-400"}`}>
                    {item.label}
                  </span>
                </button>
                {index < 2 && <div className={`mx-3 h-px flex-1 ${step > item.number ? "bg-brand-blue-deep" : "bg-slate-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5 p-6">
          {!configured && (
            <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
              Connect Supabase and run the calculator migration before adding prices.
            </p>
          )}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <p className="eyebrow">Step 1 of 3</p>
                <h3 className="mt-1 text-xl">What are you adding?</h3>
                <p className="mt-1 text-sm text-slate-500">Choose the service and its customer-facing details.</p>
              </div>
              <div>
                <label htmlFor="calc-name">Item name <span className="text-red-600" aria-hidden="true">*</span></label>
                {form.category === "hotel" ? (
                  <>
                    <SearchSelect
                      id="calc-name"
                      value={form.name}
                      onChange={changeHotelName}
                      options={hotels.map((hotel) => hotel.name)}
                      placeholder="Search hotels from the Hotels page…"
                    />
                    <p className="mt-1 text-[11px] text-slate-500">
                      Pick a hotel from the Hotels page to auto-fill its city, distance, stars, and access.
                    </p>
                  </>
                ) : (
                  <input id="calc-name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Item name" autoFocus />
                )}
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
                <div className="rounded-2xl bg-paper p-4">
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Hotel details</p>
                    <p className="mt-1 text-xs text-slate-500">All hotel details are required.</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="calc-room-type">Room type <span className="text-red-600" aria-hidden="true">*</span></label>
                      <select id="calc-room-type" value={form.roomType} onChange={(e) => update("roomType", e.target.value as RoomType)} required>
                        {roomTypes.map((roomType) => <option key={roomType} value={roomType}>{roomTypeLabels[roomType]}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="calc-distance">Distance from Haram <span className="text-red-600" aria-hidden="true">*</span></label>
                      <input id="calc-distance" type="number" min="0" step="1" inputMode="numeric" value={form.distanceFromHaram} onChange={(e) => update("distanceFromHaram", e.target.value)} placeholder="e.g. 350" required />
                    </div>
                    <div>
                      <label htmlFor="calc-haram-access">Haram access <span className="text-red-600" aria-hidden="true">*</span></label>
                      <select id="calc-haram-access" value={form.haramAccess} onChange={(e) => update("haramAccess", e.target.value as HaramAccessType)} required>
                        {haramAccessTypes.map((access) => <option key={access} value={access}>{haramAccessLabels[access]}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="calc-stars">Star rating <span className="text-red-600" aria-hidden="true">*</span></label>
                      <select id="calc-stars" value={form.starRating} onChange={(e) => update("starRating", e.target.value)} required>
                        <option value="" disabled>Select rating</option>
                        {[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating} Star</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="calc-meals">Meal plan <span className="text-red-600" aria-hidden="true">*</span></label>
                      <select id="calc-meals" value={form.mealPlan} onChange={(e) => update("mealPlan", e.target.value)} required>
                        <option>Room only</option>
                        <option>Breakfast included</option>
                        <option>Half board</option>
                        <option>Full board</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="eyebrow">Step 2 of 3</p>
                <h3 className="mt-1 text-xl">Set the pricing</h3>
                <p className="mt-1 text-sm text-slate-500">Add the regular rate and any date-based price changes.</p>
              </div>
          <div className="rounded-2xl bg-paper p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Pricing rule</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="calc-price">Price (SAR) <span className="text-red-600" aria-hidden="true">*</span></label>
                <input id="calc-price" type="number" min="0" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="0" required />
              </div>
              <div>
                <label htmlFor="calc-unit">Charge by <span className="text-red-600" aria-hidden="true">*</span></label>
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
          {(form.category === "hotel" || form.unit === "per_room_night" || form.unit === "per_person_night") && (
            <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-blue-deep">Date-based prices</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    Optional. Matching dates override the regular price above.
                  </p>
                </div>
                <button type="button" onClick={addDateRate} className="shrink-0 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-brand-blue-deep shadow-sm hover:bg-paper">
                  + Add period
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {form.dateRates.map((rate, index) => (
                  <div key={index} className="grid grid-cols-2 gap-3 rounded-xl bg-white p-3 shadow-sm">
                    <div>
                      <label htmlFor={`rate-from-${index}`} className="text-xs">From <span className="text-red-600" aria-hidden="true">*</span></label>
                      <input id={`rate-from-${index}`} type="date" value={rate.startDate} onChange={(e) => updateDateRate(index, "startDate", e.target.value)} required />
                    </div>
                    <div>
                      <label htmlFor={`rate-to-${index}`} className="text-xs">To <span className="text-red-600" aria-hidden="true">*</span></label>
                      <input id={`rate-to-${index}`} type="date" value={rate.endDate} onChange={(e) => updateDateRate(index, "endDate", e.target.value)} required />
                    </div>
                    <div>
                      <label htmlFor={`rate-price-${index}`} className="text-xs">Price per night (SAR) <span className="text-red-600" aria-hidden="true">*</span></label>
                      <input id={`rate-price-${index}`} type="number" min="0" value={rate.price} onChange={(e) => updateDateRate(index, "price", e.target.value)} required />
                    </div>
                    <div className="flex items-end justify-end">
                      <button type="button" onClick={() => removeDateRate(index)} className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50">Remove</button>
                    </div>
                  </div>
                ))}
                {form.dateRates.length === 0 && (
                  <p className="rounded-xl border border-dashed border-brand-orange/30 px-3 py-4 text-center text-xs text-slate-500">
                    The regular price applies to every date until you add a period.
                  </p>
                )}
              </div>
            </div>
          )}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <p className="eyebrow">Step 3 of 3</p>
                <h3 className="mt-1 text-xl">Review and publish</h3>
                <p className="mt-1 text-sm text-slate-500">Add supporting details and choose whether customers can see it now.</p>
              </div>
              <div className="rounded-2xl bg-paper p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-brand-blue-deep">{form.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{categoryLabels[form.category]}{form.location ? ` · ${form.location}` : ""}</p>
                  </div>
                  <p className="shrink-0 font-display text-lg text-brand-orange-dark">
                    {form.price === "" ? "No price" : formatCalculatorPrice(Number(form.price))}
                  </p>
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
            </div>
          )}
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="flex items-center justify-between gap-3 border-t border-black/5 pt-5">
            {step > 1 ? (
              <button type="button" onClick={() => { setError(""); setStep((current) => current - 1); }} className="btn-outline">
                ← Back
              </button>
            ) : (
              <button type="button" onClick={reset} className="btn-outline">Cancel</button>
            )}
            {step < 3 ? (
              <button type="button" onClick={nextStep} className="btn-orange">
                Continue →
              </button>
            ) : (
              <button type="submit" disabled={!configured || busy} className="btn-orange disabled:opacity-50">
                {busy ? "Saving…" : editingId ? "Save Changes" : "Add Price"}
              </button>
            )}
          </div>
        </div>
      </form>
        </div>
      )}

      <div className="min-w-0">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-card sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl">Price inventory</h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filtered.length} of {initial.length} items
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 sm:w-72">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search prices…" className="!pl-10" aria-label="Search calculator prices" />
              </div>
              <button type="button" onClick={openNew} className="btn-orange shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                Add New Price
              </button>
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
                  {item.category === "hotel" && (item.distanceFromHaram || item.starRating || item.mealPlan) && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      {[item.distanceFromHaram == null ? "" : `${item.distanceFromHaram} metres`, item.haramAccess ? haramAccessLabels[item.haramAccess] : "", item.starRating ? `${item.starRating} star` : "", item.mealPlan].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {item.dateRates.length > 0 && (
                    <p className="mt-2 text-[11px] font-semibold text-brand-orange-dark">
                      {item.dateRates.length} date price period{item.dateRates.length === 1 ? "" : "s"}
                    </p>
                  )}
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
