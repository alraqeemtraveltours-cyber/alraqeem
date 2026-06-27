"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatFare, type Ticket } from "@/lib/tickets";

export default function TicketsTable({
  tickets,
  configured,
}: {
  tickets: Ticket[];
  configured: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function handleDelete(slug: string, label: string) {
    if (!confirm(`Delete "${label}"?`)) return;
    setBusy(slug);
    try {
      const res = await fetch(`/api/tickets/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-paper text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Route</th>
            <th className="hidden px-5 py-3 font-semibold sm:table-cell">Category</th>
            <th className="hidden px-5 py-3 font-semibold md:table-cell">Fare</th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {tickets.map((t) => (
            <tr key={t.slug}>
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-brand-blue-deep">
                    {t.sector}
                  </span>
                  {t.featured && (
                    <span className="rounded-full bg-brand-orange/20 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-orange-dark">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {t.airline} · {t.tripType}
                  {t.baggage ? ` · ${t.baggage}` : ""}
                </p>
              </td>
              <td className="hidden px-5 py-3 text-slate-600 sm:table-cell">
                {t.category}
              </td>
              <td className="hidden px-5 py-3 text-slate-600 md:table-cell">
                {formatFare(t.fare)}
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-1">
                  <Link
                    href={`/admin/tickets/${t.slug}`}
                    className="rounded-lg p-2 text-brand-blue transition hover:bg-brand-blue/10"
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(t.slug, t.sector)}
                    disabled={!configured || busy === t.slug}
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                    title="Delete"
                  >
                    {busy === t.slug
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    }
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {tickets.length === 0 && (
        <p className="px-5 py-8 text-center text-sm text-slate-500">
          No flight deals yet. Click “Add Ticket” to create one.
        </p>
      )}
    </div>
  );
}
