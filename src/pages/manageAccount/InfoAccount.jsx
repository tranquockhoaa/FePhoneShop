import React from 'react';
const infoAccount = () => {
  const accountInfo = JSON.parse(localStorage.getItem('account'));
  return (
    <div className="form-group">
      <div className="avata-name">
        <h3> Hello {accountInfo.fullName}</h3>
      </div>

      <div className="field">
        <input
          type="text"
          className="name-item"
          placeholder={`Họ và tên: ${accountInfo.fullName}`}
        />
      </div>

      <div className="field">
        <input
          type="text"
          className="name-item"
          placeholder={`Giới tính: ${accountInfo.gende || 'chưa cập nhật'}`}
        />
      </div>

      <div className="field">
        <input
          type="text"
          className="name-item"
          placeholder={`Email: ${accountInfo.email}`}
        />
      </div>

      <div className="field">
        <input
          type="text"
          className="name-item"
          placeholder={`Số điện thoại: ${
            accountInfo.phoneNumber || 'chưa cập nhật'
          }`}
        />
      </div>

      <div className="field">
        <input
          type="text"
          className="name-item"
          placeholder={`Địa chỉ: ${accountInfo.address || 'chưa cập nhật'}`}
        />
      </div>

      <div className="field">
        <input
          type="text"
          className="name-item"
          placeholder={`Ngày sinh: ${accountInfo.birthDate || 'chưa cập nhật'}`}
        />
      </div>
    </div>
  );
};

export default infoAccount;
