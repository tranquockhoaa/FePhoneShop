import React, { useLayoutEffect, lazy } from "react";
import { ConfigProvider, notification } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
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
import WarrantyPolicy from "./pages/about/warranty-policy/warranty-policy";
import ShippingPolicy from "./pages/about/shipping-policy/shipping-policy";
import PrivacyPolicy from "./pages/about/privacy-policy/privacy-policy";
import LayoutAdmin from "./layouts/admin";
import RequireAdmin from "./components/admin/RequireAdmin";
import PaymentResult from "./pages/cart/payment/payment-success";
import AdminOrderList from "./pages/admin/AdminOrderList";
import OrderDetail from "./pages/order/OrderDetail";
import ChangePassword from "./pages/manageAccount/ChangePassword";
import Chat from "./pages/chat/Chat";

export const AsyncAdminUsersPage = lazy(
  () => import("./pages/admin/users/Users"),
);

export const AsyncAdminProductsPage = lazy(
  () => import("./pages/admin/AdminProductList"),
);

export const AsyncAdminProductsDetailsPage = lazy(
  () => import("./pages/admin/AdminProductDetail"),
);

export const AsyncAdminManageBrand = lazy(
  () => import("./pages/admin/pages/manage-brand/index"),
);

notification.config({
  placement: "topRight",
});

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
        <Suspense fallback={null}>
          <Routes>
            <Route element={<MainLayouts />}>
              <Route path="/" element={<HomePage />} />
              <Route path="manageAccount" element={<ManageAccount />}>
                <Route path="infoAccount" element={<InfoAccount />}></Route>
                <Route
                  path="changePassword"
                  element={<ChangePassword />}
                ></Route>
                <Route path="loggout" element={<Loggout />}></Route>
              </Route>
              <Route path="/product-detail/:code" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route
                path="/products/:brandName"
                element={<ProductListWrapper />}
              />
              <Route path="/order-lookup" element={<OrderHistory />} />
              <Route
                path="/order-detail/:orderId"
                element={<OrderDetail />}
              />{" "}
              <Route path="/chinh-sach-bao-hanh" element={<WarrantyPolicy />} />
              <Route
                path="/chinh-sach-van-chuyen"
                element={<ShippingPolicy />}
              />
              <Route path="/chinh-sach-bao-mat" element={<PrivacyPolicy />} />
              <Route path="/payment/success" element={<PaymentResult />} />
              <Route path="/chat" element={<Chat />} />
            </Route>

            <Route
              element={
                <RequireAdmin>
                  <LayoutAdmin />
                </RequireAdmin>
              }
            >
              {" "}
              <Route path="/admin/users" element={<AsyncAdminUsersPage />} />
              <Route
                path="/admin/products"
                element={<AsyncAdminProductsPage />}
              />
              <Route
                path="/admin/product-detail"
                element={<AsyncAdminProductsDetailsPage />}
              />
              <Route
                path="/admin/manage-brands"
                element={<AsyncAdminManageBrand />}
              />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrderList />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/login/forgotPassword" element={<ForgotPassword />} />
            <Route path="/signIn" element={<SingIn />} />
            <Route path="*" element={<NoPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
