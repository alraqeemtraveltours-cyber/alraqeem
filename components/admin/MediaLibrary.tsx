"use client";

import { useState } from "react";

type MediaItem = { name: string; path: string; url: string };

export default function MediaLibrary({
  initial,
  configured,
}: {
  initial: MediaItem[];
  configured: boolean;
}) {
  const [items, setItems] = useState<MediaItem[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/media", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed.");
        setItems((prev) => [data.media, ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(path: string) {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      setItems((prev) => prev.filter((i) => i.path !== path));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    }
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-blue/30 bg-white p-10 text-center transition hover:border-brand-blue/60 ${
          !configured || uploading ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1C6B53" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
        </svg>
        <p className="mt-3 font-semibold text-brand-blue-deep">
          {uploading ? "Uploading…" : "Click to upload images"}
        </p>
        <p className="mt-1 text-xs text-slate-500">PNG or JPG, up to 8 MB each</p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          disabled={!configured || uploading}
          className="hidden"
        />
      </label>

      {!configured && (
        <p className="mt-3 text-sm text-amber-700">
          Connect Supabase and create the <code>media</code> storage bucket
          (run <code>supabase/schema.sql</code>) to enable uploads.
        </p>
      )}
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((m) => (
          <div
            key={m.path}
            className="group overflow-hidden rounded-xl border border-black/5 bg-white shadow-card"
          >
            <div className="relative aspect-square">
              <img
                src={m.url}
                alt={m.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleDelete(m.path)}
                className="absolute right-2 top-2 rounded-lg bg-black/60 px-2 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 hover:bg-red-600"
              >
                Delete
              </button>
            </div>
            <button
              type="button"
              onClick={() => copyUrl(m.url)}
              className="w-full px-3 py-2 text-left text-xs font-semibold text-brand-blue hover:bg-brand-blue/5"
            >
              {copied === m.url ? "Copied!" : "Copy URL"}
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && configured && (
        <p className="mt-8 text-center text-sm text-slate-500">
          No images uploaded yet.
        </p>
      )}
    </div>
  );
}
