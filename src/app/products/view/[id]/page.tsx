"use client";

import {
  Card,
  Descriptions,
  Image,
  Tag,
  Space,
  Spin,
  Alert,
  Button,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  params: { id: string };
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: string;
  type: string;
  main_image?: string;
  images?: string[];
  href?: string;
  describe?: string;
  fqa?: string;
  video_url?: string;
  seo_name: string;
  image_keywords?: string;
}

export default function ProductViewPage({ params }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) {
          const e = await res.json();
          throw new Error(e.error || `HTTP ${res.status}`);
        }
        const json = await res.json();
        setData(json.data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) return <Spin />;
  if (error) return <Alert type="error" message={error} />;
  if (!data) return null;

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Card
        title={`产品详情 #${data.id}`}
        extra={
          <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
            返回
          </Button>
        }
      >
        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="产品名称">{data.name}</Descriptions.Item>
          <Descriptions.Item label="SKU">{data.sku}</Descriptions.Item>
          <Descriptions.Item label="价格">¥{data.price}</Descriptions.Item>
          <Descriptions.Item label="类型">{data.type}</Descriptions.Item>
          <Descriptions.Item label="SEO名称">{data.seo_name}</Descriptions.Item>
          <Descriptions.Item label="产品链接">
            {data.href || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="关键字" span={2}>
            {data.image_keywords
              ? data.image_keywords
                  .split(",")
                  .map((k) => <Tag key={k}>{k.trim()}</Tag>)
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>
            {data.describe || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="常见问题" span={2}>
            {data.fqa || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="视频链接" span={2}>
            {data.video_url || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="主图" bordered>
        {data.main_image ? (
          <img
            src={data.main_image}
            alt="主图"
            style={{ maxWidth: 360, borderRadius: 8 }}
          />
        ) : (
          <span style={{ color: "#999" }}>无</span>
        )}
      </Card>

      <Card title="图片列表" bordered>
        <Space wrap>
          {Array.isArray(data.images) && data.images.length > 0 ? (
            data.images.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`图${idx + 1}`}
                style={{
                  width: 140,
                  height: 140,
                  objectFit: "contain",
                  borderRadius: 8,
                  border: "1px solid #f0f0f0",
                }}
              />
            ))
          ) : (
            <span style={{ color: "#999" }}>无</span>
          )}
        </Space>
      </Card>
    </Space>
  );
}
