import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getDbPost } from "@/lib/postsStore";
import { isSupabaseConfigured } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getDbPost(slug);
  if (!post) notFound();

  return (
    <div>
      <p className="eyebrow">Blogs</p>
      <h1 className="mt-2 text-3xl">Edit post</h1>
      <p className="mt-1 text-sm text-slate-500">{post.title}</p>
      <div className="gold-rule mt-5" />
      <div className="mt-8">
        <PostForm mode="edit" initial={post} configured={isSupabaseConfigured} />
      </div>
    </div>
  );
}
