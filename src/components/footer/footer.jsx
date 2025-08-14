import React from "react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Về chúng tôi</h3>
          <p className="footer-about">
            Chuyên cung cấp các sản phẩm điện thoại chính hãng với giá tốt nhất
            thị trường. Cam kết chất lượng và dịch vụ hàng đầu.
          </p>
          <div className="footer-social">
            <a href="/" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="/" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="/" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="/" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Liên hệ</h3>
          <ul className="footer-contact">
            <li>
              <FaMapMarkerAlt /> 123 Đường ABC, Quận XYZ, TP.HCM
            </li>
            <li>
              <FaPhone /> 0123 456 789
            </li>
            <li>
              <FaEnvelope /> info@dienthoai.vn
            </li>
            <li>
              <FaClock /> 8:00 - 22:00 (T2 - CN)
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Hỗ trợ</h3>
          <ul className="footer-links">
            <li>
              <a href="/">Trang chủ</a>
            </li>
            <li>
              <a href="/">Sản phẩm</a>
            </li>
            <li>
              <a href="/">Giới thiệu</a>
            </li>
            <li>
              <a href="/">Tin tức</a>
            </li>
            <li>
              <a href="/">Liên hệ</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Chính sách</h3>
          <ul className="footer-links">
            <li>
              <a href="/">Chính sách bảo hành</a>
            </li>
            <li>
              <a href="/">Chính sách đổi trả</a>
            </li>
            <li>
              <a href="/">Chính sách vận chuyển</a>
            </li>
            <li>
              <a href="/">Chính sách thanh toán</a>
            </li>
            <li>
              <a href="/">Bảo mật thông tin</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Cửa hàng điện thoại. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
