-- 删除产品选项表（如果存在）
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema='public' AND table_name='tb_product_option'
  ) THEN
    DROP TABLE public.tb_product_option CASCADE;
  END IF;
END $$;

