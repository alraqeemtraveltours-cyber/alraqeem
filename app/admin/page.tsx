import Link from "next/link";
import { getPackages, isSupabaseConfigured } from "@/lib/packagesStore";
import { listMedia } from "@/lib/mediaStore";
import { getInquiries } from "@/lib/inquiriesStore";
import { getSarExchangeRate } from "@/lib/exchangeRateStore";
import ExchangeRateForm from "@/components/admin/ExchangeRateForm";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const packages = await getPackages();
  const media = await listMedia();
  const inquiries = await getInquiries();
  const exchangeRate = await getSarExchangeRate();

  const featured = packages.filter((p) => p.featured).length;
  const expiringSoon = packages.filter((p) => {
    if (!p.expiryDate) return false;
    const days = (new Date(p.expiryDate).getTime() - Date.now()) / 86400000;
    return days >= 0 && days <= 14;
  }).length;

  const stats = [
    { label: "Packages", value: packages.length, href: "/admin/packages" },
    { label: "Featured", value: featured, href: "/admin/packages" },
    { label: "Expiring ≤14 days", value: expiringSoon, href: "/admin/packages" },
    { label: "Inquiries", value: inquiries.length, href: "/admin/inquiries" },
    { label: "Media files", value: media.length, href: "/admin/media" },
  ];

  return (
    <div>
      <p className="eyebrow">Dashboard</p>
      <h1 className="mt-2 text-3xl">Welcome back</h1>
      <div className="gold-rule mt-5" />

      {!isSupabaseConfigured && (
        <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-800">
          <strong>Supabase isn&apos;t connected yet.</strong> The dashboard is
          showing seed data. Add your keys to <code>.env.local</code> (or Vercel
          env) and run <code>supabase/schema.sql</code> to go live.
        </div>
      )}

      <div className="mt-8 max-w-2xl">
        <ExchangeRateForm initial={exchangeRate} />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-black/5 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift"
          >
            <p className="font-display text-4xl text-brand-blue-deep">
              {s.value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/admin/packages/new" className="btn-orange">
          + Add Package
        </Link>
        <Link href="/admin/media" className="btn-outline">
          Manage Media
        </Link>
      </div>
    </div>
  );
}
