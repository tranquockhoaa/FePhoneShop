import React from "react";
import "./InfoAccount.css";
import { useSelector } from "react-redux";

const InfoAccount = () => {
  const profile = useSelector((state) => state.profile.profile);
  console.log(profile.profile);
  return (
    <div className="form-group">
      <div className="avata-name">
        <h3> Hello {profile.full_name}</h3>
      </div>
      <div className="info-row">
        <span className="info-label">Họ và tên:</span>
        <span className="info-value">
          {profile.full_name || "Chưa cập nhật"}
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Giới tính:</span>
        <span className="info-value">{profile.gender || "Chưa cập nhật"}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Email:</span>
        <span className="info-value">{profile.email || "Chưa cập nhật"}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Số điện thoại:</span>
        <span className="info-value">
          {profile.phoneNumber || "Chưa cập nhật"}
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Địa chỉ:</span>
        <span className="info-value">{profile.address || "Chưa cập nhật"}</span>
      </div>
      <div className="info-row">
        <span className="info-label">Ngày sinh:</span>
        <span className="info-value">
          {profile.birth_date || "Chưa cập nhật"}
        </span>
      </div>
      {/* <button className="account-info-edit-btn">Cập nhật</button> */}
    </div>
  );
};

export default InfoAccount;
