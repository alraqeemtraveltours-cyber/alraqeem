"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "@/components/packages/DetailIcons";
import { waHref } from "@/lib/settings";
import { site } from "@/lib/site";

// One context aware lead capture widget. Full mode on the homepage shows every
// vertical, single mode on a silo or detail page shows only the parent vertical.
// Search is a qualified lead action, not a live search, so it opens a modal that
// collects name, city, and number, posts the lead, and hands off to WhatsApp
// prefilled with the vertical and criteria. Inquiry model, no live prices.

type FieldType = "select" | "text" | "date";

type Field = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
  required?: boolean;
  showIf?: (c: Record<string, string>) => boolean;
};

type Vertical = {
  id: string;
  label: string;
  icon: string;
  fields: Field[];
  defaults: Record<string, string>;
};

const PASSENGERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10 plus"];
const FROM = ["Peshawar", "Islamabad"];

const VERTICALS: Vertical[] = [
  {
    id: "umrah",
    label: "Umrah",
    icon: "moon",
    fields: [
      {
        key: "duration",
        label: "Duration",
        type: "select",
        options: ["7 days", "10 days", "14 days", "15 days", "21 days", "28 days"],
      },
      { key: "passengers", label: "Passengers", type: "select", options: PASSENGERS },
      {
        key: "packageType",
        label: "Package type",
        type: "select",
        options: ["Economy", "Premium", "5 Star", "Ramadan", "Umrah plus Tour combo"],
      },
      { key: "from", label: "Departing from", type: "select", options: FROM },
    ],
    defaults: {
      duration: "15 days",
      passengers: "2",
      packageType: "Economy",
      from: "Peshawar",
    },
  },
  {
    id: "hajj",
    label: "Hajj",
    icon: "person",
    fields: [
      {
        key: "scheme",
        label: "Scheme",
        type: "select",
        options: ["Private Hajj", "Government scheme via MORA"],
      },
      { key: "passengers", label: "Passengers", type: "select", options: PASSENGERS },
      { key: "from", label: "Departing from", type: "select", options: FROM },
    ],
    defaults: { scheme: "Private Hajj", passengers: "2", from: "Peshawar" },
  },
  {
    id: "tours",
    label: "Tours",
    icon: "pin",
    fields: [
      {
        key: "destination",
        label: "Destination",
        type: "select",
        options: ["Dubai", "Turkey", "Baku", "Malaysia and Thailand", "Other"],
      },
      {
        key: "destinationOther",
        label: "Your destination",
        type: "text",
        placeholder: "Type your destination",
        required: true,
        showIf: (c) => c.destination === "Other",
      },
      { key: "passengers", label: "Passengers", type: "select", options: PASSENGERS },
      {
        key: "when",
        label: "Departure date or month",
        type: "text",
        placeholder: "For example March 2027",
      },
      { key: "from", label: "Departing from", type: "select", options: FROM },
    ],
    defaults: { destination: "Dubai", passengers: "2", when: "", from: "Peshawar" },
  },
  {
    id: "visa",
    label: "Visa",
    icon: "document",
    fields: [
      {
        key: "country",
        label: "Going to",
        type: "select",
        options: [
          "UAE",
          "Saudi Arabia",
          "Turkey",
          "Malaysia",
          "Thailand",
          "Azerbaijan",
          "Schengen",
          "United Kingdom",
        ],
      },
      {
        key: "visaType",
        label: "Visa type",
        type: "select",
        options: ["Visit", "Tourist"],
      },
    ],
    defaults: { country: "UAE", visaType: "Visit" },
  },
  {
    id: "flights",
    label: "Flights",
    icon: "plane",
    fields: [
      {
        key: "trip",
        label: "Trip",
        type: "select",
        options: ["Return", "One way"],
      },
      { key: "fromCity", label: "From", type: "text", placeholder: "Departure city", required: true },
      { key: "toCity", label: "To", type: "text", placeholder: "Destination city", required: true },
      { key: "depart", label: "Departure date", type: "date", required: true },
      {
        key: "returnDate",
        label: "Return date",
        type: "date",
        required: true,
        showIf: (c) => c.trip === "Return",
      },
      { key: "travelers", label: "Travelers", type: "select", options: PASSENGERS },
    ],
    defaults: {
      trip: "Return",
      fromCity: "",
      toCity: "",
      depart: "",
      returnDate: "",
      travelers: "2",
    },
  },
];

// Country codes for the lead number. Pakistan default, plus the markets served.
const DIAL_CODES = [
  { code: "+92", label: "PK +92" },
  { code: "+966", label: "SA +966" },
  { code: "+971", label: "AE +971" },
  { code: "+44", label: "UK +44" },
  { code: "+90", label: "TR +90" },
  { code: "+60", label: "MY +60" },
  { code: "+66", label: "TH +66" },
  { code: "+994", label: "AZ +994" },
  { code: "+1", label: "US +1" },
];

function resolveFromPath(pathname: string): {
  mode: "full" | "single";
  verticalId: string;
} {
  const p = pathname.toLowerCase();
  if (p === "/" || p === "") return { mode: "full", verticalId: "umrah" };
  if (p.startsWith("/umrah")) return { mode: "single", verticalId: "umrah" };
  if (p.startsWith("/hajj")) return { mode: "single", verticalId: "hajj" };
  if (p.startsWith("/tours")) return { mode: "single", verticalId: "tours" };
  if (p.startsWith("/visa")) return { mode: "single", verticalId: "visa" };
  if (p.startsWith("/tickets") || p.startsWith("/flight"))
    return { mode: "single", verticalId: "flights" };
  // Any remaining detail path maps by its known prefixes above; fall back to full.
  return { mode: "full", verticalId: "umrah" };
}

export default function SearchInquiryWidget({
  whatsapp,
  className = "",
}: {
  whatsapp?: string;
  className?: string;
}) {
  const desk = whatsapp || site.whatsapp;
  const pathname = usePathname() || "/";
  const resolved = useMemo(() => resolveFromPath(pathname), [pathname]);

  const [activeId, setActiveId] = useState(resolved.verticalId);
  // Keep the active vertical in step if the route changes under a persisted widget.
  useEffect(() => {
    setActiveId(resolved.verticalId);
  }, [resolved.verticalId]);

  const active = VERTICALS.find((v) => v.id === activeId) ?? VERTICALS[0];

  // Criteria state per vertical, seeded from defaults so selects are never empty.
  const [criteria, setCriteria] = useState<Record<string, Record<string, string>>>(
    () => Object.fromEntries(VERTICALS.map((v) => [v.id, { ...v.defaults }]))
  );
  const cur = criteria[active.id];
  const setField = (key: string, value: string) =>
    setCriteria((prev) => ({ ...prev, [active.id]: { ...prev[active.id], [key]: value } }));

  const [fieldError, setFieldError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const searchBtnRef = useRef<HTMLButtonElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const visibleFields = active.fields.filter((f) => !f.showIf || f.showIf(cur));

  const summary = useMemo(
    () =>
      visibleFields
        .map((f) => ({ label: f.label, value: (cur[f.key] || "").trim() }))
        .filter((r) => r.value.length > 0),
    [visibleFields, cur]
  );

  function onSearch() {
    const missing = visibleFields.filter((f) => f.required && !(cur[f.key] || "").trim());
    if (missing.length > 0) {
      setFieldError(`Please fill ${missing.map((f) => f.label.toLowerCase()).join(", ")}.`);
      return;
    }
    setFieldError("");
    setModalOpen(true);
  }

  function onTabKey(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + VERTICALS.length) % VERTICALS.length;
    setActiveId(VERTICALS[next].id);
    tabRefs.current[next]?.focus();
  }

  const baseId = useId();

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/10">
        {/* Deep green header with the brass active tabs */}
        <div className="bg-brand-blue-deep px-4 py-4 sm:px-5">
          <p className="text-sm font-semibold text-brand-orange">
            Get a quote for your dates
          </p>
          {resolved.mode === "full" ? (
            <div
              role="tablist"
              aria-label="Choose what to plan"
              className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {VERTICALS.map((v, i) => {
                const selected = v.id === active.id;
                return (
                  <button
                    key={v.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    role="tab"
                    id={`${baseId}-tab-${v.id}`}
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActiveId(v.id)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
                      selected
                        ? "bg-brand-orange text-white"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon name={v.icon} size={17} />
                    {v.label}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="mt-1 flex items-center gap-2 font-display text-xl text-white">
              <Icon name={active.icon} size={20} className="text-brand-orange" />
              {active.label} inquiry
            </p>
          )}
        </div>

        {/* Fields */}
        <div
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={resolved.mode === "full" ? `${baseId}-tab-${active.id}` : undefined}
          className="p-4 sm:p-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleFields.map((f) => {
              const id = `${baseId}-${f.key}`;
              return (
                <div key={f.key} className={f.type === "text" && f.key === "when" ? "sm:col-span-2 lg:col-span-1" : ""}>
                  <label htmlFor={id}>
                    {f.label}
                    {f.required ? <span className="text-brand-orange"> *</span> : null}
                  </label>
                  {f.type === "select" ? (
                    <select
                      id={id}
                      value={cur[f.key] ?? ""}
                      onChange={(e) => setField(f.key, e.target.value)}
                    >
                      {f.options?.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={id}
                      type={f.type === "date" ? "date" : "text"}
                      value={cur[f.key] ?? ""}
                      placeholder={f.placeholder}
                      required={f.required}
                      aria-required={f.required}
                      onChange={(e) => setField(f.key, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {fieldError ? (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {fieldError}
            </p>
          ) : null}

          <button
            ref={searchBtnRef}
            type="button"
            onClick={onSearch}
            className="btn-orange mt-5 w-full sm:w-auto"
          >
            Search and get a quote
          </button>
        </div>
      </div>

      {modalOpen ? (
        <LeadModal
          vertical={active}
          summary={summary}
          desk={desk}
          onClose={() => {
            setModalOpen(false);
            searchBtnRef.current?.focus();
          }}
        />
      ) : null}
    </div>
  );
}

function LeadModal({
  vertical,
  summary,
  desk,
  onClose,
}: {
  vertical: Vertical;
  summary: { label: string; value: string }[];
  desk: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [dial, setDial] = useState("+92");
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const titleId = useId();
  const summaryId = useId();

  // Focus the first field on open, trap Tab inside the dialog, close on Escape.
  useEffect(() => {
    firstFieldRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  function buildMessage() {
    const lines = summary.map((r) => `${r.label}: ${r.value}`);
    return [
      `Assalam o Alaikum, I would like a ${vertical.label} quote.`,
      "",
      ...lines,
      `Name: ${name.trim()}`,
      `City: ${city.trim()}`,
      `WhatsApp: ${dial} ${number.trim()}`,
    ].join("\n");
  }

  async function submit() {
    const digits = number.replace(/\D/g, "");
    if (!name.trim() || !city.trim() || digits.length < 7) {
      setError("Please enter your name, city, and a valid WhatsApp number.");
      return;
    }
    setError("");
    setSending(true);

    const message = buildMessage();

    // Post the lead to the inquiry store first, best effort, never block handoff.
    try {
      await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: `${dial} ${number.trim()}`,
          city: city.trim(),
          service: `${vertical.label} quote`,
          message,
        }),
      });
    } catch {
      // Network or store error stays silent, the WhatsApp handoff still runs.
    }

    setSending(false);
    setDone(true);
    window.open(waHref(desk, message), "_blank", "noopener,noreferrer");
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-black/5 bg-brand-blue-deep px-5 py-4">
          <h2 id={titleId} className="font-display text-lg text-white sm:text-xl">
            Get a customized {vertical.label} quote
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {done ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Icon name="check" size={28} />
              </div>
              <p className="mt-4 font-display text-xl text-brand-blue-deep">
                Your request is on its way
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                WhatsApp opens in a new tab with your {vertical.label.toLowerCase()} criteria.
                Send the message and our desk replies with a quote for your dates. Nothing
                opened? Use the button below.
              </p>
              <a
                href={waHref(desk, buildMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange mt-5 w-full"
              >
                Open WhatsApp
              </a>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Read only summary of the picked criteria */}
              <div id={summaryId} className="rounded-2xl bg-paper p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Your {vertical.label.toLowerCase()} request
                </p>
                <ul className="mt-2 space-y-1">
                  {summary.map((r) => (
                    <li key={r.label} className="flex justify-between gap-4 text-sm">
                      <span className="text-slate-500">{r.label}</span>
                      <span className="text-right font-semibold text-brand-blue-deep">{r.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="lead-name">
                    Your name<span className="text-brand-orange"> *</span>
                  </label>
                  <input
                    ref={firstFieldRef}
                    id="lead-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    autoComplete="name"
                    aria-required={true}
                  />
                </div>
                <div>
                  <label htmlFor="lead-city">
                    Your city or location<span className="text-brand-orange"> *</span>
                  </label>
                  <input
                    id="lead-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="For example Charsadda, Peshawar, Islamabad"
                    autoComplete="address-level2"
                    aria-required={true}
                  />
                </div>
                <div>
                  <label htmlFor="lead-number">
                    Your WhatsApp number<span className="text-brand-orange"> *</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      aria-label="Country code"
                      value={dial}
                      onChange={(e) => setDial(e.target.value)}
                      className="!w-auto shrink-0"
                    >
                      {DIAL_CODES.map((d) => (
                        <option key={d.code} value={d.code}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                    <input
                      id="lead-number"
                      type="tel"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="3XX XXXXXXX"
                      autoComplete="tel-national"
                      aria-required={true}
                    />
                  </div>
                </div>
              </div>

              {error ? (
                <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="button"
                onClick={submit}
                disabled={sending}
                className="btn-orange mt-5 w-full disabled:opacity-70"
              >
                {sending ? "Sending..." : "Send and open WhatsApp"}
              </button>
              <p className="mt-3 text-center text-xs leading-relaxed text-slate-500">
                Quoted on inquiry because airfare and hotel rates move weekly. Our desk
                confirms the current best price for your dates, with no hidden charges.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
