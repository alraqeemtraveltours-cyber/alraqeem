"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Searchable select / combobox. Lets the user filter a list and pick,
 * or type a custom value (free text is kept).
 */
export default function SearchSelect({
  value,
  onChange,
  options,
  placeholder,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  id?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const q = value.trim().toLowerCase();
  const filtered = q
    ? options.filter((o) => o.toLowerCase().includes(q))
    : options;

  return (
    <div ref={ref} className="relative">
      <input
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-black/10 bg-white py-1 shadow-lift">
          {filtered.map((o, index) => (
            <li key={`${o}-${index}`}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(o);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-brand-blue/5 ${
                  o === value ? "font-semibold text-brand-blue" : "text-slate-700"
                }`}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
