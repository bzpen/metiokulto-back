"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Button, message } from "antd";

interface Props {
  params: { id: string };
}

export default function MessageEditPage({ params }: Props) {
  const { formProps, saveButtonProps, onFinish } = useForm({
    resource: "user_leave",
    id: params.id,
    onMutationSuccess: () => {
      message.success("更新成功");
    },
    onMutationError: (error) => {
      message.error(error.message);
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      await onFinish(values);
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps} title={`编辑留言 #${params.id}`}>
      <Form {...formProps} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: "请输入邮箱" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="名"
          name="first_name"
          rules={[{ required: true, message: "请输入名" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="姓"
          name="last_name"
          rules={[{ required: true, message: "请输入姓" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="电话" name="phone">
          <Input />
        </Form.Item>
        <Form.Item
          label="主题"
          name="topic"
          rules={[{ required: true, message: "请输入主题" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="内容"
          name="content"
          rules={[{ required: true, message: "请输入内容" }]}
        >
          <Input.TextArea rows={6} />
        </Form.Item>
      </Form>
    </Edit>
  );
}
