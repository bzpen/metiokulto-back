import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    console.log("测试API被调用");

    // 检查环境变量
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + "..."
        : "未配置",
    };

    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        {
          error: "缺少环境变量配置",
          env: envCheck,
        },
        { status: 500 }
      );
    }

    // 创建 Supabase 客户端并测试连接
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    console.log("测试数据库连接...");

    // 测试数据库连接
    const { data, error } = await supabase
      .from("tb_product")
      .select("id, name")
      .limit(3);

    if (error) {
      console.error("数据库测试失败:", error);
      return NextResponse.json(
        {
          error: "数据库连接失败",
          details: error.message,
          code: error.code,
          env: envCheck,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "API 和数据库连接正常",
      timestamp: new Date().toISOString(),
      env: envCheck,
      dbConnection: "正常",
      sampleProducts: data || [],
      productCount: data?.length || 0,
    });
  } catch (error) {
    console.error("测试API失败:", error);
    return NextResponse.json(
      {
        error: "API 测试失败",
        details: (error as Error).message,
        env: {
          hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
      },
      { status: 500 }
    );
  }
}
