"use client";

import { useMemo, useState } from "react";
import {
  calculatorCategories,
  categoryLabels,
  formatCalculatorPrice,
  formatPkrPrice,
  haramAccessLabels,
  roomTypeLabels,
  unitLabels,
  type CalculatorItem,
} from "@/lib/calculatorItems";
import { waHref } from "@/lib/settings";

type ItemValues = {
  selected: boolean;
  quantity: number;
};

function positive(value: number, fallback = 1) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut || checkOut <= checkIn) return [] as string[];
  const nights: string[] = [];
  const cursor = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  while (cursor < end) {
    nights.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return nights;
}

export default function PackageCalculator({
  items,
  whatsapp,
  sarToPkr,
}: {
  items: CalculatorItem[];
  whatsapp: string;
  sarToPkr: number;
}) {
  const [travelers, setTravelers] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [values, setValues] = useState<Record<string, ItemValues>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [flowError, setFlowError] = useState("");

  function valueFor(id: string): ItemValues {
    return values[id] ?? {
      selected: false,
      quantity: 1,
    };
  }

  function patch(id: string, next: Partial<ItemValues>) {
    setValues((current) => ({
      ...current,
      [id]: { ...valueFor(id), ...next },
    }));
  }

  function selectHotel(item: CalculatorItem) {
    setValues((current) => {
      const next = { ...current };
      for (const hotel of items) {
        if (hotel.category === "hotel" && hotel.location === item.location) {
          next[hotel.id] = {
            selected: hotel.id === item.id,
            quantity: next[hotel.id]?.quantity ?? 1,
          };
        }
      }
      return next;
    });
    setFlowError("");
  }

  function itemTotal(item: CalculatorItem) {
    const value = valueFor(item.id);
    if (!value.selected) return 0;
    const quantity = positive(value.quantity);
    const nightDates = nightsBetween(checkIn, checkOut);
    const nightlySubtotal =
      nightDates.length > 0
        ? nightDates.reduce((sum, date) => {
            const datedRate = item.dateRates.find(
              (rate) => date >= rate.startDate && date <= rate.endDate
            );
            return sum + (datedRate?.price ?? item.price);
          }, 0)
        : item.price;
    if (item.unit === "per_person") {
      return item.category === "hotel"
        ? nightlySubtotal * positive(travelers)
        : item.price * positive(travelers);
    }
    if (item.unit === "per_person_night") {
      return nightlySubtotal * positive(travelers);
    }
    if (item.unit === "per_room_night") return nightlySubtotal * quantity;
    if (item.unit === "per_vehicle" || item.unit === "per_trip") {
      return item.price * quantity;
    }
    return item.price;
  }

  function rateBreakdown(item: CalculatorItem) {
    const dates = nightsBetween(checkIn, checkOut);
    const counts = new Map<number, number>();
    for (const date of dates) {
      const rate =
        item.dateRates.find(
          (period) => date >= period.startDate && date <= period.endDate
        )?.price ?? item.price;
      counts.set(rate, (counts.get(rate) ?? 0) + 1);
    }
    return Array.from(counts, ([price, nights]) => ({ price, nights }));
  }

  const selected = items.filter((item) => valueFor(item.id).selected);
  const hasSelectedHotel = selected.some((item) => item.category === "hotel");
  const hotelDatesValid = nightsBetween(checkIn, checkOut).length > 0;
  const canConfirm =
    selected.length > 0 && (!hasSelectedHotel || hotelDatesValid);
  const hotelLocations = ["Makkah", "Madina"].filter((location) =>
    items.some((item) => item.category === "hotel" && item.location === location)
  );
  const serviceItems = items.filter((item) => item.category !== "hotel");
  const steps = [
    { id: "travel", label: "Travel details" },
    ...hotelLocations.map((location) => ({
      id: `hotel-${location}`,
      label: `${location} hotel`,
      location,
    })),
    ...(serviceItems.length > 0 ? [{ id: "services", label: "Services" }] : []),
    { id: "summary", label: "Summary" },
  ];
  const currentStep = steps[stepIndex] ?? steps[0];

  function goNext() {
    setFlowError("");
    if (currentStep.id === "travel" && !hotelDatesValid) {
      setFlowError("Select valid check-in and check-out dates to continue.");
      return;
    }
    if (
      "location" in currentStep &&
      !selected.some(
        (item) =>
          item.category === "hotel" && item.location === currentStep.location
      )
    ) {
      setFlowError(`Select one hotel in ${currentStep.location} to continue.`);
      return;
    }
    setStepIndex((current) => Math.min(steps.length - 1, current + 1));
  }

  function goBack() {
    setFlowError("");
    setStepIndex((current) => Math.max(0, current - 1));
  }
  const total = useMemo(
    () => items.reduce((sum, item) => sum + itemTotal(item), 0),
    // values is the selection state; travelers changes all per-person totals.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, values, travelers, checkIn, checkOut]
  );
  const totalPkr = total * sarToPkr;

  const message = [
    "Assalam o Alaikum, I built this package estimate:",
    `Travelers: ${positive(travelers)}`,
    ...(checkIn && checkOut ? [`Hotel dates: ${checkIn} to ${checkOut}`] : []),
    ...selected.map((item) => {
      const value = valueFor(item.id);
      const nights = nightsBetween(checkIn, checkOut).length;
      const usesNights =
        item.category === "hotel" ||
        item.unit === "per_room_night" ||
        item.unit === "per_person_night";
      const details =
        item.unit === "per_room_night"
          ? ` (${positive(value.quantity)} room(s), ${nights || 1} night(s))`
          : usesNights
            ? ` (${nights || 1} night(s))`
            : item.unit === "per_vehicle"
              ? ` (${positive(value.quantity)} vehicle(s))`
              : item.unit === "per_trip"
                ? ` (${positive(value.quantity)} trip(s))`
                : "";
      const room = item.roomType ? ` [${roomTypeLabels[item.roomType]} room]` : "";
      return `- ${item.name}${room}${details}: ${formatCalculatorPrice(itemTotal(item))}`;
    }),
    `Estimated total: ${formatCalculatorPrice(total)}`,
    `Converted total: ${formatPkrPrice(totalPkr)} (1 SAR = PKR ${sarToPkr})`,
    "Please confirm availability and the final quote.",
  ].join("\n");

  return (
    <div className={`mx-auto ${stepIndex >= 1 ? "max-w-7xl" : "max-w-5xl"}`}>
      <div className="mb-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max items-center justify-center gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => index < stepIndex && setStepIndex(index)}
                disabled={index > stepIndex}
                className="flex items-center gap-2 disabled:cursor-default"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${index <= stepIndex ? "bg-brand-blue-deep text-white" : "bg-white text-slate-400"}`}>
                  {index < stepIndex ? "✓" : index + 1}
                </span>
                <span className={`text-xs font-semibold ${index <= stepIndex ? "text-brand-blue-deep" : "text-slate-400"}`}>
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && <div className={`mx-3 h-px w-8 sm:w-14 ${index < stepIndex ? "bg-brand-blue-deep" : "bg-slate-300"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className={stepIndex >= 1 ? "grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]" : ""}>
      <div className="min-w-0 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-lift">
        <div className="border-b border-black/5 bg-brand-blue-deep px-6 py-6 text-white sm:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">
            Step {stepIndex + 1} of {steps.length}
          </p>
          <h2 className="mt-2 text-2xl text-white sm:text-3xl">{currentStep.label}</h2>
        </div>

        <div className="p-6 sm:p-8">
          {currentStep.id === "travel" && (
            <div>
              <h3 className="text-xl">Tell us about your trip</h3>
              <p className="mt-2 text-sm text-slate-500">
                Your travelers and dates are used for every hotel and per-person service.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="calculator-travelers">How many travelers?</label>
                  <input id="calculator-travelers" type="number" min="1" value={travelers} onChange={(event) => setTravelers(positive(Number(event.target.value)))} />
                </div>
                <div>
                  <label htmlFor="calculator-check-in">Check-in</label>
                  <input id="calculator-check-in" type="date" value={checkIn} onChange={(event) => { setCheckIn(event.target.value); setFlowError(""); }} />
                </div>
                <div>
                  <label htmlFor="calculator-check-out">Check-out</label>
                  <input id="calculator-check-out" type="date" min={checkIn || undefined} value={checkOut} onChange={(event) => { setCheckOut(event.target.value); setFlowError(""); }} />
                </div>
              </div>
              {hotelDatesValid && (
                <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                  {nightsBetween(checkIn, checkOut).length} night{nightsBetween(checkIn, checkOut).length === 1 ? "" : "s"} selected
                </p>
              )}
            </div>
          )}

          {"location" in currentStep && (
            <div>
              <h3 className="text-xl">Select one hotel in {currentStep.location}</h3>
              <p className="mt-2 text-sm text-slate-500">
                Choose the hotel and room-sharing option that suits your group. Pricing is shown in the final summary.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items
                  .filter((item) => item.category === "hotel" && item.location === currentStep.location)
                  .map((item) => {
                    const value = valueFor(item.id);
                    return (
                      <label key={item.id} className={`cursor-pointer rounded-2xl border p-5 transition ${value.selected ? "border-brand-orange bg-brand-orange/5 shadow-card ring-1 ring-brand-orange/30" : "border-black/10 hover:border-brand-blue/30"}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-display text-lg text-brand-blue-deep">{item.name}</h4>
                            {item.roomType && (
                              <span className="mt-2 inline-flex rounded-full bg-brand-blue-deep/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-blue-deep">
                                {roomTypeLabels[item.roomType]} room
                              </span>
                            )}
                          </div>
                          <input type="radio" name={`hotel-${currentStep.location}`} checked={value.selected} onChange={() => selectHotel(item)} className="mt-1 h-5 w-5 shrink-0" />
                        </div>
                        <div className="mt-4 grid gap-2 rounded-xl bg-paper p-3 text-xs text-slate-600">
                          <p className="flex items-center justify-between gap-3">
                            <span>Distance from Haram</span>
                            <span className="font-semibold text-brand-blue-deep">
                              {item.distanceFromHaram == null
                                ? "Confirm with our team"
                                : `${item.distanceFromHaram.toLocaleString("en-PK")} metres`}
                            </span>
                          </p>
                          <p className="flex items-center justify-between gap-3">
                            <span>Hotel rating</span>
                            <span className="font-semibold text-brand-blue-deep">
                              {item.starRating ? `${item.starRating} Star` : "Not specified"}
                            </span>
                          </p>
                          <p className="flex items-center justify-between gap-3">
                            <span>Haram access</span>
                            <span className="font-semibold text-brand-blue-deep">
                              {item.haramAccess ? haramAccessLabels[item.haramAccess] : "Confirm with our team"}
                            </span>
                          </p>
                          <p className="flex items-center justify-between gap-3">
                            <span>Meal plan</span>
                            <span className="font-semibold text-brand-blue-deep">
                              {item.mealPlan || "Room only"}
                            </span>
                          </p>
                        </div>
                        {item.description && <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.description}</p>}
                        {value.selected && item.unit === "per_room_night" && (
                          <div className="mt-4 border-t border-black/5 pt-4">
                            <label htmlFor={`rooms-${item.id}`} className="text-xs">Number of rooms</label>
                            <input id={`rooms-${item.id}`} type="number" min="1" value={value.quantity} onChange={(event) => patch(item.id, { quantity: positive(Number(event.target.value)) })} onClick={(event) => event.stopPropagation()} />
                          </div>
                        )}
                      </label>
                    );
                  })}
              </div>
            </div>
          )}

          {currentStep.id === "services" && (
            <div>
              <h3 className="text-xl">Add services to your package</h3>
              <p className="mt-2 text-sm text-slate-500">These options are optional. Select as many as you need.</p>
              <div className="mt-6 space-y-8">
                {calculatorCategories.filter((category) => category !== "hotel").map((category) => {
                  const group = serviceItems.filter((item) => item.category === category);
                  if (group.length === 0) return null;
                  return (
                    <section key={category}>
                      <h4 className="font-display text-lg text-brand-blue-deep">{categoryLabels[category]}</h4>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {group.map((item) => {
                          const value = valueFor(item.id);
                          return (
                            <div key={item.id} className={`rounded-2xl border p-4 ${value.selected ? "border-brand-orange bg-brand-orange/5" : "border-black/10"}`}>
                              <label className="flex cursor-pointer items-start gap-3">
                                <input type="checkbox" checked={value.selected} onChange={(event) => patch(item.id, { selected: event.target.checked })} className="mt-1 h-5 w-5" />
                                <span className="flex-1">
                                  <span className="block font-semibold text-brand-blue-deep">{item.name}</span>
                                  <span className="mt-1 block text-sm text-brand-orange-dark">{formatCalculatorPrice(item.price)} · {unitLabels[item.unit]}</span>
                                </span>
                              </label>
                              {value.selected && (item.unit === "per_vehicle" || item.unit === "per_trip") && (
                                <div className="mt-3">
                                  <label htmlFor={`service-quantity-${item.id}`} className="text-xs">{item.unit === "per_vehicle" ? "Vehicles" : "Trips"}</label>
                                  <input id={`service-quantity-${item.id}`} type="number" min="1" value={value.quantity} onChange={(event) => patch(item.id, { quantity: positive(Number(event.target.value)) })} />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep.id === "summary" && (
            <div>
                <h3 className="text-xl">Review your package</h3>
                <p className="mt-2 text-sm text-slate-500">{travelers} traveler{travelers === 1 ? "" : "s"} · {checkIn} to {checkOut}</p>
                <div className="mt-5 divide-y divide-black/5 rounded-2xl border border-black/5">
                  {selected.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex justify-between gap-4">
                        <div>
                          <p className="font-semibold text-brand-blue-deep">{item.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{categoryLabels[item.category]}{item.roomType ? ` · ${roomTypeLabels[item.roomType]} room` : ""}</p>
                        </div>
                        <p className="shrink-0 font-semibold text-brand-blue-deep">{formatCalculatorPrice(itemTotal(item))}</p>
                      </div>
                      {item.category === "hotel" && rateBreakdown(item).length > 1 && (
                        <div className="mt-3 rounded-lg bg-paper p-3 text-xs text-slate-600">
                          {rateBreakdown(item).map((part) => <p key={part.price}>{part.nights} night{part.nights === 1 ? "" : "s"} × {formatCalculatorPrice(part.price)}</p>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
            </div>
          )}

          {flowError && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{flowError}</p>}

          <div className="mt-8 flex items-center justify-between border-t border-black/5 pt-6">
            <button type="button" onClick={goBack} disabled={stepIndex === 0} className="btn-outline disabled:invisible">← Back</button>
            {currentStep.id !== "summary" && <button type="button" onClick={goNext} className="btn-orange">Continue →</button>}
          </div>
        </div>
      </div>

      {stepIndex >= 1 && (
        <aside className="rounded-3xl bg-brand-blue-deep p-6 text-white shadow-lift lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Live summary</p>
          <h3 className="mt-2 text-2xl text-white">Your package</h3>

          <div className="mt-5 space-y-3 rounded-xl bg-white/10 p-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-300">Travelers</span>
              <span className="font-semibold">{positive(travelers)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-300">Dates</span>
              <span className="text-right text-xs font-semibold">{checkIn && checkOut ? `${checkIn} – ${checkOut}` : "Not selected"}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-300">Nights</span>
              <span className="font-semibold">{nightsBetween(checkIn, checkOut).length}</span>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Selected items</p>
            {selected.length > 0 ? (
              <div className="mt-2 divide-y divide-white/10">
                {selected.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-white">{item.name}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{categoryLabels[item.category]}{item.roomType ? ` · ${roomTypeLabels[item.roomType]}` : ""}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-brand-orange">{formatCalculatorPrice(itemTotal(item))}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">Your selections will appear here.</p>
            )}
          </div>

          <div className="mt-5 border-t border-white/10 pt-5">
            <p className="text-sm text-slate-300">Total in SAR</p>
            <p className="mt-1 font-display text-3xl text-brand-orange">{formatCalculatorPrice(total)}</p>
            <div className="mt-4 rounded-xl bg-white/10 p-4">
              <p className="text-xs text-slate-300">Converted total</p>
              <p className="mt-1 font-display text-2xl text-white">{formatPkrPrice(totalPkr)}</p>
              <p className="mt-2 text-xs text-slate-400">1 SAR = PKR {sarToPkr}</p>
            </div>
          </div>

          {currentStep.id === "summary" && (
            <a href={waHref(whatsapp, message)} target="_blank" rel="noopener noreferrer" className={`btn-orange mt-5 w-full ${!canConfirm ? "pointer-events-none opacity-50" : ""}`} aria-disabled={!canConfirm}>
              Confirm on WhatsApp
            </a>
          )}
        </aside>
      )}
      </div>
    </div>
  );
}
