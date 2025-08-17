import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
  LockOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

const UserFormModal = ({
  visible,
  onCancel,
  onOk,
  userData = null,
  isEdit = false,
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (isEdit && userData) {
        form.setFieldsValue({
          email: userData.email,
          full_name: userData.full_name,
          phone_number: userData.phone_number,
          address: userData.address,
          gender: userData.gender,
          birth_date: userData.birth_date ? dayjs(userData.birth_date) : null,
          role: userData.role,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, isEdit, userData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = {
        ...values,
        birth_date: values.birth_date ? values.birth_date.toISOString() : null,
      };

      onOk(formData);
    } catch (_error) {
      message.error('Vui lòng kiểm tra lại thông tin!');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserOutlined />
          {isEdit ? 'Chỉnh sửa thông tin người dùng' : 'Thêm người dùng mới'}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button
          key="cancel"
          onClick={handleCancel}
        >
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {isEdit ? 'Cập nhật' : 'Thêm mới'}
        </Button>,
      ]}
      width={'80%'}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Nhập email"
            size="large"
          />
        </Form.Item>

        {!isEdit && (
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
              size="large"
            />
          </Form.Item>
        )}

        <Form.Item
          name="full_name"
          label="Họ và tên"
          rules={[
            { required: true, message: 'Vui lòng nhập họ và tên!' },
            { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự!' },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Nhập họ và tên"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="phone_number"
          label="Số điện thoại"
          rules={[
            { required: true, message: 'Vui lòng nhập số điện thoại!' },
            {
              pattern: /^[0-9]{10,11}$/,
              message: 'Số điện thoại không hợp lệ!',
            },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Nhập số điện thoại"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <TextArea
            prefix={<HomeOutlined />}
            placeholder="Nhập địa chỉ"
            rows={3}
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Giới tính"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
        >
          <Select
            placeholder="Chọn giới tính"
            size="large"
          >
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
            <Option value="other">Khác</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="birth_date"
          label="Ngày sinh"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
        >
          <DatePicker
            placeholder="Chọn ngày sinh"
            size="large"
            style={{ width: '100%' }}
            format="DD/MM/YYYY"
            suffixIcon={<CalendarOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
        >
          <Select
            placeholder="Chọn vai trò"
            size="large"
            suffixIcon={<SafetyCertificateOutlined />}
          >
            <Option value="admin">Admin</Option>
            <Option value="user">User</Option>
            <Option value="seller">Seller</Option>
            <Option value="editor">Editor</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserFormModal;
