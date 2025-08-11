import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import AccountSetting from "../pages/auth/accountSetting";

import { useState, useEffect } from "react";

const Header = () => {
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem("account"))
  );

  useEffect(() => {
    // Handler mỗi khi bạn bắn event 'accountChange'
    const onAccountChange = () => {
      setAccountInfo(JSON.parse(localStorage.getItem("account")));
    };

    window.addEventListener("accountChange", onAccountChange);
    return () => {
      window.removeEventListener("accountChange", onAccountChange);
    };
  }, []);

  return (
    <div className="header-container">
      <div className="navbar">
        <div className="butto-home">
          <a href="http://localhost:5173/" className="homepage-link">
            <div className="header-logo">BUYNEWPHONE</div>
          </a>
        </div>

        <div className="navbar-search">
          <form action="">
            <input
              type="text"
              name="searchWord"
              placeholder="Tìm kiếm sản phẩm"
              className="search"
            />
            <button type="submit">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>

        <div className="contact">
          <div className="contact">
            <p>Gọi mua hàng</p>
            <b>0123456789</b>
          </div>
        </div>

        <div className="wish-list">Wishlist</div>

        <div className="order-button">
          <Link to="/cart" className="title">
            Giỏ hàng
          </Link>
        </div>

        {/* Thêm tra cứu đơn hàng */}
        <div className="order-lookup">
          <Link to="/order-lookup" className="title">
            Tra cứu <br /> đơn hàng{" "}
          </Link>
        </div>

        {!accountInfo ? (
          <div className="header-login-button">
            <Link to="/login" className="login-link login-status">
              Đăng nhập
            </Link>
          </div>
        ) : (
          <AccountSetting />
        )}
      </div>
    </div>
  );
};

export default Header;
