import React from 'react';
import { createPortal } from 'react-dom';
import './Loggout.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { logoutApi } from '../../api/profile.api';
import { profileAction } from '../../store/profile/profile.store';

const LogoutPopup = ({ clickLogoutPopup }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = async () => {
    try {
      await logoutApi();

      // 3. Xóa dữ liệu localStorage và chuyển hướng
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      dispatch(profileAction.resetProfile());

      localStorage.removeItem('token');
      window.dispatchEvent(new Event('storage')); // Kích hoạt sự kiện để các component khác biết
      clickLogoutPopup(); // Đóng popup
      navigate('/');
    }
  };

  return createPortal(
    <div className="loggout-container">
      <div className="loggout">
        <div className="content">
          <p>Bạn có chắc chắn muốn thoát tài khoản?</p>
          <div className="button-group">
            <button
              className="button"
              onClick={onLogout}
            >
              Có
            </button>
            <button
              className="button"
              onClick={clickLogoutPopup}
            >
              Không
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LogoutPopup;
