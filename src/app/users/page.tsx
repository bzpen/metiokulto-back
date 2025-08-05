"use client";

import { List, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag, Avatar } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

export default function UsersPage() {
  const { tableProps } = useTable({
    resource: "tb_user",
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "用户信息",
      key: "userInfo",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: "bold" }}>{record.username}</div>
            <div style={{ color: "#666", fontSize: "12px" }}>
              {record.first_name} {record.last_name}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      render: (email: string) => (
        <a href={`mailto:${email}`} style={{ color: "#1890ff" }}>
          {email}
        </a>
      ),
    },
    {
      title: "状态",
      key: "status",
      render: () => <Tag color="green">正常</Tag>,
    },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="default" icon={<EditOutlined />} size="small">
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
      title="用户管理"
      headerButtons={<Button type="primary">新增用户</Button>}
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
