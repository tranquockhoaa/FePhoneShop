import React from "react";
import "../../index.css";
import { Outlet, Link } from "react-router-dom";
import userAxios from "./userAxios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileApiRq } from "../../store/profile/profile.action";

function Login() {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const profile = useSelector((state) => {
    state.profile;
  });
  console.log(profile);
  const [account, setAccount] = useState({
    email: "",
    password: "",
    status: "",
  });

  useEffect(() => {
    if (account.status === "true") {
      // Lấy role từ localStorage sau khi đăng nhập
      const stored = window.localStorage.getItem("account");
      let role = "";
      if (stored) {
        try {
          role = JSON.parse(stored).role;
        } catch {}
      }
      if (role === "admin") navigate("/admin");
      else if (role === "user") navigate("/");
      // Nếu có role khác, có thể bổ sung điều hướng tại đây
    }
  }, [account.status, navigate]);

  const handleInput = (event) => {
    setAccount({ ...account, [event.target.name]: event.target.value });
  };

  const getInfoAccount = async () => {
    console.log("dispatch running");
    dispatch(getUserProfileApiRq());
    console.log(profile);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    userAxios
      .post("http://127.0.0.1:3000/api/v1/auth/login", account)
      .then(async (res) => {
        if (res.data.status === "success") {
          console.log(res);
          window.localStorage.setItem("token", res.data.token);
          const infoAccount = await getInfoAccount();
          setAccount({ ...infoAccount, status: "true" });
          const updateAccount = {
            ...infoAccount,
            status: "true",
            token: res.data.token,
            role: res.data.user?.role || infoAccount.role || "user", // Lưu role
          };
          window.localStorage.setItem("account", JSON.stringify(updateAccount));
        }
      })
      .catch((err) => {
        if (err.response?.data) {
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
        Bạn chưa có tài khoản?{" "}
        <span>
          <Link to="/signIn">Đăng kí ngay</Link>
        </span>
      </div>
    </div>
  );
}

export default Login;
