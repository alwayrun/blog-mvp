import Link from "next/link";

interface Tag {
  name: string;
  slug: string;
  _count: { posts: number };
}

interface TagListProps {
  tags: Tag[];
  activeTag?: string;
}

export default function TagList({ tags, activeTag }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap mb-8">
      <Link
        href="/"
        className={`px-3 py-1 rounded-full text-sm transition-colors ${
          !activeTag
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All
      </Link>
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/?tag=${tag.slug}`}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            activeTag === tag.slug
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {tag.name}
          <span className="ml-1 text-xs opacity-60">{tag._count.posts}</span>
        </Link>
      ))}
    </div>
  );
}
