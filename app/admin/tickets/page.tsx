import Link from "next/link";
import TicketsTable from "@/components/admin/TicketsTable";
import { getTickets } from "@/lib/ticketsStore";
import { isSupabaseConfigured } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export default async function AdminTicketsPage() {
  const tickets = await getTickets();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Tickets</p>
          <h1 className="mt-2 text-3xl">Flight deals</h1>
        </div>
        <Link href="/admin/tickets/new" className="btn-orange">
          + Add Ticket
        </Link>
      </div>
      <div className="gold-rule mt-5" />
      <div className="mt-8">
        <TicketsTable tickets={tickets} configured={isSupabaseConfigured} />
      </div>
    </div>
  );
}
