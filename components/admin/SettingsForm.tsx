"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SiteSettings } from "@/lib/settings";

const fields: { key: keyof SiteSettings; label: string; placeholder?: string }[] = [
  { key: "name", label: "Site name" },
  { key: "tagline", label: "Tagline" },
  { key: "phone", label: "Phone", placeholder: "+92 300 0000000" },
  { key: "whatsapp", label: "WhatsApp number", placeholder: "923000000000 (no + or spaces)" },
  { key: "email", label: "Email" },
  { key: "address", label: "Office address" },
  { key: "hours", label: "Opening hours" },
  { key: "facebook", label: "Facebook URL" },
  { key: "instagram", label: "Instagram URL" },
  { key: "youtube", label: "YouTube URL" },
  { key: "tiktok", label: "TikTok URL" },
];

export default function SettingsForm({
  initial,
  configured,
}: {
  initial: SiteSettings;
  configured: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<SiteSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "idle" | "ok" | "err"; msg?: string }>({
    type: "idle",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: "idle" });
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setStatus({ type: "ok", msg: "Settings saved." });
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
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {!configured && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          Connect Supabase (and create the <code>site_settings</code> table) to
          save changes.
        </div>
      )}
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key}>
            <label htmlFor={f.key}>{f.label}</label>
            <input
              id={f.key}
              value={form[f.key]}
              placeholder={f.placeholder}
              onChange={(e) =>
                setForm((s) => ({ ...s, [f.key]: e.target.value }))
              }
            />
          </div>
        ))}
      </div>

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
        type="submit"
        disabled={!configured || saving}
        className="btn-orange disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
