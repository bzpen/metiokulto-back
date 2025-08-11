"use client";

import { Card, Descriptions, Space, Button, Alert, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  params: { id: string };
}

interface UserLeave {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  content: string;
  topic: string;
  phone?: string | null;
  created_at?: string;
}

export default function MessageViewPage({ params }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UserLeave | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch(`/api/user-leave/${params.id}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-store" },
        });
        if (!res.ok) {
          const e = await res.json();
          throw new Error(e.error || `HTTP ${res.status}`);
        }
        const json = await res.json();
        setData(json.data as UserLeave);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [params.id]);

  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} />;
  if (!data) return null;

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Card
        title={`留言详情 #${data.id}`}
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
            返回
          </Button>
        }
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="姓名">{`${data.first_name} ${data.last_name}`}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{data.email}</Descriptions.Item>
          <Descriptions.Item label="电话">
            {data.phone || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="主题">{data.topic}</Descriptions.Item>
          <Descriptions.Item label="内容" span={2}>
            {data.content}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Space>
  );
}
