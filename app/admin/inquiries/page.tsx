import InquiriesTable from "@/components/admin/InquiriesTable";
import { getInquiries } from "@/lib/inquiriesStore";
import { isSupabaseConfigured } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <div>
        <p className="eyebrow">Inquiries</p>
        <h1 className="mt-2 text-3xl">Form submissions</h1>
      </div>
      <div className="gold-rule mt-5" />

      <div className="mt-8">
        <InquiriesTable inquiries={inquiries} configured={isSupabaseConfigured} />
      </div>
    </div>
  );
}
