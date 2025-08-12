
import React from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/login');
  };
  return (
    <div className="forgotPassword-container">
      <h2>Quên Mật Khẩu</h2>
      <div className="separator"></div>
      <p className="description">Nhập email để lấy lại mật khẩu</p>
      <form
        action="http://localhost:3000/api/v1/auth/forgotPassword"
        method="post"
        className="forgotpassword-form"
      >
        <div className="input-wrapper">
          <input
            type="email"
            name="email"
            className="input-field"
            placeholder="Nhập địa chỉ email"
          />
        </div>
        <div className="separator"></div>
        <div className="button-form-container">
          <div className="button">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              Hủy
            </button>
            <input type="submit" className="submit-button" value="Tiếp tục" />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
