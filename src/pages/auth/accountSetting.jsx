import React from 'react';
import './accountSetting.css';
import { NavLink } from 'react-router-dom';

const AccountSetting = ({ accountInfo }) => {

  return (
    <div>
      <div className="header-login-button">
        <div className="login-status">{accountInfo.full_name}</div>
        <NavLink
          to="/manageAccount/infoAccount"
          className="link-manage-account"
        ></NavLink>
      </div>
    </div>
  );
};

export default AccountSetting;
