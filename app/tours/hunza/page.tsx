import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPackage } from "@/lib/packagesStore";
import { PackageDetailView } from "@/app/packages/[slug]/page";
import { packageMetadata } from "@/lib/packageMeta";

export const dynamic = "force-dynamic";

const SLUG = "hunza";

export async function generateMetadata(): Promise<Metadata> {
  const pkg = await getPackage(SLUG);
  return pkg ? packageMetadata(pkg) : {};
}

export default async function Page() {
  const pkg = await getPackage(SLUG);
  if (!pkg) notFound();
  return <PackageDetailView pkg={pkg} />;
}
