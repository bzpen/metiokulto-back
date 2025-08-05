"use client";

import { List, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag, Avatar } from "antd";
import { DeleteOutlined, MailOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function EClubPage() {
  const { tableProps } = useTable({
    resource: "tb_eclub",
    sorters: {
      initial: [
        {
          field: "created_at",
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
      title: "订阅用户",
      key: "subscriber",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar
            icon={<MailOutlined />}
            style={{ backgroundColor: "#52c41a" }}
          />
          <div>
            <div style={{ fontWeight: "bold" }}>{record.email}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>邮件订阅用户</div>
          </div>
        </div>
      ),
    },
    {
      title: "订阅时间",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => (
        <div>
          <div>{dayjs(date).format("YYYY-MM-DD")}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {dayjs(date).format("HH:mm:ss")}
          </div>
        </div>
      ),
    },
    {
      title: "状态",
      key: "status",
      render: () => <Tag color="green">已订阅</Tag>,
    },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="primary" danger icon={<DeleteOutlined />} size="small">
            取消订阅
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <List
      title="E-Club 订阅管理"
      headerButtons={<Button type="primary">导出订阅列表</Button>}
    >
      <Table
        {...tableProps}
        columns={columns}
        rowKey="id"
        scroll={{ x: 800 }}
      />
    </List>
  );
}
