// Semantically rich category content card. Sits inside a hub section to fill
// the space with topical, entity-dense prose for the category query. No price.
export default function SeoBlurb({
  eyebrow,
  title,
  paragraphs,
}: {
  eyebrow: string;
  title: string;
  paragraphs: string[];
}) {
  return (
    <div className="mt-10 rounded-3xl border border-black/5 bg-white p-7 shadow-card sm:p-9">
      <p className="eyebrow text-center">{eyebrow}</p>
      <h2 className="mt-2 text-center font-display text-2xl text-brand-blue-deep sm:text-3xl">
        {title}
      </h2>
      <div className="gold-rule mx-auto mt-4" />
      <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-700">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
