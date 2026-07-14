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
}): Promise<void> {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { error } = await supabase.from(TABLE).insert({
    name: input.name,
    phone: input.phone,
    city: input.city || null,
    email: input.email || null,
    service: input.service,
    message: input.message || null,
  });
  if (error) throw new Error(error.message);
}

export async function deleteInquiry(id: string): Promise<void> {
  const supabase = getAdminClient();
  if (!supabase) throw new Error("Supabase admin is not configured.");
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
