"use client";

import { List, useTable } from "@refinedev/antd";
import { Table, Space, Button, Tag, Avatar, message, Popconfirm } from "antd";
import {
  DeleteOutlined,
  MailOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
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

  const handleExport = async () => {
    try {
      const response = await fetch("/api/eclub?action=export", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("导出失败");
      }

      // 获取文件名
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = "eclub-subscribers.csv";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // 下载文件
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success("导出成功");
    } catch (error) {
      console.error("Export error:", error);
      message.error("导出失败，请重试");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/eclub?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("删除失败");
      }

      message.success("取消订阅成功");
      // 刷新表格数据
      window.location.reload();
    } catch (error) {
      console.error("Delete error:", error);
      message.error("删除失败，请重试");
    }
  };

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
          <Popconfirm
            title="确认取消订阅"
            description="确定要取消这个用户的订阅吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              取消订阅
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <List
      title="E-Club 订阅管理"
      headerButtons={
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExport}
        >
          导出订阅列表
        </Button>
      }
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
