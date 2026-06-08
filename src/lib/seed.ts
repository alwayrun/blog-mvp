import "dotenv/config";
import { db } from "./db";
import { hashPassword } from "./auth";

async function seed() {
  const email = process.env.ADMIN_EMAIL ?? "admin@blog.com";
  const password = process.env.ADMIN_PASSWORD ?? "password123";

  let user = await db.user.findUnique({ where: { email } });
  if (user) {
    console.log(`Admin already exists: ${email} (id: ${user.id})`);
  } else {
    const hashed = await hashPassword(password);
    user = await db.user.create({ data: { email, password: hashed } });
    console.log(`Created admin: ${user.email} (id: ${user.id})`);
  }

  const postCount = await db.post.count();
  if (postCount > 0) {
    console.log(`Posts already seeded (${postCount} posts), skipping.`);
    return;
  }

  const posts = [
    {
      title: "用 Next.js 15 构建现代博客",
      slug: "build-blog-with-nextjs-15",
      excerpt: "探索 Next.js 15 App Router 的新特性，以及如何利用 Server Components 和 Server Actions 构建高性能博客系统。",
      content: `## 为什么选择 Next.js 15

Next.js 15 带来了许多令人兴奋的改进，包括更快的构建速度和改进的 App Router。

## App Router 的优势

App Router 允许我们在服务端渲染组件，减少客户端 JavaScript 的体积：

\`\`\`tsx
// Server Component - 默认无需 "use client"
export default async function PostList() {
  const posts = await db.post.findMany();
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
\`\`\`

## Server Actions

Server Actions 让表单提交和数据变更变得更简单：

\`\`\`ts
"use server";
export async function createPost(data: CreatePostInput) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };
  // ...
}
\`\`\`

## 总结

Next.js 15 + Prisma + Tailwind CSS 是构建现代博客的绝佳组合。`,
      published: true,
      tags: ["Next.js", "React"],
    },
    {
      title: "TypeScript 严格模式实践指南",
      slug: "typescript-strict-mode-guide",
      excerpt: "在大型项目中启用 TypeScript strict 模式的最佳实践，包括 unknown 类型的使用、类型守卫以及常见陷阱的处理方法。",
      content: `## 开启 strict 模式

在 \`tsconfig.json\` 中设置：

\`\`\`json
{
  "compilerOptions": {
    "strict": true
  }
}
\`\`\`

## 使用 unknown 替代 any

\`\`\`typescript
// ❌ 不好的做法
function parse(input: any) {
  return input.value;
}

// ✅ 更安全的做法
function parse(input: unknown): string {
  if (typeof input === "object" && input !== null && "value" in input) {
    return String((input as { value: unknown }).value);
  }
  throw new Error("Invalid input");
}
\`\`\`

## 类型守卫

类型守卫帮助我们在运行时验证类型：

\`\`\`typescript
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "email" in value &&
    typeof (value as User).email === "string"
  );
}
\`\`\`

## 总结

严格模式虽然增加了一些开发成本，但能显著减少运行时错误。`,
      published: true,
      tags: ["TypeScript"],
    },
    {
      title: "Tailwind CSS v4 新特性解析",
      slug: "tailwind-css-v4-features",
      excerpt: "Tailwind CSS v4 带来了全新的配置方式和性能优化，本文介绍主要变化和迁移策略。",
      content: `## Tailwind CSS v4 的主要变化

Tailwind CSS v4 是一次重大更新，带来了更快的构建速度和更简洁的配置。

## 新的配置方式

不再需要 \`tailwind.config.js\`，直接在 CSS 中配置：

\`\`\`css
@import "tailwindcss";

@theme {
  --color-brand: #3b82f6;
  --font-sans: "Geist", system-ui;
}
\`\`\`

## 性能提升

v4 的增量构建速度提升了 **5x**，完整构建速度提升了 **100x**。

## 迁移建议

对于大多数项目，迁移过程相对简单：

1. 更新包版本
2. 将配置迁移到 CSS 文件
3. 处理少量破坏性变更

## 结语

Tailwind CSS v4 是前端开发工具链的一大进步。`,
      published: true,
      tags: ["CSS", "Tailwind CSS"],
    },
  ];

  for (const postData of posts) {
    const { tags, ...rest } = postData;
    await db.post.create({
      data: {
        ...rest,
        authorId: user.id,
        tags: {
          create: tags.map((name) => ({
            tag: {
              connectOrCreate: {
                where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
                create: {
                  name,
                  slug: name.toLowerCase().replace(/\s+/g, "-"),
                },
              },
            },
          })),
        },
      },
    });
    console.log(`Created post: ${rest.title}`);
  }
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect());
