import type { Metadata } from "next";
import { cookies } from "next/headers";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { adminLogin } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get("admin_session")?.value === "authenticated";

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-ink p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <span className="font-display text-2xl text-white">Al Raqeem</span>
            <span className="ml-2 rounded-full bg-brand-orange/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-orange">
              Admin
            </span>
            <p className="mt-3 text-sm text-slate-400">Enter passcode to continue</p>
          </div>
          <form action={adminLogin} className="space-y-4">
            <input
              type="password"
              name="passcode"
              placeholder="Passcode"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-blue px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper lg:flex">
      <AdminSidebar />
      <div className="flex-1 px-5 py-8 sm:px-8 lg:px-10">{children}</div>
    </div>
  );
}
