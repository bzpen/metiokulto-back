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
    const page = Number.parseInt(searchParams.get("page") || "1");
    const pageSize = Number.parseInt(searchParams.get("pageSize") || "10");

    // 计算偏移量
    const from = Math.max(0, (page - 1) * pageSize);
    const to = Math.max(from, from + pageSize - 1);

    // 查询数据
    const { data, error, count } = await supabase
      .from("tb_product")
      .select("*", { count: "exact" })
      .range(from, to);

    if (error) {
      console.error("Supabase 查询错误:", error);
      return NextResponse.json(
        {
          error: "数据库查询失败: " + error.message,
          code: (error as any).code,
          details: (error as any).details,
          hint: (error as any).hint,
        },
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

    // 构造插入载荷（兼容不同数据库列版本）
    const insertPayload: any = {
      name: body.name,
      sku: body.sku,
      price: body.price.toString(),
      type: body.type,
      href: body.href || null,
      describe: body.describe || null,
      fqa: body.fqa || null,
      video_url: body.video_url || null,
      seo_name: body.seo_name,
    };

    if (Object.prototype.hasOwnProperty.call(body, "main_image")) {
      insertPayload.main_image = body.main_image ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(body, "images")) {
      insertPayload.images = Array.isArray(body.images) ? body.images : null;
    }
    if (Object.prototype.hasOwnProperty.call(body, "image_path")) {
      insertPayload.image_path = body.image_path || null;
    }
    if (Object.prototype.hasOwnProperty.call(body, "image_keywords")) {
      insertPayload.image_keywords = body.image_keywords || null;
    }

    const { data, error } = await supabase
      .from("tb_product")
      .insert(insertPayload)
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
