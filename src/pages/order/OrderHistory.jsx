import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderHistory.css";
import { Link } from "react-router-dom";

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

  const account = JSON.parse(localStorage.getItem("account") || "{}");
  const token = account.token;

  const fetchOrders = async () => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    params.page = 1;
    params.limit = 20;
    try {
      const res = await axios.get("http://localhost:3000/api/v1/order", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.data || []);
    } catch (err) {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [status, fromDate, toDate]);

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
              <div>
                <b>Mã đơn hàng:</b> {order.order_id}
                {" | "}
                <b>Ngày đặt hàng:</b> {formatVNDate(order.createdAt)}
                {" | "}
                <b>Trạng thái đơn hàng:</b> {getStatusText(order.status)}
              </div>
              <div>
                <b>Tổng tiền:</b> {order.total_amount?.toLocaleString()} đ
              </div>
              {/* Hiển thị danh sách sản phẩm trong đơn */}
              <div style={{ marginTop: 8 }}>
                <b>Sản phẩm:</b>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {order.order_items?.map((item) => (
                    <li key={item.order_item_id}>
                      <span>
                        <b>Tên sản phẩm :</b>{" "}
                        {item.productDetail?.product?.name || "Không rõ"}
                        {" | "}
                        <b>SL:</b> {item.quantity}
                        {" | "}
                        <b>Đơn giá:</b> {item.unit_price?.toLocaleString()} đ
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link to={`/order-detail/${order.order_id}`}>Xem chi tiết</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
