import React from "react";
import { cancelOrderApi } from "../../api/order-user";

export default function CancelOrderButton({ orderId, onCancelSuccess }) {
  const handleCancel = async () => {
    const confirmCancel = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này?"
    );
    if (!confirmCancel) return;

    try {
      await cancelOrderApi(orderId);
      alert("Đơn hàng đã được hủy thành công!");
      if (onCancelSuccess) onCancelSuccess(); // gọi callback reload data
    } catch (error) {
      console.error("Cancel order error:", error);
      alert("Có lỗi xảy ra khi hủy đơn hàng.");
    }
  };

  return (
    <button
      style={{
        padding: "10px 10px",
        borderRadius: 5,
        backgroundColor: "red",
        color: "white",
        fontSize: 14,
        border: "none",
        cursor: "pointer",
      }}
      onClick={handleCancel}
    >
      Hủy đơn hàng
    </button>
  );
}
