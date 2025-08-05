# 图片上传功能使用指南

## 🚀 功能概述

新增产品页面现已集成 Supabase Storage 图片上传功能，支持：

- ✅ 图片上传到 Supabase Storage
- ✅ 自动生成 SEO 友好的图片关键字
- ✅ 手动添加自定义关键字
- ✅ 图片搜索功能

## 🚨 重要：修复 RLS 权限问题

如果遇到 "Unauthorized" 或 "row-level security policy" 错误，请执行以下步骤：

### 1. 执行 RLS 修复脚本

在 Supabase SQL 编辑器中执行 `database/fix-rls-insert.sql` 文件：

```sql
-- 删除可能存在的冲突策略
DROP POLICY IF EXISTS "Allow service role full access on tb_product" ON public.tb_product;

-- 重新创建完整的 RLS 策略
CREATE POLICY "Allow public read access on tb_product" ON public.tb_product
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access on tb_product" ON public.tb_product
    USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role insert on tb_product" ON public.tb_product
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Allow service role update on tb_product" ON public.tb_product
    FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role delete on tb_product" ON public.tb_product
    FOR DELETE USING (auth.role() = 'service_role');
```

### 2. 验证环境变量

确保 `.env.local` 文件包含正确的服务密钥：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # 重要！
```

## 📋 使用步骤

### 1. 数据库配置

执行数据库迁移来添加新字段：

```sql
-- 在Supabase SQL编辑器中执行
ALTER TABLE tb_product ADD COLUMN IF NOT EXISTS image_path TEXT;
ALTER TABLE tb_product ADD COLUMN IF NOT EXISTS image_keywords TEXT;
```

### 2. Storage Bucket 配置

确保 Supabase Storage 中存在名为 `metiokulto` 的 bucket：

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 进入 **Storage**
3. 创建名为 `metiokulto` 的 bucket（如果不存在）
4. 设置为 Public bucket 以便访问图片

### 3. 上传图片

在新增产品页面：

1. **选择图片**: 点击上传区域选择图片文件
   - 支持格式: JPG, PNG, WEBP
   - 最大大小: 2MB
2. **自动关键字**: 系统会自动生成关键字基于：
   - 文件名
   - 产品名称
   - 产品类型
3. **自定义关键字**: 在"图片关键字"字段中添加：
   - 多个关键字用逗号分隔
   - 例如: `高品质, 耐用, 环保, 现代设计`
4. **提交**: 点击保存按钮完成上传

## 🔍 图片搜索

### API 端点

```bash
# 搜索包含特定关键字的产品
GET /api/products/search?q=关键字&page=1&pageSize=10
```

### 示例请求

```javascript
// 搜索包含"耐用"关键字的产品
fetch("/api/products/search?q=耐用&page=1&pageSize=10")
  .then((res) => res.json())
  .then((data) => console.log(data));
```

## 📁 文件存储结构

```
Supabase Storage: metiokulto/
├── products/
│   ├── 1640995200000_abc123.jpg
│   ├── 1640995201000_def456.png
│   └── ...
```

## 🛠️ 技术实现

### 核心文件

- `src/app/api/upload/route.ts` - 图片上传 API 路由
- `src/app/products/create/page.tsx` - 新增产品页面
- `src/app/api/products/route.ts` - 产品 API 路由
- `src/app/api/products/search/route.ts` - 搜索 API 路由
- `src/utils/supabase/storage.ts` - 图片关键字生成工具

### 数据库字段

- `image`: 图片的公共 URL
- `image_path`: 图片在 Storage 中的路径
- `image_keywords`: 图片关键字（逗号分隔）

## 🚨 注意事项

1. **权限设置**: 确保 Supabase Storage bucket 权限正确配置
2. **环境变量**: 确保设置了正确的 Supabase 环境变量
3. **文件大小**: 当前限制为 2MB，可根据需要调整
4. **格式支持**: 目前支持 JPG/PNG/WEBP，可扩展其他格式

## 🔧 故障排除

### 上传失败

- 检查 Storage bucket 是否存在
- 验证环境变量配置
- 确认文件格式和大小符合要求
- 执行 RLS 修复脚本

### 图片无法显示

- 检查 bucket 的 Public 访问权限
- 验证 URL 是否正确生成

### 关键字搜索无结果

- 确认数据库迁移已执行
- 检查索引是否创建成功

## 📊 性能优化

- 图片会自动压缩存储
- 使用 GIN 索引优化关键字搜索
- 分页加载减少数据传输量

## 🎯 扩展功能

可以进一步扩展的功能：

- 多图片上传
- 图片裁剪和压缩
- AI 自动标签生成
- 图片相似度搜索
