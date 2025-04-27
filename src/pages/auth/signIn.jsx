import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignIn() {
  const navigate = useNavigate();

  const [account, setAccount] = useState({
    email: '',
    password: '',
    full_name: '',
    gender: '',
    address: '',
    phone_number: '',
    status: '',
  });

  useEffect(() => {
    console.log('useEffect');
    if (account.status == 'true') {
      navigate('/');
    }
  }, [account.status]);

  const handleOnSubmit = () => {
    event.preventDefault();
    console.log(account);
    axios
      .post('http://127.0.0.1:3000/api/v1/auth/signup', account)
      .then((res) => {
        if (res.data.status === 'success') {
          console.log('SignUp successful');
          setAccount({ ...account, status: 'true' });
        }
      })
      .catch((err) => {
        if (err.response.data) {
          alert(err.response.data.message);
        }
      });
  };

  const handleInput = (event) => {
    setAccount({ ...account, [event.target.name]: event.target.value });
  };

  return (
    <div className="sign-in-container">
      <h2 className="sign-in-title">Đăng kí tài khoản</h2>

      <form onSubmit={handleOnSubmit}>
        <div class="input-wrapper">
          <input
            type="email"
            class="input-field"
            onChange={handleInput}
            name="email"
            placeholder="Nhập email"
            required
          />
        </div>

        <div className="input-wrapper">
          <input
            type="password"
            className="input-field"
            onChange={handleInput}
            name="password"
            placeholder="Nhập mật khẩu"
            required
          />
        </div>

        <div className="input-wrapper">
          <input
            type="text"
            className="input-field"
            onChange={handleInput}
            name="full_name"
            placeholder="Nhập họ và tên"
            required
          />
        </div>

        <div className="gender-checkbox">
          <div className="checkbox">
            <input
              type="checkbox"
              id="gender-checkbox-1"
              onChange={handleInput}
              name="gender"
              value="Nam"
            />
            <label for="gender-checkbox-1">Nam</label>
          </div>

          <div className="checkbox">
            <input
              type="checkbox"
              id="gender-checkbox-2"
              onChange={handleInput}
              name="gender"
              value="Nữ"
            />
            <label for="gender-checkbox-1">Nữ</label>
          </div>
        </div>

        <div className="input-wrapper">
          <input
            type="text"
            className="input-field"
            onChange={handleInput}
            name="phone_number"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className="input-wrapper">
          <input
            type="text"
            class="input-field"
            onChange={handleInput}
            name="address"
            placeholder="Nhập địa chỉ"
          />
        </div>

        <div className="input-wrapper">
          <button type="submit" className="submit-button">
            Đăng nhập
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
