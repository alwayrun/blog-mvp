import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  tag?: string;
}

function buildHref(page: number, tag?: string): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (tag) params.set("tag", tag);
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export default function Pagination({
  currentPage,
  totalPages,
  tag,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-1 mt-10" aria-label="Pagination">
      <Link
        href={buildHref(currentPage - 1, tag)}
        aria-disabled={currentPage <= 1}
        className={`px-3 py-1.5 rounded text-sm transition-colors ${
          currentPage <= 1
            ? "text-gray-300 pointer-events-none"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        ← Prev
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page, tag)}
          className={`w-8 h-8 flex items-center justify-center rounded text-sm transition-colors ${
            page === currentPage
              ? "bg-gray-900 text-white font-medium"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={buildHref(currentPage + 1, tag)}
        aria-disabled={currentPage >= totalPages}
        className={`px-3 py-1.5 rounded text-sm transition-colors ${
          currentPage >= totalPages
            ? "text-gray-300 pointer-events-none"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Next →
      </Link>
    </nav>
  );
}
