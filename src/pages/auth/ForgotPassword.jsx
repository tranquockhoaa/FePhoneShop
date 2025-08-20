import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, notification, Form, Input } from "antd";
import { forgotPasswordApi, resetPasswordApi } from "../../api/profile.api";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [api, contextHolder] = notification.useNotification();

  const handleCancel = () => {
    navigate("/login");
  };

  const onFinishSendCode = async (values) => {
    try {
      await forgotPasswordApi(values);
      setEmail(values.email);
      api.success({
        message: "Email",
        description: "Vui lòng kiểm tra email để nhận mã xác thực",
      });
    } catch (error) {
      api.error({
        message: "Error",
        description: error.data.error,
      });
    }
  };

  const onFinishChangePassword = async (values) => {
    console.log("Success:", values);

    try {
      await resetPasswordApi({ ...values, email });

      api.success({
        message: "Thành công",
        description: "Đổi mật khẩu thành công",
      });
      navigate("/login");
    } catch (error) {
      api.error({
        message: "Error",
        description: error.data.error,
      });
    }
  };

  return (
    <div className="forgotPassword-container">
      {contextHolder}
      <h2 style={{ color: "#3b82f6" }}>Quên Mật Khẩu</h2>
      <div className="separator"></div>
      <p className="description">Nhập email để lấy lại mật khẩu</p>
      {email ? (
        <Form name="basic" onFinish={onFinishChangePassword}>
          <Form.Item
            name="code"
            rules={[{ required: true, message: "Code is required" }]}
          >
            <Input placeholder="Nhập mã code" />
          </Form.Item>
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: "Please input your new password!" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { 
                required: true, 
                message: 'Please confirm your password!' 
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('The two passwords that you entered do not match!');
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          <div className="wrap-button">
            <Button onClick={handleCancel}>Hủy</Button>

            <Button type="primary" htmlType="submit">
              Tiếp tục
            </Button>
          </div>
        </Form>
      ) : (
        <Form name="basic" onFinish={onFinishSendCode}>
          <Form.Item
            name="email"
            rules={[
              { required: true, type: "email", message: "Email is required" },
            ]}
          >
            <Input placeholder="Nhập địa chỉ email" />
          </Form.Item>

          <div className="wrap-button">
            <Button onClick={handleCancel}>Hủy</Button>

            <Button type="primary" htmlType="submit">
              Tiếp tục
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}

export default ForgotPassword;
