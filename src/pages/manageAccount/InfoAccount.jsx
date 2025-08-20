import "./InfoAccount.css";
import { useSelector } from "react-redux";
import { Form, Input, Button, DatePicker, Select, notification } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { updateUserApi } from "../../api/users.api";

const InfoAccount = () => {
  const { profile } = useSelector((state) => state.profile);
  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();

const onFinish = async (values) => {
  try {
    if (values.birth_date) {
      values.birth_date = values.birth_date.format("YYYY-MM-DD");
    }
    const response = await updateUserApi({ id: profile?.id, body: values });

    if (response.status === 'success') {
      api.success({
        message: "Thành công",
        description: response.message || "Cập nhật người dùng thành công!",
      });
    } else {
      api.error({
        message: "Lỗi",
        description: response.message || "Có lỗi xảy ra khi cập nhật.",
      });
    }
  } catch (error) {
    const errorMessage = typeof error === 'string' ? error : error.message || 'Đã xảy ra lỗi';
    api.error({
      message: "Lỗi",
      description: errorMessage,
    });
  }
};


  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        full_name: profile.full_name,
        gender: profile.gender,
        email: profile.email,
        phone_number: profile.phone_number,
        address: profile.address,
        birth_date: profile.birth_date ? dayjs(profile.birth_date) : null,
      });
    }
  }, [profile, form]);

  return (
    <div className="form-group">
      {contextHolder}
      <h3>Hello {profile?.full_name}</h3>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Họ và tên"
          name="full_name"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item label="Giới tính" name="gender">
          <Select placeholder="Chọn giới tính">
            <Select.Option value="NAM">Nam</Select.Option>
            <Select.Option value="Nữ">Nữ</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ type: "email", message: "Vui lòng nhập email hợp lệ!" }]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone_number"
          rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item label="Ngày sinh" name="birth_date">
          <DatePicker placeholder="Chọn ngày sinh" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InfoAccount;
