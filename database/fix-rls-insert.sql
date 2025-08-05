-- 修复 tb_product 表的 RLS 插入权限问题
-- 在 Supabase SQL 编辑器中执行此脚本

-- 1. 删除可能存在的冲突策略
DROP POLICY IF EXISTS "Allow service role full access on tb_product" ON public.tb_product;

-- 2. 重新创建完整的 RLS 策略
-- 允许所有用户读取产品信息
CREATE POLICY "Allow public read access on tb_product" ON public.tb_product
    FOR SELECT USING (true);

-- 允许服务角色进行所有操作
CREATE POLICY "Allow service role full access on tb_product" ON public.tb_product
    USING (auth.role() = 'service_role');

-- 明确允许服务角色插入产品数据
CREATE POLICY "Allow service role insert on tb_product" ON public.tb_product
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- 明确允许服务角色更新产品数据
CREATE POLICY "Allow service role update on tb_product" ON public.tb_product
    FOR UPDATE USING (auth.role() = 'service_role');

-- 明确允许服务角色删除产品数据
CREATE POLICY "Allow service role delete on tb_product" ON public.tb_product
    FOR DELETE USING (auth.role() = 'service_role');

-- 3. 验证策略是否创建成功
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'tb_product'; 