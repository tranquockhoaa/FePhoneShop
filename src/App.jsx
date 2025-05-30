import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SingIn from "./pages/auth/signIn";
import NoPage from "./pages/NoPage";
import HomePage from "./pages/home/HomePage";
import ManageAccount from "./pages/manageAccount/ManageAccount";
import MainLayouts from "./layouts/MainLayouts";
import InfoAccount from "./pages/manageAccount/infoAccount";
import Loggout from "./pages/manageAccount/Loggout";
import ProductDetail from "./pages/productDetail/productDetail";
import Table from "./pages/table";
import Cart from "./pages/cart/cart";
// import Xiaomi from './components/homeMenu/Xiaomi';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayouts />}>
          <Route path="/" element={<HomePage />} />
          <Route path="manageAccount" element={<ManageAccount />}>
            <Route path="infoAccount" element={<InfoAccount />}></Route>
            <Route path="loggout" element={<Loggout />}></Route>
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/product-detail/:code" element={<ProductDetail />} />

        <Route path="/login/forgotPassword" element={<ForgotPassword />} />
        <Route path="/signIn" element={<SingIn />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
