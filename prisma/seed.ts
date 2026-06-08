import "dotenv/config";
import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

type TagSlug = "tech" | "frontend" | "backend" | "tools" | "thinking" | "life";

interface PostDef {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  tagSlugs: TagSlug[];
  daysAgo: number;
}

const POSTS: PostDef[] = [
  {
    title: "用 Vim 提升编程效率的 10 个技巧",
    slug: "vim-productivity-tips",
    excerpt: "从基础操作到高级插件，系统梳理 Vim 在日常编程中的实用技巧，显著提升编辑效率。",
    content: `## 为什么选择 Vim

在各类编辑器和 IDE 层出不穷的今天，Vim 依然是许多资深程序员的首选工具。它的核心优势在于**键盘驱动**的操作模式——双手几乎不需要离开主键区，减少了大量鼠标切换带来的上下文中断。

## 必须掌握的基础技巧

掌握以下操作可以让你的编辑速度提升一个台阶：

- \`ci"\` — 修改引号内的内容
- \`va{\` — 选中花括号及其内容
- \`=G\` — 格式化当前位置到文件末尾
- \`Ctrl+o\` / \`Ctrl+i\` — 在跳转历史中前后移动

## 高效的窗口管理

\`\`\`vim
" 水平分割
:split filename

" 垂直分割
:vsplit filename

" 在窗口间移动
Ctrl+w + h/j/k/l
\`\`\`

## 必备插件推荐

1. **vim-surround** — 快速操作成对符号
2. **fzf.vim** — 模糊搜索文件和内容
3. **vim-commentary** — 快速注释
4. **ale** — 异步语法检查和代码格式化

## 总结

Vim 的学习曲线确实较陡，但一旦度过初期适应期，它带来的效率提升是其他工具难以比拟的。建议从 \`vimtutor\` 开始，每天练习 30 分钟，两周内就能感受到明显变化。`,
    published: true,
    tagSlugs: ["tools", "tech"],
    daysAgo: 88,
  },
  {
    title: "React 18 并发模式详解",
    slug: "react-18-concurrent-mode",
    excerpt: "深入理解 React 18 并发特性：Suspense、useTransition、useDeferredValue 的使用场景与原理。",
    content: `## 什么是并发模式

React 18 引入的并发模式（Concurrent Mode）允许 React 同时准备多个版本的 UI，根据用户优先级中断、暂停或恢复渲染工作，从而让应用在高负载下依然保持流畅。

## useTransition：低优先级更新

\`\`\`tsx
import { useState, useTransition } from "react";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    startTransition(() => {
      setResults(expensiveSearch(e.target.value));
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending ? <Spinner /> : <ResultList results={results} />}
    </div>
  );
}
\`\`\`

## useDeferredValue：延迟派生值

当你无法控制触发更新的代码时，\`useDeferredValue\` 是更好的选择：

\`\`\`tsx
const deferredQuery = useDeferredValue(query);
// 使用 deferredQuery 渲染列表，不会阻塞输入
\`\`\`

## Suspense 数据获取

React 18 中 Suspense 正式支持数据获取场景。配合 Next.js 的 \`loading.tsx\` 可以实现优雅的加载状态：

\`\`\`tsx
<Suspense fallback={<PostSkeleton />}>
  <PostContent slug={slug} />
</Suspense>
\`\`\`

## 总结

并发模式不是一个需要手动开启的开关，而是一套让 React 更聪明地调度工作的机制。从 \`useTransition\` 和 \`useDeferredValue\` 开始实践，能显著改善搜索、过滤等交互密集场景的体验。`,
    published: true,
    tagSlugs: ["frontend", "tech"],
    daysAgo: 83,
  },
  {
    title: "Node.js 性能优化实战",
    slug: "nodejs-performance-optimization",
    excerpt: "从事件循环、内存管理到集群模式，系统讲解 Node.js 应用的性能瓶颈排查与优化方法。",
    content: `## 理解事件循环

Node.js 的高并发能力来自于其单线程事件循环模型。理解事件循环的各个阶段（timers、I/O callbacks、idle/prepare、poll、check、close callbacks）是排查性能问题的基础。

## 找出性能瓶颈

使用内置的 \`--inspect\` 标志配合 Chrome DevTools 进行 CPU profiling：

\`\`\`bash
node --inspect --inspect-brk app.js
# 在 Chrome 打开 chrome://inspect
\`\`\`

常见瓶颈及对策：

| 瓶颈类型 | 症状 | 对策 |
|---------|------|------|
| CPU 密集 | 事件循环阻塞 | Worker Threads |
| 内存泄漏 | 内存持续增长 | Heap Snapshot 分析 |
| I/O 等待 | 高延迟低 CPU | 连接池、缓存 |

## 集群模式充分利用多核

\`\`\`js
import cluster from "cluster";
import os from "os";

if (cluster.isPrimary) {
  const cpus = os.cpus().length;
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(\`Worker \${worker.process.pid} died, restarting...\`);
    cluster.fork();
  });
} else {
  // 启动 HTTP 服务
  startServer();
}
\`\`\`

## 流式处理大数据

避免将大文件一次性读入内存，使用流式处理：

\`\`\`js
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import { createGzip } from "zlib";

await pipeline(
  createReadStream("large-file.txt"),
  createGzip(),
  createWriteStream("large-file.txt.gz")
);
\`\`\`

## 总结

Node.js 性能优化没有银弹。先测量、再定位、再优化，避免过早优化。掌握 profiling 工具的使用，是每个 Node.js 开发者必备的技能。`,
    published: true,
    tagSlugs: ["backend", "tech"],
    daysAgo: 79,
  },
  {
    title: "CSS Grid 布局完全指南",
    slug: "css-grid-layout-guide",
    excerpt: "从基础语法到复杂布局，全面掌握 CSS Grid，彻底告别各种 hack 式布局方案。",
    content: `## Grid 与 Flexbox 的选择

Flexbox 是一维布局工具，适合行或列方向的对齐；Grid 是二维布局工具，适合同时控制行和列。两者并不对立，实际项目中经常配合使用。

## 核心概念

\`\`\`css
.container {
  display: grid;

  /* 定义列：3 列，各占 1 份 */
  grid-template-columns: repeat(3, 1fr);

  /* 定义行：第一行 80px，其余自动 */
  grid-template-rows: 80px auto;

  /* 间距 */
  gap: 16px 24px; /* row-gap column-gap */
}
\`\`\`

## 命名区域布局

\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main    main"
    "footer footer  footer";
  grid-template-columns: 200px 1fr 1fr;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
\`\`\`

## 响应式 Grid

无需媒体查询实现响应式列数：

\`\`\`css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
\`\`\`

## 总结

CSS Grid 的学习曲线在于要建立"格子思维"——先想清楚整体结构，再用 Grid 属性描述它。一旦习惯这种思维方式，复杂布局会变得异常清晰直观。`,
    published: true,
    tagSlugs: ["frontend"],
    daysAgo: 75,
  },
  {
    title: "Git 工作流最佳实践",
    slug: "git-workflow-best-practices",
    excerpt: "适合团队协作的 Git 工作流选型指南，以及提交规范、分支管理、Code Review 的实践建议。",
    content: `## 工作流选型

常见的 Git 工作流有三种：

- **Git Flow** — 适合版本发布周期明确的产品
- **GitHub Flow** — 适合持续部署的 Web 应用
- **Trunk-based Development** — 适合高频发布、功能完善的大型团队

对于大多数中小团队，**GitHub Flow** 是最佳起点：main 分支始终可部署，功能通过 feature branch + PR 合入。

## 提交信息规范

遵循 Conventional Commits 格式：

\`\`\`
<type>(<scope>): <subject>

[optional body]

[optional footer]
\`\`\`

常用 type：\`feat\` / \`fix\` / \`docs\` / \`refactor\` / \`test\` / \`chore\`

## 分支命名约定

\`\`\`bash
feature/user-auth
fix/login-redirect
chore/upgrade-dependencies
\`\`\`

## 有效的 Code Review

Code Review 不是挑错，而是知识共享和风险管控：

1. 每次 PR 控制在 400 行以内
2. 描述清楚"为什么"而不只是"做了什么"
3. 评论区分：必须修改 / 建议 / 疑问
4. 不要在 PR 里讨论架构决策，这些应在开发前对齐

## 常用救命命令

\`\`\`bash
# 撤销最后一次提交，保留改动
git reset HEAD~1

# 交互式 rebase 整理提交历史
git rebase -i HEAD~5

# 找回误删的提交
git reflog
\`\`\``,
    published: true,
    tagSlugs: ["tools"],
    daysAgo: 71,
  },
  {
    title: "Docker 容器化 Node.js 应用",
    slug: "docker-nodejs-containerization",
    excerpt: "从零开始编写生产级 Dockerfile，实现多阶段构建、非 root 用户运行和镜像体积优化。",
    content: `## 为什么容器化

容器化解决了"在我机器上能跑"的经典问题。通过将应用和运行环境打包在一起，确保开发、测试、生产环境的一致性，也让水平扩展变得简单。

## 多阶段构建 Dockerfile

\`\`\`dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# 运行阶段
FROM node:20-alpine AS runner
WORKDIR /app

# 非 root 用户，增强安全性
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## docker-compose 本地开发

\`\`\`yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
\`\`\`

## 常用调试命令

\`\`\`bash
# 查看容器日志
docker logs -f container-name

# 进入容器 shell
docker exec -it container-name sh

# 清理未使用的镜像
docker system prune -a
\`\`\`

## 总结

多阶段构建是生产环境 Dockerfile 的标配，可以将镜像体积从 1GB+ 压缩到 100MB 以内。配合非 root 用户和只读文件系统，能显著提升容器运行时的安全性。`,
    published: true,
    tagSlugs: ["backend", "tools"],
    daysAgo: 67,
  },
  {
    title: "TypeScript 泛型深度解析",
    slug: "typescript-generics-deep-dive",
    excerpt: "从基础泛型到条件类型、映射类型，彻底理解 TypeScript 类型系统的核心机制。",
    content: `## 泛型的本质

泛型（Generics）是类型系统中的"占位符"——允许你编写与具体类型无关的通用代码，同时保留完整的类型安全。

\`\`\`typescript
// 没有泛型：要么 any，要么重复代码
function identity(arg: any): any { return arg; }

// 有泛型：类型安全 + 通用
function identity<T>(arg: T): T { return arg; }

const str = identity("hello"); // 推导为 string
const num = identity(42);      // 推导为 number
\`\`\`

## 约束泛型

\`\`\`typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength("hello");      // ✅
logLength([1, 2, 3]);   // ✅
logLength(42);           // ❌ number 没有 length
\`\`\`

## 条件类型

\`\`\`typescript
type IsArray<T> = T extends unknown[] ? true : false;

type A = IsArray<string[]>; // true
type B = IsArray<string>;   // false

// 实用场景：提取 Promise 的值类型
type Awaited<T> = T extends Promise<infer U> ? U : T;
type Value = Awaited<Promise<string>>; // string
\`\`\`

## 映射类型

\`\`\`typescript
// 将所有属性变为可选
type Partial<T> = { [K in keyof T]?: T[K] };

// 将所有属性变为只读
type Readonly<T> = { readonly [K in keyof T]: T[K] };

// 只保留部分属性
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
\`\`\`

## 总结

TypeScript 的类型系统本身就是一门图灵完备的语言。掌握泛型、条件类型和映射类型，能让你编写出真正通用且类型安全的代码，减少重复的类型定义。`,
    published: true,
    tagSlugs: ["frontend", "tech"],
    daysAgo: 63,
  },
  {
    title: "REST API 设计规范与实践",
    slug: "rest-api-design-guide",
    excerpt: "覆盖资源命名、HTTP 方法语义、状态码使用、版本控制和错误格式的 REST API 设计完整指南。",
    content: `## REST 的核心约束

REST 不是标准，而是一组约束。真正的 RESTful API 需要满足：无状态（Stateless）、统一接口（Uniform Interface）、资源导向（Resource-oriented）。

## 资源命名规范

\`\`\`
✅ 正确
GET    /articles              # 文章列表
GET    /articles/42           # 单篇文章
POST   /articles              # 创建文章
PATCH  /articles/42           # 部分更新
DELETE /articles/42           # 删除

❌ 错误
GET /getArticles
POST /createArticle
GET /articles/delete/42
\`\`\`

## 状态码使用

| 场景 | 状态码 |
|------|--------|
| 查询成功 | 200 OK |
| 创建成功 | 201 Created |
| 无内容返回 | 204 No Content |
| 参数校验失败 | 400 Bad Request |
| 未认证 | 401 Unauthorized |
| 无权限 | 403 Forbidden |
| 资源不存在 | 404 Not Found |
| 服务端错误 | 500 Internal Server Error |

## 统一错误格式

\`\`\`json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "请求参数不合法",
    "details": [
      { "field": "email", "message": "邮箱格式不正确" }
    ]
  }
}
\`\`\`

## 版本控制

推荐 URL 路径版本控制，简单直观：

\`\`\`
/v1/articles
/v2/articles
\`\`\`

避免将版本放在 Header 中——增加了客户端复杂度，且难以在浏览器中直接测试。

## 总结

好的 API 设计是产品的一部分。遵循规范能降低接入成本，减少歧义，让 API 文档几乎成为不必要的存在。`,
    published: true,
    tagSlugs: ["backend"],
    daysAgo: 59,
  },
  {
    title: "前端性能优化：从理论到实践",
    slug: "frontend-performance-optimization",
    excerpt: "系统梳理前端性能指标、测量方法和优化手段，以 Core Web Vitals 为核心，构建性能优化工作流。",
    content: `## 为什么性能很重要

Google 研究表明，页面加载时间每增加 1 秒，移动端转化率下降 20%。性能不是锦上添花，而是直接影响业务指标的核心功能。

## Core Web Vitals

Google 定义的三个核心性能指标：

- **LCP**（Largest Contentful Paint）— 最大内容绘制，衡量加载体验，目标 < 2.5s
- **FID**（First Input Delay）— 首次输入延迟，衡量交互响应，目标 < 100ms
- **CLS**（Cumulative Layout Shift）— 累计布局偏移，衡量视觉稳定性，目标 < 0.1

## 测量工具

\`\`\`bash
# Lighthouse CLI
npx lighthouse https://example.com --output json

# web-vitals 库（在代码中埋点）
import { getCLS, getFID, getLCP } from 'web-vitals';
getCLS(console.log);
getFID(console.log);
getLCP(console.log);
\`\`\`

## 实践优化手段

**资源加载优化：**
- 图片使用 \`next/image\`，自动 WebP 转换 + 懒加载
- 字体使用 \`next/font\`，消除布局偏移
- 第三方脚本用 \`next/script\` 控制加载策略

**代码分割：**
\`\`\`tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
});
\`\`\`

**缓存策略：**
- 静态资源：\`Cache-Control: max-age=31536000, immutable\`
- HTML 页面：\`Cache-Control: no-cache\`（配合 ETag）
- API 响应：根据数据时效性设置合适的 TTL

## 总结

性能优化是持续过程，不是一次性任务。建立监控 → 测量 → 优化 → 验证的闭环，才能真正控制应用的性能表现。`,
    published: true,
    tagSlugs: ["frontend", "tech"],
    daysAgo: 55,
  },
  {
    title: "PostgreSQL 索引优化指南",
    slug: "postgresql-index-optimization",
    excerpt: "深入理解 PostgreSQL 索引类型、执行计划分析和慢查询优化，让数据库查询速度提升 10 倍。",
    content: `## 索引不是万能的

索引通过牺牲写入性能和存储空间来换取查询速度。滥用索引反而会拖慢写入密集型应用。在添加索引前，先用 \`EXPLAIN ANALYZE\` 确认它是否真的被用到。

## 常用索引类型

\`\`\`sql
-- B-tree 索引（默认，适合等值和范围查询）
CREATE INDEX idx_posts_created_at ON posts (created_at DESC);

-- 复合索引（顺序很重要！高选择性字段放前面）
CREATE INDEX idx_posts_user_published
  ON posts (author_id, published, created_at DESC);

-- 部分索引（只索引满足条件的行，体积更小）
CREATE INDEX idx_posts_published
  ON posts (created_at DESC)
  WHERE published = true;

-- GIN 索引（适合 JSONB、数组、全文搜索）
CREATE INDEX idx_posts_tags ON posts USING GIN (tags);
\`\`\`

## 分析执行计划

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM posts
WHERE author_id = 1 AND published = true
ORDER BY created_at DESC
LIMIT 20;
\`\`\`

关键词解读：
- **Seq Scan** — 全表扫描，通常意味着缺少索引
- **Index Scan** — 用到了索引
- **Bitmap Heap Scan** — 用索引找到行 ID，再批量读取数据页
- **cost** — \`(启动成本..总成本)\`

## 慢查询监控

\`\`\`sql
-- 开启慢查询日志（在 postgresql.conf）
log_min_duration_statement = 1000  -- 记录超过 1s 的查询

-- 使用 pg_stat_statements 扩展统计
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
\`\`\`

## 总结

索引优化的核心是：先测量，再分析，再优化。不要凭感觉添加索引，让 \`EXPLAIN ANALYZE\` 告诉你真正的瓶颈在哪里。`,
    published: true,
    tagSlugs: ["backend", "tech"],
    daysAgo: 51,
  },
  {
    title: "微服务架构设计原则",
    slug: "microservices-architecture-principles",
    excerpt: "微服务不是银弹，本文从实际工程经验出发，讨论微服务的适用场景、拆分原则和常见陷阱。",
    content: `## 微服务的代价

微服务带来了独立部署和技术异构的灵活性，但同时引入了：分布式系统的复杂性、网络调用的额外延迟、跨服务事务的困难、运维和监控成本的显著增加。

**在没有充分理由前，单体应用是更好的选择。**

## 何时考虑微服务

- 团队规模超过 50 人，单体代码库成为协作瓶颈
- 不同模块有截然不同的扩展需求
- 需要技术异构（部分模块需要 Python ML，部分需要 Go 高性能）
- 组织上已经有明确的团队边界（Conway 定律）

## 服务拆分原则

遵循**领域驱动设计（DDD）**的限界上下文（Bounded Context）进行拆分：

\`\`\`
用户域 → 用户服务（注册、登录、Profile）
内容域 → 内容服务（文章、评论、草稿）
通知域 → 通知服务（邮件、站内信、Push）
\`\`\`

避免按技术层次拆分（"数据库服务"、"缓存服务"）——这会导致大量跨服务调用。

## 服务间通信

| 场景 | 推荐方案 |
|------|---------|
| 同步请求响应 | gRPC / REST |
| 异步事件 | Kafka / RabbitMQ |
| 跨服务查询 | GraphQL Federation / BFF |

## 总结

微服务是组织复杂度的解决方案，不是技术问题的解决方案。在团队规模和产品复杂度达到临界点之前，保持单体或模块化单体，能让你以更低的成本快速迭代。`,
    published: true,
    tagSlugs: ["backend", "thinking"],
    daysAgo: 47,
  },
  {
    title: "JavaScript 异步编程演进史",
    slug: "javascript-async-evolution",
    excerpt: "从回调地狱到 Promise，再到 async/await，梳理 JavaScript 异步编程模型的演进历程与设计哲学。",
    content: `## 回调时代的痛苦

早期 JavaScript 的异步操作全靠回调函数。当操作相互依赖时，嵌套层级急剧增加——这就是臭名昭著的"回调地狱"：

\`\`\`javascript
getUser(userId, function(err, user) {
  if (err) return handleError(err);
  getOrders(user.id, function(err, orders) {
    if (err) return handleError(err);
    getProducts(orders[0].id, function(err, products) {
      if (err) return handleError(err);
      // 终于拿到数据...
    });
  });
});
\`\`\`

## Promise 的救赎

ES6 引入 Promise，将嵌套改为链式调用：

\`\`\`javascript
getUser(userId)
  .then(user => getOrders(user.id))
  .then(orders => getProducts(orders[0].id))
  .then(products => console.log(products))
  .catch(handleError);
\`\`\`

## async/await：同步的写法，异步的执行

ES2017 的 async/await 让异步代码看起来和同步代码一样：

\`\`\`javascript
async function fetchUserProducts(userId) {
  try {
    const user = await getUser(userId);
    const orders = await getOrders(user.id);
    const products = await getProducts(orders[0].id);
    return products;
  } catch (err) {
    handleError(err);
  }
}
\`\`\`

## 并行执行

\`\`\`javascript
// 顺序执行（慢，总时间 = 所有请求之和）
const user = await getUser(id);
const settings = await getSettings(id);

// 并行执行（快，总时间 = 最慢的那个）
const [user, settings] = await Promise.all([
  getUser(id),
  getSettings(id),
]);
\`\`\`

## 总结

async/await 是目前最符合人类直觉的异步编程方式，但底层仍是 Promise。理解 Promise 的状态机和微任务队列，才能真正掌控异步代码的执行时机。`,
    published: true,
    tagSlugs: ["frontend", "tech"],
    daysAgo: 43,
  },
  {
    title: "Tailwind CSS 实战技巧",
    slug: "tailwind-css-practical-tips",
    excerpt: "超越基础用法，介绍 Tailwind CSS 在大型项目中的组织策略、自定义主题和性能优化技巧。",
    content: `## 组件提取的时机

Tailwind 的原子类方式初看会让 HTML 很冗长。正确的应对方式不是过早提取 class，而是**提取组件**：

\`\`\`tsx
// ❌ 错误：用 @apply 提取工具类
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700;
}

// ✅ 正确：提取 React 组件
function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      {...props}
    >
      {children}
    </button>
  );
}
\`\`\`

## 自定义主题

在 CSS 文件中定义设计令牌：

\`\`\`css
@import "tailwindcss";

@theme {
  --color-brand-50: oklch(0.97 0.01 264);
  --color-brand-500: oklch(0.55 0.22 264);
  --color-brand-900: oklch(0.25 0.12 264);

  --font-sans: "Geist Variable", system-ui, sans-serif;
  --radius-card: 12px;
}
\`\`\`

## 条件样式的最佳实践

使用 \`clsx\` 或 \`cn\` 管理条件类名：

\`\`\`tsx
import { clsx } from "clsx";

function Badge({ variant }: { variant: "success" | "error" | "warning" }) {
  return (
    <span className={clsx(
      "px-2 py-0.5 rounded-full text-sm font-medium",
      variant === "success" && "bg-green-100 text-green-800",
      variant === "error"   && "bg-red-100 text-red-800",
      variant === "warning" && "bg-yellow-100 text-yellow-800",
    )}>
      {/* ... */}
    </span>
  );
}
\`\`\`

## 总结

Tailwind 的设计哲学是"工具类优先"，但这不意味着放弃组件化。将设计系统表达为设计令牌，将 UI 模式封装为组件，才是在大型项目中驾驭 Tailwind 的正确姿势。`,
    published: true,
    tagSlugs: ["frontend", "tools"],
    daysAgo: 39,
  },
  {
    title: "Web 安全：XSS 与 CSRF 防护",
    slug: "web-security-xss-csrf",
    excerpt: "深入理解 XSS 和 CSRF 攻击原理，掌握 Next.js 应用中的防护措施和安全最佳实践。",
    content: `## XSS：跨站脚本攻击

XSS 攻击通过在页面中注入恶意脚本，在受害者浏览器中执行攻击者的代码。

**存储型 XSS** 是最危险的：攻击者将恶意脚本存入数据库，所有访问该内容的用户都会受到攻击。

### 防护措施

\`\`\`tsx
// React 默认转义 JSX 中的字符串 ✅
<div>{userContent}</div>

// dangerouslySetInnerHTML 需要先消毒 ⚠️
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(userHtml)
}} />
\`\`\`

设置严格的 CSP（Content Security Policy）：

\`\`\`
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'
\`\`\`

## CSRF：跨站请求伪造

CSRF 利用用户已登录的状态，诱骗其在不知情的情况下发起恶意请求。

### 防护措施

1. **SameSite Cookie**（现代浏览器首选方案）：

\`\`\`typescript
cookies().set("session", token, {
  httpOnly: true,
  secure: true,
  sameSite: "lax",  // 或 "strict"
  path: "/",
});
\`\`\`

2. **CSRF Token**（兼容旧浏览器）：在表单中加入服务端生成的随机 token，提交时验证。

3. **验证 Origin/Referer Header**：Server Action 默认验证请求来源。

## Next.js 安全配置

\`\`\`typescript
// next.config.ts
const nextConfig = {
  headers: async () => [{
    source: "/(.*)",
    headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ],
  }],
};
\`\`\`

## 总结

安全不是功能，而是每个功能都必须具备的属性。Server Actions 天然防 CSRF，React 天然防 XSS，但这些保护都有边界——理解攻击原理，才能在边界处做好防护。`,
    published: true,
    tagSlugs: ["tech", "backend"],
    daysAgo: 35,
  },
  {
    title: "Redis 缓存策略最佳实践",
    slug: "redis-caching-best-practices",
    excerpt: "从缓存模式选型到失效策略，系统介绍 Redis 在 Web 应用中的缓存实践，以及缓存穿透、击穿、雪崩的应对方案。",
    content: `## 常见缓存模式

**Cache-Aside（旁路缓存）** — 最常用：

\`\`\`typescript
async function getPost(slug: string) {
  const cached = await redis.get(\`post:\${slug}\`);
  if (cached) return JSON.parse(cached);

  const post = await db.post.findUnique({ where: { slug } });
  if (post) {
    await redis.setex(\`post:\${slug}\`, 3600, JSON.stringify(post));
  }
  return post;
}
\`\`\`

**Write-Through** — 写入时同步更新缓存，适合读多写少场景。

**Write-Behind** — 异步批量写入，适合高写入频率，但有数据丢失风险。

## 三大缓存问题

**缓存穿透**：查询不存在的 key，请求直达数据库。
解决：布隆过滤器（Bloom Filter）预判 key 是否存在；或缓存空值。

**缓存击穿**：热点 key 失效瞬间，大量请求同时打到数据库。
解决：互斥锁（只允许一个请求重建缓存）；或永不过期 + 后台定时刷新。

**缓存雪崩**：大量 key 同时失效。
解决：过期时间加随机抖动：

\`\`\`typescript
const ttl = 3600 + Math.floor(Math.random() * 600); // 3600 ± 10min
await redis.setex(key, ttl, value);
\`\`\`

## Key 命名规范

\`\`\`
<业务>:<实体>:<ID>

post:detail:42
user:profile:1001
feed:home:1001:page:2
\`\`\`

## 总结

缓存不是数据库的备份，而是热点数据的加速层。合理设置过期时间、做好缓存失效策略，是避免缓存问题的关键。不要让业务逻辑依赖缓存的一致性——数据库永远是 source of truth。`,
    published: true,
    tagSlugs: ["backend", "tech"],
    daysAgo: 31,
  },
  {
    title: "编写可维护代码的 5 个原则",
    slug: "maintainable-code-principles",
    excerpt: "超越语法和框架，从代码可读性、命名、单一职责等维度探讨如何写出经得起时间考验的代码。",
    content: `## 原则一：代码是写给人看的

代码首先是给人阅读的，其次才是给机器执行的。衡量代码质量的标准不是"能不能跑"，而是"下一个读它的人需要多少时间理解它"。

## 原则二：好的命名胜过注释

\`\`\`typescript
// ❌ 需要注释解释的代码
// 检查用户是否有权限访问管理后台
if (u.r === 1 && !u.d) { ... }

// ✅ 代码自说明
if (user.isAdmin && !user.isDeleted) { ... }
\`\`\`

**命名准则：**
- 函数名用动词（\`fetchUser\`, \`validateEmail\`）
- 布尔变量加 is/has/can 前缀（\`isLoading\`, \`hasPermission\`）
- 避免缩写（\`usr\` → \`user\`，\`btn\` → \`button\`）

## 原则三：函数只做一件事

单一职责原则（SRP）是最重要的设计原则之一。如果你发现函数名里有"和"字，或者函数超过 20 行，通常意味着它在做多件事。

## 原则四：拥抱删除代码的勇气

- 注释掉的代码 → 直接删除（Git 会记住它）
- 未使用的参数 → 删除
- "以防万一"的代码 → 删除

死代码是最危险的代码，因为它会引起误解，让维护者以为它有存在的必要。

## 原则五：一致性比"最优"更重要

团队中保持一致的代码风格，比每个人都写出"最优雅"但风格各异的代码更重要。工具优先：ESLint + Prettier + EditorConfig 自动化强制一致性。

## 总结

可维护性不是一次性投资，而是日积月累的习惯。每次提交前问一句："如果我六个月后看到这段代码，能快速理解它的意图吗？"`,
    published: true,
    tagSlugs: ["tech", "thinking"],
    daysAgo: 27,
  },
  {
    title: "GraphQL vs REST：如何选择",
    slug: "graphql-vs-rest-comparison",
    excerpt: "从实际工程场景出发，客观分析 GraphQL 和 REST 的优劣，给出不同团队规模和场景下的选型建议。",
    content: `## 各自的核心优势

**REST 的优势：**
- 简单直观，HTTP 原生语义
- 缓存友好（GET 请求可被 CDN 缓存）
- 生态成熟，工具链完善
- 适合公开 API（文档友好）

**GraphQL 的优势：**
- 客户端精确控制返回字段，解决过获取/欠获取
- 单端点，减少请求次数
- 强类型 Schema 作为契约
- 适合多客户端（Web/Mobile 按需取数）

## 常见误解

GraphQL 并不能解决所有问题：
- N+1 查询问题需要 DataLoader 手动处理
- 缓存比 REST 复杂得多（需要 persisted queries）
- 文件上传处理麻烦
- 学习和运维成本更高

## 选型建议

\`\`\`
公开 API / 第三方接入     → REST
内部 BFF / 多端应用       → GraphQL
简单 CRUD 应用            → REST (tRPC 也是好选择)
数据关系复杂的查询密集型   → GraphQL
\`\`\`

## 中间方案：tRPC

如果是全栈 TypeScript 项目，tRPC 提供了 GraphQL 的类型安全性，同时保留了 REST 的简单性，值得认真考虑。

## 总结

技术选型没有绝对的对错，只有"适不适合当前场景"。先明确团队规模、客户端种类和数据复杂度，再做决策。`,
    published: false,
    tagSlugs: ["backend", "tech"],
    daysAgo: 22,
  },
  {
    title: "程序员的时间管理方法",
    slug: "programmer-time-management",
    excerpt: "结合编程工作的特点，分享在深度工作、任务切换和会议管理上的实用时间管理策略。",
    content: `## 深度工作的前提

编程是高认知负荷的工作。进入"心流"状态需要至少 15-20 分钟的专注积累，而任何一次中断都会让你重新开始这个过程。

研究显示，被打断后平均需要 23 分钟才能完全恢复专注状态。

## 时间块划分

将工作日明确分区：

\`\`\`
09:00 - 12:00  深度工作（关闭通知，不安排会议）
12:00 - 13:00  午休
13:00 - 14:30  轻度工作（代码审查、回复消息）
14:30 - 17:30  深度工作或协作（视当日安排）
17:30 - 18:00  整理明日任务清单
\`\`\`

## 任务管理：只维护一个清单

不要用多个工具管理任务。选一个（Notion、Things、纯文本文件），坚持用它：

- 每天早上从清单中选出**3 个最重要的任务**
- 完成这 3 个，今天就算成功
- 其余任务是加分项

## 会议的代价

每次会议不只是会议本身的时间。它切割了时间块，产生前后各 30 分钟的"过渡成本"。

**实用策略：**
- 将会议集中在上午或下午的某半天
- 需要我的会议，先问能否用异步文档替代
- 站会控制在 15 分钟内

## 总结

时间管理不是把每分钟都塞满任务，而是保护好让你进入深度状态的大块时间。少即是多——每天完成少数重要的事，胜过完成许多不重要的事。`,
    published: false,
    tagSlugs: ["thinking", "life"],
    daysAgo: 17,
  },
  {
    title: "CI/CD 流水线搭建实践",
    slug: "cicd-pipeline-setup",
    excerpt: "使用 GitHub Actions 搭建完整的 CI/CD 流水线，覆盖代码检查、测试、构建和自动部署全流程。",
    content: `## CI/CD 的价值

持续集成（CI）和持续部署（CD）将"手动部署"这件高风险、低频率的事情变成了"自动部署"——高频率、低风险。发布从季度级别压缩到小时级别，反馈周期大幅缩短。

## GitHub Actions 基础配置

\`\`\`yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
\`\`\`

## 自动部署到 Vercel

\`\`\`yaml
  deploy:
    needs: check
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
\`\`\`

## 保护分支策略

在 GitHub Settings → Branches 中配置：

- 要求 PR 通过所有 CI 检查才能合并
- 要求至少 1 人 Code Review
- 禁止直接 push 到 main

## 总结

CI/CD 的投资回报期通常在两周以内。前期花几小时配置好流水线，能在项目生命周期内节省数十小时的手动操作和事故处理时间。`,
    published: false,
    tagSlugs: ["tools", "backend"],
    daysAgo: 11,
  },
  {
    title: "开源项目参与指南",
    slug: "open-source-contribution-guide",
    excerpt: "从找到适合的项目到提交第一个 PR，手把手指导如何开始参与开源社区，建立个人技术影响力。",
    content: `## 为什么参与开源

参与开源不仅仅是"为社区做贡献"，对个人的回报同样显著：

- 真实的代码在真实的代码库中被审查，是最好的成长加速器
- 公开的 PR 记录是比简历更有说服力的能力证明
- 与全球优秀工程师协作，拓展技术视野

## 找到合适的项目

从你**已经在使用**的工具开始，而不是从"热门项目"开始：

1. 你在日常工作中遇到了哪些工具的 bug 或文档不清晰的地方？
2. 在 GitHub 上找到这个项目，看看 Issues 列表
3. 搜索标签 \`good first issue\` 或 \`help wanted\`

## 第一个贡献：从文档开始

不要急于修复复杂 bug。优秀的第一个贡献：
- 修复文档中的错别字或不清晰的描述
- 补充缺失的使用示例
- 翻译文档到中文

这类 PR 合并率高，能让你快速熟悉项目的工作流程。

## 提交 PR 的规范

\`\`\`markdown
## 问题描述
修复了 README 中关于安装步骤的错误描述（#123）

## 改动内容
- 更正了 npm install 命令中缺少的 --save-dev 标志
- 补充了 Node.js 版本要求说明

## 测试
按照更新后的文档步骤验证可以正确安装
\`\`\`

## 总结

开源参与的门槛远比你想象的低。第一个 PR 不需要很完美，但需要你真正理解这个改动的必要性。从小处着手，持续参与，三个月后你会发现自己已经成为某个项目的活跃贡献者。`,
    published: false,
    tagSlugs: ["thinking", "life"],
    daysAgo: 5,
  },
];

async function seed() {
  console.log("Starting seed (20 posts)...\n");

  // ── Admin user ──────────────────────────────────────────────────────
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

  // ── Clear existing posts and tags ───────────────────────────────────
  const deletedPostTags = await db.postTag.deleteMany({});
  const deletedPosts = await db.post.deleteMany({});
  const deletedTags = await db.tag.deleteMany({});
  console.log(
    `Cleared: ${deletedPosts.count} posts, ${deletedTags.count} tags, ${deletedPostTags.count} post-tag links\n`
  );

  // ── Tags ────────────────────────────────────────────────────────────
  const tagDefs = [
    { name: "技术", slug: "tech" },
    { name: "前端", slug: "frontend" },
    { name: "后端", slug: "backend" },
    { name: "工具", slug: "tools" },
    { name: "思考", slug: "thinking" },
    { name: "生活", slug: "life" },
  ];

  const tagMap: Record<string, number> = {};
  for (const t of tagDefs) {
    const tag = await db.tag.create({ data: t });
    tagMap[t.slug] = tag.id;
  }
  console.log(`Created ${tagDefs.length} tags: ${tagDefs.map((t) => t.name).join("、")}\n`);

  // ── Posts ───────────────────────────────────────────────────────────
  const now = Date.now();
  for (let i = 0; i < POSTS.length; i++) {
    const { tagSlugs, daysAgo, ...postData } = POSTS[i];
    const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);

    const post = await db.post.create({
      data: { ...postData, authorId: user.id, createdAt },
    });

    for (const slug of tagSlugs) {
      const tagId = tagMap[slug];
      if (tagId) {
        await db.postTag.create({ data: { postId: post.id, tagId } });
      }
    }

    const status = postData.published ? "published" : "draft   ";
    console.log(`[${i + 1}/${POSTS.length}] ${status}  ${postData.title}`);
  }

  // ── Summary ─────────────────────────────────────────────────────────
  const [postCount, tagCount, postTagCount] = await Promise.all([
    db.post.count(),
    db.tag.count(),
    db.postTag.count(),
  ]);

  const userCount = await db.user.count();
  const publishedCount = POSTS.filter((p) => p.published).length;
  const draftCount = POSTS.filter((p) => !p.published).length;

  console.log("\n── Seed complete ─────────────────────────────");
  console.log(`  Users:     ${userCount}`);
  console.log(`  Tags:      ${tagCount}`);
  console.log(`  Posts:     ${postCount} (${publishedCount} published, ${draftCount} drafts)`);
  console.log(`  PostTags:  ${postTagCount}`);
  console.log("──────────────────────────────────────────────");
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect());
