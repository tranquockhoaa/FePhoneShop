import './ManageAccount.css';
import Header from '../../components/Header';
import InfoAccount from './infoAccount';
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Loggout from './Loggout';
import { useNavigate } from 'react-router-dom';

const ManageAccount = () => {
  const [showLoggoutPopup, setLoggoutPopup] = useState(false);
  const navigate = useNavigate();

  const clickLoggoutPopup = () => {
    setLoggoutPopup(!showLoggoutPopup);
  };

  // useEffect(() => {}, [option]);
  return (
    <div className="manage-container">
      <div className="left-col">
        <div className="block-menu">
          <button className="block-item-menu" name="Home">
            Trang chủ
          </button>

          <button
            className="block-item-menu"
            onClick={() => {
              navigate('infoAccount');
            }}
          >
            Thông tin tài khoản
          </button>

          <button className="block-item-menu" onClick={clickLoggoutPopup}>
            Đăng xuất
          </button>
          {showLoggoutPopup && (
            <Loggout clickLoggoutPopup={clickLoggoutPopup} />
          )}
        </div>
      </div>

      <div className="right-col">
        <Outlet />
      </div>
    </div>
  );
};

export default ManageAccount;
