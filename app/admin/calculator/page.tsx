import CalculatorItemsManager from "@/components/admin/CalculatorItemsManager";
import { getCalculatorItems } from "@/lib/calculatorItemsStore";
import { getHotels } from "@/lib/hotelsStore";
import { isSupabaseConfigured } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export default async function AdminCalculatorPage() {
  const [items, hotels] = await Promise.all([getCalculatorItems(), getHotels()]);

  return (
    <div className="mx-auto max-w-[1500px]">
      <CalculatorItemsManager
        initial={items}
        hotels={hotels}
        configured={isSupabaseConfigured}
      />
    </div>
  );
}
