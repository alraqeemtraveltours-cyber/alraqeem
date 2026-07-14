import Link from "next/link";
import { getPackages, isSupabaseConfigured } from "@/lib/packagesStore";
import { listMedia } from "@/lib/mediaStore";
import { getInquiries } from "@/lib/inquiriesStore";
import { getSarExchangeRate } from "@/lib/exchangeRateStore";
import ExchangeRateForm from "@/components/admin/ExchangeRateForm";

export const dynamic = "force-dynamic";

type IconName =
  | "package"
  | "star"
  | "clock"
  | "message"
  | "image"
  | "calculator"
  | "ticket"
  | "settings"
  | "arrow"
  | "plus";

const iconPaths: Record<IconName, string> = {
  package: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.3 7 12 12l8.7-5M12 22V12",
  star: "m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-16v6l4 2",
  message: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z",
  image: "M3 5h18v14H3Zm0 10 5-5 4 4 3-3 6 6M16 9h.01",
  calculator: "M4 3h16v18H4Zm4 4h8M8 11h2m2 0h2m2 0h1M8 15h2m2 0h2m2 0h1M8 18h6",
  ticket: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Zm11-4v14",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7-3a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1l-.4-2.5h-4L10 6a7 7 0 0 0-1.7 1L5.9 6 4 9.5 6 11a7 7 0 0 0 0 2l-2 1.5L5.9 18l2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5a7 7 0 0 0 .1-1Z",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  plus: "M12 5v14M5 12h14",
};

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={iconPaths[name]} />
    </svg>
  );
}

function formatInquiryDate(value: string) {
  const date = new Date(value);
  const today = new Date();
  const diff = Math.floor((today.getTime() - date.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  return date.toLocaleDateString("en-PK", { day: "numeric", month: "short" });
}

export default async function AdminDashboard() {
  const [packages, media, inquiries, exchangeRate] = await Promise.all([
    getPackages(),
    listMedia(),
    getInquiries(),
    getSarExchangeRate(),
  ]);

  const featured = packages.filter((item) => item.featured).length;
  const expiringSoon = packages.filter((item) => {
    if (!item.expiryDate) return false;
    const days = (new Date(item.expiryDate).getTime() - Date.now()) / 86400000;
    return days >= 0 && days <= 14;
  }).length;
  const newThisWeek = inquiries.filter(
    (item) => Date.now() - new Date(item.createdAt).getTime() <= 7 * 86400000,
  ).length;

  const stats: Array<{
    label: string;
    value: number;
    detail: string;
    href: string;
    icon: IconName;
    tone: string;
  }> = [
    { label: "Total packages", value: packages.length, detail: `${featured} currently featured`, href: "/admin/packages", icon: "package", tone: "bg-emerald-50 text-emerald-700" },
    { label: "Customer inquiries", value: inquiries.length, detail: `${newThisWeek} received this week`, href: "/admin/inquiries", icon: "message", tone: "bg-blue-50 text-blue-700" },
    { label: "Media library", value: media.length, detail: "Images ready to use", href: "/admin/media", icon: "image", tone: "bg-violet-50 text-violet-700" },
    { label: "Featured offers", value: featured, detail: expiringSoon ? `${expiringSoon} expiring soon` : "No offers expiring soon", href: "/admin/packages", icon: "star", tone: "bg-amber-50 text-amber-700" },
  ];

  const quickActions: Array<{ label: string; detail: string; href: string; icon: IconName }> = [
    { label: "Add a package", detail: "Publish a new travel offer", href: "/admin/packages/new", icon: "package" },
    { label: "Calculator prices", detail: "Manage hotels and services", href: "/admin/calculator", icon: "calculator" },
    { label: "Manage tickets", detail: "Update current flight deals", href: "/admin/tickets", icon: "ticket" },
    { label: "Site settings", detail: "Edit contact and social details", href: "/admin/settings", icon: "settings" },
  ];

  return (
    <main className="mx-auto w-full max-w-[1500px] pb-12">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Here&apos;s what is happening across Al Raqeem today.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/" target="_blank" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-brand-blue-deep shadow-sm transition hover:border-brand-orange/50 hover:shadow-card">
            View website <Icon name="arrow" className="h-4 w-4 -rotate-45" />
          </Link>
          <Link href="/admin/packages/new" className="btn-orange !min-h-11 !px-5 !py-2.5">
            <Icon name="plus" className="h-4 w-4" /> Add package
          </Link>
        </div>
      </header>

      {!isSupabaseConfigured && (
        <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200 font-bold">!</span>
          <p><strong>Supabase isn&apos;t connected.</strong> Seed data is currently shown. Add the environment keys and run <code>supabase/schema.sql</code> to go live.</p>
        </div>
      )}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(10,33,26,0.04)] transition hover:-translate-y-0.5 hover:border-brand-orange/30 hover:shadow-card">
            <div className="flex items-start justify-between gap-4">
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.tone}`}><Icon name={stat.icon} /></span>
              <Icon name="arrow" className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-orange-dark" />
            </div>
            <p className="mt-5 font-display text-4xl leading-none text-brand-blue-deep">{stat.value}</p>
            <p className="mt-2 text-sm font-bold text-brand-blue-deep">{stat.label}</p>
            <p className="mt-1 text-xs text-slate-400">{stat.detail}</p>
          </Link>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.75fr)]">
        <div className="overflow-hidden rounded-3xl border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(10,33,26,0.04)]">
          <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-5 sm:px-6">
            <div>
              <p className="text-base font-bold text-brand-blue-deep">Recent inquiries</p>
              <p className="mt-1 text-xs text-slate-400">Latest customer requests from your website</p>
            </div>
            <Link href="/admin/inquiries" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange-dark hover:text-brand-blue">
              View all <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>

          {inquiries.length ? (
            <div className="divide-y divide-black/[0.05]">
              {inquiries.slice(0, 5).map((inquiry) => (
                <Link key={inquiry.id} href="/admin/inquiries" className="group grid gap-3 px-5 py-4 transition hover:bg-brand-blue-deep/[0.025] sm:grid-cols-[minmax(0,1fr)_minmax(140px,0.5fr)_auto] sm:items-center sm:px-6">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-sm font-bold uppercase text-brand-blue">
                      {inquiry.name.slice(0, 1)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-brand-blue-deep">{inquiry.name}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-400">{inquiry.phone}{inquiry.city ? ` · ${inquiry.city}` : ""}</p>
                    </div>
                  </div>
                  <span className="w-fit rounded-full bg-paper px-3 py-1 text-xs font-semibold text-slate-600">{inquiry.service}</span>
                  <span className="text-xs font-medium text-slate-400 group-hover:text-brand-orange-dark">{formatInquiryDate(inquiry.createdAt)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper text-slate-400"><Icon name="message" /></span>
              <p className="mt-4 text-sm font-bold text-brand-blue-deep">No inquiries yet</p>
              <p className="mt-1 text-xs text-slate-400">New website inquiries will appear here.</p>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-brand-blue-deep p-5 text-white shadow-lift sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-luxe text-brand-orange">Quick actions</p>
              <h2 className="mt-2 font-display text-2xl text-white">Manage your website</h2>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-brand-orange"><Icon name="arrow" /></span>
          </div>
          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href} className="group flex items-center gap-3 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-brand-orange transition group-hover:bg-brand-orange group-hover:text-brand-blue-deep"><Icon name={action.icon} className="h-[18px] w-[18px]" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-white">{action.label}</span>
                  <span className="mt-0.5 block text-xs text-white/45">{action.detail}</span>
                </span>
                <Icon name="arrow" className="h-4 w-4 text-white/30 transition group-hover:translate-x-1 group-hover:text-brand-orange" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.75fr)]">
        <ExchangeRateForm initial={exchangeRate} />
        <div className="rounded-3xl border border-black/[0.06] bg-white p-5 shadow-[0_8px_30px_rgba(10,33,26,0.04)] sm:p-6">
          <div className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${expiringSoon ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>
              <Icon name={expiringSoon ? "clock" : "star"} className="h-[18px] w-[18px]" />
            </span>
            <div>
              <p className="text-sm font-bold text-brand-blue-deep">Offer health</p>
              <p className="mt-0.5 text-xs text-slate-400">Expiry status across packages</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl bg-paper p-4">
            <div className="flex items-end justify-between gap-3">
              <p className="font-display text-3xl text-brand-blue-deep">{expiringSoon}</p>
              <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${expiringSoon ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                {expiringSoon ? "Needs attention" : "All clear"}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{expiringSoon ? `${expiringSoon} package offer${expiringSoon === 1 ? " is" : "s are"} due to expire within 14 days.` : "No package offers are due to expire in the next 14 days."}</p>
          </div>
          <Link href="/admin/packages" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange-dark hover:text-brand-blue">Review packages <Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  );
}
