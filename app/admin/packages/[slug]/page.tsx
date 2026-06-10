import { notFound } from "next/navigation";
import PackageForm from "@/components/admin/PackageForm";
import { getPackage, isSupabaseConfigured } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await getPackage(slug);
  if (!pkg) notFound();

  return (
    <div>
      <p className="eyebrow">Packages</p>
      <h1 className="mt-2 text-3xl">Edit package</h1>
      <p className="mt-1 text-sm text-slate-500">{pkg.title}</p>
      <div className="gold-rule mt-5" />
      <div className="mt-8">
        <PackageForm
          mode="edit"
          initial={pkg}
          configured={isSupabaseConfigured}
        />
      </div>
    </div>
  );
}
