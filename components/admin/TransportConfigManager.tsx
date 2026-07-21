"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  sectorKinds,
  transportLocationLabels,
  transportLocations,
  type SectorKind,
  type TransportConfig,
  type TransportLocation,
  type TransportSector,
  type TransportVehicle,
  type VisaTier,
} from "@/lib/transportConfig";

// The whole config is edited in memory across four tabs and saved in one PUT.
// Prices are kept as numbers-or-null; an empty input = null = "at inquiry".

type Status = { type: "idle" | "ok" | "err"; msg?: string };

const TABS = [
  { id: "visa", label: "Visa prices" },
  { id: "vehicles", label: "Vehicles" },
  { id: "sectors", label: "Transport sectors" },
  { id: "fees", label: "Fees & rules" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const kindLabels: Record<SectorKind, string> = {
  airport: "Airport transfer",
  intercity: "City to city",
  ziyarat: "Ziyarat",
  other: "Other",
};

const kindBadge: Record<SectorKind, string> = {
  airport: "bg-sky-100 text-sky-800",
  intercity: "bg-emerald-100 text-emerald-800",
  ziyarat: "bg-amber-100 text-amber-800",
  other: "bg-slate-100 text-slate-600",
};

function paxLabel(tier: VisaTier) {
  if (tier.minPax === tier.maxPax) {
    return `${tier.minPax} ${tier.minPax === 1 ? "person" : "people"}`;
  }
  return `${tier.minPax}–${tier.maxPax} people`;
}

/** Number input that allows a clean empty state (null). */
function PriceInput({
  id,
  value,
  onChange,
  placeholder = "—",
  className = "",
}: {
  id?: string;
  value: number | null;
  onChange: (next: number | null) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      id={id}
      type="number"
      min="0"
      inputMode="decimal"
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) =>
        onChange(e.target.value === "" ? null : Number(e.target.value))
      }
      className={className}
    />
  );
}

export default function TransportConfigManager({
  initial,
  configured,
}: {
  initial: TransportConfig;
  configured: boolean;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("visa");
  const [tiers, setTiers] = useState<VisaTier[]>(initial.visaTiers);
  const [vehicles, setVehicles] = useState<TransportVehicle[]>(initial.vehicles);
  const [sectors, setSectors] = useState<TransportSector[]>(
    [...initial.sectors].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [fees, setFees] = useState(initial.fees);
  const [sectorFilter, setSectorFilter] = useState<"all" | SectorKind>("all");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const activeVehicles = vehicles.filter((v) => v.active);
  const visibleSectors = useMemo(
    () =>
      sectorFilter === "all"
        ? sectors
        : sectors.filter((s) => s.kind === sectorFilter),
    [sectors, sectorFilter]
  );

  function touch() {
    setDirty(true);
    setStatus({ type: "idle" });
  }

  function patchTier(index: number, next: Partial<VisaTier>) {
    setTiers((c) => c.map((t, i) => (i === index ? { ...t, ...next } : t)));
    touch();
  }

  function patchVehicle(index: number, next: Partial<TransportVehicle>) {
    setVehicles((c) => c.map((v, i) => (i === index ? { ...v, ...next } : v)));
    touch();
  }

  function patchSector(id: string, next: Partial<TransportSector>) {
    setSectors((c) => c.map((s) => (s.id === id ? { ...s, ...next } : s)));
    touch();
  }

  function patchSectorPrice(id: string, vehicleId: string, price: number | null) {
    setSectors((c) =>
      c.map((s) =>
        s.id === id ? { ...s, prices: { ...s.prices, [vehicleId]: price } } : s
      )
    );
    touch();
  }

  function patchFee(key: keyof TransportConfig["fees"], value: number) {
    setFees((c) => ({ ...c, [key]: value }));
    touch();
  }

  async function handleSave() {
    setSaving(true);
    setStatus({ type: "idle" });
    try {
      const config: TransportConfig = {
        visaTiers: tiers,
        vehicles,
        sectors: sectors.map((s, index) => ({ ...s, sortOrder: index + 1 })),
        fees,
      };
      const res = await fetch("/api/transport-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setStatus({ type: "ok", msg: "Saved. The calculator now uses these prices." });
      setDirty(false);
      router.refresh();
    } catch (err) {
      setStatus({
        type: "err",
        msg: err instanceof Error ? err.message : "Failed to save.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 pb-28">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-brand-blue-deep">
            Transport &amp; Visa Prices
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            These prices drive the package calculator. Enter your selling
            prices — leave any vehicle price empty to show that leg as
            &quot;quoted at inquiry&quot;.
          </p>
        </div>
      </div>

      {!configured && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Connect Supabase (and run the <code>transport_config</code> migration)
          to save changes.
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-brand-blue-deep text-white shadow-card"
                : "bg-white text-slate-600 ring-1 ring-black/10 hover:text-brand-blue-deep"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------ Visa prices tab */}
      {tab === "visa" && (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
            <h2 className="font-display text-xl text-brand-blue-deep">
              Sharing bus visa
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Visa per person when the group travels by sharing bus. The price
              drops as the group grows.
            </p>
            <div className="mt-5 space-y-3">
              {tiers.map((tier, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-black/10 p-3"
                >
                  <span className="min-w-[100px] rounded-lg bg-brand-blue-deep/5 px-3 py-2 text-center text-sm font-bold text-brand-blue-deep">
                    {paxLabel(tier)}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <input
                      type="number"
                      min="1"
                      aria-label="From pax"
                      value={tier.minPax}
                      onChange={(e) =>
                        patchTier(index, { minPax: Math.floor(Number(e.target.value)) })
                      }
                      className="w-16"
                    />
                    to
                    <input
                      type="number"
                      min="1"
                      aria-label="To pax"
                      value={tier.maxPax}
                      onChange={(e) =>
                        patchTier(index, { maxPax: Math.floor(Number(e.target.value)) })
                      }
                      className="w-16"
                    />
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">SAR</span>
                    <input
                      type="number"
                      min="0"
                      aria-label="Visa price per person"
                      value={tier.pricePerPerson}
                      onChange={(e) =>
                        patchTier(index, { pricePerPerson: Number(e.target.value) })
                      }
                      className="w-28 font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setTiers((c) => c.filter((_, i) => i !== index));
                        touch();
                      }}
                      aria-label="Remove tier"
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const last = tiers[tiers.length - 1];
                const min = last ? last.maxPax + 1 : 1;
                setTiers((c) => [...c, { minPax: min, maxPax: min, pricePerPerson: 0 }]);
                touch();
              }}
              className="btn-outline mt-4 text-sm"
            >
              + Add group size
            </button>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
            <h2 className="font-display text-xl text-brand-blue-deep">
              Other visa prices
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Flat per-person visas for private transport, and the infant rate.
            </p>
            <div className="mt-5 space-y-4">
              {(
                [
                  { key: "fullPrivateVisa", label: "Full private transport visa", hint: "Every leg in the customer's own vehicle." },
                  { key: "partialPrivateVisa", label: "Partial private transport visa", hint: "Some legs private, some by bus." },
                  { key: "infantVisa", label: "Infant visa (under 2)", hint: "Charged per infant." },
                ] as const
              ).map((f) => (
                <div
                  key={f.key}
                  className="flex items-center justify-between gap-4 rounded-xl border border-black/10 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-brand-blue-deep">{f.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{f.hint}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">SAR</span>
                    <input
                      type="number"
                      min="0"
                      aria-label={f.label}
                      value={fees[f.key]}
                      onChange={(e) => patchFee(f.key, Number(e.target.value))}
                      className="w-28 font-semibold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* -------------------------------------------------- Vehicles tab */}
      {tab === "vehicles" && (
        <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
          <h2 className="font-display text-xl text-brand-blue-deep">Vehicle fleet</h2>
          <p className="mt-1 text-sm text-slate-500">
            The seat limit decides which vehicles a group can choose. Bigger
            groups get more than one vehicle automatically. Inactive vehicles
            are hidden from customers.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {vehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className={`rounded-2xl border p-5 transition ${vehicle.active ? "border-black/10" : "border-dashed border-black/15 bg-slate-50 opacity-70"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <input
                    value={vehicle.name}
                    placeholder="Vehicle name"
                    aria-label="Vehicle name"
                    onChange={(e) => patchVehicle(index, { name: e.target.value })}
                    className="min-w-0 flex-1 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setVehicles((c) => c.filter((_, i) => i !== index));
                      touch();
                    }}
                    aria-label={`Remove ${vehicle.name || "vehicle"}`}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" /></svg>
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <label htmlFor={`seats-${vehicle.id}`} className="mb-0 text-xs text-slate-500">
                      Seats
                    </label>
                    <input
                      id={`seats-${vehicle.id}`}
                      type="number"
                      min="1"
                      value={vehicle.seats}
                      onChange={(e) =>
                        patchVehicle(index, { seats: Math.floor(Number(e.target.value)) })
                      }
                      className="w-20"
                    />
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={vehicle.active}
                      onChange={(e) => patchVehicle(index, { active: e.target.checked })}
                      className="h-4 w-4"
                    />
                    Active
                  </label>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setVehicles((c) => [
                  ...c,
                  { id: `vehicle-${Date.now().toString(36)}`, name: "", seats: 4, active: true },
                ]);
                touch();
              }}
              className="flex min-h-[120px] items-center justify-center rounded-2xl border-2 border-dashed border-black/15 text-sm font-semibold text-slate-500 transition hover:border-brand-orange hover:text-brand-orange-dark"
            >
              + Add vehicle
            </button>
          </div>
        </section>
      )}

      {/* --------------------------------------------------- Sectors tab */}
      {tab === "sectors" && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {(["all", ...sectorKinds] as const).map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => setSectorFilter(kind)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wide transition ${
                  sectorFilter === kind
                    ? "bg-brand-orange text-brand-blue-deep shadow-card"
                    : "bg-white text-slate-500 ring-1 ring-black/10 hover:text-brand-blue-deep"
                }`}
              >
                {kind === "all" ? "All" : kindLabels[kind]}
              </button>
            ))}
            <p className="ml-auto text-xs text-slate-500">
              Empty price = quoted at inquiry
            </p>
          </div>

          {visibleSectors.map((sector) => (
            <section
              key={sector.id}
              className={`rounded-2xl border bg-white p-5 shadow-card sm:p-6 ${sector.active ? "border-black/5" : "border-dashed border-black/15 opacity-70"}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${kindBadge[sector.kind]}`}>
                  {kindLabels[sector.kind]}
                </span>
                <p className="font-display text-lg text-brand-blue-deep">
                  {transportLocationLabels[sector.from]} → {transportLocationLabels[sector.to]}
                  {sector.via && <span className="ml-2 text-sm text-slate-500">({sector.via})</span>}
                </p>
                <div className="ml-auto flex items-center gap-3">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600">
                    <input
                      type="checkbox"
                      checked={sector.active}
                      onChange={(e) => patchSector(sector.id, { active: e.target.checked })}
                      className="h-4 w-4"
                    />
                    Active
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSectors((c) => c.filter((s) => s.id !== sector.id));
                      touch();
                    }}
                    aria-label="Remove sector"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" /></svg>
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label htmlFor={`from-${sector.id}`} className="text-xs">From</label>
                  <select
                    id={`from-${sector.id}`}
                    value={sector.from}
                    onChange={(e) =>
                      patchSector(sector.id, { from: e.target.value as TransportLocation })
                    }
                  >
                    {transportLocations.map((l) => (
                      <option key={l.key} value={l.key}>{l.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`to-${sector.id}`} className="text-xs">To</label>
                  <select
                    id={`to-${sector.id}`}
                    value={sector.to}
                    onChange={(e) =>
                      patchSector(sector.id, { to: e.target.value as TransportLocation })
                    }
                  >
                    {transportLocations.map((l) => (
                      <option key={l.key} value={l.key}>{l.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`via-${sector.id}`} className="text-xs">Via / note (optional)</label>
                  <input
                    id={`via-${sector.id}`}
                    value={sector.via}
                    placeholder="e.g. via Badr"
                    onChange={(e) => patchSector(sector.id, { via: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor={`kind-${sector.id}`} className="text-xs">Type</label>
                  <select
                    id={`kind-${sector.id}`}
                    value={sector.kind}
                    onChange={(e) =>
                      patchSector(sector.id, { kind: e.target.value as SectorKind })
                    }
                  >
                    {sectorKinds.map((kind) => (
                      <option key={kind} value={kind}>{kindLabels[kind]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 border-t border-black/5 pt-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Price per vehicle (SAR)
                </p>
                <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {activeVehicles.map((v) => (
                    <div key={v.id}>
                      <label htmlFor={`price-${sector.id}-${v.id}`} className="text-xs">
                        {v.name || v.id}
                      </label>
                      <PriceInput
                        id={`price-${sector.id}-${v.id}`}
                        value={sector.prices[v.id] ?? null}
                        onChange={(price) => patchSectorPrice(sector.id, v.id, price)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}

          <button
            type="button"
            onClick={() => {
              setSectors((c) => [
                ...c,
                {
                  id: `sector-${Date.now().toString(36)}`,
                  from: "makkah-hotel",
                  to: "madinah-hotel",
                  via: "",
                  kind: sectorFilter === "all" ? "intercity" : sectorFilter,
                  prices: {},
                  active: true,
                  sortOrder: c.length + 1,
                },
              ]);
              touch();
            }}
            className="flex w-full items-center justify-center rounded-2xl border-2 border-dashed border-black/15 py-6 text-sm font-semibold text-slate-500 transition hover:border-brand-orange hover:text-brand-orange-dark"
          >
            + Add sector
          </button>
        </div>
      )}

      {/* ------------------------------------------------------ Fees tab */}
      {tab === "fees" && (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
            <h2 className="font-display text-xl text-brand-blue-deep">
              Automatic fees
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Added to the estimate automatically when they apply.
            </p>
            <div className="mt-5 space-y-4">
              {(
                [
                  { key: "selfHotelFee", label: "Self hotel fee", hint: "Per person, once per booking, when the customer arranges their own hotel.", unit: "SAR" },
                  { key: "nusukPerPersonNight", label: "Nusuk fee", hint: "Per person per night, for self hotels needing Nusuk registration.", unit: "SAR" },
                  { key: "busPerPersonSector", label: "Shared bus fare", hint: "Per person per city-to-city sector on partial private transport.", unit: "SAR" },
                  { key: "longStayFee", label: "Extended stay visa fee", hint: "Per person when the trip is longer than the day limit below.", unit: "SAR" },
                  { key: "longStayAfterDays", label: "Extended stay applies after", hint: "Trips longer than this many days pay the fee.", unit: "days" },
                  { key: "longStayMaxDays", label: "Extended stay valid up to", hint: "Beyond this, the team confirms terms at inquiry.", unit: "days" },
                ] as const
              ).map((f) => (
                <div
                  key={f.key}
                  className="flex items-center justify-between gap-4 rounded-xl border border-black/10 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-brand-blue-deep">{f.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{f.hint}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">{f.unit}</span>
                    <input
                      type="number"
                      min="0"
                      aria-label={f.label}
                      value={fees[f.key]}
                      onChange={(e) => patchFee(f.key, Number(e.target.value))}
                      className="w-24 font-semibold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
            <h2 className="font-display text-xl text-brand-blue-deep">
              Shown as notes only
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Displayed on the summary for transparency — never added to the
              estimate.
            </p>
            <div className="mt-5 space-y-4">
              {(
                [
                  { key: "visaCancellation", label: "Visa cancellation charge", hint: "Charged in addition to the visa price on cancellation." },
                  { key: "nonTravelling", label: "Non-travelling charge", hint: "For booked travelers who do not travel." },
                ] as const
              ).map((f) => (
                <div
                  key={f.key}
                  className="flex items-center justify-between gap-4 rounded-xl border border-black/10 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-brand-blue-deep">{f.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{f.hint}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">SAR</span>
                    <input
                      type="number"
                      min="0"
                      aria-label={f.label}
                      value={fees[f.key]}
                      onChange={(e) => patchFee(f.key, Number(e.target.value))}
                      className="w-24 font-semibold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-white/95 px-5 py-3 shadow-[0_-8px_30px_rgba(11,44,34,0.08)] backdrop-blur sm:px-8 lg:left-64">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <p
            className={`text-sm font-medium ${
              status.type === "err"
                ? "text-red-600"
                : status.type === "ok"
                  ? "text-emerald-700"
                  : dirty
                    ? "text-amber-700"
                    : "text-slate-400"
            }`}
          >
            {status.type === "err"
              ? status.msg
              : status.type === "ok"
                ? status.msg
                : dirty
                  ? "You have unsaved changes."
                  : "All changes saved."}
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={!configured || saving || !dirty}
            className="btn-orange disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
