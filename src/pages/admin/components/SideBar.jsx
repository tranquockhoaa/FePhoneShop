import React, { useState } from "react";
import {
  FaHome,
  FaUserFriends,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaChartBar,
  FaBoxOpen,
  FaMoneyBillWave,
  FaChartLine,
  FaBox,
  FaUsers,
  FaClipboardList,
  FaExclamationTriangle,
  FaTrophy,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Sidebar = ({ active, onSelect }) => {
  const [openProduct, setOpenProduct] = useState(false);

  return (
    <div className="admin-sidebar admin-template-sidebar">
      <div className="sidebar-logo">Dreams POS</div>
      <div
        className={`sidebar-item${active === "dashboard" ? " active" : ""}`}
        onClick={() => onSelect("dashboard")}
      >
        <FaHome /> Dashboard
      </div>
      <div
        className={`sidebar-item${
          active.startsWith("product") ? " active" : ""
        }`}
        onClick={() => setOpenProduct((v) => !v)}
        style={{ justifyContent: "space-between" }}
      >
        <span>
          <FaBoxOpen /> Sản phẩm
        </span>
        {openProduct ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {openProduct && (
        <div className="sidebar-submenu">
          <div
            className={`sidebar-item${
              active === "product-list" ? " active" : ""
            }`}
            onClick={() => onSelect("product-list")}
          >
            Danh sách sản phẩm
          </div>
          <div
            className={`sidebar-item${
              active === "product-detail" ? " active" : ""
            }`}
            onClick={() => onSelect("product-detail")}
          >
            Chi tiết sản phẩm
          </div>
        </div>
      )}
      <div
        className={`sidebar-item${active === "manage-brand" ? " active" : ""}`}
        onClick={() => onSelect("manage-brand")}
      >
        <FaClipboardList />
        Quản lí brand
      </div>
      <div
        className={`sidebar-item${active === "orders" ? " active" : ""}`}
        onClick={() => onSelect("orders")}
      >
        <FaClipboardList /> Đơn hàng
      </div>
      <div
        className={`sidebar-item${active === "sales" ? " active" : ""}`}
        onClick={() => onSelect("sales")}
      >
        <FaChartBar /> Doanh thu
      </div>
      <div
        className={`sidebar-item${active === "customers" ? " active" : ""}`}
        onClick={() => onSelect("customers")}
      >
        <FaUserFriends /> Khách hàng
      </div>
      <div
        className={`sidebar-item${active === "settings" ? " active" : ""}`}
        onClick={() => onSelect("settings")}
      >
        <FaCog /> Cài đặt
      </div>

      <div className="sidebar-item signout">
        <FaSignOutAlt /> Đăng xuất
      </div>
    </div>
  );
};

export default Sidebar;
