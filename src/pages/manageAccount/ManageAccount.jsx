import "./ManageAccount.css";
import Header from "../../components/header/Header";
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Loggout from "./Loggout";

const menu = [
  { icon: "🏠", label: "Về Trang chủ", path: "/" },
  { icon: "👤", label: "Thông tin tài khoản", path: "infoAccount" },
  { icon: "🚪", label: "Đăng xuất", action: "logout" },
];

const ManageAccount = () => {
  const [showLoggoutPopup, setLoggoutPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Khi vào /manageAccount thì tự động chuyển sang /manageAccount/infoAccount
  useEffect(() => {
    if (
      location.pathname === "/manageAccount" ||
      location.pathname === "/manageAccount/"
    ) {
      navigate("infoAccount", { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleMenuClick = (item) => {
    if (item.action === "logout") {
      setLoggoutPopup(!showLoggoutPopup);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="manage-account-root">
      <Header />
      <div className="manage-container">
        <aside className="left-col">
          <nav className="block-menu">
            {menu.map((item) => (
              <button
                key={item.label}
                className="block-item-menu"
                onClick={() => handleMenuClick(item)}
              >
                <span style={{ marginRight: 10 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
            {showLoggoutPopup && (
              <Loggout clickLoggoutPopup={() => setLoggoutPopup(false)} />
            )}
          </nav>
        </aside>
        <main className="right-col">
          <div className="account-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageAccount;
