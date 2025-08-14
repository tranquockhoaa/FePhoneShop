import React from "react";
import "./Loggout.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Loggout = ({ clickLoggoutPopup }) => {
  const navigate = useNavigate();

  const onLoggout = async () => {
    try {
      // 1. Lấy token từ localStorage (kiểm tra tồn tại)
      const accountInfo = JSON.parse(localStorage.getItem("account"));
      if (!accountInfo || !accountInfo.token) {
        throw new Error("No account info found");
      }

      // 2. Gọi API logout
      await axios.post(
        "http://127.0.0.1:3000/api/v1/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accountInfo.token}`,
          },
        }
      );

      // 3. Xóa dữ liệu localStorage và chuyển hướng
      localStorage.removeItem("account");
      window.dispatchEvent(new Event("storage")); // Kích hoạt sự kiện để các component khác biết
      navigate("/");
      clickLoggoutPopup(); // Đóng popup
    } catch (error) {
      console.error("Logout failed:", error);
      // Xóa localStorage ngay cả khi API fail (đảm bảo UX)
      localStorage.removeItem("account");
      navigate("/");
    }
  };

  return (
    <div className="loggout-container">
      <div className="loggout">
        <div className="content">
          <p>Bạn có chắc chắn muốn thoát tài khoản?</p>
          <div className="button-group">
            <button className="button" onClick={onLoggout}>
              Có
            </button>
            <button className="button" onClick={clickLoggoutPopup}>
              Không
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loggout;
