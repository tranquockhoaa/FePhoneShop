import React from "react";
import "./InfoAccount.css";

const InfoAccount = () => {
  const accountInfo = JSON.parse(localStorage.getItem("account")) || {};
  return (
    <div className="form-group">
      <div className="avata-name">
        <h3> Hello {accountInfo.fullName}</h3>
      </div>
      <div className="info-row">
        <span className="info-label">Họ và tên:</span>
        <span className="info-value">
          {accountInfo.fullName || "Chưa cập nhật"}
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Giới tính:</span>
        <span className="info-value">
          {accountInfo.gende || "Chưa cập nhật"}
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Email:</span>
        <span className="info-value">
          {accountInfo.email || "Chưa cập nhật"}
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Số điện thoại:</span>
        <span className="info-value">
          {accountInfo.phoneNumber || "Chưa cập nhật"}
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Địa chỉ:</span>
        <span className="info-value">
          {accountInfo.address || "Chưa cập nhật"}
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Ngày sinh:</span>
        <span className="info-value">
          {accountInfo.birthDate || "Chưa cập nhật"}
        </span>
      </div>
      {/* <button className="account-info-edit-btn">Cập nhật</button> */}
    </div>
  );
};

export default InfoAccount;
