"use client";

import { useEffect, useState } from "react";

// Mobile only sticky bottom quote bar. Appears once the reader scrolls past
// the hero. While visible it adds a body class so the global WhatsApp float
// lifts above the bar instead of overlapping it. Tap targets are 44px.
export default function MobileActionBar({
  quoteHref,
  telHref,
  quoteLabel = "Get a quote",
  priceText = "Price on inquiry",
}: {
  quoteHref: string;
  telHref: string;
  quoteLabel?: string;
  priceText?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("has-action-bar", show);
    return () => document.body.classList.remove("has-action-bar");
  }, [show]);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        paddingTop: "0.6rem",
        paddingLeft: "0.75rem",
        paddingRight: "0.75rem",
        paddingBottom: "max(0.6rem, env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex items-center gap-3">
        <div className="shrink-0 leading-none">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Pricing
          </p>
          <p className="font-display text-sm font-bold text-brand-blue-deep">
            {priceText}
          </p>
        </div>
        <a
          href={quoteHref}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-orange min-h-[44px] flex-1 !py-2.5"
        >
          {quoteLabel}
        </a>
        <a
          href={telHref}
          aria-label="Call us"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-blue text-brand-blue"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
