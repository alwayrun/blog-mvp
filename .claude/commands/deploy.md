# 部署到 Vercel

## 用法
/deploy

## 执行步骤

### 1. 预检（必须全部通过）
```bash
npx tsc --noEmit          # 类型检查
npm run build             # 构建检查
```

如有错误，停止并告知用户，不进行后续步骤。

### 2. 环境变量清单

列出需要在 Vercel 配置的环境变量：

```
┌──────────────────────┬────────────────────────┬────────────────────────────────┐
│        变量名        │          说明          │             示例值             │
├──────────────────────┼────────────────────────┼────────────────────────────────┤
│ DATABASE_URL         │ PostgreSQL 连接串      │ postgresql://user:pass@host/db │
├──────────────────────┼────────────────────────┼────────────────────────────────┤
│ JWT_SECRET           │ 签名密钥（随机字符串） │ openssl rand -base64 32 的输出 │
├──────────────────────┼────────────────────────┼────────────────────────────────┤
│ NEXT_PUBLIC_SITE_URL │ 生产域名               │ https://yourblog.vercel.app    │
└──────────────────────┴────────────────────────┴────────────────────────────────┘
```

### 3. 数据库迁移说明

生产环境使用 PostgreSQL，提醒用户：
1. 在 Neon / Supabase / Railway 创建 PostgreSQL 数据库
2. 复制连接串到 Vercel 环境变量
3. 首次部署后运行：`npx prisma migrate deploy`

### 4. 检查 package.json

确认存在：
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### 5. 检查 .gitignore

确认以下文件不会提交：
- .env.local
- .env
- node_modules/
- .next/

### 6. Git 状态

```bash
git status
git add .
git commit -m "chore: ready for deployment"
```

### 7. 部署命令

```bash
npx vercel --prod
```

或推送到 GitHub 后在 Vercel 控制台导入项目。

### 8. 部署后验证

- [ ] 首页正常加载
- [ ] 文章详情页正常
- [ ] /admin/login 可以登录
- [ ] 新建文章并发布，前台可见
- [ ] sitemap.xml 可访问

输出部署完成后的访问地址和验证结果。
