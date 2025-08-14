import React from "react";
import Header from "../components/Header.jsx";
import { Outlet } from "react-router-dom";
import "./MainLayouts.css";
import Footer from "../components/footer.jsx";
const MainLayouts = () => {
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
    </div>
  );
};

export default MainLayouts;
