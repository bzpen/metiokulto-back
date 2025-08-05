import { NextRequest, NextResponse } from "next/server";

// 根据图片关键字搜索产品
export async function GET(request: NextRequest) {
  try {
    // 检查环境变量
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json({ error: "缺少环境变量配置" }, { status: 500 });
    }

    // 动态导入 Supabase 客户端
    const { createClient } = await import("@supabase/supabase-js");

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

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    if (!query.trim()) {
      return NextResponse.json(
        { error: "搜索关键字不能为空" },
        { status: 400 }
      );
    }

    // 计算偏移量
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // 搜索产品（基于图片关键字和产品名称）
    const { data, error, count } = await supabase
      .from("tb_product")
      .select("*", { count: "exact" })
      .or(
        `image_keywords.ilike.%${query}%,name.ilike.%${query}%,describe.ilike.%${query}%`
      )
      .range(from, to)
      .order("id", { ascending: false });

    if (error) {
      console.error("Supabase 搜索错误:", error);
      return NextResponse.json(
        { error: "搜索失败: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      query: query,
    });
  } catch (error) {
    console.error("搜索产品失败:", error);
    return NextResponse.json(
      { error: "搜索产品失败: " + (error as Error).message },
      { status: 500 }
    );
  }
}
