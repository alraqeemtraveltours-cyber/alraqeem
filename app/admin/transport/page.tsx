import TransportConfigManager from "@/components/admin/TransportConfigManager";
import { getTransportConfig } from "@/lib/transportConfigStore";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminTransportPage() {
  const config = await getTransportConfig();

  return (
    <div className="mx-auto max-w-[1500px]">
      <TransportConfigManager initial={config} configured={isSupabaseConfigured} />
    </div>
  );
}
