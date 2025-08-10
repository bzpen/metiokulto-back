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
  Space,
  Tooltip,
  Tag,
} from "antd";
import {
  PlusOutlined,
  StarFilled,
  StarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import type { ReactElement } from "react";
import type { UploadProps, UploadFile } from "antd";

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  params: {
    id: string;
  };
}

export default function ProductEditPage({ params }: Props) {
  const { formProps, saveButtonProps, queryResult, onFinish } = useForm({
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
  const [galleryFileList, setGalleryFileList] = useState<UploadFile[]>([]);

  // 产品类型选项
  const productTypes = [
    { value: "stair_treads", label: "楼梯踏板" },
    { value: "stair_risers", label: "楼梯立板" },
    { value: "stair_nosing", label: "楼梯防滑条" },
    { value: "accessories", label: "配件" },
  ];

  // 当数据加载完成时，设置现有主图预览（兼容旧 image 字段）
  useEffect(() => {
    const record = queryResult?.data?.data as any;
    if (record?.main_image) setPreviewImage(record.main_image);
    // 将已有 images 映射到 UploadFile 以便在多图控件里展示
    const existingImages: string[] = Array.isArray(record?.images)
      ? record.images.filter((u: any) => typeof u === "string" && u)
      : [];
    setGalleryFileList(
      existingImages.map((url, idx) => ({
        uid: `exist-${idx}`,
        name: url.split("/").pop() || `image-${idx}`,
        status: "done",
        url,
      })) as UploadFile[]
    );
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
        const dataUrl = e.target?.result as string;
        setPreviewImage(dataUrl);
        // 将主图写入表单字段
        formProps?.form?.setFieldsValue({ main_image: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  // 图片列表多图上传
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

  // 自定义提交：处理主图与图片列表上传，然后调用原 onFinish
  const handleFormSubmit = async (values: any) => {
    try {
      // 主图：如有新文件则上传
      if (fileList.length > 0 && fileList[0].originFileObj) {
        const fd = new FormData();
        fd.append("file", fileList[0].originFileObj as File);
        fd.append("folder", "products");
        const resp = await fetch("/api/upload", { method: "POST", body: fd });
        if (!resp.ok) {
          const err = await resp.json();
          message.error("主图上传失败: " + err.error);
          return;
        }
        const r = await resp.json();
        values.main_image = r.url;
        values.image_path = r.path;
      }

      // 图片列表：合并表单URL、已有URL、此次新上传
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
        const resp = await fetch("/api/upload", { method: "POST", body: fd });
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

      if (values.price) {
        values.price = values.price.toString();
      }

      return onFinish?.(values);
    } catch (e) {
      message.error("保存失败: " + (e as Error).message);
    }
  };

  return (
    <Edit saveButtonProps={saveButtonProps}>
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
          >
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传主图</div>
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
