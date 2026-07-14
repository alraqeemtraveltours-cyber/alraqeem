import Link from "next/link";
import PostsTable from "@/components/admin/PostsTable";
import { getDbPosts } from "@/lib/postsStore";
import { isSupabaseConfigured } from "@/lib/packagesStore";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  const posts = await getDbPosts();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Blogs</p>
          <h1 className="mt-2 text-3xl">Manage posts</h1>
        </div>
        <Link href="/admin/blogs/new" className="btn-orange">
          + Add Post
        </Link>
      </div>
      <div className="gold-rule mt-5" />
      <div className="mt-8">
        <PostsTable posts={posts} configured={isSupabaseConfigured} />
      </div>
    </div>
  );
}
