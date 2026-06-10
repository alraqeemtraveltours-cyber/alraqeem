import { formatFare, type Ticket } from "@/lib/tickets";
import RichText from "@/components/RichText";
import { waLink } from "@/lib/site";

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  const msg = `Assalam o Alaikum, I want to book the ${ticket.sector} (${ticket.airline}, ${ticket.tripType}) fare.`;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-center justify-between border-b border-black/5 bg-paper px-5 py-3">
        <span className="font-semibold text-brand-blue-deep">
          {ticket.airline}
        </span>
        <span className="rounded-full bg-brand-blue/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-blue-dark">
          {ticket.tripType}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-lg font-semibold text-brand-blue-deep">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#C5A253" aria-hidden="true">
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
          </svg>
          {ticket.sector}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
          {ticket.baggage && <span>Baggage: {ticket.baggage}</span>}
          {ticket.expiryDate && <span>Valid until {ticket.expiryDate}</span>}
        </div>

        {ticket.description && (
          <RichText html={ticket.description} className="mt-3 !text-sm" />
        )}

        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {ticket.fare === null ? "Fare" : "From"}
            </p>
            <p className="font-display text-2xl text-brand-blue-deep">
              {formatFare(ticket.fare)}
            </p>
          </div>
          <a
            href={waLink(msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-orange !px-5 !py-2.5 text-sm"
          >
            Book Fare
          </a>
        </div>
      </div>
    </article>
  );
}
