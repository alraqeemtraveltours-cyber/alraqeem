"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export default function InquiryForm({
  packageOptions = [],
}: {
  packageOptions?: string[];
}) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    service: "Umrah Package",
    message: "",
  });
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  function submit() {
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Please enter your name and phone number so we can reach you.");
      return;
    }
    const lines = [
      "New inquiry from website:",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.city ? `City: ${form.city}` : "",
      `Service: ${form.service}`,
      form.message ? `Message: ${form.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(
      `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(lines)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
      <h3 className="text-2xl">Send an Inquiry</h3>
      <p className="mt-2 text-sm text-slate-600">
        Fill this form and it opens in WhatsApp, ready to send to our team. We
        reply within business hours, usually within minutes.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name">Full Name *</label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="phone">Phone / WhatsApp *</label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="03XX XXXXXXX"
            autoComplete="tel"
          />
        </div>
        <div>
          <label htmlFor="city">Your City</label>
          <input
            id="city"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="e.g. Charsadda, Peshawar, Islamabad"
            autoComplete="address-level2"
          />
        </div>
        <div>
          <label htmlFor="service">I am interested in</label>
          <select
            id="service"
            value={form.service}
            onChange={(e) => update("service", e.target.value)}
          >
            <option>Umrah Package</option>
            <option>Hajj Package</option>
            <option>Visa Services</option>
            <option>Air Ticketing</option>
            {packageOptions.map((title) => (
              <option key={title}>{title}</option>
            ))}
            <option>Something else</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message">Message (optional)</label>
          <textarea
            id="message"
            rows={4}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Travel dates, number of people, questions..."
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <button type="button" onClick={submit} className="btn-orange mt-6 w-full sm:w-auto">
        Send via WhatsApp
      </button>
    </div>
  );
}
