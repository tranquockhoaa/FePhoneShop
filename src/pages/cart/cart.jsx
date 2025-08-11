import React, { useEffect, useState } from "react";
import axios from "axios";
import "./cart.css";
import QRCode from "react-qr-code";

const Cart = () => {
  const [cartDetails, setCartDetails] = useState([]);
  const [total, setTotal] = useState(0);

  // Thông tin khách hàng
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    note: "",
    address: "",
  });

  // Thêm state cho phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // State cho QR
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [qrSessionId, setQrSessionId] = useState(""); // dùng cho luồng QR chuẩn

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Lấy token từ localStorage
  const account = JSON.parse(localStorage.getItem("account") || "{}");
  const token = account.token;

  // Lấy giỏ hàng từ backend
  const [cartStatus, setCartStatus] = useState("ACTIVE");
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:3000/api/v1/cart/my-cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const details = res.data.data.cartDetails || [];
        setCartDetails(details);
        setTotal(
          details.reduce(
            (sum, item) => sum + (item.unit_price || 0) * (item.quantity || 0),
            0
          )
        );
        setCartStatus(res.data.data.cart?.status || "ACTIVE");
      });
  }, [token]);

  // Xử lý tăng/giảm số lượng
  const handleQuantity = (cartDetailId, delta) => {
    const item = cartDetails.find(
      (i) =>
        i.cartdetailid === cartDetailId ||
        i.cart_detail_id === cartDetailId ||
        i.cartDetailId === cartDetailId ||
        i.id === cartDetailId
    );
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    axios
      .patch(
        `http://localhost:3000/api/v1/cart-detail/${cartDetailId}/quantity/${
          delta > 0 ? "increase" : "decrease"
        }`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        // Reload cart
        return axios.get("http://localhost:3000/api/v1/cart/my-cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        const details = res.data.data.cartDetails || [];
        setCartDetails(details);
        setTotal(
          details.reduce(
            (sum, item) => sum + (item.unit_price || 0) * (item.quantity || 0),
            0
          )
        );
      });
  };

  // Xóa sản phẩm khỏi cart
  const handleDelete = (cartDetailId) => {
    axios
      .delete(`http://localhost:3000/api/v1/cart-detail/${cartDetailId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        // Reload cart
        return axios.get("http://localhost:3000/api/v1/cart/my-cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        const details = res.data.data.cartDetails || [];
        setCartDetails(details);
        setTotal(
          details.reduce(
            (sum, item) => sum + (item.unit_price || 0) * (item.quantity || 0),
            0
          )
        );
      });
  };

  // Hàm build url ảnh sản phẩm giống homepage/productlist
  const buildImageUrl = (item) => {
    if (item.image) return encodeURI(item.image);
    if (item.brand_name && item.code && item.color) {
      return encodeURI(
        `data/${item.brand_name}/${item.code}/image/${item.color}.jpg`
      );
    }
    return "/image/common/no_image.png";
  };

  // Luồng chuẩn QR: Gửi yêu cầu tạo QR session (chưa tạo đơn hàng)
  const handleCreateQR = async (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }
    try {
      // Gửi thông tin tạm thời lên server để tạo QR (API này bạn cần backend hỗ trợ)
      const res = await axios.post(
        "http://localhost:3000/api/v1/payment/create-qr-session",
        {
          amount: total,
          customer: customerInfo,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Server trả về qrValue (chuỗi để render QR) và qrSessionId (id để kiểm tra trạng thái)
      setQrValue(res.data.qrValue);
      setQrSessionId(res.data.qrSessionId);
      setShowQR(true);
    } catch (err) {
      alert("Không tạo được mã QR!");
    }
  };

  // Khi xác nhận đã thanh toán thành công (giả lập bằng nút)
  const handleConfirmQRPayment = async () => {
    try {
      // Gọi API kiểm tra trạng thái thanh toán QR
      const res = await axios.get(
        `http://localhost:3000/api/v1/payment/check-qr-session/${qrSessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status === "success" && res.data.paid) {
        // Đã thanh toán thành công, tạo đơn hàng và payment
        const orderRes = await axios.post(
          "http://localhost:3000/api/v1/order/checkout",
          {
            name: customerInfo.name,
            phone: customerInfo.phone,
            email: customerInfo.email,
            note: customerInfo.note,
            address: customerInfo.address,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const orderId = orderRes.data?.data?.order_id;
        // Tạo payment với trạng thái SUCCESS
        await axios.post(
          "http://localhost:3000/api/v1/payment",
          {
            order_id: orderId,
            amount: total,
            payment_method: "QR",
            payment_status: "SUCCESS",
            transaction_code: res.data.transaction_code, // nếu có
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        localStorage.removeItem("cart");
        alert("Đặt hàng và thanh toán thành công!");
        window.location.href = "/";
      } else {
        alert("Chưa nhận được thanh toán. Vui lòng thử lại sau!");
      }
    } catch (err) {
      alert("Lỗi kiểm tra trạng thái thanh toán!");
    }
  };

  // Đặt hàng và thanh toán COD
  const handleOrder = async (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }
    try {
      // Đặt hàng
      const orderRes = await axios.post(
        "http://localhost:3000/api/v1/order/checkout",
        {
          name: customerInfo.name,
          phone: customerInfo.phone,
          email: customerInfo.email,
          note: customerInfo.note,
          address: customerInfo.address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const orderData = orderRes.data?.data;
      if (!orderData || !orderData.order_id) {
        alert("Không lấy được mã đơn hàng từ server!");
        return;
      }
      const orderId = orderData.order_id;

      // Tạo payment
      await axios.post(
        "http://localhost:3000/api/v1/payment",
        {
          order_id: orderId,
          amount: total,
          payment_method: paymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.removeItem("cart");
      alert("Đặt hàng và thanh toán thành công!");
      window.location.href = "/";
    } catch (err) {
      console.error("Lỗi:", err);
      alert(
        "Đặt hàng/thanh toán thất bại!\n" +
          (err?.response?.data?.message || err.message)
      );
    }
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
              const cartDetailId =
                item.cartdetailid ||
                item.cart_detail_id ||
                item.cartDetailId ||
                item.id;
              return (
                <div className="cart-item" key={cartDetailId}>
                  <div className="cart-left">
                    <img
                      src={buildImageUrl(item)}
                      alt={item.name}
                      className="product-img"
                    />
                    <div className="cart-info">
                      <h4>{item.name}</h4>
                      <p>
                        {item.ram_size || item.ram} /{" "}
                        {item.storage_size || item.storage} / {item.color}
                      </p>
                      <div
                        className="del-item"
                        onClick={() => handleDelete(cartDetailId)}
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
                      <button onClick={() => handleQuantity(cartDetailId, -1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantity(cartDetailId, 1)}>
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
        {/* Form đặt hàng */}
        {cartDetails.length > 0 && !showQR && (
          <form
            className="checkout-form"
            onSubmit={paymentMethod === "QR" ? handleCreateQR : handleOrder}
          >
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
                placeholder="Lưu ý hoặc yêu cầu trước khi giao hàng"
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
            {/* Chọn phương thức thanh toán */}
            <div className="checkout-row">
              <label>
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                Thanh toán khi nhận hàng (COD)
              </label>
              <label style={{ marginLeft: 16 }}>
                <input
                  type="radio"
                  name="payment_method"
                  value="QR"
                  checked={paymentMethod === "QR"}
                  onChange={() => setPaymentMethod("QR")}
                />
                Thanh toán QR
              </label>
            </div>
            <button type="submit" className="checkout-btn">
              ĐẶT HÀNG
            </button>
          </form>
        )}
        {/* Hiển thị QR nếu chọn QR */}
        {showQR && (
          <div className="qr-modal">
            <h3>Quét mã QR để thanh toán</h3>
            <QRCode value={qrValue} size={256} />
            <div style={{ margin: "16px 0" }}>{qrValue}</div>
            <button onClick={handleConfirmQRPayment}>
              Tôi đã thanh toán xong
            </button>
            <button onClick={() => window.location.reload()}>Hủy</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
