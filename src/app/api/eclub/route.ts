import { NextRequest, NextResponse } from "next/server";
import { serverDataProvider } from "@providers/data-provider/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";

    const result = await serverDataProvider.getList({
      resource: "tb_eclub",
      pagination: {
        current: page,
        pageSize: pageSize,
      },
      sorters: [
        {
          field: sort,
          order: order as "asc" | "desc",
        },
      ],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching eclub data:", error);
    return NextResponse.json(
      { error: "Failed to fetch eclub data" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const result = await serverDataProvider.deleteOne({
      resource: "tb_eclub",
      id: parseInt(id),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting eclub record:", error);
    return NextResponse.json(
      { error: "Failed to delete eclub record" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "export") {
      // 获取所有订阅数据
      const result = await serverDataProvider.getList({
        resource: "tb_eclub",
        pagination: {
          current: 1,
          pageSize: 10000, // 获取所有数据
        },
        sorters: [
          {
            field: "created_at",
            order: "desc",
          },
        ],
      });

      const data = result.data || [];

      // 生成CSV内容
      const csvHeaders = ["ID", "邮箱", "订阅时间"];
      const csvRows = data.map((item: any) => [
        item.id,
        item.email,
        new Date(item.created_at).toLocaleString("zh-CN"),
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map((row) => row.join(",")),
      ].join("\n");

      // 添加BOM以确保Excel正确识别中文
      const bom = "\uFEFF";
      const csvWithBom = bom + csvContent;

      return new NextResponse(csvWithBom, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="eclub-subscribers-${
            new Date().toISOString().split("T")[0]
          }.csv"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error exporting eclub data:", error);
    return NextResponse.json(
      { error: "Failed to export eclub data" },
      { status: 500 }
    );
  }
}
