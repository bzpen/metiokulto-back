-- 产品表 RLS 策略
-- 允许所有用户读取产品信息
CREATE POLICY "Allow public read access on tb_product" ON public.tb_product
    FOR SELECT USING (true);

-- 允许服务角色进行所有操作（通过服务密钥）
CREATE POLICY "Allow service role full access on tb_product" ON public.tb_product
    USING (auth.role() = 'service_role');

-- 允许服务角色插入产品数据
CREATE POLICY "Allow service role insert on tb_product" ON public.tb_product
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- 允许服务角色更新产品数据
CREATE POLICY "Allow service role update on tb_product" ON public.tb_product
    FOR UPDATE USING (auth.role() = 'service_role');

-- 允许服务角色删除产品数据
CREATE POLICY "Allow service role delete on tb_product" ON public.tb_product
    FOR DELETE USING (auth.role() = 'service_role');

-- 用户表 RLS 策略
CREATE POLICY "Allow public read access on tb_user" ON public.tb_user
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access on tb_user" ON public.tb_user
    USING (auth.role() = 'service_role');

-- 用户留言表 RLS 策略
CREATE POLICY "Allow public read access on user_leave" ON public.user_leave
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access on user_leave" ON public.user_leave
    USING (auth.role() = 'service_role');

-- E-Club 订阅表 RLS 策略
CREATE POLICY "Allow public read access on tb_eclub" ON public.tb_eclub
    FOR SELECT USING (true);

CREATE POLICY "Allow service role full access on tb_eclub" ON public.tb_eclub
    USING (auth.role() = 'service_role');

-- 如果需要允许匿名用户插入数据（如联系表单、订阅等），可以添加以下策略：
-- CREATE POLICY "Allow anonymous insert on user_leave" ON public.user_leave
--     FOR INSERT WITH CHECK (true);

-- CREATE POLICY "Allow anonymous insert on tb_eclub" ON public.tb_eclub
--     FOR INSERT WITH CHECK (true);