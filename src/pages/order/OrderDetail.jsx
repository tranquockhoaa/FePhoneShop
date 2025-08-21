import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetailApi } from "../../api/order-user";
import "./OrderDetail.css";

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
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getOrderDetailApi(orderId);
        if (res.data) {
          setOrder(res.data);
        } else {
          setError("Không tìm thấy đơn hàng");
        }
      } catch (err) {
        console.error("Fetch order detail error:", err);
        setError("Có lỗi xảy ra khi tải thông tin đơn hàng");
      }
      setLoading(false);
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  if (loading) return <div className="order-detail-loading">Đang tải...</div>;
  if (error) return <div className="order-detail-error">{error}</div>;
  if (!order)
    return <div className="order-detail-error">Không tìm thấy đơn hàng!</div>;

  const getUrlImage = (index) => {
    const nameColor = order.order_items[[index]].product_details.color.name;
    const colorList = order.order_items[[index]].product_details.product.color;
    const matchedColor = colorList.find(
      (color) => color.color_name === nameColor
    );
    return matchedColor?.images?.[0]?.link;
  };

  // console.log("order", order.order_items[[0]].product_details.product.color);
  return (
    <div className="order-detail-container">
      <h2>Chi tiết đơn hàng #{order.order_id}</h2>

      {/* Thông tin đơn hàng */}
      <div className="order-detail-section">
        <h3>Thông tin đơn hàng</h3>
        <div className="order-info-grid">
          <div className="info-item">
            <span className="info-label">Trạng thái:</span>
            <span className={`status status-${order.status?.toLowerCase()}`}>
              {getStatusText(order.status)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Ngày đặt:</span>
            <span>{formatVNDate(order.createdAt)}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Phương thức thanh toán:</span>
            <span>{order.payment_method}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Tổng tiền:</span>
            <span className="total-amount">
              {order.total_amount?.toLocaleString()}₫
            </span>
          </div>
        </div>
      </div>

      {/* Thông tin khách hàng */}
      <div className="order-detail-section">
        <h3>Thông tin khách hàng</h3>
        <div className="order-info-grid">
          <div className="info-item">
            <span className="info-label">Họ tên:</span>
            <span>{order.full_name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Số điện thoại:</span>
            <span>{order.phone_number}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span>{order.email}</span>
          </div>
          <div className="info-item full-width">
            <span className="info-label">Địa chỉ:</span>
            <span>{order.address}</span>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm - Chỉ hiển thị một phiên bản */}
      <div className="order-detail-section">
        <h3>Danh sách sản phẩm</h3>
        <div className="order-items-simple">
          {order.order_items?.map((item, index) => (
            <div key={item.order_item_id} className="order-item-simple">
              {/* Ảnh sản phẩm */}
              <div className="order-item-image">
                <img
                  src={getUrlImage(index)}
                  alt={item.product_details?.product?.name || "Không rõ"}
                />
              </div>

              {/* Thông tin sản phẩm */}
              <div className="order-item-info">
                <h4>{item.product_details?.product?.name || "Không rõ"}</h4>
                <div className="order-item-specs">
                  <p>
                    {item.product_details?.memory?.ram_size || "Không rõ"} /{" "}
                    {item.product_details?.memory?.storage_size || "Không rõ"} /
                    Màu: {item.product_details?.color?.name || "Không rõ"}
                  </p>
                  <p>
                    Thương hiệu:{" "}
                    {item.product_details?.product?.brand?.name ||
                      item.product_details?.product?.brand_id ||
                      "Không rõ"}
                  </p>
                </div>
              </div>

              {/* Giá + số lượng */}
              <div className="order-item-price">
                <div className="order-item-unit-price">
                  {item.unit_price?.toLocaleString()}₫
                </div>
                <div className="order-item-quantity">x{item.quantity}</div>
                <div className="order-item-total">
                  {item.total_price?.toLocaleString()}₫
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-detail-section order-summary">
        <h3>Tổng cộng</h3>
        <div className="summary-row">
          <span>Tổng tiền hàng:</span>
          <span>{order.total_amount?.toLocaleString()}₫</span>
        </div>

        <div className="summary-row total">
          <span>Tổng thanh toán:</span>
          <span>{order.total_amount?.toLocaleString()}₫</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
