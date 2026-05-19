import React, { useEffect } from "react";
import Header from "../components/header/Header.jsx";
import { Outlet, useLocation } from "react-router-dom";
import "./MainLayouts.css";
import Footer from "../components/footer/footer.jsx";
import FloatingChatButton from "../components/chat/FloatingChatButton";
import { useDispatch } from "react-redux";

import { getBrandsApiRq } from "../store/brands/brands.action.js";

const MainLayouts = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname?.startsWith("/product-detail/")
    ) {
      dispatch(getBrandsApiRq());
    }
  }, []);

  return (
    <div>
      <div>
        <Header />
      </div>
      <div className="body-container">
        <main>
          <Outlet />
        </main>
      </div>
      <div>
        <Footer />
      </div>
      <FloatingChatButton />
    </div>
  );
};

export default MainLayouts;
