import React from "react";
import "./AdminDashboard.css";

const AdminHeader = ({ adminName }) => (
  <div className="admin-header">Xin chào, {adminName || "Admin"}</div>
);

export default AdminHeader;
