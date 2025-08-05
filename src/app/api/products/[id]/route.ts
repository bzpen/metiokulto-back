import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

// 获取单个产品
export async function GET(request: NextRequest, { params }: RouteParams) {
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

    const { data, error } = await supabase
      .from("tb_product")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Supabase 查询错误:", error);
      return NextResponse.json(
        { error: "数据库查询失败: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data,
    });
  } catch (error) {
    console.error("获取产品详情失败:", error);
    return NextResponse.json(
      { error: "获取产品详情失败: " + (error as Error).message },
      { status: 500 }
    );
  }
}

// 更新产品
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // 检查环境变量
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json({ error: "缺少环境变量配置" }, { status: 500 });
    }

    const body = await request.json();

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

    const { data, error } = await supabase
      .from("tb_product")
      .update({
        name: body.name,
        sku: body.sku,
        price: body.price?.toString(),
        type: body.type,
        image: body.image,
        href: body.href,
        describe: body.describe,
        fqa: body.fqa,
        video_url: body.video_url,
        seo_name: body.seo_name,
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase 更新错误:", error);
      return NextResponse.json(
        { error: "数据库更新失败: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data,
    });
  } catch (error) {
    console.error("更新产品失败:", error);
    return NextResponse.json(
      { error: "更新产品失败: " + (error as Error).message },
      { status: 500 }
    );
  }
}

// 删除产品
export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    const { data, error } = await supabase
      .from("tb_product")
      .delete()
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase 删除错误:", error);
      return NextResponse.json(
        { error: "数据库删除失败: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data,
    });
  } catch (error) {
    console.error("删除产品失败:", error);
    return NextResponse.json(
      { error: "删除产品失败: " + (error as Error).message },
      { status: 500 }
    );
  }
}
