import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { revalidatePath } from "next/cache";
import { addInquiry, updateInquiryAdminEmailStatus } from "@/lib/inquiriesStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type InquiryPayload = {
  name: string;
  phone: string;
  city?: string;
  email?: string;
  service: string;
  message?: string;
};

const MAX_LEN = 2000;

function asString(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, MAX_LEN) : "";
}

/** Escape user input before putting it inside notification-email HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parsePayload(body: Record<string, unknown>): InquiryPayload | null {
  const payload: InquiryPayload = {
    name: asString(body.name),
    phone: asString(body.phone),
    city: asString(body.city),
    email: asString(body.email),
    service: asString(body.service),
    message: asString(body.message),
  };

  if (!payload.name || !payload.phone || !payload.service) {
    return null;
  }
  return payload;
}

function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT ?? "2525");
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass },
  });
}

// Best-effort in-memory rate limit (per warm serverless instance): at most
// RATE_MAX submissions per IP within RATE_WINDOW_MS.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 6;
const recentByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  // Bound memory: drop the whole map if it grows large (warm instance only).
  if (recentByIp.size > 5000) recentByIp.clear();
  const hits = (recentByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recentByIp.set(ip, hits);
  return hits.length > RATE_MAX;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const payload = parsePayload(body);
  if (!payload) {
    return NextResponse.json(
      { error: "Name, phone, and service are required." },
      { status: 400 }
    );
  }
  if (payload.email && !isValidEmail(payload.email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // 1) Persist the lead FIRST so it is never lost, even if email is
  //    misconfigured or the mail server is down.
  let saved = false;
  let inquiryId: string | null = null;
  try {
    inquiryId = await addInquiry(payload);
    saved = true;
    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
  } catch (error) {
    console.error("[inquiry] save failed:", error);
  }

  // 2) Send notification + confirmation email (best effort).
  let emailed = false;
  const transport = getTransport();
  if (transport) {
    const to = process.env.INQUIRY_TO_EMAIL ?? "info@alraqeem.com.pk";
    const fromAddress = process.env.INQUIRY_FROM_EMAIL ?? "info@alraqeem.com.pk";
    const fromName = process.env.INQUIRY_FROM_NAME ?? "Al Raqeem Travel & Tours";
    const from = `${fromName} <${fromAddress}>`;

    const text = [
      "New website inquiry",
      "",
      `Name: ${payload.name}`,
      `Phone: ${payload.phone}`,
      payload.email ? `Email: ${payload.email}` : "",
      payload.city ? `City: ${payload.city}` : "",
      `Service: ${payload.service}`,
      payload.message ? `Message: ${payload.message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const html = `
      <h2>New website inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
      ${payload.email ? `<p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>` : ""}
      ${payload.city ? `<p><strong>City:</strong> ${escapeHtml(payload.city)}</p>` : ""}
      <p><strong>Service:</strong> ${escapeHtml(payload.service)}</p>
      ${payload.message ? `<p><strong>Message:</strong><br/>${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>` : ""}
    `;

    try {
      await transport.sendMail({
        from,
        to,
        subject: `New Inquiry: ${payload.service}`,
        text,
        html,
        replyTo: payload.email || fromAddress,
      });
      emailed = true;

      if (inquiryId) {
        try {
          await updateInquiryAdminEmailStatus(inquiryId, "sent");
        } catch (error) {
          console.error("[inquiry] email status update failed:", error);
        }
      }

      if (payload.email) {
        const safeName = escapeHtml(payload.name);
        const userText = [
          `Assalam o Alaikum ${payload.name},`,
          "",
          "We received your inquiry and our team will contact you shortly.",
          "",
          `Service: ${payload.service}`,
          payload.city ? `City: ${payload.city}` : "",
          "",
          "Thanks,",
          "Al Raqeem Travel & Tours",
        ]
          .filter(Boolean)
          .join("\n");

        const userHtml = `
          <p>Assalam o Alaikum ${safeName},</p>
          <p>We received your inquiry and our team will contact you shortly.</p>
          <p><strong>Service:</strong> ${escapeHtml(payload.service)}</p>
          ${payload.city ? `<p><strong>City:</strong> ${escapeHtml(payload.city)}</p>` : ""}
          <p>Thanks,<br/>Al Raqeem Travel &amp; Tours</p>
        `;

        // The customer confirmation is a bonus — don't fail the request if it bounces.
        try {
          await transport.sendMail({
            from,
            to: payload.email,
            subject: "We received your inquiry | Al Raqeem Travel & Tours",
            text: userText,
            html: userHtml,
          });
        } catch (error) {
          console.error("[inquiry] confirmation email failed:", error);
        }
      }
    } catch (error) {
      console.error("[inquiry] notification email failed:", error);
      if (inquiryId) {
        try {
          await updateInquiryAdminEmailStatus(
            inquiryId,
            "failed",
            error instanceof Error ? error.message : "Mail server rejected the notification.",
          );
        } catch (statusError) {
          console.error("[inquiry] email status update failed:", statusError);
        }
      }
    }
  } else if (inquiryId) {
    try {
      await updateInquiryAdminEmailStatus(
        inquiryId,
        "not_configured",
        "SMTP settings are not configured.",
      );
    } catch (error) {
      console.error("[inquiry] email status update failed:", error);
    }
  }

  // Only a hard failure if the lead was neither saved nor emailed.
  if (!saved && !emailed) {
    return NextResponse.json(
      { error: "Could not submit your inquiry. Please contact us on WhatsApp." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
