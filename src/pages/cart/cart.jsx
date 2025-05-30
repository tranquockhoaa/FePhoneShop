import React from "react";
import "./cart.css";
const cart = () => {
  return (
    <div className="cart-container">
      {/* <div className="empty-cart">
        <h2 className="text">Chưa có sản phẩm nào trong giỏ hàng</h2>
        <img
          className="empty-cart-image"
          src="/image/common/empty_cart.png"
          alt="image"
        />
      </div> */}
      <div className="cart-detail">
        <div className="top-detail">
          <div className="left">{"Mua thêm sản phẩm khác"}</div>
          <div className="right">GIỎ HÀNG CỦA BẠN</div>
        </div>
        <div className="table-wrap">
          <div className="row-table"></div>
        </div>
      </div>
    </div>
  );
};

export default cart;
