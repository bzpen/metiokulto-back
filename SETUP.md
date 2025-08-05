# 快速配置指南

## 🚨 解决 404 错误

当前的 404 错误是因为缺少环境变量配置。请按照以下步骤配置：

### 1. 创建环境变量文件

在项目根目录 `metiokulto-back/` 下创建 `.env.local` 文件：

```bash
# 在 metiokulto-back 目录下执行
touch .env.local
```

### 2. 配置 Supabase 环境变量

将以下内容添加到 `.env.local` 文件中：

```env
# Supabase 基础配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here

# Supabase 服务密钥（用于绕过 RLS 限制）
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. 获取 Supabase 密钥

1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 选择您的项目
3. 进入 **Settings** > **API**
4. 复制以下信息：

   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **保密！**

### 4. 测试配置

配置完成后，访问以下链接测试：

- 测试 API: http://localhost:3000/api/test
- 产品 API: http://localhost:3000/api/tb_product

### 5. 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
pnpm dev
```

## 🔧 故障排除

### 问题 1: "缺少环境变量配置"

- 确保 `.env.local` 文件在正确的位置（项目根目录）
- 检查变量名是否正确拼写
- 重启开发服务器

### 问题 2: "数据库连接失败"

- 检查 Supabase URL 是否正确
- 确认项目是否已激活
- 验证服务密钥是否有效

### 问题 3: "RLS 策略错误"

- 在 Supabase Dashboard 中执行 `database/rls-policies.sql`
- 或者临时禁用 RLS 进行测试

## 📝 环境变量示例

```env
# 示例配置（请替换为您的实际值）
NEXT_PUBLIC_SUPABASE_URL=https://iwdfzvfqbtokqetmbmbp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDU2NzAxMCwiZXhwIjoxOTQ2MTQzMDEwfQ._gr6kXGkQBi9BM9dx5vKaNKYj_DJN1xlkarprGpM_fU
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjMwNTY3MDEwLCJleHAiOjE5NDYxNDMwMTB9.V2Rt2dWtiYt4hHhZq0wTLDHHQQOZyqGQ8Wj8NQ2jNDM
```

⚠️ **安全提醒**:

- 不要将 `.env.local` 文件提交到 Git
- `service_role` 密钥拥有完全数据库访问权限，请妥善保管
- 在生产环境中使用不同的密钥
