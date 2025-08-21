import React, { useEffect, useState } from "react";
import "./OrderHistory.css";
import { Link } from "react-router-dom";
import { getAllOrderUserApi } from "../../api/order-user";
import OrderItem from "./OrderItem";

const STATUS_TABS = [
  { label: "Tất cả", value: "" },
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Đã xác nhận", value: "CONFIRMED" },
  { label: "Đang vận chuyển", value: "SHIPPED" },
  { label: "Đã giao hàng", value: "DELIVERED" },
  { label: "Đã huỷ", value: "CANCELLED" },
];

// Hàm chuyển trạng thái sang tiếng Việt
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

// Format ngày
function formatVNDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 20,
        ...(status && { status }),
        ...(fromDate && { fromDate }),
        ...(toDate && { toDate }),
      };

      const res = await getAllOrderUserApi(params);
      setOrders(res.data || []);
    } catch (err) {
      console.error("fetchOrders error:", err);
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [status, fromDate, toDate]);

  console.log("order_item");

  return (
    <div className="order-history-container">
      <div className="order-history-tabs">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            className={status === tab.value ? "active" : ""}
            onClick={() => setStatus(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="order-history-filter">
        <span>Lịch sử mua hàng</span>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
        <span style={{ margin: "0 8px" }}>→</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ margin: 32 }}>Đang tải...</div>
      ) : orders.length === 0 ? (
        <div className="order-history-empty">
          <img src="/empty-order.png" alt="empty" style={{ width: 120 }} />
          <div>
            Bạn chưa có đơn hàng nào <a href="/">Trang chủ</a>
          </div>
        </div>
      ) : (
        <div className="order-history-list">
          {orders.map((order) => (
            <div className="order-history-item" key={order.order_id}>
              <div className="order-header">
                <div>
                  <b>Mã đơn hàng:</b> {order.order_id} {" | "}
                  <b>Ngày đặt hàng:</b> {formatVNDate(order.createdAt)} {" | "}
                  <b>Trạng thái:</b> {getStatusText(order.status)}
                </div>

                <div>
                  <b>Người nhận:</b> {order.full_name} {" | "}
                  <b>SĐT:</b> {order.phone_number} {" | "}
                  <b>Email:</b> {order.email}
                </div>

                <div>
                  <b>Địa chỉ:</b> {order.address}
                </div>

                <div>
                  <b>Phương thức thanh toán:</b> {order.payment_method}
                </div>

                <div>
                  <b>Tổng tiền:</b> {order.total_amount?.toLocaleString()} đ
                </div>
              </div>

              {/* Hiển thị sản phẩm đầu tiên */}
              {order.order_items && order.order_items.length > 0 && (
                <div className="first-product">
                  <OrderItem item={order.order_items[0]} />
                </div>
              )}

              {/* Hiển thị số lượng sản phẩm còn lại nếu có */}
              {order.order_items && order.order_items.length > 1 && (
                <div className="remaining-products">
                  <p>Và {order.order_items.length - 1} sản phẩm khác</p>
                </div>
              )}

              <div className="order-footer">
                <Link
                  to={`/order-detail/${order.order_id}`}
                  className="view-detail-link"
                >
                  Xem chi tiết đơn hàng
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
