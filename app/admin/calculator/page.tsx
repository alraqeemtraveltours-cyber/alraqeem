import CalculatorItemsManager from "@/components/admin/CalculatorItemsManager";
import { getCalculatorItems } from "@/lib/calculatorItemsStore";
import { isSupabaseConfigured } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export default async function AdminCalculatorPage() {
  const items = await getCalculatorItems();

  return (
    <div className="mx-auto max-w-[1500px]">
      <CalculatorItemsManager initial={items} configured={isSupabaseConfigured} />
    </div>
  );
}
