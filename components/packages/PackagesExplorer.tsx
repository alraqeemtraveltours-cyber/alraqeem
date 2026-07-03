"use client";

import { useState } from "react";
import { TravelPackage } from "@/lib/packages";
import { durationBand, tierOf } from "@/lib/packageDetail";
import PackageInquiryCard from "@/components/packages/PackageInquiryCard";

type Choice = { value: string; label: string };

const VERTICALS: Choice[] = [
  { value: "all", label: "All" },
  { value: "Umrah & Hajj", label: "Umrah and Hajj" },
  { value: "International", label: "International" },
];
const DURATIONS: Choice[] = [
  { value: "all", label: "All" },
  { value: "short", label: "Up to 10 days" },
  { value: "mid", label: "11 to 20 days" },
  { value: "long", label: "21 plus days" },
];
const TIERS: Choice[] = [
  { value: "all", label: "All" },
  { value: "Economy", label: "Economy" },
  { value: "Premium", label: "Premium" },
];

function ChipRow({
  label,
  choices,
  value,
  onChange,
}: {
  label: string;
  choices: Choice[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 sm:w-24 sm:shrink-0">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {choices.map((c) => {
          const active = value === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => onChange(c.value)}
              aria-pressed={active}
              className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "border-brand-blue bg-brand-blue text-white"
                  : "border-black/10 bg-white text-slate-600 hover:border-brand-blue/40"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Group({
  eyebrow,
  title,
  intro,
  items,
  whatsapp,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  items: TravelPackage[];
  whatsapp: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-14 first:mt-0">
      <div className="mb-8 max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-3xl sm:text-4xl">{title}</h2>
        <div className="gold-rule mt-5" />
        <p className="mt-4 text-base leading-relaxed text-slate-600">{intro}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((p) => (
          <PackageInquiryCard key={p.slug} pkg={p} whatsapp={whatsapp} />
        ))}
      </div>
    </div>
  );
}

export default function PackagesExplorer({
  packages,
  whatsapp,
  intro,
}: {
  packages: TravelPackage[];
  whatsapp: string;
  intro?: string;
}) {
  const [vertical, setVertical] = useState("all");
  const [duration, setDuration] = useState("all");
  const [tier, setTier] = useState("all");

  const filtered = packages.filter((p) => {
    const okVertical = vertical === "all" || p.category === vertical;
    const okDuration =
      duration === "all" || durationBand(p.duration) === duration;
    const okTier = tier === "all" || tierOf(p) === tier;
    return okVertical && okDuration && okTier;
  });

  const umrah = filtered.filter((p) => p.category === "Umrah & Hajj");
  const intl = filtered.filter((p) => p.category !== "Umrah & Hajj");
  const reset = () => {
    setVertical("all");
    setDuration("all");
    setTier("all");
  };

  return (
    <div>
      <div className="mb-12 flex flex-col gap-4 rounded-3xl border border-black/5 bg-white p-5 shadow-card sm:p-6">
        <ChipRow
          label="Type"
          choices={VERTICALS}
          value={vertical}
          onChange={setVertical}
        />
        <ChipRow
          label="Duration"
          choices={DURATIONS}
          value={duration}
          onChange={setDuration}
        />
        <ChipRow label="Tier" choices={TIERS} value={tier} onChange={setTier} />
      </div>

      {intro && (
        <p className="mb-12 max-w-3xl text-base leading-relaxed text-slate-700">
          {intro}
        </p>
      )}

      <Group
        eyebrow={`${umrah.length} package${umrah.length === 1 ? "" : "s"}`}
        title="Umrah and Hajj"
        intro="Pilgrimage packages from Pakistan across economy, premium, and five star, from Peshawar and Islamabad, with visa, flights, hotels near the Haram, and guided Ziyarat."
        items={umrah}
        whatsapp={whatsapp}
      />
      <Group
        eyebrow={`${intl.length} package${intl.length === 1 ? "" : "s"}`}
        title="International"
        intro="International tour packages from Pakistan to Dubai, Turkey, Baku, and Malaysia with Thailand, with visa, flights, hotels, and sightseeing in one booking."
        items={intl}
        whatsapp={whatsapp}
      />

      {filtered.length === 0 && (
        <div className="rounded-3xl border border-black/5 bg-white p-10 text-center shadow-card">
          <p className="text-slate-600">
            No packages match these filters for now.
          </p>
          <button
            type="button"
            onClick={reset}
            className="btn-outline mt-4 !py-2.5 text-sm"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
