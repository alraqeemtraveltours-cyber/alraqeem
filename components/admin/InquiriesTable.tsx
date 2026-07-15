"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import type { Inquiry } from "@/lib/inquiriesStore";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

const emailStatus = {
  sent: {
    label: "Sent to admin email",
    description: "The mail server accepted this notification.",
    classes: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  failed: {
    label: "Admin email failed",
    description: "The lead was saved, but its email notification failed.",
    classes: "border-red-200 bg-red-50 text-red-800",
  },
  pending: {
    label: "Admin email pending",
    description: "The email delivery result has not been recorded yet.",
    classes: "border-amber-200 bg-amber-50 text-amber-800",
  },
  not_configured: {
    label: "Admin email not sent",
    description: "SMTP email settings were not configured when this lead arrived.",
    classes: "border-red-200 bg-red-50 text-red-800",
  },
  unknown: {
    label: "Email status unavailable",
    description: "This lead was received before email tracking was enabled.",
    classes: "border-slate-200 bg-slate-50 text-slate-700",
  },
} as const;

type DateRange = "all" | "today" | "7d" | "30d";

export default function InquiriesTable({
  inquiries,
  configured,
}: {
  inquiries: Inquiry[];
  configured: boolean;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [service, setService] = useState("all");
  const [range, setRange] = useState<DateRange>("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const selectedEmailStatus = selected ? emailStatus[selected.adminEmailStatus] : null;

  const services = useMemo(() => {
    return Array.from(new Set(inquiries.map((i) => i.service))).sort();
  }, [inquiries]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const now = Date.now();

    return inquiries.filter((i) => {
      if (service !== "all" && i.service !== service) return false;

      if (range !== "all") {
        const created = new Date(i.createdAt);
        if (range === "today") {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);
          if (created.getTime() < todayStart.getTime()) return false;
        } else {
          const days = (now - created.getTime()) / 86400000;
          if (range === "7d" && days > 7) return false;
          if (range === "30d" && days > 30) return false;
        }
      }

      if (!q) return true;
      return [i.name, i.phone, i.email, i.city, i.service, i.message]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [inquiries, query, service, range]);

  async function handleDelete(id: string, label: string) {
    if (!confirm(`Delete inquiry from "${label}"?`)) return;
    setBusy(id);
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
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
    <div className="space-y-4">
      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-card">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, email..."
            className="h-11 rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-brand-blue"
          />

          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="h-11 rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-brand-blue"
          >
            <option value="all">All services</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={range}
            onChange={(e) => setRange(e.target.value as DateRange)}
            className="h-11 rounded-xl border border-black/10 px-3 text-sm outline-none focus:border-brand-blue"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>

          <div className="flex items-center justify-end text-sm text-slate-500">
            Showing {filtered.length} of {inquiries.length}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-card">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-paper/70 text-[11px] uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Service</th>
              <th className="px-5 py-3">Contact</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {filtered.map((i) => (
              <tr
                key={i.id}
                className="cursor-pointer align-top transition hover:bg-paper/40"
                onClick={() => setSelected(i)}
              >
                <td className="px-5 py-3 text-slate-600">{formatDate(i.createdAt)}</td>
                <td className="px-5 py-3 font-semibold text-slate-800">{i.name}</td>
                <td className="px-5 py-3 text-slate-700">{i.service}</td>
                <td className="px-5 py-3 text-slate-700">{i.phone}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(i.id, i.name);
                      }}
                      disabled={!configured || busy === i.id}
                      className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                      title="Delete"
                      aria-label={`Delete inquiry from ${i.name}`}
                    >
                      {busy === i.id ? (
                        <FontAwesomeIcon icon={faSpinner} spin className="h-4 w-4" />
                      ) : (
                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="px-5 py-8 text-center text-sm text-slate-500">No matching submissions found.</p>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Inquiry details</p>
                <h2 className="mt-1 text-2xl">{selected.name}</h2>
                <p className="mt-1 text-sm text-slate-500">{formatDate(selected.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                title="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-paper/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</p>
                <p className="mt-1 text-slate-800">{selected.phone}</p>
              </div>
              <div className="rounded-xl bg-paper/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</p>
                <p className="mt-1 text-slate-800">{selected.email || "-"}</p>
              </div>
              <div className="rounded-xl bg-paper/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">City</p>
                <p className="mt-1 text-slate-800">{selected.city || "-"}</p>
              </div>
              <div className="rounded-xl bg-paper/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Service</p>
                <p className="mt-1 text-slate-800">{selected.service}</p>
              </div>
            </div>

            {selectedEmailStatus && (
              <div className={`mt-4 flex items-start gap-3 rounded-xl border p-4 ${selectedEmailStatus.classes}`}>
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-current/10">
                  {selected.adminEmailStatus === "sent" ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 8v5m0 3h.01" /><circle cx="12" cy="12" r="9" /></svg>
                  )}
                </span>
                <div>
                  <p className="text-sm font-bold">{selectedEmailStatus.label}</p>
                  <p className="mt-0.5 text-xs opacity-75">{selectedEmailStatus.description}</p>
                  {selected.adminEmailSentAt && (
                    <p className="mt-1.5 text-xs font-semibold">Sent {formatDate(selected.adminEmailSentAt)}</p>
                  )}
                  {selected.adminEmailError && selected.adminEmailStatus !== "sent" && (
                    <p className="mt-1.5 text-xs">Reason: {selected.adminEmailError}</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 rounded-xl bg-paper/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Message</p>
              <p className="mt-1 whitespace-pre-wrap text-slate-800">{selected.message || "-"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
