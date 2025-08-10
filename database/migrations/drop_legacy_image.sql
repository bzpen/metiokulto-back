-- 删除 tb_product 表的旧列 image
-- 注意：请确认前端与 API 已完全移除对 image 字段的依赖后再执行

ALTER TABLE tb_product
  DROP COLUMN IF EXISTS image;

