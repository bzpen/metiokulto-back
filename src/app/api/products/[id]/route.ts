import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface RouteParams {
  params: {
    id: string;
  };
}

// 获取单个产品
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    console.log("GET请求 - 产品ID:", params.id);

    // 验证参数
    if (!params.id) {
      return NextResponse.json({ error: "产品ID不能为空" }, { status: 400 });
    }

    // 检查环境变量
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      console.error("环境变量缺失");
      return NextResponse.json({ error: "缺少环境变量配置" }, { status: 500 });
    }

    // 创建 Supabase 客户端
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

    console.log("正在查询产品:", params.id);
    const productId = Number(params.id);
    if (!Number.isFinite(productId)) {
      return NextResponse.json({ error: "产品ID格式不正确" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("tb_product")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Supabase 查询错误:", error);
      // 检查是否是找不到记录的错误
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "产品不存在" }, { status: 404 });
      }
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

    if (!data) {
      return NextResponse.json({ error: "产品不存在" }, { status: 404 });
    }

    console.log("查询成功:", data);
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
    const productId = Number(params.id);
    if (!Number.isFinite(productId)) {
      return NextResponse.json({ error: "产品ID格式不正确" }, { status: 400 });
    }

    // 创建 Supabase 客户端

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

    const updatePayload: any = {
      name: body.name,
      sku: body.sku,
      price: body.price?.toString(),
      type: body.type,
      href: body.href,
      describe: body.describe,
      fqa: body.fqa,
      video_url: body.video_url,
      seo_name: body.seo_name,
    };

    if (Object.prototype.hasOwnProperty.call(body, "main_image")) {
      updatePayload.main_image = body.main_image ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(body, "images")) {
      updatePayload.images = Array.isArray(body.images) ? body.images : null;
    }
    if (Object.prototype.hasOwnProperty.call(body, "image_path")) {
      updatePayload.image_path = body.image_path ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(body, "image_keywords")) {
      updatePayload.image_keywords = body.image_keywords ?? null;
    }

    const { data, error } = await supabase
      .from("tb_product")
      .update(updatePayload)
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("Supabase 更新错误:", error);
      return NextResponse.json(
        {
          error: "数据库更新失败: " + error.message,
          code: (error as any).code,
          details: (error as any).details,
          hint: (error as any).hint,
        },
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

    // 创建 Supabase 客户端

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

    const productId = Number(params.id);
    if (!Number.isFinite(productId)) {
      return NextResponse.json({ error: "产品ID格式不正确" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("tb_product")
      .delete()
      .eq("id", productId)
      .select()
      .single();

    if (error) {
      console.error("Supabase 删除错误:", error);
      return NextResponse.json(
        {
          error: "数据库删除失败: " + error.message,
          code: (error as any).code,
          details: (error as any).details,
          hint: (error as any).hint,
        },
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
