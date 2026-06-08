# 新功能开发流程

## 用法
/feature <功能描述或 GitHub Issue 编号>

## 执行步骤

### 1. 理解需求
- 如果参数是 Issue 编号，通过 GitHub MCP 读取 Issue 完整内容和评论
- 如果是功能描述，分析拆解为具体的技术任务
- 列出需要新增或修改的文件清单
- 如有设计决策（新增数据库表、引入新依赖、涉及认证），**暂停并告知用户**

### 2. 创建分支
```bash
git checkout -b feature/$ARGUMENTS
```

### 3. 数据库变更（如需要）

- 修改 prisma/schema.prisma
- 运行 npx prisma migrate dev --name <描述>
- 确认迁移文件生成正确后继续

### 4. 实现功能

按以下顺序开发：
1. 类型定义 — 在 src/types/ 补充相关类型
2. 数据层 — 在 src/lib/db/ 实现数据库操作
3. Server Actions — 在 src/lib/actions/ 实现业务逻辑
4. UI 组件 — 在 src/components/ 创建可复用组件
5. 页面 — 在 src/app/ 接入完整页面

每一层遵循 CLAUDE.md 规范：
- 写操作必须调用 getSession() 验证权限
- 返回格式统一：{ success: true, data: T } | { success: false, error: string }
- Server Component 优先，需要交互才加 "use client"
- 不用 any

### 5. 验证

```bash
npx tsc --noEmit          # 类型检查，必须零错误
npm run build             # 构建检查
```

如有错误，逐一修复后再继续。

### 6. 自测清单

- [ ] 正常流程可以走通
- [ ] 未登录访问受保护路由会跳转登录
- [ ] 表单提交错误有友好提示
- [ ] 移动端布局正常
- [ ] 无 console.error 输出

### 7. 提交

```bash
git add src/ prisma/
git commit -m "feat: <功能描述>

- 实现了什么
- 影响了哪些模块"
```

### 8. 完成汇报

输出以下内容：
- 新增/修改的文件列表
- 如何测试这个功能（操作步骤）
- 是否有遗留的 TODO 或已知限制
