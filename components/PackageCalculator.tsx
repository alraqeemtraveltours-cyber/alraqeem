"use client";

import { useMemo, useState } from "react";
import {
  calculatorCategories,
  categoryLabels,
  formatCalculatorPrice,
  formatPkrPrice,
  haramAccessLabels,
  normalizeCity,
  roomTypeLabels,
  roomTypes,
  unitLabels,
  type CalculatorItem,
  type RoomType,
} from "@/lib/calculatorItems";
import { waHref } from "@/lib/settings";

type ItemValues = {
  selected: boolean;
  quantity: number;
};

function positive(value: number, fallback = 1) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

// Cap the stay so a mistyped nights value can't spin a huge loop or produce
// absurd totals.
const MAX_NIGHTS = 366;

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
  const [month, setMonth] = useState("");
  const [roomType, setRoomType] = useState<"" | RoomType>("");
  const [cityNights, setCityNights] = useState<Record<string, number>>({});
  const [values, setValues] = useState<Record<string, ItemValues>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [flowError, setFlowError] = useState("");

  // Customers pick a travel month plus nights per city (asked on each hotel
  // step). Seasonal hotel rates still need concrete dates, so stays are
  // anchored to the 1st of the chosen month.
  function nightDates(count: number) {
    if (!month || count < 1) return [] as string[];
    const dates: string[] = [];
    const cursor = new Date(`${month}-01T00:00:00Z`);
    const capped = Math.min(count, MAX_NIGHTS);
    while (dates.length < capped) {
      dates.push(cursor.toISOString().slice(0, 10));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return dates;
  }

  const monthOptions = useMemo(() => {
    const cursor = new Date();
    cursor.setDate(1);
    return Array.from({ length: 12 }, () => {
      const value = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;
      const label = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });
      cursor.setMonth(cursor.getMonth() + 1);
      return { value, label };
    });
  }, []);
  const monthLabel =
    monthOptions.find((option) => option.value === month)?.label ?? "";

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

  // Changing the preferred room type deselects hotels that no longer match,
  // so a stale pick can't linger in the price.
  function changeRoomType(next: "" | RoomType) {
    setRoomType(next);
    setFlowError("");
    if (!next) return;
    setValues((current) => {
      const updated = { ...current };
      for (const hotel of items) {
        if (
          hotel.category === "hotel" &&
          hotel.roomType &&
          hotel.roomType !== next &&
          updated[hotel.id]?.selected
        ) {
          updated[hotel.id] = { ...updated[hotel.id], selected: false };
        }
      }
      return updated;
    });
  }

  function selectHotel(item: CalculatorItem) {
    setValues((current) => {
      const next = { ...current };
      for (const hotel of items) {
        if (
          hotel.category === "hotel" &&
          normalizeCity(hotel.location) === normalizeCity(item.location)
        ) {
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

  function nightsFor(item: CalculatorItem) {
    if (item.category === "hotel") {
      return cityNights[normalizeCity(item.location)] ?? 0;
    }
    // Non-hotel per-night services span the whole trip.
    return totalNights;
  }

  function itemTotal(item: CalculatorItem) {
    const value = valueFor(item.id);
    if (!value.selected) return 0;
    const quantity = positive(value.quantity);
    const stayDates = nightDates(nightsFor(item));
    const nightlySubtotal =
      stayDates.length > 0
        ? stayDates.reduce((sum, date) => {
            const datedRate = item.dateRates.find(
              (rate) => date >= rate.startDate && date <= rate.endDate
            );
            return sum + (datedRate?.price ?? item.price);
          }, 0)
        : item.price;
    if (item.unit === "per_person") {
      // Per person is a whole-stay charge — not multiplied by nights, even
      // for hotels. Only the "…_night" units multiply across nights.
      return item.price * positive(travelers);
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
    const dates = nightDates(nightsFor(item));
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

  function ratePartTotal(item: CalculatorItem, price: number, nights: number) {
    const value = valueFor(item.id);
    if (item.unit === "per_room_night") {
      return price * nights * positive(value.quantity);
    }
    if (
      item.category === "hotel" &&
      (item.unit === "per_person" || item.unit === "per_person_night")
    ) {
      return price * nights * positive(travelers);
    }
    return price * nights;
  }

  const selected = items.filter((item) => valueFor(item.id).selected);
  const hasSelectedHotel = selected.some((item) => item.category === "hotel");
  const monthSelected = month !== "";
  const selectedHotelsReady = selected
    .filter((item) => item.category === "hotel")
    .every((item) => (cityNights[normalizeCity(item.location)] ?? 0) >= 1);
  const canConfirm =
    selected.length > 0 &&
    (!hasSelectedHotel || (monthSelected && selectedHotelsReady));
  // Only ask for a travel month when the catalogue has date-driven items.
  const needsMonth = items.some(
    (item) =>
      item.category === "hotel" ||
      item.unit === "per_room_night" ||
      item.unit === "per_person_night"
  );
  const hotelLocations = (["Makkah", "Madina"] as const).filter((location) =>
    items.some(
      (item) =>
        item.category === "hotel" && normalizeCity(item.location) === location
    )
  );
  const totalNights = hotelLocations.reduce(
    (sum, location) => sum + (cityNights[location] ?? 0),
    0
  );
  const nightsSummary = hotelLocations
    .filter((location) => (cityNights[location] ?? 0) > 0)
    .map(
      (location) =>
        `${location}: ${cityNights[location]} night${cityNights[location] === 1 ? "" : "s"}`
    )
    .join(" · ");
  // Room types that actually exist in the hotel catalogue, in canonical order.
  const availableRoomTypes = roomTypes.filter((type) =>
    items.some((item) => item.category === "hotel" && item.roomType === type)
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
  // Hotels for the current city, filtered by the preferred room type. If
  // nothing matches that room type, fall back to showing every hotel.
  const cityHotels =
    "location" in currentStep
      ? items.filter(
          (item) =>
            item.category === "hotel" &&
            normalizeCity(item.location) === currentStep.location
        )
      : [];
  const matchingHotels = roomType
    ? cityHotels.filter((item) => item.roomType === roomType)
    : cityHotels;
  const hotelsToShow = matchingHotels.length > 0 ? matchingHotels : cityHotels;

  function goNext() {
    setFlowError("");
    if (currentStep.id === "travel" && needsMonth && !monthSelected) {
      setFlowError("Select the month you want to travel to continue.");
      return;
    }
    if ("location" in currentStep) {
      if (
        !selected.some(
          (item) =>
            item.category === "hotel" &&
            normalizeCity(item.location) === currentStep.location
        )
      ) {
        setFlowError(`Select one hotel in ${currentStep.location} to continue.`);
        return;
      }
      if ((cityNights[currentStep.location] ?? 0) < 1) {
        setFlowError(
          `Enter how many nights you want to stay in ${currentStep.location}.`
        );
        return;
      }
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
    [items, values, travelers, month, cityNights]
  );
  const totalPkr = total * sarToPkr;

  const message = [
    "Assalam o Alaikum, I built this package estimate:",
    `Travelers: ${positive(travelers)}`,
    ...(month ? [`Travel month: ${monthLabel}`] : []),
    ...(roomType ? [`Preferred room type: ${roomTypeLabels[roomType]}`] : []),
    ...(nightsSummary ? [`Nights: ${nightsSummary}`] : []),
    ...selected.map((item) => {
      const value = valueFor(item.id);
      const nights = nightDates(nightsFor(item)).length;
      const usesNights =
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
                Your travelers, travel month and room type are used for every hotel and per-person service. You will choose the nights for each city along with your hotel.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="calculator-travelers">How many travelers?</label>
                  <input id="calculator-travelers" type="number" min="1" value={travelers} onChange={(event) => setTravelers(positive(Number(event.target.value)))} />
                </div>
                <div>
                  <label htmlFor="calculator-month">Which month do you want to go?</label>
                  <select id="calculator-month" value={month} onChange={(event) => { setMonth(event.target.value); setFlowError(""); }}>
                    <option value="">Select a month</option>
                    {monthOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                {availableRoomTypes.length > 0 && (
                  <div>
                    <label htmlFor="calculator-room-type">Room type</label>
                    <select id="calculator-room-type" value={roomType} onChange={(event) => changeRoomType(event.target.value as "" | RoomType)}>
                      <option value="">Any room type</option>
                      {availableRoomTypes.map((type) => (
                        <option key={type} value={type}>{roomTypeLabels[type]}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {"location" in currentStep && (
            <div>
              <h3 className="text-xl">Select one hotel in {currentStep.location}</h3>
              <p className="mt-2 text-sm text-slate-500">
                {roomType ? `Showing ${roomTypeLabels[roomType]} room options. ` : "Choose the hotel and room-sharing option that suits your group. "}
                Pricing is shown in the final summary.
              </p>
              <div className="mt-5 max-w-xs">
                <label htmlFor={`nights-${currentStep.location}`}>How many nights in {currentStep.location}?</label>
                <input
                  id={`nights-${currentStep.location}`}
                  type="number"
                  min="1"
                  placeholder="e.g. 7"
                  value={cityNights[currentStep.location] || ""}
                  onChange={(event) => {
                    const next = Math.floor(Number(event.target.value));
                    const location = currentStep.location;
                    setCityNights((current) => ({
                      ...current,
                      [location]: Number.isFinite(next) && next > 0 ? Math.min(next, MAX_NIGHTS) : 0,
                    }));
                    setFlowError("");
                  }}
                />
              </div>
              {roomType && matchingHotels.length === 0 && (
                <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                  No {roomTypeLabels[roomType]} rooms are available in {currentStep.location} right now — showing all room types instead.
                </p>
              )}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {hotelsToShow
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
                <p className="mt-2 text-sm text-slate-500">{travelers} traveler{travelers === 1 ? "" : "s"}{monthLabel ? ` · ${monthLabel}` : ""}{roomType ? ` · ${roomTypeLabels[roomType]} room` : ""}{nightsSummary ? ` · ${nightsSummary}` : ""}</p>
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
                      {item.category === "hotel" && (item.unit === "per_room_night" || item.unit === "per_person_night") && rateBreakdown(item).length > 1 && (
                        <div className="mt-3 space-y-1.5 rounded-lg bg-paper p-3 text-xs text-slate-600">
                          <p className="font-bold uppercase tracking-wide text-brand-blue-deep">Different nightly rates</p>
                          {rateBreakdown(item).map((part) => (
                            <p key={part.price} className="flex flex-wrap items-center justify-between gap-2">
                              <span>{part.nights} night{part.nights === 1 ? "" : "s"} × {formatCalculatorPrice(part.price)} per night</span>
                              <span className="font-semibold text-brand-blue-deep">{formatCalculatorPrice(ratePartTotal(item, part.price, part.nights))}</span>
                            </p>
                          ))}
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
              <span className="text-slate-300">Month</span>
              <span className="text-right text-xs font-semibold">{monthLabel || "Not selected"}</span>
            </div>
            {roomType && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300">Room type</span>
                <span className="text-right text-xs font-semibold">{roomTypeLabels[roomType]}</span>
              </div>
            )}
            {hotelLocations.map((location) => (
              <div key={location} className="flex items-center justify-between gap-3">
                <span className="text-slate-300">{location} nights</span>
                <span className="font-semibold">{cityNights[location] || "—"}</span>
              </div>
            ))}
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
                      {item.category === "hotel" && (item.unit === "per_room_night" || item.unit === "per_person_night") && rateBreakdown(item).length > 1 && (
                        <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                          {rateBreakdown(item).map((part) => (
                            <p key={part.price}>
                              {part.nights} night{part.nights === 1 ? "" : "s"} × {formatCalculatorPrice(part.price)} = {formatCalculatorPrice(ratePartTotal(item, part.price, part.nights))}
                            </p>
                          ))}
                        </div>
                      )}
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
