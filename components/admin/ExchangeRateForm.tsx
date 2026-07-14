"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SarExchangeRate } from "@/lib/exchangeRateStore";

export default function ExchangeRateForm({
  initial,
}: {
  initial: SarExchangeRate;
}) {
  const router = useRouter();
  const [rate, setRate] = useState(String(initial.rate));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/exchange-rate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rate }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to update rate.");
      setRate(String(data.exchangeRate.rate));
      setMessage("Exchange rate updated.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to update rate.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(10,33,26,0.04)] sm:p-6">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-orange/15 font-display text-lg text-brand-orange-dark">
          ﷼
        </span>
        <div>
          <p className="eyebrow">Daily exchange rate</p>
          <h2 className="mt-1 text-xl font-semibold">Saudi Riyal to Pakistani Rupee</h2>
          <p className="mt-1 text-sm text-slate-500">
            Calculator PKR totals update immediately when this rate changes.
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-paper p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="sar-rate">1 SAR equals (PKR)</label>
          <input
            id="sar-rate"
            type="number"
            min="0.0001"
            step="0.0001"
            value={rate}
            onChange={(event) => {
              setRate(event.target.value);
              setMessage("");
              setError("");
            }}
            required
          />
        </div>
        <button type="submit" disabled={busy} className="btn-orange min-h-[46px] shrink-0 !px-5 !py-2.5 disabled:opacity-50">
          {busy ? "Updating…" : "Update Daily Rate"}
        </button>
      </div>
      {initial.updatedAt && (
        <p className="mt-3 text-xs text-slate-400">
          Last updated {new Date(initial.updatedAt).toLocaleString("en-PK")}
        </p>
      )}
      {message && <p className="mt-3 text-sm font-semibold text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}
    </form>
  );
}
