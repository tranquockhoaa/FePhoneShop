import React from 'react';
import '../../index.css';
import { Outlet, Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  let navigate = useNavigate();

  const [account, setAccount] = useState({
    email: '',
    password: '',
    status: '',
  });

  useEffect(() => {
    console.log('navigate');
    if (account.status == 'true') {
      navigate('/');
    }
  }, [account.status]);

  const handleInput = (event) => {
    setAccount({ ...account, [event.target.name]: event.target.value });
  };

  const getInfoAccount = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:3000/api/v1/user/${account.email}`,
      );
      return res.data.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleOnSubmit = () => {
    event.preventDefault();
    console.log(account.status);
    axios
      .post('http://127.0.0.1:3000/api/v1/auth/login', account)
      .then(async (res) => {
        if (res.data.status === 'success') {
          console.log('Login successful');
          const infoAccount = await getInfoAccount();
          setAccount({ ...infoAccount, status: 'true' });
          const updateAccount = {
            ...infoAccount,
            status: 'true',
            token: res.data.token,
          };
          console.log(res.data.token);
          window.localStorage.setItem('account', JSON.stringify(updateAccount));
        }
      })
      .catch((err) => {
        if (err.response.data) {
          alert(err.response.data.message);
        }
      });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Đăng nhập</h2>
      <form className="login-form" onSubmit={handleOnSubmit}>
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
            <Link to="/login/forgotPassword" className="forgot-pass-link">
              Quên mật khẩu
            </Link>
          </span>
        </div>

        <div>
          <button type="submit" className="login-button">
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
