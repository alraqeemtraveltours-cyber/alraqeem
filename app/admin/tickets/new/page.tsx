import TicketForm from "@/components/admin/TicketForm";
import { isSupabaseConfigured } from "@/lib/packagesStore";
import { getCategoryNames } from "@/lib/categoriesStore";

export const dynamic = "force-dynamic";

export default async function NewTicketPage() {
  const categoryOptions = await getCategoryNames("ticket");
  return (
    <div>
      <p className="eyebrow">Tickets</p>
      <h1 className="mt-2 text-3xl">Add a flight deal</h1>
      <div className="gold-rule mt-5" />
      <div className="mt-8">
        <TicketForm
          mode="create"
          configured={isSupabaseConfigured}
          categoryOptions={categoryOptions}
        />
      </div>
    </div>
  );
}
