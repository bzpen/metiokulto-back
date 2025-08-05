# Metiokulto 管理后台

基于 Refine 框架构建的 Metiokulto 数据管理系统，用于管理 Supabase 数据库中的数据。

## 功能特性

- 📦 **产品管理** - 管理网站产品信息
- 👥 **用户管理** - 管理注册用户数据
- 💬 **用户留言** - 查看和管理用户提交的留言
- 📧 **E-Club 订阅** - 管理邮件订阅用户
- 📊 **仪表盘** - 数据统计和系统概览

## 技术栈

- **前端框架**: Next.js 14 + React 18
- **UI 框架**: Refine + TailwindCSS
- **数据库**: Supabase (PostgreSQL)
- **部署平台**: Vercel
- **包管理器**: pnpm

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

创建 `.env.local` 文件并添加您的 Supabase 配置：

```env
# Supabase 基础配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase 服务密钥（用于绕过 RLS 限制）
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 获取 Supabase 密钥

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择您的项目
3. 进入 Settings > API
4. 复制以下密钥：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **保密！**

⚠️ **重要提醒**: `service_role` 密钥拥有完全数据库访问权限，请妥善保管，不要提交到版本控制系统！

### 3. 数据库设置

确保您的 Supabase 数据库已经执行了 `metiokulto-web/database/schema_supabase.sql` 中的 SQL 脚本，创建了以下数据表：

- `tb_product` - 产品信息表
- `tb_user` - 用户表
- `user_leave` - 用户留言表
- `tb_eclub` - E-Club 订阅表

#### RLS（行级安全）策略配置

为了解决 "row-level security policy" 错误，需要在 Supabase SQL 编辑器中执行 `database/rls-policies.sql` 文件中的 SQL 语句，或者手动配置以下策略：

1. 进入 Supabase Dashboard > Authentication > Policies
2. 为每个表添加策略：
   - 允许公开读取：`FOR SELECT USING (true)`
   - 允许服务角色完全访问：`USING (auth.role() = 'service_role')`

#### 架构说明

本项目使用服务端 API 路由来处理数据操作，通过 `service_role` 密钥绕过 RLS 限制：

- 前端 → API 路由 (`/api/products`) → 服务端 Supabase 客户端 → 数据库
- 这样可以确保数据操作的安全性和一致性

### 4. 启动开发服务器

```bash
pnpm dev
```

应用将在 http://localhost:3000 上运行。

### 5. 构建生产版本

```bash
pnpm build
pnpm start
```

## 部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 部署

## 项目结构

```
metiokulto-back/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── page.tsx           # 仪表盘首页
│   │   ├── products/          # 产品管理
│   │   ├── users/             # 用户管理
│   │   ├── messages/          # 用户留言
│   │   └── eclub/             # E-Club订阅
│   ├── components/            # 共享组件
│   │   └── Navigation.tsx     # 导航组件
│   ├── providers/             # Refine 提供程序
│   │   ├── auth-provider/     # 认证提供程序
│   │   └── data-provider/     # 数据提供程序
│   └── utils/
│       └── supabase/          # Supabase 客户端配置
├── package.json
└── README.md
```

## 数据表管理

### 产品管理 (tb_product)

- 产品名称、SKU、价格
- 产品类型、描述、FAQ
- 图片、视频链接
- SEO 名称

### 用户管理 (tb_user)

- 用户名、邮箱、密码
- 姓名信息

### 用户留言 (user_leave)

- 联系信息（姓名、邮箱、电话）
- 留言主题和内容
- 提交时间

### E-Club 订阅 (tb_eclub)

- 订阅邮箱
- 订阅时间

## 开发说明

### 添加新的管理页面

1. 在 `src/app/` 下创建新的页面目录
2. 使用 Refine 的 `useList`、`useCreate`、`useUpdate`、`useDelete` hooks
3. 在 `src/app/layout.tsx` 中添加资源配置
4. 在 `src/components/Navigation.tsx` 中添加导航链接

### 自定义样式

项目使用 TailwindCSS，可以直接在组件中使用 Tailwind 类名。

## 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
