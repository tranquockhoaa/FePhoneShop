import React from 'react';
import './accountSetting.css';
import { useState } from 'react';
import { Link, NavLink } from 'react-router';
import ManageAccount from '../manageAccount/ManageAccount';

const AccountSetting = () => {
  const accountInfo = JSON.parse(localStorage.getItem('account'));
  const [manageAccount, setManageAccount] = useState(false);

  const openManageAccount = () => {
    setManageAccount(!manageAccount);
  };
  return (
    <div>
      <div className="header-login-button" onClick={openManageAccount}>
        <div className="login-status">{accountInfo.fullName}</div>
        <NavLink to="manageAccount" className="link-manage-account">
          {' '}
        </NavLink>
      </div>
    </div>
  );
};

export default AccountSetting;
