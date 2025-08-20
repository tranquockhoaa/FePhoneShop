import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, notification } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword, logoutApi } from "../../api/profile.api";
import { profileAction } from "../../store/profile/profile.store";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Mật khẩu mới và mật khẩu xác nhận phải khớp!");
      return;
    }

    setLoading(true);

    try {
      await changePassword(values.oldPassword, values.newPassword);

      await logoutApi();
      dispatch(profileAction.resetProfile());

      localStorage.removeItem("token");
      window.dispatchEvent(new Event("storage"));

      api.success({
        message: "Thành công",
        description: "Đổi mật khẩu thành công",
      });

      navigate("/login");
    } catch (error) {
      api.error({
        message: "Lỗi",
        description: error.data.error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      {contextHolder}
      <h2 style={{ color: "#3b82f6" }}>Đổi mật khẩu</h2>
      <Form
        name="changePassword"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="oldPassword"
          label="Mật khẩu cũ"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu cũ"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập mật khẩu mới"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Nhập lại mật khẩu mới"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu mới!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Nhập lại mật khẩu mới"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
