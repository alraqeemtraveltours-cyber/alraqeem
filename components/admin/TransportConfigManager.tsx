"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  sectorKinds,
  transportLocations,
  type SectorKind,
  type TransportConfig,
  type TransportLocation,
  type TransportSector,
  type TransportVehicle,
  type VisaTier,
} from "@/lib/transportConfig";

// Prices are edited as strings so a half-typed value never snaps to 0; they
// are parsed once on save. Empty price = "quoted at inquiry".

type Status = { type: "idle" | "ok" | "err"; msg?: string };

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-card">
      <h2 className="font-display text-xl text-brand-blue-deep">{title}</h2>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
      <div className="mt-5">{children}</div>
    </section>
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
  const [tiers, setTiers] = useState<VisaTier[]>(initial.visaTiers);
  const [vehicles, setVehicles] = useState<TransportVehicle[]>(initial.vehicles);
  const [sectors, setSectors] = useState<TransportSector[]>(
    [...initial.sectors].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [fees, setFees] = useState(initial.fees);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });

  function patchTier(index: number, next: Partial<VisaTier>) {
    setTiers((current) =>
      current.map((t, i) => (i === index ? { ...t, ...next } : t))
    );
  }

  function patchVehicle(index: number, next: Partial<TransportVehicle>) {
    setVehicles((current) =>
      current.map((v, i) => (i === index ? { ...v, ...next } : v))
    );
  }

  function patchSector(index: number, next: Partial<TransportSector>) {
    setSectors((current) =>
      current.map((s, i) => (i === index ? { ...s, ...next } : s))
    );
  }

  function patchSectorPrice(index: number, vehicleId: string, raw: string) {
    setSectors((current) =>
      current.map((s, i) =>
        i === index
          ? {
              ...s,
              prices: {
                ...s.prices,
                [vehicleId]: raw === "" ? null : Number(raw),
              },
            }
          : s
      )
    );
  }

  function addVehicle() {
    const id = `vehicle-${Date.now().toString(36)}`;
    setVehicles((current) => [
      ...current,
      { id, name: "", seats: 4, active: true },
    ]);
  }

  function addSector() {
    const id = `sector-${Date.now().toString(36)}`;
    setSectors((current) => [
      ...current,
      {
        id,
        from: "makkah-hotel",
        to: "madinah-hotel",
        via: "",
        kind: "intercity",
        prices: {},
        active: true,
        sortOrder: current.length + 1,
      },
    ]);
  }

  function addTier() {
    const last = tiers[tiers.length - 1];
    const min = last ? last.maxPax + 1 : 1;
    setTiers((current) => [
      ...current,
      { minPax: min, maxPax: min, pricePerPerson: 0 },
    ]);
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
      setStatus({ type: "ok", msg: "Transport & visa prices saved." });
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

  const feeFields: {
    key: keyof TransportConfig["fees"];
    label: string;
    hint?: string;
  }[] = [
    { key: "infantVisa", label: "Infant visa (SAR)" },
    { key: "fullPrivateVisa", label: "Visa with full private transport (SAR per person)" },
    { key: "partialPrivateVisa", label: "Visa with partial private transport (SAR per person)" },
    { key: "selfHotelFee", label: "Self hotel fee (SAR per person)", hint: "When the customer arranges their own hotel." },
    { key: "nusukPerPersonNight", label: "Nusuk fee (SAR per person per night)", hint: "Self hotels without Nusuk provision." },
    { key: "longStayFee", label: "Long stay extra visa fee (SAR per person)" },
    { key: "longStayAfterDays", label: "Long stay fee applies after (days)" },
    { key: "longStayMaxDays", label: "Long stay fee valid up to (days)" },
    { key: "busPerPersonSector", label: "Shared bus (SAR per person per sector)", hint: "Inter-city bus legs on partial private." },
    { key: "visaCancellation", label: "Visa cancellation charge (SAR)", hint: "Shown as a note, not added to estimates." },
    { key: "nonTravelling", label: "Non-travelling charge (SAR)", hint: "Shown as a note, not added to estimates." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-brand-blue-deep">
          Transport &amp; Visa Prices
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-500">
          These prices drive the package calculator&apos;s visa and ground
          transport engine. Enter your own selling prices — the pre-filled
          values are the supplier reference sheet. Leave a vehicle price empty
          to show that leg as &quot;quoted at inquiry&quot;.
        </p>
      </div>

      {!configured && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Connect Supabase (and run the <code>transport_config</code>{" "}
          migration) to save changes.
        </div>
      )}

      <Section
        title="Sharing bus visa prices"
        hint="Visa per person when the group travels with full transport by sharing bus. Tiered by group size."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                <th className="pb-2 pr-4">From (pax)</th>
                <th className="pb-2 pr-4">To (pax)</th>
                <th className="pb-2 pr-4">Visa per person (SAR)</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {tiers.map((tier, index) => (
                <tr key={index}>
                  <td className="py-2 pr-4">
                    <input
                      type="number"
                      min="1"
                      value={tier.minPax}
                      onChange={(e) =>
                        patchTier(index, { minPax: Math.floor(Number(e.target.value)) })
                      }
                      className="w-24"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="number"
                      min="1"
                      value={tier.maxPax}
                      onChange={(e) =>
                        patchTier(index, { maxPax: Math.floor(Number(e.target.value)) })
                      }
                      className="w-24"
                    />
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="number"
                      min="0"
                      value={tier.pricePerPerson}
                      onChange={(e) =>
                        patchTier(index, { pricePerPerson: Number(e.target.value) })
                      }
                      className="w-32"
                    />
                  </td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setTiers((current) => current.filter((_, i) => i !== index))
                      }
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addTier}
          className="btn-outline mt-4 text-sm"
        >
          + Add tier
        </button>
      </Section>

      <Section
        title="Vehicles"
        hint="Seat limit decides which vehicles are offered for a group. Larger groups get more than one vehicle automatically."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className="rounded-xl border border-black/10 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label htmlFor={`vehicle-name-${vehicle.id}`} className="text-xs">
                    Name
                  </label>
                  <input
                    id={`vehicle-name-${vehicle.id}`}
                    value={vehicle.name}
                    placeholder="e.g. Staria"
                    onChange={(e) => patchVehicle(index, { name: e.target.value })}
                  />
                </div>
                <div className="w-24">
                  <label htmlFor={`vehicle-seats-${vehicle.id}`} className="text-xs">
                    Seats
                  </label>
                  <input
                    id={`vehicle-seats-${vehicle.id}`}
                    type="number"
                    min="1"
                    value={vehicle.seats}
                    onChange={(e) =>
                      patchVehicle(index, { seats: Math.floor(Number(e.target.value)) })
                    }
                  />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    checked={vehicle.active}
                    onChange={(e) => patchVehicle(index, { active: e.target.checked })}
                    className="h-4 w-4"
                  />
                  Active
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setVehicles((current) => current.filter((_, i) => i !== index))
                  }
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addVehicle}
          className="btn-outline mt-4 text-sm"
        >
          + Add vehicle
        </button>
      </Section>

      <Section
        title="Transport sectors"
        hint="Directional legs with a price per vehicle. Each direction is its own row (e.g. Makkah → Madina and Madina → Makkah). Empty price = quoted at inquiry."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                <th className="pb-2 pr-3">From</th>
                <th className="pb-2 pr-3">To</th>
                <th className="pb-2 pr-3">Via / note</th>
                <th className="pb-2 pr-3">Type</th>
                {vehicles.map((v) => (
                  <th key={v.id} className="pb-2 pr-3">
                    {v.name || v.id}
                  </th>
                ))}
                <th className="pb-2 pr-3">Active</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 align-top">
              {sectors.map((sector, index) => (
                <tr key={sector.id}>
                  <td className="py-2 pr-3">
                    <select
                      value={sector.from}
                      onChange={(e) =>
                        patchSector(index, { from: e.target.value as TransportLocation })
                      }
                    >
                      {transportLocations.map((l) => (
                        <option key={l.key} value={l.key}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      value={sector.to}
                      onChange={(e) =>
                        patchSector(index, { to: e.target.value as TransportLocation })
                      }
                    >
                      {transportLocations.map((l) => (
                        <option key={l.key} value={l.key}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 pr-3">
                    <input
                      value={sector.via}
                      placeholder="e.g. via Badr"
                      onChange={(e) => patchSector(index, { via: e.target.value })}
                      className="w-28"
                    />
                  </td>
                  <td className="py-2 pr-3">
                    <select
                      value={sector.kind}
                      onChange={(e) =>
                        patchSector(index, { kind: e.target.value as SectorKind })
                      }
                    >
                      {sectorKinds.map((kind) => (
                        <option key={kind} value={kind}>
                          {kind}
                        </option>
                      ))}
                    </select>
                  </td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="py-2 pr-3">
                      <input
                        type="number"
                        min="0"
                        value={sector.prices[v.id] ?? ""}
                        placeholder="—"
                        onChange={(e) => patchSectorPrice(index, v.id, e.target.value)}
                        className="w-24"
                      />
                    </td>
                  ))}
                  <td className="py-2 pr-3">
                    <input
                      type="checkbox"
                      checked={sector.active}
                      onChange={(e) => patchSector(index, { active: e.target.checked })}
                      className="mt-2 h-4 w-4"
                    />
                  </td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setSectors((current) => current.filter((_, i) => i !== index))
                      }
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addSector}
          className="btn-outline mt-4 text-sm"
        >
          + Add sector
        </button>
      </Section>

      <Section
        title="Flat visas, fees and rules"
        hint="Private-transport visas are flat per person. The rest are the automatic extra fees."
      >
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {feeFields.map((f) => (
            <div key={f.key}>
              <label htmlFor={`fee-${f.key}`}>{f.label}</label>
              <input
                id={`fee-${f.key}`}
                type="number"
                min="0"
                value={fees[f.key]}
                onChange={(e) =>
                  setFees((current) => ({
                    ...current,
                    [f.key]: Number(e.target.value),
                  }))
                }
              />
              {f.hint && (
                <p className="mt-1 text-xs text-slate-500">{f.hint}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {status.type === "ok" && (
        <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          {status.msg}
        </p>
      )}
      {status.type === "err" && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {status.msg}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={!configured || saving}
        className="btn-orange disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Transport & Visa Prices"}
      </button>
    </div>
  );
}
