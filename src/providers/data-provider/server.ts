import { dataProvider } from "@refinedev/supabase";
import { supabaseServer } from "@/utils/supabase/server";

// 服务端数据提供者，使用服务密钥，可以绕过 RLS 限制
export const serverDataProvider = dataProvider(supabaseServer);
