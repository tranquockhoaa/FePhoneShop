import { useState } from "react";
import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./button-gohome.css";
const ButtonGoHome = () => {
  const navigate = useNavigate();
  return (
    <button className="button-go-home" onClick={() => navigate("/")}>
      <HomeOutlined /> Trang chủ
    </button>
  );
};

export default ButtonGoHome;
