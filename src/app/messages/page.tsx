"use client";

import { List, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag, Tooltip } from "antd";
import {
  EyeOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

export default function MessagesPage() {
  const { tableProps } = useTable({
    resource: "user_leave",
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
      render: () => <Tag color="orange">待处理</Tag>,
    },
    {
      title: "操作",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="primary" icon={<EyeOutlined />} size="small">
            查看详情
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />} size="small">
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
