import { Button, Form, Input, notification, Radio } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userAxios from "./userAxios";
import { createCart } from "../../api/cart-user";

function SignIn() {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const [account, setAccount] = useState({
    email: "",
    password: "",
    full_name: "",
    gender: "",
    address: "",
    phone_number: "",
    status: "",
  });

  useEffect(() => {
    if (account.status === "true") {
      navigate("/");
    }
  }, [account.status]);

  const handleOnSubmit = async (values) => {
    try {
      const response = await userAxios.post(
        "http://127.0.0.1:3000/api/v1/auth/signup",
        values
      );
      if (response.data.status === "success") {
        setAccount({ ...values, status: "true" });
        createCart(response.data.userId);
        api.success({
          message: "Thành công",
          description: "Đăng ký thành công",
        });
      }
    } catch (error) {
      api.error({
        message: "Thất bại",
        description: "Email đã được đăng ký",
      });
    }
  };

  return (
    <div className="sign-in-container" style={{ marginTop: "100px" }}>
      {contextHolder}
      <h2 className="sign-in-title" style={{ color: "#3b82f6" }}>
        Đăng kí tài khoản
      </h2>

      <Form onFinish={handleOnSubmit} layout="vertical">
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item
          label="Họ và tên"
          name="full_name"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Radio.Group>
            <Radio value="Nam">Nam</Radio>
            <Radio value="Nữ">Nữ</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone_number">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng kí
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SignIn;
