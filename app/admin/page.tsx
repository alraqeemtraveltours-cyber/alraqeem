import type { Metadata } from "next";
import AdminClient from "@/components/AdminClient";
import { getPackages, isSupabaseConfigured } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin · Manage Packages",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const packages = await getPackages();

  return (
    <section className="py-14 sm:py-20">
      <div className="container-site">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">Manage packages</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Add new tour and Umrah packages or remove existing ones. Changes are
          saved to your Supabase database and appear on the site immediately.
        </p>
        <div className="gold-rule mt-5" />

        <div className="mt-12">
          <AdminClient
            configured={isSupabaseConfigured}
            initialPackages={packages}
          />
        </div>

        {!isSupabaseConfigured && (
          <div className="mt-14 rounded-2xl border border-black/5 bg-white p-7 shadow-card">
            <h2 className="text-xl">Connect Supabase (one-time setup)</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
              <li>
                Create a project at{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-blue underline"
                >
                  supabase.com
                </a>
                .
              </li>
              <li>
                In the Supabase SQL editor, run the contents of{" "}
                <code>supabase/schema.sql</code> (creates the{" "}
                <code>packages</code> table and seeds it).
              </li>
              <li>
                Copy <code>.env.local.example</code> to <code>.env.local</code>{" "}
                and fill in your Project URL, anon key and service-role key (from
                Supabase → Project Settings → API).
              </li>
              <li>
                Restart the dev server. This page will then read and write your
                database.
              </li>
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
