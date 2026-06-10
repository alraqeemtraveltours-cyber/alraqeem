import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/settingsStore";
import { isSupabaseConfigured } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <p className="eyebrow">Settings</p>
      <h1 className="mt-2 text-3xl">Site settings</h1>
      <p className="mt-1 text-sm text-slate-500">
        Branding, contact details and social links shown across the site.
      </p>
      <div className="gold-rule mt-5" />
      <div className="mt-8">
        <SettingsForm initial={settings} configured={isSupabaseConfigured} />
      </div>
    </div>
  );
}
