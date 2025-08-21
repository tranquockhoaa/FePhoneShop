import React, { useEffect, useState } from "react";
import "./cart.css";
import {
  clearCart,
  getCartDetailApi,
  handleDecreaseApi,
  handleIncreaseApi,
  handleRemoveProductApi,
} from "../../api/cart-user";
import { useSelector } from "react-redux";
import { createPayment } from "../../api/order";
import { SiAwwwards } from "react-icons/si";
import OrderSuccessPopup from "./payment/popup-success";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

const Cart = () => {
  const { profile } = useSelector((state) => state.profile);

  const [cartDetails, setCartDetails] = useState([]);
  const [cartStatus, setCartStatus] = useState("");
  const [total, setTotal] = useState(0);
  const [error, setError] = useState();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    address: "",
    payment_method: "",
  });

  const navigate = useNavigate();
  const loadCart = async () => {
    try {
      const res = await getCartDetailApi();
      const data = res.data;
      setCartDetails(data.updatedCartDetails || []);
      setCartStatus(data.status || "");

      const sum = (data.updatedCartDetails || []).reduce(
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

  useEffect(() => {
    if (profile) {
      setCustomerInfo((prev) => ({
        ...prev,
        full_name: profile.full_name || "",
        phone_number: profile.phone_number || "",
        email: profile.email || "",
        address: profile.address || "",
      }));
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantity = async (product_detail_id, delta) => {
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

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    try {
      if (!customerInfo.payment_method) {
        setError("Vui lòng chọn phương thức thanh toán");
        return;
      }
      setLoading(true);

      const products = cartDetails.map((item) => {
        return {
          product_detail_id: item.product_detail.product_detail_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        };
      });

      const data = {
        ...customerInfo,
        total_amount: total,
        products: products,
      };

      const res = await createPayment(data);

      if (customerInfo.payment_method === "VNPAY") {
        window.location.href = res;
      } else {
        if (res.status === "success") {
          clearCart();
          setShowSuccessModal(true);
        }
      }
      setError("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = () => {
    navigate("/order-lookup");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const getUrlImage = (index) => {
    const nameColor = cartDetails[index].product_detail.color.name;
    console.log("nameColor", nameColor);

    const listColor = cartDetails[index].product_detail.product.color;

    const matchedColor = listColor.find(
      (color) => color.color_name === nameColor
    );
    console.log(matchedColor?.images?.[0]?.link || null);
    return matchedColor?.images?.[0]?.link || null;
  };

  return (
    <Spin spinning={loading} tip="Đang xử lý đơn hàng...">
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
              cartDetails.map((item, index) => {
                const cartDetailId = item.product_detail.product_detail_id;
                const product = item.product_detail?.product || {};
                const memory = item.product_detail?.memory || {};
                const brand = product.brand || {};

                return (
                  <div className="cart-item" key={cartDetailId}>
                    <div className="cart-left">
                      <img
                        src={getUrlImage(index)}
                        alt={product.name}
                        className="product-img"
                      />
                      <div className="cart-info">
                        <h4>{product.name}</h4>
                        <p>
                          {memory.ram_size} / {memory.storage_size} / Màu:{" "}
                          {item.product_detail.color.name}
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
                        {item.total?.toLocaleString()}₫
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
                  name="full_name"
                  placeholder="Họ tên *"
                  value={customerInfo.full_name}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="phone_number"
                  placeholder="Điện thoại *"
                  value={customerInfo.phone_number}
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
                  <input
                    type="radio"
                    name="payment_method"
                    value="COD"
                    checked={customerInfo.payment_method === "COD"}
                    onChange={handleInputChange}
                  />
                  Thanh toán khi nhận hàng (COD)
                </label>
                <label style={{ marginLeft: 16 }}>
                  <input
                    type="radio"
                    name="payment_method"
                    value="VNPAY"
                    checked={customerInfo.payment_method === "VNPAY"}
                    onChange={handleInputChange}
                  />
                  Thanh toán VNPAY
                </label>
              </div>

              <div className="checkout-row">
                {error && <span style={{ color: "red" }}>{error}</span>}
              </div>

              <button type="submit" className="checkout-btn" disabled={loading}>
                {loading ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
              </button>
            </form>
          )}
        </div>

        <OrderSuccessPopup
          visible={showSuccessModal}
          onClose={handleCloseSuccessModal}
          onViewOrder={handleViewOrder}
          onGoHome={handleGoHome}
          message="Đặt đơn hàng thành công"
        />
      </div>
    </Spin>
  );
};

export default Cart;
