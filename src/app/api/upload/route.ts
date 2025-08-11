import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";
import { createClient } from "@supabase/supabase-js";

// 图片上传API路由
export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json({ error: "缺少环境变量配置" }, { status: 500 });
    }

    // 创建Supabase服务端客户端
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

    // 解析FormData
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "products";

    if (!file) {
      return NextResponse.json({ error: "没有找到文件" }, { status: 400 });
    }

    // 验证文件类型
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "不支持的文件类型，只支持 JPG/PNG/WEBP" },
        { status: 400 }
      );
    }

    // 验证文件大小 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "文件大小不能超过 2MB" },
        { status: 400 }
      );
    }

    // 生成唯一文件名
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // 上传文件到Storage
    const { data, error } = await supabase.storage
      .from("metiokulto")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Storage upload error:", error);
      return NextResponse.json(
        { error: "文件上传失败: " + error.message },
        { status: 500 }
      );
    }

    // 获取公共URL
    const { data: urlData } = supabase.storage
      .from("metiokulto")
      .getPublicUrl(filePath);

    return NextResponse.json(
      {
        success: true,
        url: urlData.publicUrl,
        path: filePath,
        fileName: fileName,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "上传失败: " + (error as Error).message },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
}
