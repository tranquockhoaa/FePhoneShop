import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  Space,
  Card,
  message,
  notification,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import adminAxios from "./adminAxios";
import { mediaUploadApi, getMediaApi } from "../../api/media.api";

const { TextArea } = Input;

const ProductForm = ({
  open,
  mode = "create",
  onCancel,
  onSuccess,
  initialValues = {},
  brands = [],
  optionColors = [],
}) => {
  const [form] = Form.useForm();
  const [selectedColorLabels, setSelectedColorLabels] = useState([]);
  const [colorImages, setColorImages] = useState({});
  const [uploading, setUploading] = useState({});
  const [loadingImages, setLoadingImages] = useState({});
  const [api, contextHolder] = notification.useNotification();

  // Hàm load ảnh từ server bằng media ID
  // const loadImageFromServer = async (mediaId) => {
  //   try {
  //     const response = await getMediaApi(mediaId);
  //     if (response.success) {
  //       return {
  //         uid: mediaId,
  //         name: response.data.name || `image_${mediaId}`,
  //         status: 'done',
  //         url:
  //           response.data.imageUrl ||
  //           `http://localhost:3000/api/v1/media/${mediaId}`,
  //         mediaId: mediaId,
  //       };
  //     }
  //   } catch (error) {
  //     console.error('Error loading image:', error);
  //   }
  //   return null;
  // };

  // // Hàm load tất cả ảnh cho một màu sắc
  // const loadImagesForColor = async (colorLabel, imageIds) => {
  //   debugger;
  //   setLoadingImages((prev) => ({ ...prev, [colorLabel]: true }));

  //   try {
  //     const imagePromises = imageIds.map((id) => loadImageFromServer(id));
  //     const images = await Promise.all(imagePromises);
  //     const validImages = images.filter((img) => img !== null);

  //     setColorImages((prev) => ({
  //       ...prev,
  //       [colorLabel]: validImages,
  //     }));
  //   } catch (error) {
  //     console.error('Error loading images for color:', colorLabel, error);
  //   } finally {
  //     setLoadingImages((prev) => ({ ...prev, [colorLabel]: false }));
  //   }
  // };

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialValues) {
        const initialColorIds =
          initialValues?.color?.map((item) =>
            item.color?.color_id?.toString()
          ) ||
          "" ||
          [];
        const initialLabels = optionColors
          .filter((color) => initialColorIds.includes(color.value))
          .map((color) => color.label);
        setSelectedColorLabels(initialLabels);
        // Khởi tạo colorImages cho các màu đã có
        const initialColorImages = {};
        initialLabels.forEach((label) => {
          initialColorImages[label] = [];
        });
        setColorImages(initialColorImages);

        // Load ảnh từ server cho các màu đã có
        initialLabels.forEach((label) => {
          const colorFind = initialValues.color?.find(
            (item) => item.color.name === label
          );
          if (colorFind) {
            const validImages = colorFind?.images?.map((img) => ({
              uid: img.id,
              name: `image_${img.id}`,
              status: "done",
              url: img.link || `http://localhost:3000/api/v1/media/${mediaId}`,
              mediaId: img.id,
            }));
            // loadImagesForColor(label, imageIds);

            setColorImages((prev) => ({
              ...prev,
              [label]: validImages,
            }));
          }
        });

        form.setFieldsValue({
          name: initialValues.name || "",
          sku: initialValues.sku || "",
          brand_id:
            initialValues.brand_id || initialValues.brand?.brand_id || "",
          description: initialValues.description || "",
          code: initialValues.code || "",
          status: initialValues.status || "ACTIVE",
          color_id:
            initialValues?.color?.map(
              (item) => item.color?.color_id?.toString() || ""
            ) || [],
        });
      } else {
        setSelectedColorLabels([]);
        setColorImages({});
        setUploading({});
        setLoadingImages({});
        form.resetFields();
      }
    }
  }, [open, mode, initialValues, form, optionColors]);

  const handleColorChange = (selectedValues) => {
    const selectedLabels = optionColors
      .filter((color) => selectedValues.includes(color.value))
      .map((color) => color.label);
    setSelectedColorLabels(selectedLabels);

    // Cập nhật colorImages - thêm màu mới, xóa màu không còn được chọn
    const newColorImages = {};
    selectedLabels.forEach((label) => {
      newColorImages[label] = colorImages[label] || [];
    });
    setColorImages(newColorImages);
  };

  const handleImageUpload = async (colorLabel, file) => {
    try {
      setUploading((prev) => ({ ...prev, [colorLabel]: true }));

      const body = { image: file };

      const response = await mediaUploadApi(body);

      if (typeof response.id === "number") {
        const imageData = await getMediaApi(response.id);
        const newImage = {
          uid: response.id || Date.now(),
          name: file.name,
          status: "done",
          url: imageData.imageUrl,
          mediaId: response.id,
        };

        setColorImages((prev) => ({
          ...prev,
          [colorLabel]: [...(prev[colorLabel] || []), newImage],
        }));

        message.success(`${file.name} uploaded successfully`);
      } else {
        message.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Upload failed");
    } finally {
      setUploading((prev) => ({ ...prev, [colorLabel]: false }));
    }
  };

  const handleImageChange = (colorLabel, info) => {
    console.log("info", info);
    if (info.file.status === "uploading") {
      return;
    }

    if (info.file.status === "done") {
      // File đã được upload thành công
      setColorImages((prev) => ({
        ...prev,
        [colorLabel]: info.fileList,
      }));
    } else if (info.file.status === "removed") {
      // File bị xóa
      setColorImages((prev) => ({
        ...prev,
        [colorLabel]: info.fileList,
      }));
    }
  };

  const beforeUpload = (file, colorLabel) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    // Upload file ngay lập tức
    handleImageUpload(colorLabel, file);
    return false; // Prevent default upload behavior
  };

  const removeColor = (colorLabel) => {
    const currentValues = form.getFieldValue("color_id") || [];
    const colorToRemove = optionColors.find((c) => c.label === colorLabel);
    const newValues = currentValues.filter(
      (value) => value !== colorToRemove?.value
    );
    form.setFieldsValue({ color_id: newValues });
    setSelectedColorLabels(
      selectedColorLabels.filter((label) => label !== colorLabel)
    );

    // Xóa ảnh của màu bị xóa
    const newColorImages = { ...colorImages };
    delete newColorImages[colorLabel];
    setColorImages(newColorImages);
  };

  const handleCancel = () => {
    setSelectedColorLabels([]);
    setColorImages({});
    setUploading({});
    setLoadingImages({});
    onCancel();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Chuẩn bị dữ liệu ảnh cho từng màu
      const colorImagesData = [];
      Object.keys(colorImages).forEach((colorLabel) => {
        const mediaIds = colorImages[colorLabel].map((img) => img.mediaId);
        colorImagesData.push({
          color:
            optionColors.find((item) => item.label === colorLabel)?.value || 0,
          img: mediaIds,
        });
      });

      if (mode === "create") {
        await adminAxios.post("products/create", {
          sku: values.sku,
          name: values.name,
          brand_id: values.brand_id,
          description: values.description || "",
          code: values.code || "",
          color: colorImagesData,
        });

        api.success({
          message: "Thành công",
          description: "Thêm sản phẩm hành công thành công!",
        });
      } else if (mode === "edit" && initialValues?.product_id) {
        await adminAxios.put(`/products/${initialValues.product_id}`, {
          name: values.name,
          sku: values.sku,
          brand_id: values.brand_id,
          description: values.description || "",
          status: values.status,
          color: colorImagesData,
        });
        api.success({
          message: "Thành công",
          description: "Cập nhật sản phẩm hành công thành công!",
        });
      }
      if (onSuccess) {
        setSelectedColorLabels([]);
        setColorImages({});
        setUploading({});
        setLoadingImages({});
        onSuccess();
      }
    } catch (err) {
      api.error({
        message: "Thất bại",
        description: "Có lỗi xảy ra khi lưu sản phẩm",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={mode === "create" ? "Thêm sản phẩm mới" : "Cập nhật sản phẩm"}
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={mode === "create" ? "Tạo" : "Lưu"}
        cancelText="Hủy"
        destroyOnClose
        width="80%"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Mã sản phẩm (SKU)"
            name="sku"
            rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm" }]}
          >
            <Input placeholder="Mã sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input placeholder="Tên sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Thương hiệu"
            name="brand_id"
            rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
          >
            <Select placeholder="Chọn thương hiệu">
              {brands.map((b) => (
                <Select.Option key={b.brand_id} value={b.brand_id}>
                  {b.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea placeholder="Mô tả" autoSize={{ minRows: 3 }} />
          </Form.Item>

          <Form.Item label="Màu sắc" name="color_id">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Màu sắc"
              options={optionColors}
              onChange={handleColorChange}
            />
          </Form.Item>

          {selectedColorLabels.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                Upload ảnh cho từng màu sắc:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {selectedColorLabels.map((label, index) => (
                  <Card
                    key={index}
                    title={label}
                    size="small"
                    style={{ width: 300 }}
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeColor(label)}
                        size="small"
                      />
                    }
                  >
                    <Upload
                      listType="picture-card"
                      fileList={colorImages[label] || []}
                      onChange={(info) => handleImageChange(label, info)}
                      beforeUpload={(file) => beforeUpload(file, label)}
                      accept="image/*"
                      disabled={uploading[label] || loadingImages[label]}
                    >
                      {(colorImages[label] || []).length < 8 &&
                        !uploading[label] &&
                        !loadingImages[label] && (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload ảnh</div>
                          </div>
                        )}
                      {uploading[label] && (
                        <div>
                          <div style={{ marginTop: 8 }}>Uploading...</div>
                        </div>
                      )}
                      {loadingImages[label] && (
                        <div>
                          <div style={{ marginTop: 8 }}>Loading...</div>
                        </div>
                      )}
                    </Upload>
                    <div
                      style={{ marginTop: 8, fontSize: "12px", color: "#666" }}
                    >
                      Tối đa 8 ảnh cho mỗi màu
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {mode === "create" && (
            <Form.Item label="Code" name="code">
              <Input placeholder="Mã nội bộ (tùy chọn)" />
            </Form.Item>
          )}

          {mode === "edit" && (
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select>
                <Select.Option value="ACTIVE">Đang bán</Select.Option>
                <Select.Option value="INACTIVE">Ngừng bán</Select.Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default ProductForm;
