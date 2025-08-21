import React from "react";
import { cancelOrderApi } from "../../api/order-user";

export default function CancelOrderButton(orderId) {
  return (
    <button
      style={{
        padding: "10px 10px",
        borderRadius: 5,
        backgroundColor: "red",
        color: "white",
        fontSize: 14,
        border: "none",
      }}
      onClick={() => {
        cancelOrderApi(orderId.orderId);
      }}
    >
      Hủy đơn hàng
    </button>
  );
}
