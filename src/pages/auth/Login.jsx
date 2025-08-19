import React from 'react';
import '../../index.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfileRequest } from '../../store/profile/profile.action';

import { loginApi } from '../../api/profile.api';

function Login() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile);
  const [account, setAccount] = useState({
    email: '',
    password: '',
    status: '',
  });

  useEffect(() => {
    // Lấy role từ localStorage sau khi đăng nhập

    if (profile?.role === 'admin') navigate('/admin');
    else if (profile?.role === 'user') navigate('/');
    // Nếu có role khác, có thể bổ sung điều hướng tại đây
  }, [profile]);

  const handleInput = (event) => {
    setAccount({ ...account, [event.target.name]: event.target.value });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    try {
      const dataLogin = await loginApi(account);
      setAccount({ ...account, status: 'true' });
      window.localStorage.setItem('token', dataLogin.token);
      dispatch(getUserProfileRequest());
      // Handle successful login here if needed
      console.log('Login successful:', dataLogin);
    } catch (error) {
      // todo
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Đăng nhập</h2>
      <form
        className="login-form"
        onSubmit={handleOnSubmit}
      >
        <div className="input-wrapper">
          <input
            type="email"
            onChange={handleInput}
            name="email"
            placeholder="Nhập địa chỉ email"
            className="input-field"
            required
          ></input>
        </div>

        <div className="input-wrapper">
          <input
            type="password"
            onChange={handleInput}
            placeholder="Nhập mật khẩu"
            name="password"
            className="input-field"
            required
          />
        </div>

        <div className="forgot-pass-link">
          <span>
            <Link
              to="/login/forgotPassword"
              className="forgot-pass-link"
            >
              Quên mật khẩu
            </Link>
          </span>
        </div>

        <div>
          <button
            type="submit"
            className="login-button"
          >
            Đăng nhập
          </button>
        </div>
      </form>

      <div className="sign-in">
        Bạn chưa có tài khoản?{' '}
        <span>
          <Link to="/signIn">Đăng kí ngay</Link>
        </span>
      </div>
    </div>
  );
}

export default Login;
