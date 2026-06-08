"use client";

import { useActionState, useEffect, useState } from "react";

function slugify(text: string): string {
  const ascii = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii.length >= 2 ? ascii : "";
}

type FormState = { error: string } | null;
type ActionFn = (state: FormState, payload: FormData) => Promise<FormState>;

interface InitialData {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  tags: Array<{ tag: { name: string } }>;
}

export default function PostForm({
  action,
  initialData,
}: {
  action: ActionFn;
  initialData?: InitialData;
}) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugLocked, setSlugLocked] = useState(Boolean(initialData?.slug));

  useEffect(() => {
    if (!slugLocked) {
      const generated = slugify(title);
      if (generated) setSlug(generated);
    }
  }, [title, slugLocked]);

  const defaultTags =
    initialData?.tags.map((t) => t.tag.name).join(", ") ?? "";

  return (
    <form action={formAction} className="space-y-5">
      {initialData && (
        <input type="hidden" name="id" value={initialData.id} />
      )}

      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {state.error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          标题 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="文章标题"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugLocked(true);
          }}
          onFocus={() => setSlugLocked(true)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="url-friendly-slug"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          摘要
        </label>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={initialData?.excerpt ?? ""}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
          placeholder="文章摘要（可选，留空则不显示）"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          内容 <span className="text-red-400">*</span>
          <span className="ml-1 font-normal text-gray-400">（Markdown）</span>
        </label>
        <textarea
          name="content"
          rows={20}
          required
          defaultValue={initialData?.content ?? ""}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-y"
          placeholder="支持 Markdown 格式..."
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          标签
        </label>
        <input
          type="text"
          name="tags"
          defaultValue={defaultTags}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          placeholder="TypeScript, Next.js, React（逗号分隔）"
        />
      </div>

      {/* Published */}
      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          name="published"
          id="published"
          defaultChecked={initialData?.published ?? false}
          className="h-4 w-4 rounded border-gray-300 accent-gray-900"
        />
        <label htmlFor="published" className="text-sm text-gray-700 select-none">
          立即发布
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <button
          type="submit"
          disabled={isPending}
          className="bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? "保存中…" : initialData ? "更新文章" : "创建文章"}
        </button>
        <a
          href="/admin"
          className="text-sm text-gray-500 hover:text-gray-900 px-4 py-2.5 transition-colors"
        >
          取消
        </a>
      </div>
    </form>
  );
}
