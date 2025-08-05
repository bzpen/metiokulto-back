import { createBrowserClient } from "@supabase/ssr";

// 确保环境变量存在，避免服务端渲染错误
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase环境变量未配置，某些功能可能无法正常工作");
}

export const supabaseBrowserClient = createBrowserClient(
  supabaseUrl || "",
  supabaseKey || "",
  {
    db: {
      schema: "public",
    },
  }
);
