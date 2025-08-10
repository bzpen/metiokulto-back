"use client";

import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, message } from "antd";

interface Props {
  params: { id: string };
}

export default function ProductTypeEditPage({ params }: Props) {
  const { formProps, saveButtonProps, onFinish } = useForm({
    resource: "tb_product_type",
    id: params.id,
  });

  const handleSubmit = async (values: any) => {
    try {
      await onFinish(values);
      message.success("更新成功");
    } catch (e) {
      message.error((e as Error).message);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="类型键"
          name="type_key"
          rules={[{ required: true, message: "请输入类型键" }]}
        >
          <Input placeholder="如 stair_treads" />
        </Form.Item>

        <Form.Item
          label="类型名称"
          name="type_label"
          rules={[{ required: true, message: "请输入类型名称" }]}
        >
          <Input placeholder="如 楼梯踏板" />
        </Form.Item>

        <Form.Item label="排序" name="sort" initialValue={0}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Edit>
  );
}
