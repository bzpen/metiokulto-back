import { NextRequest, NextResponse } from "next/server";

// 获取产品列表
export async function GET(request: NextRequest) {
  try {
    // 检查环境变量
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        {
          error: "缺少环境变量配置",
          details: {
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          },
        },
        { status: 500 }
      );
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
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    // 计算偏移量
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // 查询数据
    const { data, error, count } = await supabase
      .from("tb_product")
      .select("*", { count: "exact" })
      .range(from, to);

    if (error) {
      console.error("Supabase 查询错误:", error);
      return NextResponse.json(
        { error: "数据库查询失败: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
    });
  } catch (error) {
    console.error("获取产品列表失败:", error);
    return NextResponse.json(
      { error: "获取产品列表失败: " + (error as Error).message },
      { status: 500 }
    );
  }
}

// 创建产品
export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json({ error: "缺少环境变量配置" }, { status: 500 });
    }

    const body = await request.json();

    // 验证必填字段
    if (
      !body.name ||
      !body.sku ||
      !body.price ||
      !body.type ||
      !body.seo_name
    ) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
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

    // 插入数据
    const { data, error } = await supabase
      .from("tb_product")
      .insert({
        name: body.name,
        sku: body.sku,
        price: body.price.toString(),
        type: body.type,
        image: body.image || null,
        image_path: body.image_path || null,
        image_keywords: body.image_keywords || null,
        href: body.href || null,
        describe: body.describe || null,
        fqa: body.fqa || null,
        video_url: body.video_url || null,
        seo_name: body.seo_name,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase 插入错误:", error);
      return NextResponse.json(
        { error: "数据库插入失败: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data,
    });
  } catch (error) {
    console.error("创建产品失败:", error);
    return NextResponse.json(
      { error: "创建产品失败: " + (error as Error).message },
      { status: 500 }
    );
  }
}
