"use client";

import { Create, useForm } from "@refinedev/antd";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  message,
  Tooltip,
  Tag,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import type { UploadProps, UploadFile } from "antd";
import { generateImageKeywords } from "@/utils/supabase/storage";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const { TextArea } = Input;
const { Option } = Select;

export default function ProductCreatePage() {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageKeywords, setImageKeywords] = useState<string>("");
  const [galleryFileList, setGalleryFileList] = useState<UploadFile[]>([]);

  const { formProps, saveButtonProps, onFinish } = useForm({
    resource: "tb_product",
    onMutationSuccess: () => {
      message.success("产品创建成功！");
      setFileList([]);
      setPreviewImage("");
    },
    onMutationError: (error) => {
      message.error("产品创建失败：" + error.message);
    },
  });

  // 自定义表单提交处理
  const handleFormSubmit = async (values: any) => {
    try {
      setUploading(true);

      // 处理图片上传
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const file = fileList[0].originFileObj;

        // 上传图片到Supabase Storage
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "products");

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          cache: "no-store",
          headers: { "Cache-Control": "no-store" },
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          message.error("图片上传失败: " + errorData.error);
          return;
        }

        const uploadResult = await uploadResponse.json();
        values.main_image = uploadResult.url;
        values.image_path = uploadResult.path;

        // 生成并添加图片关键字
        const autoKeywords = generateImageKeywords(
          file.name,
          values.name,
          values.type
        );

        // 合并用户输入的关键字和自动生成的关键字
        const userKeywords = imageKeywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0);

        const allKeywords = Array.from(
          new Set([...autoKeywords, ...userKeywords])
        );
        values.image_keywords = allKeywords.join(",");
      }

      // 处理图片列表多图上传
      const inputImages: string[] = Array.isArray(values.images)
        ? values.images.filter(
            (x: any) => typeof x === "string" && x.trim().length > 0
          )
        : [];

      const urlsFromExisting: string[] = galleryFileList
        .map((f) => (typeof f.url === "string" ? f.url : ""))
        .filter((u) => u);

      const filesToUpload = galleryFileList.filter((f) => !!f.originFileObj);
      const uploadedUrls: string[] = [];
      for (const f of filesToUpload) {
        const fd = new FormData();
        fd.append("file", f.originFileObj as File);
        fd.append("folder", "products");
        const resp = await fetch("/api/upload", {
          method: "POST",
          body: fd,
          cache: "no-store",
          headers: { "Cache-Control": "no-store" },
        });
        if (!resp.ok) {
          const err = await resp.json();
          message.error("图片上传失败: " + err.error);
          return;
        }
        const r = await resp.json();
        uploadedUrls.push(r.url);
      }

      const allImages: string[] = Array.from(
        new Set([
          ...(inputImages as string[]),
          ...urlsFromExisting,
          ...uploadedUrls,
        ])
      );
      if (allImages.length > 0) {
        values.images = allImages;
        if (!values.main_image) {
          values.main_image = allImages[0];
        }
      }

      // 处理价格数据，确保是字符串格式
      if (values.price) {
        values.price = values.price.toString();
      }

      // 确保 images 为数组
      if (values.images && !Array.isArray(values.images)) {
        values.images = [values.images];
      }
      if (!values.images && values.main_image) {
        values.images = [values.main_image];
      }

      // 调用原始的提交函数
      return onFinish(values);
    } catch (error) {
      message.error("提交失败: " + (error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  // 产品类型选项
  const [productTypes, setProductTypes] = useState<
    { value: string; label: string }[]
  >([]);
  useEffect(() => {
    fetch("/api/product-types")
      .then((r) => r.json())
      .then((j) => {
        const list = (j.data || []).map((x: any) => ({
          value: x.type_key,
          label: x.type_label,
        }));
        setProductTypes(list);
      })
      .catch(() => setProductTypes([]));
  }, []);

  // 处理图片上传（主图）
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
    } else {
      setPreviewImage("");
    }
  };

  // 处理图片列表多图上传
  const handleGalleryChange: UploadProps["onChange"] = ({
    fileList: newList,
  }) => {
    setGalleryFileList(newList);
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
    <Create saveButtonProps={{ ...saveButtonProps, loading: uploading }}>
      <Form {...formProps} layout="vertical" onFinish={handleFormSubmit}>
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

        <Form.Item label="主图" name="main_image">
          <Upload
            name="main_image"
            listType="picture-card"
            fileList={fileList}
            maxCount={1}
            onChange={handleImageUpload}
            beforeUpload={beforeUpload}
            disabled={uploading}
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>
                  {uploading ? "上传中..." : "上传主图"}
                </div>
              </div>
            )}
          </Upload>
          {previewImage && (
            <div style={{ marginTop: 16 }}>
              <p>主图预览：</p>
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

        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
          <b style={{ marginRight: 12 }}>图片列表</b>
          <span style={{ color: "#999", fontSize: 12 }}>
            支持批量上传，点击星标设为主图
          </span>
        </div>

        <Form.Item
          label="图片关键字"
          name="image_keywords"
          tooltip="用于SEO和搜索，多个关键字用逗号分隔。系统会自动生成一些关键字。"
        >
          <Input.TextArea
            placeholder="请输入图片关键字，用逗号分隔 (例如: 高品质, 耐用, 环保)"
            rows={2}
            value={imageKeywords}
            onChange={(e) => setImageKeywords(e.target.value)}
          />
        </Form.Item>

        <Upload
          listType="picture-card"
          multiple
          fileList={galleryFileList}
          onChange={handleGalleryChange}
          beforeUpload={beforeUpload}
          accept="image/*"
          showUploadList={{ showPreviewIcon: false, showRemoveIcon: false }}
          className="gallery-upload"
          itemRender={(
            originNode: ReactElement,
            file: UploadFile,
            _fileList: UploadFile[],
            actions: { remove?: () => void }
          ) => (
            <div className="custom-upload-item">
              {originNode}
              {!!(
                file.url &&
                formProps?.form?.getFieldValue("main_image") === file.url
              ) && (
                <div style={{ position: "absolute", top: 4, left: 4 }}>
                  <Tag color="green" style={{ margin: 0 }}>
                    主图
                  </Tag>
                </div>
              )}
              <div className="actions">
                <Button
                  size="small"
                  onClick={() => {
                    const url = (file.url as string) || previewImage;
                    if (url) {
                      formProps?.form?.setFieldsValue({ main_image: url });
                      setPreviewImage(url);
                      message.success("已设为主图");
                    }
                  }}
                >
                  设为主图
                </Button>
                <Button size="small" danger onClick={() => actions.remove?.()}>
                  删除
                </Button>
              </div>
            </div>
          )}
        >
          {galleryFileList.length >= 12 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>批量上传图片</div>
            </div>
          )}
        </Upload>

        <style jsx>{`
          :global(
              .gallery-upload
                .ant-upload-list-picture-card
                .ant-upload-list-item
            ) {
            width: 200px;
            height: 200px;
            border-radius: 10px;
          }
          :global(.gallery-upload .ant-upload-list-item-container),
          :global(.gallery-upload .list-item-container) {
            width: auto !important;
            height: auto !important;
          }
          :global(.gallery-upload .ant-upload-select-picture-card) {
            width: 200px !important;
            height: 200px !important;
            border-radius: 10px !important;
          }
          :global(
              .gallery-upload
                .ant-upload-list-picture-card
                .ant-upload-list-item
                .ant-upload-list-item-thumbnail
                img
            ) {
            width: 100%;
            height: 100%;
            object-fit: contain;
            display: block;
          }
          .custom-upload-item {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
          }
          .custom-upload-item .actions {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            gap: 8px;
            justify-content: center;
            padding: 8px;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.45),
              rgba(0, 0, 0, 0)
            );
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 2;
            pointer-events: none;
          }
          .custom-upload-item:hover .actions {
            opacity: 1;
          }
          .custom-upload-item .actions :global(.ant-btn) {
            color: #fff;
            border-color: rgba(255, 255, 255, 0.6);
            background: rgba(0, 0, 0, 0.35);
            pointer-events: auto;
          }
          .custom-upload-item .actions :global(.ant-btn-dangerous) {
            border-color: rgba(255, 255, 255, 0.6);
          }
        `}</style>

        <Form.Item label="产品链接" name="href">
          <Input placeholder="请输入产品详情页链接" />
        </Form.Item>

        <Form.Item
          label="产品描述"
          name="describe"
          valuePropName="value"
          getValueFromEvent={(content) => content}
        >
          <ReactQuill theme="snow" placeholder="请输入产品描述" />
        </Form.Item>

        <Form.Item
          label="常见问题"
          name="fqa"
          valuePropName="value"
          getValueFromEvent={(content) => content}
        >
          <ReactQuill theme="snow" placeholder="请输入常见问题及答案" />
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
    </Create>
  );
}
