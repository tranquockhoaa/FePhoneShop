import React from "react";

const cart = () => {
  return (
    <div className="cart-container">
      <div className="empty-cart">
        <h2>Chưa có sản phẩm nào trong giỏ hàng</h2>
        <img src="/data/image/common/empty_cart.png" alt="" />
      </div>
    </div>
  );
};

export default cart;
