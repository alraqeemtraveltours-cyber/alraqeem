"use client";

import { useMemo, useState } from "react";
import {
  calculatorCategories,
  categoryLabels,
  formatCalculatorPrice,
  formatPkrPrice,
  roomTypeLabels,
  unitLabels,
  type CalculatorItem,
} from "@/lib/calculatorItems";
import { waHref } from "@/lib/settings";

type ItemValues = {
  selected: boolean;
  quantity: number;
  checkIn: string;
  checkOut: string;
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
  const [values, setValues] = useState<Record<string, ItemValues>>({});

  function valueFor(id: string): ItemValues {
    return values[id] ?? {
      selected: false,
      quantity: 1,
      checkIn: "",
      checkOut: "",
    };
  }

  function patch(id: string, next: Partial<ItemValues>) {
    setValues((current) => ({
      ...current,
      [id]: { ...valueFor(id), ...next },
    }));
  }

  function itemTotal(item: CalculatorItem) {
    const value = valueFor(item.id);
    if (!value.selected) return 0;
    const quantity = positive(value.quantity);
    const nightDates = nightsBetween(value.checkIn, value.checkOut);
    const nightlySubtotal =
      nightDates.length > 0
        ? nightDates.reduce((sum, date) => {
            const datedRate = item.dateRates.find(
              (rate) => date >= rate.startDate && date <= rate.endDate
            );
            return sum + (datedRate?.price ?? item.price);
          }, 0)
        : item.price;
    if (item.unit === "per_person") return item.price * positive(travelers);
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
    const value = valueFor(item.id);
    const dates = nightsBetween(value.checkIn, value.checkOut);
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
  const total = useMemo(
    () => items.reduce((sum, item) => sum + itemTotal(item), 0),
    // values is the selection state; travelers changes all per-person totals.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, values, travelers]
  );
  const totalPkr = total * sarToPkr;

  const message = [
    "Assalam o Alaikum, I built this package estimate:",
    `Travelers: ${positive(travelers)}`,
    ...selected.map((item) => {
      const value = valueFor(item.id);
      const nights = nightsBetween(value.checkIn, value.checkOut).length;
      const details =
        item.unit === "per_room_night"
          ? ` (${positive(value.quantity)} room(s), ${nights || 1} night(s)${value.checkIn && value.checkOut ? `, ${value.checkIn} to ${value.checkOut}` : ""})`
          : item.unit === "per_person_night"
            ? ` (${nights || 1} night(s)${value.checkIn && value.checkOut ? `, ${value.checkIn} to ${value.checkOut}` : ""})`
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
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-8">
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-card">
          <label htmlFor="calculator-travelers" className="text-base font-semibold text-brand-blue-deep">
            Number of travelers
          </label>
          <p className="mt-1 text-sm text-slate-500">Used automatically for all per-person prices.</p>
          <input
            id="calculator-travelers"
            type="number"
            min="1"
            value={travelers}
            onChange={(event) => setTravelers(positive(Number(event.target.value)))}
            className="mt-4 max-w-40"
          />
        </div>

        {calculatorCategories.map((category) => {
          const group = items.filter((item) => item.category === category);
          if (group.length === 0) return null;
          return (
            <section key={category}>
              <p className="eyebrow">Choose your options</p>
              <h2 className="mt-1 text-2xl">{categoryLabels[category]}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {group.map((item) => {
                  const value = valueFor(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border bg-white p-5 transition ${
                        value.selected
                          ? "border-brand-orange shadow-card ring-1 ring-brand-orange/30"
                          : "border-black/5 hover:border-brand-blue/20"
                      }`}
                    >
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={value.selected}
                          onChange={(event) => patch(item.id, { selected: event.target.checked })}
                          className="mt-1 h-5 w-5 shrink-0"
                        />
                        <span className="min-w-0">
                          <span className="block font-semibold text-brand-blue-deep">{item.name}</span>
                          {item.location && <span className="mt-0.5 block text-xs text-slate-500">{item.location}</span>}
                          {item.roomType && (
                            <span className="mt-2 inline-flex rounded-full bg-brand-orange/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-orange-dark">
                              {roomTypeLabels[item.roomType]} room
                            </span>
                          )}
                        </span>
                      </label>
                      {item.description && <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>}
                      <div className="mt-4 flex items-end justify-between gap-3 border-t border-black/5 pt-4">
                        <div>
                          <p className="font-display text-lg text-brand-orange-dark">{formatCalculatorPrice(item.price)}</p>
                          <p className="text-xs text-slate-500">{unitLabels[item.unit]}</p>
                          {item.dateRates.length > 0 && (
                            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-brand-orange-dark">
                              Date-based rates available
                            </p>
                          )}
                        </div>
                        {value.selected && (
                          <p className="text-right text-sm font-semibold text-brand-blue-deep">
                            {formatCalculatorPrice(itemTotal(item))}
                          </p>
                        )}
                      </div>
                      {value.selected && (item.unit === "per_room_night" || item.unit === "per_person_night" || item.unit === "per_vehicle" || item.unit === "per_trip") && (
                        <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-paper p-3">
                          {(item.unit === "per_room_night" || item.unit === "per_vehicle" || item.unit === "per_trip") && (
                            <div className={item.unit === "per_room_night" ? "" : "col-span-2"}>
                              <label className="text-xs" htmlFor={`quantity-${item.id}`}>
                                {item.unit === "per_room_night" ? "Rooms" : item.unit === "per_vehicle" ? "Vehicles" : "Trips"}
                              </label>
                              <input id={`quantity-${item.id}`} type="number" min="1" value={value.quantity} onChange={(event) => patch(item.id, { quantity: positive(Number(event.target.value)) })} />
                            </div>
                          )}
                          {(item.unit === "per_room_night" || item.unit === "per_person_night") && (
                            <>
                              <div className="col-span-2 sm:col-span-1">
                                <label className="text-xs" htmlFor={`check-in-${item.id}`}>Check-in</label>
                                <input id={`check-in-${item.id}`} type="date" value={value.checkIn} onChange={(event) => patch(item.id, { checkIn: event.target.value })} />
                              </div>
                              <div className="col-span-2 sm:col-span-1">
                                <label className="text-xs" htmlFor={`check-out-${item.id}`}>Check-out</label>
                                <input id={`check-out-${item.id}`} type="date" min={value.checkIn || undefined} value={value.checkOut} onChange={(event) => patch(item.id, { checkOut: event.target.value })} />
                              </div>
                              {value.checkIn && value.checkOut && value.checkOut <= value.checkIn && (
                                <p className="col-span-2 text-xs font-medium text-red-600">Check-out must be after check-in.</p>
                              )}
                              {rateBreakdown(item).length > 0 && (
                                <div className="col-span-2 rounded-lg bg-white px-3 py-2 text-xs text-slate-600">
                                  {rateBreakdown(item).map((part) => (
                                    <p key={part.price} className="flex justify-between gap-3">
                                      <span>{part.nights} night{part.nights === 1 ? "" : "s"} × {formatCalculatorPrice(part.price)}</span>
                                      <span className="font-semibold">{formatCalculatorPrice(part.nights * part.price)}</span>
                                    </p>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
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

      <aside className="rounded-3xl bg-brand-blue-deep p-6 text-white shadow-lift lg:sticky lg:top-28">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Your estimate</p>
        <h2 className="mt-2 text-2xl text-white">Package summary</h2>
        <div className="mt-5 space-y-3 border-y border-white/10 py-5">
          {selected.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 text-sm">
              <span className="text-slate-300">{item.name}</span>
              <span className="shrink-0 font-semibold">{formatCalculatorPrice(itemTotal(item))}</span>
            </div>
          ))}
          {selected.length === 0 && <p className="text-sm text-slate-400">Select options to build your package.</p>}
        </div>
        <div className="mt-5 flex items-end justify-between gap-4">
          <span className="text-sm text-slate-300">Total in SAR</span>
          <span className="font-display text-2xl text-brand-orange">{formatCalculatorPrice(total)}</span>
        </div>
        <div className="mt-3 rounded-xl bg-white/10 p-4">
          <div className="flex items-end justify-between gap-4">
            <span className="text-sm text-slate-300">Converted total</span>
            <span className="font-display text-2xl text-white">{formatPkrPrice(totalPkr)}</span>
          </div>
          <p className="mt-2 text-right text-[11px] text-slate-400">
            1 SAR = PKR {sarToPkr.toLocaleString("en-PK", { maximumFractionDigits: 4 })}
          </p>
        </div>
        <a
          href={waHref(whatsapp, message)}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn-orange mt-6 w-full ${selected.length === 0 ? "pointer-events-none opacity-50" : ""}`}
          aria-disabled={selected.length === 0}
        >
          Confirm quote on WhatsApp
        </a>
        <p className="mt-4 text-xs leading-relaxed text-slate-400">
          This is an estimate. Airfare, hotel availability, taxes, and exchange rates can change the final confirmed price.
        </p>
      </aside>
    </div>
  );
}
