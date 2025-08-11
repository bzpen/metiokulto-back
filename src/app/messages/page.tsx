"use client";

import { List, useTable } from "@refinedev/antd";
import { useInvalidate } from "@refinedev/core";
import { Table, Space, Button, Tag, Tooltip, message } from "antd";
import { useRouter } from "next/navigation";
import {
  EyeOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

export default function MessagesPage() {
  const invalidate = useInvalidate();
  const router = useRouter();
  const { tableProps, tableQueryResult } = useTable({
    resource: "user_leave",
    sorters: {
      initial: [
        {
          field: "id",
          order: "desc",
        },
      ],
    },
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "联系人",
      key: "contact",
      render: (_: any, record: any) => (
        <div>
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
            {record.first_name} {record.last_name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
              color: "#666",
            }}
          >
            <span>
              <MailOutlined /> {record.email}
            </span>
            {record.phone && (
              <span>
                <PhoneOutlined /> {record.phone}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "主题",
      dataIndex: "topic",
      key: "topic",
      render: (topic: string) => <Tag color="blue">{topic}</Tag>,
    },
    {
      title: "留言内容",
      dataIndex: "content",
      key: "content",
      width: 300,
      render: (content: string) => (
        <Tooltip title={content}>
          <div
            style={{
              maxWidth: "250px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {content}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "提交时间",
      key: "created_at",
      render: (_: any, record: any) => {
        const date =
          record.created_at || record.createdAt || record.inserted_at;
        return (
          <div>
            <div>{date ? dayjs(date).format("YYYY-MM-DD") : "-"}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {date ? dayjs(date).format("HH:mm:ss") : ""}
            </div>
          </div>
        );
      },
    },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => router.push(`/messages/view/${record.id}`)}
          >
            查看详情
          </Button>
          <Button
            type="default"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => router.push(`/messages/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            size="small"
            onClick={async () => {
              if (!confirm("确认删除该留言？")) return;
              try {
                const res = await fetch(`/api/user-leave/${record.id}`, {
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
                alert("删除失败: " + (e as Error).message);
              }
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <List title="用户留言管理">
      <Table
        {...tableProps}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1200 }}
      />
    </List>
  );
}
