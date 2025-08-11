import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function getStatusText(status) {
  switch (status) {
    case "PENDING":
      return "Chờ xác nhận";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "SHIPPED":
      return "Đang vận chuyển";
    case "DELIVERED":
      return "Đã giao hàng";
    case "CANCELLED":
      return "Đã huỷ";
    default:
      return "Không xác định";
  }
}

function formatVNDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      const account = JSON.parse(localStorage.getItem("account") || "{}");
      const token = account.token;
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/order/my-orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(res.data.data);
      } catch (err) {
        setOrder(null);
      }
      setLoading(false);
    };
    fetchOrderDetail();
  }, [orderId]);

  if (loading) return <div>Đang tải...</div>;
  if (!order) return <div>Không tìm thấy đơn hàng!</div>;

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "32px auto",
        background: "#fff",
        borderRadius: 8,
        padding: 24,
      }}
    >
      <h2>Chi tiết đơn hàng #{order.order_id}</h2>
      <div>
        <b>Khách hàng:</b> {order.full_name}
      </div>
      <div>
        <b>SĐT:</b> {order.phone_number}
      </div>
      <div>
        <b>Email:</b> {order.email}
      </div>
      <div>
        <b>Địa chỉ:</b> {order.address}
      </div>
      <div>
        <b>Ngày đặt:</b> {formatVNDate(order.createdAt)}
      </div>
      <div>
        <b>Trạng thái:</b> {getStatusText(order.status)}
      </div>
      <div>
        <b>Phương thức thanh toán:</b> {order.payment_method}
      </div>
      <div>
        <b>Tổng tiền:</b> {order.total_amount?.toLocaleString()} đ
      </div>
      <div style={{ marginTop: 16 }}>
        <b>Danh sách sản phẩm:</b>
        <ul>
          {order.order_items?.map((item) => (
            <li key={item.order_item_id}>
              <span>
                <b>Tên:</b> {item.productDetail?.product?.name || "Không rõ"}
                {" | "}
                <b>Màu:</b> {item.productDetail?.color?.name || "Không rõ"}
                {" | "}
                <b>RAM:</b> {item.productDetail?.memory?.ram_size || "Không rõ"}
                {" | "}
                <b>Bộ nhớ:</b>{" "}
                {item.productDetail?.memory?.storage_size || "Không rõ"}
                {" | "}
                <b>SL:</b> {item.quantity}
                {" | "}
                <b>Đơn giá:</b> {item.unit_price?.toLocaleString()} đ
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetail;
