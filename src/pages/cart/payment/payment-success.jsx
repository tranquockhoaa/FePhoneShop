import { useEffect, useState } from "react";

import { checkPaymentApi } from "../../../api/order";
import "./payment-success.css";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../../api/cart-user";

const PaymentResult = () => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const checkPayment = async () => {
    const query = window.location.search;

    try {
      const response = await checkPaymentApi(query);

      if (response.status === "success") {
        clearCart();
        setStatus("success");
        setMessage("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
      } else if (response.status === "cancelled") {
        setStatus("cancelled");
        setMessage("Bạn đã hủy giao dịch.");
      } else {
        setStatus("failed");
        setMessage("Thanh toán thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi xác minh thanh toán:", error);
      setStatus("error");
      setMessage("Có lỗi xảy ra khi xử lý giao dịch.");
    }
  };

  useEffect(() => {
    checkPayment();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return (
          <div className="icon success-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
        );
      case "failed":
      case "error":
        return (
          <div className="icon error-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        );
      case "cancelled":
        return (
          <div className="icon warning-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="icon loading-icon">
            <div className="spinner"></div>
          </div>
        );
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case "success":
        return "Thanh toán thành công!";
      case "failed":
      case "error":
        return "Thanh toán thất bại";
      case "cancelled":
        return "Giao dịch đã hủy";
      default:
        return "Đang xử lý...";
    }
  };

  const getActionButton = () => {
    if (status === "loading") return null;

    return (
      <div className="action-buttons">
        {status === "success" ? (
          <>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/order-lookup")}
            >
              Xem đơn hàng
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/")}>
              Tiếp tục mua sắm
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/cart")}
            >
              Thử lại
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/order-lookup")}
            >
              Về trang chủ
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="payment-result-container">
      <div className={`payment-result-card ${status}`}>
        <div className="card-content">
          {getStatusIcon()}
          <h1 className="status-title">{getStatusTitle()}</h1>
          <p className="status-message">{message}</p>
          {getActionButton()}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
