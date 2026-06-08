# 生成测试数据

## 用法
/seed
/seed <数量>（默认生成 10 篇文章）

## 执行步骤

### 1. 检查环境
确认 `.env` 存在且 `DATABASE_URL` 已配置。

### 2. 生成测试数据
在 `prisma/seed.ts` 创建或更新 seed 脚本，生成：

**管理员账号**
- email: admin@blog.com
- password: password123（bcrypt 哈希）

**标签**（固定 6 个）
- 技术、前端、后端、工具、思考、生活

**文章**（$ARGUMENTS 篇，默认 10）
- 标题：有意义的中文标题
- slug：英文小写 + 连字符
- 内容：3-5 段 Markdown 格式正文（含代码块、列表等）
- 摘要：100字以内
- 标签：每篇 1-3 个随机标签
- 发布状态：80% 已发布，20% 草稿
- 创建时间：过去 90 天内随机分布

### 3. 执行 seed
```bash
npx ts-node --project tsconfig.json prisma/seed.ts
```

### 4. 验证

```bash
npx prisma studio
```

打开浏览器确认数据已写入，输出各表的记录数。

### 注意

- 每次执行前清空现有数据（User 除外，避免重复创建管理员）
- 如果管理员已存在，跳过创建
