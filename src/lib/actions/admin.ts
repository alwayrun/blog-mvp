"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifyPassword, generateToken } from "@/lib/auth";
import { getSession, AUTH_COOKIE } from "@/lib/session";

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginAction(
  _: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "请填写邮箱和密码" };

  const user = await db.user.findUnique({ where: { email } });
  if (!user) return { error: "邮箱或密码错误" };

  const valid = await verifyPassword(password, user.password);
  if (!valid) return { error: "邮箱或密码错误" };

  const token = generateToken(String(user.id));
  const jar = await cookies();
  jar.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/admin");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(AUTH_COOKIE);
  redirect("/admin/login");
}

// ── Queries ───────────────────────────────────────────────────────────────────

export async function getAdminPosts() {
  const session = await getSession();
  if (!session) return { success: false as const, error: "Unauthorized" };

  try {
    const posts = await db.post.findMany({
      include: { tags: { include: { tag: true } } },
      orderBy: { createdAt: "desc" },
    });
    return { success: true as const, data: posts };
  } catch {
    return { success: false as const, error: "Failed to fetch posts" };
  }
}

export async function getAdminPost(id: number) {
  const session = await getSession();
  if (!session) return { success: false as const, error: "Unauthorized" };

  try {
    const post = await db.post.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } } },
    });
    if (!post) return { success: false as const, error: "Post not found" };
    return { success: true as const, data: post };
  } catch {
    return { success: false as const, error: "Failed to fetch post" };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toSlug(text: string): string {
  const ascii = text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii.length >= 2 ? ascii : `post-${Date.now()}`;
}

async function uniqueSlug(base: string, excludeId?: number): Promise<string> {
  let slug = base;
  let i = 0;
  while (true) {
    const hit = await db.post.findUnique({ where: { slug } });
    if (!hit || hit.id === excludeId) break;
    slug = `${base}-${++i}`;
  }
  return slug;
}

function buildTagsCreate(raw: string) {
  const names = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!names.length) return undefined;
  return {
    create: names.map((name) => {
      const slug = toSlug(name);
      return {
        tag: { connectOrCreate: { where: { slug }, create: { name, slug } } },
      };
    }),
  };
}

function parseForm(formData: FormData) {
  return {
    id: Number(formData.get("id") ?? 0),
    title: String(formData.get("title") ?? "").trim(),
    slugInput: String(formData.get("slug") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim() || null,
    content: String(formData.get("content") ?? "").trim(),
    published: formData.get("published") === "on",
    tagsRaw: String(formData.get("tags") ?? "").trim(),
  };
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export async function createPostAction(
  _: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const session = await getSession();
  if (!session) return { error: "未登录" };

  const { title, slugInput, excerpt, content, published, tagsRaw } =
    parseForm(formData);

  if (!title) return { error: "标题不能为空" };
  if (!content) return { error: "内容不能为空" };

  const slug = await uniqueSlug(slugInput || toSlug(title));

  try {
    await db.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        published,
        authorId: Number(session.userId),
        tags: buildTagsCreate(tagsRaw),
      },
    });
  } catch {
    return { error: "创建失败，请重试" };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

export async function updatePostAction(
  _: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const session = await getSession();
  if (!session) return { error: "未登录" };

  const { id, title, slugInput, excerpt, content, published, tagsRaw } =
    parseForm(formData);

  if (!id) return { error: "无效的文章 ID" };
  if (!title) return { error: "标题不能为空" };
  if (!content) return { error: "内容不能为空" };

  const existing = await db.post.findUnique({ where: { id } });
  if (!existing) return { error: "文章不存在" };

  const base = slugInput || existing.slug;
  const slug =
    base !== existing.slug ? await uniqueSlug(base, id) : existing.slug;

  try {
    await db.postTag.deleteMany({ where: { postId: id } });
    await db.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        published,
        tags: buildTagsCreate(tagsRaw),
      },
    });
  } catch {
    return { error: "更新失败，请重试" };
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/posts/${slug}`);
  redirect("/admin");
}

export async function deletePostAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const id = Number(formData.get("id") ?? 0);
  if (!id) return;

  try {
    await db.post.delete({ where: { id } });
  } catch {
    return;
  }

  revalidatePath("/admin");
  revalidatePath("/");
}
