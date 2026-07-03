// Airline partner logo marquee. Real partner logos from /public/partners.
type Partner = {
  src: string;
  alt: string;
  big?: boolean;
  xl?: boolean;
  medium?: boolean;
};

const partners: Partner[] = [
  { src: "/partners/qatar-airways.jpg", alt: "Qatar Airways", big: true },
  { src: "/partners/airblue.png", alt: "Airblue", xl: true },
  { src: "/partners/airsial.png", alt: "AirSial" },
  { src: "/partners/etihad.png", alt: "Etihad Airways", medium: true },
  { src: "/partners/saudia.png", alt: "Saudia", big: true },
  { src: "/partners/pia.png", alt: "PIA", big: true },
];

export default function AirlineStrip() {
  // Duplicate the set so the marquee loops seamlessly.
  const loop = [
    ...partners.map((p, i) => ({ ...p, key: `a-${i}` })),
    ...partners.map((p, i) => ({ ...p, key: `b-${i}` })),
  ];
  return (
    <section className="overflow-hidden border-y border-black/5 bg-white py-14">
      <div className="container-site mb-10 text-center">
        <p className="eyebrow">Airline Partners</p>
        <h2 className="mt-2 font-display text-2xl text-brand-blue-deep sm:text-3xl">
          Flights with airlines you trust
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          We ticket on Saudia, Qatar Airways, Etihad, PIA, Airblue, and AirSial,
          choosing the carrier with the best fare and schedule for your dates.
        </p>
      </div>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="animate-marquee flex w-max items-center gap-14">
          {loop.map((p) => (
            <div
              key={p.key}
              className="flex h-16 w-40 shrink-0 items-center justify-center rounded-2xl border border-black/5 bg-paper px-5 shadow-card"
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className={`max-w-full object-contain mix-blend-multiply ${p.xl ? "max-h-18" : p.big ? "max-h-14" : p.medium ? "max-h-12" : "max-h-10"}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
