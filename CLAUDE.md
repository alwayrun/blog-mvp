# Blog MVP — 开发规范

## 技术栈
- Next.js 15 App Router, TypeScript strict
- Prisma + SQLite（开发）/ PostgreSQL（生产）
- Tailwind CSS，不引入 UI 组件库
- JWT 认证，bcrypt 密码哈希

## 目录结构
- src/app/ — 页面和路由
- src/components/ — 可复用 UI 组件
- src/lib/ — 工具函数、数据库、认证
- src/types/ — TypeScript 类型定义
- prisma/ — Schema 和迁移

## 开发规则
- 每个 Server Action 必须验证用户权限
- 数据库操作只在 src/lib/db/ 目录
- 组件默认 Server Component，需要交互才加 "use client"
- 不用 any，用 unknown + 类型守卫
- 错误统一用 { success: false, error: string } 格式返回

## 验证命令
- npx tsc --noEmit（类型检查，必须零错误）
- npm run build（构建检查）

## 遇到以下情况暂停问我
- 修改数据库 Schema
- 引入新的 npm 依赖
- 涉及认证和权限逻辑
