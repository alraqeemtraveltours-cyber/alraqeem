import Link from "next/link";

// Umrah tier comparison. Attributes only, no price in any cell. Three tiers
// side by side on desktop, stacking to one column on mobile.
const tiers = [
  {
    name: "Economy",
    href: "/packages/economy-umrah-15-days",
    rows: [
      { k: "Duration", v: "15 days" },
      { k: "Hotels", v: "Walking or shuttle distance" },
      { k: "Room sharing", v: "Quad and shared" },
      { k: "Transport", v: "Shared ground transport" },
      { k: "Best suited", v: "Budget conscious pilgrims" },
    ],
  },
  {
    name: "Premium and five star",
    href: "/packages/premium-umrah-21-days",
    rows: [
      { k: "Duration", v: "21 days" },
      { k: "Hotels", v: "Near or facing the Haram" },
      { k: "Room sharing", v: "Triple and double" },
      { k: "Transport", v: "Private transport" },
      { k: "Best suited", v: "Comfort with worship" },
    ],
  },
  {
    name: "Ramadan",
    href: "/packages/ramadan-umrah-special",
    rows: [
      { k: "Duration", v: "10 to 30 days" },
      { k: "Hotels", v: "Near the Haram, booked early" },
      { k: "Room sharing", v: "Confirmed on quote" },
      { k: "Transport", v: "Arranged for your group" },
      { k: "Best suited", v: "Last Ashra and Laylat al-Qadr" },
    ],
  },
];

export default function TierCompare() {
  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className="flex flex-col rounded-3xl border border-black/5 bg-white p-6 shadow-card"
          >
            <h3 className="font-display text-xl text-brand-blue-deep">
              {t.name}
            </h3>
            <dl className="mt-4 flex-1 divide-y divide-black/5">
              {t.rows.map((r) => (
                <div key={r.k} className="flex justify-between gap-3 py-2.5">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {r.k}
                  </dt>
                  <dd className="text-right text-sm font-medium text-brand-blue-deep">
                    {r.v}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              href={t.href}
              className="btn-outline mt-5 w-full !py-2.5 text-sm"
            >
              View {t.name} Umrah
            </Link>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-slate-500">
        Room sharing and exact hotels are confirmed for your group when we
        quote. No prices are published, since airfare and hotel rates change
        weekly.
      </p>
    </div>
  );
}
