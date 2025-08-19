import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  DatePicker,
  Upload,
  Button,
  message,
  Space,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const ModalForm = ({
  visible,
  onCancel,
  onSubmit,
  title = 'Thêm mới',
  initialValues = {},
  loading = false,
  fields = [],
  isEdit = false,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
      if (initialValues.images) {
        setFileList(
          initialValues.images.map((url, index) => ({
            uid: index,
            name: `image-${index}`,
            status: 'done',
            url: url,
          }))
        );
      }
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Xử lý file upload nếu có
      if (fileList.length > 0) {
        values.images = fileList.map((file) => file.url || file.response?.url);
      }

      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    onCancel();
  };

  const uploadProps = {
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ được upload file hình ảnh!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Hình ảnh phải nhỏ hơn 2MB!');
        return false;
      }
      return false; // Prevent auto upload
    },
    listType: 'picture-card',
  };

  const renderField = (field) => {
    const {
      name,
      label,
      type = 'input',
      required = false,
      options = [],
      span = 12,
      ...rest
    } = field;

    switch (type) {
      case 'input':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={[
              { required, message: `Vui lòng nhập ${label.toLowerCase()}!` },
            ]}
            {...rest}
          >
            <Input placeholder={`Nhập ${label.toLowerCase()}`} />
          </Form.Item>
        );

      case 'textarea':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={[
              { required, message: `Vui lòng nhập ${label.toLowerCase()}!` },
            ]}
            {...rest}
          >
            <TextArea
              rows={4}
              placeholder={`Nhập ${label.toLowerCase()}`}
            />
          </Form.Item>
        );

      case 'number':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={[
              { required, message: `Vui lòng nhập ${label.toLowerCase()}!` },
            ]}
            {...rest}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder={`Nhập ${label.toLowerCase()}`}
              min={0}
            />
          </Form.Item>
        );

      case 'select':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={[
              { required, message: `Vui lòng chọn ${label.toLowerCase()}!` },
            ]}
            {...rest}
          >
            <Select placeholder={`Chọn ${label.toLowerCase()}`}>
              {options.map((option) => (
                <Option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        );

      case 'switch':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            valuePropName="checked"
            {...rest}
          >
            <Switch />
          </Form.Item>
        );

      case 'date':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={[
              { required, message: `Vui lòng chọn ${label.toLowerCase()}!` },
            ]}
            {...rest}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        );

      case 'upload':
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            {...rest}
          >
            <Upload {...uploadProps}>
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        );

      case 'list':
        return (
          <Form.Item
            key={name}
            label={label}
            {...rest}
          >
            <Form.List name={name}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name: fieldName, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: 'flex', marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[fieldName, 'label']}
                        rules={[
                          { required: true, message: 'Vui lòng nhập label!' },
                        ]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder="Label" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[fieldName, 'value']}
                        rules={[
                          { required: true, message: 'Vui lòng nhập value!' },
                        ]}
                        style={{ flex: 1 }}
                      >
                        <Input placeholder="Value" />
                      </Form.Item>
                      <MinusCircleOutlined
                        onClick={() => remove(fieldName)}
                        style={{ color: '#ff4d4f', cursor: 'pointer' }}
                      />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{ marginTop: 8 }}
                    >
                      Thêm {label.toLowerCase()}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        );

      default:
        return (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={[
              { required, message: `Vui lòng nhập ${label.toLowerCase()}!` },
            ]}
            {...rest}
          >
            <Input placeholder={`Nhập ${label.toLowerCase()}`} />
          </Form.Item>
        );
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
      destroyOnClose
      okText={isEdit ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          {fields.map((field) => (
            <div
              key={field.name}
              style={{
                gridColumn:
                  field.span === 24 || field.type === 'list'
                    ? '1 / -1'
                    : 'auto',
              }}
            >
              {renderField(field)}
            </div>
          ))}
        </div>
      </Form>
    </Modal>
  );
};

export default ModalForm;
