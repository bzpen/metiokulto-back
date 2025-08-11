import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";
import { createClient } from "@supabase/supabase-js";

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "缺少环境变量配置" },
        {
          status: 500,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const idNum = Number(params.id);
    if (!Number.isFinite(idNum)) {
      return NextResponse.json(
        { error: "ID格式不正确" },
        {
          status: 400,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }

    const { data, error } = await supabase
      .from("tb_product_type")
      .select("*")
      .eq("id", idNum)
      .single();
    if (error)
      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
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

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "缺少环境变量配置" },
        {
          status: 500,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }
    const body = await request.json();
    const idNum = Number(params.id);
    if (!Number.isFinite(idNum)) {
      return NextResponse.json(
        { error: "ID格式不正确" },
        {
          status: 400,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const { data, error } = await supabase
      .from("tb_product_type")
      .update({
        type_key: body.type_key,
        type_label: body.type_label,
        sort: body.sort,
      })
      .eq("id", idNum)
      .select()
      .single();
    if (error)
      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "缺少环境变量配置" },
        {
          status: 500,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
    const idNum = Number(params.id);
    if (!Number.isFinite(idNum)) {
      return NextResponse.json(
        { error: "ID格式不正确" },
        {
          status: 400,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }

    // 先取出 type_key 以检查是否被产品引用
    const { data: typeRow, error: typeErr } = await supabase
      .from("tb_product_type")
      .select("type_key")
      .eq("id", idNum)
      .single();
    if (typeErr) {
      return NextResponse.json(
        { error: "查询类型失败: " + typeErr.message },
        {
          status: 500,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    }

    if (typeRow?.type_key) {
      const { count: refCount, error: cntErr } = await supabase
        .from("tb_product")
        .select("id", { count: "exact", head: true })
        .eq("type", typeRow.type_key);
      if (cntErr) {
        return NextResponse.json(
          { error: "检查引用失败: " + cntErr.message },
          {
            status: 500,
            headers: {
              "Cache-Control":
                "no-store, no-cache, must-revalidate, proxy-revalidate",
            },
          }
        );
      }
      if ((refCount ?? 0) > 0) {
        return NextResponse.json(
          {
            error: `该类型已被 ${refCount} 个产品使用，请先调整相关产品的类型后再删除。`,
          },
          {
            status: 400,
            headers: {
              "Cache-Control":
                "no-store, no-cache, must-revalidate, proxy-revalidate",
            },
          }
        );
      }
    }

    const { data, error } = await supabase
      .from("tb_product_type")
      .delete()
      .eq("id", idNum)
      .select()
      .single();
    if (error)
      return NextResponse.json(
        { error: error.message },
        {
          status: 500,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
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
