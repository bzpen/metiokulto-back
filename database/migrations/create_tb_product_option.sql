-- 创建产品选项表，用于存储每个产品的可配置项

CREATE TABLE IF NOT EXISTS tb_product_option (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES tb_product(id) ON DELETE CASCADE,
  opt_key TEXT NOT NULL,
  opt_value TEXT NOT NULL,
  sort INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tb_product_option_product_id ON tb_product_option(product_id);
CREATE INDEX IF NOT EXISTS idx_tb_product_option_sort ON tb_product_option(sort);

COMMENT ON TABLE tb_product_option IS '产品选项/参数表';
COMMENT ON COLUMN tb_product_option.opt_key IS '选项键（如颜色、材质等）';
COMMENT ON COLUMN tb_product_option.opt_value IS '选项值（如黑色、橡木等）';

-- RLS 策略（与 tb_product 一致：允许公共读取，服务角色可写）
ALTER TABLE tb_product_option ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tb_product_option' AND policyname = 'Allow public read on tb_product_option'
  ) THEN
    CREATE POLICY "Allow public read on tb_product_option" ON public.tb_product_option
      FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tb_product_option' AND policyname = 'Allow service role full on tb_product_option'
  ) THEN
    CREATE POLICY "Allow service role full on tb_product_option" ON public.tb_product_option
      USING (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tb_product_option' AND policyname = 'Allow service insert on tb_product_option'
  ) THEN
    CREATE POLICY "Allow service insert on tb_product_option" ON public.tb_product_option
      FOR INSERT WITH CHECK (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tb_product_option' AND policyname = 'Allow service update on tb_product_option'
  ) THEN
    CREATE POLICY "Allow service update on tb_product_option" ON public.tb_product_option
      FOR UPDATE USING (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tb_product_option' AND policyname = 'Allow service delete on tb_product_option'
  ) THEN
    CREATE POLICY "Allow service delete on tb_product_option" ON public.tb_product_option
      FOR DELETE USING (auth.role() = 'service_role');
  END IF;
END $$;

