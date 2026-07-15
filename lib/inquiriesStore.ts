import "server-only";
import { getAdminClient } from "@/lib/supabase";

const TABLE = "inquiries";

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  city?: string;
  email?: string;
  service: string;
  message?: string;
  adminEmailStatus: "unknown" | "pending" | "sent" | "failed" | "not_configured";
  adminEmailSentAt?: string;
  adminEmailError?: string;
  createdAt: string;
};

type Row = {
  id: string;
  name: string;
  phone: string;
  city: string | null;
  email: string | null;
  service: string;
  message: string | null;
  admin_email_status?: Inquiry["adminEmailStatus"] | null;
  admin_email_sent_at?: string | null;
  admin_email_error?: string | null;
  created_at: string;
};

function rowToInquiry(r: Row): Inquiry {
  return {
    id: r.id,
    name: r.name,
    phone: r.phone,
    city: r.city ?? undefined,
    email: r.email ?? undefined,
    service: r.service,
    message: r.message ?? undefined,
    adminEmailStatus: r.admin_email_status ?? "unknown",
    adminEmailSentAt: r.admin_email_sent_at ?? undefined,
    adminEmailError: r.admin_email_error ?? undefined,
    createdAt: r.created_at,
  };
}

export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = getAdminClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as Row[]).map(rowToInquiry);
}

export async function addInquiry(input: {
  name: string;
  phone: string;
  city?: string;
  email?: string;
  service: string;
  message?: string;
}): Promise<string> {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      name: input.name,
      phone: input.phone,
      city: input.city || null,
      email: input.email || null,
      service: input.service,
      message: input.message || null,
      admin_email_status: "pending",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  return String(data.id);
}

export async function updateInquiryAdminEmailStatus(
  id: string,
  status: "sent" | "failed" | "not_configured",
  errorMessage?: string,
): Promise<void> {
  const supabase = getAdminClient();
  if (!supabase) return;
  const { error } = await supabase
    .from(TABLE)
    .update({
      admin_email_status: status,
      admin_email_sent_at: status === "sent" ? new Date().toISOString() : null,
      admin_email_error: errorMessage?.slice(0, 500) || null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteInquiry(id: string): Promise<void> {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
