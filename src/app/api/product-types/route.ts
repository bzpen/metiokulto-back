import { NextRequest, NextResponse } from "next/server";

// 列表（支持分页）
export async function GET(request: NextRequest) {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json({ error: "缺少环境变量配置" }, { status: 500 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { searchParams } = new URL(request.url);
    const hasPagination =
      searchParams.has("page") || searchParams.has("pageSize");
    const sortField = (searchParams.get("sort") || "sort").trim();
    const asc = (searchParams.get("order") || "asc").toLowerCase() !== "desc";

    if (hasPagination) {
      const parsePositiveInt = (value: string | null, fallback: number) => {
        const n = Number.parseInt((value ?? "").trim(), 10);
        return Number.isFinite(n) && n > 0 ? n : fallback;
      };
      const page = parsePositiveInt(searchParams.get("page"), 1);
      const pageSize = parsePositiveInt(searchParams.get("pageSize"), 10);
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("tb_product_type")
        .select("*", { count: "exact" })
        .range(from, to)
        .order(sortField, { ascending: asc });
      if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ data: data || [], total: count || 0 });
    }

    // 无分页：用于下拉选项
    const { data, error } = await supabase
      .from("tb_product_type")
      .select("type_key, type_label, sort")
      .order(sortField, { ascending: asc });
    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// 新增
export async function POST(request: NextRequest) {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json({ error: "缺少环境变量配置" }, { status: 500 });
    }

    const body = await request.json();
    if (!body.type_key || !body.type_label) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data, error } = await supabase
      .from("tb_product_type")
      .insert({
        type_key: body.type_key,
        type_label: body.type_label,
        sort: body.sort ?? 0,
      })
      .select()
      .single();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
