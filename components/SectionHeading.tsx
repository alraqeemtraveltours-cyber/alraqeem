export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "dark" | "light"; // light = for use on dark backgrounds
}) {
  const centered = align === "center";
  return (
    <div
      className={`mb-12 max-w-2xl ${centered ? "mx-auto text-center" : ""}`}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2
        className={`mt-3 text-3xl sm:text-4xl lg:text-[2.6rem] lg:leading-[1.1] ${
          tone === "light" ? "text-white" : ""
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base leading-relaxed ${
            tone === "light" ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {description}
        </p>
      )}
      <div className={`gold-rule mt-6 ${centered ? "mx-auto" : ""}`} />
    </div>
  );
}
