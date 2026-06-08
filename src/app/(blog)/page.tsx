import type { Metadata } from "next";
import { getPosts, getTags } from "@/lib/actions/posts";

export const metadata: Metadata = {
  title: "首页",
  description: "探索最新前端技术文章，涵盖 Next.js、TypeScript、React 等话题。",
};
import PostCard from "@/components/PostCard";
import TagList from "@/components/TagList";
import Pagination from "@/components/Pagination";

interface HomeProps {
  searchParams: Promise<{ tag?: string; page?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { tag, page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);

  const [postsResult, tagsResult] = await Promise.all([
    getPosts({ tag, page }),
    getTags(),
  ]);

  const tags = tagsResult.success ? tagsResult.data : [];
  const posts = postsResult.success ? postsResult.data.posts : [];
  const totalPages = postsResult.success ? postsResult.data.totalPages : 0;

  return (
    <div>
      <TagList tags={tags} activeTag={tag} />

      {posts.length === 0 ? (
        <p className="text-gray-400 py-16 text-center">暂无文章</p>
      ) : (
        <>
          <div>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                createdAt={post.createdAt}
                tags={post.tags}
              />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} tag={tag} />
        </>
      )}
    </div>
  );
}
