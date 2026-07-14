import HotelsManager from "@/components/admin/HotelsManager";
import { getHotels } from "@/lib/hotelsStore";
import { isSupabaseConfigured } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export default async function AdminHotelsPage() {
  const hotels = await getHotels();

  return (
    <div className="mx-auto max-w-[1500px]">
      <HotelsManager initial={hotels} configured={isSupabaseConfigured} />
    </div>
  );
}
