import MediaLibrary from "@/components/admin/MediaLibrary";
import { listMedia } from "@/lib/mediaStore";
import { isSupabaseConfigured } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const media = await listMedia();

  return (
    <div>
      <p className="eyebrow">Media</p>
      <h1 className="mt-2 text-3xl">Image library</h1>
      <p className="mt-1 text-sm text-slate-500">
        Upload images here, then use “Copy URL” (or the Media picker on a
        package) to attach them.
      </p>
      <div className="gold-rule mt-5" />
      <div className="mt-8">
        <MediaLibrary initial={media} configured={isSupabaseConfigured} />
      </div>
    </div>
  );
}
