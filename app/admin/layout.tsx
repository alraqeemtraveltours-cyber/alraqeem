import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

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
            <Image
              src="/logo.png"
              alt="Al Raqeem logo"
              width={120}
              height={120}
              priority
              className="mx-auto h-20 w-20 object-contain"
            />
          </div>
          <AdminLoginForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ed] lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 xl:px-12">{children}</div>
    </div>
  );
}
