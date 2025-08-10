-- 创建产品类型表，并将 tb_product.type 外键指向此表的 type_key

CREATE TABLE IF NOT EXISTS tb_product_type (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  type_key TEXT NOT NULL UNIQUE,
  type_label TEXT NOT NULL,
  sort INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE tb_product_type IS '产品类型字典表';
COMMENT ON COLUMN tb_product_type.type_key IS '类型键（用于产品表存储）';
COMMENT ON COLUMN tb_product_type.type_label IS '类型名称（展示用）';

-- 预置数据（与现有代码中的取值一致）
INSERT INTO tb_product_type (type_key, type_label, sort)
VALUES
  ('stair_treads', '楼梯踏板', 1),
  ('stair_risers', '楼梯立板', 2),
  ('stair_nosing', '楼梯防滑条', 3),
  ('accessories', '配件', 4)
ON CONFLICT (type_key) DO NOTHING;

-- 将 tb_product.type 加外键约束到 tb_product_type.type_key
ALTER TABLE tb_product
  ADD CONSTRAINT fk_tb_product_type
  FOREIGN KEY (type) REFERENCES tb_product_type(type_key)
  ON UPDATE CASCADE ON DELETE RESTRICT;

-- RLS：公共读取、服务角色写
ALTER TABLE tb_product_type ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tb_product_type' AND policyname='Allow public read on tb_product_type'
  ) THEN
    CREATE POLICY "Allow public read on tb_product_type" ON public.tb_product_type FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tb_product_type' AND policyname='Allow service full on tb_product_type'
  ) THEN
    CREATE POLICY "Allow service full on tb_product_type" ON public.tb_product_type USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tb_product_type' AND policyname='Allow service insert on tb_product_type'
  ) THEN
    CREATE POLICY "Allow service insert on tb_product_type" ON public.tb_product_type FOR INSERT WITH CHECK (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tb_product_type' AND policyname='Allow service update on tb_product_type'
  ) THEN
    CREATE POLICY "Allow service update on tb_product_type" ON public.tb_product_type FOR UPDATE USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='tb_product_type' AND policyname='Allow service delete on tb_product_type'
  ) THEN
    CREATE POLICY "Allow service delete on tb_product_type" ON public.tb_product_type FOR DELETE USING (auth.role() = 'service_role');
  END IF;
END $$;

