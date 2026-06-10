import Link from "next/link";
import PackagesTable from "@/components/admin/PackagesTable";
import { getPackages, isSupabaseConfigured } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const packages = await getPackages();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Packages</p>
          <h1 className="mt-2 text-3xl">Manage packages</h1>
        </div>
        <Link href="/admin/packages/new" className="btn-orange">
          + Add Package
        </Link>
      </div>
      <div className="gold-rule mt-5" />

      <div className="mt-8">
        <PackagesTable packages={packages} configured={isSupabaseConfigured} />
      </div>
    </div>
  );
}
