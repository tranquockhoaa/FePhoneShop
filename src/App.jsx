import React, { useLayoutEffect, lazy } from "react";
import { ConfigProvider, notification } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import SingIn from "./pages/auth/signIn";
import NoPage from "./pages/NoPage";
import HomePage from "./pages/home/HomePage";
import ManageAccount from "./pages/manageAccount/ManageAccount";
import MainLayouts from "./layouts/MainLayouts";
import InfoAccount from "./pages/manageAccount/InfoAccount";
import Loggout from "./pages/manageAccount/LogoutPopup";
import ProductDetail from "./pages/productDetail/ProductDetail";
import { useDispatch } from "react-redux";

import Cart from "./pages/cart/cart";
import ProductList from "./pages/productList";
import { useParams } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashBoard";
import { getUserProfileRequest } from "./store/profile/profile.action";
import OrderHistory from "./pages/order/OrderHistory";
import OrderDetail from "./pages/order/OrderDetail";
import WarrantyPolicy from "./pages/about/warranty-policy/warranty-policy";
import ShippingPolicy from "./pages/about/shipping-policy/shipping-policy";
import PrivacyPolicy from "./pages/about/privacy-policy/privacy-policy";
import LayoutAdmin from "./layouts/admin";

export const AsyncAdminUsersPage = lazy(() =>
  import("./pages/admin/users/Users")
);

export const AsyncAdminProductsPage = lazy(() =>
  import("./pages/admin/AdminProductList")
);

notification.config({
  placement: "topRight",
});

// import Xiaomi from './components/homeMenu/Xiaomi';

const ProductListWrapper = () => {
  const { brandName } = useParams();
  return <ProductList brandName={brandName} />;
};
const App = () => {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getUserProfileRequest());
    }
  }, []);

  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayouts />}>
            <Route path="/" element={<HomePage />} />
            <Route path="manageAccount" element={<ManageAccount />}>
              <Route path="infoAccount" element={<InfoAccount />}></Route>
              <Route path="loggout" element={<Loggout />}></Route>
            </Route>
            <Route path="/product-detail/:code" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route
              path="/products/:brandName"
              element={<ProductListWrapper />}
            />
            <Route path="/order-lookup" element={<OrderHistory />} />
            <Route path="/order-detail/:orderId" element={<OrderDetail />} />
            <Route path="/chinh-sach-bao-hanh" element={<WarrantyPolicy />} />
            <Route path="/chinh-sach-van-chuyen" element={<ShippingPolicy />} />
            <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />} />
          </Route>

          <Route element={<LayoutAdmin />}>
            {" "}
            <Route path="/admin/users" element={<AsyncAdminUsersPage />} />
            <Route
              path="/admin/products"
              element={<AsyncAdminProductsPage />}
            />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/login/forgotPassword" element={<ForgotPassword />} />
          <Route path="/signIn" element={<SingIn />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
