import React from 'react';
import './Loggout.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Loggout = ({ clickLoggoutPopup }) => {
  const navigate = useNavigate();
  const accountInfo = JSON.parse(localStorage.getItem('account'));

  const onLoggout = async () => {
    try {
      const res = await axios.post(
        'http://127.0.0.1:3000/api/v1/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${accountInfo.token}`,
          },
        },
      );

      console.log(res.data.message);
      localStorage.removeItem('account');
      clickLoggoutPopup();
      window.dispatchEvent(new Event('accountChange'));
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="loggout-container">
      <div className="loggout">
        <div className="content">
          <p>Bạn có chắc chắn muốn thoát tài khoản?</p>
          <div className="button-group">
            <button className="button" onClick={onLoggout}>
              Có
            </button>
            <button className="button" onClick={clickLoggoutPopup}>
              Không
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loggout;
