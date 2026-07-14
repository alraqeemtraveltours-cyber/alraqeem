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
  cardVariant = "default",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  items: TravelPackage[];
  whatsapp: string;
  cardVariant?: "default" | "umrah" | "tour";
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-14 first:mt-0">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-3xl sm:text-4xl">{title}</h2>
        <div className="gold-rule mx-auto mt-5" />
        <p className="mt-4 text-base leading-relaxed text-slate-600">{intro}</p>
      </div>
      <div
        className={`grid gap-6 sm:grid-cols-2 ${
          cardVariant === "umrah" ? "xl:grid-cols-3" : "xl:grid-cols-4"
        }`}
      >
        {items.map((p) => (
          <PackageInquiryCard
            key={p.slug}
            pkg={p}
            whatsapp={whatsapp}
            variant={cardVariant}
          />
        ))}
      </div>
    </div>
  );
}

export default function PackagesExplorer({
  packages,
  whatsapp,
  intro,
  scope = "all",
}: {
  packages: TravelPackage[];
  whatsapp: string;
  intro?: string;
  // "umrah" and "international" scope the explorer to one vertical, hiding the
  // Type filter (and, for tours, the Tier filter). "all" shows both groups.
  scope?: "all" | "umrah" | "international";
}) {
  const [vertical, setVertical] = useState("all");
  const [duration, setDuration] = useState("all");
  const [tier, setTier] = useState("all");

  const inScope = packages.filter((p) => {
    if (scope === "umrah") return p.category === "Umrah & Hajj";
    if (scope === "international") return p.category !== "Umrah & Hajj";
    return true;
  });

  const filtered = inScope.filter((p) => {
    const okVertical =
      scope !== "all" || vertical === "all" || p.category === vertical;
    const okDuration =
      duration === "all" || durationBand(p.duration) === duration;
    const okTier =
      scope === "international" || tier === "all" || tierOf(p) === tier;
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
      {scope !== "international" && (
        <div className="mb-12 flex flex-col gap-4 rounded-3xl border border-black/5 bg-white p-5 shadow-card sm:p-6">
          {scope === "all" && (
            <ChipRow
              label="Type"
              choices={VERTICALS}
              value={vertical}
              onChange={setVertical}
            />
          )}
          <ChipRow
            label="Duration"
            choices={DURATIONS}
            value={duration}
            onChange={setDuration}
          />
          <ChipRow
            label="Tier"
            choices={TIERS}
            value={tier}
            onChange={setTier}
          />
        </div>
      )}

      {intro && (
        <p className="mb-12 w-full text-center text-base leading-relaxed text-slate-700">
          {intro}
        </p>
      )}

      {scope !== "international" && (
        <Group
          eyebrow={`${umrah.length} package${umrah.length === 1 ? "" : "s"}`}
          title="Umrah and Hajj"
          intro="Pilgrimage packages from Pakistan across economy, premium, and five star, from Peshawar and Islamabad, with visa, flights, hotels near the Haram, and guided Ziyarat."
          items={umrah}
          whatsapp={whatsapp}
          cardVariant="umrah"
        />
      )}
      {scope !== "umrah" && (
        <Group
          eyebrow={`${intl.length} package${intl.length === 1 ? "" : "s"}`}
          title="International tours"
          intro="International tour packages from Pakistan to Dubai, Turkey, Baku, and Malaysia with Thailand, with visa, flights, hotels, and sightseeing in one booking."
          items={intl}
          whatsapp={whatsapp}
          cardVariant="tour"
        />
      )}

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
