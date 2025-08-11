"use client";

import React from "react";
import { List, useTable } from "@refinedev/antd";
import { Table, Space, Button, Typography, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function ProductTypesPage() {
  const router = useRouter();
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  const { tableProps, tableQueryResult } = useTable({
    resource: "tb_product_type",
  });

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "类型键", dataIndex: "type_key", key: "type_key", width: 160 },
    { title: "类型名称", dataIndex: "type_label", key: "type_label" },
    { title: "排序", dataIndex: "sort", key: "sort", width: 80 },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => router.push(`/product-types/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除该类型？"
            okText="删除"
            okButtonProps={{ danger: true }}
            cancelText="取消"
            onConfirm={async () => {
              try {
                setDeletingId(record.id);
                const res = await fetch(`/api/product-types/${record.id}`, {
                  method: "DELETE",
                  cache: "no-store",
                  headers: { "Cache-Control": "no-store" },
                });
                if (!res.ok) {
                  const e = await res.json();
                  throw new Error(e.error || `HTTP ${res.status}`);
                }
                message.success("删除成功");
                await tableQueryResult?.refetch?.();
              } catch (e) {
                message.error("删除失败: " + (e as Error).message);
              } finally {
                setDeletingId(null);
              }
            }}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={deletingId === record.id}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <List
      title="产品类型"
      headerButtons={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/product-types/create")}
        >
          新增类型
        </Button>
      }
    >
      <Table
        {...tableProps}
        columns={columns}
        rowKey="id"
        scroll={{ x: 900 }}
      />
    </List>
  );
}
