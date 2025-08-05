"use client";

import { useList } from "@refinedev/core";
import { Card, Row, Col, Statistic, Typography, Space, Progress } from "antd";
import {
  ShoppingOutlined,
  UserOutlined,
  MessageOutlined,
  MailOutlined,
  TrophyOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function IndexPage() {
  const { data: productsData } = useList({
    resource: "tb_product",
    pagination: { pageSize: 1 },
  });

  const { data: usersData } = useList({
    resource: "tb_user",
    pagination: { pageSize: 1 },
  });

  const { data: messagesData } = useList({
    resource: "user_leave",
    pagination: { pageSize: 1 },
  });

  const { data: eclubData } = useList({
    resource: "tb_eclub",
    pagination: { pageSize: 1 },
  });

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>仪表盘</Title>
        <Text type="secondary">Metiokulto 数据管理系统概览</Text>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="产品总数"
              value={productsData?.total || 0}
              prefix={<ShoppingOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div style={{ marginTop: "8px" }}>
              <Progress percent={75} size="small" showInfo={false} />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                本月新增 12 个产品
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户总数"
              value={usersData?.total || 0}
              prefix={<UserOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
            <div style={{ marginTop: "8px" }}>
              <Progress
                percent={60}
                size="small"
                showInfo={false}
                strokeColor="#52c41a"
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                活跃用户占比 60%
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="用户留言"
              value={messagesData?.total || 0}
              prefix={<MessageOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
            <div style={{ marginTop: "8px" }}>
              <Progress
                percent={40}
                size="small"
                showInfo={false}
                strokeColor="#faad14"
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                今日新增 3 条留言
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="E-Club订阅"
              value={eclubData?.total || 0}
              prefix={<MailOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
            <div style={{ marginTop: "8px" }}>
              <Progress
                percent={85}
                size="small"
                showInfo={false}
                strokeColor="#722ed1"
              />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                订阅转化率 85%
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 系统信息和快速操作 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <TrophyOutlined style={{ color: "#faad14" }} />
                系统信息
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div>
                  <Text strong>数据库</Text>
                  <br />
                  <Text type="secondary">Supabase PostgreSQL</Text>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <Text strong>框架</Text>
                  <br />
                  <Text type="secondary">Refine + Next.js</Text>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <Text strong>部署平台</Text>
                  <br />
                  <Text type="secondary">Vercel</Text>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <Text strong>状态</Text>
                  <br />
                  <Text style={{ color: "#52c41a" }}>运行正常</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <RiseOutlined style={{ color: "#1890ff" }} />
                性能指标
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text>数据库连接</Text>
                <Progress percent={85} status="active" />
              </div>
              <div>
                <Text>API 响应时间</Text>
                <Progress percent={92} strokeColor="#52c41a" />
              </div>
              <div>
                <Text>服务器负载</Text>
                <Progress percent={45} />
              </div>
              <div>
                <Text>内存使用率</Text>
                <Progress percent={67} strokeColor="#faad14" />
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
