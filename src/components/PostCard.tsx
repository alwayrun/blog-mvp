import Link from "next/link";

interface Tag {
  tag: { name: string; slug: string };
}

interface PostCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  createdAt: Date;
  tags: Tag[];
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostCard({
  title,
  slug,
  excerpt,
  createdAt,
  tags,
}: PostCardProps) {
  return (
    <article className="py-8 border-b border-gray-100 last:border-none">
      <Link href={`/posts/${slug}`} className="group">
        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors mb-2">
          {title}
        </h2>
      </Link>
      {excerpt && (
        <p className="text-gray-500 text-[0.95rem] leading-relaxed mb-3 line-clamp-2">
          {excerpt}
        </p>
      )}
      <div className="flex items-center gap-3 flex-wrap text-sm text-gray-400">
        <time dateTime={new Date(createdAt).toISOString()}>
          {formatDate(createdAt)}
        </time>
        {tags.length > 0 && (
          <>
            <span>·</span>
            <div className="flex gap-2 flex-wrap">
              {tags.map(({ tag }) => (
                <Link
                  key={tag.slug}
                  href={`/?tag=${tag.slug}`}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </article>
  );
}
