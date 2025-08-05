"use client";

import { Edit, useForm } from "@refinedev/antd";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import type { UploadProps, UploadFile } from "antd";

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  params: {
    id: string;
  };
}

export default function ProductEditPage({ params }: Props) {
  const { formProps, saveButtonProps, queryResult } = useForm({
    resource: "tb_product",
    id: params.id,
    onMutationSuccess: () => {
      message.success("产品更新成功！");
    },
    onMutationError: (error) => {
      message.error("产品更新失败：" + error.message);
    },
  });

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");

  // 产品类型选项
  const productTypes = [
    { value: "stair_treads", label: "楼梯踏板" },
    { value: "stair_risers", label: "楼梯立板" },
    { value: "stair_nosing", label: "楼梯防滑条" },
    { value: "accessories", label: "配件" },
  ];

  // 当数据加载完成时，设置现有图片
  useEffect(() => {
    if (queryResult?.data?.data?.image) {
      setPreviewImage(queryResult.data.data.image);
    }
  }, [queryResult?.data?.data]);

  // 处理图片上传
  const handleImageUpload: UploadProps["onChange"] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);

    // 如果有文件，创建预览
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 上传前的验证
  const beforeUpload = (file: File) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp";
    if (!isJpgOrPng) {
      message.error("只能上传 JPG/PNG/WEBP 格式的图片!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("图片大小不能超过 2MB!");
      return false;
    }
    return false; // 阻止默认上传，我们手动处理
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="产品名称"
          name="name"
          rules={[
            {
              required: true,
              message: "请输入产品名称",
            },
          ]}
        >
          <Input placeholder="请输入产品名称" />
        </Form.Item>

        <Form.Item
          label="SKU编码"
          name="sku"
          rules={[
            {
              required: true,
              message: "请输入SKU编码",
            },
          ]}
        >
          <Input placeholder="请输入SKU编码" />
        </Form.Item>

        <Form.Item
          label="产品价格"
          name="price"
          rules={[
            {
              required: true,
              message: "请输入产品价格",
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="请输入产品价格"
            min={0}
            precision={2}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>

        <Form.Item
          label="产品类型"
          name="type"
          rules={[
            {
              required: true,
              message: "请选择产品类型",
            },
          ]}
        >
          <Select placeholder="请选择产品类型">
            {productTypes.map((type) => (
              <Option key={type.value} value={type.value}>
                {type.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="产品图片" name="image">
          <Upload
            name="image"
            listType="picture-card"
            fileList={fileList}
            maxCount={1}
            onChange={handleImageUpload}
            beforeUpload={beforeUpload}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            )}
          </Upload>
          {previewImage && (
            <div style={{ marginTop: 16 }}>
              <p>图片预览：</p>
              <img
                src={previewImage}
                alt="预览"
                style={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  border: "1px solid #d9d9d9",
                  borderRadius: "6px",
                }}
              />
            </div>
          )}
        </Form.Item>

        <Form.Item label="产品链接" name="href">
          <Input placeholder="请输入产品详情页链接" />
        </Form.Item>

        <Form.Item label="产品描述" name="describe">
          <TextArea rows={4} placeholder="请输入产品描述" />
        </Form.Item>

        <Form.Item label="常见问题" name="fqa">
          <TextArea rows={4} placeholder="请输入常见问题及答案" />
        </Form.Item>

        <Form.Item label="视频链接" name="video_url">
          <Input placeholder="请输入产品视频链接" />
        </Form.Item>

        <Form.Item
          label="SEO名称"
          name="seo_name"
          rules={[
            {
              required: true,
              message: "请输入SEO名称",
            },
          ]}
        >
          <Input placeholder="请输入SEO友好的名称（用于URL）" />
        </Form.Item>
      </Form>
    </Edit>
  );
}
