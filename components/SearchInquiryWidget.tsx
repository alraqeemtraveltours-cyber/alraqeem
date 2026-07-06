"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "@/components/packages/DetailIcons";
import { waHref } from "@/lib/settings";
import { site } from "@/lib/site";
import {
  VERTICALS,
  DIAL_CODES,
  verticalById,
  widgetContext,
  type WidgetVertical,
  type WidgetField,
} from "@/lib/searchWidget";

// One context aware lead capture widget. Full mode on the homepage shows every
// vertical with empty fields, single mode on a silo or detail page shows one
// vertical prefilled from the page. Search is a qualified lead action, not a
// live search, so it opens a modal that collects name, city, and number, posts
// the lead, and hands off to WhatsApp prefilled with the criteria. No prices.

type Values = Record<string, string>;

function emptyState(): Record<string, Values> {
  return Object.fromEntries(
    VERTICALS.map((v) => [v.id, Object.fromEntries(v.fields.map((f) => [f.key, ""]))])
  );
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
  const ctx = useMemo(() => widgetContext(pathname), [pathname]);
  const mode: "full" | "single" = ctx ? "single" : "full";

  const [activeId, setActiveId] = useState(ctx?.vertical ?? "umrah");
  // Criteria per vertical so switching tabs preserves what the user typed. The
  // page context seeds only its own vertical, everything else starts empty.
  const [criteria, setCriteria] = useState<Record<string, Values>>(() => {
    const base = emptyState();
    if (ctx) base[ctx.vertical] = { ...base[ctx.vertical], ...ctx.values };
    return base;
  });

  // Follow a route change under a persisted widget, reseeding the new context.
  useEffect(() => {
    setActiveId(ctx?.vertical ?? "umrah");
    if (ctx) {
      setCriteria((prev) => ({
        ...prev,
        [ctx.vertical]: { ...prev[ctx.vertical], ...ctx.values },
      }));
    }
  }, [ctx]);

  const active = verticalById(activeId);
  const cur = criteria[active.id];
  const setField = (key: string, value: string) => {
    setCriteria((prev) => ({ ...prev, [active.id]: { ...prev[active.id], [key]: value } }));
    setErrors((e) => (e[key] ? { ...e, [key]: "" } : e));
  };

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const searchBtnRef = useRef<HTMLButtonElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const baseId = useId();

  const visibleFields = active.fields.filter((f) => !f.showIf || f.showIf(cur));
  const inputFields = visibleFields.filter((f) => f.type !== "toggle");
  const toggleFields = visibleFields.filter((f) => f.type === "toggle");

  const summary = useMemo(
    () =>
      visibleFields
        .map((f) => ({ label: f.label, value: (cur[f.key] || "").trim() }))
        .filter((r) => r.value.length > 0),
    [visibleFields, cur]
  );

  function validateCriteria(): Record<string, string> {
    const errs: Record<string, string> = {};
    for (const f of visibleFields) {
      if (f.required && !(cur[f.key] || "").trim()) {
        errs[f.key] = `${f.label} is required.`;
      }
    }
    // Flights, the return date has to sit after the departure date.
    if (active.id === "flights" && cur.trip === "Return") {
      const d = cur.depart;
      const r = cur.returnDate;
      if (d && r && r <= d) {
        errs.returnDate = "Return date must be after the departure date.";
      }
    }
    return errs;
  }

  function onSearch() {
    const errs = validateCriteria();
    setErrors(errs);
    const firstKey = Object.keys(errs)[0];
    if (firstKey) {
      panelRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${baseId}-${firstKey}`)}`)?.focus();
      return;
    }
    setModalOpen(true);
  }

  function onTabKey(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + VERTICALS.length) % VERTICALS.length;
    setActiveId(VERTICALS[next].id);
    setErrors({});
    tabRefs.current[next]?.focus();
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/10">
        {/* Deep green header with the brass active tabs */}
        <div className="bg-brand-blue-deep px-4 py-4 sm:px-5">
          <p className="text-sm font-semibold text-brand-orange">
            Get a quote for your dates
          </p>
          {mode === "full" ? (
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
                    onClick={() => {
                      setActiveId(v.id);
                      setErrors({});
                    }}
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
          ref={panelRef}
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={mode === "full" ? `${baseId}-tab-${active.id}` : undefined}
          className="p-4 sm:p-5"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inputFields.map((f) => (
              <FieldControl
                key={f.key}
                field={f}
                id={`${baseId}-${f.key}`}
                value={cur[f.key] ?? ""}
                error={errors[f.key]}
                onChange={(v) => setField(f.key, v)}
              />
            ))}
          </div>

          {toggleFields.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              {toggleFields.map((f) => (
                <label
                  key={f.key}
                  htmlFor={`${baseId}-${f.key}`}
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 !text-sm !font-medium !text-slate-700"
                >
                  <input
                    id={`${baseId}-${f.key}`}
                    type="checkbox"
                    checked={cur[f.key] === "Yes"}
                    onChange={(e) => setField(f.key, e.target.checked ? "Yes" : "")}
                    className="!h-5 !w-5 !p-0 shrink-0 accent-brand-orange"
                  />
                  {f.label}
                </label>
              ))}
            </div>
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

function FieldControl({
  field,
  id,
  value,
  error,
  onChange,
}: {
  field: WidgetField;
  id: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const errId = `${id}-err`;
  return (
    <div>
      <label htmlFor={id}>
        {field.label}
        {field.required ? <span className="text-brand-orange"> *</span> : null}
      </label>
      {field.type === "select" ? (
        <select
          id={id}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{field.placeholder ?? "Select"}</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={field.type === "date" ? "date" : "text"}
          value={value}
          placeholder={field.placeholder}
          aria-required={field.required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errId : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {error ? (
        <p id={errId} role="alert" className="mt-1 text-xs font-semibold text-red-600">
          {error}
        </p>
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
  vertical: WidgetVertical;
  summary: { label: string; value: string }[];
  desk: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [dial, setDial] = useState("+92");
  const [number, setNumber] = useState("");
  const [company, setCompany] = useState(""); // honeypot, real users leave empty
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const titleId = useId();

  const deskDisplay = `+${desk.replace(/\D/g, "")}`;

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

  function validNumber(): boolean {
    const digits = number.replace(/\D/g, "").replace(/^0+/, "");
    if (dial === "+92") return digits.length === 10 && digits.startsWith("3");
    return digits.length >= 7 && digits.length <= 14;
  }

  async function submit() {
    // Silent drop for the spam honeypot, a real visitor never fills it.
    if (company.trim()) {
      setDone(true);
      return;
    }
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Please enter your name.";
    if (!city.trim()) errs.city = "Please enter your city or location.";
    if (!validNumber())
      errs.number =
        dial === "+92"
          ? "Enter a valid Pakistan number, for example 3125446922."
          : "Enter a valid WhatsApp number.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

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

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(deskDisplay);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
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
            <div className="py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Icon name="check" size={28} />
              </div>
              <p className="mt-4 font-display text-xl text-brand-blue-deep">
                Our desk will message you on WhatsApp shortly
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                WhatsApp opens in a new tab with your {vertical.label.toLowerCase()} criteria.
                Send the message and our team replies with a quote for your dates.
              </p>
              <a
                href={waHref(desk, buildMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-orange mt-5 w-full"
              >
                Open WhatsApp
              </a>
              {/* Fallback in case WhatsApp is unavailable */}
              <div className="mt-4 rounded-2xl bg-paper p-4 text-sm">
                <p className="text-slate-600">Prefer to reach us directly?</p>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                  <a href={`tel:${deskDisplay}`} className="font-semibold text-brand-blue-deep underline">
                    {deskDisplay}
                  </a>
                  <button
                    type="button"
                    onClick={copyNumber}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-white"
                  >
                    <Icon name={copied ? "check" : "document"} size={14} />
                    {copied ? "Copied" : "Copy number"}
                  </button>
                </div>
              </div>
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
              <div className="rounded-2xl bg-paper p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Your {vertical.label.toLowerCase()} request
                </p>
                {summary.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {summary.map((r) => (
                      <li key={r.label} className="flex justify-between gap-4 text-sm">
                        <span className="text-slate-500">{r.label}</span>
                        <span className="text-right font-semibold text-brand-blue-deep">{r.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    Add your details below and our desk shapes the {vertical.label.toLowerCase()} around your dates.
                  </p>
                )}
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
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((x) => ({ ...x, name: "" }));
                    }}
                    placeholder="Full name"
                    autoComplete="name"
                    aria-required={true}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "lead-name-err" : undefined}
                  />
                  {errors.name ? (
                    <p id="lead-name-err" role="alert" className="mt-1 text-xs font-semibold text-red-600">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="lead-city">
                    Your city or location<span className="text-brand-orange"> *</span>
                  </label>
                  <input
                    id="lead-city"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setErrors((x) => ({ ...x, city: "" }));
                    }}
                    placeholder="For example Charsadda, Peshawar, Islamabad"
                    autoComplete="address-level2"
                    aria-required={true}
                    aria-invalid={errors.city ? true : undefined}
                    aria-describedby={errors.city ? "lead-city-err" : undefined}
                  />
                  {errors.city ? (
                    <p id="lead-city-err" role="alert" className="mt-1 text-xs font-semibold text-red-600">
                      {errors.city}
                    </p>
                  ) : null}
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
                      onChange={(e) => {
                        setNumber(e.target.value);
                        setErrors((x) => ({ ...x, number: "" }));
                      }}
                      placeholder="3XX XXXXXXX"
                      autoComplete="tel-national"
                      aria-required={true}
                      aria-invalid={errors.number ? true : undefined}
                      aria-describedby={errors.number ? "lead-number-err" : undefined}
                    />
                  </div>
                  {errors.number ? (
                    <p id="lead-number-err" role="alert" className="mt-1 text-xs font-semibold text-red-600">
                      {errors.number}
                    </p>
                  ) : null}
                </div>

                {/* Honeypot, visually hidden, real visitors never see or fill it */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="lead-company">Company</label>
                  <input
                    id="lead-company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              </div>

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
