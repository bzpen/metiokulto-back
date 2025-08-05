-- 添加图片相关字段到 tb_product 表
-- 执行此脚本之前，请确保已连接到正确的Supabase数据库

-- 添加 image_path 字段 (存储Supabase Storage中的文件路径)
ALTER TABLE tb_product 
ADD COLUMN IF NOT EXISTS image_path TEXT;

-- 添加 image_keywords 字段 (存储图片关键字/标签)
ALTER TABLE tb_product 
ADD COLUMN IF NOT EXISTS image_keywords TEXT;

-- 添加字段注释
COMMENT ON COLUMN tb_product.image_path IS '图片在Supabase Storage中的路径';
COMMENT ON COLUMN tb_product.image_keywords IS '图片关键字/标签，用逗号分隔';

-- 创建索引以优化基于关键字的搜索
CREATE INDEX IF NOT EXISTS idx_tb_product_image_keywords 
ON tb_product USING gin(to_tsvector('english', image_keywords));

-- 可选：创建一个函数来搜索包含特定关键字的产品
CREATE OR REPLACE FUNCTION search_products_by_image_keywords(search_term TEXT)
RETURNS TABLE (
    id BIGINT,
    name TEXT,
    sku TEXT,
    price TEXT,
    type TEXT,
    image TEXT,
    image_path TEXT,
    image_keywords TEXT,
    href TEXT,
    seo_name TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.sku,
        p.price,
        p.type,
        p.image,
        p.image_path,
        p.image_keywords,
        p.href,
        p.seo_name
    FROM tb_product p
    WHERE p.image_keywords ILIKE '%' || search_term || '%'
       OR to_tsvector('english', p.image_keywords) @@ plainto_tsquery('english', search_term)
    ORDER BY p.id DESC;
END;
$$ LANGUAGE plpgsql;