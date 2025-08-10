import { createClient } from "@supabase/supabase-js";

// 服务端 Supabase 客户端，使用服务密钥，可以绕过 RLS
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // 使用服务密钥
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// 类型定义
export type Database = {
  public: {
    Tables: {
      tb_product: {
        Row: {
          id: number;
          name: string;
          sku: string;
          price: string;
          type: string;

          image_path?: string;
          image_keywords?: string;
          main_image?: string; // 新增：主图
          images?: string[]; // 新增：图片列表（后端存 JSONB，前端类型为 string[]）
          href?: string;
          describe?: string;
          fqa?: string;
          video_url?: string;
          seo_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Insert: {
          name: string;
          sku: string;
          price: string;
          type: string;

          image_path?: string;
          image_keywords?: string;
          main_image?: string;
          images?: string[];
          href?: string;
          describe?: string;
          fqa?: string;
          video_url?: string;
          seo_name: string;
        };
        Update: {
          name?: string;
          sku?: string;
          price?: string;
          type?: string;

          image_path?: string;
          image_keywords?: string;
          main_image?: string;
          images?: string[];
          href?: string;
          describe?: string;
          fqa?: string;
          video_url?: string;
          seo_name?: string;
        };
      };
      tb_user: {
        Row: {
          id: number;
          username: string;
          email: string;
          first_name?: string;
          last_name?: string;
          created_at?: string;
        };
      };
      user_leave: {
        Row: {
          id: number;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string;
          topic: string;
          content: string;
          created_at?: string;
        };
      };
      tb_eclub: {
        Row: {
          id: number;
          email: string;
          created_at?: string;
        };
      };
    };
  };
};
