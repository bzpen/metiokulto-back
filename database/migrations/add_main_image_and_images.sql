-- 为 tb_product 增加主图与图片列表字段
-- 执行环境：Supabase / PostgreSQL

-- 1) 新增列：main_image（主图，文本URL或Base64），images（图片列表，JSONB数组）
ALTER TABLE tb_product
  ADD COLUMN IF NOT EXISTS main_image TEXT,
  ADD COLUMN IF NOT EXISTS images JSONB;

-- 2) 兼容历史数据：将旧的 image 值迁移到 main_image
UPDATE tb_product
SET main_image = image
WHERE main_image IS NULL AND image IS NOT NULL;

-- 3) 初始化 images 为数组；并将 main_image 附加到 images（若存在）
UPDATE tb_product
SET images = COALESCE(images, '[]'::jsonb);

-- 将主图作为首个元素附加到数组（如果存在）
UPDATE tb_product
SET images = images || to_jsonb(ARRAY[main_image])
WHERE main_image IS NOT NULL;

-- 4) 字段注释
COMMENT ON COLUMN tb_product.main_image IS '产品主图（URL或Base64）';
COMMENT ON COLUMN tb_product.images IS '产品图片列表（JSONB数组，元素为URL或Base64字符串）';

-- 5) 可选：删除旧列 image（确保前端和API已完全移除依赖后再执行）
-- ALTER TABLE tb_product DROP COLUMN IF EXISTS image;

