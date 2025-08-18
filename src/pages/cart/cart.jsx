import React, { useEffect, useState } from "react";
import "./cart.css";
import {
  getCartDetailApi,
  handleDecreaseApi,
  handleIncreaseApi,
  handleRemoveProductApi,
} from "../../api/cart-user";

const Cart = () => {
  const [cartDetails, setCartDetails] = useState([]);
  const [cartStatus, setCartStatus] = useState("");
  const [total, setTotal] = useState(0);
  console.log(cartDetails);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
    address: "",
  });

  const loadCart = async () => {
    try {
      const res = await getCartDetailApi();
      const data = res.data; // vì api trả về response.data rồi
      setCartDetails(data.cartDetails || []);
      setCartStatus(data.status || "");

      const sum = (data.cartDetails || []).reduce(
        (acc, item) => acc + item.unit_price * item.quantity,
        0
      );
      setTotal(sum);
    } catch (error) {
      console.error("Load cart error:", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantity = async (product_detail_id, delta) => {
    console.log(product_detail_id);
    try {
      if (delta === 1) {
        await handleIncreaseApi(product_detail_id);
      } else {
        await handleDecreaseApi(product_detail_id);
      }
      await loadCart();
    } catch (error) {
      console.error("Update quantity error:", error);
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    console.log("Order info:", customerInfo);
  };

  return (
    <div className="cart-container">
      <div className="cart-detail">
        <div className="top-detail">
          <div
            className="left"
            onClick={() => (window.location.href = "/")}
            style={{ cursor: "pointer" }}
          >
            Mua thêm sản phẩm khác
          </div>
          <div className="right">GIỎ HÀNG CỦA BẠN</div>
        </div>

        <div className="table-wrap">
          {cartDetails.length === 0 || cartStatus === "ORDERED" ? (
            <div className="empty-cart">
              <h2 className="text">Chưa có sản phẩm nào trong giỏ hàng</h2>
              <img
                className="empty-cart-image"
                src="/image/common/empty_cart.png"
                alt="empty"
              />
            </div>
          ) : (
            cartDetails.map((item) => {
              const cartDetailId = item.product_detail.product_detail_id;
              const product = item.product_detail?.product || {};
              const memory = item.product_detail?.memory || {};
              const brand = product.brand || {};

              return (
                <div className="cart-item" key={cartDetailId}>
                  <div className="cart-left">
                    <img src="" alt={product.name} className="product-img" />
                    <div className="cart-info">
                      <h4>{product.name}</h4>
                      <p>
                        {memory.ram_size} / {memory.storage_size} / Màu:{" "}
                        {item.product_detail.color_id}
                      </p>
                      <p>Thương hiệu: {brand.name}</p>
                      <div
                        className="del-item"
                        onClick={async () => {
                          handleRemoveProductApi(
                            item.product_detail.product_detail_id
                          );
                          await loadCart();
                        }}
                      >
                        Xóa
                      </div>
                    </div>
                  </div>
                  <div className="cart-right">
                    <div className="cart-price">
                      {item.unit_price?.toLocaleString()}₫
                    </div>
                    <div className="quantity-control">
                      <button
                        onClick={async () => {
                          await handleDecreaseApi(
                            item.product_detail.product_detail_id
                          );
                          await loadCart();
                        }}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={async () => {
                          await handleIncreaseApi(
                            item.product_detail.product_detail_id
                          );
                          await loadCart();
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartDetails.length > 0 && cartStatus !== "ORDERED" && (
          <div className="total-cart">
            <font>Thanh toán:</font>{" "}
            <span className="total-price">{total.toLocaleString()}₫</span>
          </div>
        )}

        {cartDetails.length > 0 && (
          <form className="checkout-form" onSubmit={handleSubmitOrder}>
            <div className="checkout-title">THÔNG TIN KHÁCH HÀNG</div>
            <div className="checkout-row">
              <input
                type="text"
                name="name"
                placeholder="Họ tên *"
                value={customerInfo.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Điện thoại *"
                value={customerInfo.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="checkout-row">
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={customerInfo.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="checkout-row">
              <input
                type="text"
                name="note"
                placeholder="Lưu ý khi giao hàng"
                value={customerInfo.note}
                onChange={handleInputChange}
              />
            </div>
            <div className="checkout-row">
              <textarea
                name="address"
                placeholder="Địa chỉ nhận hàng *"
                value={customerInfo.address}
                onChange={handleInputChange}
                required
                rows={2}
              />
            </div>

            <div className="checkout-row">
              <label>
                <input type="radio" name="payment_method" value="COD" />
                Thanh toán khi nhận hàng (COD)
              </label>
              <label style={{ marginLeft: 16 }}>
                <input type="radio" name="payment_method" value="QR" />
                Thanh toán VNPAY
              </label>
            </div>

            <button type="submit" className="checkout-btn">
              ĐẶT HÀNG
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Cart;
