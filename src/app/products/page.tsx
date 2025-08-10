"use client";

import { List, useTable } from "@refinedev/antd";
import { Table, Space, Button, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function ProductsPage() {
  const router = useRouter();

  const { tableProps } = useTable({
    resource: "tb_product",
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "产品名称",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
      render: (price: string) => (
        <span style={{ color: "#52c41a", fontWeight: "bold" }}>¥{price}</span>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "主图",
      dataIndex: "main_image",
      key: "main_image",
      render: (url: string) =>
        url ? (
          <img
            src={url}
            alt="主图"
            style={{
              width: 48,
              height: 48,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <span style={{ color: "#ccc" }}>无</span>
        ),
      width: 80,
    },
    {
      title: "图片数",
      dataIndex: "images",
      key: "images",
      render: (images: string[]) => (Array.isArray(images) ? images.length : 0),
      width: 80,
    },
    {
      title: "SEO名称",
      dataIndex: "seo_name",
      key: "seo_name",
    },
    {
      title: "图片关键字",
      dataIndex: "image_keywords",
      key: "image_keywords",
      render: (keywords: string) =>
        keywords ? (
          <div style={{ maxWidth: 200 }}>
            {keywords
              .split(",")
              .slice(0, 3)
              .map((keyword, index) => (
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    background: "#f0f0f0",
                    padding: "2px 6px",
                    margin: "2px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  {keyword.trim()}
                </span>
              ))}
            {keywords.split(",").length > 3 && (
              <span style={{ fontSize: "12px", color: "#999" }}>
                +{keywords.split(",").length - 3}
              </span>
            )}
          </div>
        ) : (
          <span style={{ color: "#ccc" }}>无</span>
        ),
      width: 200,
    },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="primary" icon={<EyeOutlined />} size="small">
            查看
          </Button>
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => router.push(`/products/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />} size="small">
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <List
      title="产品管理"
      headerButtons={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/products/create")}
        >
          新增产品
        </Button>
      }
    >
      <Table
        {...tableProps}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1000 }}
      />
    </List>
  );
}
