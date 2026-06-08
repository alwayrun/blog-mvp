"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface CreatePostInput {
  title: string;
  content: string;
  excerpt?: string;
  published?: boolean;
  tags?: string[];
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  excerpt?: string;
  published?: boolean;
  tags?: string[];
}

const PAGE_SIZE = 10;

const POST_INCLUDE = {
  author: { select: { id: true, email: true } },
  tags: { include: { tag: true } },
} as const;

function slugify(text: string): string {
  const ascii = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii.length >= 3 ? ascii : `post-${Date.now()}`;
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 0;
  while (await db.post.findUnique({ where: { slug } })) {
    i++;
    slug = `${base}-${i}`;
  }
  return slug;
}

function tagsConnect(tags: string[] | undefined) {
  if (!tags?.length) return undefined;
  return {
    create: tags.map((name) => {
      const slug = slugify(name);
      return {
        tag: { connectOrCreate: { where: { slug }, create: { name, slug } } },
      };
    }),
  };
}

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getPosts(options?: { tag?: string; page?: number }) {
  try {
    const page = Math.max(1, options?.page ?? 1);
    const skip = (page - 1) * PAGE_SIZE;

    const where = {
      published: true,
      ...(options?.tag && {
        tags: { some: { tag: { slug: options.tag } } },
      }),
    };

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where,
        include: POST_INCLUDE,
        orderBy: { createdAt: "desc" },
        skip,
        take: PAGE_SIZE,
      }),
      db.post.count({ where }),
    ]);

    return {
      success: true as const,
      data: { posts, total, page, totalPages: Math.ceil(total / PAGE_SIZE) },
    };
  } catch {
    return { success: false as const, error: "Failed to fetch posts" };
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await db.post.findUnique({
      where: { slug, published: true },
      include: POST_INCLUDE,
    });
    if (!post) return { success: false as const, error: "Post not found" };
    return { success: true as const, data: post };
  } catch {
    return { success: false as const, error: "Failed to fetch post" };
  }
}

export async function getTags() {
  try {
    const tags = await db.tag.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: "asc" },
    });
    return { success: true as const, data: tags };
  } catch {
    return { success: false as const, error: "Failed to fetch tags" };
  }
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function createPost(data: CreatePostInput) {
  const session = await getSession();
  if (!session) return { success: false as const, error: "Unauthorized" };

  try {
    const slug = await uniqueSlug(slugify(data.title));

    const post = await db.post.create({
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        published: data.published ?? false,
        slug,
        authorId: Number(session.userId),
        tags: tagsConnect(data.tags),
      },
      include: POST_INCLUDE,
    });

    return { success: true as const, data: post };
  } catch {
    return { success: false as const, error: "Failed to create post" };
  }
}

export async function updatePost(id: string, data: UpdatePostInput) {
  const session = await getSession();
  if (!session) return { success: false as const, error: "Unauthorized" };

  const postId = Number(id);

  try {
    const existing = await db.post.findUnique({ where: { id: postId } });
    if (!existing) return { success: false as const, error: "Post not found" };

    if (data.tags !== undefined) {
      await db.postTag.deleteMany({ where: { postId } });
    }

    const post = await db.post.update({
      where: { id: postId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt }),
        ...(data.published !== undefined && { published: data.published }),
        ...(data.tags !== undefined && { tags: tagsConnect(data.tags) }),
      },
      include: POST_INCLUDE,
    });

    return { success: true as const, data: post };
  } catch {
    return { success: false as const, error: "Failed to update post" };
  }
}

export async function deletePost(id: string) {
  const session = await getSession();
  if (!session) return { success: false as const, error: "Unauthorized" };

  const postId = Number(id);

  try {
    const existing = await db.post.findUnique({ where: { id: postId } });
    if (!existing) return { success: false as const, error: "Post not found" };

    await db.post.delete({ where: { id: postId } });
    return { success: true as const, data: { id: postId } };
  } catch {
    return { success: false as const, error: "Failed to delete post" };
  }
}
