import Link from "next/link";
import { getAdminPosts, deletePostAction } from "@/lib/actions/admin";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function AdminPage() {
  const result = await getAdminPosts();
  const posts = result.success ? result.data : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          + 新建文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="mb-4">暂无文章</p>
          <Link
            href="/admin/posts/new"
            className="text-sm text-gray-900 underline underline-offset-2"
          >
            创建第一篇文章
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 px-5 py-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 truncate">
                    {post.title}
                  </span>
                  <span
                    className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                      post.published
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {post.published ? "已发布" : "草稿"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {formatDate(post.createdAt)}
                  {post.tags.length > 0 && (
                    <span className="ml-2">
                      {post.tags.map((t) => t.tag.name).join(", ")}
                    </span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
                >
                  编辑
                </Link>
                <form action={deletePostAction}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    className="text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                  >
                    删除
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
