import React from "react";
import "./AdminDashBoard.css";

const AdminHeader = ({ adminName }) => (
  <div className="admin-header">Xin chào, {adminName || "Admin"}</div>
);

export default AdminHeader;
