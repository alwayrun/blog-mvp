import Link from "next/link";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4">
      <header className="py-10 border-b border-gray-100">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight hover:text-gray-600 transition-colors"
        >
          Blog
        </Link>
      </header>
      <main className="py-10">{children}</main>
      <footer className="py-8 border-t border-gray-100 text-sm text-gray-400 text-center">
        © {new Date().getFullYear()} Blog
      </footer>
    </div>
  );
}
