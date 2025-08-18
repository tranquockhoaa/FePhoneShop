import React from "react";
import "./Header.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AccountSetting from "../../pages/auth/accountSetting";

const Header = () => {
  const { profile } = useSelector((state) => state.profile);

  return (
    <div className="header-container">
      <div className="navbar">
        <div className="butto-home">
          <a href="http://localhost:5173/" className="homepage-link">
            <div className="header-logo">BUYNEWPHONE</div>
          </a>
        </div>

        <div className="navbar-search">
          <form action="" className="search-form">
            <button type="submit">
              <i className="fa fa-search"></i>
            </button>
            <input
              style={{ height: "100%" }}
              type="text"
              name="searchWord"
              placeholder="Tìm kiếm sản phẩm"
              className="search"
            />
          </form>
        </div>

        <div className="contact">
          <div className="contact">
            <p>Gọi mua hàng</p>
            <b>0345697125</b>
          </div>
        </div>

        {/* <div className="wish-list">Wishlist</div> */}

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

        {!profile ? (
          <div className="header-login-button">
            <Link to="/login" className="login-link login-status">
              Đăng nhập
            </Link>
          </div>
        ) : (
          <AccountSetting accountInfo={profile} />
        )}
      </div>
    </div>
  );
};

export default Header;
