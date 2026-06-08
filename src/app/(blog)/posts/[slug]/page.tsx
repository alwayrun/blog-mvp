import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import { codeToHtml } from "shiki";
import { getPostBySlug } from "@/lib/actions/posts";

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

async function renderMarkdown(content: string): Promise<string> {
  let html = marked.parse(content) as string;
  const codeBlockRe = /<pre><code(?:\s+class="language-([^"]*)")?>([^]*?)<\/code><\/pre>/g;
  const matches = [...html.matchAll(codeBlockRe)];
  for (const [original, lang, encodedCode] of matches) {
    const code = decodeEntities(encodedCode);
    const language = (lang ?? "text").split(/\s/)[0];
    try {
      const highlighted = await codeToHtml(code, { lang: language, theme: "github-light" });
      html = html.replace(original, highlighted);
    } catch {
      // unsupported language — leave plain block intact
    }
  }
  return html;
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostBySlug(slug);
  if (!result.success || !result.data) return {};

  const post = result.data;
  const description = post.excerpt ?? post.content.replace(/[#*`>\-]/g, "").slice(0, 160);

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      publishedTime: new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
    },
    twitter: { card: "summary", title: post.title, description },
  };
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const result = await getPostBySlug(slug);

  if (!result.success || !result.data) notFound();

  const post = result.data;
  const html = await renderMarkdown(post.content);

  return (
    <article>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8"
      >
        ← 返回首页
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 flex-wrap text-sm text-gray-400">
          <time dateTime={new Date(post.createdAt).toISOString()}>
            {formatDate(post.createdAt)}
          </time>
          {post.tags.length > 0 && (
            <>
              <span>·</span>
              <div className="flex gap-2 flex-wrap">
                {post.tags.map(({ tag }) => (
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
      </header>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
