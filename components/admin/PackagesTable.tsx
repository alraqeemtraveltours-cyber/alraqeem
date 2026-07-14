"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import { priceLabel, type TravelPackage } from "@/lib/packages";

export default function PackagesTable({
  packages,
  configured,
}: {
  packages: TravelPackage[];
  configured: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(slug);
    try {
      const res = await fetch(`/api/packages/${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    } finally {
      setBusy(null);
    }
  }

  function expiryLabel(p: TravelPackage) {
    if (!p.expiryDate) return null;
    const expired = new Date(p.expiryDate) < new Date();
    return (
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
          expired
            ? "bg-red-100 text-red-700"
            : "bg-emerald-100 text-emerald-700"
        }`}
      >
        {expired ? "Expired" : "Until"} {p.expiryDate}
      </span>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-paper text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3 font-semibold">Package</th>
            <th className="hidden px-5 py-3 font-semibold sm:table-cell">
              Category
            </th>
            <th className="hidden px-5 py-3 font-semibold md:table-cell">
              Price
            </th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/5">
          {packages.map((p) => (
            <tr key={p.slug} className="align-middle">
              <td className="px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-brand-blue-deep">
                    {p.title}
                  </span>
                  {p.featured && (
                    <span className="rounded-full bg-brand-orange/20 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-orange-dark">
                      Featured
                    </span>
                  )}
                  {expiryLabel(p)}
                </div>
                <p className="text-xs text-slate-500">{p.duration}</p>
              </td>
              <td className="hidden px-5 py-3 text-slate-600 sm:table-cell">
                {p.category}
              </td>
              <td className="hidden px-5 py-3 text-slate-600 md:table-cell">
                {priceLabel(p)}
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-1">
                  <Link
                    href={`/admin/packages/${p.slug}`}
                    className="rounded-lg p-2 text-brand-blue transition hover:bg-brand-blue/10"
                    title="Edit"
                    aria-label={`Edit ${p.title}`}
                  >
                    <FontAwesomeIcon icon={faPen} className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.slug, p.title)}
                    disabled={!configured || busy === p.slug}
                    className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                    title="Delete"
                    aria-label={`Delete ${p.title}`}
                  >
                    {busy === p.slug
                      ? <FontAwesomeIcon icon={faSpinner} spin className="h-4 w-4" />
                      : <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                    }
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {packages.length === 0 && (
        <p className="px-5 py-8 text-center text-sm text-slate-500">
          No packages yet. Click “Add Package” to create one.
        </p>
      )}
    </div>
  );
}
