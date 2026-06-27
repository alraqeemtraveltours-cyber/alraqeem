import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { revalidatePath } from "next/cache";
import { addInquiry } from "@/lib/inquiriesStore";

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

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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

export async function POST(request: Request) {
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

  const transport = getTransport();
  if (!transport) {
    return NextResponse.json(
      { error: "SMTP is not configured." },
      { status: 500 }
    );
  }

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
    <p><strong>Name:</strong> ${payload.name}</p>
    <p><strong>Phone:</strong> ${payload.phone}</p>
    ${payload.email ? `<p><strong>Email:</strong> ${payload.email}</p>` : ""}
    ${payload.city ? `<p><strong>City:</strong> ${payload.city}</p>` : ""}
    <p><strong>Service:</strong> ${payload.service}</p>
    ${payload.message ? `<p><strong>Message:</strong><br/>${payload.message.replace(/\n/g, "<br/>")}</p>` : ""}
  `;

  try {
    await addInquiry(payload);

    await transport.sendMail({
      from,
      to,
      subject: `New Inquiry: ${payload.service}`,
      text,
      html,
      replyTo: payload.email || fromAddress,
    });

    if (payload.email) {
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
        <p>Assalam o Alaikum ${payload.name},</p>
        <p>We received your inquiry and our team will contact you shortly.</p>
        <p><strong>Service:</strong> ${payload.service}</p>
        ${payload.city ? `<p><strong>City:</strong> ${payload.city}</p>` : ""}
        <p>Thanks,<br/>Al Raqeem Travel &amp; Tours</p>
      `;

      await transport.sendMail({
        from,
        to: payload.email,
        subject: "We received your inquiry | Al Raqeem Travel & Tours",
        text: userText,
        html: userHtml,
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send inquiry email." },
      { status: 500 }
    );
  }
}
