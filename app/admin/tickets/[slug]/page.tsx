import { notFound } from "next/navigation";
import TicketForm from "@/components/admin/TicketForm";
import { getTicket } from "@/lib/ticketsStore";
import { isSupabaseConfigured } from "@/lib/packagesStore";
import { getCategoryNames } from "@/lib/categoriesStore";

export const dynamic = "force-dynamic";

export default async function EditTicketPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ticket = await getTicket(slug);
  if (!ticket) notFound();
  const categoryOptions = await getCategoryNames("ticket");

  return (
    <div>
      <p className="eyebrow">Tickets</p>
      <h1 className="mt-2 text-3xl">Edit flight deal</h1>
      <p className="mt-1 text-sm text-slate-500">{ticket.sector}</p>
      <div className="gold-rule mt-5" />
      <div className="mt-8">
        <TicketForm
          mode="edit"
          initial={ticket}
          configured={isSupabaseConfigured}
          categoryOptions={categoryOptions}
        />
      </div>
    </div>
  );
}
