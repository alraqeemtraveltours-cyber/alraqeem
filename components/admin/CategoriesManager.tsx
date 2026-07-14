"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import type { CategoryItem, CategoryType } from "@/lib/categories";

export default function CategoriesManager({
  initial,
  configured,
}: {
  initial: CategoryItem[];
  configured: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("package");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add.");
      setName("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string, label: string) {
    if (!confirm(`Delete category "${label}"? Items keeping this name stay unchanged.`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete.");
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete.");
    }
  }

  const groups: { type: CategoryType; label: string }[] = [
    { type: "package", label: "Package categories" },
    { type: "ticket", label: "Ticket categories" },
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form onSubmit={add} className="space-y-4">
        <h2 className="text-2xl">Add category</h2>
        <div className="gold-rule mt-2" />
        {!configured && (
          <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            Connect Supabase to manage categories.
          </p>
        )}
        <div>
          <label htmlFor="cat-name">Name</label>
          <input
            id="cat-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Domestic, Honeymoon, Group"
          />
        </div>
        <div>
          <label htmlFor="cat-type">Used for</label>
          <select
            id="cat-type"
            value={type}
            onChange={(e) => setType(e.target.value as CategoryType)}
          >
            <option value="package">Packages</option>
            <option value="ticket">Tickets (flight deals)</option>
          </select>
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}
        <button
          type="submit"
          disabled={!configured || busy}
          className="btn-orange disabled:opacity-50"
        >
          {busy ? "Adding…" : "Add Category"}
        </button>
      </form>

      <div className="space-y-8">
        {groups.map((g) => {
          const items = initial.filter((c) => c.type === g.type);
          return (
            <div key={g.type}>
              <h2 className="text-xl">{g.label}</h2>
              <div className="gold-rule mt-2" />
              <ul className="mt-4 space-y-2">
                {items.map((c) => (
                  <li
                    key={c.id ?? c.name}
                    className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-4 py-3 shadow-card"
                  >
                    <span className="font-semibold text-brand-blue-deep">
                      {c.name}
                    </span>
                    {c.id ? (
                      <button
                        type="button"
                        onClick={() => remove(c.id!, c.name)}
                        disabled={!configured}
                        aria-label={`Delete ${c.name}`}
                        title="Delete"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:opacity-40"
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">seed</span>
                    )}
                  </li>
                ))}
                {items.length === 0 && (
                  <li className="text-sm text-slate-500">None yet.</li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
