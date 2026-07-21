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
import {
  routeOptions,
  sectorLabel,
  sectorsForLeg,
  sharingVisaPrice,
  transportStyleLabels,
  transportStyles,
  type StayCity,
  type TransportConfig,
  type TransportSector,
  type TransportStyle,
} from "@/lib/transportConfig";
import { waHref } from "@/lib/settings";
import { site } from "@/lib/site";

type ServiceValues = {
  selected: boolean;
  quantity: number;
};

type LegChoice = {
  mode: "private" | "bus";
  sectorId: string;
  vehicleId: string;
};

type ZiyaratPick = {
  selected: boolean;
  vehicleId: string;
  trips: number;
};

/** One line of the estimate. amount null = priced at inquiry. */
type EstimateLine = {
  key: string;
  label: string;
  detail?: string;
  amount: number | null;
};

function positive(value: number, fallback = 1) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

function nonNegative(value: number) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

// Cap the stay so a mistyped nights value can't spin a huge loop or produce
// absurd totals.
const MAX_NIGHTS = 366;

const SELF_HOTEL = "self";

export default function PackageCalculator({
  items,
  whatsapp,
  sarToPkr,
  transport,
}: {
  items: CalculatorItem[];
  whatsapp: string;
  sarToPkr: number;
  transport: TransportConfig;
}) {
  const [adults, setAdults] = useState(1);
  const [infants, setInfants] = useState(0);
  const [month, setMonth] = useState("");
  const [roomType, setRoomType] = useState<"" | RoomType>("");
  const [style, setStyle] = useState<"" | TransportStyle>("");
  const [routeId, setRouteId] = useState("");
  // Per-stay state, indexed by the stay's position in the route.
  const [stayHotels, setStayHotels] = useState<Record<number, string>>({});
  const [stayNights, setStayNights] = useState<Record<number, number>>({});
  const [stayRooms, setStayRooms] = useState<Record<number, number>>({});
  const [stayNusuk, setStayNusuk] = useState<Record<number, boolean>>({});
  // Per-leg transport choices, indexed by the leg's position in the route.
  const [legChoices, setLegChoices] = useState<Record<number, Partial<LegChoice>>>({});
  const [ziyarat, setZiyarat] = useState<Record<string, ZiyaratPick>>({});
  const [services, setServices] = useState<Record<string, ServiceValues>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [flowError, setFlowError] = useState("");

  const fees = transport.fees;
  const route = routeOptions.find((r) => r.id === routeId) ?? null;
  const activeVehicles = transport.vehicles.filter((v) => v.active);
  const ziyaratSectors = transport.sectors.filter(
    (s) => s.active && s.kind === "ziyarat"
  );

  // ---------------------------------------------------------------------
  // Travel month + stay dates. Stays run back to back from the 1st of the
  // chosen month, in journey order, so seasonal hotel rates land on the
  // right nights for each stay.
  // ---------------------------------------------------------------------

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

  function nightDates(offsetNights: number, count: number) {
    if (!month || count < 1) return [] as string[];
    const dates: string[] = [];
    const cursor = new Date(`${month}-01T00:00:00Z`);
    cursor.setUTCDate(cursor.getUTCDate() + Math.min(offsetNights, MAX_NIGHTS));
    const capped = Math.min(count, MAX_NIGHTS);
    while (dates.length < capped) {
      dates.push(cursor.toISOString().slice(0, 10));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return dates;
  }

  const stays = route ? route.stays : [];
  const nightsAt = (index: number) => nonNegative(stayNights[index] ?? 0);
  const stayOffset = (index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i += 1) offset += nightsAt(i);
    return offset;
  };
  const totalNights = stays.reduce((sum, _s, index) => sum + nightsAt(index), 0);

  /**
   * The hotel chosen for a stay. A repeated city (the return stay on a
   * multiple route) defaults to the hotel picked for the earlier stay in the
   * same city until the customer changes it.
   */
  function hotelIdFor(index: number): string | null {
    if (stayHotels[index]) return stayHotels[index];
    const city = stays[index];
    for (let i = 0; i < index; i += 1) {
      if (stays[i] === city && stayHotels[i]) return stayHotels[i];
    }
    return null;
  }

  function hotelItem(id: string | null): CalculatorItem | null {
    if (!id || id === SELF_HOTEL) return null;
    return items.find((item) => item.id === id) ?? null;
  }

  // ---------------------------------------------------------------------
  // Steps
  // ---------------------------------------------------------------------

  type Step =
    | { id: "travel"; label: string }
    | { id: "journey"; label: string }
    | { id: string; label: string; stayIndex: number; city: StayCity }
    | { id: "transport"; label: string }
    | { id: "services"; label: string }
    | { id: "summary"; label: string };

  const serviceItems = items.filter(
    (item) =>
      item.category !== "hotel" &&
      item.category !== "visa" &&
      item.category !== "transport"
  );
  const cityCounts: Record<string, number> = {};
  const staySteps = stays.map((city, index) => {
    cityCounts[city] = (cityCounts[city] ?? 0) + 1;
    const repeat = cityCounts[city] > 1;
    return {
      id: `stay-${index}`,
      label: repeat ? `${city} hotel (return)` : `${city} hotel`,
      stayIndex: index,
      city,
    };
  });
  const showTransportStep =
    style === "full-private" ||
    style === "partial-private" ||
    ziyaratSectors.length > 0;
  const steps: Step[] = [
    { id: "travel", label: "Travel details" },
    { id: "journey", label: "Route & transport" },
    ...staySteps,
    ...(route && showTransportStep
      ? [{ id: "transport", label: "Vehicles & ziyarat" } as Step]
      : []),
    ...(serviceItems.length > 0 ? [{ id: "services", label: "Services" } as Step] : []),
    { id: "summary", label: "Summary" },
  ];
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)];

  // ---------------------------------------------------------------------
  // Transport legs
  // ---------------------------------------------------------------------

  const legs = route ? route.legs : [];

  function defaultLegMode(legIndex: number): "private" | "bus" {
    if (style === "full-private") return "private";
    // Partial private: airport transfers ride the shared bus by default,
    // the inter-city hop goes private. The customer can flip each leg.
    const leg = legs[legIndex];
    const options = leg ? sectorsForLeg(transport.sectors, leg) : [];
    const kind = options[0]?.kind ?? "airport";
    return kind === "intercity" ? "private" : "bus";
  }

  function legChoice(legIndex: number): LegChoice {
    const stored = legChoices[legIndex] ?? {};
    const leg = legs[legIndex];
    const options = leg ? sectorsForLeg(transport.sectors, leg) : [];
    return {
      mode:
        style === "full-private"
          ? "private"
          : stored.mode ?? defaultLegMode(legIndex),
      sectorId: stored.sectorId ?? options[0]?.id ?? "",
      vehicleId: stored.vehicleId ?? "",
    };
  }

  function patchLeg(legIndex: number, next: Partial<LegChoice>) {
    setLegChoices((current) => ({
      ...current,
      [legIndex]: { ...current[legIndex], ...next },
    }));
    setFlowError("");
  }

  function vehicleCountFor(seats: number) {
    return Math.max(1, Math.ceil(positive(adults) / Math.max(1, seats)));
  }

  function sectorById(id: string): TransportSector | null {
    return transport.sectors.find((s) => s.id === id) ?? null;
  }

  const legNeedsVehicle = (legIndex: number) =>
    (style === "full-private" || style === "partial-private") &&
    legChoice(legIndex).mode === "private" &&
    sectorsForLeg(transport.sectors, legs[legIndex]).length > 0;

  // ---------------------------------------------------------------------
  // Hotel + service pricing (per stay, sequential dates)
  // ---------------------------------------------------------------------

  function stayHotelTotal(index: number): { amount: number; detail: string } {
    const item = hotelItem(hotelIdFor(index));
    if (!item) return { amount: 0, detail: "" };
    const dates = nightDates(stayOffset(index), nightsAt(index));
    const counts = new Map<number, number>();
    for (const date of dates) {
      const rate =
        item.dateRates.find(
          (period) => date >= period.startDate && date <= period.endDate
        )?.price ?? item.price;
      counts.set(rate, (counts.get(rate) ?? 0) + 1);
    }
    const parts = Array.from(counts, ([price, nights]) => ({ price, nights }));
    const nightly = parts.reduce((sum, p) => sum + p.price * p.nights, 0);
    const rooms = positive(stayRooms[index] ?? 1);
    let amount = item.price;
    if (item.unit === "per_person") amount = item.price * positive(adults);
    else if (item.unit === "per_person_night") amount = nightly * positive(adults);
    else if (item.unit === "per_room_night") amount = nightly * rooms;
    const detail =
      parts.length > 1
        ? parts
            .map((p) => `${p.nights} night${p.nights === 1 ? "" : "s"} × ${formatCalculatorPrice(p.price)}`)
            .join(" + ")
        : "";
    return { amount, detail };
  }

  function serviceValue(id: string): ServiceValues {
    return services[id] ?? { selected: false, quantity: 1 };
  }

  function patchService(id: string, next: Partial<ServiceValues>) {
    setServices((current) => ({
      ...current,
      [id]: { ...serviceValue(id), ...next },
    }));
  }

  function serviceTotal(item: CalculatorItem) {
    const value = serviceValue(item.id);
    if (!value.selected) return 0;
    const quantity = positive(value.quantity);
    const dates = nightDates(0, totalNights);
    const nightly =
      dates.length > 0
        ? dates.reduce((sum, date) => {
            const rate = item.dateRates.find(
              (period) => date >= period.startDate && date <= period.endDate
            );
            return sum + (rate?.price ?? item.price);
          }, 0)
        : item.price;
    if (item.unit === "per_person") return item.price * positive(adults);
    if (item.unit === "per_person_night") return nightly * positive(adults);
    if (item.unit === "per_room_night") return nightly * quantity;
    if (item.unit === "per_vehicle" || item.unit === "per_trip") {
      return item.price * quantity;
    }
    return item.price;
  }

  // ---------------------------------------------------------------------
  // The estimate: every priced line in one list.
  // ---------------------------------------------------------------------

  function buildEstimate(): EstimateLine[] {
    const lines: EstimateLine[] = [];
    const pax = positive(adults);
    const infantCount = nonNegative(infants);

    // Visa
    if (style === "sharing") {
      const perPerson = sharingVisaPrice(transport.visaTiers, pax);
      lines.push({
        key: "visa",
        label: `Umrah visa · sharing bus · ${pax} adult${pax === 1 ? "" : "s"}`,
        detail:
          perPerson !== null
            ? `${pax} × ${formatCalculatorPrice(perPerson)} per person`
            : "Group size outside the price bands",
        amount: perPerson !== null ? perPerson * pax : null,
      });
      lines.push({
        key: "transport-included",
        label: "Ground transport by sharing bus",
        detail: "Included with the visa",
        amount: 0,
      });
    } else if (style === "full-private" || style === "partial-private") {
      const perPerson =
        style === "full-private" ? fees.fullPrivateVisa : fees.partialPrivateVisa;
      lines.push({
        key: "visa",
        label: `Umrah visa · ${transportStyleLabels[style]} · ${pax} adult${pax === 1 ? "" : "s"}`,
        detail: `${pax} × ${formatCalculatorPrice(perPerson)} per person`,
        amount: perPerson * pax,
      });
    }

    if (infantCount > 0) {
      lines.push({
        key: "infants",
        label: `Infant visa · ${infantCount} infant${infantCount === 1 ? "" : "s"}`,
        detail: `${infantCount} × ${formatCalculatorPrice(fees.infantVisa)}`,
        amount: fees.infantVisa * infantCount,
      });
    }

    // Long-stay fee
    if (totalNights > fees.longStayAfterDays) {
      const heads = pax + infantCount;
      if (totalNights <= fees.longStayMaxDays) {
        lines.push({
          key: "long-stay",
          label: `Extended stay fee · over ${fees.longStayAfterDays} days`,
          detail: `${heads} × ${formatCalculatorPrice(fees.longStayFee)}`,
          amount: fees.longStayFee * heads,
        });
      } else {
        lines.push({
          key: "long-stay",
          label: `Stay over ${fees.longStayMaxDays} days`,
          detail: "Our team will confirm the visa terms",
          amount: null,
        });
      }
    }

    // Transport legs (private styles)
    if ((style === "full-private" || style === "partial-private") && route) {
      legs.forEach((leg, legIndex) => {
        const options = sectorsForLeg(transport.sectors, leg);
        const choice = legChoice(legIndex);
        if (options.length === 0) {
          lines.push({
            key: `leg-${legIndex}`,
            label: `Transport leg ${legIndex + 1}`,
            detail: "Arranged at inquiry",
            amount: null,
          });
          return;
        }
        const sector = sectorById(choice.sectorId) ?? options[0];
        if (choice.mode === "bus") {
          const intercity = sector.kind === "intercity";
          lines.push({
            key: `leg-${legIndex}`,
            label: `${sectorLabel(sector)} · shared bus`,
            detail: intercity
              ? `${pax} × ${formatCalculatorPrice(fees.busPerPersonSector)} per person`
              : "Included with the visa",
            amount: intercity ? fees.busPerPersonSector * pax : 0,
          });
          return;
        }
        const vehicle = activeVehicles.find((v) => v.id === choice.vehicleId);
        if (!vehicle) {
          lines.push({
            key: `leg-${legIndex}`,
            label: sectorLabel(sector),
            detail: "Choose a vehicle",
            amount: null,
          });
          return;
        }
        const count = vehicleCountFor(vehicle.seats);
        const price = sector.prices[vehicle.id];
        lines.push({
          key: `leg-${legIndex}`,
          label: `${sectorLabel(sector)} · ${count} × ${vehicle.name}`,
          detail:
            price != null
              ? count > 1
                ? `${count} × ${formatCalculatorPrice(price)}`
                : undefined
              : "Price confirmed at inquiry",
          amount: price != null ? price * count : null,
        });
      });
    }

    // Ziyarat add-ons
    for (const sector of ziyaratSectors) {
      const pick = ziyarat[sector.id];
      if (!pick?.selected) continue;
      const vehicle = activeVehicles.find((v) => v.id === pick.vehicleId);
      const trips = positive(pick.trips);
      if (!vehicle) {
        lines.push({
          key: `ziyarat-${sector.id}`,
          label: sectorLabel(sector),
          detail: "Choose a vehicle",
          amount: null,
        });
        continue;
      }
      const count = vehicleCountFor(vehicle.seats);
      const price = sector.prices[vehicle.id];
      lines.push({
        key: `ziyarat-${sector.id}`,
        label: `${sectorLabel(sector)} · ${count} × ${vehicle.name}${trips > 1 ? ` × ${trips} trips` : ""}`,
        detail:
          price != null
            ? `${count * trips} × ${formatCalculatorPrice(price)}`
            : "Price confirmed at inquiry",
        amount: price != null ? price * count * trips : null,
      });
    }

    // Hotels per stay
    let selfHotel = false;
    stays.forEach((city, index) => {
      const id = hotelIdFor(index);
      const nights = nightsAt(index);
      if (id === SELF_HOTEL) {
        selfHotel = true;
        if (stayNusuk[index] && nights > 0) {
          lines.push({
            key: `nusuk-${index}`,
            label: `Nusuk registration · ${city} · ${nights} night${nights === 1 ? "" : "s"}`,
            detail: `${pax} × ${nights} × ${formatCalculatorPrice(fees.nusukPerPersonNight)}`,
            amount: fees.nusukPerPersonNight * pax * nights,
          });
        }
        return;
      }
      const item = hotelItem(id);
      if (!item || nights < 1) return;
      const { amount, detail } = stayHotelTotal(index);
      lines.push({
        key: `hotel-${index}`,
        label: `${item.name} · ${nights} night${nights === 1 ? "" : "s"}`,
        detail: detail || undefined,
        amount,
      });
    });

    if (selfHotel) {
      lines.push({
        key: "self-hotel",
        label: "Self hotel fee",
        detail: `${pax} × ${formatCalculatorPrice(fees.selfHotelFee)}`,
        amount: fees.selfHotelFee * pax,
      });
    }

    // Extra services
    for (const item of serviceItems) {
      if (!serviceValue(item.id).selected) continue;
      lines.push({
        key: `service-${item.id}`,
        label: item.name,
        detail: unitLabels[item.unit],
        amount: serviceTotal(item),
      });
    }

    return lines;
  }

  const estimate = buildEstimate();
  const total = estimate.reduce((sum, line) => sum + (line.amount ?? 0), 0);
  const totalPkr = total * sarToPkr;
  const inquiryLines = estimate.filter((line) => line.amount === null);

  // ---------------------------------------------------------------------
  // Step navigation
  // ---------------------------------------------------------------------

  function changeRoomType(next: "" | RoomType) {
    setRoomType(next);
    setFlowError("");
    if (!next) return;
    // Deselect stay hotels that no longer match the preferred room type.
    setStayHotels((current) => {
      const updated: Record<number, string> = {};
      for (const [key, id] of Object.entries(current)) {
        const item = items.find((i) => i.id === id);
        if (id === SELF_HOTEL || !item?.roomType || item.roomType === next) {
          updated[Number(key)] = id;
        }
      }
      return updated;
    });
  }

  function chooseRoute(id: string) {
    setRouteId(id);
    setStayHotels({});
    setStayNights({});
    setStayRooms({});
    setStayNusuk({});
    setLegChoices({});
    setFlowError("");
  }

  function chooseStyle(next: TransportStyle) {
    setStyle(next);
    setLegChoices({});
    setFlowError("");
  }

  function goNext() {
    setFlowError("");
    if (currentStep.id === "travel") {
      if (!month) {
        setFlowError("Select the month you want to travel to continue.");
        return;
      }
    }
    if (currentStep.id === "journey") {
      if (!style) {
        setFlowError("Choose how you want to travel on the ground.");
        return;
      }
      if (!route) {
        setFlowError("Choose your route to continue.");
        return;
      }
    }
    if ("stayIndex" in currentStep) {
      const index = currentStep.stayIndex;
      const id = hotelIdFor(index);
      if (!id) {
        setFlowError(`Select a hotel in ${currentStep.city} to continue.`);
        return;
      }
      if (nightsAt(index) < 1) {
        setFlowError(`Enter how many nights for this ${currentStep.city} stay.`);
        return;
      }
      // Persist the inherited default so the summary reflects it even if the
      // customer never touched the radio.
      if (!stayHotels[index]) {
        setStayHotels((current) => ({ ...current, [index]: id }));
      }
    }
    if (currentStep.id === "transport") {
      for (let i = 0; i < legs.length; i += 1) {
        if (legNeedsVehicle(i) && !legChoice(i).vehicleId) {
          setFlowError("Choose a vehicle for every private transport leg.");
          return;
        }
      }
      for (const sector of ziyaratSectors) {
        const pick = ziyarat[sector.id];
        if (pick?.selected && !pick.vehicleId) {
          setFlowError("Choose a vehicle for every selected ziyarat trip.");
          return;
        }
      }
    }
    setStepIndex((current) => Math.min(steps.length - 1, current + 1));
  }

  function goBack() {
    setFlowError("");
    setStepIndex((current) => Math.max(0, current - 1));
  }

  const canConfirm =
    Boolean(route && style && month) &&
    stays.every((_c, index) => Boolean(hotelIdFor(index)) && nightsAt(index) >= 1);

  // Room types that actually exist in the hotel catalogue, in canonical order.
  const availableRoomTypes = roomTypes.filter((type) =>
    items.some((item) => item.category === "hotel" && item.roomType === type)
  );

  const nightsSummary = stays
    .map((city, index) =>
      nightsAt(index) > 0 ? `${city}: ${nightsAt(index)} night${nightsAt(index) === 1 ? "" : "s"}` : null
    )
    .filter(Boolean)
    .join(" · ");

  // ---------------------------------------------------------------------
  // WhatsApp message
  // ---------------------------------------------------------------------

  const message = [
    "Assalam o Alaikum, I built this package estimate:",
    `Adults: ${positive(adults)}${nonNegative(infants) > 0 ? ` · Infants: ${nonNegative(infants)}` : ""}`,
    ...(month ? [`Travel month: ${monthLabel}`] : []),
    ...(route ? [`Route: ${route.summary}`] : []),
    ...(style ? [`Transport: ${transportStyleLabels[style]}`] : []),
    ...(roomType ? [`Preferred room type: ${roomTypeLabels[roomType]}`] : []),
    ...(nightsSummary ? [`Nights: ${nightsSummary}`] : []),
    ...estimate.map((line) =>
      line.amount !== null
        ? `- ${line.label}: ${formatCalculatorPrice(line.amount)}`
        : `- ${line.label}: at inquiry${line.detail ? ` (${line.detail})` : ""}`
    ),
    `Estimated total: ${formatCalculatorPrice(total)}`,
    `Converted total: ${formatPkrPrice(totalPkr)} (1 SAR = PKR ${sarToPkr})`,
    ...(inquiryLines.length > 0
      ? ["Some items are priced at inquiry and not in the total above."]
      : []),
    "Please confirm availability and the final quote.",
  ].join("\n");

  // ---------------------------------------------------------------------
  // PDF export — a branded copy of everything on the summary.
  // ---------------------------------------------------------------------

  const [downloading, setDownloading] = useState(false);

  async function downloadPdf() {
    if (downloading) return;
    setDownloading(true);
    try {
      const [{ jsPDF }, autoTableModule] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);
      const autoTable = autoTableModule.default;

      const deep: [number, number, number] = [11, 44, 34]; // brand-blue-deep
      const gold: [number, number, number] = [197, 162, 83]; // brand-orange
      const slate: [number, number, number] = [100, 116, 139];
      const paper: [number, number, number] = [245, 241, 232];

      // Pull the brand mark in as a data URL so it embeds in the PDF.
      const logoDataUrl = await fetch("/logo.png")
        .then((res) => (res.ok ? res.blob() : null))
        .then(
          (blob) =>
            blob &&
            new Promise<string | null>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = () => resolve(null);
              reader.readAsDataURL(blob);
            })
        )
        .catch(() => null);

      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const finalY = () =>
        (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY;

      const pax = positive(adults);
      const infantCount = nonNegative(infants);

      // Branded header band with the logo mark.
      const headerH = 34;
      doc.setFillColor(deep[0], deep[1], deep[2]);
      doc.rect(0, 0, pageWidth, headerH, "F");
      let brandX = margin;
      if (logoDataUrl) {
        const logoSize = 20;
        doc.addImage(logoDataUrl, "PNG", margin, (headerH - logoSize) / 2, logoSize, logoSize);
        brandX = margin + logoSize + 5;
      }
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(site.name, brandX, 14);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8.5);
      doc.setTextColor(210, 210, 210);
      doc.text(site.tagline, brandX, 20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(gold[0], gold[1], gold[2]);
      doc.text("UMRAH PACKAGE ESTIMATE", brandX, 27);
      const dateStr = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(200, 200, 200);
      doc.text(`Generated ${dateStr}`, pageWidth - margin, 27, { align: "right" });

      // Trip details
      const detailRows: string[][] = [
        [
          "Travelers",
          `${pax} adult${pax === 1 ? "" : "s"}${infantCount > 0 ? ` + ${infantCount} infant${infantCount === 1 ? "" : "s"}` : ""}`,
        ],
      ];
      if (monthLabel) detailRows.push(["Travel month", monthLabel]);
      if (route) detailRows.push(["Route", route.summary]);
      if (style) detailRows.push(["Transport", transportStyleLabels[style]]);
      if (roomType) detailRows.push(["Room type", roomTypeLabels[roomType]]);
      if (nightsSummary) detailRows.push(["Nights", nightsSummary]);

      // Reserve room at the foot of every page for the branded contact strip.
      const footerH = 18;
      const contentBottom = pageHeight - footerH - 3;

      autoTable(doc, {
        startY: 42,
        head: [["Trip details", ""]],
        body: detailRows,
        theme: "plain",
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fontStyle: "bold", textColor: deep, fontSize: 11 },
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 42, textColor: slate },
          1: { textColor: [30, 30, 30] },
        },
        margin: { left: margin, right: margin, top: margin, bottom: footerH + 3 },
      });

      // Estimate line items
      const bodyRows = estimate.map((line) => [
        line.label,
        line.detail ?? "",
        line.amount !== null ? formatCalculatorPrice(line.amount) : "At inquiry",
      ]);

      autoTable(doc, {
        startY: finalY() + 5,
        head: [["Item", "Details", "Amount"]],
        body: bodyRows,
        theme: "striped",
        styles: { fontSize: 9.5, cellPadding: 3, valign: "middle" },
        headStyles: {
          fillColor: deep,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 10,
        },
        alternateRowStyles: { fillColor: paper },
        columnStyles: {
          0: { cellWidth: 76, fontStyle: "bold", textColor: deep },
          1: { textColor: slate, fontSize: 9 },
          2: { halign: "right", cellWidth: 34, fontStyle: "bold", textColor: deep },
        },
        margin: { left: margin, right: margin, top: margin, bottom: footerH + 3 },
      });

      // Totals band — keep it on the current page or start a fresh one.
      let y = finalY() + 8;
      if (y + 24 > contentBottom) {
        doc.addPage();
        y = margin;
      }
      doc.setFillColor(deep[0], deep[1], deep[2]);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 2, 2, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(220, 220, 220);
      doc.text("Estimated total", margin + 6, y + 9);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(gold[0], gold[1], gold[2]);
      doc.text(formatCalculatorPrice(total), pageWidth - margin - 6, y + 9, {
        align: "right",
      });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(200, 200, 200);
      doc.text(`Converted total  (1 SAR = PKR ${sarToPkr})`, margin + 6, y + 18);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(formatPkrPrice(totalPkr), pageWidth - margin - 6, y + 18, {
        align: "right",
      });
      y += 32;

      // Notes
      const noteWidth = pageWidth - margin * 2;
      const addNote = (text: string) => {
        const lines = doc.splitTextToSize(text, noteWidth) as string[];
        const blockHeight = lines.length * 4.5 + 3;
        if (y + blockHeight > contentBottom) {
          doc.addPage();
          y = margin;
        }
        doc.text(lines, margin, y);
        y += blockHeight;
      };
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(slate[0], slate[1], slate[2]);
      if (inquiryLines.length > 0) {
        addNote(
          'Items marked "At inquiry" are not included in the total above — our team confirms them with your final quote.'
        );
      }
      addNote(
        `Cancellation: visa cancellation ${formatCalculatorPrice(fees.visaCancellation)} per visa - non-travelling charge ${formatCalculatorPrice(fees.nonTravelling)} per person. Final availability and prices are confirmed by our team.`
      );

      // Branded contact footer on every page.
      const website = site.url.replace(/^https?:\/\//, "");
      const contactLine = `${site.phone}  ·  WhatsApp ${site.whatsapp}  ·  ${site.email}  ·  ${website}`;
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i += 1) {
        doc.setPage(i);
        const lineY = pageHeight - footerH;
        doc.setDrawColor(gold[0], gold[1], gold[2]);
        doc.setLineWidth(0.5);
        doc.line(margin, lineY, pageWidth - margin, lineY);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(deep[0], deep[1], deep[2]);
        doc.text(contactLine, margin, lineY + 5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(slate[0], slate[1], slate[2]);
        doc.text(site.address, margin, lineY + 9.5);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, lineY + 5, {
          align: "right",
        });
      }

      const slug = (monthLabel || "estimate").replace(/\s+/g, "-").toLowerCase();
      doc.save(`al-raqeem-package-estimate-${slug}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------

  const showAside = stepIndex >= 1;

  return (
    <div className={`mx-auto ${showAside ? "max-w-7xl" : "max-w-5xl"}`}>
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

      <div className={showAside ? "grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]" : ""}>
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
                Travelers, travel month and room type are used for the visa, every hotel and per-person service. You will choose your route next.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label htmlFor="calculator-adults">Adults</label>
                  <input id="calculator-adults" type="number" min="1" value={adults} onChange={(event) => setAdults(positive(Number(event.target.value)))} />
                </div>
                <div>
                  <label htmlFor="calculator-infants">Infants (under 2)</label>
                  <input id="calculator-infants" type="number" min="0" value={infants} onChange={(event) => setInfants(nonNegative(Number(event.target.value)))} />
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

          {currentStep.id === "journey" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl">How do you want to travel on the ground?</h3>
                <p className="mt-2 text-sm text-slate-500">
                  The visa price depends on this choice. Sharing bus is the most economical; private transport gives your group its own vehicle.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {transportStyles.map((option) => {
                    const active = style === option;
                    const pax = positive(adults);
                    const sharingRate = sharingVisaPrice(transport.visaTiers, pax);
                    const priceNote =
                      option === "sharing"
                        ? sharingRate !== null
                          ? `Visa ${formatCalculatorPrice(sharingRate)} per person`
                          : "Visa priced at inquiry"
                        : option === "full-private"
                          ? `Visa ${formatCalculatorPrice(fees.fullPrivateVisa)} per person`
                          : `Visa ${formatCalculatorPrice(fees.partialPrivateVisa)} per person`;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => chooseStyle(option)}
                        className={`rounded-2xl border p-5 text-left transition ${active ? "border-brand-orange bg-brand-orange/5 shadow-card ring-1 ring-brand-orange/30" : "border-black/10 hover:border-brand-blue/30"}`}
                      >
                        <p className="font-display text-lg text-brand-blue-deep">{transportStyleLabels[option]}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {option === "sharing"
                            ? "All ground transport by shared bus, included with the visa."
                            : option === "full-private"
                              ? "Every leg in your own vehicle. You choose the vehicle per leg."
                              : "Airport transfers by shared bus, city-to-city legs in your own vehicle."}
                        </p>
                        <p className="mt-3 text-sm font-semibold text-brand-orange-dark">{priceNote}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xl">Choose your route</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Single routes travel one way through both cities. Multiple routes return to your first city before flying home.
                </p>
                <div className="mt-5 space-y-3">
                  {routeOptions.map((option) => {
                    const active = routeId === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition sm:px-6 ${active ? "border-brand-orange bg-brand-orange/5 shadow-card ring-1 ring-brand-orange/30" : "border-black/10 hover:border-brand-blue/30"}`}
                      >
                        <input
                          type="radio"
                          name="calculator-route"
                          checked={active}
                          onChange={() => chooseRoute(option.id)}
                          className="mt-1 h-5 w-5 shrink-0"
                        />
                        <span>
                          <span className="block font-semibold text-brand-blue-deep">{option.label}</span>
                          <span className="mt-1 block text-sm text-slate-500">{option.summary}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {"stayIndex" in currentStep && (() => {
            const index = currentStep.stayIndex;
            const city = currentStep.city;
            const cityHotels = items.filter(
              (item) =>
                item.category === "hotel" && normalizeCity(item.location) === city
            );
            const matching = roomType
              ? cityHotels.filter((item) => item.roomType === roomType)
              : cityHotels;
            const hotelsToShow = matching.length > 0 ? matching : cityHotels;
            const chosenId = hotelIdFor(index);
            const inherited = !stayHotels[index] && Boolean(chosenId);
            return (
              <div>
                <h3 className="text-xl">
                  {currentStep.label.includes("return")
                    ? `Your return stay in ${city}`
                    : `Select one hotel in ${city}`}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  {inherited
                    ? `We pre-selected the hotel from your first ${city} stay — keep it or pick a different one for this stay. `
                    : roomType
                      ? `Showing ${roomTypeLabels[roomType]} room options. `
                      : "Choose the hotel and room-sharing option that suits your group. "}
                  Pricing is shown in the final summary.
                </p>
                <div className="mt-5 max-w-xs">
                  <label htmlFor={`nights-${index}`}>How many nights in {city}{currentStep.label.includes("return") ? " (return stay)" : ""}?</label>
                  <input
                    id={`nights-${index}`}
                    type="number"
                    min="1"
                    placeholder="e.g. 7"
                    value={stayNights[index] || ""}
                    onChange={(event) => {
                      const next = Math.floor(Number(event.target.value));
                      setStayNights((current) => ({
                        ...current,
                        [index]: Number.isFinite(next) && next > 0 ? Math.min(next, MAX_NIGHTS) : 0,
                      }));
                      setFlowError("");
                    }}
                  />
                </div>
                {roomType && matching.length === 0 && (
                  <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                    No {roomTypeLabels[roomType]} rooms are available in {city} right now — showing all room types instead.
                  </p>
                )}
                <div className="mt-6 space-y-3">
                  {hotelsToShow.map((item) => {
                    const selected = chosenId === item.id;
                    return (
                      <label key={item.id} className={`flex cursor-pointer flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border p-4 transition sm:px-6 ${selected ? "border-brand-orange bg-brand-orange/5 shadow-card ring-1 ring-brand-orange/30" : "border-black/10 hover:border-brand-blue/30"}`}>
                        <input
                          type="radio"
                          name={`hotel-stay-${index}`}
                          checked={selected}
                          onChange={() => {
                            setStayHotels((current) => ({ ...current, [index]: item.id }));
                            setFlowError("");
                          }}
                          className="h-5 w-5 shrink-0"
                        />
                        <div className="min-w-[160px] flex-1">
                          <h4 className="font-display text-lg leading-snug text-brand-blue-deep">
                            {item.name}
                            {item.starRating ? (
                              <span className="ml-2 whitespace-nowrap align-middle text-sm tracking-widest text-brand-blue" aria-label={`${item.starRating} star hotel`}>
                                {"★".repeat(item.starRating)}
                              </span>
                            ) : null}
                          </h4>
                          {item.roomType && (
                            <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-md border border-brand-orange/40 bg-brand-orange/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-orange-dark">
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                                <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
                              </svg>
                              {roomTypeLabels[item.roomType]} room
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Distance from Haram</p>
                            <p className="text-sm font-semibold text-brand-blue-deep">
                              {item.distanceFromHaram == null
                                ? "Confirm with our team"
                                : `${item.distanceFromHaram.toLocaleString("en-PK")} metres`}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Haram access</p>
                            <p className="text-sm font-semibold text-brand-blue-deep">
                              {item.haramAccess ? haramAccessLabels[item.haramAccess] : "Confirm with our team"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Meal plan</p>
                            <p className="text-sm font-semibold text-brand-blue-deep">{item.mealPlan || "Room only"}</p>
                          </div>
                        </div>
                        {selected && item.unit === "per_room_night" && (
                          <div className="flex shrink-0 items-center gap-2">
                            <label htmlFor={`rooms-${index}`} className="mb-0 text-xs">Rooms</label>
                            <input
                              id={`rooms-${index}`}
                              type="number"
                              min="1"
                              value={stayRooms[index] ?? 1}
                              onChange={(event) =>
                                setStayRooms((current) => ({
                                  ...current,
                                  [index]: positive(Number(event.target.value)),
                                }))
                              }
                              onClick={(event) => event.stopPropagation()}
                              className="w-20"
                            />
                          </div>
                        )}
                        {item.description && <p className="basis-full text-sm leading-relaxed text-slate-600">{item.description}</p>}
                      </label>
                    );
                  })}

                  {/* Self-arranged hotel */}
                  <label className={`flex cursor-pointer flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-dashed p-4 transition sm:px-6 ${chosenId === SELF_HOTEL ? "border-brand-orange bg-brand-orange/5 shadow-card ring-1 ring-brand-orange/30" : "border-black/20 hover:border-brand-blue/30"}`}>
                    <input
                      type="radio"
                      name={`hotel-stay-${index}`}
                      checked={chosenId === SELF_HOTEL}
                      onChange={() => {
                        setStayHotels((current) => ({ ...current, [index]: SELF_HOTEL }));
                        setFlowError("");
                      }}
                      className="h-5 w-5 shrink-0"
                    />
                    <div className="min-w-[160px] flex-1">
                      <h4 className="font-display text-lg leading-snug text-brand-blue-deep">
                        I&apos;ll arrange my own hotel in {city}
                      </h4>
                      <p className="mt-1 text-sm text-slate-500">
                        A self-hotel fee of {formatCalculatorPrice(fees.selfHotelFee)} per person applies once per booking.
                      </p>
                    </div>
                    {chosenId === SELF_HOTEL && (
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600">
                        <input
                          type="checkbox"
                          checked={stayNusuk[index] ?? true}
                          onChange={(event) =>
                            setStayNusuk((current) => ({
                              ...current,
                              [index]: event.target.checked,
                            }))
                          }
                          className="h-4 w-4"
                        />
                        Nusuk registration needed ({formatCalculatorPrice(fees.nusukPerPersonNight)} / person / night)
                      </label>
                    )}
                  </label>
                </div>
              </div>
            );
          })()}

          {currentStep.id === "transport" && route && (
            <div className="space-y-8">
              {(style === "full-private" || style === "partial-private") && (
                <div>
                  <h3 className="text-xl">Choose your vehicles</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {style === "partial-private"
                      ? "Each leg can ride the shared bus or go private. Pick a vehicle for the private legs — larger groups get more than one vehicle automatically."
                      : "Pick a vehicle for each leg of your journey — larger groups get more than one vehicle automatically."}
                  </p>
                  <div className="mt-5 space-y-4">
                    {legs.map((leg, legIndex) => {
                      const options = sectorsForLeg(transport.sectors, leg);
                      const choice = legChoice(legIndex);
                      if (options.length === 0) {
                        return (
                          <div key={legIndex} className="rounded-2xl border border-dashed border-black/20 p-4 text-sm text-slate-500">
                            Leg {legIndex + 1}: this transfer is arranged by our team at inquiry.
                          </div>
                        );
                      }
                      const sector = sectorById(choice.sectorId) ?? options[0];
                      return (
                        <div key={legIndex} className="rounded-2xl border border-black/10 p-4 sm:px-6">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="font-semibold text-brand-blue-deep">
                              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-blue-deep text-xs font-bold text-white">{legIndex + 1}</span>
                              {sectorLabel(sector)}
                            </p>
                            {style === "partial-private" && (
                              <div className="flex overflow-hidden rounded-full border border-black/10 text-xs font-semibold">
                                <button
                                  type="button"
                                  onClick={() => patchLeg(legIndex, { mode: "bus" })}
                                  className={`px-4 py-1.5 transition ${choice.mode === "bus" ? "bg-brand-blue-deep text-white" : "bg-white text-slate-500 hover:text-brand-blue-deep"}`}
                                >
                                  Shared bus
                                </button>
                                <button
                                  type="button"
                                  onClick={() => patchLeg(legIndex, { mode: "private" })}
                                  className={`px-4 py-1.5 transition ${choice.mode === "private" ? "bg-brand-blue-deep text-white" : "bg-white text-slate-500 hover:text-brand-blue-deep"}`}
                                >
                                  Private
                                </button>
                              </div>
                            )}
                          </div>

                          {choice.mode === "bus" ? (
                            <p className="mt-3 text-sm text-slate-500">
                              {sector.kind === "intercity"
                                ? `Shared bus · ${formatCalculatorPrice(fees.busPerPersonSector)} per person`
                                : "Shared bus · included with the visa"}
                            </p>
                          ) : (
                            <>
                              {options.length > 1 && (
                                <div className="mt-3 max-w-sm">
                                  <label htmlFor={`leg-sector-${legIndex}`} className="text-xs">Route option</label>
                                  <select
                                    id={`leg-sector-${legIndex}`}
                                    value={sector.id}
                                    onChange={(event) => patchLeg(legIndex, { sectorId: event.target.value })}
                                  >
                                    {options.map((option) => (
                                      <option key={option.id} value={option.id}>
                                        {option.via ? `${sectorLabel(option)}` : "Direct"}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {activeVehicles.map((vehicle) => {
                                  const price = sector.prices[vehicle.id];
                                  const count = vehicleCountFor(vehicle.seats);
                                  const selected = choice.vehicleId === vehicle.id;
                                  return (
                                    <label
                                      key={vehicle.id}
                                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${selected ? "border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange/30" : "border-black/10 hover:border-brand-blue/30"}`}
                                    >
                                      <input
                                        type="radio"
                                        name={`leg-vehicle-${legIndex}`}
                                        checked={selected}
                                        onChange={() => patchLeg(legIndex, { vehicleId: vehicle.id })}
                                        className="h-4 w-4 shrink-0"
                                      />
                                      <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-semibold text-brand-blue-deep">
                                          {count > 1 ? `${count} × ` : ""}{vehicle.name}
                                        </span>
                                        <span className="block text-xs text-slate-500">
                                          Up to {vehicle.seats} travelers each
                                        </span>
                                      </span>
                                      <span className="shrink-0 text-sm font-semibold text-brand-orange-dark">
                                        {price != null ? formatCalculatorPrice(price * count) : "At inquiry"}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {style === "sharing" && (
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  All route transport travels by shared bus and is included with your visa.
                </p>
              )}

              {ziyaratSectors.length > 0 && (
                <div>
                  <h3 className="text-xl">Add ziyarat trips</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Optional guided visits to the historical sites, priced per vehicle.
                  </p>
                  <div className="mt-5 space-y-3">
                    {ziyaratSectors.map((sector) => {
                      const pick = ziyarat[sector.id] ?? { selected: false, vehicleId: "", trips: 1 };
                      return (
                        <div key={sector.id} className={`rounded-2xl border p-4 sm:px-6 ${pick.selected ? "border-brand-orange bg-brand-orange/5" : "border-black/10"}`}>
                          <label className="flex cursor-pointer items-center gap-3">
                            <input
                              type="checkbox"
                              checked={pick.selected}
                              onChange={(event) =>
                                setZiyarat((current) => ({
                                  ...current,
                                  [sector.id]: { ...pick, selected: event.target.checked },
                                }))
                              }
                              className="h-5 w-5"
                            />
                            <span className="font-semibold text-brand-blue-deep">{sectorLabel(sector)}</span>
                          </label>
                          {pick.selected && (
                            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                              {activeVehicles.map((vehicle) => {
                                const price = sector.prices[vehicle.id];
                                const count = vehicleCountFor(vehicle.seats);
                                const selected = pick.vehicleId === vehicle.id;
                                return (
                                  <label
                                    key={vehicle.id}
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${selected ? "border-brand-orange bg-white ring-1 ring-brand-orange/30" : "border-black/10 bg-white hover:border-brand-blue/30"}`}
                                  >
                                    <input
                                      type="radio"
                                      name={`ziyarat-vehicle-${sector.id}`}
                                      checked={selected}
                                      onChange={() =>
                                        setZiyarat((current) => ({
                                          ...current,
                                          [sector.id]: { ...pick, vehicleId: vehicle.id },
                                        }))
                                      }
                                      className="h-4 w-4 shrink-0"
                                    />
                                    <span className="min-w-0 flex-1">
                                      <span className="block text-sm font-semibold text-brand-blue-deep">
                                        {count > 1 ? `${count} × ` : ""}{vehicle.name}
                                      </span>
                                      <span className="block text-xs text-slate-500">Up to {vehicle.seats} travelers each</span>
                                    </span>
                                    <span className="shrink-0 text-sm font-semibold text-brand-orange-dark">
                                      {price != null ? formatCalculatorPrice(price * count) : "At inquiry"}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep.id === "services" && (
            <div>
              <h3 className="text-xl">Add services to your package</h3>
              <p className="mt-2 text-sm text-slate-500">These options are optional. Select as many as you need.</p>
              <div className="mt-6 space-y-8">
                {calculatorCategories.filter((category) => category !== "hotel" && category !== "visa" && category !== "transport").map((category) => {
                  const group = serviceItems.filter((item) => item.category === category);
                  if (group.length === 0) return null;
                  return (
                    <section key={category}>
                      <h4 className="font-display text-lg text-brand-blue-deep">{categoryLabels[category]}</h4>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {group.map((item) => {
                          const value = serviceValue(item.id);
                          return (
                            <div key={item.id} className={`rounded-2xl border p-4 ${value.selected ? "border-brand-orange bg-brand-orange/5" : "border-black/10"}`}>
                              <label className="flex cursor-pointer items-start gap-3">
                                <input type="checkbox" checked={value.selected} onChange={(event) => patchService(item.id, { selected: event.target.checked })} className="mt-1 h-5 w-5" />
                                <span className="flex-1">
                                  <span className="block font-semibold text-brand-blue-deep">{item.name}</span>
                                  <span className="mt-1 block text-sm text-brand-orange-dark">{formatCalculatorPrice(item.price)} · {unitLabels[item.unit]}</span>
                                </span>
                              </label>
                              {value.selected && (item.unit === "per_vehicle" || item.unit === "per_trip") && (
                                <div className="mt-3">
                                  <label htmlFor={`service-quantity-${item.id}`} className="text-xs">{item.unit === "per_vehicle" ? "Vehicles" : "Trips"}</label>
                                  <input id={`service-quantity-${item.id}`} type="number" min="1" value={value.quantity} onChange={(event) => patchService(item.id, { quantity: positive(Number(event.target.value)) })} />
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
              <p className="mt-2 text-sm text-slate-500">
                {positive(adults)} adult{positive(adults) === 1 ? "" : "s"}
                {nonNegative(infants) > 0 ? ` · ${nonNegative(infants)} infant${nonNegative(infants) === 1 ? "" : "s"}` : ""}
                {monthLabel ? ` · ${monthLabel}` : ""}
                {roomType ? ` · ${roomTypeLabels[roomType]} room` : ""}
              </p>
              {route && (
                <p className="mt-3 rounded-xl bg-paper px-4 py-3 text-sm font-medium text-brand-blue-deep">
                  {route.summary}
                  {style ? ` · ${transportStyleLabels[style]}` : ""}
                  {nightsSummary ? ` · ${nightsSummary}` : ""}
                </p>
              )}
              <div className="mt-5 divide-y divide-black/5 rounded-2xl border border-black/5">
                {estimate.map((line) => (
                  <div key={line.key} className="flex justify-between gap-4 p-4">
                    <div>
                      <p className="font-semibold text-brand-blue-deep">{line.label}</p>
                      {line.detail && <p className="mt-1 text-xs text-slate-500">{line.detail}</p>}
                    </div>
                    <p className="shrink-0 font-semibold text-brand-blue-deep">
                      {line.amount !== null ? formatCalculatorPrice(line.amount) : "At inquiry"}
                    </p>
                  </div>
                ))}
              </div>
              {inquiryLines.length > 0 && (
                <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                  Items marked &quot;at inquiry&quot; are not in the total — our team confirms them with your final quote.
                </p>
              )}
              <p className="mt-4 text-xs text-slate-500">
                Cancellation: visa cancellation {formatCalculatorPrice(fees.visaCancellation)} per visa · non-travelling charge {formatCalculatorPrice(fees.nonTravelling)} per person. Final availability and prices are confirmed by our team.
              </p>
              <button
                type="button"
                onClick={downloadPdf}
                disabled={downloading}
                className="btn-outline mt-6 w-full sm:w-auto disabled:opacity-50"
              >
                {downloading ? "Preparing PDF…" : "⬇ Download estimate as PDF"}
              </button>
            </div>
          )}

          {flowError && <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{flowError}</p>}

          <div className="mt-8 flex items-center justify-between border-t border-black/5 pt-6">
            <button type="button" onClick={goBack} disabled={stepIndex === 0} className="btn-outline disabled:invisible">← Back</button>
            {currentStep.id !== "summary" && <button type="button" onClick={goNext} className="btn-orange">Continue →</button>}
          </div>
        </div>
      </div>

      {showAside && (
        <aside className="rounded-3xl bg-brand-blue-deep p-6 text-white shadow-lift lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-orange">Live summary</p>
          <h3 className="mt-2 text-2xl text-white">Your package</h3>

          <div className="mt-5 space-y-3 rounded-xl bg-white/10 p-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-300">Travelers</span>
              <span className="font-semibold">
                {positive(adults)}{nonNegative(infants) > 0 ? ` + ${nonNegative(infants)} infant${nonNegative(infants) === 1 ? "" : "s"}` : ""}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-300">Month</span>
              <span className="text-right text-xs font-semibold">{monthLabel || "Not selected"}</span>
            </div>
            {style && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300">Transport</span>
                <span className="text-right text-xs font-semibold">{transportStyleLabels[style]}</span>
              </div>
            )}
            {route && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300">Route</span>
                <span className="text-right text-xs font-semibold">
                  {route.stays.join(" → ")}
                </span>
              </div>
            )}
            {roomType && (
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300">Room type</span>
                <span className="text-right text-xs font-semibold">{roomTypeLabels[roomType]}</span>
              </div>
            )}
            {stays.map((city, index) => (
              <div key={index} className="flex items-center justify-between gap-3">
                <span className="text-slate-300">
                  {city} nights{stays.slice(0, index).includes(city) ? " (return)" : ""}
                </span>
                <span className="font-semibold">{stayNights[index] || "—"}</span>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Estimate</p>
            {estimate.length > 0 ? (
              <div className="mt-2 divide-y divide-white/10">
                {estimate.map((line) => (
                  <div key={line.key} className="flex items-start justify-between gap-3 py-3 text-sm">
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{line.label}</p>
                      {line.detail && <p className="mt-0.5 text-[11px] text-slate-400">{line.detail}</p>}
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-brand-orange">
                      {line.amount !== null ? formatCalculatorPrice(line.amount) : "At inquiry"}
                    </span>
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
            <>
              <a href={waHref(whatsapp, message)} target="_blank" rel="noopener noreferrer" className={`btn-orange mt-5 w-full ${!canConfirm ? "pointer-events-none opacity-50" : ""}`} aria-disabled={!canConfirm}>
                Confirm on WhatsApp
              </a>
              <button
                type="button"
                onClick={downloadPdf}
                disabled={downloading}
                className="btn mt-3 w-full border border-white/40 text-white transition hover:bg-white hover:text-brand-blue-deep disabled:opacity-50"
              >
                {downloading ? "Preparing PDF…" : "⬇ Download PDF"}
              </button>
            </>
          )}
        </aside>
      )}
      </div>
    </div>
  );
}
