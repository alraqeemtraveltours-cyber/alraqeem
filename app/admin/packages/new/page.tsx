import PackageForm from "@/components/admin/PackageForm";
import { isSupabaseConfigured } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export default function NewPackagePage() {
  return (
    <div>
      <p className="eyebrow">Packages</p>
      <h1 className="mt-2 text-3xl">Add a package</h1>
      <div className="gold-rule mt-5" />
      <div className="mt-8">
        <PackageForm mode="create" configured={isSupabaseConfigured} />
      </div>
    </div>
  );
}
